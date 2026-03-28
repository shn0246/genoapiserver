using genoapiserver.Models;
using genoapiserver.Service; // Yeni servis namespace'i
using Newtonsoft.Json.Linq;
using OSIsoft.AF.Asset;
using OSIsoft.AF.Data;
using OSIsoft.AF.PI;
using OSIsoft.AF.Time;
using System;
using System.Collections.Generic;
using System.Linq;

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

        public List<TagDataGroupModel> GetTrendDataMulti(TrendRequestModel request)
        {
            var response = new List<TagDataGroupModel>();
            PIServer myPIServer = connectToServer();
            AFTimeRange timeRange = new AFTimeRange(request.StartTime, request.EndTime);
            AFTimeSpan span = !string.IsNullOrEmpty(request.Interval) ? AFTimeSpan.Parse(request.Interval) : AFTimeSpan.Parse("10m");

            foreach (var path in request.TagPaths)
            {
                var group = new TagDataGroupModel
                {
                    TagPath = path,
                    TagName = path.Split('\\').Last(),
                    DataPoints = new List<TrendResultModel>()
                };

                try
                {
                    PIPoint myPoint = PIPoint.FindPIPoint(myPIServer, path);
                    AFValues trendData = myPoint.InterpolatedValues(timeRange, span, "", false);

                    foreach (AFValue val in trendData)
                    {
                        if (val.IsGood && double.TryParse(val.Value.ToString(), out double doubleVal))
                        {
                            group.DataPoints.Add(new TrendResultModel
                            {
                                Time = val.Timestamp.LocalTime.ToString("dd.MM HH:mm:ss"),
                                Value = Math.Round(doubleVal, 2)
                            });
                        }
                    }
                    response.Add(group);
                }
                catch { /* Hata alan tag'i boş geç veya logla */ }
            }
            return response;
        }

        public List<DataModel> getPoints()
        {
            List<DataModel> foundedPoints = new List<DataModel>();
            PIServer server = connectToServer();

            // DİKKAT: Artık listeyi TagRegisterService'den merkezi olarak çekiyoruz
            var tagDefinitions = TagRegisterService.GetTagPaths();

            int index = 0;
            foreach (var pointdefine in tagDefinitions)
            {
                index++;
                try
                {
                    PIPoint foundPoint = PIPoint.FindPIPoint(server, pointdefine.Path);
                    if (foundPoint != null)
                    {
                        foundedPoints.Add(new DataModel
                        {
                            Id = index,
                            Name = pointdefine.Name,
                            Path = pointdefine.Path,
                            Value = getPointValue(foundPoint)
                        });
                    }
                }
                catch (Exception)
                {
                    // Belirli bir tag bulunamazsa sistemi kırmadan devam et
                    continue;
                }
            }

            return foundedPoints;
        }

        public float getPointValue(PIPoint point)
        {
            // CurrentValue bazen AFValue dışında (hata kodu vb) dönebilir, Single'a güvenli çevrim
            AFValue currentValue = point.CurrentValue();
            return currentValue.ValueAsSingle();
        }

        public List<TagDefineModel> GetTagDefinitions()
        {
            // PI Server'a gitmiyoruz, sadece kayıtlı tanımları dönüyoruz
            var tagDefinitions = TagRegisterService.GetTagPaths();

            return tagDefinitions.Select((t, index) => new TagDefineModel
            {
                Id = index + 1,
                Name = t.Name,
                Path = t.Path
            }).ToList();
        }
    }
}