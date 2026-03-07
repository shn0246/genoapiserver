using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace genoapiserver.Models
{
    public class ListResultModel
    {
        public ListResultModel()
        {
            Data = new List<DataModel>();
        }
        public int Count { get; set; }
        public List<DataModel> Data { get; set; }
    }
}