namespace WMS.Database.Entities;

public class Task : BaseEntity
{
    public string Title { get; set; } = default!;

    public string? Description { get; set; }

    public Enums.TaskStatus Status { get; set; } = Enums.TaskStatus.ToDo;

    public DateTimeOffset CreatedDate { get; set; }

    public DateTimeOffset? LastUpdateDate { get; set; }

    public int? PerformerId { get; set; }

    public int? ParentTaskId { get; set; }

    public int AuthorId { get; set; }

    public int? AuditorId { get; set; }

    public Task? ParentTask { get; set; }

    public User? Performer { get; set; }

    public User Author { get; set; } = default!;

    public User? Auditor { get; set; }

    public ICollection<Task> ChildTasks { get; } = new HashSet<Task>();

    public ICollection<Comment> Comments { get; } = new HashSet<Comment>();
}
