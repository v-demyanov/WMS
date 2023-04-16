namespace WMS.WebApi.Controllers.Dictionaries;

using WMS.Core.Services.Dictionaries;
using WMS.Database.Entities.Dictionaries;

/// <summary>
/// Manages unit of measurement.
/// </summary>
public class UnitOfMeasurementsController : TextDictionariesController<UnitOfMeasurement>
{
    public UnitOfMeasurementsController(TextDictionaryService<UnitOfMeasurement> textDictionaryService)
        : base(textDictionaryService)
    {
    }
}
