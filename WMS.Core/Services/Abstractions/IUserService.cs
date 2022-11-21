namespace WMS.Core.Services.Abstractions;

using System.Threading.Tasks;
using Task = Task;

using WMS.Database.Entities;
using WMS.Core.Models;

public interface IUserService
{
    IEnumerable<User> GetAll();

    Task<User> CreateAsync(UserCreateData createUserData);

    Task UpdateAsync(int userId, UserUpdateData userUpdateData);

    Task UpdatePasswordAsync(string password);

    Task DeleteAsync(int userId);

    User? GetById(int userId);

    User? GetByEmail(string userEmail);
}
