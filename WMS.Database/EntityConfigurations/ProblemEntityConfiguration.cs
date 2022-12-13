namespace WMS.Database.EntityConfigurations;

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

using WMS.Database.Entities;

public class ProblemEntityConfiguration : IEntityTypeConfiguration<Problem>
{
    public void Configure(EntityTypeBuilder<Problem> builder)
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
                   .WithMany(x => x.PerformerProblems)
                   .HasForeignKey(x => x.PerformerId)
                   .OnDelete(DeleteBehavior.NoAction);

        _ = builder.HasOne(x => x.Author)
                   .WithMany(x => x.AuthorProblems)
                   .HasForeignKey(x => x.AuthorId)
                   .OnDelete(DeleteBehavior.Cascade);

        _ = builder.HasOne(x => x.Auditor)
                   .WithMany(x => x.AuditorProblems)
                   .HasForeignKey(x => x.AuditorId)
                   .OnDelete(DeleteBehavior.NoAction);

        _ = builder.HasOne(x => x.ParentProblem)
                   .WithMany(x => x.ChildrenProblems)
                   .HasForeignKey(x => x.ParentProblemId)
                   .OnDelete(DeleteBehavior.NoAction);
    }
}
