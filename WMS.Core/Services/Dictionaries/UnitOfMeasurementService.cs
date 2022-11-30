namespace WMS.Core.Services.Dictionaries;

using WMS.Core.Services.Abstractions.Dictionaries;
using WMS.Database;
using WMS.Database.Entities.Dictionaries;

public class UnitOfMeasurementService : BaseService<UnitOfMeasurement>, IUnitOfMeasurementService
{
    public UnitOfMeasurementService(WmsDbContext dbContext) : base(dbContext)
    {
    }

    protected override void Update(UnitOfMeasurement entity, UnitOfMeasurement entityUpdateData)
    {
        entity.Value = entityUpdateData.Value;
    }
}
