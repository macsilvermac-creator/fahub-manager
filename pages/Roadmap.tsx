
import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import { storageService } from '../services/storageService';
import { RoadmapItem } from '../types';
import { CheckCircleIcon, ClockIcon, ActivityIcon, SparklesIcon, TargetIcon } from '../components/icons/UiIcons';
import { TrophyIcon } from '../components/icons/NavIcons';

const Roadmap: React.FC = () => {
    const [roadmap, setRoadmap] = useState<RoadmapItem[]>([]);
    const [completion, setCompletion] = useState(0);

    useEffect(() => {
        const load = () => {
            /* Fix: Cast status to satisfy literal type union */
            const loadedRoadmap = storageService.getRoadmap().map(item => ({
                ...item,
                status: item.status as "TODO" | "DOING" | "DONE"
            }));
            setRoadmap(loadedRoadmap);
            setCompletion(storageService.getProjectCompletion());
        };
        load();
        const unsub = storageService.subscribe('roadmap', load);
        return unsub;
    }, []);

    const getStatusStyle = (status: string) => {
        if (status === 'DONE') return 'bg-green-500/20 text-green-400 border-green-500/50';
        if (status === 'DOING') return 'bg-blue-500/20 text-blue-400 border-blue-500/50 animate-pulse';
        return 'bg-white/5 text-text-secondary border-white/10';
    };

    return (
        <div className="space-y-6 pb-20 animate-fade-in max-w-5xl mx-auto">
            <div className="bg-gradient-to-r from-red-700 via-black to-slate-900 p-8 rounded-[2.5rem] border border-white/10 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-5">
                    <TrophyIcon className="w-64 h-64 text-white" />
                </div>
                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 bg-white/10 rounded-lg backdrop-blur-md">
                             <TargetIcon className="w-6 h-6 text-red-400" />
                        </div>
                        <span className="text-xs font-black text-red-400 uppercase tracking-[0.3em]">Operação Joinville Gladiators</span>
                    </div>
                    
                    <h2 className="text-4xl md:text-5xl font-black text-white italic uppercase tracking-tighter leading-none">Missão: Kickoff 30/12</h2>
                    <p className="text-text-secondary font-bold text-sm mt-3 opacity-80">Sprint final de estabilização para o primeiro teste de stress real.</p>
                    
                    <div className="mt-10 flex flex-col md:flex-row items-end gap-6">
                        <div className="flex-1 w-full">
                            <div className="flex justify-between text-[10px] font-black text-white uppercase mb-2 tracking-widest">
                                <span>Status da Prontidão</span>
                                <span className="text-highlight">{completion}%</span>
                            </div>
                            <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden border border-white/10">
                                <div className="h-full bg-gradient-to-r from-red-600 to-green-500 transition-all duration-1000 shadow-glow" style={{ width: `${completion}%` }}></div>
                            </div>
                        </div>
                        <div className="bg-white/10 backdrop-blur-xl text-white px-8 py-3 rounded-3xl border border-white/10 text-center min-w-[140px]">
                            <p className="text-[10px] font-black uppercase opacity-60">Faltam</p>
                            <p className="text-3xl font-black italic">{roadmap.filter(i => i.status !== 'DONE').length} <span className="text-sm">ITENS</span></p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
                <div className="md:col-span-7 space-y-4">
                    <h3 className="text-xs font-black text-text-secondary uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                        <ActivityIcon className="w-4 h-4" /> Log de Desenvolvimento
                    </h3>
                    <div className="space-y-3">
                        {roadmap.map((item) => (
                            <div key={item.id} className={`p-5 rounded-3xl border flex gap-5 transition-all ${getStatusStyle(item.status)}`}>
                                <div className="text-center w-10 shrink-0 flex flex-col justify-center border-r border-white/10 pr-5">
                                    <span className="text-[8px] font-black uppercase opacity-50">Dia</span>
                                    <p className="text-xl font-black">{item.day}</p>
                                </div>
                                <div className="flex-1">
                                    <h4 className="font-bold uppercase text-sm italic tracking-tight">{item.title}</h4>
                                    <p className="text-xs opacity-70 mt-1 leading-relaxed">{item.description}</p>
                                </div>
                                <div className="self-center">
                                    {item.status === 'DONE' ? <CheckCircleIcon className="w-6 h-6 text-green-400" /> : <ClockIcon className="w-6 h-6 opacity-20" />}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="md:col-span-5 space-y-6">
                    <Card title="Próxima Parada">
                        <div className="p-6 bg-red-600/10 border-2 border-red-500/30 rounded-[2rem] text-center">
                             <SparklesIcon className="w-10 h-10 text-red-500 mx-auto mb-4" />
                             <p className="text-[10px] font-black text-red-400 uppercase mb-1">Amanhã (17/12)</p>
                             <h4 className="text-white font-black uppercase italic text-lg">Módulo Roster Pro</h4>
                             <p className="text-xs text-text-secondary mt-2">Ativação de biometria e controle de validade de equipamentos de segurança.</p>
                        </div>
                    </Card>

                    <Card title="Recursos Inteligentes">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-black/20 p-4 rounded-2xl border border-white/5 text-center group hover:border-highlight transition-all">
                                <ActivityIcon className="w-8 h-8 text-highlight mx-auto mb-2 group-hover:scale-110 transition-transform" />
                                <p className="text-[10px] font-bold text-text-secondary uppercase">Database</p>
                                <p className="text-white font-black text-xs">JOINVILLE_v1</p>
                            </div>
                            <div className="bg-black/20 p-4 rounded-2xl border border-white/5 text-center group hover:border-purple-500 transition-all">
                                <SparklesIcon className="w-8 h-8 text-purple-400 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                                <p className="text-[10px] font-bold text-text-secondary uppercase">Gemini AI</p>
                                <p className="text-white font-black text-xs">MODEL 3.0 PRO</p>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default Roadmap;