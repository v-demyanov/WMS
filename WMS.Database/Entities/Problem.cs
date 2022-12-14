namespace WMS.Database.Entities;

using WMS.Database.Entities.Addresses;
using WMS.Database.Enums;

public class Problem : BaseEntity
{
    public string Title { get; set; } = default!;

    public string? Description { get; set; }

    public ProblemStatus Status { get; set; } = ProblemStatus.ToDo;

    public DateTimeOffset CreatedDate { get; set; }

    public DateTimeOffset? LastUpdateDate { get; set; }

    public int? PerformerId { get; set; }

    public int? ParentProblemId { get; set; }

    public int AuthorId { get; set; }

    public int? AuditorId { get; set; }

    public int? WareId { get; set; }

    public int? TargetAddressId { get; set; }

    public Problem? ParentProblem { get; set; }

    public User? Performer { get; set; }

    public User Author { get; set; } = default!;

    public User? Auditor { get; set; }

    public Ware? Ware { get; set; }

    public Address? TargetAddress { get; set; }

    public ICollection<Problem> ChildrenProblems { get; } = new HashSet<Problem>();

    public ICollection<Comment> Comments { get; } = new HashSet<Comment>();
}
