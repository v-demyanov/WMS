namespace WMS.WebApi.Controllers.Tenants;

using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OData.Query;
using Microsoft.AspNetCore.OData.Routing.Controllers;

using WMS.Core.Services.Abstractions.Tenants;
using WMS.Database.Entities.Tenants;

/// <summary>
/// Manages lega entities.
/// </summary>
public class LegalEntitiesController : ODataController
{
    private readonly ILegalEntityService _legalEntityService;

    public LegalEntitiesController(ILegalEntityService legalEntityService)
    {
        this._legalEntityService = legalEntityService;
    }

    /// <summary>
    /// Get all legal entities.
    /// </summary>
    /// <returns>Collection of legal entities.</returns>
    [EnableQuery]
    [HttpGet]
    public IQueryable<LegalEntity> Get() => this._legalEntityService.GetAll();

    /// <summary>
    /// Creates a new legal entity.
    /// </summary>
    /// <param name="legalEntityCreateData">Data to create new legal entity.</param>
    /// <returns>Created legal entity.</returns>
    [HttpPost]
    public async Task<ActionResult<LegalEntity>> Post([FromBody] LegalEntity legalEntityCreateData)
    {
        var legalEntity = await this._legalEntityService.AddAsync(legalEntityCreateData);
        return this.Created(legalEntity);
    }

    /// <summary>
    /// Deletes legal entity by Id.
    /// </summary>
    /// <param name="key">Legal entity' Id.</param>
    [HttpDelete]
    public async Task<ActionResult> Delete(int key)
    {
        await this._legalEntityService.DeleteAsync(key);
        return this.NoContent();
    }

    /// <summary>
    /// Updates legal entity.
    /// </summary>
    /// <param name="key">Legal entity' Id.</param>
    /// <param name="legalEntityUpdateData">Data to update legal entity.</param>
    [HttpPut]
    public async Task<ActionResult> Put(int key, [FromBody] LegalEntity legalEntityUpdateData)
    {
        await this._legalEntityService.UpdateAsync(key, legalEntityUpdateData);
        return this.NoContent();
    }
}
