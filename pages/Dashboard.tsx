
import React, { useContext, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext, UserContextType } from '@/components/Layout';
import { storageService } from '@/services/storageService';
import { CalendarIcon, WhistleIcon, HeartPulseIcon, ActivityIcon, UsersIcon, ChevronRightIcon } from '@/components/icons/UiIcons';
import ExecutiveDashboard from '@/features/dashboard/ExecutiveDashboard';
import PlayerCareerMode from '@/features/dashboard/PlayerCareerMode';

const Dashboard: React.FC = () => {
    const navigate = useNavigate();
    const { currentRole } = useContext(UserContext) as UserContextType;
    const user = storageService.getCurrentUser();

    const nextEvent = useMemo(() => ({
        title: 'Treino de Unidade: Redzone Focus',
        time: '19:30',
        date: 'Hoje',
        location: 'CT Gladiators'
    }), []);

    if (currentRole === 'MASTER' || currentRole === 'PLATFORM_OWNER') {
        return <ExecutiveDashboard handleCopyInvite={() => {}} />;
    }

    if (currentRole.includes('COACH') || currentRole.includes('COORD')) {
        return (
            <div className="h-full flex flex-col space-y-6 animate-fade-in pb-10">
                {/* AGENDA DE TOPO (BARRA) */}
                <div className="bg-secondary/60 backdrop-blur-md border border-white/10 rounded-2xl p-4 flex items-center justify-between shadow-2xl shrink-0">
                    <div className="flex items-center gap-4">
                        <div className="bg-highlight/20 p-2 rounded-xl border border-highlight/30">
                            <CalendarIcon className="w-5 h-5 text-highlight" />
                        </div>
                        <div>
                            <span className="text-[9px] font-black text-highlight uppercase tracking-[0.3em]">Agenda do Dia</span>
                            <p className="text-white font-bold uppercase italic text-sm">{nextEvent.title} • {nextEvent.time} @ {nextEvent.location}</p>
                        </div>
                    </div>
                    <button onClick={() => navigate('/agenda')} className="p-2 text-text-secondary hover:text-white transition-colors">
                        <ChevronRightIcon className="w-5 h-5" />
                    </button>
                </div>

                {/* GRID DE 4 CONTAINERS IGUAIS */}
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 min-h-0">
                    {/* 1. TRAINING INTEL */}
                    <button 
                        onClick={() => navigate('/coach/training-intel')}
                        className="bg-secondary/40 border border-white/5 rounded-[3rem] p-8 flex flex-col items-center justify-center gap-4 hover:border-highlight/50 transition-all shadow-xl group active:scale-95"
                    >
                        <div className="p-5 bg-blue-600 rounded-3xl shadow-lg group-hover:scale-110 transition-transform">
                            <WhistleIcon className="w-10 h-10 text-white" />
                        </div>
                        <div className="text-center">
                            <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">Training Intel</h3>
                            <p className="text-[10px] text-text-secondary font-bold uppercase tracking-widest mt-1 opacity-60">Relatórios do Último Treino</p>
                        </div>
                    </button>

                    {/* 2. MEDICAL LAB */}
                    <button 
                        onClick={() => navigate('/coach/medical-lab')}
                        className="bg-secondary/40 border border-white/5 rounded-[3rem] p-8 flex flex-col items-center justify-center gap-4 hover:border-highlight/50 transition-all shadow-xl group active:scale-95"
                    >
                        <div className="p-5 bg-red-600 rounded-3xl shadow-lg group-hover:scale-110 transition-transform">
                            <HeartPulseIcon className="w-10 h-10 text-white" />
                        </div>
                        <div className="text-center">
                            <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">Medical Lab</h3>
                            <p className="text-[10px] text-text-secondary font-bold uppercase tracking-widest mt-1 opacity-60">Giro de Prontidão & Saúde</p>
                        </div>
                    </button>

                    {/* 3. SIDELINE LAB */}
                    <button 
                        onClick={() => navigate('/coach/sideline-lab')}
                        className="bg-secondary/40 border border-white/5 rounded-[3rem] p-8 flex flex-col items-center justify-center gap-4 hover:border-highlight/50 transition-all shadow-xl group active:scale-95"
                    >
                        <div className="p-5 bg-purple-600 rounded-3xl shadow-lg group-hover:scale-110 transition-transform">
                            <ActivityIcon className="w-10 h-10 text-white" />
                        </div>
                        <div className="text-center">
                            <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">Sideline Lab</h3>
                            <p className="text-[10px] text-text-secondary font-bold uppercase tracking-widest mt-1 opacity-60">Analytics & Estatísticas IA</p>
                        </div>
                    </button>

                    {/* 4. ROSTER LAB */}
                    <button 
                        onClick={() => navigate('/roster')}
                        className="bg-secondary/40 border border-white/5 rounded-[3rem] p-8 flex flex-col items-center justify-center gap-4 hover:border-highlight/50 transition-all shadow-xl group active:scale-95"
                    >
                        <div className="p-5 bg-highlight rounded-3xl shadow-lg group-hover:scale-110 transition-transform">
                            <UsersIcon className="w-10 h-10 text-white" />
                        </div>
                        <div className="text-center">
                            <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">Roster Lab</h3>
                            <p className="text-[10px] text-text-secondary font-bold uppercase tracking-widest mt-1 opacity-60">Gestão de Elenco Completa</p>
                        </div>
                    </button>
                </div>
            </div>
        );
    }

    return (
        <PlayerCareerMode 
            player={{ name: user?.name, rating: 88, level: 14, xp: 4120, avatarUrl: user?.avatarUrl, position: 'QB', jerseyNumber: '12', class: 'Veterano' }} 
            nextGame={{ opponent: 'Bulls', date: new Date() }} 
            xpLeaders={[]} 
        />
    );
};

export default Dashboard;