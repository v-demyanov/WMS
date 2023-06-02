namespace WMS.WebApi.Controllers.Dictionaries;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OData.Query;
using Microsoft.AspNetCore.OData.Routing.Controllers;

using WMS.Core.Services.Dictionaries;
using WMS.Database.Entities.Dictionaries;
using WMS.Database.Enums;

/// <summary>
/// Contains endpoints to work with text dictionaries.
/// </summary>
public abstract class TextDictionariesController<TEntity> : ODataController
    where TEntity : TextDictionaryEntity, new()
{
    private readonly TextDictionaryService<TEntity> _textDictionaryService;

    protected TextDictionariesController(TextDictionaryService<TEntity> textDictionaryService)
    {
        this._textDictionaryService = textDictionaryService;
    }
    
    /// <summary>
    /// Gets all records.
    /// </summary>
    /// <returns>Collection of records.</returns>
    [HttpGet]
    [EnableQuery]
    public IQueryable<TEntity> Get() => this._textDictionaryService.GetAll();
    
    /// <summary>
    /// Deletes record by Id.
    /// </summary>
    /// <param name="key">Record Id.</param>
    [HttpDelete]
    [Authorize(Roles = nameof(Role.Administrator))]
    public async Task<ActionResult> Delete(int key)
    {
        await this._textDictionaryService.DeleteAsync(key);
        return this.NoContent();
    }
    
    /// <summary>
    /// Creates a new record.
    /// </summary>
    /// <param name="recordToCreate">Record to create.</param>
    /// <returns>A newly created record.</returns>
    [HttpPost]
    [Authorize(Roles = nameof(Role.Administrator))]
    public async Task<ActionResult> Post([FromBody] TEntity recordToCreate)
    {
        var createdRecord = await this._textDictionaryService.AddAsync(recordToCreate);
        return this.Created(createdRecord);
    }
    
    /// <summary>
    /// Updates a record.
    /// </summary>
    /// <param name="key">Id of a record to update.</param>
    /// <param name="recordUpdateData">Data for the update operation.</param>
    [HttpPut]
    [Authorize(Roles = nameof(Role.Administrator))]
    public async Task<ActionResult> Put(int key, [FromBody] TEntity recordUpdateData)
    {
        await this._textDictionaryService.UpdateAsync(key, recordUpdateData);
        return this.NoContent();
    }
}