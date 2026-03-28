import React from 'react';
import type { DataItem } from '../../api/data/type';

const TagTable = ({ tags }: { tags: DataItem[] }) => (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left">
            <thead>
                <tr className="bg-slate-50/50 text-slate-400 text-[11px] uppercase tracking-widest font-bold">
                    <th className="p-4">Parametre</th>
                    <th className="p-4 text-right">Değer</th>
                    <th className="p-4 text-center">Limitler</th>
                    <th className="p-4 text-center">Durum</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
                {tags.map((tag) => {
                    const hasAlarm = (tag.MaxLimit && tag.Value > tag.MaxLimit) || (tag.MinLimit && tag.Value < tag.MinLimit);
                    return (
                        <tr key={tag.Id} className="hover:bg-slate-50/80 transition-all cursor-pointer">
                            <td className="p-4">
                                <div className="text-sm font-semibold text-slate-700">{tag.Name}</div>
                                <div className="text-[10px] text-slate-400 font-mono italic">{tag.Path.split('!').pop()}</div>
                            </td>
                            <td className={`p-4 text-right font-mono text-lg font-bold ${hasAlarm ? 'text-red-600' : 'text-slate-600'}`}>
                                {tag.Value.toFixed(2)}
                            </td>
                            <td className="p-4 text-center text-[11px] text-slate-500 font-medium">
                                {tag.MinLimit ?? '∞'} <span className="text-slate-300 mx-1">|</span> {tag.MaxLimit ?? '∞'}
                            </td>
                            <td className="p-4 text-center">
                                <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${
                                    hasAlarm ? 'bg-red-100 text-red-600 animate-pulse' : 'bg-emerald-100 text-emerald-600'
                                }`}>
                                    {hasAlarm ? 'ALARM' : 'OK'}
                                </span>
                            </td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
    </div>
);

export default TagTable;