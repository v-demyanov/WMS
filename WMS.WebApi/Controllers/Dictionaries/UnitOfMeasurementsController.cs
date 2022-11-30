namespace WMS.WebApi.Controllers.Dictionaries;

using Microsoft.AspNetCore.Mvc;
using System.Net;

using WMS.Core.Services.Abstractions.Dictionaries;
using WMS.Database.Entities.Dictionaries;

/// <summary>
/// Manages unit of measurement.
/// </summary>
[Route("api/[controller]")]
[ApiController]
public class UnitOfMeasurementsController : ControllerBase
{
    private readonly IUnitOfMeasurementService _unitOfMeasurementsService;

    public UnitOfMeasurementsController(IUnitOfMeasurementService unitOfMeasurementsService)
    {
        _unitOfMeasurementsService = unitOfMeasurementsService;
    }

    /// <summary>
    /// Creates a new unit of measurement.
    /// </summary>
    /// <param name="model">Data to create a new unit of unit of measurement.</param>
    /// <returns>Created unit of measurement.</returns>
    [HttpPost]
    public async Task<UnitOfMeasurement> Post([FromBody] UnitOfMeasurement model)
    {
        var unitOfMeasurement = await this._unitOfMeasurementsService.AddAsync(model);
        this.Response.StatusCode = this.Response.StatusCode = (int)HttpStatusCode.Created;

        return unitOfMeasurement;
    }

    /// <summary>
    /// Gets the collection of all unit of measurement.
    /// </summary>
    /// <returns>Collection of unit of measurement.</returns>
    [HttpGet]
    public IQueryable<UnitOfMeasurement> Get() => this._unitOfMeasurementsService.GetAll();

    /// <summary>
    /// Deletes the unit of measurement.
    /// </summary>
    /// <param name="id">Unit of measurement' Id.</param>
    [HttpDelete("{id:int}")]
    public async Task<ActionResult> Delete(int id)
    {
        await this._unitOfMeasurementsService.DeleteAsync(id);
        return this.NoContent();
    }

    /// <summary>
    /// Updates the unit of measurement.
    /// </summary>
    /// <param name="id">Unit of measurement' Id.</param>
    /// <param name="model">Data to update unit of measurement.</param>
    [HttpPut("{id:int}")]
    public async Task<ActionResult> Put(int id, UnitOfMeasurement model)
    {
        await this._unitOfMeasurementsService.UpdateAsync(id, model);
        return this.NoContent();
    }
}
