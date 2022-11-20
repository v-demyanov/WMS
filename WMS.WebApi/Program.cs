using Microsoft.EntityFrameworkCore;
using System.Reflection;
using System.Net;
using Microsoft.AspNetCore.Diagnostics;
using Serilog;

using WMS.Database;
using WMS.Database.Constants;
using WMS.Core.Services.Abstractions;
using WMS.Core.Services;
using WMS.Core.Exceptions;
using WMS.Core.Models;

var builder = WebApplication.CreateBuilder(args);

_ = builder.Host.UseSerilog((context, configuration) => configuration
    .ReadFrom.Configuration(context.Configuration));

builder.Services.AddControllers();

builder.Services
    .AddScoped<IUserService, UserService>()
    .AddScoped<IMailService, MailService>()
    .AddScoped<ITemplateService, TemplateService>();

builder.Services.Configure<MailSettings>(builder.Configuration.GetSection(nameof(MailSettings)));

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

builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc(
        "v1",
        new()
        {
            Title = "WMS API",
            Version = "v1",
        });

    var entryAssembly = Assembly.GetExecutingAssembly();
    if (entryAssembly != null)
    {
        var xmlFilename = $"{entryAssembly.GetName().Name}.xml";
        var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFilename);
        options.IncludeXmlComments(xmlPath);
    }
});

var app = builder.Build();

Log.Logger = app.Services.GetService<Serilog.ILogger>();

if (builder.Environment.IsDevelopment())
{
    _ = app.UseSwagger();
    _ = app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "WMS API"));
}

app.UseExceptionHandler(app => app.Run(async context =>
{
    var exception = context.Features.Get<IExceptionHandlerFeature>()?.Error;

    context.Response.StatusCode = exception switch
    {
        ApiOperationFailedException => (int)HttpStatusCode.BadRequest,
        _ => (int)HttpStatusCode.InternalServerError,
    };

    await context.Response.WriteAsJsonAsync(new
    {
        StatusCode = context.Response.StatusCode,
        ErrorMessage = exception?.Message ?? string.Empty,
    });
}));

app.UseCors(corsPolicyName);

app.MapControllers();

app.Run();
