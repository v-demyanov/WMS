namespace WMS.WebApi.Controllers;

using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OData.Query;
using Microsoft.AspNetCore.OData.Routing.Controllers;

using WMS.Core.Services.Abstractions;
using WMS.Database.Entities;

public class ProblemsController : ODataController
{
    private readonly IProblemService _problemService;

    public ProblemsController(IProblemService problemService)
    {
        this._problemService = problemService;
    }

    /// <summary>
    /// Gets all problems.
    /// </summary>
    /// <returns>Collection of problems.</returns>
    [HttpGet]
    [EnableQuery]
    public IQueryable<Problem> Get() => this._problemService.GetAll();

    /// <summary>
    /// Creates new problem.
    /// </summary>
    /// <param name="problemCreateData">Problem's create data.</param>
    /// <returns>New problem.</returns>
    [HttpPost]
    public async Task<ActionResult<Problem>> Post([FromBody] Problem problemCreateData)
    {
        var problem = await this._problemService.AddAsync(problemCreateData);
        return this.Created(problem);
    }
}
