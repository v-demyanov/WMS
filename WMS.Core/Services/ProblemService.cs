namespace WMS.Core.Services;

using Microsoft.AspNetCore.Http;
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
    private readonly IHttpContextAccessor _httpContextAccessor;
    private readonly IUserService _userService;
    private readonly IMailService _mailService;
    private readonly ITemplateService _templateService;

    public ProblemService(
        WmsDbContext dbContext,
        IHttpContextAccessor httpContextAccessor,
        IMailService mailService,
        ITemplateService templateService,
        IUserService userService) : base(dbContext)
    {
        this._httpContextAccessor = httpContextAccessor;
        this._mailService = mailService;
        this._templateService = templateService;
        this._userService = userService;
    }

    public async Task UpdateStatusAsync(ProblemStatus status, int problemId)
    {
        var problem = this.DbContext.Problems
                .Include(x => x.TargetAddress)
                .Include(x => x.Auditor)
                .Include(x => x.Performer)
                .Include(x => x.Ware)
                    .ThenInclude(ware => ware.Address)
                .FirstOrDefault(x => x.Id == problemId);
        if (problem == null)
        {
            throw new EntityNotFoundException($"Can't delete problem with Id = {problemId}, " + 
                "because it doesn't exist.");
        }

        var identity = this._httpContextAccessor.HttpContext?.User.Identity;
        var currentUser = this._userService.GetByEmail(identity.Name);
        if (currentUser is null || (status == ProblemStatus.Done && CanUserSetDoneStatus(currentUser)))
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

        _ = await this.DbContext.SaveChangesAsync();
    }

    protected override void Update(Problem entity, Problem entityUpdateData)
    {
        throw new NotImplementedException();
    }

    private static bool CanUserSetDoneStatus(User user) =>
        user.Role != Role.Auditor && user.Role != Role.Administrator;

    private void UpdateWareAddress(Problem problem)
    {
        if (problem.TargetAddress != null && problem.Ware != null)
        {
            var oldAddress = problem.Ware!.Address;
            problem.Ware!.Address = problem.TargetAddress;

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
}
