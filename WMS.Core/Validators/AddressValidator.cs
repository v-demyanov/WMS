namespace WMS.Core.Validators;

using FluentValidation;
using Microsoft.EntityFrameworkCore;

using WMS.Database.Entities.Addresses;
using WMS.Database;

public class AddressValidator : AbstractValidator<Address>
{
    private readonly WmsDbContext _dbContext;

    public AddressValidator(WmsDbContext dbContext)
    {
        this._dbContext = dbContext;

        this.RuleFor(address => address.AreaId)
            .Must((address, areaId) => dbContext.Areas.Any(area => area.Id == areaId))
            .WithMessage("The area with such id has not been found.");

        this.RuleFor(address => address.ShelfId)
            .Must((address, shelfId) => shelfId is null || dbContext.Shelfs.Any(shelf => shelf.Id == shelfId))
            .WithMessage("The shelf with such id has not been found.");

        this.RuleFor(address => address.ShelfId)
            .Must((address, shelfId) => shelfId is null || this.DoesAreaIncludeShelf(address.AreaId, shelfId))
            .WithMessage("The area doesn't contain the shelf.");

        this.RuleFor(address => address)
            .Must(address => address.ShelfId is null || this.IsShelfNotTaken(address.AreaId, address.ShelfId))
            .WithMessage("The shelf is already taken.");
    }

    private bool DoesAreaIncludeShelf(int areaId, int? shelfId)
    {
        if (shelfId is null)
        {
            return true;
        }

        var area = this._dbContext.Areas
            .Include(area => area.Racks)
                .ThenInclude(rack => rack.VerticalSections)
                    .ThenInclude(verticalSection => verticalSection.Shelfs)
            .FirstOrDefault(area => area.Id == areaId);
        if (area is null)
        {
            return false;
        }

        return area.Racks.Any(x => x.VerticalSections.Any(x => x.Shelfs.Any(x => x.Id == shelfId)));
    }

    private bool IsShelfNotTaken(int areaId, int? shelfId)
    {
        if (shelfId is null)
        {
            return true;
        }

        return !this._dbContext.Addresses.Any(x => x.AreaId == areaId && x.ShelfId == shelfId);
    }
}
