namespace WMS.Core.Validators;

using FluentValidation;
using Microsoft.EntityFrameworkCore;

using WMS.Core.Models;
using WMS.Database;

public class RackCreateDataValidator : AbstractValidator<RackCreateData>
{
    public RackCreateDataValidator(WmsDbContext dbContext)
    {
        this.RuleFor(rackCreateData => rackCreateData.AreaId)
            .Must((rackCreateData, areaId) => dbContext.Areas.Any(area => area.Id == areaId))
            .WithMessage("The area with such id has not been found.");

        this.RuleFor(rackCreateData => rackCreateData.VerticalSectionsCount)
            .Must((rackCreateData, count) =>
            {
                var area = dbContext.Areas
                    .Include(area => area.Racks)
                        .ThenInclude(rack => rack.VerticalSections)
                    .FirstOrDefault(area => area.Id == rackCreateData.AreaId);
                if (area == null)
                {
                    return false;
                }

                var currentSectionsCount = area.Racks.Select(rack => rack.VerticalSections.Count).Sum();

                return currentSectionsCount + count <= area.MaxVerticalSections;
            })
            .WithMessage("Area' capacity of sections is overload.");

        this.RuleFor(rackCreateData => rackCreateData.ShelfsCount)
            .Must((rackCreateData, count) =>
            {
                var area = dbContext.Areas.FirstOrDefault(area => area.Id == rackCreateData.AreaId);
                if (area == null)
                {
                    return false;
                }

                return count <= area.MaxShelfs;
            })
            .WithMessage("Area' capacity of shelfs is overload.");
    }
}
