using genoapiserver.Models;
using Newtonsoft.Json.Linq;
using OSIsoft.AF.Asset;
using OSIsoft.AF.Data;
using OSIsoft.AF.PI;
using OSIsoft.AF.Time;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.Linq;
using System.Web;

namespace genoapiserver.Service
{
    public class DataService
    {
        
        private readonly string servername = "GENCOPI";

        private PIServer connectToServer()
        {
            PIServers myServers = new PIServers();
            PIServer myPIServer = myServers[servername];

            if (!myPIServer.ConnectionInfo.IsConnected)
            {
                myPIServer.Connect();
            }

            return myPIServer;
        }
        
        public List<string> GetTrendDataAsList(string tagName, string duration = "*-24h")
        {
            List<string> resultList = new List<string>();

            try
            {
                PIServer myPIServer = connectToServer();
                PIPoint myPoint = PIPoint.FindPIPoint(myPIServer, tagName);

                AFTimeRange timeRange = new AFTimeRange(duration, "*");
                AFValues trendData = myPoint.RecordedValues(timeRange, AFBoundaryType.Inside, "", false);
                foreach (AFValue val in trendData)
                {
                    string line = val.Value.ToString();
                    resultList.Add(line);
                }
            }
            catch (Exception ex)
            {
                resultList.Add($"Hata oluştu: {ex.Message}");
            }

            return resultList;
        }
        
        public List<DataModel> getPoints()
        {
            List<DataModel> foundedPoints = new List<DataModel>();



            int index = 0;

            PIServer server = connectToServer();
            foreach (var pointdefine in getTagPaths())
            {
                index++;
                PIPoint foundPoint = PIPoint.FindPIPoint(server, pointdefine.Path);
                if (foundPoint != null)
                {
                    foundedPoints.Add(new DataModel
                    {
                        Id =index,
                        Name = pointdefine.Name,
                        Path = pointdefine.Path,
                        Value = getPointValue(foundPoint)
                        
                    });
                }
            }

            return foundedPoints.ToList();
        }

        private List<TagDefineModel> getTagPaths()
        {
            List <TagDefineModel> tags = new List<TagDefineModel>();
            tags.Add(new TagDefineModel {Name = "Kademe-1 Kuyruk Suyu Seviyesi", Path= "YMN.COM1!LNA60CL001_XQ01_IO_AINPUT1_ST.PV" });
            tags.Add(new TagDefineModel { Name = "Kademe-2 Kuyruk Suyu Seviyesi", Path = "YMN.COM2!LNA70CL001_XQ01_IO_AINPUT1_ST.PV" });
            tags.Add(new TagDefineModel { Name = "Kademe-1 Göl Seviyesi", Path = "YMN.WEIR1!LNA10CL001_XQ01_IO_AINPUT1_ST.PV" });
            tags.Add(new TagDefineModel { Name = "Kademe-2 Göl Seviyesi", Path = "YMN.WEIR2!LNA20CL001_XQ01_IO_AINPUT1_ST.PV" });
            tags.Add(new TagDefineModel { Name = "Kademe-1 Izgara Öncesi ve Sonrası Fark", Path = "YMN.WEIR1!LPA20CP001_XQ01_IO_AINPUT1_ST.PV" });
            tags.Add(new TagDefineModel { Name = "U1 Speed", Path = "YMN.U1_Speed" });
            tags.Add(new TagDefineModel { Name = "U2 Speed", Path = "YMN.U2_Speed" });
            tags.Add(new TagDefineModel { Name = "U3 Speed", Path = "YMN.U3_Speed" });
            tags.Add(new TagDefineModel { Name = "U4 Speed", Path = "YMN.U4_1041750100002454.DUALSPEED01.Speed value B" });
            tags.Add(new TagDefineModel { Name = "U5 Speed", Path = "YMN.U5_Speed" });
            tags.Add(new TagDefineModel { Name = "U1 Aktif Güç", Path = "YMN.UNIT1!BAA10CE311_XQ01_IO" });
            tags.Add(new TagDefineModel { Name = "U1 Reaktif Güç", Path = "YMN.UNIT1!BAA10CE321_XQ01_IO" });
            tags.Add(new TagDefineModel { Name = "U2 Aktif Güç", Path = "YMN.UNIT2!BAA10CE311_XQ01_IO" });
            tags.Add(new TagDefineModel { Name = "U2 Reaktif Güç", Path = "YMN.UNIT2!BAA10CE321_XQ01_IO" });
            tags.Add(new TagDefineModel { Name = "U3 Aktif Güç", Path = "YMN.UNIT3!BAA10CE311_XQ01_IO" });
            tags.Add(new TagDefineModel { Name = "U3 Reaktif Güç", Path = "YMN.UNIT3!BAA10CE321_XQ01_IO" });
            tags.Add(new TagDefineModel { Name = "U4 Aktif Güç", Path = "YMN.UNIT4!BAA10CE311_XQ01_IO" });
            tags.Add(new TagDefineModel { Name = "U4 Reaktif Güç", Path = "YMN.UNIT4!BAA10CE321_XQ01_IO" });
            tags.Add(new TagDefineModel { Name = "U5 Aktif Güç", Path = "YMN.UNIT5!BAA10CE311_XQ01_IO" });
            tags.Add(new TagDefineModel { Name = "U5 Reaktif Güç", Path = "YMN.UNIT5!BAA10CE321_XQ01_IO" });

            return tags;
        }

        public float getPointValue(PIPoint point)
        {
            AFValue currentValue = point.CurrentValue();
            return currentValue.ValueAsSingle();
        }
    }
}