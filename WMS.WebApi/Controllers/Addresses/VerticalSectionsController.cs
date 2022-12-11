namespace WMS.WebApi.Controllers.Addresses;

using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OData.Query;
using Microsoft.AspNetCore.OData.Routing.Controllers;

using WMS.Core.Services.Abstractions.Addresses;
using WMS.Database.Entities.Addresses;

public class VerticalSectionsController : ODataController
{
    private readonly IVerticalSectionService _verticalSectionService;

    public VerticalSectionsController(IVerticalSectionService verticalSectionService)
    {
        this._verticalSectionService = verticalSectionService;
    }

    /// <summary>
    /// Gets all vertical sections.
    /// </summary>
    /// <returns>Collection of vertical sections.</returns>
    [HttpGet]
    [EnableQuery]
    public IQueryable<VerticalSection> Get() => this._verticalSectionService.GetAll();
}
