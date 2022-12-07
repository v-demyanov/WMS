namespace WMS.Core.Services;

using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;

using WMS.Core.Exceptions;
using WMS.Core.Helpers;
using WMS.Core.Models;
using WMS.Core.Services.Abstractions;
using WMS.Database.Entities;

public class AuthService : IAuthService
{
    private readonly AuthOptions _authOptions;
    private readonly IUserService _userService;

    public AuthService(IOptions<AuthOptions> authOptions, IUserService userService)
    {
        this._authOptions = authOptions.Value;
        this._userService = userService;
    }

    public LoginResponse Login(LoginData loginData)
    {
        User? user = this._userService.GetByEmail(loginData.Email);
        if (user == null)
        {
            throw new AuthenticationFailedException("Can't login, because user doesn't exist");
        }

        bool isPasswordNotValid = !SecretHelper.Verify(loginData.Password, user.Password, user.Salt);
        if (isPasswordNotValid)
        {
            throw new AuthenticationFailedException("Can't login, because password is not valid");
        }

        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.Name, loginData.Email),
            new Claim(ClaimTypes.Role, user.Role.ToString()),
            new Claim(nameof(user.Id), user.Id.ToString()),
            new Claim(nameof(user.FirstName), user.FirstName),
            new Claim(nameof(user.LastName), user.LastName),
            new Claim(nameof(user.Role), user.Role.ToString()),
            new Claim(nameof(user.Email), user.Email),
        };

        var jwt = new JwtSecurityToken(
            issuer: this._authOptions.Issuer,
            audience: this._authOptions.Audience,
            claims: claims,
            expires: DateTime.UtcNow.Add(TimeSpan.FromMinutes(this._authOptions.Expires)),
            signingCredentials: new SigningCredentials(this._authOptions.GetSymmetricSecurityKey(), SecurityAlgorithms.HmacSha256));

        return new LoginResponse
        {
            Jwt = new JwtSecurityTokenHandler().WriteToken(jwt),
        };
    }
}
