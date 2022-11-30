namespace WMS.Core.Services.Addresses;

using WMS.Core.Services.Abstractions.Addresses;
using WMS.Database;
using WMS.Database.Entities.Addresses;

public class VerticalSectionService : BaseService<VerticalSection>, IVerticalSectionService
{
    public VerticalSectionService(WmsDbContext dbContext) : base(dbContext)
    {
    }

    protected override void Update(VerticalSection entity, VerticalSection entityUpdateData)
    {
        entity.RackId = entityUpdateData.RackId;
    }
}
