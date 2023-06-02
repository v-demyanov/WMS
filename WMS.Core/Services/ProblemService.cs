namespace WMS.Core.Services;

using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;
using FluentValidation;

using WMS.Core.Exceptions;
using WMS.Core.Helpers;
using WMS.Core.Models.Templates;
using WMS.Core.Services.Abstractions;
using WMS.Core.Validators;
using WMS.Database;
using WMS.Database.Entities;
using WMS.Database.Enums;

public class ProblemService : BaseService<Problem>, IProblemService
{
    private readonly IMailService _mailService;
    private readonly ITemplateService _templateService;
    private readonly IUserService _userService;
    private readonly ProblemValidator _problemValidator;

    public ProblemService(
        WmsDbContext dbContext,
        IMailService mailService,
        ITemplateService templateService,
        IUserService userService,
        ProblemValidator problemValidator) : base(dbContext)
    {
        this._mailService = mailService;
        this._templateService = templateService;
        this._userService = userService;
        this._problemValidator = problemValidator;
    }

    public async Task UpdateStatusAsync(ProblemStatus status, int problemId)
    {
        var problem = this.GetWithLinkedEntities(problemId);
        if (problem == null)
        {
            throw new EntityNotFoundException($"Can't update problem's status, " + 
                "because it doesn't exist.");
        }

        var currentUser = this._userService.GetCurrentUser();
        if (currentUser is not null && status == ProblemStatus.Done && !CanUserSetDoneStatus(currentUser))
        {
            throw new AuthorizationFailedException($"Can't set status {status}, " +
                "because user doesn't have permissions.");
        }

        var oldStatus = problem.Status;
        problem.Status = status;

        if (status == ProblemStatus.Done)
        {
            this.UpdateWareAddress(problem);
        }

        _ = await this.DbContext.SaveChangesAsync();

        var templateName = "ProblemStatus.cshtml";
        var subject = $"Статус задачи #{problem.Id} '{problem.Title}'";

        var body = await this._templateService.CompileTemplateAsync(templateName, new ProblemStatusModel
        {
            TaskId = problem.Id,
            TaskTitle = problem.Title,
            PreviousStatus = oldStatus.ToString(),
            CurrentStatus = problem.Status.ToString(),
        });
        this._mailService.SendMail(body, subject, GetReceivers(problem));
    }

    public override async Task DeleteAsync(int id)
    {
        var currentUser = this._userService.GetCurrentUser();
        var problemToDelete = this.DbSet
            .FirstOrDefault(x => x.Id == id);

        if (problemToDelete == null)
        {
            throw new EntityNotFoundException($"Can't delete problem with Id = {id}, because it doesn't exist.");
        }

        if (problemToDelete.AuthorId != currentUser?.Id)
        {
            throw new AuthorizationFailedException($"Can't delete problem with Id = {id}, because it belongs to another user.");
        }

        var problemsToDelete = await this.GetChildProblemsAsync(problemToDelete.Id);
        problemsToDelete.Add(problemToDelete);

        this.DbSet.RemoveRange(problemsToDelete);

        _ = await this.DbContext.SaveChangesAsync();
    }

    public async Task AssignAsync(int problemId, int? userId)
    {
        User? user = default;
        if (userId.HasValue)
        {
            user = this._userService.GetById(userId.Value);
        }
        
        if (user is null && userId is not null)
        {
            throw new EntityNotFoundException("Can't assign problem, because user doesn't exist.");
        }
        
        var problem = await this.GetById(problemId).FirstOrDefaultAsync();
        if (problem is null)
        {
            throw new ApiOperationFailedException("Can't assign problem, because it doesn't exist.");
        }
        
        problem.PerformerId = userId;
        _ = await this.DbContext.SaveChangesAsync();
    }

    public override async Task UpdateAsync(int id, Problem entityUpdateData)
    {
        entityUpdateData.Id = id;
        await this.ValidateAsync(entityUpdateData);
        
        var problem = this.DbSet
            .FirstOrDefault(x => x.Id == id);
        if (problem == null)
        {
            throw new EntityNotFoundException("Can't update problem, because it doesn't exist.");
        }

        var currentUser = this._userService.GetCurrentUser();
        if (currentUser?.Id != problem.AuthorId)
        {
            throw new AuthorizationFailedException("Can't update problem, because it belongs to another user.");
        }

        ProblemHelper.Populate(problem, entityUpdateData);
        _ = await this.DbContext.SaveChangesAsync();
    }
    
    public async Task<List<Problem>> GetChildProblemsAsync(int problemId)
    {
        var childProblems = await this.DbSet
            .Where(x => x.ParentProblemId == problemId)
            .ToListAsync();

        var allChildProblems = new List<Problem>();
        foreach (var childProblem in childProblems)
        {
            allChildProblems.Add(childProblem);

            var problems = await GetChildProblemsAsync(childProblem.Id);
            allChildProblems.AddRange(problems);
        }

        return allChildProblems;
    }

    protected override AbstractValidator<Problem>? GetValidator() => this._problemValidator;

    protected override void Update(Problem entity, Problem entityUpdateData)
    {
        throw new NotImplementedException();
    }

    private static bool CanUserSetDoneStatus(User user) =>
        user.Role == Role.Auditor;

    private void UpdateWareAddress(Problem problem)
    {
        if (problem.TargetShelfId is null || problem.Ware is null)
        {
            return;
        }

        problem.Ware.ShelfId = problem.TargetShelfId;
    }

    private static string[] GetReceivers(Problem problem)
    {
        var emails = new List<string> { problem.Author.Email };

        if (problem.Auditor != null)
        {
            emails.Add(problem.Auditor.Email);
        }

        if (problem.Performer != null)
        {
            emails.Add(problem.Performer.Email);
        }

        return emails.ToArray();
    }

    private Problem? GetWithLinkedEntities(int problemId) => this.DbContext.Problems
        .Include(x => x.TargetShelf)
        .Include(x => x.Auditor)
        .Include(x => x.Author)
        .Include(x => x.Performer)
        .Include(x => x.Ware)
        .FirstOrDefault(x => x.Id == problemId);
}
