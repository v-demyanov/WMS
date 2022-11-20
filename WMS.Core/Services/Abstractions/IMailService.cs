namespace WMS.Core.Services.Abstractions;

public interface IMailService
{
    void SendMail(string body, string subject, IEnumerable<string> recipientAddresses);
}
