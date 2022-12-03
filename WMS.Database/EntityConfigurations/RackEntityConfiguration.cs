namespace WMS.Database.EntityConfigurations;

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

using WMS.Database.Entities.Addresses;

public class RackEntityConfiguration : IEntityTypeConfiguration<Rack>
{
    public void Configure(EntityTypeBuilder<Rack> builder)
    {
        _ = builder.Property(x => x.AreaId)
                   .IsRequired();

        _ = builder.HasIndex(x => new { x.Index, x.AreaId })
                   .IsUnique();
    }
}
