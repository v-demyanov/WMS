namespace WMS.Database.EntityConfigurations;

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

using WMS.Database.Entities;

public class WareProblemEntityConfiguration : IEntityTypeConfiguration<WareProblem>
{
    public void Configure(EntityTypeBuilder<WareProblem> builder)
    {
        _ = builder.HasKey(x => new { x.ProblemId, x.WareId });

        _ = builder.HasOne(x => x.Ware)
                   .WithMany(x => x.Problems)
                   .HasForeignKey(x => x.WareId);

        _ = builder.HasOne(x => x.Problem)
                   .WithMany(x => x.Wares)
                   .HasForeignKey(x => x.ProblemId);
    }
}
