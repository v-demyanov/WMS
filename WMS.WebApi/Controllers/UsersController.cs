﻿namespace WMS.WebApi.Controllers;

using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using Task = Task;
using Microsoft.AspNetCore.Authorization;

using WMS.Core.Services.Abstractions;
using WMS.Database.Entities;
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
        _userService = userService;
    }

    /// <summary>
    /// Get all users.
    /// </summary>
    /// <returns>Collection of users.</returns>
    [HttpGet]
    [Authorize(Roles = nameof(Role.Administrator))]
    public IEnumerable<User> GetAll() => this._userService.GetAll();

    /// <summary>
    /// Creates a new user.
    /// </summary>
    /// <param name="userCreateData">Record model to create.</param>
    /// <returns>Created user.</returns>
    [HttpPost]
    [Authorize(Roles = nameof(Role.Administrator))]
    public async Task<User> Post([FromBody] UserCreateData userCreateData) =>
        await this._userService.CreateAsync(userCreateData);

    /// <summary>
    /// Deletes user by id.
    /// </summary>
    /// <param name="userId">User Id.</param>
    [HttpDelete("{userId:int}")]
    [Authorize(Roles = nameof(Role.Administrator))]
    public async Task Delete(int userId) => await this._userService.DeleteAsync(userId);

    /// <summary>
    /// Updates user general info.
    /// </summary>
    /// <param name="userId">User Id.</param>
    /// <param name="userUpdateData">User create data.</param>
    [HttpPut("{userId:int}")]
    public async Task Update(int userId, [FromBody] UserUpdateData userUpdateData) => 
        await this._userService.UpdateAsync(userId, userUpdateData);

    /// <summary>
    /// Sets a new password.
    /// </summary>
    /// <param name="password">New password.</param>
    [HttpPut("setPassword")]
    [Authorize]
    public async Task UpdatePassword([FromBody] string password) => 
        await this._userService.UpdatePasswordAsync(password);
}
