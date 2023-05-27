namespace WMS.Database.Entities.Addresses;

public class Area : BaseEntity
{
    public string Name { get; set; } = default!;

    public int MaxVerticalSections { get; set; }
    
    // TODO: Rename to MaxShelvesInVerticalSection
    public int MaxShelfs { get; set; }

    public ICollection<Rack> Racks { get; } = new HashSet<Rack>();
}
