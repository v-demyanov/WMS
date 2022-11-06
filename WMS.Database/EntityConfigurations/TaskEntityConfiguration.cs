namespace WMS.Database.EntityConfigurations;

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

public class TaskEntityConfiguration : IEntityTypeConfiguration<Entities.Task>
{
    public void Configure(EntityTypeBuilder<Entities.Task> builder)
    {
        _ = builder.Property(x => x.Title)
                   .IsRequired();

        _ = builder.Property(x => x.Status)
                   .IsRequired();

        _ = builder.Property(x => x.CreatedDate)
                   .IsRequired()
                   .ValueGeneratedOnAdd();

        _ = builder.Property(x => x.AuthorId)
                   .IsRequired();

        _ = builder.HasOne(x => x.Performer)
                   .WithMany(x => x.PerformerTasks)
                   .HasForeignKey(x => x.PerformerId)
                   .OnDelete(DeleteBehavior.NoAction);

        _ = builder.HasOne(x => x.Author)
                   .WithMany(x => x.AuthorTasks)
                   .HasForeignKey(x => x.AuthorId)
                   .OnDelete(DeleteBehavior.Cascade);

        _ = builder.HasOne(x => x.Auditor)
                   .WithMany(x => x.AuditorTasks)
                   .HasForeignKey(x => x.AuditorId)
                   .OnDelete(DeleteBehavior.NoAction);

        _ = builder.HasOne(x => x.ParentTask)
                   .WithMany(x => x.ChildTasks)
                   .HasForeignKey(x => x.ParentTaskId)
                   .OnDelete(DeleteBehavior.NoAction);
    }
}
