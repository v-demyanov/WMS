namespace WMS.Database.Entities.Addresses;

public class Rack : BaseEntity
{
    public int AreaId { get; set; }

    public int Index { get; set; }

    public Area Area { get; set; } = default!;

    public ICollection<VerticalSection> VerticalSections { get; } = new HashSet<VerticalSection>();
}
