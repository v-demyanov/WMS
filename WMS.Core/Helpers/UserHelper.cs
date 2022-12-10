namespace WMS.Core.Helpers;

using WMS.Core.Models;
using WMS.Database.Entities;

public static class UserHelper
{
    public static User Parse(UserRecord createUserData)
    {
        return new User
        {
            FirstName = createUserData.FirstName,
            LastName = createUserData.LastName,
            Email = createUserData.Email,
            Role = createUserData.Role,
        };
    }

    public static UserRecord ToRecord(User user)
    {
        return new UserRecord
        {
            Id = user.Id,
            FirstName = user.FirstName,
            LastName = user.LastName,
            Email = user.Email,
            Role = user.Role,
        };
    }

    public static void Populate(User destinationUser, UserRecord userUpdateData)
    {
        destinationUser.Email = userUpdateData.Email;
        destinationUser.Role = userUpdateData.Role;
        destinationUser.LastName = userUpdateData.LastName;
        destinationUser.FirstName = userUpdateData.FirstName;
    }
}
