namespace WMS.WebApi.Controllers;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OData.Query;
using Microsoft.AspNetCore.OData.Routing.Controllers;

using WMS.Core.Services.Abstractions;
using WMS.Database.Constants;
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
    [EnableQuery(MaxExpansionDepth = ODataSettings.MaxExpansionDepth)]
    public IQueryable<Problem> Get() => this._problemService.GetAll();

    /// <summary>
    /// Creates new problem.
    /// </summary>
    /// <param name="problemCreateData">Problem's create data.</param>
    /// <returns>New problem.</returns>
    [HttpPost]
    [Authorize]
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
    [Authorize]
    public async Task<ActionResult> UpdateStatus([FromBody] ProblemStatus status, int problemId)
    {
        await this._problemService.UpdateStatusAsync(status, problemId);
        return this.NoContent();
    }

    /// <summary>
    /// Deletes the problem.
    /// </summary>
    /// <param name="key">Problem's Id.</param>
    [HttpDelete]
    [Authorize]
    public async Task<ActionResult> Delete(int key)
    {
        await this._problemService.DeleteAsync(key);
        return this.NoContent();
    }
    
    /// <summary>
    /// Assigns the problem.
    /// </summary>
    /// <param name="problemId">Problem's Id.</param>
    /// <param name="userId">User's Id.</param>
    [HttpPut("api/[controller]/{problemId:int}/Assign")]
    [Authorize]
    public async Task<ActionResult> Assign(int problemId, int? userId)
    {
        await this._problemService.AssignAsync(problemId, userId);
        return this.NoContent();
    }

    /// <summary>
    /// Updates the problem.
    /// </summary>
    /// <param name="problemUpdateData">Problem's update data.</param>
    /// <param name="key">Problem's Id.</param>
    [HttpPut]
    [Authorize]
    public async Task<ActionResult> Put([FromBody] Problem problemUpdateData, int key)
    {
        await this._problemService.UpdateAsync(key, problemUpdateData);
        return this.NoContent();
    }
}
