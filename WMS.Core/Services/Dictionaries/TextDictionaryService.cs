namespace WMS.Core.Services.Dictionaries;

using WMS.Database;
using WMS.Database.Entities.Dictionaries;

public class TextDictionaryService<TEntity> : BaseService<TEntity>
    where TEntity : TextDictionaryEntity, new()
{
    public TextDictionaryService(WmsDbContext dbContext) : base(dbContext)
    {
    }

    protected override void Update(TEntity entity, TEntity entityUpdateData)
    {
        entity.Value = entityUpdateData.Value;
    }
}