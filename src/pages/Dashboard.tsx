import React, { useContext, useEffect, useState, useMemo } from 'react';
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
            {/* HERO HERO SECTION COMPACTA */}
            <div className="bg-[#1e293b]/40 backdrop-blur-xl rounded-3xl p-6 border border-white/5 flex flex-col md:flex-row items-center gap-6 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-highlight/20"></div>
                
                <div className="relative">
                    <div className="w-24 h-24 rounded-2xl p-[2px] bg-gradient-to-br from-highlight to-cyan-500 shadow-glow">
                        <LazyImage src={me?.avatarUrl} className="w-full h-full rounded-2xl object-cover border-2 border-[#0f172a]" />
                    </div>
                    {/* XP BAR COMPACTA ABAIXO DA FOTO */}
                    <div className="mt-2 w-full px-1">
                        <div className="flex justify-between text-[7px] font-black text-text-secondary uppercase mb-0.5">
                            <span>LVL {me?.level}</span>
                            <span>{me?.xp} XP</span>
                        </div>
                        <div className="h-1 w-full bg-black/40 rounded-full overflow-hidden">
                            <div className="h-full bg-gradient-to-r from-highlight to-cyan-400" style={{ width: `${me?.xp % 100}%` }}></div>
                        </div>
                    </div>
                </div>

                <div className="flex-1 text-center md:text-left">
                    <h1 className="text-3xl font-black text-white italic uppercase tracking-tighter leading-none">{me?.name}</h1>
                    <p className="text-highlight font-black text-[10px] uppercase tracking-widest mt-1">{me?.position} • FAHUB STARS</p>
                    
                    <div className="flex gap-2 mt-4 justify-center md:justify-start">
                        <div className="bg-white/5 px-3 py-1 rounded-lg border border-white/5 text-center">
                            <p className="text-[8px] text-text-secondary font-bold uppercase">Rating</p>
                            <p className="text-sm font-black text-white">{me?.rating}</p>
                        </div>
                        <div className="bg-white/5 px-3 py-1 rounded-lg border border-white/5 text-center">
                            <p className="text-[8px] text-text-secondary font-bold uppercase">Rank</p>
                            <p className="text-sm font-black text-white">#12</p>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    <button onClick={() => navigate('/profile')} className="bg-white text-black font-black text-[10px] px-6 py-2 rounded-xl uppercase hover:scale-105 transition-all">Ver Meus Stats</button>
                    <button onClick={() => navigate('/academy')} className="bg-white/5 text-white border border-white/10 font-black text-[10px] px-6 py-2 rounded-xl uppercase hover:bg-white/10 transition-all">Minha Ficha</button>
                </div>
            </div>

            {/* PRÓXIMAS MISSÕES (UNIFICADO) */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card title="Próximas Missões">
                    <div className="space-y-3">
                        {missions.length > 0 ? missions.slice(0, 3).map((m: any, i: number) => (
                            <div key={i} className="bg-black/20 p-4 rounded-2xl border border-white/5 flex items-center justify-between group hover:border-highlight/50 transition-all">
                                <div className="flex items-center gap-4">
                                    <div className={`p-3 rounded-xl ${m.missionType === 'GAME' ? 'bg-red-500/10 text-red-400' : 'bg-blue-500/10 text-blue-400'}`}>
                                        {m.missionType === 'GAME' ? <TrophyIcon className="w-5 h-5" /> : <WhistleIcon className="w-5 h-5" />}
                                    </div>
                                    <div>
                                        <p className="text-[9px] font-black uppercase opacity-50">{m.missionType === 'GAME' ? 'Jogo Oficial' : 'Treino Tático'}</p>
                                        <p className="text-white font-black uppercase italic tracking-tighter">
                                            {m.missionType === 'GAME' ? `vs ${m.opponent}` : m.title}
                                        </p>
                                        <p className="text-[10px] text-text-secondary mt-0.5">{new Date(m.date).toLocaleDateString()} • {new Date(m.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                                    </div>
                                </div>
                                <button className="opacity-0 group-hover:opacity-100 bg-highlight text-white text-[10px] font-black px-4 py-1.5 rounded-lg transition-all uppercase">Ver Info</button>
                            </div>
                        )) : <p className="text-center text-text-secondary italic text-sm py-4">Sem missões agendadas.</p>}
                    </div>
                </Card>

                <div className="grid grid-cols-2 gap-4">
                    <button onClick={() => navigate('/academy')} className="bg-secondary/40 border border-white/5 p-6 rounded-3xl flex flex-col items-center justify-center gap-3 hover:border-orange-500 transition-all group">
                        <DumbbellIcon className="w-10 h-10 text-orange-400 group-hover:scale-110 transition-transform" />
                        <span className="text-xs font-black text-white uppercase italic">Iron Lab</span>
                    </button>
                    <button onClick={() => navigate('/gemini-playbook')} className="bg-secondary/40 border border-white/5 p-6 rounded-3xl flex flex-col items-center justify-center gap-3 hover:border-purple-500 transition-all group">
                        <ActivityIcon className="w-10 h-10 text-purple-400 group-hover:scale-110 transition-transform" />
                        <span className="text-xs font-black text-white uppercase italic">Playbook</span>
                    </button>
                </div>
            </div>
        </div>
    );

    if (currentRole === 'PLAYER') return renderPlayerDashboard();
    
    return (
        <div className="space-y-6 animate-fade-in pb-20">
             <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter">Modo Diretor (CEO)</h2>
             <p className="text-text-secondary italic">Acesse as personas via Matrix lateral.</p>
        </div>
    );
};

export default Dashboard;