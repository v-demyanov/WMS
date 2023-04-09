namespace WMS.Core.Services;

using Microsoft.Extensions.Options;

using WMS.Core.Services.Abstractions;
using WMS.Core.Models;
using WMS.Database.Enums;
using WMS.Core.Models.Templates;

public class NotificationService : INotificationService
{
    private readonly NotificationSettings _notificationSettings;
    private readonly IMailService _mailService;
    private readonly IProblemService _problemService;
    private readonly IUserService _userService;
    private readonly ITemplateService _templateService;

    public NotificationService(
        IOptions<NotificationSettings> notificationSettings,
        IMailService mailService, 
        IProblemService problemService,
        IUserService userService,
        ITemplateService templateService)
    {
        this._mailService = mailService;
        this._notificationSettings = notificationSettings.Value;
        this._problemService = problemService;
        this._userService = userService;
        this._templateService = templateService;
    }
    
    public async Task NotifyAboutProblemExpirationAsync()
    {
        var today = DateTime.UtcNow.Date;
        var expirationDate = today.AddDays(this._notificationSettings.ProblemExpirationNotificationDays);

        var expiredProblems = this._problemService
            .GetAll()
            .Where(x => x.DeadlineDate.HasValue && x.DeadlineDate.Value.Date == expirationDate);

        if (!expiredProblems.Any())
        {
            return;
        }

        var problemExpirationObjects = new List<ProblemExpirationObject>();
        foreach (var problem in expiredProblems)
        {
            problemExpirationObjects.Add(new ProblemExpirationObject()
            {
                Title = problem.Title,
                DaysBeforeExpiration = this._notificationSettings.ProblemExpirationNotificationDays,
                DeadlineDate = expirationDate,
            });
        }

        var problemExpirationObjectsModel = new ProblemExpirationObjectsModel(problemExpirationObjects);
        var body = await this._templateService.CompileTemplateAsync("ProblemExpiration.cshtml", problemExpirationObjectsModel);

        var userEmails = this._userService
            .GetAll()
            .Where(x => x.Role == Role.Administrator)
            .Select(x => x.Email);
        
        this._mailService.SendMail(
            body, 
            "Уведомление об истечении срока выполнения задач", 
            userEmails);
    }
}