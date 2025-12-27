
import React, { useContext, useMemo } from 'react';
// @ts-ignore
import { useNavigate } from 'react-router-dom';
import { UserContext, UserContextType } from '@/components/Layout';
import { storageService } from '@/services/storageService';
import ExecutiveDashboard from '@/features/dashboard/ExecutiveDashboard';
import PlayerCareerMode from '@/features/dashboard/PlayerCareerMode';
import CoachHubButtons from '@/features/dashboard/CoachHubButtons';
import { ShieldCheckIcon, CalendarIcon, ClockIcon } from '@/components/icons/UiIcons';

const Dashboard: React.FC = () => {
    const navigate = useNavigate();
    const { currentRole } = useContext(UserContext) as UserContextType;
    const user = storageService.getCurrentUser();
    const program = user?.program || 'TACKLE';

    const nextGame = useMemo(() => ({
        opponent: 'Bulls',
        date: new Date(Date.now() + 86400000 * 3),
        type: 'GAME'
    }), []);

    const isExecutive = ['MASTER', 'PLATFORM_OWNER', 'PRESIDENT', 'VICE_PRESIDENT', 'FINANCIAL_DIRECTOR', 'SPORTS_DIRECTOR'].includes(currentRole);
    if (isExecutive) {
        return <ExecutiveDashboard handleCopyInvite={() => alert("Link de convite copiado!")} />;
    }

    const isTechnical = currentRole.includes('COACH') || currentRole.includes('COORD');
    if (isTechnical) {
        return (
            <div className="space-y-6 animate-fade-in h-full flex flex-col">
                {/* BARRA DE AGENDA DE TOPO */}
                <div className="bg-secondary/60 backdrop-blur-xl border border-white/10 rounded-2xl p-4 flex items-center justify-between shadow-2xl shrink-0">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-highlight/20 rounded-xl border border-highlight/30">
                            <CalendarIcon className="w-6 h-6 text-highlight" />
                        </div>
                        <div>
                            <span className="text-[10px] font-black text-highlight uppercase tracking-[0.3em]">Próximo Compromisso</span>
                            <h3 className="text-white font-bold uppercase italic text-sm">
                                {nextGame.type === 'GAME' ? 'JOGO VS ' : 'TREINO: '} {nextGame.opponent}
                            </h3>
                        </div>
                    </div>
                    <div className="flex items-center gap-6">
                        <div className="text-right">
                            <p className="text-[10px] text-text-secondary uppercase font-bold">Data/Hora</p>
                            <p className="text-sm font-black text-white italic">{nextGame.date.toLocaleDateString()} - 14:00</p>
                        </div>
                        <button onClick={() => navigate('/agenda')} className="p-2 bg-white/5 hover:bg-white/10 rounded-lg transition-colors">
                            <ShieldCheckIcon className="w-5 h-5 text-text-secondary" />
                        </button>
                    </div>
                </div>

                {/* GRID DE 4 CONTAINERS IGUAIS */}
                <div className="flex-1 min-h-0">
                    <CoachHubButtons 
                        setActiveHub={() => {}} 
                        setActiveModule={() => {}} 
                        nextGame={nextGame} 
                        program={program} 
                    />
                </div>
            </div>
        );
    }

    // Default Player View
    return (
        <PlayerCareerMode 
            player={{ name: user?.name, rating: 88, level: 14, xp: 4120, avatarUrl: user?.avatarUrl, position: 'QB', jerseyNumber: '12', class: 'Veterano' }} 
            nextGame={nextGame} 
            xpLeaders={[]} 
        />
    );
};

export default Dashboard;