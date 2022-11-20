namespace WMS.Database.EntityConfigurations;

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

using WMS.Database.Entities;

public class UserEntityConfiguration : IEntityTypeConfiguration<User>
{
    public void Configure(EntityTypeBuilder<User> builder)
    {
        _ = builder.Property(x => x.Role)
                   .IsRequired();

        _ = builder.Property(x => x.FirstName)
                   .IsRequired();

        _ = builder.Property(x => x.LastName)
                   .IsRequired();

        _ = builder.Property(x => x.Email)
                   .IsRequired();

        _ = builder.Property(x => x.Password)
                   .IsRequired();

        _ = builder.Property(x => x.Salt)
                   .IsRequired();

        _ = builder.HasIndex(x => x.Email)
                   .IsUnique();
    }
}
