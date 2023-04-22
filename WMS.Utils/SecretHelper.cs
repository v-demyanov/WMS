namespace WMS.Utils;

using PasswordGenerator;
using System.Security.Cryptography;

public static class SecretHelper
{
    private const int SaltSize = 16;
    private const int KeySize = 32;
    private const int Iterations = 100000;
    private static readonly HashAlgorithmName Algorithm = HashAlgorithmName.SHA256;

    public static (string hashHex, string saltHex) Hash(string input)
    {
        var salt = RandomNumberGenerator.GetBytes(SaltSize);
        var hash = Rfc2898DeriveBytes.Pbkdf2(input, salt, Iterations, Algorithm, KeySize);

        return (Convert.ToHexString(hash), Convert.ToHexString(salt));
    }

    public static bool Verify(string input, string hashHex, string saltHex)
    {
        byte[] hash = Convert.FromHexString(hashHex);
        byte[] salt = Convert.FromHexString(saltHex);

        byte[] inputHash = Rfc2898DeriveBytes.Pbkdf2(input, salt, Iterations, Algorithm, hash.Length);

        return CryptographicOperations.FixedTimeEquals(inputHash, hash);
    }

    public static string GeneratePassword()
    {
        var passwordLength = 16;
        var pwd = new Password(passwordLength).IncludeLowercase().IncludeUppercase().IncludeSpecial().IncludeNumeric();
        return pwd.Next();
    }
}
