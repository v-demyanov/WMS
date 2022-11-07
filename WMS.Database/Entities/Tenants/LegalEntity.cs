namespace WMS.Database.Entities.Tenants;

public class LegalEntity : BaseEntity
{
    public string Name { get; set; } = default!;

    public string UNN { get; set; } = default!;

    public int TenantId { get; set; }

    public Tenant Tenant { get; set; } = default!;
}
