namespace WMS.Database.EntityConfigurations;

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

using WMS.Database.Entities;

public class WareTaskEntityConfiguration : IEntityTypeConfiguration<WareTask>
{
    public void Configure(EntityTypeBuilder<WareTask> builder)
    {
        _ = builder.HasKey(x => new { x.TaskId, x.WareId });

        _ = builder.HasOne(x => x.Ware)
                   .WithMany(x => x.Tasks)
                   .HasForeignKey(x => x.WareId);

        _ = builder.HasOne(x => x.Task)
                   .WithMany(x => x.Wares)
                   .HasForeignKey(x => x.TaskId);
    }
}
