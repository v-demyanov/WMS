namespace WMS.Core.Models;

using WMS.Database.Entities;

public record CommentRecord
{
    public int Id { get; set; }
    
    public string? Message { get; set; }

    public DateTimeOffset CreatedDate { get; set; }

    public int OwnerId { get; set; }

    public int ProblemId { get; set; }

    public UserRecord Owner { get; set; } = default!;
    
    public Problem Problem { get; set; } = default!;
}