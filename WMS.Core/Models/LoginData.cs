namespace WMS.Core.Models;

public record LoginData
{
    public string Email { get; set; } = default!;

    public string Password { get; set; } = default!;
}
