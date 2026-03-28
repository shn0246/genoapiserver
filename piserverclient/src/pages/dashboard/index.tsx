import React from 'react';
import { useGetDataListQuery } from '../../api/data';
import UnitCard from '../../components/UnitCard';

const Dashboard = ({ selectedPlant }: { selectedPlant: string }) => {
    // 2 dakikada bir veri yenileme ve son güncelleme zamanı
    const { data: dataList, isLoading, fulfilledTimeStamp, refetch, isFetching } = useGetDataListQuery(undefined, {
        pollingInterval: 120000,
    });

    const data = dataList?.Data ?? [];

    // Veriyi Ünite bazlı filtreleme fonksiyonu
    const getUnitData = (prefix: string) => data.filter(item => item.Name.includes(prefix));

    const lastUpdate = fulfilledTimeStamp 
        ? new Date(fulfilledTimeStamp).toLocaleTimeString('tr-TR')
        : '-';

    if (isLoading) return (
        <div className="flex items-center justify-center h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
    );

    return (
        <div className="space-y-6 p-6">
            {/* ÜST BAŞLIK VE AKSİYON ALANI */}
            <div className="flex justify-between items-end border-b border-slate-200 pb-4">
                <div>
                    <h2 className="text-sm font-bold text-blue-600 uppercase tracking-widest leading-none mb-1">
                        Canlı İzleme Paneli
                    </h2>
                    <h1 className="text-3xl font-black text-slate-800 tracking-tighter">
                        {selectedPlant} <span className="text-slate-400 font-light">HEPP</span>
                    </h1>
                </div>

                <div className="flex items-center gap-4">
                    <div className="text-right">
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Son Güncelleme</p>
                        <p className="text-sm font-mono font-bold text-slate-600">{lastUpdate}</p>
                    </div>
                    <button 
                        onClick={() => refetch()}
                        disabled={isFetching}
                        className="p-2 hover:bg-slate-100 rounded-full transition-colors disabled:opacity-50"
                    >
                        <svg className={`w-5 h-5 text-blue-600 ${isFetching ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                    </button>
                </div>
            </div>

            {/* ÜRETİM GRUPLARI */}
            <div className="space-y-8">
                {/* 1. GRUP: Ünite 1, 2, 3 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <UnitCard title="Ünite-1" tags={getUnitData("U1")} />
                    <UnitCard title="Ünite-2" tags={getUnitData("U2")} />
                    <UnitCard title="Ünite-3" tags={getUnitData("U3")} />
                </div>

                {/* 2. GRUP: Kademe-1 ve Toplam Güç */}
                <div className="bg-slate-100 p-6 rounded-2xl border border-slate-200 grid grid-cols-1 lg:grid-cols-3 gap-6 shadow-inner">
                    <div className="lg:col-span-2">
                        <h3 className="text-blue-700 font-black mb-4 uppercase text-xs tracking-widest">Kademe-1 Saha Verileri</h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                            {data.filter(i => i.Name.includes("Kademe-1")).map(tag => (
                                <div key={tag.Id} className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
                                    <p className="text-[9px] text-slate-400 font-bold uppercase truncate">{tag.Name}</p>
                                    <p className="text-lg font-mono font-black text-slate-700">{tag.Value.toFixed(2)}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    <div className="bg-blue-600 text-white rounded-xl p-6 flex flex-col justify-center shadow-lg shadow-blue-200">
                        <p className="text-[10px] font-bold opacity-70 uppercase tracking-widest mb-1 text-center">Toplam Santral Üretimi</p>
                        <div className="text-center">
                            <span className="text-4xl font-black tracking-tighter">
                                {data.filter(i => i.Name.includes("Aktif Güç")).reduce((acc, curr) => acc + curr.Value, 0).toLocaleString()}
                            </span>
                            <span className="text-lg ml-2 font-light opacity-80 uppercase">kWh</span>
                        </div>
                    </div>
                </div>

                {/* 3. GRUP: Ünite 4, 5 */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl">
                    <UnitCard title="Ünite-4" tags={getUnitData("U4")} />
                    <UnitCard title="Ünite-5" tags={getUnitData("U5")} />
                </div>
            </div>
        </div>
    );
};

export default Dashboard;