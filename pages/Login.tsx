
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { storageService } from '../services/storageService';
import { UserRole } from '../types';
import { 
    ShieldCheckIcon, UsersIcon, 
    WhistleIcon, FinanceIcon, MegaphoneIcon, 
    TrophyIcon, ActivityIcon, BriefcaseIcon, 
    HeartPulseIcon, TargetIcon
} from '../components/icons/UiIcons';

const Login: React.FC = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState<'LOGIN' | 'SELECTOR'>('LOGIN');
    const [program, setProgram] = useState<'TACKLE' | 'FLAG'>('TACKLE');

    const PERSONA_GROUPS = [
        {
            title: "Diretoria Executiva",
            color: "text-red-500",
            options: [
                { role: 'MASTER', label: 'Admin Master', icon: ShieldCheckIcon },
                { role: 'PRESIDENT', label: 'Presidente', icon: TrophyIcon },
                { role: 'FINANCIAL_DIRECTOR', label: 'Dir. Financeiro', icon: FinanceIcon },
                { role: 'COMMERCIAL_DIRECTOR', label: 'Dir. Comercial', icon: BriefcaseIcon },
                { role: 'MARKETING_DIRECTOR', label: 'Dir. Marketing', icon: MegaphoneIcon }
            ]
        },
        {
            title: "Comissão Técnica",
            color: "text-blue-400",
            options: [
                { role: 'HEAD_COACH', label: 'Head Coach', icon: WhistleIcon },
                { role: 'OFFENSIVE_COORD', label: 'Coord. Ofensivo', icon: ActivityIcon },
                { role: 'DEFENSIVE_COORD', label: 'Coord. Defensivo', icon: ShieldCheckIcon },
                { role: 'PHYSICAL_TRAINER', label: 'Prep. Físico', icon: TargetIcon }
            ]
        },
        {
            title: "Operação e Atletas",
            color: "text-green-400",
            options: [
                { role: 'PLAYER', label: 'Atleta Ativo', icon: UsersIcon },
                { role: 'MEDICAL_STAFF', label: 'Dpto Médico', icon: HeartPulseIcon },
                { role: 'EQUIPMENT_MANAGER', label: 'Almoxarifado', icon: TargetIcon }
            ]
        }
    ];

    const handleInjectContext = (role: UserRole, name: string) => {
        storageService.initializeRAM();
        const mockUser = {
            id: `id-${role.toLowerCase()}`,
            email: `${role.toLowerCase()}@fahub.pro`,
            name: name,
            role: role,
            cpf: '000.000.000-00',
            status: 'APPROVED' as const,
            avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff`,
            program: program
        };
        localStorage.setItem('gridiron_current_user', JSON.stringify(mockUser));
        navigate('/dashboard');
        window.location.reload();
    };

    return (
        <div className="h-screen w-screen flex flex-col md:flex-row overflow-hidden bg-[#0B1120]">
            {/* Branding Panel */}
            <div className={`relative w-full ${step === 'SELECTOR' ? 'md:w-1/4' : 'md:w-1/2'} flex flex-col items-center justify-center p-12 transition-all duration-700 bg-black/40`}>
                <div className={`w-24 h-24 rounded-3xl flex items-center justify-center shadow-glow transform -rotate-6 mb-6 ${program === 'FLAG' ? 'bg-yellow-600' : 'bg-highlight'}`}>
                    <span className="text-white font-black text-4xl italic">FH</span>
                </div>
                <h1 className="text-3xl font-black text-white uppercase italic tracking-tighter">FAHUB PRO</h1>
                
                <div className="mt-8 flex bg-white/5 p-1 rounded-xl border border-white/10">
                    <button onClick={() => setProgram('TACKLE')} className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all ${program === 'TACKLE' ? 'bg-highlight text-white' : 'text-text-secondary'}`}>TACKLE</button>
                    <button onClick={() => setProgram('FLAG')} className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all ${program === 'FLAG' ? 'bg-yellow-600 text-white' : 'text-text-secondary'}`}>FLAG</button>
                </div>
            </div>

            {/* Interaction Panel */}
            <div className={`w-full ${step === 'SELECTOR' ? 'md:w-3/4' : 'md:w-1/2'} flex items-center justify-center p-6 transition-all duration-700`}>
                {step === 'LOGIN' && (
                    <div className="w-full max-w-sm glass-panel p-8 rounded-[2.5rem] animate-fade-in">
                        <h2 className="text-xl font-bold text-white mb-6 italic">Acesso Restrito</h2>
                        <div className="space-y-4">
                            <input className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-highlight" placeholder="Login Institucional" />
                            <input type="password" className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-white outline-none focus:border-highlight" placeholder="••••••••" />
                            <button onClick={() => setStep('SELECTOR')} className="w-full bg-highlight text-white font-black py-4 rounded-2xl uppercase text-xs shadow-glow">Entrar no Ecossistema</button>
                        </div>
                    </div>
                )}

                {step === 'SELECTOR' && (
                    <div className="w-full h-full max-h-[85vh] glass-panel p-10 rounded-[3.5rem] animate-slide-in overflow-hidden flex flex-col">
                        <div className="mb-8 shrink-0">
                            <h2 className="text-2xl font-black text-white uppercase italic tracking-tighter">Matriz de Identidades</h2>
                            <p className="text-text-secondary text-[10px] font-bold uppercase tracking-widest mt-1">Ambiente de Análise e Homologação</p>
                        </div>
                        
                        <div className="flex-1 overflow-y-auto custom-scrollbar pr-4 space-y-10">
                            {PERSONA_GROUPS.map((group, gIdx) => (
                                <div key={gIdx}>
                                    <h3 className={`text-[10px] font-black uppercase tracking-[0.3em] mb-4 ${group.color}`}>{group.title}</h3>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                        {group.options.map((opt, oIdx) => (
                                            <button key={oIdx} onClick={() => handleInjectContext(opt.role as any, opt.label)} className="bg-white/5 hover:bg-white/10 border border-white/5 p-4 rounded-2xl flex items-center gap-4 group transition-all text-left">
                                                <div className="p-2 bg-black/40 rounded-xl group-hover:bg-highlight/20 group-hover:text-highlight transition-all">
                                                    <opt.icon className="w-5 h-5" />
                                                </div>
                                                <span className="text-white font-black uppercase text-[10px] italic">{opt.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Login;
