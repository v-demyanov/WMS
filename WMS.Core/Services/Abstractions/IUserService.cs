namespace WMS.Core.Services.Abstractions;

using System.Threading.Tasks;
using Task = Task;

using WMS.Database.Entities;

public interface IUserService
{
    IEnumerable<User> GetAll();

    Task<User> CreateAsync(User user);

    Task UpdateAsync(int userId, User userUpdateData);

    Task DeleteAsync(int userId);
}
