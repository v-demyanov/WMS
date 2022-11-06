using Microsoft.EntityFrameworkCore;

using WMS.Database;
using WMS.Database.Constants;

var builder = WebApplication.CreateBuilder(args);

string connectionString = builder.Configuration.GetConnectionString("WMSDatabase");
builder.Services.AddDbContext<WmsDbContext>(options => options.UseSqlServer(connectionString, options =>
{
    options.MigrationsAssembly(EnvironmentSettings.MigrationsAssembly);
}));

var app = builder.Build();
app.Run();
