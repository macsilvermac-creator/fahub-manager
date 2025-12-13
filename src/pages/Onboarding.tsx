
import React, { useState, useContext, useEffect } from 'react';
// @ts-ignore
import { useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import { storageService } from '../services/storageService';
import { TeamSettings, Player } from '../types';
import { CheckCircleIcon, SparklesIcon, UsersIcon, ClipboardIcon } from '../components/icons/UiIcons';
import { TrophyIcon, WhistleIcon } from '../components/icons/NavIcons';
import { UserContext } from '../components/Layout';
import { authService } from '../services/authService';

const Onboarding: React.FC = () => {
    const navigate = useNavigate();
    const { currentRole } = useContext(UserContext);
    const [step, setStep] = useState(1);
    const [isSaving, setIsSaving] = useState(false);
    const user = authService.getCurrentUser();
    const teamSettings = storageService.getTeamSettings();

    // --- FORM STATES ---
    // Master Only
    const [teamName, setTeamName] = useState(teamSettings.teamName || '');
    const [primaryColor, setPrimaryColor] = useState(teamSettings.primaryColor || '#00A86B');

    // Player Only
    const [position, setPosition] = useState('WR');
    const [jersey, setJersey] = useState('');
    const [weight, setWeight] = useState('');
    const [height, setHeight] = useState('');

    // Coach Only
    const [specialty, setSpecialty] = useState('Ataque');
    const [philosophy, setPhilosophy] = useState('');

    const isMaster = currentRole === 'MASTER';
    const isPlayer = currentRole === 'PLAYER';
    const isCoach = currentRole === 'HEAD_COACH' || currentRole === 'OFFENSIVE_COORD' || currentRole === 'DEFENSIVE_COORD';
    
    // Auto-detect program from user profile
    const programContext = user?.program || 'TACKLE';

    const handleFinish = async () => {
        setIsSaving(true);
        
        if (isMaster) {
            const newSettings: TeamSettings = {
                ...teamSettings,
                teamName: teamName || 'Novo Time',
                primaryColor,
                logoUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(teamName || 'FA')}&background=${primaryColor.replace('#', '')}&color=fff&size=200`
            };
            storageService.saveTeamSettings(newSettings);
        } 
        
        if (isPlayer && user) {
            const newPlayer: Player = {
                id: Date.now(),
                name: user.name,
                position: position,
                jerseyNumber: Number(jersey) || 0,
                height: height,
                weight: Number(weight),
                class: 'Rookie',
                avatarUrl: user.avatarUrl,
                level: 1,
                xp: 0,
                rating: 70,
                status: 'ACTIVE',
                rosterCategory: 'ACTIVE',
                badges: ['Novato'],
                nationality: 'BRA',
                depthChartOrder: 4,
                cpf: user.cpf, // Linkando pelo CPF
                program: programContext === 'BOTH' ? 'TACKLE' : programContext // Default to Tackle if both, user can change later
            };
            storageService.registerAthlete(newPlayer);
        }

        if (isCoach && user) {
            // Mock Coach Profile creation logic
             storageService.saveCoachProfile(user.id, {
                careerRecord: { wins: 0, losses: 0, ties: 0 },
                philosophy: philosophy,
                achievements: [],
                specialties: [specialty]
            });
        }

        // CRITICAL: Mark profile as complete to unlock Dashboard
        if (user) {
            await authService.completeUserProfile(user.id);
        }

        setTimeout(() => {
            setIsSaving(false);
            navigate('/dashboard');
            window.location.reload(); 
        }, 1500);
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-primary p-4">
            <div className="max-w-2xl w-full">
                
                {/* SAUDAÇÃO PERSONALIZADA */}
                <div className="text-center mb-8 animate-fade-in">
                    <div className="w-20 h-20 bg-highlight rounded-2xl mx-auto flex items-center justify-center shadow-glow mb-4 transform -skew-x-6">
                        <span className="text-white font-black text-4xl transform skew-x-6">FH</span>
                    </div>
                    <h1 className="text-3xl font-black text-white uppercase tracking-tight">
                        Olá Sr(a) {user?.name.split(' ')[0]}, <br/>
                        Seja bem-vindo ao FAHUB!
                    </h1>
                    <p className="text-lg text-text-secondary mt-2 font-medium">
                        Você agora faz parte do <strong className="text-highlight">{teamSettings.teamName}</strong>.
                    </p>
                    {user?.program && user.program !== 'BOTH' && (
                        <p className="text-xs bg-white/10 text-white px-3 py-1 rounded-full inline-block mt-2 font-bold uppercase">
                            Módulo: {user.program}
                        </p>
                    )}
                </div>

                <Card className="border-t-4 border-t-highlight">
                    {/* Progress Bar */}
                    <div className="flex gap-2 mb-8">
                        <div className={`h-1 flex-1 rounded-full ${step >= 1 ? 'bg-highlight' : 'bg-white/10'}`}></div>
                        <div className={`h-1 flex-1 rounded-full ${step >= 2 ? 'bg-highlight' : 'bg-white/10'}`}></div>
                    </div>

                    {/* STEP 1: WELCOME MESSAGE & CONTEXT */}
                    {step === 1 && (
                        <div className="space-y-6 animate-fade-in text-center">
                            <div className="bg-blue-900/20 border border-blue-500/20 p-6 rounded-xl">
                                <p className="text-blue-200 text-lg font-bold mb-2">
                                    Sua função foi definida: <span className="text-white uppercase underline decoration-highlight">{isPlayer ? 'ATLETA' : isCoach ? 'TÉCNICO' : isMaster ? 'PRESIDENTE' : 'STAFF'}</span>
                                </p>
                                <p className="text-sm text-text-secondary">
                                    O administrador já configurou suas permissões. Complete seu perfil para acessar o QG.
                                </p>
                            </div>
                            <button onClick={() => setStep(2)} className="w-full bg-highlight hover:bg-highlight-hover text-white font-bold py-4 rounded-xl transition-all shadow-lg transform hover:-translate-y-1">
                                Completar Cadastro Agora
                            </button>
                        </div>
                    )}

                    {/* STEP 2: ROLE SPECIFIC DATA */}
                    {step === 2 && (
                        <div className="space-y-6 animate-fade-in">
                            
                            {/* FORMULÁRIO DO MASTER */}
                            {isMaster && (
                                <>
                                    <h3 className="text-xl font-bold text-white flex items-center gap-2"><TrophyIcon className="w-6 h-6 text-yellow-400"/> Identidade da Equipe</h3>
                                    <div>
                                        <label className="text-xs font-bold text-text-secondary uppercase mb-1 block">Nome do Time</label>
                                        <input 
                                            className="w-full bg-black/20 border border-white/10 rounded-xl p-4 text-white text-lg focus:border-highlight focus:outline-none"
                                            value={teamName}
                                            onChange={e => setTeamName(e.target.value)}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-text-secondary uppercase mb-1 block">Cor Principal</label>
                                        <div className="flex gap-2 items-center bg-black/20 p-2 rounded-lg border border-white/10">
                                            <input type="color" value={primaryColor} onChange={e => setPrimaryColor(e.target.value)} className="w-8 h-8 rounded bg-transparent cursor-pointer" />
                                            <span className="text-white font-mono text-sm">{primaryColor}</span>
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* FORMULÁRIO DO ATLETA */}
                            {isPlayer && (
                                <>
                                    <h3 className="text-xl font-bold text-white flex items-center gap-2"><UsersIcon className="w-6 h-6 text-blue-400"/> Ficha do Atleta</h3>
                                    <div className="grid grid-cols-2 gap-6">
                                        <div>
                                            <label className="text-xs font-bold text-text-secondary uppercase mb-1 block">Posição</label>
                                            <select 
                                                className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white focus:border-highlight"
                                                value={position}
                                                onChange={e => setPosition(e.target.value)}
                                            >
                                                {/* Filter positions based on Program context if possible, for now show all common ones */}
                                                <option value="QB">Quarterback</option>
                                                <option value="WR">Receiver</option>
                                                <option value="RB">Running Back</option>
                                                <option value="OL">Linha Ofensiva</option>
                                                <option value="DL">Linha Defensiva</option>
                                                <option value="LB">Linebacker</option>
                                                <option value="DB">Defensive Back</option>
                                                <option value="RUSHER">Rusher (Flag)</option>
                                                <option value="CENTER">Center (Flag)</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-text-secondary uppercase mb-1 block">Número (#)</label>
                                            <input 
                                                type="number"
                                                className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white focus:border-highlight focus:outline-none"
                                                placeholder="Ex: 12"
                                                value={jersey}
                                                onChange={e => setJersey(e.target.value)}
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-text-secondary uppercase mb-1 block">Altura (m)</label>
                                            <input 
                                                className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white focus:border-highlight focus:outline-none"
                                                placeholder="Ex: 1.85"
                                                value={height}
                                                onChange={e => setHeight(e.target.value)}
                                            />
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-text-secondary uppercase mb-1 block">Peso (kg)</label>
                                            <input 
                                                type="number"
                                                className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white focus:border-highlight focus:outline-none"
                                                placeholder="Ex: 90"
                                                value={weight}
                                                onChange={e => setWeight(e.target.value)}
                                            />
                                        </div>
                                    </div>
                                </>
                            )}

                            {/* FORMULÁRIO DO COACH */}
                            {isCoach && (
                                <>
                                    <h3 className="text-xl font-bold text-white flex items-center gap-2"><WhistleIcon className="w-6 h-6 text-purple-400"/> Perfil Técnico</h3>
                                    <div>
                                        <label className="text-xs font-bold text-text-secondary uppercase mb-1 block">Especialidade</label>
                                        <select 
                                            className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white focus:border-highlight"
                                            value={specialty}
                                            onChange={e => setSpecialty(e.target.value)}
                                        >
                                            <option value="Ataque">Coordenador Ofensivo (OC)</option>
                                            <option value="Defesa">Coordenador Defensivo (DC)</option>
                                            <option value="ST">Special Teams</option>
                                            <option value="Posicao">Coach de Posição</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-text-secondary uppercase mb-1 block">Filosofia de Trabalho (Resumo)</label>
                                        <textarea 
                                            className="w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white focus:border-highlight h-24"
                                            placeholder="Ex: Disciplina, execução rápida, foco nos fundamentos..."
                                            value={philosophy}
                                            onChange={e => setPhilosophy(e.target.value)}
                                        />
                                    </div>
                                </>
                            )}
                            
                            <button onClick={handleFinish} disabled={isSaving} className="w-full bg-gradient-to-r from-highlight to-cyan-500 text-white font-bold py-4 rounded-xl shadow-glow hover:scale-[1.02] transition-transform">
                                {isSaving ? 'Salvando Perfil...' : 'Confirmar & Entrar no QG'}
                            </button>
                        </div>
                    )}
                </Card>
            </div>
        </div>
    );
};

export default Onboarding;