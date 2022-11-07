namespace WMS.Database.EntityConfigurations;

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

using WMS.Database.Entities.Tenants;

public class LegalEntityEntityConfiguration : IEntityTypeConfiguration<LegalEntity>
{
    public void Configure(EntityTypeBuilder<LegalEntity> builder)
    {
        _ = builder.Property(x => x.Name)
                   .IsRequired();

        _ = builder.Property(x => x.UNN)
                   .IsRequired();

        _ = builder.HasIndex(x => x.UNN)
                   .IsUnique();

        _ = builder.Property(x => x.TenantId)
                   .IsRequired();
    }
}
