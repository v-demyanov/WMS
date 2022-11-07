namespace WMS.Database.Entities.Addresses;

public class Address : BaseEntity
{
    public int AreaId { get; set; }

    public int? RackId { get; set; }

    public int? VerticalSectionId { get; set; }

    public int? ShelfId { get; set; }

    public Area Area { get; set; } = default!;

    public Rack? Rack { get; set; }

    public VerticalSection? VerticalSection { get; set; }

    public Shelf? Shelf { get; set; }
}
