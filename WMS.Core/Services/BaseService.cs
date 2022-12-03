namespace WMS.Core.Services;

using System.Linq;
using System.Threading.Tasks;
using Task = Task;
using Microsoft.EntityFrameworkCore;
using FluentValidation;

using WMS.Core.Services.Abstractions;
using WMS.Database;
using WMS.Database.Entities;
using WMS.Core.Exceptions;

public abstract class BaseService<TEntity> : IBaseService<TEntity>
    where TEntity : BaseEntity, new()
{
    protected BaseService(WmsDbContext dbContext)
    {
        this.DbContext = dbContext;
        this.DbSet = this.DbContext.Set<TEntity>();
    }

    protected WmsDbContext DbContext { get; }

    protected DbSet<TEntity> DbSet { get; }

    public virtual async Task<TEntity> AddAsync(TEntity entityCreateData)
    {
        await this.ValidateAsync(entityCreateData);

        _ = await this.DbSet.AddAsync(entityCreateData);
        _ = await this.DbContext.SaveChangesAsync();

        return entityCreateData;
    }

    public async virtual Task DeleteAsync(int id)
    {
        var entity = this.DbSet.FirstOrDefault(x => x.Id == id);
        if (entity == null)
        {
            throw new EntityNotFoundException($"Can't delete the {typeof(TEntity).Name} with Id = {id}, because it doesn't exist.");
        }

        this.DbSet.Remove(entity);
        _ = await this.DbContext.SaveChangesAsync();
    }

    public virtual IQueryable<TEntity> GetAll() => this.DbSet;

    public virtual TEntity GetById(int id)
    {
        var entity = this.DbSet.FirstOrDefault(x => x.Id == id);
        if (entity == null)
        {
            throw new EntityNotFoundException($"The {typeof(TEntity).Name} with Id = {id} doesn't exist.");
        }

        return entity;
    }

    public async virtual Task UpdateAsync(int id, TEntity entityUpdateData)
    {
        await this.ValidateAsync(entityUpdateData);

        var entity = this.DbSet.FirstOrDefault(x => x.Id == id);
        if (entity == null)
        {
            throw new EntityNotFoundException($"Can't update the {typeof(TEntity).Name} with Id = {id}, because it doesn't exist.");
        }

        this.Update(entity, entityUpdateData);

        _ = await this.DbContext.SaveChangesAsync();
    }

    protected virtual AbstractValidator<TEntity>? GetValidator() => default;

    protected async Task ValidateAsync(TEntity entity)
    {
        var validator = this.GetValidator();
        if (validator == null)
        {
            return;
        }

        var result = await validator.ValidateAsync(entity);
        if(!result.IsValid)
        {
            throw new ApiOperationFailedException($"The {typeof(TEntity).Name} is invalid. Errors: {result}");
        }
    }

    protected abstract void Update(TEntity entity, TEntity entityUpdateData);
}
