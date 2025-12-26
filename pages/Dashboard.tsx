
import React, { useContext } from 'react';
import { UserContext, UserContextType } from '../components/Layout';
import { storageService } from '../services/storageService';
import ExecutiveDashboard from '../features/dashboard/ExecutiveDashboard';
import PlayerCareerMode from '../features/dashboard/PlayerCareerMode';
import CoachHubButtons from '../features/dashboard/CoachHubButtons';
import Card from '../components/Card';
import { ShieldCheckIcon, ActivityIcon, HeartPulseIcon } from '../components/icons/UiIcons';

const Dashboard: React.FC = () => {
    const { currentRole } = useContext(UserContext) as UserContextType;
    const user = storageService.getCurrentUser();
    const program = user?.program || 'TACKLE';

    // 1. VISÃO EXECUTIVA (Presidente, Diretores, Master)
    if (['MASTER', 'PRESIDENT', 'VICE_PRESIDENT', 'FINANCIAL_DIRECTOR', 'COMMERCIAL_DIRECTOR', 'MARKETING_DIRECTOR', 'SPORTS_DIRECTOR'].includes(currentRole)) {
        return (
            <div className="space-y-6 animate-fade-in">
                <ExecutiveDashboard handleCopyInvite={() => {}} />
            </div>
        );
    }

    // 2. VISÃO TÉCNICA (Coaches)
    if (currentRole.includes('COACH') || currentRole.includes('COORD')) {
        return (
            <div className="space-y-6 animate-fade-in">
                <div className="flex justify-between items-center px-2">
                    <div>
                        <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter">Command Center</h2>
                        <p className="text-highlight text-xs font-bold uppercase tracking-widest mt-1">Status: Campo Pronto ({program})</p>
                    </div>
                </div>
                <CoachHubButtons 
                    setActiveHub={() => {}} 
                    setActiveModule={() => {}} 
                    nextGame={{ opponent: 'Bulls' }} 
                    program={program} 
                />
            </div>
        );
    }

    // 3. VISÃO ATLETA (Career Mode)
    if (currentRole === 'PLAYER' || currentRole === 'STUDENT') {
        return (
            <PlayerCareerMode 
                player={{ name: user?.name, rating: 85, level: 12, xp: 450, avatarUrl: user?.avatarUrl, position: 'QB', class: 'Veterano' }} 
                nextGame={{ opponent: 'Royals', date: new Date() }} 
                xpLeaders={[]} 
            />
        );
    }

    // 4. VISÃO SAÚDE (Médicos / Prep Físico)
    if (currentRole === 'MEDICAL_STAFF' || currentRole === 'PHYSICAL_TRAINER') {
        return (
            <div className="space-y-6 animate-fade-in max-w-4xl mx-auto py-10">
                <div className="bg-gradient-to-br from-pink-900/20 to-black p-10 rounded-[3rem] border border-pink-500/20 text-center">
                    <HeartPulseIcon className="w-16 h-16 text-pink-500 mx-auto mb-6" />
                    <h2 className="text-3xl font-black text-white italic uppercase">Performance & Recovery Hub</h2>
                    <p className="text-text-secondary mt-4">Acesse o menu lateral em "Performance Lab" para monitorar a prontidão do elenco e prontuários médicos.</p>
                </div>
            </div>
        );
    }

    // FALLBACK
    return (
        <div className="h-full flex flex-col items-center justify-center opacity-30 text-center">
            <ShieldCheckIcon className="w-16 h-16 mb-4" />
            <p className="font-black uppercase tracking-widest">Dashboard em Construção para: {currentRole}</p>
        </div>
    );
};

export default Dashboard;