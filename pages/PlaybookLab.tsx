import React, { useState } from 'react';
import PageHeader from '@/components/PageHeader';
import Card from '@/components/Card';
// Fix: Added ChevronRightIcon to the imported icons from UiIcons
import { BookIcon, SparklesIcon, PlayCircleIcon, SearchIcon, ActivityIcon, UsersIcon, ChevronRightIcon } from '@/components/icons/UiIcons';

const PlaybookLab: React.FC = () => {
    const [showAiMentor, setShowAiMentor] = useState(false);
    const [selectedPlay, setSelectedPlay] = useState<any>(null);

    const plays = [
        { id: 1, name: 'Dagger Concept', concept: 'Pass/Deep', desc: 'Overload in the secondary targeting the deep middle.' },
        { id: 2, name: 'Zone Read', concept: 'Run/Option', desc: 'QB reading the DE to determine give or keep.' },
        { id: 3, name: 'Spider 2 Y Banana', concept: 'Pass/PA', desc: 'Classic play-action with the FB release.' },
        { id: 4, name: 'Double Post', concept: 'Pass/Redzone', desc: 'Targeting high-low safety conflicts in the endzone.' }
    ];

    return (
        <div className="h-full flex flex-col space-y-6 animate-fade-in overflow-hidden">
            <PageHeader title="War Room: Playbook" subtitle="Sua prancheta digital de guerra e inteligência tática." />

            <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8 overflow-hidden">
                {/* LEFT: DIGITAL CHALKBOARD (MASTER CONTAINER) */}
                <div className="lg:col-span-8 bg-black/60 rounded-[3rem] border border-white/10 shadow-2xl relative overflow-hidden group flex items-center justify-center p-4">
                    <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/green-dust.png')]"></div>
                    
                    {/* Simulated Field Markings */}
                    <div className="absolute inset-0 p-10 flex flex-col justify-center gap-16 pointer-events-none opacity-20">
                         <div className="w-full h-px bg-white border-dashed"></div>
                         <div className="w-full h-px bg-blue-500 border-solid border-2"></div>
                         <div className="w-full h-px bg-white border-dashed"></div>
                    </div>

                    <div className="relative z-10 w-full h-full flex items-center justify-center">
                         {!selectedPlay ? (
                             <div className="text-center space-y-6">
                                 <div className="w-20 h-20 bg-purple-600/10 rounded-full flex items-center justify-center mx-auto border border-purple-500/20">
                                     <BookIcon className="w-10 h-10 text-purple-400" />
                                 </div>
                                 <p className="text-text-secondary uppercase tracking-[0.4em] text-xs">Selecione uma jogada para iniciar a análise</p>
                             </div>
                         ) : (
                             <div className="text-center animate-scale-in">
                                 <h2 className="text-6xl font-black text-white uppercase italic tracking-tighter mb-4">{selectedPlay.name}</h2>
                                 <p className="text-purple-400 font-bold uppercase tracking-[0.5em] text-sm">Chalkboard Visualization Active</p>
                                 
                                 {/* AI MENTOR TRIGGER */}
                                 <button 
                                    onClick={() => setShowAiMentor(true)}
                                    className="mt-12 bg-purple-600 hover:bg-purple-500 text-white px-10 py-4 rounded-[2rem] font-black uppercase italic text-xs shadow-glow-purple transition-all flex items-center gap-3 mx-auto"
                                 >
                                    <SparklesIcon className="w-5 h-5" /> Consultar IA Mentor
                                 </button>
                             </div>
                         )}
                    </div>
                </div>

                {/* RIGHT: PLAY DECK (SCROLLABLE CARD LIST) */}
                <div className="lg:col-span-4 flex flex-col space-y-4 overflow-hidden">
                    <div className="flex justify-between items-center px-2">
                        <h3 className="text-[10px] font-black text-text-secondary uppercase tracking-[0.4em]">Battle Deck</h3>
                        <SearchIcon className="w-4 h-4 text-white/20" />
                    </div>

                    <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                        {plays.map((play) => (
                            <div 
                                key={play.id}
                                onClick={() => setSelectedPlay(play)}
                                className={`bg-secondary/40 rounded-[2.5rem] border p-8 transition-all cursor-pointer group relative overflow-hidden ${selectedPlay?.id === play.id ? 'border-purple-500 bg-purple-500/10 shadow-glow' : 'border-white/5 hover:border-purple-500/30'}`}
                            >
                                <div className="flex justify-between items-start mb-4">
                                    <span className="text-[9px] font-black text-purple-400 bg-purple-400/10 px-2 py-1 rounded-full uppercase tracking-widest">{play.concept}</span>
                                    <ActivityIcon className={`w-4 h-4 ${selectedPlay?.id === play.id ? 'text-purple-400' : 'text-white/20'}`} />
                                </div>
                                <h4 className={`text-2xl font-black italic uppercase leading-none transition-colors ${selectedPlay?.id === play.id ? 'text-white' : 'text-text-secondary group-hover:text-white'}`}>{play.name}</h4>
                                <p className="text-xs text-text-secondary mt-3 opacity-60 line-clamp-2 leading-relaxed">{play.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* AI MENTOR MODAL */}
            {showAiMentor && selectedPlay && (
                <div className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex items-center justify-center p-6 animate-fade-in" onClick={() => setShowAiMentor(false)}>
                    <div className="bg-[#0B1120] w-full max-w-2xl rounded-[3rem] border border-purple-500/30 overflow-hidden shadow-[0_0_80px_rgba(147,51,234,0.3)]" onClick={e => e.stopPropagation()}>
                        <div className="bg-purple-600 p-8 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <SparklesIcon className="w-8 h-8 text-white" />
                                <div>
                                    <h3 className="text-2xl font-black text-white uppercase italic leading-none">IA Mentor: {selectedPlay.name}</h3>
                                    <p className="text-[10px] text-purple-200 font-bold uppercase tracking-widest mt-1">Análise Tática em Tempo Real</p>
                                </div>
                            </div>
                            <button onClick={() => setShowAiMentor(false)} className="text-white hover:rotate-90 transition-transform">
                                <span className="text-4xl font-light">&times;</span>
                            </button>
                        </div>
                        <div className="p-10 space-y-8">
                            <section>
                                <h5 className="text-xs font-black text-purple-400 uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
                                    <UsersIcon className="w-4 h-4"/> Resumo de Responsabilidades
                                </h5>
                                <p className="text-white text-sm leading-relaxed font-medium">
                                    Esta jogada foca no estresse do Safety profundo. Se a cobertura for Cover 3, sua leitura é o Cornerback externo. Caso seja Cover 2, foque no Hole Shot entre o CB e o Saftey.
                                </p>
                            </section>

                            <section>
                                <h5 className="text-xs font-black text-purple-400 uppercase tracking-[0.3em] mb-4 flex items-center gap-2">
                                    <PlayCircleIcon className="w-4 h-4"/> Execução Profissional (YouTube)
                                </h5>
                                <a 
                                    href={`https://www.youtube.com/results?search_query=NFL+analysis+${selectedPlay.name.replace(' ', '+')}`} 
                                    target="_blank" 
                                    rel="noreferrer"
                                    className="block bg-black/40 border border-white/5 rounded-2xl p-6 hover:border-red-500 transition-all group"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="w-12 h-12 bg-red-600 rounded-xl flex items-center justify-center shadow-lg">
                                                <PlayCircleIcon className="w-6 h-6 text-white" />
                                            </div>
                                            <div>
                                                <p className="text-white font-bold uppercase text-sm">Assistir no YouTube</p>
                                                <p className="text-[10px] text-text-secondary uppercase">Busca técnica automatizada pela IA</p>
                                            </div>
                                        </div>
                                        <ChevronRightIcon className="w-5 h-5 text-white/20 group-hover:text-white transition-all" />
                                    </div>
                                </a>
                            </section>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PlaybookLab;