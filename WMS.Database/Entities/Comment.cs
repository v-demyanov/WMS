namespace WMS.Database.Entities;

public class Comment : BaseEntity
{
    public string? Message { get; set; }

    public DateTimeOffset CreatedDate { get; set; }

    public int OwnerId { get; set; }

    public int ProblemId { get; set; }

    public User Owner { get; set; } = default!;

    public Problem Problem { get; set; } = default!;
}
