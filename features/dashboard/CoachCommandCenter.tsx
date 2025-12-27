
import React, { useMemo } from 'react';
// @ts-ignore
import { useNavigate } from 'react-router-dom';
import { 
    WhistleIcon, HeartPulseIcon, ActivityIcon, UsersIcon,
    ClockIcon, ChevronRightIcon
} from '../../components/icons/UiIcons';

interface CoachCommandCenterProps {
    program: string;
    nextGame: any;
}

const CoachCommandCenter: React.FC<CoachCommandCenterProps> = ({ program, nextGame }) => {
    const navigate = useNavigate();

    const stats = useMemo(() => ({
        healthRisk: 3,
        pendingReports: 2,
        unitEfficiency: '88%',
        rosterCount: 52
    }), []);

    const CommandCard = ({ title, subtitle, icon: Icon, color, onClick, badge }: any) => (
        <button 
            onClick={onClick}
            className="group relative bg-secondary/40 backdrop-blur-xl border border-white/5 rounded-[2rem] p-6 flex flex-col items-start text-left hover:border-highlight/50 transition-all shadow-xl overflow-hidden h-full active:scale-95"
        >
            <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                <Icon className="w-32 h-32 text-white" />
            </div>
            
            <div className={`p-3 rounded-xl ${color} mb-4 shadow-lg group-hover:scale-110 transition-transform`}>
                <Icon className="w-6 h-6 text-white" />
            </div>

            <div className="relative z-10 w-full">
                <h3 className="text-xl font-black text-white italic uppercase tracking-tighter">{title}</h3>
                <p className="text-text-secondary text-[10px] font-bold uppercase tracking-[0.2em] mt-1 opacity-60">{subtitle}</p>
            </div>

            {badge && (
                <div className="mt-auto pt-4 flex items-center gap-2 w-full">
                    <span className={`text-[9px] font-black uppercase px-2 py-1 rounded-lg ${badge.color}`}>
                        {badge.text}
                    </span>
                    <ChevronRightIcon className="w-3 h-3 text-white/20 ml-auto" />
                </div>
            )}
        </button>
    );

    return (
        <div className="space-y-6 animate-fade-in flex flex-col h-full">
            {/* Ticker de Missão */}
            <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-2xl p-4 flex items-center justify-between shadow-glow-small shrink-0">
                <div className="flex items-center gap-4">
                    <div className="w-2 h-2 rounded-full bg-highlight animate-pulse shrink-0"></div>
                    <div>
                        <span className="text-[9px] font-black text-highlight uppercase tracking-[0.3em] block">Status: Operacional</span>
                        <p className="text-white font-bold uppercase italic text-xs">
                            {nextGame ? `Prep: ${nextGame.opponent}` : 'Offseason Mode'}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2 bg-white/5 px-3 py-1 rounded-lg border border-white/5 font-mono text-highlight font-black text-xs">
                    <ClockIcon className="w-3 h-3" /> T-Minus 4D
                </div>
            </div>

            {/* Grid de Comando */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1 min-h-0">
                <CommandCard 
                    title="Training Intel"
                    subtitle="Relatórios & Feedback"
                    icon={WhistleIcon}
                    color="bg-blue-600"
                    onClick={() => navigate('/coach/training-intel')}
                    badge={{ text: `${stats.pendingReports} Pendentes`, color: 'bg-blue-500/20 text-blue-400' }}
                />
                <CommandCard 
                    title="Medical Lab"
                    subtitle="Wellness & Lesões"
                    icon={HeartPulseIcon}
                    color="bg-red-600"
                    onClick={() => navigate('/coach/medical-lab')}
                    badge={{ text: `${stats.healthRisk} Alertas`, color: 'bg-red-500/20 text-red-400' }}
                />
                <CommandCard 
                    title="Sideline Ops"
                    subtitle="Game Day & Stats"
                    icon={ActivityIcon}
                    color="bg-purple-600"
                    onClick={() => navigate('/coach/sideline-lab')}
                    badge={{ text: `Eff: ${stats.unitEfficiency}`, color: 'bg-purple-500/20 text-purple-400' }}
                />
                <CommandCard 
                    title="Roster Master"
                    subtitle="Gestão de Elenco"
                    icon={UsersIcon}
                    color="bg-highlight"
                    onClick={() => navigate('/roster')}
                    badge={{ text: `${stats.rosterCount} Ativos`, color: 'bg-highlight/20 text-highlight' }}
                />
            </div>
        </div>
    );
};

export default CoachCommandCenter;