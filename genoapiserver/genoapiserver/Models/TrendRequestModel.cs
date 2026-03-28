using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace genoapiserver.Models
{
    public class TrendRequestModel
    {
        public List<string> TagPaths { get; set; }
        public string StartTime { get; set; }
        public string EndTime { get; set; }
        public string Interval { get; set; }
    }
}