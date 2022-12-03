namespace WMS.Database.EntityConfigurations;

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

using WMS.Database.Entities.Addresses;

public class ShelfEntityConfiguration : IEntityTypeConfiguration<Shelf>
{
    public void Configure(EntityTypeBuilder<Shelf> builder)
    {
        _ = builder.Property(x => x.VerticalSectionId)
                   .IsRequired();

        _ = builder.HasIndex(x => new { x.Index, x.VerticalSectionId })
                   .IsUnique();
    }
}
