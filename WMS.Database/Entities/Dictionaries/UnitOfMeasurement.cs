namespace WMS.Database.Entities.Dictionaries;

public class UnitOfMeasurement : TextDictionaryEntity
{
    public ICollection<Ware> Wares { get; } = new HashSet<Ware>();
}
