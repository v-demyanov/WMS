namespace WMS.Core.Helpers;

using WMS.Database.Entities;

public static class WareHelper
{
    public static void Populate(Ware destination, Ware source)
    {
        destination.Name = source.Name;
        destination.Description = source.Description;
        destination.LegalEntityId = source.LegalEntityId;
        destination.AddressId = source.AddressId;
        destination.IndividualId = source.IndividualId;
        destination.ImagePath = source.ImagePath;
        destination.UnitOfMeasurementId = source.UnitOfMeasurementId;
        destination.TechnicalParameterValue = source.TechnicalParameterValue;
    }
}
