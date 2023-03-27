namespace WMS.WebApi.Extensions;

using Microsoft.AspNetCore.OData;
using Microsoft.OData.Edm;
using Microsoft.OData.ModelBuilder;

using WMS.Database.Entities;
using WMS.Database.Entities.Addresses;
using WMS.Database.Entities.Tenants;
using WMS.Database.Constants;

public static class WmsODataMvcBuilderExtensions
{
    public static IMvcBuilder AddWmsOData(this IMvcBuilder app) =>
        app.AddOData(options => options
            .Select()
            .Filter()
            .OrderBy()
            .Count()
            .Expand()
            .SetMaxTop(ODataSettings.MaxTopValue)
            .AddRouteComponents("api", GetEdmModel()));

    private static IEdmModel GetEdmModel()
    {
        var modelBuilder = new ODataConventionModelBuilder();
        _ = modelBuilder.EntitySet<LegalEntity>("LegalEntities");
        _ = modelBuilder.EntitySet<Rack>("Racks");
        _ = modelBuilder.EntitySet<Ware>("Wares");
        _ = modelBuilder.EntitySet<Area>("Areas");
        _ = modelBuilder.EntitySet<VerticalSection>("VerticalSections");
        _ = modelBuilder.EntitySet<Shelf>("Shelfs");
        _ = modelBuilder.EntitySet<Problem>("Problems");
        _ = modelBuilder.EntitySet<Comment>("Comments");

        ConfigureUserEntityType(modelBuilder);

        return modelBuilder.GetEdmModel();
    }

    private static void ConfigureUserEntityType(ODataConventionModelBuilder modelBuilder)
    {
        modelBuilder.EntitySet<User>("Users").EntityType.Ignore(x => x.Password);
        modelBuilder.EntitySet<User>("Users").EntityType.Ignore(x => x.Salt);
        modelBuilder.EntitySet<User>("Users").EntityType.Ignore(x => x.RefreshToken);
        modelBuilder.EntitySet<User>("Users").EntityType.Ignore(x => x.RefreshTokenSalt);
    }
}
