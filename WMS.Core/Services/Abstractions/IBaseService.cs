namespace WMS.Core.Services.Abstractions;

using System.Threading.Tasks;
using Task = Task;

using WMS.Database.Entities;

public interface IBaseService<TEntity>
    where TEntity : BaseEntity, new()
{
    IQueryable<TEntity> GetAll();

    TEntity GetById(int id);

    Task<TEntity> AddAsync(TEntity entityCreateData);

    Task UpdateAsync(int id, TEntity entityUpdateData);

    Task DeleteAsync(int id);
}
