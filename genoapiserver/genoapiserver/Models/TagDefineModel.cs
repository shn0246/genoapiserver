using System;

namespace genoapiserver.Models
{
    public class TagDefineModel
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Path { get; set; }

        public double? MaxLimit { get; set; }
        public double? MinLimit { get; set; }

        public string AlarmMessage { get; set; }
    }
}