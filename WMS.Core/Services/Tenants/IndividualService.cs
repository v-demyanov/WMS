namespace WMS.Core.Services.Tenants;

using WMS.Core.Services.Abstractions.Tenants;
using WMS.Database;
using WMS.Database.Entities.Tenants;

public class IndividualService : BaseService<Individual>, IIndividualService
{
    public IndividualService(WmsDbContext dbContext) : base(dbContext)
    {
    }

    protected override void Update(Individual entity, Individual entityUpdateData)
    {
        throw new NotImplementedException();
    }
}
