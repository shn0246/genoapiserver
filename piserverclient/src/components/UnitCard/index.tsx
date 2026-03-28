import React from 'react';
import type { DataItem } from '../../api/data/type';

interface Props {
    title: string;
    tags: DataItem[];
}

const UnitCard = ({ title, tags }: Props) => (
    <div className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
        <div className="border-b border-slate-100 pb-2 mb-4 flex justify-between items-center">
            <h3 className="text-lg font-bold text-slate-800">{title}</h3>
            <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-1 rounded font-black uppercase">Aktif</span>
        </div>
        
        <div className="space-y-3">
            {tags.map(tag => {
                const isAlarm = (tag.MaxLimit && tag.Value > tag.MaxLimit) || (tag.MinLimit && tag.Value < tag.MinLimit);
                return (
                    <div key={tag.Id} className="flex justify-between items-center text-sm">
                        <span className="text-slate-500 font-medium">{tag.Name.replace(title, "").trim()}</span>
                        <div className="flex flex-col items-end">
                            <span className={`font-mono font-bold ${isAlarm ? 'text-red-600' : 'text-slate-700'}`}>
                                {tag.Value.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                            </span>
                            {tag.MaxLimit && (
                                <span className="text-[9px] text-slate-400 italic">Max: {tag.MaxLimit}</span>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    </div>
);

export default UnitCard;