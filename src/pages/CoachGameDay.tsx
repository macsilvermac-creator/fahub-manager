
import React, { useState, useEffect, useRef } from 'react';
import { Game, CoachGameNote } from '../types';
import { storageService } from '../services/storageService';
import { voiceService } from '../services/voiceService';
import { classifyCoachVoiceNote } from '../services/geminiService';
import { ClipboardIcon, ClockIcon, AlertTriangleIcon, PlayCircleIcon, ShieldCheckIcon, MicIcon, StopIcon, SparklesIcon, FileTextIcon, CheckCircleIcon } from '../components/icons/UiIcons';
import { FlagIcon, TrophyIcon } from '../components/icons/NavIcons';
import Button from '../components/Button';
import Input from '../components/Input';
import { useToast } from '../contexts/ToastContext';

const CoachGameDay: React.FC = () => {
    const toast = useToast();
    const [activeGame, setActiveGame] = useState<Game | null>(null);
    const [notes, setNotes] = useState<CoachGameNote[]>([]);
    
    // View State: Agora temos compartimentos específicos
    const [viewFilter, setViewFilter] = useState<'ALL' | 'OFFENSE' | 'DEFENSE' | 'SPECIAL'>('ALL');
    
    // Tactical Flow State
    const [currentDown, setCurrentDown] = useState<1 | 2 | 3 | 4>(1);
    const [selectedPlayCall, setSelectedPlayCall] = useState('');
    
    // Voice & AI State
    const [isListening, setIsListening] = useState(false);
    const [isProcessingAi, setIsProcessingAi] = useState(false);
    const [liveTranscript, setLiveTranscript] = useState('');

    useEffect(() => {
        const games = storageService.getGames();
        const live = games.find(g => g.status === 'IN_PROGRESS' || g.status === 'HALFTIME') || games.find(g => g.status === 'SCHEDULED');
        setActiveGame(live || null);
        setNotes(storageService.getCoachGameNotes());
        
        return () => {
            setIsListening(false);
        };
    }, []);

    // --- AI VOICE HANDLER (THE CORE FEATURE) ---
    const handleVoiceNote = () => {
        if (!voiceService.isSupported()) {
            toast.error("Navegador não suporta voz.");
            return;
        }

        if (isListening) {
            setIsListening(false); 
            // voiceService stop is handled internally or by browser, we rely on result
            return;
        }

        setIsListening(true);
        setLiveTranscript('Ouvindo...');
        
        voiceService.listenToCommand(
            async (text) => {
                setIsListening(false);
                setLiveTranscript(text);
                
                // 1. Processamento AI (Classificação)
                setIsProcessingAi(true);
                try {
                    const aiResult = await classifyCoachVoiceNote(text);
                    
                    // 2. Criação da Nota Compartimentada
                    const note: CoachGameNote = {
                        id: Date.now().toString(),
                        gameId: activeGame?.id || 0,
                        quarter: activeGame?.currentQuarter || 1,
                        content: text, // Texto original
                        timestamp: new Date(),
                        category: aiResult.category, // 'OFFENSE', 'DEFENSE', etc.
                        tags: ['VOICE', ...aiResult.tags]
                    };
                    
                    if(aiResult.action) {
                        note.content += ` \n👉 Ação Sugerida: ${aiResult.action}`;
                    }

                    // 3. Salvar e Atualizar UI
                    const updated = [note, ...notes];
                    setNotes(updated);
                    storageService.saveCoachGameNotes(updated);
                    
                    const sentimentIcon = aiResult.sentiment === 'POSITIVE' ? '🟢' : aiResult.sentiment === 'NEGATIVE' ? '🔴' : '⚪';
                    toast.success(`${sentimentIcon} Nota salva em ${aiResult.category}`);
                    
                    // Auto-switch view if user is in ALL to show feedback
                    if (viewFilter === 'ALL') {
                        // Optional: could auto-switch to category, but might be jarring
                    }

                } catch (e) {
                    // Fallback
                    const note: CoachGameNote = {
                        id: Date.now().toString(),
                        gameId: activeGame?.id || 0,
                        quarter: activeGame?.currentQuarter || 1,
                        content: text,
                        timestamp: new Date(),
                        category: 'GENERAL',
                        tags: ['VOICE', 'RAW']
                    };
                    setNotes([note, ...notes]);
                    storageService.saveCoachGameNotes([note, ...notes]);
                    toast.warning("Nota salva sem IA (Offline?)");
                } finally {
                    setIsProcessingAi(false);
                    setTimeout(() => setLiveTranscript(''), 3000);
                }
            },
            (error) => {
                setIsListening(false);
                setLiveTranscript('Erro ao ouvir');
                toast.error("Erro no microfone");
            }
        );
    };

    const handleQuickAction = (action: string, type: 'OFFENSE' | 'DEFENSE' | 'SPECIAL' | 'GENERAL') => {
        if (!activeGame) return;
        const note: CoachGameNote = {
            id: Date.now().toString(),
            gameId: activeGame.id,
            quarter: activeGame.currentQuarter || 1,
            content: `[Quick Log] ${action}`,
            timestamp: new Date(),
            category: type,
            tags: ['QUICK']
        };
        const updated = [note, ...notes];
        setNotes(updated);
        storageService.saveCoachGameNotes(updated);
        toast.info(`Logado: ${action}`);
    };

    if (!activeGame) return <div className="text-center py-20 text-text-secondary">Nenhum jogo ativo no momento.</div>;

    const filteredNotes = viewFilter === 'ALL' ? notes : notes.filter(n => n.category === viewFilter);

    return (
        <div className="space-y-4 pb-24 animate-fade-in relative h-[calc(100vh-100px)] flex flex-col">
            
            {/* --- TOP: GAME STATUS --- */}
            <div className="bg-black/40 border-b border-white/10 p-4 sticky top-0 z-20 backdrop-blur-md rounded-xl">
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-black text-white italic tracking-tighter uppercase">{activeGame.opponent}</h2>
                        <div className="flex gap-3 text-xs font-mono text-text-secondary">
                            <span className="text-yellow-400 font-bold">Q{activeGame.currentQuarter || 1}</span>
                            <span>{activeGame.clock || '12:00'}</span>
                        </div>
                    </div>
                    <div className="text-4xl font-mono font-bold text-white">{activeGame.score || '0-0'}</div>
                </div>
            </div>

            {/* --- MIDDLE: COMPARTMENTALIZED FEEDS --- */}
            <div className="flex-1 overflow-hidden flex flex-col">
                {/* Tabs */}
                <div className="flex bg-secondary/50 p-1 rounded-lg mb-2 shrink-0">
                    {['ALL', 'OFFENSE', 'DEFENSE', 'SPECIAL'].map(tab => (
                        <button 
                            key={tab}
                            onClick={() => setViewFilter(tab as any)}
                            className={`flex-1 py-2 text-xs font-bold rounded transition-all ${
                                viewFilter === tab 
                                ? tab === 'OFFENSE' ? 'bg-blue-600 text-white' : tab === 'DEFENSE' ? 'bg-red-600 text-white' : tab === 'SPECIAL' ? 'bg-green-600 text-white' : 'bg-white text-black'
                                : 'text-text-secondary hover:text-white'
                            }`}
                        >
                            {tab === 'ALL' ? 'Tudo' : tab === 'OFFENSE' ? 'Ataque' : tab === 'DEFENSE' ? 'Defesa' : 'ST'}
                        </button>
                    ))}
                </div>

                {/* Notes Feed */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-3 bg-black/20 rounded-xl border border-white/5">
                    {filteredNotes.length === 0 && (
                        <div className="text-center py-10 text-text-secondary italic text-xs">
                            Nenhuma nota nesta categoria. <br/> Use o microfone para gravar.
                        </div>
                    )}
                    {filteredNotes.map(note => (
                        <div key={note.id} className={`p-3 rounded-lg border-l-4 text-sm relative group ${
                            note.category === 'OFFENSE' ? 'bg-blue-900/20 border-blue-500' :
                            note.category === 'DEFENSE' ? 'bg-red-900/20 border-red-500' :
                            note.category === 'SPECIAL' ? 'bg-green-900/20 border-green-500' :
                            'bg-secondary border-gray-500'
                        }`}>
                            <div className="flex justify-between items-start mb-1">
                                <span className="text-[10px] font-bold opacity-70 uppercase">{new Date(note.timestamp).toLocaleTimeString()} • Q{note.quarter}</span>
                                <span className={`text-[9px] px-1.5 py-0.5 rounded ${note.category === 'OFFENSE' ? 'bg-blue-500 text-white' : note.category === 'DEFENSE' ? 'bg-red-500 text-white' : 'bg-gray-600 text-white'}`}>{note.category}</span>
                            </div>
                            <p className="text-white whitespace-pre-wrap">{note.content}</p>
                            {note.tags && note.tags.length > 0 && (
                                <div className="flex gap-1 mt-2">
                                    {note.tags.map(tag => (
                                        <span key={tag} className="text-[9px] bg-white/5 px-1 rounded text-text-secondary">#{tag}</span>
                                    ))}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            {/* --- BOTTOM: SMART MIC CONTROL --- */}
            <div className="shrink-0 pt-4 relative">
                {/* Live Transcript Overlay */}
                {liveTranscript && (
                    <div className="absolute -top-12 left-0 right-0 bg-black/80 backdrop-blur text-white text-center py-2 text-xs rounded-t-xl border-t border-highlight/50 animate-pulse">
                        {isProcessingAi ? '🤖 Analisando Tática...' : `🎙️ "${liveTranscript}"`}
                    </div>
                )}

                <div className="flex gap-4 items-center justify-center">
                    {/* Quick Buttons based on Context */}
                    <div className="flex flex-col gap-2">
                        <button onClick={() => handleQuickAction('TIMEOUT', 'GENERAL')} className="bg-yellow-600/20 border border-yellow-600/50 text-yellow-400 p-3 rounded-xl hover:bg-yellow-600 hover:text-white transition-colors">
                            <ClockIcon className="w-5 h-5" />
                        </button>
                        <button onClick={() => handleQuickAction('FLAG', 'GENERAL')} className="bg-red-600/20 border border-red-600/50 text-red-400 p-3 rounded-xl hover:bg-red-600 hover:text-white transition-colors">
                            <FlagIcon className="w-5 h-5" />
                        </button>
                    </div>

                    {/* BIG MIC BUTTON */}
                    <button 
                        onMouseDown={handleVoiceNote} // Desktop Hold
                        onMouseUp={() => isListening && handleVoiceNote()} // Desktop Release
                        onTouchStart={handleVoiceNote} // Mobile Hold
                        onTouchEnd={() => isListening && handleVoiceNote()} // Mobile Release
                        onClick={handleVoiceNote} // Click Fallback
                        className={`w-24 h-24 rounded-full flex items-center justify-center shadow-[0_0_30px_rgba(0,0,0,0.5)] border-4 transition-all transform active:scale-95 ${
                            isListening 
                            ? 'bg-red-600 border-red-400 scale-110 shadow-[0_0_50px_rgba(220,38,38,0.6)]' 
                            : isProcessingAi 
                                ? 'bg-purple-600 border-purple-400 animate-pulse'
                                : 'bg-gradient-to-br from-highlight to-emerald-800 border-emerald-400 hover:scale-105'
                        }`}
                    >
                        {isProcessingAi ? (
                            <SparklesIcon className="w-10 h-10 text-white animate-spin" />
                        ) : (
                            <MicIcon className={`w-10 h-10 text-white ${isListening ? 'animate-bounce' : ''}`} />
                        )}
                    </button>

                    <div className="flex flex-col gap-2">
                        <button onClick={() => handleQuickAction('GOOD PLAY', viewFilter === 'ALL' ? 'GENERAL' : viewFilter)} className="bg-green-600/20 border border-green-600/50 text-green-400 p-3 rounded-xl hover:bg-green-600 hover:text-white transition-colors">
                            <CheckCircleIcon className="w-5 h-5" />
                        </button>
                        <button onClick={() => handleQuickAction('BAD PLAY', viewFilter === 'ALL' ? 'GENERAL' : viewFilter)} className="bg-gray-600/20 border border-gray-600/50 text-gray-400 p-3 rounded-xl hover:bg-gray-600 hover:text-white transition-colors">
                            <AlertTriangleIcon className="w-5 h-5" />
                        </button>
                    </div>
                </div>
                <p className="text-center text-[10px] text-text-secondary mt-3 opacity-60">
                    {isListening ? 'Solte para enviar à IA...' : 'Toque ou Segure para gravar nota tática'}
                </p>
            </div>
        </div>
    );
};

export default CoachGameDay;