namespace WMS.Core.Validators;

using FluentValidation;

using WMS.Database;
using WMS.Database.Entities;

public class WareValidator : AbstractValidator<Ware>
{
    public WareValidator(WmsDbContext dbContext, AddressValidator addressValidator)
    {
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
    }
}
