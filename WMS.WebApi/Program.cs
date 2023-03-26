using Microsoft.EntityFrameworkCore;
using System.Reflection;
using System.Net;
using Microsoft.AspNetCore.Diagnostics;
using Serilog;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using FluentValidation.AspNetCore;

using WMS.Database;
using WMS.Database.Constants;
using WMS.Core.Services.Abstractions;
using WMS.Core.Services;
using WMS.Core.Exceptions;
using WMS.Core.Models;
using WMS.Core.Services.Abstractions.Tenants;
using WMS.Core.Services.Tenants;
using WMS.WebApi.Extensions;
using WMS.Core.Validators;
using WMS.Core.Services.Abstractions.Dictionaries;
using WMS.Core.Services.Dictionaries;
using WMS.Core.Services.Abstractions.Addresses;
using WMS.Core.Services.Addresses;

var builder = WebApplication.CreateBuilder(args);

_ = builder.Host.UseSerilog((context, configuration) => configuration
    .ReadFrom.Configuration(context.Configuration));

builder.Services
    .AddControllers()
    .AddJsonOptions(options => options.JsonSerializerOptions.PropertyNamingPolicy = null)
    .AddWmsOData();

#pragma warning disable CS0618 // Type or member is obsolete
builder.Services
    .AddFluentValidation(config => config.AutomaticValidationEnabled = false)
#pragma warning restore CS0618 // Type or member is obsolete
    .AddScoped<LegalEntityValidator, LegalEntityValidator>()
    .AddScoped<RackCreateDataValidator, RackCreateDataValidator>()
    .AddScoped<AddressValidator, AddressValidator>()
    .AddScoped<WareValidator, WareValidator>();

builder.Services
    .AddHttpContextAccessor()
    .AddScoped<IUserService, UserService>()
    .AddScoped<IMailService, MailService>()
    .AddScoped<ITemplateService, TemplateService>()
    .AddScoped<IAuthService, AuthService>()
    .AddScoped<IIndividualService, IndividualService>()
    .AddScoped<ILegalEntityService, LegalEntityService>()
    .AddScoped<IAreaService, AreaService>()
    .AddScoped<IRackService, RackService>()
    .AddScoped<IShelfService, ShelfService>()
    .AddScoped<IVerticalSectionService, VerticalSectionService>()
    .AddScoped<IUnitOfMeasurementService, UnitOfMeasurementService>()
    .AddScoped<IWareService, WareService>()
    .AddScoped<IProblemService, ProblemService>()
    .AddScoped<ICommentService, CommentService>();

builder.Services.Configure<MailSettings>(builder.Configuration.GetSection(nameof(MailSettings)))
                .Configure<AuthOptions>(builder.Configuration.GetSection(nameof(AuthOptions)));

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

var key = Encoding.UTF8.GetBytes(builder.Configuration["AuthOptions:Key"]);
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            RequireExpirationTime = true,
            ValidateIssuer = true,
            ValidIssuer = builder.Configuration["AuthOptions:Issuer"],
            ValidateAudience = true,
            ValidAudience = builder.Configuration["AuthOptions:Audience"],
            ValidateLifetime = true,
            IssuerSigningKey = new SymmetricSecurityKey(key),
            ValidateIssuerSigningKey = true,
        };
    });

var app = builder.Build();

app.UseAuthentication();
app.UseAuthorization();

Log.Logger = app.Services.GetService<Serilog.ILogger>();

//if (builder.Environment.IsDevelopment())
//{
//    _ = app.UseSwagger();
//    _ = app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "WMS API"));
//}

_ = app.UseSwagger();
_ = app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "WMS API"));

app.UseExceptionHandler(app => app.Run(async context =>
{
    var exception = context.Features.Get<IExceptionHandlerFeature>()?.Error;

    context.Response.StatusCode = exception switch
    {
        ApiOperationFailedException => (int)HttpStatusCode.BadRequest,
        EntityNotFoundException => (int)HttpStatusCode.NotFound,
        AuthenticationFailedException => (int)HttpStatusCode.Unauthorized,
        AuthorizationFailedException => (int)HttpStatusCode.Forbidden,
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
