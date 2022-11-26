namespace WMS.Database.Entities.Tenants;

public class Individual : Tenant
{
    public string FirstName { get; set; } = default!;

    public string SurName { get; set; } = default!;

    public string LastName { get; set; } = default!;

    public string PassportNumber { get; set; } = default!;
}
