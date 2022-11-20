namespace WMS.Core.Services.Abstractions;

public interface ITemplateService
{
    Task<string> CompileTemplateAsync<TModel>(string templateName, TModel model);
}
