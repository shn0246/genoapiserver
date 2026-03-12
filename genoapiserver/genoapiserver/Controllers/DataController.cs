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
        
        [HttpGet]
        public JsonResult Trend()
        {

            DataService dataService = new DataService();
            var result = dataService.GetTrendDataAsList("YMN.MGATE!LPE10CL001_XQ01_IO_AINPUT1_ST.PV");
            return Json(result, JsonRequestBehavior.AllowGet);
        }
    }
}