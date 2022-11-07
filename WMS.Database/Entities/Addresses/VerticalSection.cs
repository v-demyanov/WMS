namespace WMS.Database.Entities.Addresses;

public class VerticalSection : BaseEntity
{
    public int RackId { get; set; }

    public Rack Rack { get; set; } = default!;

    public ICollection<Shelf> Shelfs { get; } = new HashSet<Shelf>();
}
