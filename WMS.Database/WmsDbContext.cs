namespace WMS.Database;

using Microsoft.EntityFrameworkCore;

using WMS.Database.Entities;
using WMS.Database.Entities.Addresses;
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

    public DbSet<Shelf> Shelfs => this.Set<Shelf>();

    public DbSet<VerticalSection> VerticalSections => this.Set<VerticalSection>();

    public DbSet<Rack> Racks => this.Set<Rack>();

    public DbSet<Area> Areas => this.Set<Area>();

    public DbSet<Address> Addresses => this.Set<Address>();

    public DbSet<WareTask> WareTasks => this.Set<WareTask>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        _ = modelBuilder.ApplyConfigurationsFromAssembly(typeof(WmsDbContext).Assembly);
    }
}
