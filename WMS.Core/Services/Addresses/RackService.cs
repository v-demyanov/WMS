namespace WMS.Core.Services.Addresses;

using System.Threading.Tasks;

using WMS.Core.Exceptions;
using WMS.Core.Models;
using WMS.Core.Services.Abstractions.Addresses;
using WMS.Core.Validators;
using WMS.Database;
using WMS.Database.Entities.Addresses;

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

        var rack = new Rack() { AreaId = rackCreateData.AreaId };

        var verticalSections = new List<VerticalSection>();
        for (var i = 0; i < rackCreateData.VerticalSectionsCount; i++)
        {
            var verticalSection = new VerticalSection();
            verticalSection.Rack = rack;
            var shelfs = this.GenerateShelfs(rackCreateData.ShelfsCount);
            this.PopulateShelfs(verticalSection, shelfs);

            verticalSections.Add(verticalSection);
        }

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

    private IEnumerable<Shelf> GenerateShelfs(int count)
    {
        var shelfs = new List<Shelf>();
        for (var i = 0; i < count; i++)
        {
            shelfs.Add(new Shelf());
        }

        return shelfs;
    }
}
