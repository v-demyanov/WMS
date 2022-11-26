namespace WMS.Database.EntityConfigurations;

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

using WMS.Database.Entities.Tenants;

public class IndividualEntityConfiguration : IEntityTypeConfiguration<Individual>
{
    public void Configure(EntityTypeBuilder<Individual> builder)
    {
        _ = builder.Property(x => x.FirstName)
                   .IsRequired();

        _ = builder.Property(x => x.LastName)
                   .IsRequired();

        _ = builder.Property(x => x.SurName)
                   .IsRequired();

        _ = builder.Property(x => x.PassportNumber)
                   .IsRequired();

        _ = builder.HasIndex(x => x.PassportNumber)
                   .IsUnique();

        _ = builder.Property(x => x.Type)
                   .IsRequired();

        _ = builder.Property(x => x.Phone)
                   .IsRequired();

        _ = builder.Property(x => x.Address)
                   .IsRequired();
    }
}
