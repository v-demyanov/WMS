namespace WMS.Core.Exceptions;

public class ApiOperationFailedException : Exception
{
    public ApiOperationFailedException()
    {
    }

    public ApiOperationFailedException(string? message) : base(message)
    {
    }

    public ApiOperationFailedException(string? message, Exception? innerException) : base(message, innerException)
    {
    }
}
