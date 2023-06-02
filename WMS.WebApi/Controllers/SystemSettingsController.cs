namespace WMS.WebApi.Controllers;

using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

using WMS.Core.Models;
using WMS.Core.Services.Abstractions;
using WMS.Database.Enums;

/// <summary>
/// Manages system settings.
/// </summary>
[Route("api/[controller]")]
[ApiController]
[Authorize(Roles = nameof(Role.Administrator))]
public class SystemSettingsController : ControllerBase
{
    private readonly ISettingService _settingService;

    public SystemSettingsController(ISettingService settingService)
    {
        this._settingService = settingService;
    }

    /// <summary>
    /// Gets system settings.
    /// </summary>
    /// <returns>System settings.</returns>
    [HttpGet]
    public async Task<SystemSettings> Get() => 
        await this._settingService.GetSystemSettingsAsync();

    /// <summary>
    /// Updates system settings.
    /// </summary>
    /// <param name="systemSettings">Updated system settings.</param>
    [HttpPut]
    [Authorize(Roles = nameof(Role.Administrator))]
    public async Task Put([FromBody] SystemSettings systemSettings) =>
        await this._settingService.UpdateSystemSettingsAsync(systemSettings);
}