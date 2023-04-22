namespace WMS.Database.SeedData.Models;

using WMS.Database.Enums;

public class UserCsv
{
    public int Id { get; set; }

    public string FirstName { get; set; } = string.Empty;

    public string LastName { get; set; } = string.Empty;

    public string Email { get; set; } = string.Empty;

    public Role Role { get; set; }

    public string InitialPassword { get; set; } = string.Empty;
}