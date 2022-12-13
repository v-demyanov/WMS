namespace WMS.Database.Entities;

public class WareProblem
{
    public int WareId { get; set; }

    public int ProblemId { get; set; }

    public Ware Ware { get; set; } = default!;

    public Problem Problem { get; set; } = default!;
}
