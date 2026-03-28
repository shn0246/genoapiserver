using Quartz;
using Quartz.Impl;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace genoapiserver.Jobs
{
    public class JobScheduler
    {
        public static void Start()
        {
            // 1. Zamanlayıcıyı başlat
            IScheduler scheduler = StdSchedulerFactory.GetDefaultScheduler();
            scheduler.Start();

            // 2. İş Tanımı (Hangi class çalışacak?)
            IJobDetail job = JobBuilder.Create<MailJob>()
                .WithIdentity("uyariJob", "group1")
                .Build();

            // 3. Tetikleyici (Cron ifadesi ile SAATTE 1 çalışma ayarı)

            /*
            ITrigger trigger = TriggerBuilder.Create()
                .WithIdentity("uyariTrigger", "group1")
                .WithCronSchedule("0 0 * * * ?") // Her saat başı (0. dakika 0. saniye)
                .Build();

            */

            ITrigger trigger = TriggerBuilder.Create()
    .WithIdentity("uyariTrigger", "group1")
    .WithCronSchedule("0 0/3 * * * ?") // Her 3 dakikada bir (0, 3, 6, 9... dakikalarda)
    .Build();

            // 4. İşi zamanla
            scheduler.ScheduleJob(job, trigger);
        }
    }
}