namespace WMS.Core.Services;

using System.Collections.Generic;
using System.Threading.Tasks;
using Task = Task;

using WMS.Core.Services.Abstractions;
using WMS.Database;
using WMS.Database.Entities;
using WMS.Core.Exceptions;
using WMS.Core.Helpers;
using WMS.Core.Models.Templates;

public class UserService : IUserService
{
    private readonly WmsDbContext _dbContext;
    private readonly IMailService _mailService;
    private readonly ITemplateService _templateService;

    public UserService(WmsDbContext dbContext, IMailService mailService, ITemplateService templateService)
    {
        this._dbContext = dbContext;
        this._mailService = mailService;
        this._templateService = templateService;
    }

    public async Task<User> CreateAsync(User user)
    {
        bool hasUserAlreadyBeenAdded = this.HasUserAlreadyBeenAdded(user.Email);
        if (hasUserAlreadyBeenAdded)
        {
            throw new ApiOperationFailedException("Can't create user, because it has already been added.");
        }

        var password = SecretHelper.GeneratePassword();
        var (hashHex, saltHex) = SecretHelper.Hash(password);

        user.Password = hashHex;
        user.Salt = saltHex;

        _ = await _dbContext.Users.AddAsync(user);
        _ = await _dbContext.SaveChangesAsync();

        var templateName = "Welcome.cshtml";
        var subject = "Welcome to WMS!";

        var body = await this._templateService.CompileTemplateAsync<WelcomeModel>(templateName, new WelcomeModel
        {
            Email = user.Email,
            UserName = user.FirstName,
            Password = password,
        });
        this._mailService.SendMail(body, subject, new[] { user.Email });

        return user;
    }

    public async Task DeleteAsync(int userId)
    {
        var user = this.GetById(userId);
        if (user == null)
        {
            throw new ApiOperationFailedException("Can't delete user, because it doesn't exist.");
        }

        // TODO: Check if user tries to delete himself

        _ = this._dbContext.Users.Remove(user);
        _ = await this._dbContext.SaveChangesAsync();
    }

    public IEnumerable<User> GetAll() => this._dbContext.Users;

    public Task UpdateAsync(int userId, User userUpdateData)
    {
        throw new NotImplementedException();
    }

    private bool HasUserAlreadyBeenAdded(string userEmail) => this._dbContext.Users.Any(u => u.Email == userEmail);

    private User? GetById(int userId) => this._dbContext.Users.FirstOrDefault(user => user.Id == userId);
}
