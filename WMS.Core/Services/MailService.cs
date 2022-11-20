namespace WMS.Core.Services;

using System.Collections.Generic;
using System.Net;
using System.Net.Mail;
using Microsoft.Extensions.Options;
using Microsoft.Extensions.Logging;

using WMS.Core.Services.Abstractions;
using WMS.Core.Models;

public class MailService : IMailService
{
    private readonly MailSettings _mailSettings;
    private readonly ILogger _logger;

    public MailService(IOptions<MailSettings> mailSettings, ILogger<MailSettings> logger)
    {
        this._mailSettings = mailSettings.Value;
        this._logger = logger;
    }

    public void SendMail(string body, string subject, IEnumerable<string> recipientAddresses)
    {
        var credential = new NetworkCredential(
            this._mailSettings.SystemEmailAddress,
            this._mailSettings.SystemEmailPassword);

        var client = new SmtpClient(this._mailSettings.SmtpHost, this._mailSettings.SmtpPort)
        {
            EnableSsl = this._mailSettings.EnableSsl,
            DeliveryMethod = SmtpDeliveryMethod.Network,
            UseDefaultCredentials = this._mailSettings.UseDefaultCredentials,
            Credentials = credential,
        };

        var mail = new MailMessage(this._mailSettings.SystemEmailAddress, string.Join(',', recipientAddresses))
        {
            Body = body,
            Subject = subject,
            IsBodyHtml = true,
        };

        var logEmailInfo = $"Subject: {subject}; Recipients: {string.Join(',', recipientAddresses)}";

        try
        {
            this._logger.LogInformation($"Sending email... {logEmailInfo}");
            client.Send(mail);
            this._logger.LogInformation($"Email has been sent successfully. {logEmailInfo}");
        }
        catch (Exception error)
        {
            this._logger.LogError($"Email has't been sent. {logEmailInfo}");
            throw;
        }
        finally
        {
            client.Dispose();
            mail.Dispose();
        }
    }
}
