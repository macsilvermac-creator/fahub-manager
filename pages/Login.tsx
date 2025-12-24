
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { storageService } from '../services/storageService';
import { UserRole } from '../types';
import { ShieldCheckIcon, UsersIcon, SparklesIcon, LockIcon } from '../components/icons/UiIcons';
import { WhistleIcon } from '../components/icons/NavIcons';

const Login: React.FC = () => {
    const navigate = useNavigate();
    const [bgMode, setBgMode] = useState<'TACKLE' | 'FLAG'>('TACKLE');
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    
    // Máquina de Estados: LOGIN -> SCANNING -> SELECTOR
    const [step, setStep] = useState<'LOGIN' | 'SCANNING' | 'SELECTOR'>('LOGIN');

    // Sempre que cair no login, limpamos a sessão anterior para garantir o fluxo do Portal
    useEffect(() => {
        localStorage.removeItem('gridiron_current_user');
        
        const interval = setInterval(() => {
            setBgMode(prev => prev === 'TACKLE' ? 'FLAG' : 'TACKLE');
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    const handleLoginSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        
        // Simulação de Validação Master
        setTimeout(() => {
            setLoading(false);
            setStep('SCANNING');
            
            // Duração da animação do scanner
            setTimeout(() => {
                setStep('SELECTOR');
            }, 2500);
        }, 800);
    };

    const handleInjectContext = (role: UserRole, name: string) => {
        setLoading(true);
        storageService.initializeRAM();
        
        const mockUser = {
            id: `gestor-${role.toLowerCase()}`,
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
            
            {/* BACKGROUND DINÂMICO */}
            <div className="absolute inset-0 z-0">
                <div className={`absolute inset-0 transition-opacity duration-2000 ease-in-out ${bgMode === 'TACKLE' ? 'opacity-30' : 'opacity-10'}`} 
                    style={{
                        backgroundImage: `linear-gradient(rgba(11, 17, 32, 0.8), rgba(11, 17, 32, 0.8)), url('https://images.unsplash.com/photo-1566577739112-5180d4bf9390?q=80&w=2000')`,
                        backgroundSize: 'cover', backgroundPosition: 'center'
                    }}>
                </div>
                <div className={`absolute inset-0 transition-opacity duration-2000 ease-in-out ${bgMode === 'FLAG' ? 'opacity-30' : 'opacity-10'}`} 
                    style={{
                        backgroundImage: `linear-gradient(rgba(11, 17, 32, 0.8), rgba(11, 17, 32, 0.8)), url('https://images.unsplash.com/photo-1508098682722-e99c43a406b2?q=80&w=2000')`,
                        backgroundSize: 'cover', backgroundPosition: 'center'
                    }}>
                </div>
            </div>

            {/* LADO ESQUERDO: BRANDING */}
            <div className="relative z-10 w-full md:w-1/2 flex flex-col items-center justify-center p-12 text-center">
                <div className="w-32 h-32 md:w-44 md:h-44 bg-highlight rounded-[2.5rem] flex items-center justify-center shadow-glow transform -rotate-6 transition-transform hover:rotate-0 duration-500 mb-8">
                    <span className="text-white font-black text-6xl italic tracking-tighter">FH</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-black text-white uppercase italic tracking-tighter leading-none mb-4">
                    FAHUB <span className="text-highlight">PRO</span>
                </h1>
                <p className="text-text-secondary text-[10px] font-black uppercase tracking-[0.4em] opacity-60">
                    SISTEMA DE GESTÃO DE ALTA PERFORMANCE
                </p>
            </div>

            {/* LADO DIREITO: GATEWAY INTERATIVO */}
            <div className="relative z-10 w-full md:w-1/2 flex items-center justify-center p-6 md:p-12">
                
                {step === 'LOGIN' && (
                    <div className="w-full max-w-md glass-panel p-10 rounded-[3rem] border border-white/10 shadow-2xl animate-fade-in">
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold text-white mb-2">Acesso Restrito</h2>
                            <p className="text-text-secondary text-[10px] uppercase font-black tracking-widest">Identifique-se para gerenciar o ecossistema</p>
                        </div>

                        <form onSubmit={handleLoginSubmit} className="space-y-4">
                            <input 
                                type="email" required
                                className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-white focus:border-highlight outline-none transition-all placeholder-white/20"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                placeholder="E-mail do Gestor"
                            />
                            <input 
                                type="password" required
                                className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-white focus:border-highlight outline-none transition-all placeholder-white/20"
                                value={password}
                                onChange={e => setPassword(e.target.value)}
                                placeholder="Senha"
                            />
                            <button 
                                type="submit"
                                disabled={loading}
                                className="w-full bg-highlight hover:bg-highlight-hover text-white font-black py-4 rounded-2xl uppercase text-sm shadow-glow transform active:scale-95 transition-all"
                            >
                                {loading ? 'Validando...' : 'Certificar Identidade'}
                            </button>
                        </form>
                    </div>
                )}

                {step === 'SCANNING' && (
                    <div className="flex flex-col items-center animate-fade-in">
                        <div className="relative w-56 h-56 border-2 border-highlight/20 rounded-full flex items-center justify-center">
                            <div className="absolute inset-2 border border-highlight/40 rounded-full animate-pulse"></div>
                            <div className="w-full h-1 bg-highlight absolute top-0 shadow-[0_0_20px_#059669] animate-scan-line"></div>
                            <ShieldCheckIcon className="w-20 h-20 text-highlight opacity-40" />
                        </div>
                        <p className="mt-8 text-highlight font-black uppercase tracking-[0.4em] text-[10px] animate-pulse">Verificando Credenciais de Comando...</p>
                    </div>
                )}

                {step === 'SELECTOR' && (
                    <div className="w-full max-w-lg glass-panel p-10 rounded-[3.5rem] border border-white/10 shadow-2xl animate-slide-in">
                        <div className="text-center mb-8">
                            <div className="inline-flex items-center gap-2 bg-highlight/10 px-4 py-1 rounded-full text-[10px] font-black text-highlight border border-highlight/20 mb-4 uppercase">
                                <SparklesIcon className="w-3 h-3" /> Acesso de Gestor Confirmado
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-2">Seletor de Identidade</h2>
                            <p className="text-text-secondary text-[10px] uppercase font-black tracking-widest">Escolha o contexto de operação</p>
                        </div>

                        <div className="grid gap-3">
                            <button 
                                onClick={() => handleInjectContext('MASTER', 'Presidente Gladiators')}
                                className="w-full bg-white/5 hover:bg-highlight/20 border border-white/10 hover:border-highlight p-5 rounded-2xl flex items-center gap-4 group transition-all"
                            >
                                <div className="p-3 bg-highlight/10 rounded-xl text-highlight group-hover:bg-highlight group-hover:text-white transition-all">
                                    <ShieldCheckIcon className="w-6 h-6" />
                                </div>
                                <div className="text-left">
                                    <p className="text-white font-black uppercase text-xs italic">Presidência / CEO</p>
                                    <p className="text-[9px] text-text-secondary uppercase opacity-60">Visão Geral, Finanças e Contratos</p>
                                </div>
                            </button>

                            <button 
                                onClick={() => handleInjectContext('HEAD_COACH', 'Coach Guto')}
                                className="w-full bg-white/5 hover:bg-blue-600/20 border border-white/10 hover:border-blue-500 p-5 rounded-2xl flex items-center gap-4 group transition-all"
                            >
                                <div className="p-3 bg-blue-600/10 rounded-xl text-blue-400 group-hover:bg-blue-600 group-hover:text-white transition-all">
                                    <WhistleIcon className="w-6 h-6" />
                                </div>
                                <div className="text-left">
                                    <p className="text-white font-black uppercase text-xs italic">Comissão Técnica</p>
                                    <p className="text-[9px] text-text-secondary uppercase opacity-60">Playbook, Treinos e Roster</p>
                                </div>
                            </button>

                            <button 
                                onClick={() => handleInjectContext('PLAYER', 'Lucas Thor')}
                                className="w-full bg-white/5 hover:bg-orange-600/20 border border-white/10 hover:border-orange-500 p-5 rounded-2xl flex items-center gap-4 group transition-all"
                            >
                                <div className="p-3 bg-orange-600/10 rounded-xl text-orange-400 group-hover:bg-orange-600 group-hover:text-white transition-all">
                                    <UsersIcon className="w-6 h-6" />
                                </div>
                                <div className="text-left">
                                    <p className="text-white font-black uppercase text-xs italic">Atleta / Jogador</p>
                                    <p className="text-[9px] text-text-secondary uppercase opacity-60">Minha Carreira, Pagamentos e Estudo</p>
                                </div>
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <style>{`
                @keyframes scanLineEffect {
                    0% { top: 0%; opacity: 0; }
                    50% { opacity: 1; }
                    100% { top: 100%; opacity: 0; }
                }
                .animate-scan-line {
                    animation: scanLineEffect 2s ease-in-out infinite;
                }
            `}</style>
        </div>
    );
};

export default Login;