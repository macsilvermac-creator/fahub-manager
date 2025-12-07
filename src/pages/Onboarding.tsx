
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import { storageService } from '../services/storageService';
import { TeamSettings } from '../types';
import { CheckCircleIcon, SparklesIcon } from '../components/icons/UiIcons';
import { UserContext } from '../components/Layout';

const Onboarding: React.FC = () => {
    const navigate = useNavigate();
    const { currentRole } = useContext(UserContext);
    const [step, setStep] = useState(1);
    
    // Form State
    const [teamName, setTeamName] = useState('');
    const [primaryColor, setPrimaryColor] = useState('#00A86B');
    const [secondaryColor, setSecondaryColor] = useState('#EAB308');
    const [sportType, setSportType] = useState<'FULLPADS' | 'FLAG'>('FULLPADS');
    const [isSaving, setIsSaving] = useState(false);

    const handleFinish = () => {
        setIsSaving(true);
        
        // 1. Update Settings
        const currentSettings = storageService.getTeamSettings();
        const newSettings: TeamSettings = {
            ...currentSettings,
            teamName: teamName || currentSettings.teamName,
            primaryColor,
            secondaryColor,
            sportType,
            logoUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(teamName || 'FA')}&background=${primaryColor.replace('#', '')}&color=fff&size=200`
        };
        storageService.saveTeamSettings(newSettings);

        // 2. Create Initial Championship (Mock logic)
        storageService.createChampionship(
            `Campeonato ${new Date().getFullYear()}`, 
            new Date().getFullYear(), 
            sportType === 'FULLPADS' ? 'D1' : 'FLAG'
        );

        setTimeout(() => {
            setIsSaving(false);
            navigate('/dashboard');
            window.location.reload(); // Force theme refresh
        }, 1500);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-primary p-4">
            <div className="max-w-2xl w-full">
                <div className="text-center mb-8">
                    <div className="w-16 h-16 bg-highlight rounded-2xl mx-auto flex items-center justify-center shadow-glow mb-4 transform -skew-x-6">
                        <span className="text-white font-black text-3xl transform skew-x-6">FH</span>
                    </div>
                    <h1 className="text-3xl font-black text-white uppercase tracking-tight">Bem-vindo ao FAHUB Manager</h1>
                    <p className="text-text-secondary mt-2">Vamos configurar o QG da sua equipe em poucos segundos.</p>
                </div>

                <Card className="border-t-4 border-t-highlight">
                    {/* Progress Bar */}
                    <div className="flex gap-2 mb-8">
                        <div className={`h-1 flex-1 rounded-full ${step >= 1 ? 'bg-highlight' : 'bg-white/10'}`}></div>
                        <div className={`h-1 flex-1 rounded-full ${step >= 2 ? 'bg-highlight' : 'bg-white/10'}`}></div>
                        <div className={`h-1 flex-1 rounded-full ${step >= 3 ? 'bg-highlight' : 'bg-white/10'}`}></div>
                    </div>

                    {step === 1 && (
                        <div className="space-y-6 animate-fade-in">
                            <h3 className="text-xl font-bold text-white">1. Identidade da Equipe</h3>
                            <div>
                                <label className="text-xs font-bold text-text-secondary uppercase mb-1 block">Nome do Time</label>
                                <input 
                                    className="w-full bg-black/20 border border-white/10 rounded-xl p-4 text-white text-lg focus:border-highlight focus:outline-none"
                                    placeholder="Ex: São Paulo Storm"
                                    value={teamName}
                                    onChange={e => setTeamName(e.target.value)}
                                    autoFocus
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-bold text-text-secondary uppercase mb-1 block">Cor Primária</label>
                                    <div className="flex gap-2 items-center bg-black/20 p-2 rounded-lg border border-white/10">
                                        <input type="color" value={primaryColor} onChange={e => setPrimaryColor(e.target.value)} className="w-8 h-8 rounded bg-transparent cursor-pointer" />
                                        <span className="text-white font-mono text-sm">{primaryColor}</span>
                                    </div>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-text-secondary uppercase mb-1 block">Cor Secundária</label>
                                    <div className="flex gap-2 items-center bg-black/20 p-2 rounded-lg border border-white/10">
                                        <input type="color" value={secondaryColor} onChange={e => setSecondaryColor(e.target.value)} className="w-8 h-8 rounded bg-transparent cursor-pointer" />
                                        <span className="text-white font-mono text-sm">{secondaryColor}</span>
                                    </div>
                                </div>
                            </div>
                            <button onClick={() => setStep(2)} disabled={!teamName} className="w-full bg-highlight hover:bg-highlight-hover text-white font-bold py-3 rounded-xl disabled:opacity-50 disabled:cursor-not-allowed">
                                Próximo: Modalidade →
                            </button>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-6 animate-fade-in">
                            <h3 className="text-xl font-bold text-white">2. Modalidade Principal</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <button 
                                    onClick={() => setSportType('FULLPADS')}
                                    className={`p-6 rounded-xl border-2 flex flex-col items-center gap-3 transition-all ${sportType === 'FULLPADS' ? 'border-highlight bg-highlight/10' : 'border-white/10 hover:border-white/30'}`}
                                >
                                    <span className="text-4xl">🏈</span>
                                    <span className="font-bold text-white">Futebol Americano</span>
                                    <span className="text-xs text-text-secondary">Full Pads (11v11)</span>
                                </button>
                                <button 
                                    onClick={() => setSportType('FLAG')}
                                    className={`p-6 rounded-xl border-2 flex flex-col items-center gap-3 transition-all ${sportType === 'FLAG' ? 'border-yellow-500 bg-yellow-500/10' : 'border-white/10 hover:border-white/30'}`}
                                >
                                    <span className="text-4xl">🚩</span>
                                    <span className="font-bold text-white">Flag Football</span>
                                    <span className="text-xs text-text-secondary">Sem contato (5v5)</span>
                                </button>
                            </div>
                            <div className="flex gap-3">
                                <button onClick={() => setStep(1)} className="flex-1 bg-white/5 hover:bg-white/10 text-white font-bold py-3 rounded-xl">
                                    ← Voltar
                                </button>
                                <button onClick={() => setStep(3)} className="flex-1 bg-highlight hover:bg-highlight-hover text-white font-bold py-3 rounded-xl">
                                    Próximo: Finalizar →
                                </button>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-6 animate-fade-in text-center py-4">
                            <div className="w-20 h-20 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4 animate-bounce">
                                <SparklesIcon className="w-10 h-10" />
                            </div>
                            <h3 className="text-2xl font-black text-white">Tudo Pronto!</h3>
                            <p className="text-text-secondary">Seu ambiente está configurado e otimizado para {sportType === 'FULLPADS' ? 'Full Pads' : 'Flag'}.</p>
                            
                            <div className="bg-black/30 p-4 rounded-xl border border-white/10 text-left space-y-2 text-sm">
                                <div className="flex items-center gap-2">
                                    <CheckCircleIcon className="w-4 h-4 text-green-500" />
                                    <span className="text-white">Elenco inicial criado</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CheckCircleIcon className="w-4 h-4 text-green-500" />
                                    <span className="text-white">Calendário de temporada gerado</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <CheckCircleIcon className="w-4 h-4 text-green-500" />
                                    <span className="text-white">Playbook IA ativado</span>
                                </div>
                            </div>

                            <button onClick={handleFinish} disabled={isSaving} className="w-full bg-gradient-to-r from-highlight to-cyan-500 text-white font-bold py-4 rounded-xl shadow-glow hover:scale-[1.02] transition-transform">
                                {isSaving ? 'Construindo QG...' : 'Acessar Meu Dashboard'}
                            </button>
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
};

export default Onboarding;
