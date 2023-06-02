namespace WMS.Core.Services;

using Microsoft.EntityFrameworkCore;

using WMS.Core.Services.Abstractions;
using WMS.Core.Models.Templates;

public class NotificationService : INotificationService
{
    private readonly IMailService _mailService;
    private readonly IProblemService _problemService;
    private readonly IUserService _userService;
    private readonly ITemplateService _templateService;
    private readonly ISettingService _settingService;

    public NotificationService(
        IMailService mailService, 
        IProblemService problemService,
        IUserService userService,
        ITemplateService templateService,
        ISettingService settingService)
    {
        this._mailService = mailService;
        this._problemService = problemService;
        this._userService = userService;
        this._templateService = templateService;
        this._settingService = settingService;
    }
    
    public async Task NotifyAboutProblemExpirationAsync()
    {
        var systemSettings = await this._settingService.GetSystemSettingsAsync();
        var today = DateTime.UtcNow.Date;
        var notificationDate = today.AddDays(systemSettings.ProblemExpirationNotificationDays);

        var expiredProblems = this._problemService
            .GetAll()
            .Include(x => x.Author)
            .AsEnumerable()
            .Where(x => x.DeadlineDate.HasValue && x.DeadlineDate.Value.Date <= notificationDate)
            .ToList();

        if (!expiredProblems.Any())
        {
            return;
        }

        var authorGroups = expiredProblems.GroupBy(x => x.Author);
        foreach (var group in authorGroups)
        {
            var problemExpirationObjects = new List<ProblemExpirationObject>();
            foreach (var expiredProblem in group)
            {
                if (!expiredProblem.DeadlineDate.HasValue)
                {
                    continue;
                }
                problemExpirationObjects.Add(new ProblemExpirationObject()
                {
                    Title = expiredProblem.Title,
                    DaysBeforeExpiration = (expiredProblem.DeadlineDate.Value.Date - today).Days,
                    DeadlineDate = expiredProblem.DeadlineDate.Value.Date,
                });
            }
            
            var problemExpirationObjectsModel = new ProblemExpirationObjectsModel(problemExpirationObjects);
            var body = await this._templateService.CompileTemplateAsync("ProblemExpiration.cshtml", problemExpirationObjectsModel);
                
            this._mailService.SendMail(
                body, 
                "Уведомление об истечении срока выполнения задач", 
                new [] { group.Key.Email });
        }
    }
}