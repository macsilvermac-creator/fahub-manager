
import React, { useState, useEffect, useContext } from 'react';
import { Game, GameTimelineEvent, SidelineAudioNote } from '../types';
import { storageService } from '../services/storageService';
import { MicIcon, ActivityIcon, CheckCircleIcon, SparklesIcon, TrashIcon, ClockIcon } from '../components/icons/UiIcons';
import { UserContext } from '../components/Layout';
import { useToast } from '../contexts/ToastContext';
import { voiceService } from '../services/voiceService';
import { parseSidelineAudio } from '../services/geminiService';
import Card from '../components/Card';

const CoachGameDay: React.FC = () => {
    const { currentRole } = useContext(UserContext);
    const toast = useToast();
    const [activeGame, setActiveGame] = useState<Game | null>(null);
    
    // Estados do Modo Sideline
    const [isRecording, setIsRecording] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [lastNote, setLastNote] = useState<Partial<SidelineAudioNote> | null>(null);
    
    // Estados do Auxiliar (Marcação Rápida)
    const [down, setDown] = useState(1);
    const [distance, setDistance] = useState(10);
    const [yardLine, setYardLine] = useState('25');

    useEffect(() => {
        const games = storageService.getGames();
        const live = games.find(g => g.status === 'IN_PROGRESS') || games[0];
        if (live) {
            setActiveGame({
                ...live,
                timeline: live.timeline || [],
                audioNotes: live.audioNotes || []
            });
        }
    }, []);

    // --- LÓGICA DE VOZ (PUSH-TO-TALK) ---
    const handleVoiceStart = () => {
        setIsRecording(true);
        voiceService.listenToCommand(
            async (transcript) => {
                setIsRecording(false);
                setIsProcessing(true);
                try {
                    const parsed = await parseSidelineAudio(transcript);
                    const newNote: SidelineAudioNote = {
                        id: `note-${Date.now()}`,
                        timestamp: new Date(),
                        gameTime: activeGame?.clock || '00:00',
                        unit: (parsed.unit as any) || 'GERAL',
                        rawTranscript: transcript,
                        analysis: parsed.analysis
                    };

                    const updatedGame = {
                        ...activeGame!,
                        audioNotes: [newNote, ...(activeGame?.audioNotes || [])]
                    };
                    
                    setActiveGame(updatedGame);
                    storageService.updateLiveGame(activeGame!.id, updatedGame);
                    setLastNote(newNote);
                    
                    // Feedback Visual Baseado na Unidade
                    const unitLabel = newNote.unit === 'ATAQUE' ? '🔵 Ataque' : newNote.unit === 'DEFESA' ? '🔴 Defesa' : '🟡 ST';
                    toast.success(`Nota de ${unitLabel} registrada!`);
                } catch (e) {
                    toast.error("IA falhou ao processar áudio tático.");
                } finally {
                    setIsProcessing(false);
                }
            },
            (error) => {
                setIsRecording(false);
                toast.error("Erro no microfone: " + error);
            }
        );
    };

    // --- LÓGICA DE EVENTO (AUXILIAR DE CAMPO) ---
    const logPlay = (type: GameTimelineEvent['playType'], result: string) => {
        const newEvent: GameTimelineEvent = {
            id: `evt-${Date.now()}`,
            timestamp: new Date(),
            gameTime: activeGame?.clock || '00:00',
            quarter: activeGame?.currentQuarter || 1,
            down,
            distance,
            yardLine,
            playType: type,
            result
        };

        const updatedGame = {
            ...activeGame!,
            timeline: [newEvent, ...(activeGame?.timeline || [])]
        };

        setActiveGame(updatedGame);
        storageService.updateLiveGame(activeGame!.id, updatedGame);
        toast.info(`${type} marcado no Q${newEvent.quarter}`);
    };

    if (!activeGame) return <div className="p-10 text-white text-center font-black uppercase italic opacity-20">Nenhum jogo ativo no momento.</div>;

    // Dinâmica de cor para feedback da última nota
    const unitBorder = lastNote?.unit === 'ATAQUE' ? 'border-blue-500' : 
                       lastNote?.unit === 'DEFESA' ? 'border-red-500' : 
                       lastNote?.unit === 'ST' ? 'border-yellow-500' : 'border-white/10';

    return (
        <div className="min-h-screen bg-black pb-20 animate-fade-in no-scrollbar">
            {/* SCOREBOARD DE ALTO CONTRASTE (STIKY) */}
            <div className="bg-black p-4 border-b-2 border-highlight flex justify-between items-center sticky top-0 z-50">
                <div className="flex flex-col">
                    <span className="text-[10px] font-black text-text-secondary uppercase tracking-widest">vs {activeGame.opponent}</span>
                    <span className="text-xl font-black text-white italic tracking-tighter">{activeGame.clock || '12:00'} • Q{activeGame.currentQuarter}</span>
                </div>
                <div className="text-4xl font-mono font-black text-white tabular-nums tracking-widest">{activeGame.score || '00-00'}</div>
            </div>

            <div className="p-4 space-y-8 max-w-lg mx-auto pt-6">
                
                {/* BOTÃO PTT (HEAD COACH) */}
                <div className="flex flex-col items-center gap-6 py-4">
                    <div className="relative">
                        <button 
                            onMouseDown={handleVoiceStart}
                            onTouchStart={handleVoiceStart}
                            className={`w-64 h-64 rounded-full border-[12px] transition-all flex flex-col items-center justify-center shadow-2xl relative ${isRecording ? 'bg-red-600 border-white scale-110' : 'bg-[#1e293b] border-highlight/20'}`}
                        >
                            {isRecording && <div className="absolute inset-0 bg-white/20 rounded-full animate-ping"></div>}
                            <MicIcon className={`w-24 h-24 ${isRecording ? 'text-white' : 'text-highlight'}`} />
                            <span className={`text-[10px] font-black uppercase mt-4 ${isRecording ? 'text-white' : 'text-text-secondary'}`}>
                                {isRecording ? 'Ouvindo Campo...' : 'Segure para Falar'}
                            </span>
                        </button>
                    </div>

                    {isProcessing && (
                        <div className="flex items-center gap-2 text-blue-400 text-xs font-black uppercase animate-pulse">
                            <SparklesIcon className="w-5 h-5" /> IA Sincronizando Tática...
                        </div>
                    )}
                </div>

                {/* VISUALIZAÇÃO DO ÚLTIMO INSIGHT */}
                {lastNote && (
                    <div className={`p-5 rounded-2xl border-l-8 bg-secondary/30 shadow-xl animate-slide-in ${unitBorder}`}>
                        <div className="flex justify-between text-[10px] font-black uppercase mb-2">
                            <span className="text-text-secondary tracking-widest">{lastNote.unit} • {lastNote.gameTime}</span>
                            <span className="text-highlight">AI ANALYZED</span>
                        </div>
                        <p className="text-white text-base font-bold italic leading-tight">"{lastNote.rawTranscript}"</p>
                        {lastNote.analysis?.insight && (
                            <div className="mt-3 pt-3 border-t border-white/5">
                                <p className="text-highlight text-[10px] font-black uppercase">Sugestão de Ajuste:</p>
                                <p className="text-text-secondary text-xs font-medium">{lastNote.analysis.insight}</p>
                            </div>
                        )}
                    </div>
                )}

                {/* MARCAÇÃO AUXILIAR (BOTÕES GIGANTES) */}
                <div className="space-y-4 pt-4 border-t border-white/5">
                    <h3 className="text-[10px] font-black text-text-secondary uppercase tracking-[0.3em] text-center">Auxiliar de Campo</h3>
                    
                    <div className="grid grid-cols-3 gap-2">
                        <div className="bg-secondary p-3 rounded-2xl border border-white/5 text-center">
                            <span className="text-[8px] font-black text-text-secondary uppercase block mb-1">Down</span>
                            <div className="flex justify-between items-center px-2">
                                <button onClick={() => setDown(Math.max(1, down-1))} className="text-white font-bold text-lg">-</button>
                                <span className="text-2xl font-black text-white">{down}</span>
                                <button onClick={() => setDown(Math.min(4, down+1))} className="text-white font-bold text-lg">+</button>
                            </div>
                        </div>
                        <div className="bg-secondary p-3 rounded-2xl border border-white/5 text-center">
                            <span className="text-[8px] font-black text-text-secondary uppercase block mb-1">Distância</span>
                            <input type="number" className="w-full bg-transparent text-center text-2xl font-black text-white focus:outline-none" value={distance} onChange={e => setDistance(Number(e.target.value))} />
                        </div>
                        <div className="bg-secondary p-3 rounded-2xl border border-white/5 text-center">
                            <span className="text-[8px] font-black text-text-secondary uppercase block mb-1">Yardline</span>
                            <input className="w-full bg-transparent text-center text-2xl font-black text-white focus:outline-none" value={yardLine} onChange={e => setYardLine(e.target.value)} />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <button onClick={() => logPlay('RUN', 'Gain')} className="bg-blue-600 hover:bg-blue-500 text-white font-black py-5 rounded-2xl uppercase italic text-sm shadow-xl active:scale-95 transition-all">Corrida</button>
                        <button onClick={() => logPlay('PASS', 'Complete')} className="bg-blue-600 hover:bg-blue-500 text-white font-black py-5 rounded-2xl uppercase italic text-sm shadow-xl active:scale-95 transition-all">Passe</button>
                        <button onClick={() => logPlay('FOUL', 'Flag')} className="bg-yellow-500 hover:bg-yellow-400 text-black font-black py-5 rounded-2xl uppercase italic text-sm shadow-xl active:scale-95 transition-all">Falta (Flag)</button>
                        <button onClick={() => logPlay('TIMEOUT', 'TO')} className="bg-white/10 hover:bg-white/20 text-white font-black py-5 rounded-2xl uppercase italic text-sm border border-white/10 active:scale-95 transition-all">Timeout</button>
                    </div>
                </div>

                {/* MINI TIMELINE RECENTE */}
                <div className="bg-secondary/20 p-4 rounded-2xl border border-white/5">
                    <div className="flex justify-between items-center mb-3">
                        <span className="text-[10px] font-black text-text-secondary uppercase">Eventos Recentes</span>
                        <ActivityIcon className="w-4 h-4 text-text-secondary" />
                    </div>
                    <div className="space-y-2 max-h-32 overflow-y-auto no-scrollbar">
                        {activeGame.timeline.slice(0, 3).map(evt => (
                            <div key={evt.id} className="text-[10px] flex justify-between border-b border-white/5 pb-1">
                                <span className="text-white font-bold uppercase">{evt.gameTime} - {evt.playType}</span>
                                <span className="text-text-secondary font-mono">{evt.down}ª & {evt.distance} em {evt.yardLine}</span>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default CoachGameDay;
