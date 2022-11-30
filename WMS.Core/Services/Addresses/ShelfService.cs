namespace WMS.Core.Services.Addresses;

using WMS.Core.Services.Abstractions.Addresses;
using WMS.Database;
using WMS.Database.Entities.Addresses;

public class ShelfService : BaseService<Shelf>, IShelfService
{
    public ShelfService(WmsDbContext dbContext) : base(dbContext)
    {
    }

    protected override void Update(Shelf entity, Shelf entityUpdateData)
    {
        entity.VerticalSectionId = entityUpdateData.VerticalSectionId;
    }
}
