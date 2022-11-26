namespace WMS.WebApi.Extensions;

using Microsoft.AspNetCore.OData;
using Microsoft.OData.Edm;
using Microsoft.OData.ModelBuilder;

using WMS.Database.Entities.Tenants;

public static class WmsODataMvcBuilderExtensions
{
    public static IMvcBuilder AddWmsOData(this IMvcBuilder app) =>
        app.AddOData(options => options
            .Select()
            .Filter()
            .OrderBy()
            .Count()
            .Expand()
            .AddRouteComponents("api", GetEdmModel()));

    private static IEdmModel GetEdmModel()
    {
        var modelBuilder = new ODataConventionModelBuilder();
        _ = modelBuilder.EntitySet<LegalEntity>("LegalEntities");

        return modelBuilder.GetEdmModel();
    }
}
