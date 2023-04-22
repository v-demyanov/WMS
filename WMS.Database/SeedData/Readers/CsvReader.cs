namespace WMS.Database.SeedData.Readers;

using System.Globalization;
using System.Reflection;
using System.Text;
using CsvHelper;
using CsvHelper.Configuration;

using WMS.Database.Entities;

public abstract class CsvReader<TEntity, TCsvRow>
    where TEntity : BaseEntity, new()
{
    private readonly string _pathToFile;

    protected CsvReader(string relativePathToFile)
    {
        var assemblyLocation = Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location);
        var pathToFile = Path.Combine(assemblyLocation, "SeedData", "Data", relativePathToFile);
        if (!File.Exists(pathToFile))
        {
            throw new FileNotFoundException(pathToFile);
        }

        this._pathToFile = pathToFile;
    }

    public IList<TEntity> Read()
    {
        var csvConfiguration = new CsvConfiguration(CultureInfo.CurrentCulture)
        {
            Delimiter = ",",
            Encoding = Encoding.Unicode,
        };

        using var reader = new StreamReader(this._pathToFile);
        using var csv = new CsvReader(reader, csvConfiguration);
        
        csv.Context.TypeConverterOptionsCache.GetOptions<string>().NullValues.Add(string.Empty);

        var records = new List<TEntity>();

        _ = csv.Read();
        _ = csv.ReadHeader();

        while (csv.Read())
        {
            var row = csv.GetRecord<TCsvRow>();
            var record = this.ReadRecord(row, records.Count);
            records.Add(record);
        }

        return records;
    }
    
    protected abstract TEntity ReadRecord(TCsvRow row, int recordNumber);
}