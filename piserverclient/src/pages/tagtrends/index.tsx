import React, { useState, useMemo, useEffect } from 'react';
import { useGetTagDefinitionsQuery, useGetTrendMutation } from '../../api/data';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, Legend
} from 'recharts';
import type { TagDataGroup, TrendDataPoint } from '../../api/data/type';
import { ChevronLeft, ChevronRight, Search, Activity } from 'lucide-react';

const COLORS = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899'];

const TrendAnalysis = () => {
    // --- STATE YÖNETİMİ ---
    const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Panel açık/kapalı state'i
    const [searchTerm, setSearchTerm] = useState("");
    
    // Zaman Yardımcıları (Aynı kalıyor)
    const getNowForInput = () => {
        const now = new Date();
        now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
        return now.toISOString().slice(0, 16);
    };
    const getYesterdayForInput = () => {
        const date = new Date();
        date.setHours(date.getHours() - 24);
        date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
        return date.toISOString().slice(0, 16);
    };

    const [startTime, setStartTime] = useState(getYesterdayForInput());
    const [endTime, setEndTime] = useState(getNowForInput());
    const [interval, setInterval] = useState("10m");
    const [selectedTags, setSelectedTags] = useState<any[]>([]);

    const { data: tagDefs, isLoading: tagsLoading } = useGetTagDefinitionsQuery();
    const [triggerTrend, { data: trendResult, isLoading: trendLoading }] = useGetTrendMutation();

    // Veri Çekme (Aynı kalıyor)
    useEffect(() => {
        if (selectedTags.length > 0) {
            triggerTrend({
                TagPaths: selectedTags.map(t => t.Path),
                StartTime: startTime.replace('T', ' '),
                EndTime: endTime.replace('T', ' '),
                Interval: interval
            });
        }
    }, [selectedTags, startTime, endTime, interval, triggerTrend]);

    // Pivot Mantığı (Aynı kalıyor)
    const chartData = useMemo(() => {
        if (!trendResult?.data || !Array.isArray(trendResult.data)) return [];
        const timeMap: Record<string, any> = {};
        trendResult.data.forEach((group: TagDataGroup) => {
            group.DataPoints.forEach((point: TrendDataPoint) => {
                if (!timeMap[point.Time]) timeMap[point.Time] = { Time: point.Time };
                timeMap[point.Time][group.TagPath] = point.Value;
            });
        });
        return Object.values(timeMap).sort((a: any, b: any) => a.Time.localeCompare(b.Time));
    }, [trendResult]);

    const filteredTags = useMemo(() => {
        if (!tagDefs?.data) return [];
        return tagDefs.data.filter(tag =>
            tag.Name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [tagDefs, searchTerm]);

    const toggleTag = (tag: any) => {
        setSelectedTags(prev =>
            prev.find(t => t.Path === tag.Path)
                ? prev.filter(t => t.Path !== tag.Path)
                : [...prev, tag]
        );
    };

    return (
        <div className="flex h-[calc(100vh-140px)] gap-4 p-2 overflow-hidden relative">
            
            {/* SOL PANEL: TAG LİSTESİ (ANIMASYONLU) */}
            <div 
                className={`transition-all duration-300 ease-in-out flex flex-col bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden ${
                    isSidebarOpen ? 'w-80' : 'w-0 border-none'
                }`}
            >
                <div className="p-4 bg-slate-50 border-b border-slate-100 min-w-[320px]">
                    <div className="flex justify-between items-center mb-3">
                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">
                            Tag Seçimi ({selectedTags.length})
                        </h3>
                        <button 
                            onClick={() => setIsSidebarOpen(false)}
                            className="p-1 hover:bg-slate-200 rounded-lg transition-colors text-slate-400"
                        >
                            <ChevronLeft size={18} />
                        </button>
                    </div>
                    <div className="relative">
                        <Search className="absolute left-3 top-2.5 text-slate-400" size={14} />
                        <input
                            type="text"
                            placeholder="Tag ara..."
                            className="w-full bg-white border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-sm outline-none focus:ring-2 focus:ring-blue-500"
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>
                
                <div className="flex-1 overflow-y-auto p-2 custom-scrollbar min-w-[320px]">
                    {tagsLoading ? (
                        <div className="p-4 space-y-2 animate-pulse">
                            {[1, 2, 3].map(i => <div key={i} className="h-12 bg-slate-100 rounded-lg" />)}
                        </div>
                    ) : (
                        filteredTags.map(tag => {
                            const isSelected = selectedTags.some(t => t.Path === tag.Path);
                            return (
                                <button
                                    key={tag.Path}
                                    onClick={() => toggleTag(tag)}
                                    className={`w-full text-left px-4 py-3 rounded-xl mb-1 transition-all group ${
                                        isSelected ? 'bg-blue-600 text-white shadow-md' : 'hover:bg-blue-50 text-slate-600'
                                    }`}
                                >
                                    <div className="flex items-center justify-between">
                                        <p className="text-[11px] font-bold truncate pr-2">{tag.Name}</p>
                                        <Activity size={10} className={isSelected ? 'text-blue-200' : 'text-slate-300 opacity-0 group-hover:opacity-100'} />
                                    </div>
                                    <p className={`text-[8px] truncate font-medium ${isSelected ? 'text-blue-100' : 'text-slate-400'}`}>
                                        {tag.Path}
                                    </p>
                                </button>
                            );
                        })
                    )}
                </div>
            </div>

            {/* PANEL KAPALIYKEN ÇIKAN AÇMA BUTONU */}
            {!isSidebarOpen && (
                <button 
                    onClick={() => setIsSidebarOpen(true)}
                    className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white border border-slate-200 shadow-xl p-2 rounded-full text-blue-600 hover:bg-blue-50 transition-all scale-110"
                    title="Paneli Aç"
                >
                    <ChevronRight size={24} />
                </button>
            )}

            {/* SAĞ PANEL: GRAFİK VE KONTROLLER */}
            <div className="flex-1 flex flex-col gap-4 min-w-0">
                {selectedTags.length > 0 ? (
                    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col flex-1 p-6 relative overflow-hidden">
                        
                        {/* KONTROL BAR */}
                        <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
                            <div className="flex items-center gap-3">
                                {/* Sidebar kapalıyken inline buton */}
                                {!isSidebarOpen && (
                                    <button 
                                        onClick={() => setIsSidebarOpen(true)}
                                        className="p-2 bg-slate-100 hover:bg-slate-200 rounded-xl text-slate-500 transition-colors"
                                    >
                                        <Search size={18} />
                                    </button>
                                )}
                                <div>
                                    <h2 className="text-xl font-black text-slate-800 tracking-tight leading-none">Trend Analizi</h2>
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">
                                        {selectedTags.length} Aktif Sinyal
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 bg-slate-50 p-2 px-4 rounded-2xl border border-slate-100 shadow-inner">
                                <div className="flex flex-col">
                                    <label className="text-[9px] font-black text-slate-400 mb-0.5 uppercase">Başlangıç</label>
                                    <input type="datetime-local" className="bg-transparent text-xs font-bold outline-none text-slate-600" value={startTime} onChange={e => setStartTime(e.target.value)} />
                                </div>
                                <div className="w-px h-8 bg-slate-200" />
                                <div className="flex flex-col">
                                    <label className="text-[9px] font-black text-slate-400 mb-0.5 uppercase">Bitiş</label>
                                    <input type="datetime-local" className="bg-transparent text-xs font-bold outline-none text-slate-600" value={endTime} onChange={e => setEndTime(e.target.value)} />
                                </div>
                                <div className="w-px h-8 bg-slate-200" />
                                <div className="flex flex-col">
                                    <label className="text-[9px] font-black text-slate-400 mb-0.5 uppercase">Aralık</label>
                                    <select className="bg-transparent text-xs font-bold outline-none cursor-pointer text-blue-600" value={interval} onChange={e => setInterval(e.target.value)}>
                                        <option value="1m">1 dk</option>
                                        <option value="10m">10 dk</option>
                                        <option value="1h">1 saat</option>
                                        <option value="1d">1 gün</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* GRAFİK ALANI */}
                        <div className="flex-1 min-h-0">
                            {trendLoading ? (
                                <div className="h-full flex items-center justify-center text-slate-300 font-black animate-pulse tracking-[0.2em]">Veri Yükleniyor...</div>
                            ) : (
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                        <XAxis dataKey="Time" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} minTickGap={80} />
                                        <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} domain={['auto', 'auto']} />
                                        <Tooltip 
                                            contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', padding: '12px' }} 
                                            labelStyle={{ fontWeight: '800', color: '#1e293b', marginBottom: '8px' }}
                                        />
                                        <Legend verticalAlign="top" align="right" iconType="circle" wrapperStyle={{ paddingBottom: '20px', fontSize: '11px', fontWeight: 'bold' }} />

                                        {selectedTags.map((tag, index) => (
                                            <Area
                                                key={tag.Path}
                                                name={tag.Name}
                                                dataKey={tag.Path}
                                                type="monotone"
                                                stroke={COLORS[index % COLORS.length]}
                                                fill={COLORS[index % COLORS.length]}
                                                fillOpacity={0.06}
                                                strokeWidth={2}
                                                dot={false}
                                                activeDot={{ r: 4, strokeWidth: 0 }}
                                                connectNulls
                                            />
                                        ))}
                                    </AreaChart>
                                </ResponsiveContainer>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="flex-1 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center text-slate-400 p-10 text-center">
                        <div className="w-16 h-16 bg-white rounded-2xl shadow-sm border border-slate-100 flex items-center justify-center mb-4">
                            <Activity size={32} className="text-slate-300" />
                        </div>
                        <p className="font-black uppercase tracking-[0.2em] text-sm mb-2">Analiz Bekleniyor</p>
                        <p className="text-xs font-medium max-w-[200px]">Grafiği oluşturmak için sol panelden en az bir veri noktası seçmelisiniz.</p>
                        {!isSidebarOpen && (
                            <button 
                                onClick={() => setIsSidebarOpen(true)}
                                className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all"
                            >
                                Seçimi Başlat
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default TrendAnalysis;