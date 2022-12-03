namespace WMS.WebApi.Extensions;

using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.OData;
using Microsoft.OData.Edm;
using Microsoft.OData.ModelBuilder;

using WMS.Core.Models;
using WMS.Database.Entities;
using WMS.Database.Entities.Addresses;
using WMS.Database.Entities.Tenants;
using WMS.WebApi.Controllers.Addresses;

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
        _ = modelBuilder.EntitySet<Rack>("Racks");
        _ = modelBuilder.EntitySet<Ware>("Wares");

        return modelBuilder.GetEdmModel();
    }
}
