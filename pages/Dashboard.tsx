
import React, { useContext } from 'react';
import { UserContext, UserContextType } from '../components/Layout';
import { storageService } from '../services/storageService';
import ExecutiveDashboard from '../features/dashboard/ExecutiveDashboard';
import PlayerCareerMode from '../features/dashboard/PlayerCareerMode';
import CoachHubButtons from '../features/dashboard/CoachHubButtons';
import { ShieldCheckIcon, HeartPulseIcon } from '../components/icons/UiIcons';

const Dashboard: React.FC = () => {
    const { currentRole } = useContext(UserContext) as UserContextType;
    const user = storageService.getCurrentUser();
    const program = user?.program || 'TACKLE';

    // 1. VISÃO EXECUTIVA
    const isExecutive = ['MASTER', 'PLATFORM_OWNER', 'PRESIDENT', 'VICE_PRESIDENT', 'FINANCIAL_DIRECTOR', 'COMMERCIAL_DIRECTOR', 'MARKETING_DIRECTOR', 'SPORTS_DIRECTOR'].includes(currentRole);
    if (isExecutive) {
        return (
            <div className="space-y-6 animate-fade-in">
                <ExecutiveDashboard handleCopyInvite={() => {}} />
            </div>
        );
    }

    // 2. VISÃO TÉCNICA
    const isTechnical = currentRole.includes('COACH') || currentRole.includes('COORD');
    if (isTechnical) {
        return (
            <div className="space-y-6 animate-fade-in">
                <div className="flex justify-between items-center px-2">
                    <div>
                        <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter">Command Center</h2>
                        <p className="text-highlight text-xs font-bold uppercase tracking-widest mt-1">Status: Unidade Pronta ({program})</p>
                    </div>
                </div>
                <CoachHubButtons 
                    setActiveHub={() => {}} 
                    setActiveModule={() => {}} 
                    nextGame={{ opponent: 'Rex' }} 
                    program={program} 
                />
            </div>
        );
    }

    // 3. VISÃO ATLETA
    if (currentRole === 'PLAYER' || currentRole === 'STUDENT') {
        return (
            <PlayerCareerMode 
                player={{ name: user?.name, rating: 85, level: 12, xp: 450, avatarUrl: user?.avatarUrl, position: 'QB', class: 'Veterano' }} 
                nextGame={{ opponent: 'Bulls', date: new Date() }} 
                xpLeaders={[]} 
            />
        );
    }

    // 4. VISÃO SAÚDE
    if (currentRole === 'MEDICAL_STAFF' || currentRole === 'PHYSICAL_TRAINER') {
        return (
            <div className="space-y-6 animate-fade-in max-w-4xl mx-auto py-10">
                <div className="bg-gradient-to-br from-red-900/20 to-black p-10 rounded-[3rem] border border-red-500/20 text-center">
                    <HeartPulseIcon className="w-16 h-16 text-red-500 mx-auto mb-6" />
                    <h2 className="text-3xl font-black text-white italic uppercase">Health & Performance Lab</h2>
                    <p className="text-text-secondary mt-4">Acesse o menu lateral para monitorar o elenco.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col items-center justify-center opacity-30 text-center">
            <ShieldCheckIcon className="w-16 h-16 mb-4" />
            <p className="font-black uppercase tracking-widest">Aguardando definição de Dashboard para: {currentRole}</p>
        </div>
    );
};

export default Dashboard;