namespace WMS.Database.EntityConfigurations;

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

using WMS.Database.Entities.Addresses;

public class VerticalSectionEntityConfiguration : IEntityTypeConfiguration<VerticalSection>
{
    public void Configure(EntityTypeBuilder<VerticalSection> builder)
    {
        _ = builder.Property(x => x.RackId)
                   .IsRequired();
    }
}
