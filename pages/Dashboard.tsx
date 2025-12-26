
import React, { useContext, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext, UserContextType } from '../components/Layout';
import { storageService } from '../services/storageService';
import ExecutiveDashboard from '../features/dashboard/ExecutiveDashboard';
import PlayerCareerMode from '../features/dashboard/PlayerCareerMode';
import CoachHubButtons from '../features/dashboard/CoachHubButtons';
import { ShieldCheckIcon, HeartPulseIcon, ActivityIcon } from '../components/icons/UiIcons';

const Dashboard: React.FC = () => {
    const navigate = useNavigate();
    const { currentRole } = useContext(UserContext) as UserContextType;
    const user = storageService.getCurrentUser();
    const program = user?.program || 'TACKLE';

    // Mock data para a visualização rica
    const xpLeaders = useMemo(() => [
        { id: 1, name: 'Lucas Thor', xp: 4520, avatarUrl: 'https://ui-avatars.com/api/?name=Lucas+Thor&background=059669&color=fff' },
        { id: 2, name: 'Pedro Tank', xp: 3980, avatarUrl: 'https://ui-avatars.com/api/?name=Pedro+Tank&background=3b82f6&color=fff' },
        { id: 3, name: 'Guto Coach', xp: 3200, avatarUrl: 'https://ui-avatars.com/api/?name=Guto+Coach&background=9333ea&color=fff' }
    ], []);

    const nextGame = useMemo(() => ({
        opponent: 'Bulls',
        date: new Date(Date.now() + 86400000 * 3)
    }), []);

    // 1. VISÃO EXECUTIVA (MASTER / CEO)
    const isExecutive = ['MASTER', 'PLATFORM_OWNER', 'PRESIDENT', 'VICE_PRESIDENT', 'FINANCIAL_DIRECTOR', 'SPORTS_DIRECTOR'].includes(currentRole);
    if (isExecutive) {
        return (
            <div className="space-y-6">
                <ExecutiveDashboard handleCopyInvite={() => alert("Link de convite copiado!")} />
            </div>
        );
    }

    // 2. VISÃO TÉCNICA (COACH / COORDENADOR)
    const isTechnical = currentRole.includes('COACH') || currentRole.includes('COORD');
    if (isTechnical) {
        return (
            <div className="space-y-8 animate-fade-in">
                <div className="flex justify-between items-center px-4">
                    <div>
                        <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter">Command Center</h2>
                        <p className="text-highlight text-[10px] font-black uppercase tracking-[0.4em] mt-1 italic">Unidade Técnica Ativa ({program})</p>
                    </div>
                    <div className="bg-secondary/60 backdrop-blur-md px-6 py-3 rounded-3xl border border-white/5 flex items-center gap-4">
                         <div className="text-right">
                             <p className="text-[8px] text-text-secondary uppercase font-black tracking-widest">Roster Prontidão</p>
                             <p className="text-xl font-black text-white italic">92%</p>
                         </div>
                         <ActivityIcon className="w-8 h-8 text-highlight" />
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

    // 3. VISÃO ATLETA (PLAYER / STUDENT)
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
                    class: 'Veterano' 
                }} 
                nextGame={nextGame} 
                xpLeaders={xpLeaders} 
            />
        );
    }

    // 4. VISÃO SAÚDE (MEDICAL / TRAINER)
    if (currentRole === 'MEDICAL_STAFF' || currentRole === 'PHYSICAL_TRAINER') {
        return (
            <div className="space-y-6 animate-fade-in max-w-4xl mx-auto py-20">
                <div className="bg-gradient-to-br from-red-900/20 via-[#0B1120] to-black p-12 rounded-[3rem] border border-red-500/20 text-center shadow-2xl relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
                    <HeartPulseIcon className="w-24 h-24 text-red-500 mx-auto mb-8 animate-pulse" />
                    <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter">Health & Performance Lab</h2>
                    <p className="text-text-secondary mt-4 max-w-lg mx-auto font-medium">Acesse o Roster para monitorar o status de lesão e o boletim de prontidão física dos atletas.</p>
                    <button className="mt-10 bg-red-600 text-white font-black px-10 py-4 rounded-2xl uppercase italic text-xs shadow-glow-red" onClick={() => navigate('/roster')}>Abrir Ficha de Atletas</button>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col items-center justify-center opacity-30 text-center py-40">
            <ShieldCheckIcon className="w-20 h-20 mb-6" />
            <p className="font-black uppercase tracking-[0.4em] italic text-sm">Aguardando Definição de Protocolo: {currentRole}</p>
        </div>
    );
};

export default Dashboard;