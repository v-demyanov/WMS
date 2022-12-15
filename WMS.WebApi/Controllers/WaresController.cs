namespace WMS.WebApi.Controllers;

using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OData.Query;
using Microsoft.AspNetCore.OData.Routing.Controllers;

using WMS.Core.Services.Abstractions;
using WMS.Database.Constants;
using WMS.Database.Entities;

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
    public async Task<ActionResult<Ware>> Post([FromBody] Ware wareCreateData)
    {
        var ware = await this._wareService.AddAsync(wareCreateData);
        return this.Created(ware);
    }

    /// <summary>
    /// Deletes the ware.
    /// </summary>
    /// <param name="key">Ware' Id.</param>
    [HttpDelete]
    public async Task<ActionResult> Delete(int key)
    {
        await this._wareService.DeleteAsync(key);
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
    public async Task<ActionResult> Put([FromBody] Ware wareUpdateData, int key)
    {
        await this._wareService.UpdateAsync(key, wareUpdateData);
        return this.NoContent();
    }
}
