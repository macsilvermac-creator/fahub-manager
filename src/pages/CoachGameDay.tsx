import React, { useState, useEffect } from 'react';
import { Game, CoachGameNote } from '../types';
import { storageService } from '../services/storageService';
import { voiceService } from '../services/voiceService';
import { classifyCoachVoiceNote } from '../services/geminiService';
import { ClipboardIcon, ClockIcon, AlertTriangleIcon, PlayCircleIcon, ShieldCheckIcon, MicIcon, StopIcon, SparklesIcon } from '../components/icons/UiIcons';
import { FlagIcon } from '../components/icons/NavIcons';
import Button from '../components/Button';
import Input from '../components/Input';
import { useToast } from '../contexts/ToastContext';

const CoachGameDay: React.FC = () => {
    const toast = useToast();
    const [activeGame, setActiveGame] = useState<Game | null>(null);
    const [notes, setNotes] = useState<CoachGameNote[]>([]);
    
    const [viewFilter, setViewFilter] = useState<'GENERAL' | 'OFFENSE' | 'DEFENSE' | 'SPECIAL'>('GENERAL');
    // @ts-ignore
    const [activeProgram, setActiveProgram] = useState<'TACKLE' | 'FLAG'>('TACKLE');
    
    // Tactical Flow State
    const [currentDown, setCurrentDown] = useState<1 | 2 | 3 | 4>(1);
    const [selectedPlayCall, setSelectedPlayCall] = useState('');
    
    // Voice State
    const [isListening, setIsListening] = useState(false);
    const [isProcessingAi, setIsProcessingAi] = useState(false);
    const [liveTranscript, setLiveTranscript] = useState('');

    useEffect(() => {
        const games = storageService.getGames();
        const live = games.find(g => g.status === 'IN_PROGRESS' || g.status === 'HALFTIME') || games.find(g => g.status === 'SCHEDULED');
        setActiveGame(live || null);
        setNotes(storageService.getCoachGameNotes());
        
        // Safe access to getActiveProgram
        const currentProgram = (storageService as any).getActiveProgram ? (storageService as any).getActiveProgram() : 'TACKLE';
        setActiveProgram(currentProgram);
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

    const handleVoiceNote = () => {
        if (!voiceService.isSupported()) {
            toast.error("Navegador não suporta voz.");
            return;
        }

        if (isListening) {
            setIsListening(false); // Stop logic handled by service usually, but here we update UI
            return;
        }

        setIsListening(true);
        setLiveTranscript('Ouvindo...');
        
        voiceService.listenToCommand(
            async (text) => {
                setIsListening(false);
                setLiveTranscript(text);
                setIsProcessingAi(true);
                
                try {
                    // AI Classification
                    const aiResult = await classifyCoachVoiceNote(text);
                    
                    const note: CoachGameNote = {
                        id: Date.now().toString(),
                        gameId: activeGame?.id || 0,
                        quarter: activeGame?.currentQuarter || 1,
                        content: text,
                        timestamp: new Date(),
                        category: aiResult.category as any, // 'OFFENSE' | 'DEFENSE' etc
                        tags: ['VOICE', ...aiResult.tags]
                    };

                    if(aiResult.action) note.content += ` \n👉 Ação Sugerida: ${aiResult.action}`;

                    const updated = [note, ...notes];
                    setNotes(updated);
                    storageService.saveCoachGameNotes(updated);
                    toast.success(`Nota salva em ${aiResult.category}`);
                } catch (e) {
                    // Fallback se AI falhar
                    const note: CoachGameNote = {
                        id: Date.now().toString(),
                        gameId: activeGame?.id || 0,
                        quarter: 1,
                        content: text,
                        timestamp: new Date(),
                        category: 'GENERAL',
                        tags: ['VOICE']
                    };
                    const updated = [note, ...notes];
                    setNotes(updated);
                    storageService.saveCoachGameNotes(updated);
                } finally {
                    setIsProcessingAi(false);
                    setTimeout(() => setLiveTranscript(''), 3000);
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

    // Componente Interno para Tabs
    const RoleTab = ({ role, label, icon, current, set }: any) => (
        <button 
            onClick={() => set(role)} 
            className={`flex-1 flex flex-col items-center justify-center py-3 border-b-4 transition-all ${current === role ? 'border-highlight bg-white/5 text-white' : 'border-transparent text-text-secondary hover:text-white'}`}
        >
            {icon}
            <span className="text-[10px] font-bold mt-1">{label}</span>
        </button>
    );

    // Extract major events for momentum bar
    const majorEvents = notes.filter(n => n.content.includes('[TOUCHDOWN]') || n.content.includes('[FIELD GOAL]') || n.content.includes('[PUNT]') || n.content.includes('[TURNOVER]')).slice(0, 10);

    return (
        <div className="space-y-4 pb-24 animate-fade-in relative h-full flex flex-col h-[calc(100vh-100px)]">
            {/* Header (Immersive) */}
            <div className="bg-black/80 backdrop-blur-md border-b border-white/10 p-4 sticky top-0 z-20 shadow-lg rounded-xl">
                <div className="flex justify-between items-center mb-2">
                    <div>
                        <h1 className="text-xl font-black text-white italic tracking-tighter uppercase">{activeGame.opponent}</h1>
                        <div className="flex gap-3 text-xs font-mono text-text-secondary">
                            <span className="text-yellow-400 font-bold">Q{activeGame.currentQuarter || 1}</span>
                            <span>{activeGame.clock || '12:00'}</span>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                         {/* Live Transcription Feedback */}
                         {liveTranscript && (
                            <span className="text-xs text-green-400 font-mono animate-pulse mr-2 bg-black/50 px-2 py-1 rounded">
                                {liveTranscript}
                            </span>
                        )}
                        <span className="block text-4xl font-mono font-bold text-white leading-none bg-black/50 px-3 py-1 rounded border border-white/10">{activeGame.score || '0-0'}</span>
                    </div>
                </div>

                {/* LIVE MOMENTUM BAR */}
                <div className="w-full h-2 bg-white/10 rounded-full flex overflow-hidden mt-2">
                    {majorEvents.map((event, idx) => (
                        <div key={idx} className={`h-full flex-1 ${getMomentumColor(event.content)} border-r border-black/50`} title={event.content}></div>
                    ))}
                    {majorEvents.length === 0 && <div className="w-full h-full bg-blue-500/10"></div>}
                </div>
            </div>

            {/* Role Tabs - Bottom Navigation Style for Mobile */}
            <div className="flex bg-secondary/80 backdrop-blur border-b border-white/10 overflow-x-auto shrink-0">
                <RoleTab role="GENERAL" label="TV / GERAL" icon={<PlayCircleIcon className="w-5 h-5"/>} current={viewFilter} set={setViewFilter} />
                <RoleTab role="OFFENSE" label="ATAQUE (OC)" icon={<ShieldCheckIcon className="w-5 h-5"/>} current={viewFilter} set={setViewFilter} />
                <RoleTab role="DEFENSE" label="DEFESA (DC)" icon={<ShieldCheckIcon className="w-5 h-5 rotate-180"/>} current={viewFilter} set={setViewFilter} />
                <RoleTab role="SPECIAL" label="SPECIAL" icon={<FlagIcon className="w-5 h-5"/>} current={viewFilter} set={setViewFilter} />
            </div>

            <div className="flex-1 overflow-y-auto px-2 py-2 custom-scrollbar">
                
                {/* === VIEW: GENERAL (BIG BUTTONS) === */}
                {viewFilter === 'GENERAL' && (
                     <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                             <div className="bg-secondary p-4 rounded-xl border border-white/10 text-center">
                                <p className="text-xs text-text-secondary uppercase font-bold mb-2">Timeouts (Nós)</p>
                                <div className="flex justify-center gap-2">
                                    {[1, 2, 3].map(t => <div key={t} className="w-6 h-6 rounded-full bg-yellow-500 shadow-glow"></div>)}
                                </div>
                                <button onClick={() => handleQuickAction('TIMEOUT', 'GENERAL')} className="mt-3 w-full bg-yellow-600/20 text-yellow-400 text-xs font-bold py-2 rounded border border-yellow-500/50">PEDIR TEMPO</button>
                            </div>
                             <div className="bg-secondary p-4 rounded-xl border border-white/10 text-center">
                                <p className="text-xs text-text-secondary uppercase font-bold mb-2">Faltas</p>
                                <button onClick={() => handleQuickAction('ACEITAR FALTA', 'GENERAL')} className="w-full bg-green-600 text-white py-1 rounded font-bold text-xs mb-2">ACEITAR</button>
                                <button onClick={() => handleQuickAction('RECUSAR FALTA', 'GENERAL')} className="w-full bg-red-600 text-white py-1 rounded font-bold text-xs">RECUSAR</button>
                            </div>
                        </div>
                        <button onClick={() => handleQuickAction('DESAFIO (CHALLENGE)', 'GENERAL')} className="w-full bg-red-800 border-2 border-red-500 text-white py-4 rounded-xl font-black uppercase tracking-widest text-lg shadow-lg">🚩 JOGAR FLAG (DESAFIO)</button>
                     </div>
                )}

                {/* === VIEW: OFFENSE (OC) === */}
                {viewFilter === 'OFFENSE' && (
                    <div className="space-y-4">
                        {/* Down Selector */}
                        <div className="flex gap-2 mb-2 bg-black/40 p-2 rounded-xl">
                            {[1, 2, 3, 4].map((d) => (
                                <button key={d} onClick={() => setCurrentDown(d as any)} className={`flex-1 py-3 rounded-lg font-black text-xl transition-all ${currentDown === d ? 'bg-white text-black shadow-glow scale-105' : 'bg-white/5 text-text-secondary'}`}>
                                    {d}ª
                                </button>
                            ))}
                        </div>

                        {/* Suggestions */}
                        <div className="grid grid-cols-3 gap-2">
                            {getSuggestions('OC', currentDown).map((play, idx) => (
                                <button key={idx} onClick={() => setSelectedPlayCall(play)} className={`p-2 rounded-lg border text-[10px] font-bold text-center transition-all ${selectedPlayCall === play ? 'bg-highlight text-white border-highlight' : 'bg-secondary border-white/10 text-text-secondary'}`}>
                                    {play}
                                </button>
                            ))}
                        </div>

                        {/* Result Buttons */}
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
                    </div>
                )}

                 {/* === VIEW: DEFENSE (DC) === */}
                 {viewFilter === 'DEFENSE' && (
                    <div className="space-y-4">
                         <div className="flex gap-2 mb-2 bg-black/40 p-2 rounded-xl">
                            {[1, 2, 3, 4].map((d) => (
                                <button key={d} onClick={() => setCurrentDown(d as any)} className={`flex-1 py-3 rounded-lg font-black text-xl transition-all ${currentDown === d ? 'bg-white text-black shadow-glow scale-105' : 'bg-white/5 text-text-secondary'}`}>
                                    {d}ª
                                </button>
                            ))}
                        </div>
                        
                         <div className="grid grid-cols-3 gap-2">
                            {getSuggestions('DC', currentDown).map((play, idx) => (
                                <button key={idx} onClick={() => setSelectedPlayCall(play)} className={`p-2 rounded-lg border text-[10px] font-bold text-center transition-all ${selectedPlayCall === play ? 'bg-red-600 text-white border-red-500' : 'bg-secondary border-white/10 text-text-secondary'}`}>
                                    {play}
                                </button>
                            ))}
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <button onClick={() => handleQuickAction('TACKLE', 'DEFENSE')} className="bg-blue-600 hover:bg-blue-500 text-white py-4 rounded-xl font-black text-lg shadow-lg active:scale-95 transition-transform">TACKLE</button>
                            <button onClick={() => handleQuickAction('SACK', 'DEFENSE')} className="bg-green-600 hover:bg-green-500 text-white py-4 rounded-xl font-black text-lg shadow-lg active:scale-95 transition-transform">SACK</button>
                            <button onClick={() => handleQuickAction('PASSE DESVIADO', 'DEFENSE')} className="bg-gray-700 hover:bg-gray-600 text-white py-4 rounded-xl font-bold active:scale-95 transition-transform">Desviado</button>
                            <button onClick={() => handleQuickAction('TURNOVER', 'DEFENSE')} className="bg-yellow-600 hover:bg-yellow-500 text-black py-4 rounded-xl font-black text-lg shadow-lg active:scale-95 transition-transform">TURNOVER</button>
                        </div>
                    </div>
                 )}

                 {/* Feed de Logs */}
                 <div className="mt-4 p-3 bg-black/30 rounded-xl border border-white/5">
                     <p className="text-[10px] text-text-secondary font-bold uppercase mb-2">Feed do Jogo</p>
                     <div className="space-y-1 max-h-32 overflow-y-auto custom-scrollbar">
                         {notes.slice(0, 5).map(n => (
                             <div key={n.id} className="text-xs text-white border-b border-white/5 pb-1 flex justify-between">
                                 <span className="truncate max-w-[80%]">{n.content}</span>
                                 <span className="text-[9px] text-text-secondary">{new Date(n.timestamp).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}</span>
                             </div>
                         ))}
                     </div>
                 </div>

            </div>

            {/* Floating Action Button (Voice) */}
            <div className="absolute bottom-6 right-6 z-30">
                 <button 
                    onMouseDown={handleVoiceNote} onMouseUp={() => isListening && handleVoiceNote()}
                    onTouchStart={handleVoiceNote} onTouchEnd={() => isListening && handleVoiceNote()}
                    className={`w-16 h-16 rounded-full flex items-center justify-center shadow-2xl border-4 transition-all ${isListening ? 'bg-red-600 border-red-400 scale-110 animate-pulse' : 'bg-highlight border-green-400 hover:scale-105'}`}
                >
                    {isProcessingAi ? <SparklesIcon className="w-8 h-8 text-white animate-spin" /> : <MicIcon className="w-8 h-8 text-white" />}
                </button>
            </div>
        </div>
    );
};

export default CoachGameDay;