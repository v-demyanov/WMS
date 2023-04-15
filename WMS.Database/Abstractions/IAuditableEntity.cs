namespace WMS.Database.Abstractions;

public interface IAuditableEntity
{
    public DateTimeOffset CreatedDate { get; set; }
    
    public DateTimeOffset? LastUpdateDate { get; set; }
}