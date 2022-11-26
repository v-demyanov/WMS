namespace WMS.Database.Entities.Tenants;

public class LegalEntity : Tenant
{
    public string Name { get; set; } = default!;

    public string UNN { get; set; } = default!;
}
