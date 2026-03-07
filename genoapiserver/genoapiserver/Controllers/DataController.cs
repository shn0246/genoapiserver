using genoapiserver.Models;
using genoapiserver.Service;
using OSIsoft.AF.PI;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

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
    }
}