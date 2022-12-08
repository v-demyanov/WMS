namespace WMS.Core.Models.Authentication;

public record RefreshRequest
{
    public string RefreshToken { get; set; } = default!;
}
