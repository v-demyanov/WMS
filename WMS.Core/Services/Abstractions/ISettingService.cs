namespace WMS.Core.Services.Abstractions;

using WMS.Core.Models;

public interface ISettingService
{
    Task<SystemSettings> GetSystemSettingsAsync();

    Task UpdateSystemSettingsAsync(SystemSettings systemSettings);
}