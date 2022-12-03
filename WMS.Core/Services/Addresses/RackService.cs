namespace WMS.Core.Services.Addresses;

using Microsoft.EntityFrameworkCore;
using System.Threading.Tasks;

using WMS.Core.Exceptions;
using WMS.Core.Models;
using WMS.Core.Services.Abstractions.Addresses;
using WMS.Core.Validators;
using WMS.Database;
using WMS.Database.Entities.Addresses;


// TODO: update indexes
public class RackService : BaseService<Rack>, IRackService
{
    private readonly RackCreateDataValidator _rackCreateDataValidator;

    public RackService(WmsDbContext dbContext, RackCreateDataValidator rackCreateDataValidator) 
        : base(dbContext)
    {
        this._rackCreateDataValidator = rackCreateDataValidator;
    }

    public async Task<Rack> GenerateAsync(RackCreateData rackCreateData)
    {
        var validationResult = await this._rackCreateDataValidator.ValidateAsync(rackCreateData);
        if (!validationResult.IsValid)
        {
            throw new ApiOperationFailedException($"The Rack is invalid. Errors: {validationResult}");
        }

        var areaId = rackCreateData.AreaId;
        var rack = new Rack()
        { 
            AreaId = areaId, 
            Index = this.GenerateIndex(areaId),
        };

        var verticalSections = this.GenerateVerticalSections(rack, rackCreateData);
        this.PopulateVerticalSections(rack, verticalSections);

        _ = this.DbSet.Add(rack);
        _ = await this.DbContext.SaveChangesAsync();

        return rack;
    }

    protected override void Update(Rack entity, Rack entityUpdateData)
    {
        entity.AreaId = entityUpdateData.AreaId;
    }

    private void PopulateShelfs(VerticalSection verticalSection, IEnumerable<Shelf> shelfs)
    {
        foreach (var shelf in shelfs)
        {
            verticalSection.Shelfs.Add(shelf);
        }
    }

    private void PopulateVerticalSections(Rack rack, IEnumerable<VerticalSection> verticalSections)
    {
        foreach (var verticalSection in verticalSections)
        {
            rack.VerticalSections.Add(verticalSection);
        }
    }

    private IEnumerable<VerticalSection> GenerateVerticalSections(Rack rack, RackCreateData rackCreateData)
    {
        var verticalSections = new List<VerticalSection>();
        for (var i = 1; i <= rackCreateData.VerticalSectionsCount; i++)
        {
            var verticalSection = new VerticalSection()
            {
                Rack = rack,
                Index = i,
            };
            var shelfs = this.GenerateShelfs(rackCreateData.ShelfsCount);
            this.PopulateShelfs(verticalSection, shelfs);

            verticalSections.Add(verticalSection);
        }

        return verticalSections;
    }

    private IEnumerable<Shelf> GenerateShelfs(int count)
    {
        var shelfs = new List<Shelf>();
        for (var i = 1; i <= count; i++)
        {
            shelfs.Add(new Shelf() { Index = i });
        }

        return shelfs;
    }

    private int GenerateIndex(int areaId)
    {
        var area = this.DbContext.Areas
            .Include(x => x.Racks)
            .FirstOrDefault(x => x.Id == areaId);
        return area!.Racks.Count + 1;
    }
}
