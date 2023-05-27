namespace WMS.Core.Validators;

using FluentValidation;

using WMS.Database.Entities.Addresses;

public class AreaValidator : AbstractValidator<Area>
{
    public AreaValidator()
    {
        this.RuleFor(area => area.MaxShelfs)
            .GreaterThanOrEqualTo(0);
        
        this.RuleFor(area => area.MaxVerticalSections)
            .GreaterThanOrEqualTo(0);
    }
}