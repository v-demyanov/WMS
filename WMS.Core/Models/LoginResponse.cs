namespace WMS.Core.Models;

public record LoginResponse
{
    public string Jwt { get; set; } = string.Empty;
}
