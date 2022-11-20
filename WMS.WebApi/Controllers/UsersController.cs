namespace WMS.WebApi.Controllers;

using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using Task = Task;

using WMS.Core.Services.Abstractions;
using WMS.Database.Entities;

/// <summary>
/// Manages users' accounts.
/// </summary>
[Route("api/[controller]")]
[ApiController]
public class UsersController : ControllerBase
{
    private readonly IUserService _userService;

    public UsersController(IUserService userService)
    {
        _userService = userService;
    }

    /// <summary>
    /// Get all users.
    /// </summary>
    /// <returns>Collection of users.</returns>
    [HttpGet]
    public IEnumerable<User> GetAll() => this._userService.GetAll();

    /// <summary>
    /// Creates a new user.
    /// </summary>
    /// <param name="user">Record model to create.</param>
    /// <returns>Created user.</returns>
    [HttpPost]
    public async Task<User> Post([FromBody] User user) => await this._userService.CreateAsync(user);

    /// <summary>
    /// Deletes user by id.
    /// </summary>
    /// <param name="userId">User Id.</param>
    [HttpDelete("{userId:int}")]
    public async Task Delete(int userId) => await this._userService.DeleteAsync(userId);
}
