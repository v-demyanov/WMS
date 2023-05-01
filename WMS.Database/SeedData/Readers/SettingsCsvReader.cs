namespace WMS.Database.SeedData.Readers;

using WMS.Database.Entities;

public class SettingsCsvReader : CsvReader<Setting, Setting>
{
    public SettingsCsvReader(string relativePathToFile) 
        : base(relativePathToFile)
    {
    }

    protected override Setting ReadRecord(Setting row, int recordNumber)
    {
        return new Setting()
        {
            Key = row.Key,
            Value = row.Value,
        };
    }
}