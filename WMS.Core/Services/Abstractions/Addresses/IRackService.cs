namespace WMS.Core.Services.Abstractions.Addresses;

using WMS.Core.Models;
using WMS.Database.Entities.Addresses;

public interface IRackService : IBaseService<Rack>
{
    Task<Rack> GenerateAsync(RackCreateData rackCreateData);
}
