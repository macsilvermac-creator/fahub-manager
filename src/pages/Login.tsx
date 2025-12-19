
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { storageService } from '../services/storageService';
import { UserRole } from '../types';
// Fix: WhistleIcon will now be exported from UiIcons
import { LockIcon, UsersIcon, WhistleIcon, ShieldCheckIcon } from '../components/icons/UiIcons';

const Login: React.FC = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleQuickLogin = (role: UserRole, name: string) => {
        setLoading(true);
        // Fix: Added missing properties status and cpf to comply with User type
        const mockUser = {
            id: `dev-${role.toLowerCase()}`,
            email: `${role.toLowerCase()}@fahub.com`,
            name: name,
            role: role,
            cpf: '000.000.000-00',
            status: 'APPROVED' as const,
            avatarUrl: `https://ui-avatars.com/api/?name=${name}`,
            isProfileComplete: true
        };
        storageService.setCurrentUser(mockUser);
        
        // Criação de dados base se não existirem para o teste
        if (role === 'PLAYER' && !storageService.getAthleteByUserId(mockUser.id)) {
            storageService.saveAthlete({
                id: 'ath-1',
                userId: mockUser.id,
                name: name,
                position: 'QB',
                jerseyNumber: 12,
                category: 'TACKLE',
                stats: { ovr: 88, speed: 90, strength: 75, agility: 82, tacticalIQ: 95 },
                attendanceRate: 98,
                xp: 1250,
                level: 5,
                status: 'ACTIVE'
            });
        }

        setTimeout(() => {
            if (role === 'PLAYER') navigate('/athlete');
            // Fix: Replaced invalid 'COACH' with valid 'HEAD_COACH' and coordinators
            else if (role === 'HEAD_COACH' || role === 'OFFENSIVE_COORD' || role === 'DEFENSIVE_COORD') navigate('/coach');
            else navigate('/team');
        }, 500);
    };

    return (
        <div className="min-h-screen bg-[#0B1120] flex items-center justify-center p-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20 pointer-events-none"></div>
            
            <div className="w-full max-w-md bg-secondary p-8 rounded-[2.5rem] border border-white/10 shadow-2xl relative z-10">
                <div className="text-center mb-10">
                    <div className="w-20 h-20 bg-highlight rounded-3xl mx-auto flex items-center justify-center shadow-glow mb-6 transform -rotate-6">
                        <span className="text-white font-black text-3xl italic tracking-tighter">FH</span>
                    </div>
                    <h1 className="text-3xl font-black text-white uppercase italic tracking-tighter">FAHUB MANAGER</h1>
                    <p className="text-text-secondary text-xs font-bold uppercase tracking-widest mt-2">Selecione sua Persona Base</p>
                </div>

                <div className="space-y-4">
                    <button 
                        onClick={() => handleQuickLogin('MASTER', 'Presidente')}
                        className="w-full bg-white/5 hover:bg-highlight transition-all border border-white/10 p-5 rounded-2xl flex items-center gap-4 group"
                    >
                        <ShieldCheckIcon className="w-8 h-8 text-highlight group-hover:text-white" />
                        <div className="text-left">
                            <p className="text-white font-black uppercase text-sm italic">Master / Equipe</p>
                            <p className="text-[10px] text-text-secondary group-hover:text-white/80 uppercase">Fundação e Gestão de Roster</p>
                        </div>
                    </button>

                    <button 
                        onClick={() => handleQuickLogin('HEAD_COACH', 'Coach Principal')}
                        className="w-full bg-white/5 hover:bg-blue-600 transition-all border border-white/10 p-5 rounded-2xl flex items-center gap-4 group"
                    >
                        <WhistleIcon className="w-8 h-8 text-blue-400 group-hover:text-white" />
                        <div className="text-left">
                            <p className="text-white font-black uppercase text-sm italic">Coach / Treinador</p>
                            <p className="text-[10px] text-text-secondary group-hover:text-white/80 uppercase">Planejamento e Frequência</p>
                        </div>
                    </button>

                    <button 
                        onClick={() => handleQuickLogin('PLAYER', 'Atleta Estrela')}
                        className="w-full bg-white/5 hover:bg-orange-600 transition-all border border-white/10 p-5 rounded-2xl flex items-center gap-4 group"
                    >
                        <UsersIcon className="w-8 h-8 text-orange-400 group-hover:text-white" />
                        <div className="text-left">
                            <p className="text-white font-black uppercase text-sm italic">Atleta / Aluno</p>
                            <p className="text-[10px] text-text-secondary group-hover:text-white/80 uppercase">Performance e Gamificação</p>
                        </div>
                    </button>
                </div>

                <div className="mt-10 pt-6 border-t border-white/5 text-center">
                    <p className="text-[9px] font-black text-text-secondary/40 uppercase tracking-[0.3em]">Ambiente de Teste em Tempo Real</p>
                </div>
            </div>
        </div>
    );
};

export default Login;
