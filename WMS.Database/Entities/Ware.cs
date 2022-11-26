namespace WMS.Database.Entities;

using WMS.Database.Entities.Dictionaries;
using WMS.Database.Entities.Addresses;
using WMS.Database.Entities.Tenants;

public class Ware : BaseEntity
{
    public string Name { get; set; } = default!;

    public string? Description { get; set; }

    public string? ImagePath { get; set; }

    public decimal TechnicalParameterValue { get; set; } = default!;

    public int UnitOfMeasurementId { get; set; }

    public int AddressId { get; set; }

    public int? IndividualId { get; set; }

    public int? LegalEntityId { get; set; }

    public UnitOfMeasurement UnitOfMeasurement { get; set; } = default!;

    public Address Address { get; set; } = default!;

    public Individual? Individual { get; set; }

    public LegalEntity? LegalEntity { get; set; }

    public ICollection<WareTask> Tasks { get; } = new HashSet<WareTask>();
}
