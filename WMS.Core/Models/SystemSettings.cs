namespace WMS.Core.Models;

public record SystemSettings
{
    public int ProblemExpirationNotificationDays { get; init; }

    public int ShippedWaresStorageDays { get; init; }
}