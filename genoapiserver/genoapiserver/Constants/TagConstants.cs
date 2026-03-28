using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace genoapiserver.Constants
{
    public class TagConstants
    {
            // Seviye ve Genel Taglar
            public const string KADEME1_KUYRUK_SUYU = "KADEME1_KUYRUK_SUYU";
            public const string KADEME2_KUYRUK_SUYU = "KADEME2_KUYRUK_SUYU";
            public const string KADEME1_GOL = "KADEME1_GOL";
            public const string KADEME2_GOL = "KADEME2_GOL";
            public const string KADEME1_IZGARA_FARK = "KADEME1_IZGARA_FARK";

            // Hızlar
            public const string U1_SPEED = "U1_SPEED";
            public const string U2_SPEED = "U2_SPEED";
            public const string U3_SPEED = "U3_SPEED";
            public const string U4_SPEED = "U4_SPEED";
            public const string U5_SPEED = "U5_SPEED";

            // Güçler
            public const string U1_AKTIF_GUC = "U1_AKTIF_GUC";
            public const string U1_REAKTIF_GUC = "U1_REAKTIF_GUC";
            public const string U2_AKTIF_GUC = "U2_AKTIF_GUC";
            public const string U2_REAKTIF_GUC = "U2_REAKTIF_GUC";
            public const string U3_AKTIF_GUC = "U3_AKTIF_GUC";
            public const string U3_REAKTIF_GUC = "U3_REAKTIF_GUC";
            public const string U4_AKTIF_GUC = "U4_AKTIF_GUC";
            public const string U4_REAKTIF_GUC = "U4_REAKTIF_GUC";
            public const string U5_AKTIF_GUC = "U5_AKTIF_GUC";
            public const string U5_REAKTIF_GUC = "U5_REAKTIF_GUC";

            // Yatak Titreşim ve Pozisyonlar (Örnek olarak U1 ve U4'ü verdim, diğerlerini de aynı mantıkla ekleyebilirsin)
            public const string U1_GEN_ALT_IZAFI_X = "U1_GEN_ALT_IZAFI_X";
            public const string U1_GEN_ALT_IZAFI_Y = "U1_GEN_ALT_IZAFI_Y";
            public const string U1_GEN_ALT_MUTLAK_X = "U1_GEN_ALT_MUTLAK_X";
            public const string U1_GEN_UST_EKSENEL_POS = "U1_GEN_UST_EKSENEL_POS";
            public const string U4_GEN_UST_IZAFI_X = "U4_GEN_UST_IZAFI_X";
            public const string U4_GEN_UST_IZAFI_Y = "U4_GEN_UST_IZAFI_Y";
            // ... Bu şekilde tüm tagleri isimlendirebilirsin
    }
}