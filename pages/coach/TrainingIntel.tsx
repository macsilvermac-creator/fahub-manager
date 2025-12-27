
import React, { useState } from 'react';
import PageHeader from '../../components/PageHeader';
import { WhistleIcon, ChevronDownIcon } from '../../components/icons/UiIcons';

const TrainingIntel: React.FC = () => {
    const [expandedId, setExpandedId] = useState<number | null>(null);
    const reports = [
        { id: 1, unit: 'ATAQUE', title: 'Redzone Install', date: 'Hoje', summary: 'Execução de rotas slant excelente.' },
        { id: 2, unit: 'DEFESA', title: 'Blitz Adjustments', date: 'Ontem', summary: 'Pressão constante, gap control precisa melhorar.' }
    ];

    return (
        <div className="space-y-6 animate-fade-in flex flex-col h-full">
            <PageHeader title="Training Intel" subtitle="Relatórios técnicos das unidades." />
            <div className="flex-1 bg-secondary/30 rounded-[2rem] border border-white/5 p-4 overflow-y-auto custom-scrollbar space-y-3">
                {reports.map((report) => (
                    <div key={report.id} className="bg-black/20 rounded-2xl border border-white/5 overflow-hidden">
                        <button onClick={() => setExpandedId(expandedId === report.id ? null : report.id)} className="w-full p-4 flex justify-between items-center text-left">
                            <div className="flex items-center gap-4">
                                <div className="p-2 bg-white/5 rounded-lg"><WhistleIcon className="w-5 h-5 text-highlight"/></div>
                                <div>
                                    <h4 className="text-white font-bold uppercase text-sm">{report.title}</h4>
                                    <p className="text-[10px] text-text-secondary">{report.unit} • {report.date}</p>
                                </div>
                            </div>
                            <ChevronDownIcon className="w-4 h-4 text-text-secondary"/>
                        </button>
                        {expandedId === report.id && (
                            <div className="px-4 pb-4 text-xs text-text-secondary border-t border-white/5 pt-2 mt-2">
                                {report.summary}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};
export default TrainingIntel;