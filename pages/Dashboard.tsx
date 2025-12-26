import React, { useContext, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext, UserContextType } from '@/components/Layout';
import { storageService } from '@/services/storageService';
import ExecutiveDashboard from '@/features/dashboard/ExecutiveDashboard';
import PlayerCareerMode from '@/features/dashboard/PlayerCareerMode';
import CoachHubButtons from '@/features/dashboard/CoachHubButtons';
import { ShieldCheckIcon } from '@/components/icons/UiIcons';

const Dashboard: React.FC = () => {
    const navigate = useNavigate();
    const { currentRole } = useContext(UserContext) as UserContextType;
    const user = storageService.getCurrentUser();
    const program = user?.program || 'TACKLE';

    const nextGame = useMemo(() => ({
        opponent: 'Bulls',
        date: new Date(Date.now() + 86400000 * 3)
    }), []);

    const xpLeaders = [
        { id: 1, name: 'Lucas Thor', xp: 4520, avatarUrl: 'https://ui-avatars.com/api/?name=Lucas+Thor&background=059669&color=fff' },
        { id: 2, name: 'Guto Coach', xp: 3980, avatarUrl: 'https://ui-avatars.com/api/?name=Guto+Coach&background=3b82f6&color=fff' }
    ];

    const isExecutive = ['MASTER', 'PLATFORM_OWNER', 'PRESIDENT', 'VICE_PRESIDENT', 'FINANCIAL_DIRECTOR', 'SPORTS_DIRECTOR'].includes(currentRole);
    if (isExecutive) {
        return <ExecutiveDashboard handleCopyInvite={() => alert("Link de convite copiado!")} />;
    }

    const isTechnical = currentRole.includes('COACH') || currentRole.includes('COORD');
    if (isTechnical) {
        return (
            <div className="space-y-8 animate-fade-in">
                <div className="flex justify-between items-center px-4">
                    <div>
                        <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter">War Room</h2>
                        <p className="text-highlight text-[10px] font-black uppercase tracking-[0.4em] mt-1 italic">Unidade Técnica ({program})</p>
                    </div>
                </div>
                <CoachHubButtons 
                    setActiveHub={() => {}} 
                    setActiveModule={() => {}} 
                    nextGame={nextGame} 
                    program={program} 
                />
            </div>
        );
    }

    if (currentRole === 'PLAYER' || currentRole === 'STUDENT') {
        return (
            <PlayerCareerMode 
                player={{ 
                    name: user?.name, 
                    rating: 88, 
                    level: 14, 
                    xp: 4120, 
                    avatarUrl: user?.avatarUrl, 
                    position: 'QB', 
                    jerseyNumber: '12',
                    class: 'Veterano' 
                }} 
                nextGame={nextGame} 
                xpLeaders={xpLeaders} 
            />
        );
    }

    return (
        <div className="h-full flex flex-col items-center justify-center opacity-30 text-center py-40">
            <ShieldCheckIcon className="w-20 h-20 mb-6" />
            <p className="font-black uppercase tracking-[0.4em] italic text-sm">Perfil em Análise: {currentRole}</p>
        </div>
    );
};

export default Dashboard;