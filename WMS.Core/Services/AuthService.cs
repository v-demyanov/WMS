namespace WMS.Core.Services;

using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Threading.Tasks;
using Task = Task;
using System.Text;

using WMS.Core.Exceptions;
using WMS.Core.Helpers;
using WMS.Core.Models;
using WMS.Core.Models.Authentication;
using WMS.Core.Services.Abstractions;
using WMS.Database;
using WMS.Database.Entities;

public class AuthService : IAuthService
{
    private readonly AuthOptions _authOptions;
    private readonly IUserService _userService;
    private readonly IHttpContextAccessor _httpContextAccessor;
    private readonly WmsDbContext _dbContext;

    public AuthService(
        IOptions<AuthOptions> authOptions,
        IUserService userService,
        IHttpContextAccessor httpContextAccessor,
        WmsDbContext dbContext)
    {
        this._authOptions = authOptions.Value;
        this._userService = userService;
        this._httpContextAccessor = httpContextAccessor;
        this._dbContext = dbContext;
    }

    public async Task<TokensResponse> LoginAsync(LoginRequest loginRequest)
    {
        User? user = this._userService.GetByEmail(loginRequest.Email);
        if (user == null)
        {
            throw new AuthenticationFailedException("Can't login, because user doesn't exist");
        }

        bool isPasswordNotValid = !SecretHelper.Verify(loginRequest.Password, user.Password, user.Salt);
        if (isPasswordNotValid)
        {
            throw new AuthenticationFailedException("Can't login, because password is not valid");
        }

        var claims = this.GenerateUserClaims(user);
        var tokens = this.GenerateTokens(claims);

        await this.UpdateRefreshTokenAsync(user, tokens.RefreshToken);

        return tokens;
    }

    public async Task<TokensResponse> RefreshTokensAsync(RefreshRequest refreshRequest)
    {
        var identity = this._httpContextAccessor.HttpContext?.User.Identity;
        var currentUser = this._userService.GetByEmail(identity.Name);
        if (currentUser == null)
        {
            throw new AuthenticationFailedException("Can't refresh tokens, because user doesn't exist");
        }

        bool isRefreshTokenValid = this.ValidateToken(refreshRequest.RefreshToken);
        bool doesUserHaveSuchRT = currentUser.RefreshToken != null 
            && currentUser.RefreshTokenSalt != null 
            && SecretHelper.Verify(refreshRequest.RefreshToken, currentUser.RefreshToken, currentUser.RefreshTokenSalt);
        if (!isRefreshTokenValid || !doesUserHaveSuchRT)
        {
            throw new AuthenticationFailedException("Can't refresh tokens, because it is not valid");
        }

        var claims = this.GenerateUserClaims(currentUser);
        var tokens = this.GenerateTokens(claims);

        await this.UpdateRefreshTokenAsync(currentUser, tokens.RefreshToken);

        return tokens;
    }

    private List<Claim> GenerateUserClaims(User user) =>
        new List<Claim>
        {
            new Claim(ClaimTypes.Name, user.Email),
            new Claim(ClaimTypes.Role, user.Role.ToString()),
            new Claim(nameof(user.Id), user.Id.ToString()),
            new Claim(nameof(user.FirstName), user.FirstName),
            new Claim(nameof(user.LastName), user.LastName),
            new Claim(nameof(user.Role), user.Role.ToString()),
            new Claim(nameof(user.Email), user.Email),
        };

    private TokensResponse GenerateTokens(List<Claim> claims)
    {
        var accessToken = new JwtSecurityToken(
            issuer: this._authOptions.Issuer,
            audience: this._authOptions.Audience,
            claims: claims,
            expires: DateTime.UtcNow.Add(TimeSpan.FromMinutes(this._authOptions.AccessTokenExpires)),
            signingCredentials: new SigningCredentials(this._authOptions.GetSymmetricSecurityKey(), SecurityAlgorithms.HmacSha256));

        var refreshToken = new JwtSecurityToken(
            issuer: this._authOptions.Issuer,
            audience: this._authOptions.Audience,
            expires: DateTime.UtcNow.Add(TimeSpan.FromMinutes(this._authOptions.RefreshTokenExpires)),
            signingCredentials: new SigningCredentials(this._authOptions.GetSymmetricSecurityKey(), SecurityAlgorithms.HmacSha256));

        return new TokensResponse
        {
            AccessToken = new JwtSecurityTokenHandler().WriteToken(accessToken),
            RefreshToken = new JwtSecurityTokenHandler().WriteToken(refreshToken),
        };
    }

    private async Task UpdateRefreshTokenAsync(User user, string refreshToken)
    {
        var (hashHex, saltHex) = SecretHelper.Hash(refreshToken);

        user.RefreshToken = hashHex;
        user.RefreshTokenSalt = saltHex;

        _ = await this._dbContext.SaveChangesAsync();
    }

    private bool ValidateToken(string token)
    {
        var tokenHandler = new JwtSecurityTokenHandler();
        var validationParameters = GetValidationParameters();
        try
        {
            var validationResult = tokenHandler.ValidateToken(token, validationParameters, out var securityToken);
            var currentDate = new DateTimeOffset(DateTime.UtcNow);
            return securityToken.ValidTo > currentDate;
        }
        catch (SecurityTokenValidationException)
        {
            return false;
        }
    }

    private TokenValidationParameters GetValidationParameters() =>
        new TokenValidationParameters
        {
            RequireExpirationTime = true,
            ValidateIssuer = true,
            ValidIssuer = this._authOptions.Issuer,
            ValidateAudience = true,
            ValidAudience = this._authOptions.Audience,
            ValidateLifetime = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(this._authOptions.Key)),
            ValidateIssuerSigningKey = true,
        };
}
