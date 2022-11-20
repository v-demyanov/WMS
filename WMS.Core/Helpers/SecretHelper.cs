namespace WMS.Core.Helpers;

using PasswordGenerator;
using System.Security.Cryptography;

public static class SecretHelper
{
    private const int _saltSize = 16;
    private const int _keySize = 32;
    private const int _iterations = 100000;
    private static readonly HashAlgorithmName _algorithm = HashAlgorithmName.SHA256;

    public static (string HashHex, string SaltHex) Hash(string input)
    {
        var salt = RandomNumberGenerator.GetBytes(_saltSize);
        var hash = Rfc2898DeriveBytes.Pbkdf2(input, salt, _iterations, _algorithm, _keySize);

        return (Convert.ToHexString(hash), Convert.ToHexString(salt));
    }

    public static bool Verify(string input, string hashHex, string saltHex)
    {
        byte[] hash = Convert.FromHexString(hashHex);
        byte[] salt = Convert.FromHexString(saltHex);

        byte[] inputHash = Rfc2898DeriveBytes.Pbkdf2(input, salt, _iterations, _algorithm, hash.Length);

        return CryptographicOperations.FixedTimeEquals(inputHash, hash);
    }

    public static string GeneratePassword()
    {
        var passwordLength = 16;
        var pwd = new Password(passwordLength).IncludeLowercase().IncludeUppercase().IncludeSpecial().IncludeNumeric();
        return pwd.Next();
    }
}
