namespace WMS.Core.Services.Abstractions;

public interface INotificationService
{
    Task NotifyAboutProblemExpirationAsync();
}