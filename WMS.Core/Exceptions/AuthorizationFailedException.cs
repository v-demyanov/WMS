namespace WMS.Core.Exceptions;

public class AuthorizationFailedException : Exception
{
    public AuthorizationFailedException()
    {
    }

    public AuthorizationFailedException(string? message) : base(message)
    {
    }

    public AuthorizationFailedException(string? message, Exception? innerException) : base(message, innerException)
    {
    }
}
