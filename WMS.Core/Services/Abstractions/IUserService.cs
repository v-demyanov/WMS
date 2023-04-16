namespace WMS.Core.Services.Abstractions;

using System.Threading.Tasks;
using Task = Task;

using WMS.Database.Entities;
using WMS.Core.Models;

public interface IUserService
{
    IEnumerable<UserRecord> GetAll();

    Task<UserRecord> CreateAsync(UserRecord userCreateData);

    Task UpdateAsync(int userId, UserRecord userUpdateData);

    Task UpdatePasswordAsync(string password);

    Task DeleteAsync(int userId);

    User? GetById(int userId);

    User? GetByEmail(string? userEmail);
    
    User? GetCurrentUser();
}
