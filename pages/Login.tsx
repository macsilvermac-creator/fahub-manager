import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { storageService } from '../services/storageService';
import { UserRole } from '../types';
import { ShieldCheckIcon, UsersIcon, LockIcon } from '../components/icons/UiIcons';
import { WhistleIcon } from '../components/icons/NavIcons';

const Login: React.FC = () => {
    const navigate = useNavigate();
    const [bgMode, setBgMode] = useState<'TACKLE' | 'FLAG'>('TACKLE');
    const [loading, setLoading] = useState(false);

    // Alterna o fundo a cada 5 segundos para representar as duas modalidades
    useEffect(() => {
        const interval = setInterval(() => {
            setBgMode(prev => prev === 'TACKLE' ? 'FLAG' : 'TACKLE');
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const handleQuickLogin = (role: UserRole, name: string) => {
        setLoading(true);
        storageService.initializeRAM();
        
        const mockUser = {
            id: `dev-${role.toLowerCase()}`,
            email: `${role.toLowerCase()}@fahub.com`,
            name: name,
            role: role,
            cpf: '000.000.000-00',
            status: 'APPROVED' as const,
            avatarUrl: `https://ui-avatars.com/api/?name=${name}&background=random`,
            isProfileComplete: true,
            program: bgMode // Define a modalidade baseada no fundo atual para o teste
        };
        
        localStorage.setItem('gridiron_current_user', JSON.stringify(mockUser));
        
        setTimeout(() => {
            navigate('/dashboard');
            window.location.reload();
        }, 800);
    };

    return (
        <div className="h-screen w-screen flex flex-col md:flex-row overflow-hidden bg-[#0B1120] relative">
            
            {/* BACKGROUND ANIMADO (CAMPOS) */}
            <div className="absolute inset-0 z-0">
                {/* Tackle Field Background */}
                <div className={`absolute inset-0 transition-opacity duration-2000 ease-in-out ${bgMode === 'TACKLE' ? 'opacity-30' : 'opacity-0'}`} 
                    style={{
                        backgroundImage: `linear-gradient(rgba(11, 17, 32, 0.8), rgba(11, 17, 32, 0.8)), url('https://images.unsplash.com/photo-1566577739112-5180d4bf9390?q=80&w=2000')`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                    }}>
                </div>
                {/* Flag Field Background */}
                <div className={`absolute inset-0 transition-opacity duration-2000 ease-in-out ${bgMode === 'FLAG' ? 'opacity-30' : 'opacity-0'}`} 
                    style={{
                        backgroundImage: `linear-gradient(rgba(11, 17, 32, 0.8), rgba(11, 17, 32, 0.8)), url('https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=2000')`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                    }}>
                </div>
                {/* Linhas de Campo (Overlay) */}
                <div className="absolute inset-0 opacity-10 pointer-events-none" style={{
                    backgroundImage: `repeating-linear-gradient(90deg, transparent, transparent 49px, rgba(255,255,255,0.5) 50px)`,
                    backgroundSize: '100px 100%'
                }}></div>
            </div>

            {/* LADO ESQUERDO: BRANDING */}
            <div className="relative z-10 w-full md:w-1/2 flex flex-col items-center justify-center p-12 text-center">
                <div className="w-32 h-32 md:w-48 md:h-48 bg-highlight rounded-[2.5rem] flex items-center justify-center shadow-[0_0_50px_rgba(5,150,107,0.3)] transform -rotate-6 transition-transform hover:rotate-0 duration-500 mb-8">
                    <span className="text-white font-black text-6xl md:text-8xl italic tracking-tighter">FH</span>
                </div>
                <h1 className="text-4xl md:text-6xl font-black text-white uppercase italic tracking-tighter leading-none mb-4">
                    FAHUB <span className="text-highlight">PRO</span>
                </h1>
                <p className="text-text-secondary text-sm md:text-lg font-bold uppercase tracking-[0.3em] max-w-md">
                    O ECOSSISTEMA DEFINITIVO DO FUTEBOL AMERICANO NO BRASIL
                </p>
                
                {/* Indicador de Modalidade Logada no Teste */}
                <div className="mt-12 flex gap-4">
                    <span className={`text-[10px] font-black px-4 py-1.5 rounded-full border transition-all ${bgMode === 'TACKLE' ? 'bg-highlight text-white border-highlight shadow-glow' : 'text-text-secondary border-white/10 opacity-30'}`}>EQUIPADO (TACKLE)</span>
                    <span className={`text-[10px] font-black px-4 py-1.5 rounded-full border transition-all ${bgMode === 'FLAG' ? 'bg-yellow-500 text-black border-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.3)]' : 'text-text-secondary border-white/10 opacity-30'}`}>ESTRATÉGICO (FLAG)</span>
                </div>
            </div>

            {/* LADO DIREITO: LOGIN CONTAINER */}
            <div className="relative z-10 w-full md:w-1/2 flex items-center justify-center p-6 md:p-12">
                <div className="w-full max-w-md glass-panel p-8 md:p-10 rounded-[3rem] border border-white/10 shadow-2xl animate-slide-in">
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-white mb-2">Acesso ao Sistema</h2>
                        <p className="text-text-secondary text-xs uppercase font-black tracking-widest">Selecione sua patente para iniciar</p>
                    </div>

                    <div className="space-y-4">
                        {/* BOTÃO MASTER */}
                        <button 
                            onClick={() => handleQuickLogin('MASTER', 'Presidente Gladiators')}
                            disabled={loading}
                            className="w-full bg-white/5 hover:bg-highlight/20 hover:border-highlight transition-all border border-white/10 p-5 rounded-2xl flex items-center gap-4 group active:scale-95"
                        >
                            <div className="p-3 bg-highlight/10 rounded-xl group-hover:bg-highlight group-hover:text-white text-highlight transition-all">
                                <ShieldCheckIcon className="w-6 h-6" />
                            </div>
                            <div className="text-left">
                                <p className="text-white font-black uppercase text-sm italic tracking-tight">Presidência / Master</p>
                                <p className="text-[10px] text-text-secondary uppercase font-bold opacity-60">War Room, Finanças e Governança</p>
                            </div>
                        </button>

                        {/* BOTÃO COACH */}
                        <button 
                            onClick={() => handleQuickLogin('HEAD_COACH', 'Coach Guto')}
                            disabled={loading}
                            className="w-full bg-white/5 hover:bg-blue-600/20 hover:border-blue-500 transition-all border border-white/10 p-5 rounded-2xl flex items-center gap-4 group active:scale-95"
                        >
                            <div className="p-3 bg-blue-600/10 rounded-xl group-hover:bg-blue-600 group-hover:text-white text-blue-400 transition-all">
                                <WhistleIcon className="w-6 h-6" />
                            </div>
                            <div className="text-left">
                                <p className="text-white font-black uppercase text-sm italic tracking-tight">Comissão Técnica</p>
                                <p className="text-[10px] text-text-secondary uppercase font-bold opacity-60">Playbook, Treinos e Roster</p>
                            </div>
                        </button>

                        {/* BOTÃO ATLETA */}
                        <button 
                            onClick={() => handleQuickLogin('PLAYER', 'Lucas Thor')}
                            disabled={loading}
                            className="w-full bg-white/5 hover:bg-orange-600/20 hover:border-orange-500 transition-all border border-white/10 p-5 rounded-2xl flex items-center gap-4 group active:scale-95"
                        >
                            <div className="p-3 bg-orange-600/10 rounded-xl group-hover:bg-orange-600 group-hover:text-white text-orange-400 transition-all">
                                <UsersIcon className="w-6 h-6" />
                            </div>
                            <div className="text-left">
                                <p className="text-white font-black uppercase text-sm italic tracking-tight">Atleta / Jogador</p>
                                <p className="text-[10px] text-text-secondary uppercase font-bold opacity-60">Minha Carreira, Mensalidades e Playbook</p>
                            </div>
                        </button>
                    </div>

                    <div className="mt-10 pt-6 border-t border-white/5 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                             <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse"></div>
                             <span className="text-[9px] font-black text-text-secondary uppercase tracking-widest">Enviando Sinal Seguro</span>
                        </div>
                        <span className="text-[9px] font-black text-white/20 uppercase tracking-[0.2em]">v3.2.0-PRO</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;