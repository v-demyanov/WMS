namespace WMS.WebApi.Controllers;

using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using System.Net;

using WMS.Core.Services.Abstractions;
using WMS.Database.Enums;
using WMS.Core.Models;

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
        // TODO: Replace user entity class on record
        _userService = userService;
    }

    /// <summary>
    /// Get all users.
    /// </summary>
    /// <returns>Collection of users.</returns>
    [HttpGet]
    [Authorize(Roles = nameof(Role.Administrator))]
    public IEnumerable<UserRecord> GetAll() => this._userService.GetAll();

    /// <summary>
    /// Creates a new user.
    /// </summary>
    /// <param name="userCreateData">Data to create new user.</param>
    /// <returns>Created user.</returns>
    [HttpPost]
    [Authorize(Roles = nameof(Role.Administrator))]
    public async Task<ActionResult<UserRecord>> Post([FromBody] UserRecord userCreateData)
    {
        this.Response.StatusCode = (int)HttpStatusCode.Created;
        return await this._userService.CreateAsync(userCreateData);
    }

    /// <summary>
    /// Deletes user by id.
    /// </summary>
    /// <param name="userId">User Id.</param>
    [HttpDelete("{userId:int}")]
    [Authorize(Roles = nameof(Role.Administrator))]
    public async Task<ActionResult> Delete(int userId)
    {
        await this._userService.DeleteAsync(userId);
        return this.NoContent();
    }

    /// <summary>
    /// Updates user general info.
    /// </summary>
    /// <param name="userId">User Id.</param>
    /// <param name="userUpdateData">User create data.</param>
    [HttpPut("{userId:int}")]
    [Authorize(Roles = nameof(Role.Administrator))]
    public async Task<ActionResult> Update(int userId, [FromBody] UserRecord userUpdateData)
    {
        await this._userService.UpdateAsync(userId, userUpdateData);
        return this.NoContent();
    }

    /// <summary>
    /// Sets a new password.
    /// </summary>
    /// <param name="password">New password.</param>
    [HttpPut("setPassword")]
    [Authorize]
    public async Task<ActionResult> UpdatePassword([FromBody] string password)
    {
        await this._userService.UpdatePasswordAsync(password);
        return this.NoContent();
    }
        
}
