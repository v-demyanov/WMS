namespace WMS.Core.Helpers;

using WMS.Database.Entities.Addresses;

public static class AddressHelper
{
    public static bool DoesNewAddressEqualOrigin(Address? newAddress, Address? originAddress)
    {
        return newAddress?.ShelfId == originAddress?.ShelfId &&
               newAddress?.AreaId == originAddress?.AreaId;
    }
}