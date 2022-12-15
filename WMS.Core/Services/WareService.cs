namespace WMS.Core.Services;

using FluentValidation;
using Microsoft.EntityFrameworkCore;

using WMS.Core.Exceptions;
using WMS.Core.Helpers;
using WMS.Core.Services.Abstractions;
using WMS.Core.Validators;
using WMS.Database;
using WMS.Database.Entities;

public class WareService : BaseService<Ware>, IWareService
{
    private readonly WareValidator _wareValidator;

    public WareService(WmsDbContext dbContext, WareValidator wareValidator) : base(dbContext)
    {
        this._wareValidator = wareValidator;
    }

    public override async Task DeleteAsync(int id)
    {
        var ware = this.DbSet
            .Include(x => x.Address)
            .FirstOrDefault(x => x.Id == id);
        if (ware == null)
        {
            throw new EntityNotFoundException($"Can't delete the ware with Id = {id}, because it doesn't exist.");
        }

        this.DbContext.Addresses.Remove(ware.Address);
        this.DbSet.Remove(ware);

        _ = await this.DbContext.SaveChangesAsync();
    }

    protected override void Update(Ware entity, Ware entityUpdateData) =>
         WareHelper.Populate(entity, entityUpdateData);

    protected override AbstractValidator<Ware>? GetValidator() => this._wareValidator;
}
