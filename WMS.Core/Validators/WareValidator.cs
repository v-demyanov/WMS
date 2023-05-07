namespace WMS.Core.Validators;

using FluentValidation;

using WMS.Database;
using WMS.Database.Entities;

public class WareValidator : AbstractValidator<Ware>
{
    private readonly WmsDbContext _dbContext;

    public WareValidator(WmsDbContext dbContext)
    {
        this._dbContext = dbContext;

        this.RuleFor(ware => ware.IndividualId)
            .Must(individualId => individualId is null || dbContext.Individuals.Any(x => x.Id == individualId))
            .WithMessage("The individual with such id has not been found.");

        this.RuleFor(ware => ware.LegalEntityId)
            .Must(legalEntityId => legalEntityId is null || dbContext.LegalEntities.Any(x => x.Id == legalEntityId))
            .WithMessage("The legal entity with such id has not been found.");

        this.RuleFor(ware => ware)
            .Must(ware => ware.ShelfId == null || !this.IsShelfTaken(ware.Id, ware.ShelfId))
            .WithMessage("The shelf has been already taken.");
    }
    
    private bool IsShelfTaken(int wareId, int? shelfId) => 
        this._dbContext.Wares
            .Any(x => x.ShelfId == shelfId && x.Id != wareId);
}
