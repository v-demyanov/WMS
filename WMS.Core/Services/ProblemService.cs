namespace WMS.Core.Services;

using WMS.Core.Services.Abstractions;
using WMS.Database;
using WMS.Database.Entities;

public class ProblemService : BaseService<Problem>, IProblemService
{
    public ProblemService(WmsDbContext dbContext) : base(dbContext)
    {
    }

    protected override void Update(Problem entity, Problem entityUpdateData)
    {
        throw new NotImplementedException();
    }
}
