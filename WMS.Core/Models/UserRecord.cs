namespace WMS.Core.Models;

using WMS.Database.Enums;

public record UserRecord
{
    public int Id { get; set; }

    public string FirstName { get; set; } = string.Empty;

    public string LastName { get; set; } = string.Empty;

    public string Email { get; set; } = string.Empty;

    public Role Role { get; set; }
}
