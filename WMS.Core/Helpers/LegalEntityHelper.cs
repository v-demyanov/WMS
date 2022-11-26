namespace WMS.Core.Helpers;

using WMS.Database.Entities.Tenants;

public static class LegalEntityHelper
{
    public static void Populate(LegalEntity destination, LegalEntity source)
    {
        destination.Name = source.Name;
        destination.Type = source.Type;
        destination.Phone = source.Phone;
        destination.Address = source.Address;
        destination.UNN = source.UNN;
    }
}
