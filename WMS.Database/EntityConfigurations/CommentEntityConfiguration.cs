namespace WMS.Database.EntityConfigurations;

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

using WMS.Database.Entities;

public class CommentEntityConfiguration : IEntityTypeConfiguration<Comment>
{
    public void Configure(EntityTypeBuilder<Comment> builder)
    {
        _ = builder.Property(x => x.CreatedDate)
                   .IsRequired()
                   .ValueGeneratedOnAdd();

        _ = builder.HasOne(x => x.Owner)
                   .WithMany(x => x.Comments)
                   .HasForeignKey(x => x.OwnerId)
                   .OnDelete(DeleteBehavior.NoAction);
    }
}
