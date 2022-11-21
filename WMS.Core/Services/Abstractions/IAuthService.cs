namespace WMS.Core.Services.Abstractions;

using WMS.Core.Models;

public interface IAuthService
{
    LoginResponse Login(LoginData loginData);
}
