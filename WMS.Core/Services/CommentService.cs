using Microsoft.EntityFrameworkCore;

namespace WMS.Core.Services;

using WMS.Core.Services.Abstractions;
using WMS.Database;
using WMS.Database.Entities;

public class CommentService : BaseService<Comment>, ICommentService
{
    private readonly IAuthService _authService;
    
    public CommentService(
        WmsDbContext dbContext,
        IAuthService authService) : base(dbContext)
    {
        this._authService = authService;
    }

    protected override void Update(Comment entity, Comment entityUpdateData)
    {
        throw new NotImplementedException();
    }

    public async override Task<Comment> AddAsync(Comment entityCreateData)
    {
        var comment = await base.AddAsync(entityCreateData);

        User currentUser = this._authService.GetCurrentUser();
        comment.Owner = currentUser;
        
        return comment;
    }
}
