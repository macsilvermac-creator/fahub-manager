
import React, { useContext, useEffect, useState } from 'react';
import { UserContext, UserContextType } from '../components/Layout';
import { storageService } from '../services/storageService';
import { authService } from '../services/authService';
import LazyImage from '../components/LazyImage';
import Card from '../components/Card';
import { 
    ActivityIcon, ClipboardIcon, DumbbellIcon, 
    UsersIcon, CheckCircleIcon, ClockIcon 
} from '../components/icons/UiIcons';
import { TrophyIcon, WhistleIcon } from '../components/icons/NavIcons';
// @ts-ignore
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
    const { currentRole } = useContext(UserContext) as UserContextType;
    const navigate = useNavigate();
    
    const [me, setMe] = useState<any>(null);
    const [missions, setMissions] = useState<any[]>([]);

    useEffect(() => {
        const user = authService.getCurrentUser();
        const all = storageService.getPlayers();
        const myData = all.find(p => p.name === user?.name) || all[0];
        setMe(myData);
        if (myData) setMissions(storageService.getAthleteMissions(myData.id));
    }, [currentRole]);

    const renderPlayerDashboard = () => (
        <div className="space-y-6 animate-fade-in pb-20">
            {/* HERO SECTION COMPACTA */}
            <div className="bg-[#1e293b]/60 backdrop-blur-xl rounded-3xl p-6 border border-white/5 flex flex-col md:flex-row items-center gap-6 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-highlight/20"></div>
                
                <div className="relative shrink-0">
                    <div className="w-24 h-24 rounded-2xl p-[2px] bg-gradient-to-br from-highlight to-cyan-500 shadow-glow relative">
                        <LazyImage src={me?.avatarUrl} className="w-full h-full rounded-2xl object-cover border-2 border-[#0f172a]" />
                        <div className="absolute -bottom-2 -right-2 bg-highlight text-white text-[10px] font-black px-2 py-0.5 rounded-lg border-2 border-[#0f172a]">
                            LVL {me?.level}
                        </div>
                    </div>
                    {/* XP BAR COMPACTA ABAIXO DA FOTO */}
                    <div className="mt-4 w-full px-1">
                        <div className="flex justify-between text-[8px] font-black text-text-secondary uppercase mb-1">
                            <span>Progresso</span>
                            <span>{me?.xp % 100}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-black/40 rounded-full overflow-hidden border border-white/5">
                            <div className="h-full bg-gradient-to-r from-highlight to-cyan-400" style={{ width: `${me?.xp % 100}%` }}></div>
                        </div>
                    </div>
                </div>

                <div className="flex-1 text-center md:text-left">
                    <h1 className="text-3xl font-black text-white italic uppercase tracking-tighter leading-none">{me?.name}</h1>
                    <p className="text-highlight font-black text-[10px] uppercase tracking-widest mt-1">{me?.position} • FAHUB STARS</p>
                    
                    <div className="flex gap-2 mt-4 justify-center md:justify-start">
                        <div className="bg-white/5 px-4 py-2 rounded-xl border border-white/5 text-center min-w-[80px]">
                            <p className="text-[8px] text-text-secondary font-bold uppercase mb-0.5">Rating</p>
                            <p className="text-lg font-black text-white leading-none">{me?.rating}</p>
                        </div>
                        <div className="bg-white/5 px-4 py-2 rounded-xl border border-white/5 text-center min-w-[80px]">
                            <p className="text-[8px] text-text-secondary font-bold uppercase mb-0.5">Rank Pos</p>
                            <p className="text-lg font-black text-white leading-none">#4</p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-2 shrink-0">
                    <button onClick={() => navigate('/profile')} className="bg-white text-black font-black text-[10px] px-8 py-2.5 rounded-xl uppercase hover:scale-105 transition-all shadow-lg">Ver Meus Stats</button>
                    <button onClick={() => navigate('/academy')} className="bg-white/5 text-white border border-white/10 font-black text-[10px] px-8 py-2.5 rounded-xl uppercase hover:bg-white/10 transition-all">Minha Ficha</button>
                </div>
            </div>

            {/* PRÓXIMAS MISSÕES (UNIFICADO) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card title="Próximas Missões">
                    <div className="space-y-3">
                        {missions.length > 0 ? missions.slice(0, 3).map((m: any, i: number) => (
                            <div key={i} className="bg-black/20 p-4 rounded-2xl border border-white/5 flex items-center justify-between group hover:border-highlight/50 transition-all cursor-pointer">
                                <div className="flex items-center gap-4">
                                    <div className={`p-3 rounded-xl ${m.missionType === 'GAME' ? 'bg-red-500/10 text-red-400' : 'bg-blue-500/10 text-blue-400'}`}>
                                        {m.missionType === 'GAME' ? <TrophyIcon className="w-5 h-5" /> : <WhistleIcon className="w-5 h-5" />}
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-black uppercase opacity-50 tracking-widest">{m.missionType === 'GAME' ? 'Jogo Oficial' : 'Treino Tático'}</p>
                                        <p className="text-white font-black uppercase italic tracking-tighter text-lg leading-tight">
                                            {m.missionType === 'GAME' ? `vs ${m.opponent}` : m.title}
                                        </p>
                                        <p className="text-[10px] text-text-secondary mt-0.5 font-bold">{new Date(m.date).toLocaleDateString()} • {new Date(m.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                                    </div>
                                </div>
                                <button className="bg-highlight/10 text-highlight text-[10px] font-black px-4 py-1.5 rounded-lg transition-all uppercase border border-highlight/20 group-hover:bg-highlight group-hover:text-white">Confirmar</button>
                            </div>
                        )) : <p className="text-center text-text-secondary italic text-sm py-8 opacity-50">Sem missões agendadas para esta semana.</p>}
                    </div>
                </Card>

                <div className="grid grid-cols-2 gap-4">
                    <button onClick={() => navigate('/academy')} className="bg-secondary/40 border border-white/5 p-6 rounded-3xl flex flex-col items-center justify-center gap-3 hover:border-orange-500 transition-all group shadow-xl">
                        <DumbbellIcon className="w-10 h-10 text-orange-400 group-hover:scale-110 transition-transform" />
                        <span className="text-xs font-black text-white uppercase italic">Iron Lab</span>
                    </button>
                    <button onClick={() => navigate('/gemini-playbook')} className="bg-secondary/40 border border-white/5 p-6 rounded-3xl flex flex-col items-center justify-center gap-3 hover:border-purple-500 transition-all group shadow-xl">
                        <ActivityIcon className="w-10 h-10 text-purple-400 group-hover:scale-110 transition-transform" />
                        <span className="text-xs font-black text-white uppercase italic">Playbook</span>
                    </button>
                    <button onClick={() => navigate('/schedule')} className="col-span-2 bg-secondary/40 border border-white/5 p-4 rounded-2xl flex items-center justify-center gap-3 hover:bg-white/5 transition-all">
                        <ClockIcon className="w-4 h-4 text-text-secondary" />
                        <span className="text-[10px] font-black text-text-secondary uppercase tracking-widest">Ver Agenda Completa</span>
                    </button>
                </div>
            </div>
        </div>
    );

    if (currentRole === 'PLAYER') return renderPlayerDashboard();
    
    return (
        <div className="space-y-6 animate-fade-in pb-20">
             <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter">Portal da Gestão</h2>
             <p className="text-text-secondary italic">Utilize a Matrix lateral para alternar entre as visões operacionais.</p>
        </div>
    );
};

export default Dashboard;