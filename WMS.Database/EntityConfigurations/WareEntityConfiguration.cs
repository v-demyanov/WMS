﻿namespace WMS.Database.EntityConfigurations;

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

using WMS.Database.Entities;

public class WareEntityConfiguration : IEntityTypeConfiguration<Ware>
{
    public void Configure(EntityTypeBuilder<Ware> builder)
    {
        _ = builder.Property(x => x.Name)
                   .IsRequired();

        _ = builder.Property(x => x.TechnicalParameterValue)
                   .IsRequired();
        
        _ = builder.Property(x => x.ReceivingDate)
                   .IsRequired();
        
        _ = builder.HasIndex(x => x.AddressId)
                   .IsUnique();

        _ = builder.HasOne(x => x.Address)
                   .WithOne(x => x.Ware)
                   .OnDelete(DeleteBehavior.NoAction);
    }
}
