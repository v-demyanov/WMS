namespace WMS.Core.Helpers;

using WMS.Core.Models;
using WMS.Database.Entities;

public static class UserHelper
{
    public static User Parse(UserCreateData createUserData)
    {
        return new User
        {
            FirstName = createUserData.FirstName,
            LastName = createUserData.LastName,
            Email = createUserData.Email,
            Role = createUserData.Role,
        };
    }

    public static void Populate(User destinationUser, UserUpdateData userUpdateData)
    {
        destinationUser.Email = userUpdateData.Email;
        destinationUser.Role = userUpdateData.Role;
        destinationUser.LastName = userUpdateData.LastName;
        destinationUser.FirstName = userUpdateData.FirstName;
    }
}
