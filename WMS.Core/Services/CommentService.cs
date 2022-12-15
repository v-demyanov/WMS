namespace WMS.Core.Services;

using WMS.Core.Services.Abstractions;
using WMS.Database;
using WMS.Database.Entities;

public class CommentService : BaseService<Comment>, ICommentService
{
    public CommentService(WmsDbContext dbContext) : base(dbContext)
    {
    }

    protected override void Update(Comment entity, Comment entityUpdateData)
    {
        throw new NotImplementedException();
    }
}
