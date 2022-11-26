namespace WMS.Core.Validators;

using FluentValidation;

using WMS.Database;
using WMS.Database.Entities.Tenants;
using WMS.Database.Enums;

public class LegalEntityValidator : AbstractValidator<LegalEntity>
{
    public LegalEntityValidator(WmsDbContext dbContext)
    {
        this.RuleFor(legalEntity => legalEntity.Name)
            .Must((legalEntity, name) => !dbContext.LegalEntities.Any(x => x.Name == name && x.Id != legalEntity.Id))
            .WithMessage("The name must be unique.");

        this.RuleFor(legalEntity => legalEntity.Name)
            .NotEmpty();

        this.RuleFor(legalEntity => legalEntity.UNN)
            .Must((legalEntity, unn) => !dbContext.LegalEntities.Any(x => x.UNN == unn && x.Id != legalEntity.Id))
            .WithMessage("The UNN must be unique.");

        this.RuleFor(legalEntity => legalEntity.UNN)
            .NotEmpty();

        this.RuleFor(legalEntity => legalEntity.Phone)
            .NotEmpty();

        this.RuleFor(legalEntity => legalEntity.Address)
            .NotEmpty();

        this.RuleFor(legalEntity => legalEntity.Type)
            .Must(type => type != TenantType.Unknown)
            .WithMessage("Ivalid type.");
    }
}
