namespace WMS.Core.Models;

public record LoginResponse
{
    public string AccessToken { get; set; } = string.Empty;
}
