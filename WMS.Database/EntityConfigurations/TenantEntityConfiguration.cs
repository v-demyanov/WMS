namespace WMS.Database.EntityConfigurations;

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

using WMS.Database.Entities.Tenants;

public class TenantEntityConfiguration : IEntityTypeConfiguration<Tenant>
{
    public void Configure(EntityTypeBuilder<Tenant> builder)
    {
        _ = builder.Property(x => x.Type)
                   .IsRequired();

        _ = builder.Property(x => x.Phone)
                   .IsRequired();

        _ = builder.Property(x => x.Address)
                   .IsRequired();
    }
}
