namespace WMS.Database.EntityConfigurations;

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

using WMS.Database.Entities.Addresses;

public class AddressEntityConfiguration : IEntityTypeConfiguration<Address>
{
    public void Configure(EntityTypeBuilder<Address> builder)
    {
        _ = builder.Property(x => x.AreaId)
                   .IsRequired();

        _ = builder.HasOne(x => x.Shelf)
                   .WithOne(x => x.Address)
                   .OnDelete(DeleteBehavior.NoAction);
    }
}
