namespace WMS.Core.Models.Authentication;

public record TokensResponse
{
    public string AccessToken { get; set; } = string.Empty;

    public string RefreshToken { get; set; } = string.Empty;
}
