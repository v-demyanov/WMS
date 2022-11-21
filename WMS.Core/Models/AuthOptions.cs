namespace WMS.Core.Models;

using Microsoft.IdentityModel.Tokens;
using System.Text;

public class AuthOptions
{
    public string? Issuer { get; set; }

    public string? Audience { get; set; }

    public string? Key { get; set; }

    public int Expires { get; set; }

    public SymmetricSecurityKey GetSymmetricSecurityKey() =>
        new SymmetricSecurityKey(Encoding.UTF8.GetBytes(this.Key ?? string.Empty));
}
