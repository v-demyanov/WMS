namespace WMS.Core.Services;

using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

using WMS.Core.Exceptions;
using WMS.Core.Models.Templates;
using WMS.Core.Services.Abstractions;
using WMS.Database;
using WMS.Database.Entities;
using WMS.Database.Enums;

public class ProblemService : BaseService<Problem>, IProblemService
{
    private readonly IMailService _mailService;
    private readonly ITemplateService _templateService;
    private readonly IAuthService _authService;
    private readonly IUserService _userService;

    public ProblemService(
        WmsDbContext dbContext,
        IMailService mailService,
        ITemplateService templateService,
        IUserService userService,
        IAuthService authService) : base(dbContext)
    {
        this._mailService = mailService;
        this._templateService = templateService;
        this._userService = userService;
        this._authService = authService;
    }

    public async Task UpdateStatusAsync(ProblemStatus status, int problemId)
    {
        var problem = this.GetWithLinkedEntities(problemId);
        if (problem == null)
        {
            throw new EntityNotFoundException($"Can't delete problem with Id = {problemId}, " + 
                "because it doesn't exist.");
        }

        var currentUser = this._authService.GetCurrentUser();
        if (currentUser is null || (status == ProblemStatus.Done && !CanUserSetDoneStatus(currentUser)))
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
        var currentUser = this._authService.GetCurrentUser();
        var problemToDelete = this.DbSet
            .FirstOrDefault(x => x.Id == id);

        if (problemToDelete == null)
        {
            throw new EntityNotFoundException($"Can't delete problem with Id = {id}, because it doesn't exist.");
        }

        if (problemToDelete.AuthorId != currentUser.Id)
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
            throw new EntityNotFoundException($"Can't assign problem, because user with Id = {userId} doesn't exist.");
        }
        
        var problem = this.GetById(problemId);
        problem.PerformerId = userId;

        _ = await this.DbContext.SaveChangesAsync();
    }

    protected override void Update(Problem entity, Problem entityUpdateData)
    {
        throw new NotImplementedException();
    }

    private async Task<List<Problem>> GetChildProblemsAsync(int problemId)
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

    private static bool CanUserSetDoneStatus(User user) =>
        user.Role == Role.Auditor;

    private void UpdateWareAddress(Problem problem)
    {
        if (problem.TargetAddress == null || problem.Ware == null)
        {
            return;
        }

        var oldAddress = problem.Ware!.Address;
        problem.Ware!.Address = problem.TargetAddress;
        problem.TargetAddressId = null;

        if (problem.TargetAddress?.Id != oldAddress.Id)
        {
            this.DbContext.Addresses.Remove(oldAddress);
        }
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
        .Include(x => x.TargetAddress)
        .Include(x => x.Auditor)
        .Include(x => x.Author)
        .Include(x => x.Performer)
        .Include(x => x.Ware)
            .ThenInclude(ware => ware.Address)
        .FirstOrDefault(x => x.Id == problemId);
}
