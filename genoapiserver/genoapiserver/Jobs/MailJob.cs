using Quartz;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Mail;
using genoapiserver.Service;
using genoapiserver.Models;

namespace genoapiserver.Jobs
{
    public class MailJob : IJob
    {
        public void Execute(IJobExecutionContext context)
        {
            try
            {
                DataService dataService = new DataService();
                var currentPoints = dataService.getPoints();

                List<string> alarms = new List<string>();

                foreach (var point in currentPoints)
                {
                    var definition = TagRegisterService.GetTagPaths()
                                     .FirstOrDefault(x => x.Path == point.Path);

                    if (definition == null) continue;

                    if (definition.MaxLimit.HasValue && point.Value > (float)definition.MaxLimit.Value)
                    {
                        alarms.Add($"<li><b>{definition.Name}:</b> Değer: {point.Value:F2} (Limit: {definition.MaxLimit.Value}) - <span style='color:red;'>Üst Limit Aşıldı!</span></li>");
                    }

                    if (definition.MinLimit.HasValue && point.Value < (float)definition.MinLimit.Value)
                    {
                        alarms.Add($"<li><b>{definition.Name}:</b> Değer: {point.Value:F2} (Limit: {definition.MinLimit.Value}) - <span style='color:orange;'>Alt Limit Altında!</span></li>");
                    }
                }

                if (alarms.Count > 0)
                {
                    // Çoklu alıcı listesi
                    List<string> recipients = new List<string>
                    {
                        "eemshn@gmail.com",
                    };

                    SendGmailAlarm(alarms, recipients);
                }
            }
            catch (Exception ex)
            {
                Console.WriteLine("MailJob Hatası: " + ex.Message);
            }
        }

        private void SendGmailAlarm(List<string> alarmList, List<string> toMails)
        {
            try
            {
                string fromMail = "xxxx@gmail.com";
                string password = "xxxxxx"; // uygulama app password -> gmail sitesindne edinilebilir

                MailMessage mail = new MailMessage();
                SmtpClient smtpServer = new SmtpClient("smtp.gmail.com");

                mail.From = new MailAddress(fromMail, "Genco PI Alarm Sistemi");

                // Çoklu alıcıları ekliyoruz
                foreach (var recipient in toMails)
                {
                    if (!string.IsNullOrEmpty(recipient))
                        mail.To.Add(recipient);
                }

                mail.Subject = $"Kritik Alarm Bildirimi - {DateTime.Now:HH:mm}";
                mail.IsBodyHtml = true;

                string body = $@"
                    <div style='font-family: Arial, sans-serif;'>
                        <h3 style='color: #d9534f;'>Santral Parametre İhlal Listesi</h3>
                        <p>Aşağıdaki taglar belirlenen eşik değerlerinin dışına çıkmıştır:</p>
                        <ul>{string.Join("", alarmList)}</ul>
                        <br/>
                        <p style='font-size: 12px; color: #777;'>Bu mail <b>{DateTime.Now}</b> tarihinde otomatik olarak üretilmiştir.</p>
                    </div>";

                mail.Body = body;

                smtpServer.Port = 587;
                smtpServer.Credentials = new NetworkCredential(fromMail, password);
                smtpServer.EnableSsl = true;

                smtpServer.Send(mail);
            }
            catch (Exception ex)
            {
                Console.WriteLine("Mail Gönderme Hatası: " + ex.Message);
            }
        }
    }
}