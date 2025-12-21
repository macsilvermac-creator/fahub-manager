
import React from 'react';
import PageHeader from '../components/PageHeader';
import Card from '../components/Card';
import { SparklesIcon, WhistleIcon, ClockIcon } from '../components/icons/UiIcons';

const TrainingHub: React.FC = () => {
    return (
        <div className="space-y-6 animate-fade-in pb-20">
            <PageHeader title="Training Day Control" subtitle="Gestão operacional de campo e scripts técnicos." />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Botão Imponente de Criação */}
                <button className="group bg-gradient-to-br from-green-600 to-green-900 p-8 rounded-[2.5rem] shadow-2xl border border-green-400/30 flex flex-col items-center justify-center text-center transition-all hover:scale-[1.02] active:scale-95">
                    <div className="p-5 bg-white/10 rounded-2xl mb-4 group-hover:rotate-12 transition-transform">
                        <WhistleIcon className="w-16 h-16 text-white" />
                    </div>
                    <h3 className="text-2xl font-black text-white uppercase italic tracking-tighter">CRIAR NOVO TREINO</h3>
                    <p className="text-green-100 font-bold text-xs uppercase tracking-widest mt-2 opacity-70">Manual ou com Auxílio de IA</p>
                </button>

                {/* Histórico/Próximos */}
                <Card title="Últimos Roteiros">
                    <div className="space-y-3">
                         {[1,2,3].map(i => (
                             <div key={i} className="bg-black/20 p-4 rounded-2xl border border-white/5 flex justify-between items-center group cursor-pointer hover:border-highlight">
                                 <div className="flex gap-4 items-center">
                                     <ClockIcon className="w-5 h-5 text-text-secondary" />
                                     <div>
                                         <p className="text-white font-bold text-sm uppercase">Sessão Técnica #{i}</p>
                                         <p className="text-[10px] text-text-secondary uppercase">22/12/2025 • 120min</p>
                                     </div>
                                 </div>
                                 <SparklesIcon className="w-4 h-4 text-purple-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                             </div>
                         ))}
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default TrainingHub;