namespace WMS.Core.Services.Tenants;

using FluentValidation;

using WMS.Core.Helpers;
using WMS.Core.Services.Abstractions.Tenants;
using WMS.Core.Validators;
using WMS.Database;
using WMS.Database.Entities.Tenants;

public class LegalEntityService : BaseService<LegalEntity>, ILegalEntityService
{
    private readonly LegalEntityValidator _legalEntityValidator;

    public LegalEntityService(WmsDbContext dbContext, LegalEntityValidator legalEntityValidator) 
        : base(dbContext)
    {
        this._legalEntityValidator = legalEntityValidator;
    }

    protected override AbstractValidator<LegalEntity>? GetValidator() => this._legalEntityValidator;

    protected override void Update(LegalEntity entity, LegalEntity entityUpdateData) => LegalEntityHelper.Populate(entity, entityUpdateData);
}
