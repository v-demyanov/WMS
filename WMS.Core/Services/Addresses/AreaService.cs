namespace WMS.Core.Services.Addresses;

using WMS.Core.Services.Abstractions.Addresses;
using WMS.Database;
using WMS.Database.Entities.Addresses;

public class AreaService : BaseService<Area>, IAreaService
{
    public AreaService(WmsDbContext dbContext) : base(dbContext)
    {
    }

    protected override void Update(Area entity, Area entityUpdateData)
    {
        entity.Name = entityUpdateData.Name;
    }
}
