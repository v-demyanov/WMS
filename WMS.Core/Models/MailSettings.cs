namespace WMS.Core.Models;

public class MailSettings
{
    public string SystemEmailAddress { get; set; } = string.Empty;

    public string SystemEmailPassword { get; set; } = string.Empty;

    public string SmtpHost { get; set; } = string.Empty;

    public int SmtpPort { get; set; }

    public bool EnableSsl { get; set; }

    public bool UseDefaultCredentials { get; set; }
}
