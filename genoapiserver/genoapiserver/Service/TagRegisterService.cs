using genoapiserver.Constants;
using genoapiserver.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace genoapiserver.Service
{
    public class TagRegisterService
    {
        private static readonly Dictionary<string, TagDefineModel> _tags = new Dictionary<string, TagDefineModel>
        {
            // --- Genel Seviye Tagları ---
            // Örnek: Göl seviyesi 10.5 metrenin altına düşerse veya 15 metrenin üstüne çıkarsa uyar.
            { TagConstants.KADEME1_GOL, new TagDefineModel { Name = "Kademe-1 Göl Seviyesi", Path = "YMN.WEIR1!LNA10CL001_XQ01_IO_AINPUT1_ST.PV", MinLimit = 10.5, MaxLimit = 15.0 } },
            { TagConstants.KADEME2_GOL, new TagDefineModel { Name = "Kademe-2 Göl Seviyesi", Path = "YMN.WEIR2!LNA20CL001_XQ01_IO_AINPUT1_ST.PV", MinLimit = 10.5, MaxLimit = 15.0 } },

            { TagConstants.KADEME1_KUYRUK_SUYU, new TagDefineModel { Name = "Kademe-1 Kuyruk Suyu Seviyesi", Path = "YMN.COM1!LNA60CL001_XQ01_IO_AINPUT1_ST.PV" } },
            { TagConstants.KADEME2_KUYRUK_SUYU, new TagDefineModel { Name = "Kademe-2 Kuyruk Suyu Seviyesi", Path = "YMN.COM2!LNA70CL001_XQ01_IO_AINPUT1_ST.PV" } },
            { TagConstants.KADEME1_IZGARA_FARK, new TagDefineModel { Name = "Kademe-1 Izgara Öncesi ve Sonrası Fark", Path = "YMN.WEIR1!LPA20CP001_XQ01_IO_AINPUT1_ST.PV", MaxLimit = 0.5 } },

            // --- Hız (Speed) Tagları ---
            // Örnek: Nominal hız 500 RPM ise, %10 aşımda (550) alarm üret.
            { TagConstants.U1_SPEED, new TagDefineModel { Name = "U1 Speed", Path = "YMN.U1_Speed", MaxLimit = 550 } },
            { TagConstants.U2_SPEED, new TagDefineModel { Name = "U2 Speed", Path = "YMN.U2_Speed", MaxLimit = 550 } },
            { TagConstants.U3_SPEED, new TagDefineModel { Name = "U3 Speed", Path = "YMN.U3_Speed", MaxLimit = 550 } },
            { TagConstants.U4_SPEED, new TagDefineModel { Name = "U4 Speed", Path = "YMN.U4_1041750100002454.DUALSPEED01.Speed value B", MaxLimit = 550 } },
            { TagConstants.U5_SPEED, new TagDefineModel { Name = "U5 Speed", Path = "YMN.U5_Speed", MaxLimit = 550 } },

            // --- Güç (Aktif/Reaktif) Tagları ---
            // Örnek: Ünite kapasitesi 20MW ise 21MW üstünde uyar.
            { TagConstants.U1_AKTIF_GUC, new TagDefineModel { Name = "U1 Aktif Güç", Path = "YMN.UNIT1!BAA10CE311_XQ01_IO", MaxLimit = 21000 } },
            { TagConstants.U1_REAKTIF_GUC, new TagDefineModel { Name = "U1 Reaktif Güç", Path = "YMN.UNIT1!BAA10CE321_XQ01_IO" } },
            { TagConstants.U2_AKTIF_GUC, new TagDefineModel { Name = "U2 Aktif Güç", Path = "YMN.UNIT2!BAA10CE311_XQ01_IO", MaxLimit = 21000 } },
            { TagConstants.U2_REAKTIF_GUC, new TagDefineModel { Name = "U2 Reaktif Güç", Path = "YMN.UNIT2!BAA10CE321_XQ01_IO" } },
            { TagConstants.U3_AKTIF_GUC, new TagDefineModel { Name = "U3 Aktif Güç", Path = "YMN.UNIT3!BAA10CE311_XQ01_IO", MaxLimit = 21000 } },
            { TagConstants.U3_REAKTIF_GUC, new TagDefineModel { Name = "U3 Reaktif Güç", Path = "YMN.UNIT3!BAA10CE321_XQ01_IO" } },
            { TagConstants.U4_AKTIF_GUC, new TagDefineModel { Name = "U4 Aktif Güç", Path = "YMN.UNIT4!BAA10CE311_XQ01_IO", MaxLimit = 21000 } },
            { TagConstants.U4_REAKTIF_GUC, new TagDefineModel { Name = "U4 Reaktif Güç", Path = "YMN.UNIT4!BAA10CE321_XQ01_IO" } },
            { TagConstants.U5_AKTIF_GUC, new TagDefineModel { Name = "U5 Aktif Güç", Path = "YMN.UNIT5!BAA10CE311_XQ01_IO", MaxLimit = 21000 } },
            { TagConstants.U5_REAKTIF_GUC, new TagDefineModel { Name = "U5 Reaktif Güç", Path = "YMN.UNIT5!BAA10CE321_XQ01_IO" } },

            // --- Yatak Titreşim ve Pozisyon (Vibration/Position) ---
            // Titreşim değerleri genellikle mikron (µm) cinsinden olur, 150µm üstü tehlikeli olabilir.
            { TagConstants.U1_GEN_ALT_IZAFI_X, new TagDefineModel { Name = "U1 Gen. Alt Izafi Yatak X", Path = "YMN.U1_GEN_ALT_IZAFI_YATAK_X", MaxLimit = 150 } },
            { TagConstants.U1_GEN_ALT_IZAFI_Y, new TagDefineModel { Name = "U1 Gen. Alt Izafi Yatak Y", Path = "YMN.U1_GEN_ALT_IZAFI_YATAK_Y", MaxLimit = 150 } },
            { TagConstants.U1_GEN_ALT_MUTLAK_X, new TagDefineModel { Name = "U1 Gen. Alt Mutlak Yatak X", Path = "YMN.U1_GEN_ALT_MUTLAK_YATAK_X", MaxLimit = 5.0 } },
            { TagConstants.U1_GEN_UST_EKSENEL_POS, new TagDefineModel { Name = "U1 Gen. Üst Eksenel Pozisyon (DC Thrust)", Path = "YMN.U1_GEN_UST_EKSENEL_POS", MinLimit = -1.5, MaxLimit = 1.5 } },

            { TagConstants.U4_GEN_UST_IZAFI_X, new TagDefineModel { Name = "U4 Gen. Üst Izafi Yatak X", Path = "YMN.U4_1041750100002454.DUAL VIBRATION01.Vib_ value A", MaxLimit = 180 } },
            { TagConstants.U4_GEN_UST_IZAFI_Y, new TagDefineModel { Name = "U4 Gen. Üst Izafi Yatak Y", Path = "YMN.U4_1041750100002454.DUAL VIBRATION01.Vib_ value B", MaxLimit = 180 } }
        };

        public static List<TagDefineModel> GetTagPaths()
        {
            return _tags.Values.ToList();
        }

        public static TagDefineModel GetTag(string key)
        {
            return _tags.ContainsKey(key) ? _tags[key] : null;
        }
    }
}