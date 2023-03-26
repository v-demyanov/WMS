namespace WMS.Core.Services.Abstractions;

using WMS.Core.Models.Authentication;
using WMS.Database.Entities;

public interface IAuthService
{
    Task<TokensResponse> LoginAsync(LoginRequest loginRequest);

    Task<TokensResponse> RefreshTokensAsync(RefreshRequest refreshRequest);

    User GetCurrentUser();
}
