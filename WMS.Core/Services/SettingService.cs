namespace WMS.Core.Services;

using System.Globalization;
using Microsoft.EntityFrameworkCore;

using WMS.Core.Models;
using WMS.Core.Services.Abstractions;
using WMS.Database;
using WMS.Database.Constants;
using WMS.Database.Entities;

public class SettingService : ISettingService
{
    private readonly WmsDbContext _dbContext;

    private readonly string[] _systemSettingKeys =
    {
        SettingKeys.ProblemExpirationNotificationDays,
        SettingKeys.ShippedWaresStorageDays,
    };

    public SettingService(WmsDbContext dbContext)
    {
        this._dbContext = dbContext;
    }

    public async Task<SystemSettings> GetSystemSettingsAsync()
    {
        var settings = await this.QuerySettings(this._systemSettingKeys)
            .ToDictionaryAsync(setting => setting.Key, setting => setting.Value);
        return new SystemSettings()
        {
            ProblemExpirationNotificationDays = GetIntValue(settings, SettingKeys.ProblemExpirationNotificationDays),
            ShippedWaresStorageDays = GetIntValue(settings, SettingKeys.ShippedWaresStorageDays),
        };
    }

    public async Task UpdateSystemSettingsAsync(SystemSettings systemSettings)
    {
        if (systemSettings == null)
        {
            throw new ArgumentNullException(nameof(systemSettings));
        }
        
        var settings = await this.QuerySettings(this._systemSettingKeys).ToListAsync();
        UpdateSetting(settings, SettingKeys.ProblemExpirationNotificationDays, systemSettings.ProblemExpirationNotificationDays);
        UpdateSetting(settings, SettingKeys.ShippedWaresStorageDays, systemSettings.ShippedWaresStorageDays);

        _ = await this._dbContext.SaveChangesAsync();
    }
    
    private static void UpdateSetting(IList<Setting> allSettings, string settingKey, int settingValue)
    {
        var value = settingValue.ToString(NumberFormatInfo.InvariantInfo);
        UpdateSetting(allSettings, settingKey, value);
    }
    
    private static void UpdateSetting(IList<Setting> allSettings, string settingKey, string settingValue)
    {
        var setting = allSettings.FirstOrDefault(setting => setting.Key == settingKey);
        if (setting == null)
        {
            return;
        }

        setting.Value = settingValue;
    }
    
    private static int GetIntValue(Dictionary<string, string?> settings, string settingKey)
    {
        _ = settings.TryGetValue(settingKey, out var stringValue);
        return int.TryParse(stringValue, out var value) ? value : 0;
    }

    private static string GetStringValue(Dictionary<string, string?> settings, string settingKey)
    {
        _ = settings.TryGetValue(settingKey, out var stringValue);
        return stringValue ?? string.Empty;
    }
    
    private IQueryable<Setting> QuerySettings(string[] settings) =>
        this._dbContext.Settings.Where(setting => settings.Contains(setting.Key));
}