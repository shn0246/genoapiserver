using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;
using System.Web.Security;
using System.Web.SessionState;
using System.Web.Http;

namespace genoapiserver
{
    public class Global : HttpApplication
    {
        void Application_Start(object sender, EventArgs e)
        {
            // Code that runs on application startup
            AreaRegistration.RegisterAllAreas();
            GlobalConfiguration.Configure(WebApiConfig.Register);
            RouteConfig.RegisterRoutes(RouteTable.Routes);
        }

        protected void Application_BeginRequest()
        {
            // 1. Her istekte (GET, POST, PUT, DELETE) bu başlıklar MUTLAKA olmalı
            Response.Headers.Remove("Access-Control-Allow-Origin");
            Response.AddHeader("Access-Control-Allow-Origin", "http://localhost:5173");

            Response.Headers.Remove("Access-Control-Allow-Methods");
            Response.AddHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");

            Response.Headers.Remove("Access-Control-Allow-Headers");
            Response.AddHeader("Access-Control-Allow-Headers", "Content-Type, Accept, Authorization");

            Response.AddHeader("Access-Control-Allow-Credentials", "true");

            // 2. Sadece OPTIONS (ön kontrol) isteği gelirse, işlemi burada bitir
            // Diğer istekler (GET, POST vb.) Controller'a ulaşmaya devam etsin
            if (Request.HttpMethod == "OPTIONS")
            {
                Response.StatusCode = 200;
                Response.End();
            }
        }
    }
}