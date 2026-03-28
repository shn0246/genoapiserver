using genoapiserver.Models;
using genoapiserver.Service;
using OSIsoft.AF.PI;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.UI.WebControls;

namespace genoapiserver.Controllers
{
    public class DataController : Controller
    {
        [HttpGet]
        public JsonResult List()
        {

            DataService dataService = new DataService();

            List<DataModel> dataList = dataService.getPoints();

            return Json(new ListResultModel 
            {
                Count = dataList.Count,
                Data = dataList
            }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult GetTrendData([System.Web.Http.FromBody] TrendRequestModel request)
        {
            if (request == null || request.TagPaths == null || !request.TagPaths.Any())
            {
                return Json(new { success = false, message = "Geçersiz istek veya Tag listesi boş." });
            }

            try
            {
                DataService dataService = new DataService();
                // Artık geriye tüm taglerin birleşik verisi dönecek
                var result = dataService.GetTrendDataMulti(request);

                return Json(new { success = true, data = result });
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message });
            }
        }

        [HttpGet]
        public JsonResult GetTagDefinitions()
        {
            try
            {
                DataService dataService = new DataService();
                var result = dataService.GetTagDefinitions();

                return Json(new
                {
                    success = true,
                    data = result,
                    count = result.Count
                }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { success = false, message = ex.Message }, JsonRequestBehavior.AllowGet);
            }
        }
    }
}