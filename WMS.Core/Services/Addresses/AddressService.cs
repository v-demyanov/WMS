namespace WMS.Core.Services.Addresses;

using FluentValidation;

using WMS.Core.Services.Abstractions.Addresses;
using WMS.Core.Validators;
using WMS.Database;
using WMS.Database.Entities.Addresses;

public class AddressService : BaseService<Address>, IAddressService
{
    private readonly AddressValidator _addressValidator;
    
    public AddressService(WmsDbContext dbContext, AddressValidator addressValidator) : base(dbContext)
    {
        this._addressValidator = addressValidator;
    }

    protected override void Update(Address entity, Address entityUpdateData)
    {
        throw new NotImplementedException();
    }

    protected override AbstractValidator<Address>? GetValidator() => this._addressValidator;
}