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
            tags.Add(new TagDefineModel {Name = "Denge Bacası Seviye", Path= "YMN.MGATE!LPE10CL001_XQ01_IO_AINPUT1_ST.PV" });
            tags.Add(new TagDefineModel { Name = "U1 Aktif Güç", Path = "YMN.MGATE!LPE10CL001_XQ01_IO_AINPUT1_ST.PV" });
            tags.Add(new TagDefineModel { Name = "U2 Aktif Güç", Path = "YMN.UNIT2!BAA10CE342_XQ01_IO" });
            tags.Add(new TagDefineModel { Name = "U3 Aktif Güç", Path = "YMN.UNIT3!BAA10CE342_XQ01_IO" });

            return tags;
        }

        public float getPointValue(PIPoint point)
        {
            AFValue currentValue = point.CurrentValue();
            return currentValue.ValueAsSingle();
        }
    }
}