namespace WMS.Database.Entities.Addresses;

public class Address : BaseEntity
{
    public int AreaId { get; set; }

    public int? ShelfId { get; set; }

    public Area Area { get; set; } = default!;
    
    public Ware Ware { get; set; } = default!;
    
    public Shelf? Shelf { get; set; }

    public ICollection<Problem> Problems { get; } = new HashSet<Problem>();
}
