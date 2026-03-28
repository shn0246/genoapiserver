using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace genoapiserver.Models
{
    public class TagDataGroupModel
    {
        public string TagPath { get; set; }
        public string TagName { get; set; }
        public List<TrendResultModel> DataPoints { get; set; }
    }
}