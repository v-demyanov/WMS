namespace WMS.WebApi.Controllers.Addresses;

using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OData.Query;
using Microsoft.AspNetCore.OData.Routing.Controllers;

using WMS.Core.Services.Abstractions.Addresses;
using WMS.Database.Constants;
using WMS.Database.Entities.Addresses;

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
}
