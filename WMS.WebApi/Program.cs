using Microsoft.EntityFrameworkCore;

using WMS.Database;
using WMS.Database.Constants;

var builder = WebApplication.CreateBuilder(args);

var corsPolicyName = "Cors";
builder.Services.AddCors(options =>
{
    options.AddPolicy(corsPolicyName, policy =>
    {
        policy.AllowAnyOrigin()
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});


string connectionString = builder.Configuration.GetConnectionString("WMSDatabase");
builder.Services.AddDbContext<WmsDbContext>(options => options.UseSqlServer(connectionString, options =>
{
    options.MigrationsAssembly(EnvironmentSettings.MigrationsAssembly);
}));

var app = builder.Build();

app.UseCors(corsPolicyName);

app.MapGet("/test", () =>
{
    return Results.Json(new
    {
        Id = 1,
        Name = "Vlad",
    });
});

app.Run();
