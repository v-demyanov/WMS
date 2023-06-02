﻿namespace WMS.WebApi.Controllers.Addresses;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OData.Query;
using Microsoft.AspNetCore.OData.Results;
using Microsoft.AspNetCore.OData.Routing.Controllers;

using WMS.Core.Models;
using WMS.Core.Services.Abstractions.Addresses;
using WMS.Database.Entities.Addresses;
using WMS.Database.Enums;

/// <summary>
/// Manages racks.
/// </summary>
public class RacksController : ODataController
{
    private readonly IRackService _rackService;

    public RacksController(IRackService rackService)
    {
        this._rackService = rackService;
    }

    /// <summary>
    /// Generates a range of rack with vertical sections and shelfs.
    /// </summary>
    /// <param name="rackCreateData">Data to generate a new rack.</param>
    /// <returns>Generated rack.</returns>
    [HttpPost]
    [Authorize(Roles = nameof(Role.Administrator))]
    public async Task<ActionResult<Rack>> Post([FromBody] RackCreateData rackCreateData)
    {
        Rack rack = await this._rackService.GenerateAsync(rackCreateData);
        return this.Created(rack);
    }

    /// <summary>
    /// Deletes the rack.
    /// </summary>
    /// <param name="key">Rack's Id.</param>
    [HttpDelete]
    [Authorize(Roles = nameof(Role.Administrator))]
    public async Task<ActionResult> Delete(int key)
    {
        await this._rackService.DeleteAsync(key);
        return this.NoContent();
    }

    /// <summary>
    /// Gets all racks.
    /// </summary>
    /// <returns>Collection of racks.</returns>
    [HttpGet]
    [EnableQuery]
    public IQueryable<Rack> Get() => this._rackService.GetAll();

    /// <summary>
    /// Gets rack.
    /// </summary>
    /// <param name="key">Rack's Id.</param>
    /// <returns>Rack.</returns>
    [HttpGet]
    [EnableQuery]
    public SingleResult<Rack> Get(int key)
    {
        var racks = this._rackService.GetById(key);
        return SingleResult.Create(racks);
    }
}
