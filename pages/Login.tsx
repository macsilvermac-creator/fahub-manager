import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { storageService } from '../services/storageService';
import { UserRole } from '../types';
import { ShieldCheckIcon, UsersIcon, LockIcon, SparklesIcon } from '../components/icons/UiIcons';
import { WhistleIcon } from '../components/icons/NavIcons';

const Login: React.FC = () => {
    const navigate = useNavigate();
    const [bgMode, setBgMode] = useState<'TACKLE' | 'FLAG'>('TACKLE');
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    // Estados do Gateway
    const [isCertified, setIsCertified] = useState(false);
    const [isScanning, setIsScanning] = useState(false);

    // Alterna o fundo a cada 5 segundos
    useEffect(() => {
        const interval = setInterval(() => {
            setBgMode(prev => prev === 'TACKLE' ? 'FLAG' : 'TACKLE');
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const handleLoginSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        
        // Simulação de Autenticação de Gestor
        // Aqui validamos se é você (o gestor)
        setTimeout(() => {
            setLoading(false);
            setIsScanning(true);
            
            // Simula o efeito de scanner de identidade
            setTimeout(() => {
                setIsScanning(false);
                setIsCertified(true);
            }, 1500);
        }, 800);
    };

    const handleInjectContext = (role: UserRole, name: string) => {
        setLoading(true);
        storageService.initializeRAM();
        
        const mockUser = {
            id: `dev-${role.toLowerCase()}`,
            email: email || 'admin@fahub.com',
            name: name,
            role: role,
            cpf: '000.000.000-00',
            status: 'APPROVED' as const,
            avatarUrl: `https://ui-avatars.com/api/?name=${name}&background=random`,
            isProfileComplete: true,
            program: bgMode
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
                <div className={`absolute inset-0 transition-opacity duration-2000 ease-in-out ${bgMode === 'TACKLE' ? 'opacity-30' : 'opacity-10'}`} 
                    style={{
                        backgroundImage: `linear-gradient(rgba(11, 17, 32, 0.8), rgba(11, 17, 32, 0.8)), url('https://images.unsplash.com/photo-1566577739112-5180d4bf9390?q=80&w=2000')`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                    }}>
                </div>
                <div className={`absolute inset-0 transition-opacity duration-2000 ease-in-out ${bgMode === 'FLAG' ? 'opacity-30' : 'opacity-10'}`} 
                    style={{
                        backgroundImage: `linear-gradient(rgba(11, 17, 32, 0.8), rgba(11, 17, 32, 0.8)), url('https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=2000')`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                    }}>
                </div>
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
            </div>

            {/* LADO DIREITO: GATEWAY INTERATIVO */}
            <div className="relative z-10 w-full md:w-1/2 flex items-center justify-center p-6 md:p-12">
                
                {/* ESTÁGIO 1: FORMULÁRIO DE LOGIN */}
                {!isCertified && !isScanning && (
                    <div className="w-full max-w-md glass-panel p-10 rounded-[3rem] border border-white/10 shadow-2xl animate-fade-in">
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold text-white mb-2">Acesso Restrito</h2>
                            <p className="text-text-secondary text-xs uppercase font-black tracking-widest">Identifique-se para gerenciar o ecossistema</p>
                        </div>

                        <form onSubmit={handleLoginSubmit} className="space-y-4">
                            <div>
                                <label className="text-[10px] font-black text-text-secondary uppercase mb-1 ml-1">Email Corporativo</label>
                                <input 
                                    type="email" 
                                    required
                                    className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-white focus:border-highlight outline-none transition-all"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    placeholder="gestor@fahub.com"
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-text-secondary uppercase mb-1 ml-1">Senha de Acesso</label>
                                <input 
                                    type="password" 
                                    required
                                    className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-white focus:border-highlight outline-none transition-all"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    placeholder="••••••••"
                                />
                            </div>
                            <button 
                                type="submit"
                                disabled={loading}
                                className="w-full bg-highlight hover:bg-highlight-hover text-white font-black py-4 rounded-2xl uppercase text-sm shadow-glow transform active:scale-95 transition-all flex items-center justify-center gap-2"
                            >
                                {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : 'Certificar Identidade'}
                            </button>
                        </form>
                    </div>
                )}

                {/* ESTÁGIO 2: SCANNER DE IDENTIDADE */}
                {isScanning && (
                    <div className="w-full max-w-md flex flex-col items-center justify-center animate-fade-in">
                        <div className="relative w-48 h-48 border-2 border-highlight/30 rounded-full flex items-center justify-center overflow-hidden">
                            <div className="absolute inset-0 bg-highlight/5 animate-pulse"></div>
                            <div className="absolute top-0 left-0 w-full h-1 bg-highlight shadow-[0_0_15px_rgba(5,150,107,1)] animate-scan"></div>
                            <ShieldCheckIcon className="w-20 h-20 text-highlight opacity-50" />
                        </div>
                        <p className="mt-8 text-highlight font-black uppercase tracking-[0.3em] text-xs animate-pulse">Validando Credenciais Master...</p>
                    </div>
                )}

                {/* ESTÁGIO 3: SELETOR DE PERSONA (O GATEWAY) */}
                {isCertified && (
                    <div className="w-full max-w-lg glass-panel p-8 md:p-10 rounded-[3rem] border border-white/10 shadow-2xl animate-slide-in">
                        <div className="mb-8 text-center">
                            <div className="inline-flex items-center gap-2 bg-highlight/20 border border-highlight/50 px-3 py-1 rounded-full text-[10px] font-black text-highlight mb-3 uppercase tracking-widest">
                                <SparklesIcon className="w-3 h-3" /> Identidade Confirmada
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-2">Portal do Gestor</h2>
                            <p className="text-text-secondary text-[10px] uppercase font-black tracking-widest">Selecione o contexto de teste para esta sessão</p>
                        </div>

                        <div className="space-y-3">
                            <button 
                                onClick={() => handleInjectContext('MASTER', 'Presidente Gladiators')}
                                className="w-full bg-white/5 hover:bg-highlight/20 hover:border-highlight transition-all border border-white/10 p-4 rounded-2xl flex items-center gap-4 group"
                            >
                                <div className="p-3 bg-highlight/10 rounded-xl text-highlight group-hover:bg-highlight group-hover:text-white transition-all">
                                    <ShieldCheckIcon className="w-5 h-5" />
                                </div>
                                <div className="text-left">
                                    <p className="text-white font-black uppercase text-xs italic">Visão Presidência</p>
                                    <p className="text-[9px] text-text-secondary uppercase opacity-60">Financeiro, Contratos e Auditoria</p>
                                </div>
                            </button>

                            <button 
                                onClick={() => handleInjectContext('HEAD_COACH', 'Coach Guto')}
                                className="w-full bg-white/5 hover:bg-blue-600/20 hover:border-blue-500 transition-all border border-white/10 p-4 rounded-2xl flex items-center gap-4 group"
                            >
                                <div className="p-3 bg-blue-600/10 rounded-xl text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
                                    <WhistleIcon className="w-5 h-5" />
                                </div>
                                <div className="text-left">
                                    <p className="text-white font-black uppercase text-xs italic">Visão Comissão Técnica</p>
                                    <p className="text-[9px] text-text-secondary uppercase opacity-60">Playbook, Treinos e Roster</p>
                                </div>
                            </button>

                            <button 
                                onClick={() => handleInjectContext('PLAYER', 'Lucas Thor')}
                                className="w-full bg-white/5 hover:bg-orange-600/20 hover:border-orange-500 transition-all border border-white/10 p-4 rounded-2xl flex items-center gap-4 group"
                            >
                                <div className="p-3 bg-orange-600/10 rounded-xl text-orange-400 group-hover:bg-orange-600 group-hover:text-white transition-all">
                                    <UsersIcon className="w-5 h-5" />
                                </div>
                                <div className="text-left">
                                    <p className="text-white font-black uppercase text-xs italic">Visão Atleta</p>
                                    <p className="text-[9px] text-text-secondary uppercase opacity-60">Minha Carreira, Saúde e Mensalidades</p>
                                </div>
                            </button>
                        </div>

                        <button 
                            onClick={() => setIsCertified(false)}
                            className="mt-6 w-full text-[9px] font-black text-text-secondary/40 uppercase hover:text-red-400 transition-colors tracking-widest"
                        >
                            Revogar Certificação
                        </button>
                    </div>
                )}
            </div>

            <style>{`
                @keyframes scan {
                    0% { top: 0; }
                    100% { top: 100%; }
                }
                .animate-scan {
                    position: absolute;
                    animation: scan 1.5s linear infinite;
                }
            `}</style>
        </div>
    );
};

export default Login;