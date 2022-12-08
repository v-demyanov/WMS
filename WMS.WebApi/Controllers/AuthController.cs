namespace WMS.WebApi.Controllers;

using Microsoft.AspNetCore.Authorization;
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

    [HttpPost("Login")]
    public async Task<TokensResponse> Login([FromBody] LoginRequest loginRequest) => 
        await this._authService.LoginAsync(loginRequest);

    [Authorize]
    [HttpPost("Refresh")]
    public async Task<TokensResponse> Refresh([FromBody] RefreshRequest refreshRequest) => 
        await this._authService.RefreshTokensAsync(refreshRequest);
}
