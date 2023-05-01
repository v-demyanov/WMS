namespace WMS.Database.EntityConfigurations;

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

using WMS.Database.Constants;
using WMS.Database.Entities;
using WMS.Database.SeedData.Readers;

public class SettingEntityConfiguration : IEntityTypeConfiguration<Setting>
{
    public void Configure(EntityTypeBuilder<Setting> builder)
    {
        _ = builder
            .HasKey(setting => setting.Key);

        var dataReader = new SettingsCsvReader(SeedDataFiles.SettingsDataFilePath);
        var records = dataReader.Read();
        _ = builder.HasData(records);
    }
}