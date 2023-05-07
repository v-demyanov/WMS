namespace WMS.WebApi.Controllers;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OData.Query;
using Microsoft.AspNetCore.OData.Routing.Controllers;

using WMS.Core.Services.Abstractions;
using WMS.Database.Constants;
using WMS.Database.Entities;
using WMS.Database.Enums;

public class WaresController : ODataController
{
    private readonly IWareService _wareService;

    public WaresController(IWareService wareService)
    {
        this._wareService = wareService;
    }

    /// <summary>
    /// Creates new ware.
    /// </summary>
    /// <param name="wareCreateData">Ware' create data.</param>
    /// <returns>New ware.</returns>
    [HttpPost]
    [Authorize(Roles = nameof(Role.Administrator))]
    public async Task<ActionResult<Ware>> Post([FromBody] Ware wareCreateData)
    {
        var ware = await this._wareService.AddAsync(wareCreateData);
        return this.Created(ware);
    }

    /// <summary>
    /// Marks ware as deleted.
    /// </summary>
    /// <param name="wareId">Ware' Id.</param>
    [HttpPut("api/[controller]/{wareId:int}/SoftDelete")]
    [Authorize(Roles = nameof(Role.Administrator))]
    public async Task<ActionResult> SoftDelete(int wareId)
    {
        await this._wareService.SoftDelete(wareId);
        return this.NoContent();
    }
    
    /// <summary>
    /// Restores ware.
    /// </summary>
    /// <param name="wareId">Ware' Id.</param>
    /// <param name="shelfId">Shelf's Id.</param>
    [HttpPut("api/[controller]/{wareId:int}/Restore")]
    [Authorize(Roles = nameof(Role.Administrator))]
    public async Task<ActionResult> Restore(int wareId, int shelfId)
    {
        await this._wareService.Restore(wareId, shelfId);
        return this.NoContent();
    }

    /// <summary>
    /// Gets all wares.
    /// </summary>
    /// <returns>Collection of wares.</returns>
    [HttpGet]
    [EnableQuery(MaxExpansionDepth = ODataSettings.MaxExpansionDepth)]
    public IQueryable<Ware> Get() => this._wareService.GetAll();

    /// <summary>
    /// Updates the ware.
    /// </summary>
    /// <param name="wareUpdateData">Ware' update data.</param>
    /// <param name="key">Ware' Id.</param>
    [HttpPut]
    [Authorize(Roles = nameof(Role.Administrator))]
    public async Task<ActionResult> Put([FromBody] Ware wareUpdateData, int key)
    {
        await this._wareService.UpdateAsync(key, wareUpdateData);
        return this.NoContent();
    }
}
