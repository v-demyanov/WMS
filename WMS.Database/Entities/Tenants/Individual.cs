namespace WMS.Database.Entities.Tenants;

public class Individual : BaseEntity
{
    public string FirstName { get; set; } = default!;

    public string SurName { get; set; } = default!;

    public string LastName { get; set; } = default!;

    public string PassportNumber { get; set; } = default!;

    public int TenantId { get; set; }

    public Tenant Tenant { get; set; } = default!;
}
