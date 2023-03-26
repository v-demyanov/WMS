using WMS.Core.Models;
using WMS.Database.Entities;

namespace WMS.Core.Helpers;

public static class CommentHelper
{
    public static CommentRecord ToRecord(Comment comment) =>
        new CommentRecord()
        {
            Id = comment.Id,
            Message = comment.Message,
            CreatedDate = comment.CreatedDate,
            OwnerId = comment.OwnerId,
            ProblemId = comment.ProblemId,
            Owner = UserHelper.ToRecord(comment.Owner),
            Problem = comment.Problem,
        };
}