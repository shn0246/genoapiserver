import React from 'react';
import type { DataItem } from '../../api/data/type';

interface Props {
    tags: DataItem[];
}

const SidebarStats = ({ tags }: Props) => {
    // Sadece limiti aşanları filtrele
    const criticalTags = tags.filter(tag =>
        (tag.MaxLimit && tag.Value > tag.MaxLimit) ||
        (tag.MinLimit && tag.Value < tag.MinLimit)
    );

    return (
        <div className="flex flex-col gap-6">
            {/* Sistem Sağlık Durumu Kartı */}
            <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100">
                <h3 className="text-sm font-bold text-slate-800 mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 bg-blue-500 rounded-full animate-ping"></span>
                    Sistem Özeti
                </h3>
                <div className="space-y-3">
                    <StatusItem label="PI Bağlantısı" value="Aktif" color="text-green-600" />
                    <StatusItem label="Veri Tazeliği" value="Canlı" color="text-blue-600" />
                    <StatusItem label="Son Tarama" value={new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' })} color="text-slate-500" />
                </div>
            </div>

            {/* Kritik Alarmlar Paneli */}
            <div className={`rounded-2xl shadow-sm border p-5 transition-all ${criticalTags.length > 0 ? 'bg-red-50 border-red-100' : 'bg-white border-slate-100'
                }`}>
                <div className="flex justify-between items-center mb-4">
                    <h3 className={`text-sm font-bold ${criticalTags.length > 0 ? 'text-red-800' : 'text-slate-800'}`}>
                        Aktif İhlaller
                    </h3>
                    <span className={`text-xs font-black px-2 py-0.5 rounded-md ${criticalTags.length > 0 ? 'bg-red-200 text-red-700' : 'bg-slate-100 text-slate-500'
                        }`}>
                        {criticalTags.length}
                    </span>
                </div>

                {criticalTags.length > 0 ? (
                    <div className="space-y-3">
                        {criticalTags.map(tag => (
                            <div key={tag.Id} className="bg-white/60 p-3 rounded-lg border border-red-200/50">
                                <div className="text-[11px] font-bold text-red-800 truncate">{tag.Name}</div>
                                <div className="flex justify-between items-end mt-1">
                                    <span className="text-xs text-red-600/70 font-mono">
                                        Limit: {tag.Value > (tag.MaxLimit || 0) ? `>${tag.MaxLimit}` : `<${tag.MinLimit}`}
                                    </span>
                                    <span className="text-sm font-black text-red-700">{tag.Value.toFixed(2)}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <div className="text-green-500 text-2xl mb-2">✓</div>
                        <p className="text-xs text-slate-400 font-medium">Tüm değerler normal aralıkta.</p>
                    </div>
                )}
            </div>

            {/* Hızlı Bilgi Notu */}
            <div className="bg-blue-600 p-5 rounded-2xl shadow-lg shadow-blue-200 text-white">
                <p className="text-[10px] uppercase font-bold opacity-70 mb-1">Bilgi</p>
                <p className="text-xs leading-relaxed font-medium">
                    Eşik değerleri <b>TagRegisterService</b> üzerinden yönetilmektedir. Değişiklik için sistem yöneticisine başvurun.
                </p>
            </div>
        </div>
    );
};

// Alt yardımcı bileşen
const StatusItem = ({ label, value, color }: { label: string, value: string, color: string }) => (
    <div className="flex justify-between items-center text-[12px]">
        <span className="text-slate-500 font-medium">{label}</span>
        <span className={`font-bold ${color}`}>{value}</span>
    </div>
);

export default SidebarStats;