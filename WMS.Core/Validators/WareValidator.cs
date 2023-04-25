namespace WMS.Core.Validators;

using FluentValidation;
using Microsoft.EntityFrameworkCore;

using WMS.Database;
using WMS.Database.Entities;

public class WareValidator : AbstractValidator<Ware>
{
    private readonly WmsDbContext _dbContext;

    public WareValidator(WmsDbContext dbContext, AddressValidator addressValidator)
    {
        this._dbContext = dbContext;

        this.RuleFor(ware => ware.Address)
            .SetValidator(addressValidator);

        this.RuleFor(ware => ware.IndividualId)
            .Must(individualId => individualId is null || dbContext.Individuals.Any(x => x.Id == individualId))
            .WithMessage("The individual with such id has not been found.");

        this.RuleFor(ware => ware.LegalEntityId)
            .Must(legalEntityId => legalEntityId is null || dbContext.LegalEntities.Any(x => x.Id == legalEntityId))
            .WithMessage("The legal entity with such id has not been found.");

        this.RuleFor(ware => ware.UnitOfMeasurementId)
            .Must(unitOfMeasurementId => dbContext.UnitsOfMeasurement.Any(x => x.Id == unitOfMeasurementId))
            .WithMessage("The unit of measurement with such id has not been found.");
        
        this.RuleFor(ware => ware)
            .Must(ware => ware.Address?.ShelfId is null || this.IsShelfNotTaken(ware.Id, ware.Address.AreaId, ware.Address.ShelfId))
            .WithMessage("The shelf is already taken.");
    }
    
    private bool IsShelfNotTaken(int wareId, int areaId, int? shelfId)
    {
        if (shelfId is null)
        {
            return true;
        }

        var addresses = this._dbContext.Addresses.Include(x => x.Ware);
        var exists = addresses.Any(x => x.AreaId == areaId && x.ShelfId == shelfId && x.Ware.Id != wareId);

        return !exists;
    }
}
