namespace WMS.Core.Models.Templates;

public class ProblemExpirationObject
{
    public string Title { get; set; } = string.Empty;

    public DateTimeOffset DeadlineDate { get; set; }

    public int DaysBeforeExpiration { get; set; }
}