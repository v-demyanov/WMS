namespace WMS.Core.Services.Abstractions;

using WMS.Database.Entities;
using WMS.Database.Entities.Addresses;

public interface IWareService : IBaseService<Ware>
{
    Task SoftDelete(int wareId);
    
    Task Restore(int wareId, Address address);
}
