
import React, { useState, useEffect, useContext, useRef } from 'react';
import { Game, Player, PlayerRotation, GameTimelineEvent, SidelineAudioNote } from '../types';
import { storageService } from '../services/storageService';
import { MicIcon, ActivityIcon, CheckCircleIcon, ClockIcon, TrashIcon, SparklesIcon, UsersIcon } from '../components/icons/UiIcons';
import { UserContext } from '../components/Layout';
import { useToast } from '../contexts/ToastContext';
import Card from '../components/Card';
import LazyImage from '../components/LazyImage';
import { voiceService } from '../services/voiceService';
import { parseSidelineVoice } from '../services/geminiService';

const CoachGameDay: React.FC = () => {
    const { currentRole } = useContext(UserContext);
    const toast = useToast();
    const [activeGame, setActiveGame] = useState<Game | null>(null);
    const [players, setPlayers] = useState<Player[]>([]);
    
    // View Modes
    const [view, setView] = useState<'SIDELINE' | 'ROTATION' | 'TIMELINE'>('SIDELINE');
    
    // Sideline State
    const [isRecording, setIsRecording] = useState(false);
    const [transcript, setTranscript] = useState('');
    const [processingAudio, setProcessingAudio] = useState(false);
    const [lastVoiceNote, setLastVoiceNote] = useState<Partial<SidelineAudioNote> | null>(null);

    // Auxiliary Inputs
    const [currentDown, setCurrentDown] = useState(1);
    const [currentDistance, setCurrentDistance] = useState(10);
    const [currentYardline, setCurrentYardline] = useState('25');

    useEffect(() => {
        const games = storageService.getGames();
        const live = games.find(g => g.status === 'IN_PROGRESS' || g.status === 'HALFTIME') || games[0];
        if (live) {
            setActiveGame({
                ...live,
                timeline: live.timeline || [],
                audioNotes: live.audioNotes || []
            });
        }
        setPlayers(storageService.getPlayers());
    }, []);

    // --- VOICE LOGIC ---
    const startRecording = () => {
        setIsRecording(true);
        setTranscript('');
        voiceService.listenToCommand(
            (text) => {
                setTranscript(text);
                processTranscript(text);
                setIsRecording(false);
            },
            (error) => {
                toast.error("Erro no áudio: " + error);
                setIsRecording(false);
            }
        );
    };

    const processTranscript = async (text: string) => {
        setProcessingAudio(true);
        try {
            const noteData = await parseSidelineVoice(text);
            const fullNote: SidelineAudioNote = {
                id: `note-${Date.now()}`,
                timestamp: new Date(),
                gameTime: activeGame?.clock || '--:--',
                unit: (noteData.unit as any) || 'GERAL',
                rawTranscript: text,
                analysis: noteData.analysis
            };

            const updatedNotes = [fullNote, ...(activeGame?.audioNotes || [])];
            const updatedGame = { ...activeGame!, audioNotes: updatedNotes };
            
            setActiveGame(updatedGame);
            storageService.updateLiveGame(activeGame!.id, updatedGame);
            setLastVoiceNote(fullNote);
            toast.success(`Nota de ${fullNote.unit} registrada!`);
        } catch (e) {
            toast.error("IA falhou ao processar comando.");
        } finally {
            setProcessingAudio(false);
        }
    };

    // --- AUXILIARY LOGIC ---
    const logEvent = (type: GameTimelineEvent['type'], result: string) => {
        const newEvent: GameTimelineEvent = {
            id: `evt-${Date.now()}`,
            timestamp: new Date(),
            quarter: activeGame?.currentQuarter || 1,
            clock: activeGame?.clock || '00:00',
            down: currentDown,
            distance: currentDistance,
            yardLine: currentYardline,
            type,
            result
        };

        const updatedTimeline = [newEvent, ...(activeGame?.timeline || [])];
        const updatedGame = { ...activeGame!, timeline: updatedTimeline };
        
        setActiveGame(updatedGame);
        storageService.updateLiveGame(activeGame!.id, updatedGame);
        toast.info(`Evento registrado: ${type}`);
    };

    if (!activeGame) return <div className="text-white text-center py-20 font-black uppercase italic opacity-20">Nenhum Jogo Ativo</div>;

    const unitColor = lastVoiceNote?.unit === 'ATAQUE' ? 'border-blue-500 bg-blue-500/10' : 
                      lastVoiceNote?.unit === 'DEFESA' ? 'border-red-500 bg-red-500/10' : 
                      lastVoiceNote?.unit === 'ST' ? 'border-yellow-500 bg-yellow-500/10' : 'border-white/10';

    return (
        <div className="space-y-4 animate-fade-in pb-20 bg-primary min-h-screen">
            {/* SCOREBOARD COMPACTO */}
            <div className="bg-black p-4 border-b-2 border-highlight flex justify-between items-center sticky top-0 z-50">
                <div>
                    <h1 className="text-sm font-black text-white italic uppercase tracking-tighter">vs {activeGame.opponent}</h1>
                    <div className="flex gap-2 text-[10px] font-mono font-bold">
                        <span className="text-yellow-400">Q{activeGame.currentQuarter}</span>
                        <span className="text-white">{activeGame.clock}</span>
                    </div>
                </div>
                <div className="text-3xl font-mono font-black text-white tracking-widest">{activeGame.score || '00-00'}</div>
            </div>

            {/* MODO SIDELINE (COMBATE) */}
            {view === 'SIDELINE' && (
                <div className="px-4 space-y-6">
                    {/* BOTÃO PTT (HEAD COACH) */}
                    <div className="flex flex-col items-center justify-center pt-8">
                        <button 
                            onMouseDown={startRecording}
                            onTouchStart={startRecording}
                            className={`w-48 h-48 rounded-full border-8 flex flex-col items-center justify-center transition-all shadow-2xl relative ${isRecording ? 'bg-red-600 border-white scale-110 animate-pulse' : 'bg-secondary border-highlight/30'}`}
                        >
                            {isRecording ? <div className="absolute inset-0 bg-white/20 rounded-full animate-ping"></div> : null}
                            <MicIcon className={`w-16 h-16 ${isRecording ? 'text-white' : 'text-highlight'}`} />
                            <span className="text-[10px] font-black uppercase mt-2 text-white">Segure para Falar</span>
                        </button>
                        
                        {processingAudio && (
                            <div className="mt-4 flex items-center gap-2 text-blue-400 text-xs font-bold uppercase animate-pulse">
                                <SparklesIcon className="w-4 h-4" /> IA Processando Tática...
                            </div>
                        )}
                    </div>

                    {/* ÚLTIMO INSIGHT DA IA */}
                    {lastVoiceNote && (
                        <div className={`p-4 rounded-2xl border-l-4 transition-all animate-slide-in ${unitColor}`}>
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-[10px] font-black uppercase tracking-widest text-text-secondary">{lastVoiceNote.unit} • {lastVoiceNote.gameTime}</span>
                                <span className="text-[8px] bg-white/10 px-2 py-0.5 rounded text-white">IA TRANSCRIPT</span>
                            </div>
                            <p className="text-white text-sm font-bold italic">"{lastVoiceNote.rawTranscript}"</p>
                            {lastVoiceNote.analysis?.insight && (
                                <p className="text-highlight text-[10px] font-black uppercase mt-2">💡 AJUSTE: {lastVoiceNote.analysis.insight}</p>
                            )}
                        </div>
                    )}

                    {/* AUXILIARY FAST INPUTS */}
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                        <Card title="Situação (Auxiliar)">
                            <div className="grid grid-cols-3 gap-2">
                                <div className="text-center">
                                    <span className="text-[8px] text-text-secondary font-bold uppercase">Down</span>
                                    <div className="flex items-center justify-center gap-2 mt-1">
                                        <button onClick={() => setCurrentDown(Math.max(1, currentDown-1))} className="text-white opacity-40">-</button>
                                        <span className="text-lg font-black text-white">{currentDown}</span>
                                        <button onClick={() => setCurrentDown(Math.min(4, currentDown+1))} className="text-white opacity-40">+</button>
                                    </div>
                                </div>
                                <div className="text-center">
                                    <span className="text-[8px] text-text-secondary font-bold uppercase">Dist</span>
                                    <input type="number" className="bg-black/40 w-full text-center text-lg font-black text-white border-none mt-1" value={currentDistance} onChange={e => setCurrentDistance(Number(e.target.value))} />
                                </div>
                                <div className="text-center">
                                    <span className="text-[8px] text-text-secondary font-bold uppercase">Yard</span>
                                    <input className="bg-black/40 w-full text-center text-lg font-black text-white border-none mt-1" value={currentYardline} onChange={e => setCurrentYardline(e.target.value)} />
                                </div>
                            </div>
                        </Card>

                        <Card title="Ação de Campo">
                            <div className="grid grid-cols-2 gap-2">
                                <button onClick={() => logEvent('RUN', 'Gain')} className="bg-blue-600 py-2 rounded-lg text-[10px] font-black text-white uppercase shadow-lg">Corrida</button>
                                <button onClick={() => logEvent('PASS', 'Complete')} className="bg-blue-600 py-2 rounded-lg text-[10px] font-black text-white uppercase shadow-lg">Passe</button>
                                <button onClick={() => logEvent('FOUL', 'Yellow Flag')} className="bg-yellow-500 py-2 rounded-lg text-[10px] font-black text-black uppercase shadow-lg">Falta</button>
                                <button onClick={() => logEvent('TIMEOUT', 'T.O.')} className="bg-white/10 py-2 rounded-lg text-[10px] font-black text-white uppercase">Timeout</button>
                            </div>
                        </Card>
                    </div>
                </div>
            )}

            {/* NAVEGAÇÃO DE PÁGINA (FIXADA NO FUNDO) */}
            <div className="fixed bottom-0 left-0 right-0 h-14 bg-secondary border-t border-white/10 grid grid-cols-3 z-50">
                <button onClick={() => setView('SIDELINE')} className={`flex flex-col items-center justify-center ${view === 'SIDELINE' ? 'text-highlight' : 'text-text-secondary'}`}>
                    <MicIcon className="w-5 h-5" />
                    <span className="text-[8px] font-black uppercase mt-1 tracking-widest">Sideline</span>
                </button>
                <button onClick={() => setView('TIMELINE')} className={`flex flex-col items-center justify-center ${view === 'TIMELINE' ? 'text-highlight' : 'text-text-secondary'}`}>
                    <ActivityIcon className="w-5 h-5" />
                    <span className="text-[8px] font-black uppercase mt-1 tracking-widest">Timeline</span>
                </button>
                <button onClick={() => setView('ROTATION')} className={`flex flex-col items-center justify-center ${view === 'ROTATION' ? 'text-highlight' : 'text-text-secondary'}`}>
                    <UsersIcon className="w-5 h-5" />
                    <span className="text-[8px] font-black uppercase mt-1 tracking-widest">Rotação</span>
                </button>
            </div>
        </div>
    );
};

export default CoachGameDay;