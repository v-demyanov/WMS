namespace WMS.Database.Entities.Addresses;

public class Area : BaseEntity
{
    public string Name { get; set; } = default!;

    public ICollection<Rack> Racks { get; } = new HashSet<Rack>();
}
