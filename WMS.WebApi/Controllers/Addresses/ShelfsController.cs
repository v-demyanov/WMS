namespace WMS.WebApi.Controllers.Addresses;

using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OData.Query;
using Microsoft.AspNetCore.OData.Results;
using Microsoft.AspNetCore.OData.Routing.Controllers;

using WMS.Core.Services.Abstractions.Addresses;
using WMS.Database.Constants;
using WMS.Database.Entities.Addresses;

public class ShelfsController : ODataController
{
    private readonly IShelfService _shelfService;

    public ShelfsController(IShelfService shelfService)
    {
        this._shelfService = shelfService;
    }

    /// <summary>
    /// Gets all shelfs.
    /// </summary>
    /// <returns>Collection of shelfs.</returns>
    [HttpGet]
    [EnableQuery(MaxExpansionDepth = ODataSettings.MaxExpansionDepth)]
    public IQueryable<Shelf> Get() => this._shelfService.GetAll();

    /// <summary>
    /// Gets shelf by Id.
    /// </summary>
    /// <param name="key">Shelf's Id.</param>
    /// <returns>Shelf entity.</returns>
    [HttpGet]
    [EnableQuery(MaxExpansionDepth = ODataSettings.MaxExpansionDepth)]
    public SingleResult<Shelf> Get(int key)
    {
        var shelfs = this._shelfService.GetById(key);
        return SingleResult.Create(shelfs);
    }
}
