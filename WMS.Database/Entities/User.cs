namespace WMS.Database.Entities;

using WMS.Database.Enums;

public class User : BaseEntity
{
    public string FirstName { get; set; } = default!;

    public string LastName { get; set; } = default!;

    public string? Email { get; set; }

    public Role Role { get; set; }

    public ICollection<Task> PerformerTasks { get; } = new HashSet<Task>();

    public ICollection<Task> AuthorTasks { get; } = new HashSet<Task>();

    public ICollection<Task> AuditorTasks { get; } = new HashSet<Task>();

    public ICollection<Comment> Comments { get; } = new HashSet<Comment>();
}
