namespace WMS.Core.Services;

using FluentValidation;
using Microsoft.EntityFrameworkCore;

using WMS.Core.Exceptions;
using WMS.Core.Helpers;
using WMS.Core.Services.Abstractions;
using WMS.Core.Validators;
using WMS.Database;
using WMS.Database.Entities;
using WMS.Database.Enums;

public class WareService : BaseService<Ware>, IWareService
{
    private readonly WareValidator _wareValidator;
    private readonly IUserService _userService;
    private readonly ISettingService _settingService;
    private readonly IProblemService _problemService;

    public WareService(
        WmsDbContext dbContext, 
        WareValidator wareValidator,
        IUserService userService,
        IProblemService problemService,
        ISettingService settingService) : base(dbContext)
    {
        this._wareValidator = wareValidator;
        this._userService = userService;
        this._settingService = settingService;
        this._problemService = problemService;
    }

    public async Task DeleteShippedAsync()
    {
        var systemSettings = await this._settingService.GetSystemSettingsAsync();
        var today = DateTimeOffset.Now.Date;
        var shippedWaresStorageDays = systemSettings.ShippedWaresStorageDays;
        var waresToDelete = new List<Ware>();

        foreach (var ware in this.DbSet)
        {
            if (!ware.ShippingDate.HasValue)
            {
                continue;
            }

            var wareStorageExpirationDate = ware.ShippingDate.Value.AddDays(shippedWaresStorageDays).Date;
            if (wareStorageExpirationDate <= today)
            {
                waresToDelete.Add(ware);
            }
        }

        this.DbSet.RemoveRange(waresToDelete);
        _ = await this.DbContext.SaveChangesAsync();
    }
    
    public async Task SoftDelete(int wareId)
    {
        var ware = await this.DbSet
            .Include(x => x.Problems)
            .FirstOrDefaultAsync(x => x.Id == wareId);
        if (ware == null)
        {
            throw new EntityNotFoundException("Can't soft delete ware, because it doesn't exist.");
        }

        await this.RemoveRelatedProblemsAsync(ware.Problems);
        
        ware.Status = WareStatus.ToBeDeleted;
        ware.ShippingDate = DateTimeOffset.Now;
        ware.ShelfId = null;

        _ = await this.DbContext.SaveChangesAsync();
    }

    public async Task Restore(int wareId, int shelfId)
    {
        var ware = await this.DbSet.FirstOrDefaultAsync(x => x.Id == wareId);
        if (ware == null)
        {
            throw new EntityNotFoundException("Can't restore ware, because it doesn't exist.");
        }

        var shelf = await this.DbContext.Shelfs
            .Include(x => x.Ware)
            .FirstOrDefaultAsync(x => x.Id == shelfId);
        if (shelf == null)
        {
            throw new EntityNotFoundException("Can't restore ware, because shelf doesn't exist.");
        }

        if (shelf.Ware is not null)
        {
            throw new ApiOperationFailedException("Can't restore ware, because shelf has been already taken.");
        }

        ware.Status = WareStatus.Active;
        ware.ShippingDate = null;
        ware.ShelfId = shelf.Id;

        _ = await this.DbContext.SaveChangesAsync();
    }

    public override async Task UpdateAsync(int id, Ware entityUpdateData)
    {
        entityUpdateData.Id = id;
        await this.ValidateAsync(entityUpdateData);
        
        var ware = this.DbSet
            .FirstOrDefault(x => x.Id == id);
        if (ware == null)
        {
            throw new EntityNotFoundException("Can't update ware, because it doesn't exist.");
        }

        WareHelper.Populate(ware, entityUpdateData);
        _ = await this.DbContext.SaveChangesAsync();
    }

    public override IQueryable<Ware> GetAll()
    {
        var currentUser = this._userService.GetCurrentUser();
        if (currentUser is null || currentUser.Role != Role.Administrator)
        {
            return this.DbSet.Where(x => x.Status == WareStatus.Active);
        }

        return this.DbSet;
    }

    protected override void Update(Ware entity, Ware entityUpdateData) =>
         WareHelper.Populate(entity, entityUpdateData);

    protected override AbstractValidator<Ware>? GetValidator() => this._wareValidator;

    private async Task RemoveRelatedProblemsAsync(IEnumerable<Problem> problems)
    {
        foreach (var problem in problems)
        {
            var doesProblemExist = this.DbContext.Problems.Any(x => x.Id == problem.Id);
            if (doesProblemExist)
            {
                var problemsToDelete = await this._problemService.GetChildProblemsAsync(problem.Id);
                problemsToDelete.Add(problem);

                this.DbContext.Problems.RemoveRange(problemsToDelete);

                _ = await this.DbContext.SaveChangesAsync();
            }
        }
    }
}
