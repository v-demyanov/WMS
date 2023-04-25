namespace WMS.Core.Services;

using FluentValidation;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;

using WMS.Core.Exceptions;
using WMS.Core.Helpers;
using WMS.Core.Models;
using WMS.Core.Services.Abstractions;
using WMS.Core.Validators;
using WMS.Database;
using WMS.Database.Entities;
using WMS.Database.Entities.Addresses;
using WMS.Database.Enums;

public class WareService : BaseService<Ware>, IWareService
{
    private readonly NotificationSettings _notificationSettings;
    private readonly WareValidator _wareValidator;
    private readonly AddressValidator _addressValidator;
    private readonly IUserService _userService;

    public WareService(
        WmsDbContext dbContext, 
        WareValidator wareValidator,
        AddressValidator addressValidator,
        IOptions<NotificationSettings> notificationSettings,
        IUserService userService) : base(dbContext)
    {
        this._wareValidator = wareValidator;
        this._addressValidator = addressValidator;
        this._userService = userService;
        this._notificationSettings = notificationSettings.Value;
    }

    public async Task DeleteShippedAsync()
    {
        var today = DateTimeOffset.Now.Date;
        var shippedWaresStorageDays = this._notificationSettings.ShippedWaresStorageDays;
        var waresToDelete = new List<Ware>();

        var wares = this.DbSet.Include(x => x.Address);
        foreach (var ware in wares)
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
            .Include(x => x.Address)
            .FirstOrDefaultAsync(x => x.Id == wareId);
        if (ware == null)
        {
            throw new EntityNotFoundException($"Can't soft delete the ware with Id = {wareId}, because it doesn't exist.");
        }

        ware.Status = WareStatus.ToBeDeleted;
        ware.ShippingDate = DateTimeOffset.Now;
        if (ware.Address is not null)
        {
            ware.AddressId = null;
            this.DbContext.Addresses.Remove(ware.Address);
        }

        _ = await this.DbContext.SaveChangesAsync();
    }

    public async Task Restore(int wareId, Address address)
    {
        var ware = await this.DbSet.FirstOrDefaultAsync(x => x.Id == wareId);
        if (ware == null)
        {
            throw new EntityNotFoundException($"Can't restore the ware with Id = {wareId}, because it doesn't exist.");
        }

        var addressValidationResult = await this._addressValidator.ValidateAsync(address);
        if (!addressValidationResult.IsValid)
        {
            throw new ApiOperationFailedException($"The address is invalid. Errors: {addressValidationResult}");
        }
        
        ware.Status = WareStatus.Active;
        ware.ShippingDate = null;

        address.Id = 0;
        _ = await this.DbContext.Addresses.AddAsync(address);
        ware.Address = address;

        _ = await this.DbContext.SaveChangesAsync();
    }

    public override async Task UpdateAsync(int id, Ware entityUpdateData)
    {
        entityUpdateData.Id = id;
        await this.ValidateAsync(entityUpdateData);
        
        var ware = this.DbSet
            .Include(x => x.Address)
            .FirstOrDefault(x => x.Id == id);
        if (ware == null)
        {
            throw new EntityNotFoundException($"Can't update ware with Id = {id}, because it doesn't exist.");
        }

        if (entityUpdateData.AddressId != ware.AddressId)
        {
            if (AddressHelper.DoesNewAddressEqualOrigin(entityUpdateData.Address, ware.Address))
            {
                entityUpdateData.AddressId = ware.AddressId;
            }
            else
            {
                _ = await this.DbContext.Addresses.AddAsync(entityUpdateData.Address);

                var addressToDelete = ware.Address;
                ware.Address = entityUpdateData.Address;
            
                this.DbContext.Addresses.Remove(addressToDelete);
            }
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
}
