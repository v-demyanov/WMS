namespace WMS.Core.Services.Addresses;

using FluentValidation;

using WMS.Core.Services.Abstractions.Addresses;
using WMS.Core.Validators;
using WMS.Database;
using WMS.Database.Entities.Addresses;

public class AreaService : BaseService<Area>, IAreaService
{
    private readonly AreaValidator _areaValidator;

    public AreaService(WmsDbContext dbContext, AreaValidator areaValidator) : base(dbContext)
    {
        this._areaValidator = areaValidator;
    }

    protected override void Update(Area entity, Area entityUpdateData)
    {
        entity.Name = entityUpdateData.Name;
    }
    
    protected override AbstractValidator<Area>? GetValidator() => this._areaValidator;
}
