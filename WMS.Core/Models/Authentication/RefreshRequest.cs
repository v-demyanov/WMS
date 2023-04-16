namespace WMS.Core.Models.Authentication;

public record RefreshRequest
{
    public string AccessToken { get; set; } = default!;

    public string RefreshToken { get; set; } = default!;
}
