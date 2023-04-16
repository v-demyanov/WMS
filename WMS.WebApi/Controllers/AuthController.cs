namespace WMS.WebApi.Controllers;

using Microsoft.AspNetCore.Mvc;

using WMS.Core.Models.Authentication;
using WMS.Core.Services.Abstractions;

/// <summary>
/// Manages authentication.
/// </summary>
[Route("api/[controller]")]
[ApiController]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        this._authService = authService;
    }

    /// <summary>
    /// Logged in system.
    /// </summary>
    /// <param name="loginRequest">Authentication data.</param>
    /// <returns>Refresh and Access JWT.</returns>
    [HttpPost("Login")]
    public async Task<TokensResponse> Login([FromBody] LoginRequest loginRequest) => 
        await this._authService.LoginAsync(loginRequest);

    /// <summary>
    /// Refreshes tokens.
    /// </summary>
    /// <param name="refreshRequest">Expired JWT and JWT to refresh it.</param>
    /// <returns>Refresh and Access JWT.</returns>
    [HttpPost("Refresh")]
    public async Task<TokensResponse> Refresh([FromBody] RefreshRequest refreshRequest) => 
        await this._authService.RefreshTokensAsync(refreshRequest);
}
