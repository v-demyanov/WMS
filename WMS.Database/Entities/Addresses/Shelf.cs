namespace WMS.Database.Entities.Addresses;

public class Shelf : BaseEntity
{
    public int VerticalSectionId { get; set; }

    public int Index { get; set; }

    public VerticalSection VerticalSection { get; set; } = default!;

    public Address? Address { get; set; }
}
