namespace WMS.WebApi.Controllers.Addresses;

using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OData.Query;
using Microsoft.AspNetCore.OData.Routing.Controllers;

using WMS.Core.Services.Abstractions.Addresses;
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
    [EnableQuery]
    public IQueryable<Shelf> Get() => this._shelfService.GetAll();
}
