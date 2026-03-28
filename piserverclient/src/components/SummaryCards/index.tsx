import React from 'react';
import { turbine } from '../../images';
import type { DataItem } from '../../api/data/type';

interface Props { totalCount: number; data: DataItem[]; }

const SummaryCards = ({ totalCount, data }: Props) => {
    const alarmCount = data.filter(i => (i.MaxLimit && i.Value > i.MaxLimit) || (i.MinLimit && i.Value < i.MinLimit)).length;

    return (
        <div className="flex flex-wrap md:flex-nowrap gap-4 items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex items-center gap-4 flex-grow">
                <img src={turbine} alt="Unit" className="w-10 h-10 opacity-80" />
                <div>
                    <h1 className="text-xl font-bold text-slate-800">Üretim İzleme Paneli</h1>
                    <p className="text-slate-400 text-xs">Anlık PI System Entegrasyonu</p>
                </div>
            </div>
            
            <div className="flex gap-8 px-4">
                <CardItem label="Toplam Tag" value={totalCount} color="text-blue-600" />
                <CardItem label="Alarm Durumu" value={alarmCount} color={alarmCount > 0 ? "text-red-500" : "text-green-500"} />
            </div>
        </div>
    );
};

const CardItem = ({ label, value, color }: { label: string, value: number, color: string }) => (
    <div className="text-right">
        <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">{label}</p>
        <p className={`text-2xl font-black ${color}`}>{value}</p>
    </div>
);

export default SummaryCards;