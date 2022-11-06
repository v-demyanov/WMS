namespace WMS.Database;

using Microsoft.EntityFrameworkCore;

using WMS.Database.Entities;
using WMS.Database.Entities.Dictionaries;

public class WmsDbContext : DbContext
{
    public WmsDbContext(DbContextOptions<WmsDbContext> options)
        : base(options) { }

    public DbSet<User> Users => this.Set<User>();

    public DbSet<Task> Tasks => this.Set<Task>();

    public DbSet<Comment> Comments => this.Set<Comment>();

    public DbSet<Ware> Wares => this.Set<Ware>();

    public DbSet<UnitOfMeasurement> UnitsOfMeasurement => this.Set<UnitOfMeasurement>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        _ = modelBuilder.ApplyConfigurationsFromAssembly(typeof(WmsDbContext).Assembly);
    }
}
