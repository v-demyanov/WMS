namespace WMS.Database.Entities;

public class WareTask
{
    public int WareId { get; set; }

    public int TaskId { get; set; }

    public Ware Ware { get; set; } = default!;

    public Task Task { get; set; } = default!;
}
