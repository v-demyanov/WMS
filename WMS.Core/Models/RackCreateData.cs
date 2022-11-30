namespace WMS.Core.Models;

public record RackCreateData
{
    public int AreaId { get; set; }

    public int VerticalSectionsCount { get; set; }

    public int ShelfsCount { get; set; }
}
