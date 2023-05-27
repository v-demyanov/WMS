namespace WMS.WebApi.Controllers.Addresses;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OData.Query;
using Microsoft.AspNetCore.OData.Routing.Controllers;

using WMS.Core.Services.Abstractions.Addresses;
using WMS.Database.Constants;
using WMS.Database.Entities.Addresses;
using WMS.Database.Enums;

public class AreasController : ODataController
{
    private readonly IAreaService _areaService;

    public AreasController(IAreaService areaService)
    {
        this._areaService = areaService;
    }

    /// <summary>
    /// Gets all areas.
    /// </summary>
    /// <returns>Collection of racks.</returns>
    [HttpGet]
    [EnableQuery(MaxExpansionDepth = ODataSettings.MaxExpansionDepth)]
    public IQueryable<Area> Get() => this._areaService.GetAll();
    
    /// <summary>
    /// Creates new area.
    /// </summary>
    /// <param name="areaCreateData">Data to create a new area.</param>
    /// <returns>Created area.</returns>
    [HttpPost]
    [Authorize(Roles = nameof(Role.Administrator))]
    public async Task<ActionResult<Area>> Post([FromBody] Area areaCreateData)
    {
        Area area = await this._areaService.AddAsync(areaCreateData);
        return this.Created(area);
    }
}
