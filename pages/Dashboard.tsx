
import React, { useContext, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext, UserContextType } from '@/components/Layout';
import { storageService } from '@/services/storageService';
import { 
    CalendarIcon, WhistleIcon, HeartPulseIcon, 
    ActivityIcon, UsersIcon, ChevronRightIcon,
    ClockIcon, MapPinIcon
} from '@/components/icons/UiIcons';
import ExecutiveDashboard from '@/features/dashboard/ExecutiveDashboard';
import PlayerCareerMode from '@/features/dashboard/PlayerCareerMode';

const Dashboard: React.FC = () => {
    const navigate = useNavigate();
    const { currentRole } = useContext(UserContext) as UserContextType;
    const user = storageService.getCurrentUser();

    const nextEvent = useMemo(() => ({
        title: 'Treino Tático: Redzone Mastery',
        time: '19:30',
        date: 'HOJE',
        location: 'CT Gladiators',
        type: 'PRACTICE'
    }), []);

    if (currentRole === 'MASTER' || currentRole === 'PLATFORM_OWNER') {
        return <ExecutiveDashboard handleCopyInvite={() => {}} />;
    }

    if (currentRole.includes('COACH') || currentRole.includes('COORD')) {
        return (
            <div className="h-full flex flex-col space-y-6 animate-fade-in pb-6">
                {/* 1. AGENDA BAR (TOP) */}
                <div className="bg-secondary/60 backdrop-blur-xl border border-white/10 rounded-[2rem] p-5 flex items-center justify-between shadow-2xl shrink-0">
                    <div className="flex items-center gap-6">
                        <div className="bg-highlight/20 p-3 rounded-2xl border border-highlight/30 flex items-center justify-center">
                            <CalendarIcon className="w-6 h-6 text-highlight" />
                        </div>
                        <div>
                            <div className="flex items-center gap-2">
                                <span className="bg-highlight text-white text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest animate-pulse">Próximo Snap</span>
                                <span className="text-[10px] font-black text-text-secondary uppercase tracking-[0.2em]">{nextEvent.date}</span>
                            </div>
                            <h3 className="text-white font-black uppercase italic text-lg tracking-tighter mt-1">
                                {nextEvent.title}
                            </h3>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-8">
                        <div className="hidden md:flex flex-col items-end">
                            <p className="text-[9px] font-black text-text-secondary uppercase tracking-widest">Localização</p>
                            <p className="text-white font-bold text-sm flex items-center gap-2"><MapPinIcon className="w-3 h-3 text-highlight"/> {nextEvent.location}</p>
                        </div>
                        <div className="h-10 w-px bg-white/10"></div>
                        <div className="flex flex-col items-end">
                            <p className="text-[9px] font-black text-text-secondary uppercase tracking-widest">Kickoff</p>
                            <p className="text-xl font-mono font-black text-highlight italic leading-none">{nextEvent.time}</p>
                        </div>
                        <button onClick={() => navigate('/agenda')} className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl transition-all">
                            <ChevronRightIcon className="w-5 h-5 text-text-secondary" />
                        </button>
                    </div>
                </div>

                {/* 2. THE 4 COACH LABS (MAIN GRID) */}
                <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 min-h-0">
                    {/* LAB 1: TRAINING INTEL */}
                    <button 
                        onClick={() => navigate('/coach/training-intel')}
                        className="bg-secondary/40 border border-white/5 rounded-[3.5rem] p-10 flex flex-col items-center justify-center gap-6 hover:border-blue-500/50 transition-all shadow-xl group active:scale-[0.98] relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                            <WhistleIcon className="w-48 h-48 text-white" />
                        </div>
                        <div className="p-8 bg-blue-600 rounded-[2.5rem] shadow-[0_0_40px_rgba(37,99,235,0.3)] group-hover:scale-110 transition-transform duration-500">
                            <WhistleIcon className="w-12 h-12 text-white" />
                        </div>
                        <div className="text-center z-10">
                            <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter">Training Intel</h3>
                            <p className="text-xs text-blue-300 font-bold uppercase tracking-[0.3em] mt-2 opacity-60">Análise do Último Treino</p>
                        </div>
                    </button>

                    {/* LAB 2: MEDICAL LAB */}
                    <button 
                        onClick={() => navigate('/coach/medical-lab')}
                        className="bg-secondary/40 border border-white/5 rounded-[3.5rem] p-10 flex flex-col items-center justify-center gap-6 hover:border-red-500/50 transition-all shadow-xl group active:scale-[0.98] relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                            <HeartPulseIcon className="w-48 h-48 text-white" />
                        </div>
                        <div className="p-8 bg-red-600 rounded-[2.5rem] shadow-[0_0_40px_rgba(220,38,38,0.3)] group-hover:scale-110 transition-transform duration-500">
                            <HeartPulseIcon className="w-12 h-12 text-white" />
                        </div>
                        <div className="text-center z-10">
                            <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter">Medical Lab</h3>
                            <p className="text-xs text-red-300 font-bold uppercase tracking-[0.3em] mt-2 opacity-60">Matriz de Saúde & Prontidão</p>
                        </div>
                    </button>

                    {/* LAB 3: SIDELINE LAB */}
                    <button 
                        onClick={() => navigate('/coach/sideline-lab')}
                        className="bg-secondary/40 border border-white/5 rounded-[3.5rem] p-10 flex flex-col items-center justify-center gap-6 hover:border-purple-500/50 transition-all shadow-xl group active:scale-[0.98] relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                            <ActivityIcon className="w-48 h-48 text-white" />
                        </div>
                        <div className="p-8 bg-purple-600 rounded-[2.5rem] shadow-[0_0_40px_rgba(147,51,234,0.3)] group-hover:scale-110 transition-transform duration-500">
                            <ActivityIcon className="w-12 h-12 text-white" />
                        </div>
                        <div className="text-center z-10">
                            <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter">Sideline Lab</h3>
                            <p className="text-xs text-purple-300 font-bold uppercase tracking-[0.3em] mt-2 opacity-60">Analytics & Combate IA</p>
                        </div>
                    </button>

                    {/* LAB 4: ROSTER LAB */}
                    <button 
                        onClick={() => navigate('/roster')}
                        className="bg-secondary/40 border border-white/5 rounded-[3.5rem] p-10 flex flex-col items-center justify-center gap-6 hover:border-highlight/50 transition-all shadow-xl group active:scale-[0.98] relative overflow-hidden"
                    >
                        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                            <UsersIcon className="w-48 h-48 text-white" />
                        </div>
                        <div className="p-8 bg-highlight rounded-[2.5rem] shadow-[0_0_40px_rgba(5,150,105,0.3)] group-hover:scale-110 transition-transform duration-500">
                            <UsersIcon className="w-12 h-12 text-white" />
                        </div>
                        <div className="text-center z-10">
                            <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter">Roster Lab</h3>
                            <p className="text-xs text-green-300 font-bold uppercase tracking-[0.3em] mt-2 opacity-60">Gestão de Elenco & Filtros</p>
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