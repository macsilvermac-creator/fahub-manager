
import React, { useState, useEffect } from 'react';
import { Game, CoachGameNote } from '../types';
import { storageService } from '../services/storageService';
import { liveGameService } from '../services/liveGameService';
import { voiceService } from '../services/voiceService';
import { classifyCoachVoiceNote } from '../services/geminiService';
import { ClipboardIcon, ClockIcon, AlertTriangleIcon, PlayCircleIcon, ShieldCheckIcon, MicIcon, StopIcon, SparklesIcon } from '../components/icons/UiIcons';
import { FlagIcon } from '../components/icons/NavIcons';
import { useToast } from '../contexts/ToastContext';

const CoachGameDay: React.FC = () => {
    const toast = useToast();
    const [activeGame, setActiveGame] = useState<Game | null>(null);
    const [notes, setNotes] = useState<CoachGameNote[]>([]);
    
    // View State
    const [viewFilter, setViewFilter] = useState<'ALL' | 'OFFENSE' | 'DEFENSE' | 'SPECIAL'>('ALL');
    const [activeProgram, setActiveProgram] = useState<'TACKLE' | 'FLAG'>('TACKLE');
    
    // Voice & AI State
    const [isListening, setIsListening] = useState(false);
    const [isProcessingAi, setIsProcessingAi] = useState(false);
    const [liveTranscript, setLiveTranscript] = useState('');

    // Tactical State
    const [currentDown, setCurrentDown] = useState<1 | 2 | 3 | 4>(1);
    const [selectedPlayCall, setSelectedPlayCall] = useState('');

    useEffect(() => {
        const games = storageService.getGames();
        const live = games.find(g => g.status === 'IN_PROGRESS' || g.status === 'HALFTIME') || games.find(g => g.status === 'SCHEDULED');
        setActiveGame(live || null);
        setNotes(storageService.getCoachGameNotes());
        setActiveProgram(storageService.getActiveProgram());

        // --- WAR ROOM SUBSCRIPTION ---
        // Escuta atualizações do Juiz em tempo real
        const unsubscribe = liveGameService.subscribe((data) => {
            if (data.type === 'SCORE' || data.type === 'STATUS') {
                console.log("⚡ [COACH] Atualização do Juiz recebida:", data.payload);
                if (activeGame && data.gameId === activeGame.id) {
                    setActiveGame(prev => prev ? { ...prev, ...data.payload } : null);
                    if(data.type === 'SCORE') toast.info("Placar Atualizado pelo Juiz!");
                }
            }
        });

        return () => {
            setIsListening(false);
            unsubscribe();
        };
    }, [activeGame]);

    // ... (Mantém o restante da lógica de Voice Note e Quick Actions existente) ...
    // Vou reimplementar o conteúdo principal para garantir que nada quebre com o merge

    const handleVoiceNote = () => {
        if (!voiceService.isSupported()) {
            toast.error("Navegador não suporta voz.");
            return;
        }
        if (isListening) { setIsListening(false); return; }

        setIsListening(true);
        setLiveTranscript('Ouvindo...');
        
        voiceService.listenToCommand(
            async (text) => {
                setIsListening(false);
                setLiveTranscript(text);
                setIsProcessingAi(true);
                try {
                    const aiResult = await classifyCoachVoiceNote(text);
                    const note: CoachGameNote = {
                        id: Date.now().toString(),
                        gameId: activeGame?.id || 0,
                        quarter: activeGame?.currentQuarter || 1,
                        content: text,
                        timestamp: new Date(),
                        category: aiResult.category,
                        tags: ['VOICE', ...aiResult.tags]
                    };
                    if(aiResult.action) note.content += ` \n👉 Ação Sugerida: ${aiResult.action}`;
                    const updated = [note, ...notes];
                    setNotes(updated);
                    storageService.saveCoachGameNotes(updated);
                    toast.success(`Nota salva em ${aiResult.category}`);
                } catch (e) {
                    const note: CoachGameNote = { id: Date.now().toString(), gameId: activeGame?.id || 0, quarter: 1, content: text, timestamp: new Date(), category: 'GENERAL', tags: ['VOICE'] };
                    setNotes([note, ...notes]);
                    storageService.saveCoachGameNotes([note, ...notes]);
                } finally {
                    setIsProcessingAi(false);
                    setTimeout(() => setLiveTranscript(''), 3000);
                }
            },
            () => setIsListening(false)
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

    if (!activeGame) return <div className="text-center py-20 text-text-secondary">Nenhum jogo ativo. Vá para Schedule.</div>;

    const filteredNotes = viewFilter === 'ALL' ? notes : notes.filter(n => n.category === viewFilter);

    return (
        <div className="space-y-4 pb-24 animate-fade-in relative h-[calc(100vh-100px)] flex flex-col">
            
            {/* --- TOP: GAME STATUS (REAL TIME SYNC) --- */}
            <div className="bg-black/40 border-b border-white/10 p-4 sticky top-0 z-20 backdrop-blur-md rounded-xl">
                <div className="flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-black text-white italic tracking-tighter uppercase">{activeGame.opponent}</h2>
                        <div className="flex gap-3 text-xs font-mono text-text-secondary">
                            <span className="text-yellow-400 font-bold">Q{activeGame.currentQuarter || 1}</span>
                            <span>{activeGame.clock || '12:00'}</span>
                            <span className="bg-white/10 px-2 rounded text-[10px] font-bold">{activeProgram} MODE</span>
                        </div>
                    </div>
                    {/* PLACAR SINCRONIZADO VIA WEBSOCKET */}
                    <div className="text-4xl font-mono font-bold text-white bg-black/50 px-4 py-1 rounded border border-white/10">
                        {activeGame.score || '0-0'}
                    </div>
                </div>
            </div>

            {/* --- MIDDLE: NOTES FEED --- */}
            <div className="flex-1 overflow-hidden flex flex-col">
                <div className="flex bg-secondary/50 p-1 rounded-lg mb-2 shrink-0">
                    {['ALL', 'OFFENSE', 'DEFENSE'].map(tab => (
                        <button key={tab} onClick={() => setViewFilter(tab as any)} className={`flex-1 py-2 text-xs font-bold rounded ${viewFilter === tab ? 'bg-white text-black' : 'text-text-secondary'}`}>{tab}</button>
                    ))}
                </div>
                <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-3 bg-black/20 rounded-xl border border-white/5">
                    {filteredNotes.map(note => (
                        <div key={note.id} className={`p-3 rounded-lg border-l-4 text-sm bg-secondary border-gray-500`}>
                            <p className="text-white whitespace-pre-wrap">{note.content}</p>
                            <span className="text-[9px] text-text-secondary">{new Date(note.timestamp).toLocaleTimeString()}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* --- BOTTOM: CONTROLS --- */}
            <div className="shrink-0 pt-4 relative flex gap-4 justify-center items-center">
                {liveTranscript && <div className="absolute -top-12 left-0 right-0 bg-black text-white text-center py-2 text-xs rounded animate-pulse">{liveTranscript}</div>}
                
                <button onClick={() => handleQuickAction('FLAG', 'GENERAL')} className="bg-red-600/20 text-red-400 p-3 rounded-xl border border-red-500/50"><FlagIcon className="w-5 h-5" /></button>
                
                <button 
                    onMouseDown={handleVoiceNote} onMouseUp={() => isListening && handleVoiceNote()}
                    onTouchStart={handleVoiceNote} onTouchEnd={() => isListening && handleVoiceNote()}
                    className={`w-24 h-24 rounded-full flex items-center justify-center shadow-lg border-4 transition-all ${isListening ? 'bg-red-600 border-red-400 scale-110' : 'bg-gradient-to-br from-highlight to-emerald-800 border-emerald-400'}`}
                >
                    {isProcessingAi ? <SparklesIcon className="w-10 h-10 text-white animate-spin" /> : <MicIcon className="w-10 h-10 text-white" />}
                </button>

                <button onClick={() => handleQuickAction('TIMEOUT', 'GENERAL')} className="bg-yellow-600/20 text-yellow-400 p-3 rounded-xl border border-yellow-600/50"><ClockIcon className="w-5 h-5" /></button>
            </div>
        </div>
    );
};

export default CoachGameDay;