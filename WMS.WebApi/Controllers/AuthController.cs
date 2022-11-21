namespace WMS.WebApi.Controllers;

using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

using WMS.Core.Models;
using WMS.Core.Services.Abstractions;
using WMS.Database.Enums;

/// <summary>
/// Manages authentication.
/// </summary>
[Route("api/[controller]")]
[ApiController]
public class AuthController : ControllerBase
{
    private readonly AuthOptions _authOptions;
    private readonly IAuthService _authService;

    public AuthController(IOptions<AuthOptions> authOptions, IAuthService authService)
    {
        this._authOptions = authOptions.Value;
        this._authService = authService;
    }

    [HttpPost]
    public LoginResponse Login([FromBody] LoginData loginData) => this._authService.Login(loginData);
}
