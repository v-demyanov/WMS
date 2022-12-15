namespace WMS.WebApi.Controllers;

using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OData.Query;
using Microsoft.AspNetCore.OData.Routing.Controllers;

using WMS.Core.Services.Abstractions;
using WMS.Database.Constants;
using WMS.Database.Entities;

public class CommentsController : ODataController
{
    private readonly ICommentService _commentService;

    public CommentsController(ICommentService commentService)
    {
        this._commentService = commentService;
    }

    /// <summary>
    /// Gets all comments.
    /// </summary>
    /// <returns>Collection of comments.</returns>
    [HttpGet]
    [EnableQuery(MaxExpansionDepth = ODataSettings.MaxExpansionDepth)]
    public IQueryable<Comment> Get() => this._commentService.GetAll();

    /// <summary>
    /// Creates new comment.
    /// </summary>
    /// <param name="commentCreateData">Comment's create data.</param>
    /// <returns>New comment.</returns>
    [HttpPost]
    public async Task<ActionResult<Problem>> Post([FromBody] Comment commentCreateData)
    {
        var comment = await this._commentService.AddAsync(commentCreateData);
        return this.Created(comment);
    }
}
