namespace WMS.Database.EntityConfigurations;

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

using WMS.Database.Entities.Addresses;

public class AreaEntityConfiguration : IEntityTypeConfiguration<Area>
{
    public void Configure(EntityTypeBuilder<Area> builder)
    {
        _ = builder.HasIndex(x => x.Name)
                   .IsUnique();

        _ = builder.Property(x => x.Name)
                   .IsRequired();
    }
}
