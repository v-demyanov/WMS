namespace WMS.Database.Entities;

using WMS.Database.Entities.Addresses;
using WMS.Database.Entities.Tenants;
using WMS.Database.Enums;

public class Ware : BaseEntity
{
    public string Name { get; set; } = default!;

    public string? Description { get; set; }

    public string? ImagePath { get; set; }

    public int? AddressId { get; set; }

    public int? IndividualId { get; set; }

    public int? LegalEntityId { get; set; }
    
    public DateTimeOffset ReceivingDate { get; set; }

    public DateTimeOffset? ShippingDate { get; set; }

    public WareStatus Status { get; set; }

    public Address? Address { get; set; }

    public Individual? Individual { get; set; }

    public LegalEntity? LegalEntity { get; set; }

    public ICollection<Problem> Problems { get; } = new HashSet<Problem>();
}
