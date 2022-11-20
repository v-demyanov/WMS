namespace WMS.Core.Services;

using RazorEngineCore;
using System.Reflection;
using System.Threading.Tasks;

using WMS.Core.Services.Abstractions;

public class TemplateService : ITemplateService
{
    public async Task<string> CompileTemplateAsync<TModel>(string templateName, TModel model)
    {
        var assemblyLocation = Path.GetDirectoryName(Assembly.GetExecutingAssembly().Location);
        var pathToTemplate = Path.Combine(assemblyLocation, "Templates", templateName);
        var template = await File.ReadAllTextAsync(pathToTemplate);

        var razorEngine = new RazorEngine();
        var compiledTemplate = await razorEngine.CompileAsync(template);

        return await compiledTemplate.RunAsync(model);
    }
}
