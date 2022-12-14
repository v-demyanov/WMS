namespace WMS.WebApi.Controllers;

using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OData.Query;
using Microsoft.AspNetCore.OData.Routing.Controllers;

using WMS.Core.Services.Abstractions;
using WMS.Database.Entities;
using WMS.Database.Enums;

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
    [EnableQuery(MaxExpansionDepth = 5)]
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

    /// <summary>
    /// Updates problem status.
    /// </summary>
    /// <param name="status">Problem's status.</param>
    /// <param name="problemId">Problem's Id.</param>
    /// <returns></returns>
    [HttpPut("api/[controller]/{problemId:int}/UpdateStatus")]
    public async Task<ActionResult> UpdateStatus([FromBody] ProblemStatus status, int problemId)
    {
        await this._problemService.UpdateStatusAsync(status, problemId);
        return this.NoContent();
    }
}
