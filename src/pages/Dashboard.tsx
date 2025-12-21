
import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { storageService } from '../services/storageService';
import { LeagueRanking, PracticeSession } from '../types';
import Card from '../components/Card';
import { ClockIcon, WhistleIcon, ActivityIcon, TrophyIcon } from '../components/icons/UiIcons';

const Dashboard: React.FC = () => {
    const navigate = useNavigate();
    const [rankings, setRankings] = useState<LeagueRanking[]>([]);
    const [practices, setPractices] = useState<PracticeSession[]>([]);

    useEffect(() => {
        storageService.initializeRAM();
        const load = () => {
            setRankings(storageService.getRankings());
            setPractices(storageService.getPracticeSessions());
        };
        load();
        return storageService.subscribe('storage_update', load);
    }, []);

    // Busca o treino de hoje ou o mais recente agendado
    const activePractice = useMemo(() => {
        if (!practices.length) return null;
        const today = new Date().toISOString().split('T')[0];
        // Tenta achar um treino de hoje, se não pega o primeiro da lista (mais recente criado)
        return practices.find(p => new Date(p.date).toISOString().split('T')[0] === today) || practices[0];
    }, [practices]);

    const handleKickoff = () => {
        if (activePractice) {
            navigate(`/practice-execution/${activePractice.id}`);
        } else {
            navigate('/training-day');
        }
    };

    return (
        <div className="flex flex-col h-full space-y-6 animate-fade-in pb-10">
            {/* TICKER */}
            <div className="bg-[#0B1120] border-y border-white/5 h-12 flex items-center overflow-hidden shrink-0 no-print">
                <div className="bg-red-600 px-4 h-full flex items-center shrink-0">
                    <span className="text-[10px] font-black text-white italic tracking-tighter">LIVE RANKING</span>
                </div>
                <div className="flex-1 flex gap-8 px-6 overflow-x-auto no-scrollbar animate-marquee whitespace-nowrap">
                    {rankings.map(r => (
                        <div key={r.teamName} className="flex items-center gap-2">
                            <span className="text-highlight font-black italic text-sm">{r.position}º</span>
                            <span className="text-white font-bold text-xs uppercase">{r.teamName}</span>
                            <span className="text-text-secondary text-[10px] font-mono">({r.record})</span>
                        </div>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1">
                <div className="lg:col-span-3 space-y-6">
                    <div className="bg-gradient-to-br from-slate-900 to-black p-10 rounded-[3rem] border border-white/10 shadow-2xl relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity">
                            <WhistleIcon className="w-64 h-64 text-white" />
                        </div>
                        <div className="relative z-10">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-3 h-3 rounded-full bg-red-600 animate-pulse shadow-[0_0_10px_rgba(220,38,38,0.8)]"></div>
                                <span className="text-xs font-black text-white tracking-[0.5em] uppercase italic">Status de Campo: {activePractice ? 'READY FOR SNAP' : 'AQUARTELADO'}</span>
                            </div>
                            
                            <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-8">
                                <div>
                                    <h2 className="text-5xl font-black text-white italic uppercase tracking-tighter leading-none">
                                        {activePractice ? activePractice.title : 'Sem Treino Agendado'}
                                    </h2>
                                    <div className="flex gap-6 mt-4">
                                        <p className="text-highlight font-black text-xl uppercase italic">
                                            {activePractice ? `FOCO: ${activePractice.focus}` : 'Planeje sua próxima sessão'}
                                        </p>
                                        {activePractice && (
                                            <span className="bg-white/10 text-white px-3 py-1 rounded-full text-xs font-mono font-bold border border-white/20">
                                                {activePractice.startTime}
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-xs text-text-secondary mt-4 font-bold opacity-60 uppercase tracking-widest">
                                        {new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: '2-digit', month: 'long' })}
                                    </p>
                                </div>
                                <button 
                                    onClick={handleKickoff}
                                    className="bg-highlight hover:bg-highlight-hover text-white px-12 py-6 rounded-[2rem] font-black uppercase italic text-lg shadow-[0_0_30px_rgba(5,150,105,0.4)] transform active:scale-95 transition-all flex items-center gap-3 group"
                                >
                                    <WhistleIcon className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                                    DAR KICKOFF NO TREINO
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card title="Recursos Táticos Rápidos">
                             <div className="grid grid-cols-2 gap-4">
                                 <button onClick={() => navigate('/roster')} className="p-6 bg-black/20 rounded-3xl border border-white/5 hover:border-highlight flex flex-col items-center gap-3 transition-all group">
                                     <ActivityIcon className="w-10 h-10 text-blue-400 group-hover:scale-110 transition-transform" />
                                     <span className="text-xs font-black text-white uppercase italic">Depth Chart</span>
                                 </button>
                                 <button onClick={() => navigate('/training-day')} className="p-6 bg-black/20 rounded-3xl border border-white/5 hover:border-highlight flex flex-col items-center gap-3 transition-all group">
                                     <TrophyIcon className="w-10 h-10 text-red-500 group-hover:scale-110 transition-transform" />
                                     <span className="text-xs font-black text-white uppercase italic">War Room</span>
                                 </button>
                             </div>
                        </Card>
                        <Card title="Prontidão Física">
                             <div className="flex items-center justify-center py-4">
                                 <div className="relative w-28 h-28 flex items-center justify-center">
                                     <svg className="w-full h-full transform -rotate-90">
                                         <circle cx="56" cy="56" r="48" fill="transparent" stroke="currentColor" strokeWidth="8" className="text-white/5" />
                                         <circle cx="56" cy="56" r="48" fill="transparent" stroke="currentColor" strokeWidth="8" strokeDasharray="301" strokeDashoffset="60" className="text-highlight" />
                                     </svg>
                                     <span className="absolute text-3xl font-black text-white italic">82%</span>
                                 </div>
                                 <div className="ml-8">
                                     <p className="text-[10px] font-black text-text-secondary uppercase tracking-widest">Elenco Apto</p>
                                     <p className="text-sm text-white mt-1 font-bold italic">5 jogadores em observação no DP.</p>
                                 </div>
                             </div>
                        </Card>
                    </div>
                </div>

                <div className="lg:col-span-1">
                    <div className="bg-secondary rounded-[2.5rem] border border-white/5 flex flex-col h-full overflow-hidden shadow-xl">
                        <div className="p-6 border-b border-white/5 bg-black/20">
                            <h3 className="text-xs font-black text-highlight uppercase tracking-[0.4em] flex items-center gap-2">
                                <ClockIcon className="w-4 h-4"/> THE FUTURE
                            </h3>
                        </div>
                        <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                             {[
                                 { day: 'TER', title: 'Ajuste de Blitz', type: 'FIELD' },
                                 { day: 'QUA', title: 'Video: Scout Rex', type: 'VIDEO' },
                                 { day: 'QUI', title: 'Walkthrough', type: 'FIELD' },
                                 { day: 'SÁB', title: 'GAME DAY', type: 'GAME' },
                             ].map((item, i) => (
                                 <div key={i} className="bg-black/20 p-5 rounded-3xl border border-white/5 hover:border-white/20 transition-all flex items-center gap-4 group cursor-pointer">
                                     <div className="w-12 h-12 rounded-2xl bg-white/5 flex flex-col items-center justify-center shrink-0 border border-white/5 group-hover:border-highlight transition-all">
                                         <span className="text-[10px] font-black text-highlight uppercase leading-none">{item.day}</span>
                                     </div>
                                     <div className="flex-1 min-w-0">
                                         <h4 className="text-xs font-black text-white uppercase italic truncate">{item.title}</h4>
                                         <span className="text-[8px] text-text-secondary uppercase tracking-[0.2em] font-black">{item.type}</span>
                                     </div>
                                 </div>
                             ))}
                        </div>
                    </div>
                </div>
            </div>
            
            <style>{`
                @keyframes marquee { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
                .animate-marquee { animation: marquee 30s linear infinite; }
            `}</style>
        </div>
    );
};

export default Dashboard;