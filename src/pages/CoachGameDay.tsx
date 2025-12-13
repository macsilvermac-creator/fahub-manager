
import React, { useState, useEffect } from 'react';
import { Game, CoachGameNote } from '../types';
import { storageService } from '../services/storageService';
import { voiceService } from '../services/voiceService';
import { ClipboardIcon, ClockIcon, AlertTriangleIcon, PlayCircleIcon, ShieldCheckIcon, MicIcon, StopIcon } from '../components/icons/UiIcons';
import { FlagIcon, TrophyIcon } from '../components/icons/NavIcons';
import Button from '../components/Button';
import Input from '../components/Input';
import { useToast } from '../contexts/ToastContext';

const CoachGameDay: React.FC = () => {
    const toast = useToast();
    const [activeGame, setActiveGame] = useState<Game | null>(null);
    const [notes, setNotes] = useState<CoachGameNote[]>([]);
    const [activeTab, setActiveTab] = useState<'GENERAL' | 'HC' | 'OC' | 'DC' | 'ST'>('GENERAL');
    
    // Tactical Flow State
    const [currentDown, setCurrentDown] = useState<1 | 2 | 3 | 4>(1);
    const [selectedPlayCall, setSelectedPlayCall] = useState('');
    
    // Voice State
    const [isListening, setIsListening] = useState(false);

    useEffect(() => {
        const games = storageService.getGames();
        const live = games.find(g => g.status === 'IN_PROGRESS' || g.status === 'HALFTIME') || games.find(g => g.status === 'SCHEDULED');
        setActiveGame(live || null);
        setNotes(storageService.getCoachGameNotes());
    }, []);

    const handleQuickAction = (action: string, type: 'OFFENSE' | 'DEFENSE' | 'SPECIAL' | 'GENERAL') => {
        if (!activeGame) return;

        let content = `[${currentDown}ª Descida]`;
        if (selectedPlayCall) content += ` Chamada: ${selectedPlayCall} ->`;
        content += ` ${action}`;

        // Add visual cues for Momentum Bar based on keywords
        if (['TOUCHDOWN', 'FIELD GOAL', 'PUNT', 'TURNOVER'].includes(action)) {
            content = `[${action}] ${content}`;
        }

        const note: CoachGameNote = {
            id: Date.now().toString(),
            gameId: activeGame.id,
            quarter: activeGame.currentQuarter || 1,
            content: content,
            timestamp: new Date(),
            category: 'GENERAL',
            tags: [type]
        };

        const updated = [note, ...notes];
        setNotes(updated);
        storageService.saveCoachGameNotes(updated);
        
        // Reset state for next play flow
        if (type === 'OFFENSE' || type === 'DEFENSE') {
            setSelectedPlayCall('');
            // Logic to auto-advance down could go here
            if (action !== '1st DOWN' && action !== 'TOUCHDOWN' && currentDown < 4) {
                setCurrentDown((currentDown + 1) as any);
            } else {
                setCurrentDown(1);
            }
        }
        toast.success(`Log: ${action}`);
    };

    // --- LÓGICA DE INTERPRETAÇÃO DE VOZ ---
    const handleVoiceNote = () => {
        if (!voiceService.isSupported()) {
            toast.error("Navegador não suporta voz.");
            return;
        }

        if (isListening) {
            setIsListening(false); 
            return;
        }

        setIsListening(true);
        toast.info("Ouvindo... (Fale um comando ou nota)");
        
        voiceService.listenToCommand(
            (text) => {
                setIsListening(false);
                const lowerText = text.toLowerCase();
                
                // 1. Roteamento de Comandos (Voice-to-Action)
                if (lowerText.includes('touchdown')) {
                    handleQuickAction('TOUCHDOWN', 'OFFENSE');
                    toast.success("Comando de Voz: Touchdown registrado!");
                } else if (lowerText.includes('interceptação') || lowerText.includes('interceptado')) {
                    handleQuickAction('TURNOVER', 'OFFENSE');
                    toast.success("Comando de Voz: Interceptação registrada!");
                } else if (lowerText.includes('sack')) {
                    handleQuickAction('SACK', 'DEFENSE');
                    toast.success("Comando de Voz: Sack registrado!");
                } else if (lowerText.includes('primeira descida') || lowerText.includes('first down')) {
                    handleQuickAction('1st DOWN', 'OFFENSE');
                    toast.success("Comando de Voz: 1st Down registrado!");
                } else {
                    // 2. Fallback: Salvar como Nota de Voz
                    const note: CoachGameNote = {
                        id: Date.now().toString(),
                        gameId: activeGame?.id || 0,
                        quarter: activeGame?.currentQuarter || 1,
                        content: `🎤 Voz: "${text}"`,
                        timestamp: new Date(),
                        category: 'GENERAL',
                        tags: ['VOICE']
                    };
                    const updated = [note, ...notes];
                    setNotes(updated);
                    storageService.saveCoachGameNotes(updated);
                    toast.info("Nota de voz salva.");
                }
            },
            (error) => {
                setIsListening(false);
                toast.error("Erro ao ouvir: " + error);
            }
        );
    };

    // MOCK INTELLIGENCE: Suggestions based on Down & Role
    const getSuggestions = (role: 'OC' | 'DC' | 'ST', down: number) => {
        if (role === 'OC') {
            if (down === 1) return ['Inside Zone (Run)', 'RPO Bubble', 'Play Action Shot'];
            if (down === 2) return ['Outside Zone', 'Quick Slant', 'Screen Pass'];
            if (down === 3) return ['Mesh Concept', 'Stick Concept', 'Four Verticals'];
            if (down === 4) return ['QB Sneak', 'Go For It (Best Play)', 'Punt Formation'];
        }
        if (role === 'DC') {
            if (down === 1) return ['Base 4-3', 'Cover 3 Sky', 'Run Blitz'];
            if (down === 2) return ['Nickel Cover 2', 'Man Free', 'Stunt Front'];
            if (down === 3) return ['Dime Package', 'Double A Gap Blitz', 'Cover 0 (Exotic)'];
            if (down === 4) return ['Punt Return Safe', 'Goal Line', 'Block Formation'];
        }
        if (role === 'ST') {
            return ['Punt Return', 'Kickoff Return', 'Field Goal Block'];
        }
        return [];
    };

    const getMomentumColor = (noteContent: string) => {
        if (noteContent.includes('TOUCHDOWN')) return 'bg-green-500';
        if (noteContent.includes('FIELD GOAL')) return 'bg-yellow-500';
        if (noteContent.includes('TURNOVER')) return 'bg-red-500';
        if (noteContent.includes('PUNT')) return 'bg-gray-500';
        return 'bg-blue-500/20'; // Normal play
    };

    if (!activeGame) return <div className="text-center py-20 text-text-secondary">Nenhum jogo ativo no momento.</div>;

    const renderDownSelector = () => (
        <div className="flex gap-2 mb-4 bg-black/40 p-2 rounded-xl">
            {[1, 2, 3, 4].map((d) => (
                <button
                    key={d}
                    onClick={() => setCurrentDown(d as any)}
                    className={`flex-1 py-3 rounded-lg font-black text-xl transition-all ${
                        currentDown === d 
                        ? 'bg-white text-black shadow-glow scale-105' 
                        : 'bg-white/5 text-text-secondary hover:bg-white/10'
                    }`}
                >
                    {d}ª
                </button>
            ))}
        </div>
    );

    const renderSuggestions = (role: 'OC' | 'DC' | 'ST') => (
        <div className="mb-4">
            <p className="text-[10px] text-text-secondary uppercase font-bold mb-2 ml-1">
                Sugestões Táticas ({currentDown}ª Descida)
            </p>
            <div className="grid grid-cols-3 gap-2">
                {getSuggestions(role, currentDown).map((play, idx) => (
                    <button
                        key={idx}
                        onClick={() => setSelectedPlayCall(play)}
                        className={`p-2 rounded-lg border text-xs font-bold text-left transition-all ${
                            selectedPlayCall === play
                            ? 'bg-highlight/20 border-highlight text-highlight'
                            : 'bg-secondary border-white/10 text-white hover:border-white/30'
                        }`}
                    >
                        {play}
                    </button>
                ))}
            </div>
        </div>
    );

    // Extract major events for momentum bar
    const majorEvents = notes.filter(n => n.content.includes('[TOUCHDOWN]') || n.content.includes('[FIELD GOAL]') || n.content.includes('[PUNT]') || n.content.includes('[TURNOVER]')).slice(0, 10);

    return (
        <div className="space-y-4 pb-24 animate-fade-in relative h-full flex flex-col">
            {/* Header (Immersive) */}
            <div className="bg-black/80 backdrop-blur-md border-b border-white/10 p-4 sticky top-0 z-20 shadow-lg">
                <div className="flex justify-between items-center mb-2">
                    <div>
                        <h1 className="text-xl font-black text-white italic tracking-tighter uppercase">{activeGame.opponent}</h1>
                        <div className="flex gap-3 text-xs font-mono text-text-secondary">
                            <span className="text-yellow-400">Q{activeGame.currentQuarter}</span>
                            <span>{activeGame.clock || '12:00'}</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <button 
                            onClick={handleVoiceNote}
                            className={`p-3 rounded-full transition-all border border-white/10 ${isListening ? 'bg-red-600 animate-pulse text-white shadow-glow' : 'bg-secondary text-white hover:bg-white/20'}`}
                            title="Comando de Voz (Segure para Falar)"
                        >
                            {isListening ? <StopIcon className="w-6 h-6" /> : <MicIcon className="w-6 h-6" />}
                        </button>
                        <span className="block text-3xl font-mono font-bold text-white leading-none">{activeGame.score || '0-0'}</span>
                    </div>
                </div>

                {/* LIVE MOMENTUM BAR */}
                <div className="w-full h-2 bg-white/10 rounded-full flex overflow-hidden">
                    {majorEvents.map((event, idx) => (
                        <div key={idx} className={`h-full flex-1 ${getMomentumColor(event.content)} border-r border-black/50`} title={event.content}></div>
                    ))}
                    {majorEvents.length === 0 && <div className="w-full h-full bg-blue-500/10"></div>}
                </div>
            </div>

            {/* Role Tabs */}
            <div className="flex border-b border-white/10 overflow-x-auto shrink-0 bg-secondary/50">
                <button onClick={() => setActiveTab('GENERAL')} className={`px-6 py-3 font-bold text-xs border-b-2 whitespace-nowrap ${activeTab === 'GENERAL' ? 'border-white text-white' : 'border-transparent text-text-secondary'}`}>Geral (TV)</button>
                <button onClick={() => setActiveTab('HC')} className={`px-6 py-3 font-bold text-xs border-b-2 whitespace-nowrap ${activeTab === 'HC' ? 'border-purple-500 text-purple-400' : 'border-transparent text-text-secondary'}`}>Head Coach</button>
                <button onClick={() => setActiveTab('OC')} className={`px-6 py-3 font-bold text-xs border-b-2 whitespace-nowrap ${activeTab === 'OC' ? 'border-blue-500 text-blue-400' : 'border-transparent text-text-secondary'}`}>Ataque (OC)</button>
                <button onClick={() => setActiveTab('DC')} className={`px-6 py-3 font-bold text-xs border-b-2 whitespace-nowrap ${activeTab === 'DC' ? 'border-red-500 text-red-400' : 'border-transparent text-text-secondary'}`}>Defesa (DC)</button>
                <button onClick={() => setActiveTab('ST')} className={`px-6 py-3 font-bold text-xs border-b-2 whitespace-nowrap ${activeTab === 'ST' ? 'border-green-500 text-green-400' : 'border-transparent text-text-secondary'}`}>Special Teams</button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-2">
                {/* === TAB: GENERAL (READ ONLY) === */}
                {activeTab === 'GENERAL' && (
                    <div className="h-full flex flex-col items-center justify-center space-y-8 opacity-80">
                        <div className="text-center">
                            <p className="text-text-secondary uppercase tracking-widest text-sm">Placar</p>
                            <h2 className="text-8xl font-black text-white">{activeGame.score || '0-0'}</h2>
                        </div>
                        <div className="text-center">
                            <p className="text-text-secondary uppercase tracking-widest text-sm">Situação</p>
                            <h3 className="text-4xl font-bold text-yellow-400">1ª & 10</h3>
                            <p className="text-white">Bola na linha de 25</p>
                        </div>
                    </div>
                )}

                {/* === TAB: OC (OFFENSE) === */}
                {activeTab === 'OC' && (
                    <div className="space-y-4">
                        {renderDownSelector()}
                        {renderSuggestions('OC')}
                        
                        <div className="grid grid-cols-2 gap-3">
                            <button onClick={() => handleQuickAction('CORRIDA', 'OFFENSE')} className="bg-blue-600 hover:bg-blue-500 text-white py-4 rounded-xl font-black text-lg shadow-lg active:scale-95 transition-transform">CORRIDA</button>
                            <button onClick={() => handleQuickAction('PASSE COMPLETO', 'OFFENSE')} className="bg-green-600 hover:bg-green-500 text-white py-4 rounded-xl font-black text-lg shadow-lg active:scale-95 transition-transform">PASSE OK</button>
                            <button onClick={() => handleQuickAction('PASSE INCOMPLETO', 'OFFENSE')} className="bg-gray-700 hover:bg-gray-600 text-white py-4 rounded-xl font-bold active:scale-95 transition-transform">Incompleto</button>
                            <button onClick={() => handleQuickAction('SACK / PERDA', 'OFFENSE')} className="bg-red-600 hover:bg-red-500 text-white py-4 rounded-xl font-bold active:scale-95 transition-transform">SACK</button>
                        </div>

                        <div className="grid grid-cols-3 gap-2 mt-2">
                            <button onClick={() => handleQuickAction('1st DOWN', 'OFFENSE')} className="bg-white/10 hover:bg-white/20 text-white py-2 rounded font-bold text-xs uppercase border border-white/10">1st DOWN</button>
                            <button onClick={() => handleQuickAction('TOUCHDOWN', 'OFFENSE')} className="bg-green-500/20 hover:bg-green-500/40 text-green-400 py-2 rounded font-bold text-xs uppercase border border-green-500/30">TOUCHDOWN</button>
                            <button onClick={() => handleQuickAction('TURNOVER', 'OFFENSE')} className="bg-red-500/20 hover:bg-red-500/40 text-red-400 py-2 rounded font-bold text-xs uppercase border border-red-500/30">TURNOVER</button>
                        </div>
                        
                        <div className="mt-4 p-3 bg-blue-900/20 rounded-xl border border-blue-500/20">
                            <p className="text-xs text-blue-300 font-bold uppercase mb-2">Feed do Ataque</p>
                            <div className="space-y-1 max-h-32 overflow-y-auto">
                                {notes.filter(n => n.tags?.includes('OFFENSE')).slice(0, 5).map(n => (
                                    <p key={n.id} className="text-xs text-white truncate border-b border-white/5 pb-1">{n.content}</p>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* === TAB: DC (DEFENSE) === */}
                {activeTab === 'DC' && (
                    <div className="space-y-4">
                        {renderDownSelector()}
                        {renderSuggestions('DC')}

                        <div className="grid grid-cols-2 gap-3">
                            <button onClick={() => handleQuickAction('TACKLE', 'DEFENSE')} className="bg-blue-600 hover:bg-blue-500 text-white py-4 rounded-xl font-black text-lg shadow-lg active:scale-95 transition-transform">TACKLE</button>
                            <button onClick={() => handleQuickAction('SACK', 'DEFENSE')} className="bg-green-600 hover:bg-green-500 text-white py-4 rounded-xl font-black text-lg shadow-lg active:scale-95 transition-transform">SACK</button>
                            <button onClick={() => handleQuickAction('PASSE DESVIADO', 'DEFENSE')} className="bg-gray-700 hover:bg-gray-600 text-white py-4 rounded-xl font-bold active:scale-95 transition-transform">Desviado</button>
                            <button onClick={() => handleQuickAction('TURNOVER', 'DEFENSE')} className="bg-yellow-600 hover:bg-yellow-500 text-black py-4 rounded-xl font-black text-lg shadow-lg active:scale-95 transition-transform">TURNOVER</button>
                        </div>

                        <div className="mt-4 p-3 bg-red-900/20 rounded-xl border border-red-500/20">
                            <p className="text-xs text-red-300 font-bold uppercase mb-2">Feed da Defesa</p>
                            <div className="space-y-1 max-h-32 overflow-y-auto">
                                {notes.filter(n => n.tags?.includes('DEFENSE')).slice(0, 5).map(n => (
                                    <p key={n.id} className="text-xs text-white truncate border-b border-white/5 pb-1">{n.content}</p>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* === TAB: ST (SPECIAL TEAMS) === */}
                {activeTab === 'ST' && (
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 gap-3">
                            <button onClick={() => handleQuickAction('PUNT', 'SPECIAL')} className="bg-secondary border border-white/10 hover:bg-white/10 text-white py-3 rounded-xl font-bold">PUNT (Chute)</button>
                            <button onClick={() => handleQuickAction('FIELD GOAL', 'SPECIAL')} className="bg-secondary border border-white/10 hover:bg-white/10 text-white py-3 rounded-xl font-bold">FIELD GOAL</button>
                            <button onClick={() => handleQuickAction('KICKOFF RETURN', 'SPECIAL')} className="bg-secondary border border-white/10 hover:bg-white/10 text-white py-3 rounded-xl font-bold">RETORNO</button>
                        </div>
                    </div>
                )}

                {/* === TAB: HC (HEAD COACH) === */}
                {activeTab === 'HC' && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-secondary p-4 rounded-xl border border-white/10 text-center">
                                <p className="text-xs text-text-secondary uppercase font-bold mb-2">Timeouts (Nós)</p>
                                <div className="flex justify-center gap-2">
                                    {[1, 2, 3].map(t => (
                                        <div key={t} className="w-6 h-6 rounded-full bg-yellow-500 shadow-glow"></div>
                                    ))}
                                </div>
                                <button className="mt-3 w-full bg-yellow-600/20 text-yellow-400 text-xs font-bold py-1 rounded border border-yellow-500/50">Pedir Tempo</button>
                            </div>
                            <div className="bg-secondary p-4 rounded-xl border border-white/10 text-center">
                                <p className="text-xs text-text-secondary uppercase font-bold mb-2">Timeouts (Eles)</p>
                                <div className="flex justify-center gap-2">
                                    {[1, 2, 3].map(t => (
                                        <div key={t} className="w-6 h-6 rounded-full bg-gray-600"></div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <button onClick={() => handleQuickAction('ACEITAR FALTA', 'GENERAL')} className="w-full bg-green-600 text-white py-3 rounded-xl font-bold">Aceitar Penalidade</button>
                            <button onClick={() => handleQuickAction('RECUSAR FALTA', 'GENERAL')} className="w-full bg-red-600 text-white py-3 rounded-xl font-bold">Recusar Penalidade</button>
                            <button onClick={() => handleQuickAction('DESAFIO (CHALLENGE)', 'GENERAL')} className="w-full bg-red-800 border-2 border-red-500 text-white py-3 rounded-xl font-black uppercase tracking-widest mt-4">🚩 JOGAR FLAG (Desafio)</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CoachGameDay;
