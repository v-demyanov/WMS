namespace WMS.Database;

using Microsoft.EntityFrameworkCore;

using WMS.Database.Entities;
using WMS.Database.Entities.Addresses;
using WMS.Database.Entities.Dictionaries;
using WMS.Database.Entities.Tenants;

public class WmsDbContext : DbContext
{
    public WmsDbContext(DbContextOptions<WmsDbContext> options)
        : base(options) { }

    public DbSet<User> Users => this.Set<User>();

    public DbSet<Problem> Problems => this.Set<Problem>();

    public DbSet<Comment> Comments => this.Set<Comment>();

    public DbSet<Ware> Wares => this.Set<Ware>();

    public DbSet<UnitOfMeasurement> UnitsOfMeasurement => this.Set<UnitOfMeasurement>();

    public DbSet<Shelf> Shelfs => this.Set<Shelf>();

    public DbSet<VerticalSection> VerticalSections => this.Set<VerticalSection>();

    public DbSet<Rack> Racks => this.Set<Rack>();

    public DbSet<Area> Areas => this.Set<Area>();

    public DbSet<Address> Addresses => this.Set<Address>();

    public DbSet<WareProblem> WareProblems => this.Set<WareProblem>();

    public DbSet<Individual> Individuals => this.Set<Individual>();

    public DbSet<LegalEntity> LegalEntities => this.Set<LegalEntity>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);
        _ = modelBuilder.ApplyConfigurationsFromAssembly(typeof(WmsDbContext).Assembly);
    }
}
