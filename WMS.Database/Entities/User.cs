namespace WMS.Database.Entities;

using WMS.Database.Enums;

public class User : BaseEntity
{
    public string FirstName { get; set; } = default!;

    public string LastName { get; set; } = default!;

    public string Email { get; set; } = default!;

    public string Password { get; set; } = default!;

    public string Salt { get; set; } = default!;

    public string? RefreshToken { get; set; }

    public string? RefreshTokenSalt { get; set; }

    public string? AvatarUrl { get; set; }

    public Role Role { get; set; }

    public ICollection<Problem> PerformerProblems { get; } = new HashSet<Problem>();

    public ICollection<Problem> AuthorProblems { get; } = new HashSet<Problem>();

    public ICollection<Problem> AuditorProblems { get; } = new HashSet<Problem>();

    public ICollection<Comment> Comments { get; } = new HashSet<Comment>();
}
