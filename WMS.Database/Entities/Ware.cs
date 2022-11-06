namespace WMS.Database.Entities;

using WMS.Database.Entities.Dictionaries;

public class Ware : BaseEntity
{
    public string Name { get; set; } = default!;

    public string? Description { get; set; }

    public string? ImagePath { get; set; }

    public decimal TechnicalParameterValue { get; set; } = default!;

    public int UnitOfMeasurementId { get; set; }

    public UnitOfMeasurement UnitOfMeasurement { get; set; } = default!;
}
