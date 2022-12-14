namespace WMS.Core.Models.Templates;

public record ProblemStatusModel
{
    public int TaskId { get; set; }

    public string TaskTitle { get; set; } = string.Empty;

    public string PreviousStatus { get; set; } = string.Empty;

    public string CurrentStatus { get; set; } = string.Empty;
}
