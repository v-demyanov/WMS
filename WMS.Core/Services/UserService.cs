namespace WMS.Core.Services;

using System.Collections.Generic;
using System.Threading.Tasks;
using Task = Task;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

using WMS.Core.Services.Abstractions;
using WMS.Database;
using WMS.Database.Entities;
using WMS.Core.Exceptions;
using WMS.Core.Helpers;
using WMS.Core.Models.Templates;
using WMS.Core.Models;

public class UserService : IUserService
{
    private readonly WmsDbContext _dbContext;
    private readonly IMailService _mailService;
    private readonly ITemplateService _templateService;
    private readonly IHttpContextAccessor _httpContextAccessor;

    public UserService(
        WmsDbContext dbContext,
        IMailService mailService,
        ITemplateService templateService,
        IHttpContextAccessor httpContextAccessor)
    {
        this._dbContext = dbContext;
        this._mailService = mailService;
        this._templateService = templateService;
        this._httpContextAccessor = httpContextAccessor;
    }

    public async Task<UserRecord> CreateAsync(UserRecord userCreateData)
    {
        bool hasUserAlreadyBeenAdded = this.GetByEmail(userCreateData.Email) != null;
        if (hasUserAlreadyBeenAdded)
        {
            throw new ApiOperationFailedException("Can't create user, because it has already been added.");
        }

        var password = SecretHelper.GeneratePassword();
        var (hashHex, saltHex) = SecretHelper.Hash(password);

        var user = UserHelper.Parse(userCreateData);
        user.Password = hashHex;
        user.Salt = saltHex;

        _ = await _dbContext.Users.AddAsync(user);
        _ = await _dbContext.SaveChangesAsync();

        var templateName = "Welcome.cshtml";
        var subject = "Welcome to WMS!";

        var body = await this._templateService.CompileTemplateAsync(templateName, new WelcomeModel
        {
            Email = user.Email,
            UserName = user.FirstName,
            Password = password,
        });
        this._mailService.SendMail(body, subject, new[] { user.Email });

        return UserHelper.ToRecord(user);
    }

    public async Task DeleteAsync(int userId)
    {
        var user = this.GetById(userId);
        if (user == null)
        {
            throw new ApiOperationFailedException("Can't delete user, because it doesn't exist.");
        }

        var identity = this._httpContextAccessor.HttpContext?.User.Identity;
        if (identity?.Name == user.Email)
        {
            throw new ApiOperationFailedException("Can't delete yourself");
        }

        _ = this._dbContext.Users.Remove(user);
        _ = await this._dbContext.SaveChangesAsync();
    }

    public IEnumerable<UserRecord> GetAll() => this._dbContext.Users.Select(x => UserHelper.ToRecord(x));

    public async Task UpdateAsync(int userId, UserRecord userUpdateData)
    {
        var user = this.GetById(userId);
        if (user == null)
        {
            throw new ApiOperationFailedException("Can't update user, because it doesn't exist.");
        }

        var identity = this._httpContextAccessor.HttpContext?.User.Identity;
        var currentUser = this.GetByEmail(identity.Name);
        var doesUserTryToUpdateHisRole = currentUser?.Id == userId && currentUser.Role != userUpdateData.Role;
        if (doesUserTryToUpdateHisRole)
        {
            throw new ApiOperationFailedException("Can't update role, when you try to update yourself.");
        }

        UserHelper.Populate(user, userUpdateData);
        this._dbContext.Entry(user).State = EntityState.Modified;

        _ = await this._dbContext.SaveChangesAsync();
    }

    public async Task UpdatePasswordAsync(string password)
    {
        var identity = this._httpContextAccessor.HttpContext?.User.Identity;
        var currentUser = this.GetByEmail(identity.Name);
        if (currentUser == null)
        {
            throw new ApiOperationFailedException("Can't update user, because it doesn't exist.");
        }

        var (hashHex, saltHex) = SecretHelper.Hash(password);
        currentUser.Password = hashHex;
        currentUser.Salt = saltHex;

        this._dbContext.Entry(currentUser).State = EntityState.Modified;

        _ = await this._dbContext.SaveChangesAsync();
    }

    public User? GetById(int userId) => this._dbContext.Users.FirstOrDefault(user => user.Id == userId);

    public User? GetByEmail(string userEmail) => this._dbContext.Users.FirstOrDefault(user => user.Email == userEmail);
}
