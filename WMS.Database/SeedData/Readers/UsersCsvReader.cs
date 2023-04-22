namespace WMS.Database.SeedData.Readers;

using WMS.Database.Entities;
using WMS.Database.SeedData.Models;
using WMS.Utils;

public class UsersCsvReader : CsvReader<User, UserCsv>
{
    public UsersCsvReader(string relativePathToFile) 
        : base(relativePathToFile)
    {
    }

    protected override User ReadRecord(UserCsv row, int recordNumber)
    {
        var (hashHex, saltHex) = SecretHelper.Hash(row.InitialPassword);
        
        var record = new User()
        {
            Id = row.Id,
            FirstName = row.FirstName,
            LastName = row.LastName,
            Email = row.Email,
            Role = row.Role,
            Password = hashHex,
            Salt = saltHex,
        };

        return record;
    }
}