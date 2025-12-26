
import React, { useState, useEffect, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import { PlayElement, TacticalPlay, TacticalFrame, Game } from '../types';
import { storageService } from '../services/storageService';
import { analyzePlayMatchup } from '../services/geminiService';
import { 
    SparklesIcon, PrinterIcon, 
    PlayCircleIcon, VideoIcon, BrainIcon,
    LockIcon, ChevronRightIcon, SearchIcon,
    WhistleIcon
} from '../components/icons/UiIcons';
import { UserContext, UserContextType } from '../components/Layout';
import { useToast } from '../contexts/ToastContext';
import PageHeader from '../components/PageHeader';

const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 400;

const TacticalLab: React.FC = () => {
    const { currentRole } = useContext(UserContext) as UserContextType;
    const toast = useToast();
    const navigate = useNavigate();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    
    const isPlayer = currentRole === 'PLAYER' || currentRole === 'STUDENT';

    // Data States
    const [savedPlays, setSavedPlays] = useState<TacticalPlay[]>([]);
    const [selectedPlay, setSelectedPlay] = useState<TacticalPlay | null>(null);
    const [games, setGames] = useState<Game[]>([]);
    const [selectedGameId, setSelectedGameId] = useState<string>('');
    
    // Editor States
    const [elements, setElements] = useState<PlayElement[]>([]);
    const [frames, setFrames] = useState<TacticalFrame[]>([]);
    const [currentFrameIndex, setCurrentFrameIndex] = useState(-1);
    const [isPlaying, setIsPlaying] = useState(false);
    const [draggingId, setDraggingId] = useState<string | null>(null);

    // AI Intel States
    const [isAiThinking, setIsAiThinking] = useState(false);
    const [aiSimulation, setAiSimulation] = useState<string | null>(null);

    useEffect(() => {
        const plays = storageService.getTacticalPlays();
        setSavedPlays(plays);
        setGames(storageService.getGames());
        if (plays.length > 0) {
            handleLoadPlay(plays[0]);
        }
    }, []);

    // Canvas Engine - High Performance Render
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Fundo Campo Elite
        ctx.fillStyle = '#064e3b'; 
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        // Grid de Jardas
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
        ctx.lineWidth = 1;
        for (let i = 0; i < CANVAS_HEIGHT; i += 40) {
            ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(CANVAS_WIDTH, i); ctx.stroke();
        }
        
        // Line of Scrimmage (LOS)
        ctx.strokeStyle = '#3b82f6'; 
        ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(0, 200); ctx.lineTo(CANVAS_WIDTH, 200); ctx.stroke();

        // Renderização dos Jogadores (Tokens)
        elements.forEach(el => {
            ctx.beginPath();
            ctx.arc(el.x, el.y, 14, 0, 2 * Math.PI);
            
            // Sombra do Token
            ctx.shadowBlur = 10;
            ctx.shadowColor = 'rgba(0,0,0,0.5)';
            
            ctx.fillStyle = el.type === 'OFFENSE' ? '#3b82f6' : '#ef4444';
            ctx.fill();
            
            ctx.shadowBlur = 0; // Reset sombra para o texto
            ctx.strokeStyle = '#fff';
            ctx.lineWidth = 2;
            ctx.stroke();

            ctx.fillStyle = '#fff';
            ctx.font = 'bold 11px Inter, Arial';
            ctx.textAlign = 'center';
            ctx.fillText(el.label, el.x, el.y + 4);
        });
    }, [elements]);

    // Lógica de Animação de Frames
    useEffect(() => {
        let interval: any;
        if (isPlaying && frames.length > 0) {
            interval = setInterval(() => {
                setCurrentFrameIndex(prev => (prev + 1) % frames.length);
            }, 800);
        }
        return () => clearInterval(interval);
    }, [isPlaying, frames]);

    useEffect(() => {
        if (currentFrameIndex >= 0 && frames[currentFrameIndex]) {
            setElements(frames[currentFrameIndex].elements);
        }
    }, [currentFrameIndex, frames]);

    const handleLoadPlay = (play: TacticalPlay) => {
        setSelectedPlay(play);
        setElements(play.elements);
        setFrames(play.frames || []);
        setAiSimulation(null);
        setCurrentFrameIndex(-1);
        setIsPlaying(false);
    };

    const handleSimulateMatchup = async () => {
        if (!selectedPlay || !selectedGameId) {
            toast.warning("Selecione uma jogada e um adversário para simular.");
            return;
        }
        const game = games.find(g => String(g.id) === selectedGameId);
        if (!game || !game.scoutingReport) {
            toast.error("Adversário sem relatório de scout disponível.");
            return;
        }

        setIsAiThinking(true);
        try {
            const result = await analyzePlayMatchup(selectedPlay.concept, game.scoutingReport, game.opponent);
            setAiSimulation(result);
            toast.success("Simulação de Matchup Concluída!");
        } catch (e) {
            toast.error("Falha ao consultar a inteligência tática.");
        } finally {
            setIsAiThinking(false);
        }
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        if (isPlayer) return;
        const rect = canvasRef.current?.getBoundingClientRect();
        if (!rect) return;
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const clicked = elements.find(el => Math.hypot(el.x - x, el.y - y) < 20);
        if (clicked) setDraggingId(clicked.id);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (isPlayer || !draggingId) return;
        const rect = canvasRef.current?.getBoundingClientRect();
        if (!rect) return;
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        setElements(prev => prev.map(el => el.id === draggingId ? { ...el, x, y } : el));
    };

    return (
        <div className="space-y-6 animate-fade-in pb-20">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <PageHeader title="Tactical Lab" subtitle={isPlayer ? "Estudo de Playbook de Elite" : "Centro de Design e Simulação Tática"} />
                <div className="flex gap-2">
                    <button onClick={() => navigate('/ciators')} className="bg-cyan-600 hover:bg-cyan-500 text-white px-6 py-3 rounded-2xl font-black uppercase italic text-xs shadow-glow-blue transition-all flex items-center gap-2">
                        <BrainIcon className="w-4 h-4" /> CIATORS Hub
                    </button>
                    {!isPlayer && (
                        <button className="bg-secondary border border-white/10 hover:bg-white/5 text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase flex items-center gap-2 transition-all">
                            <PrinterIcon className="w-4 h-4" /> Exportar Cards
                        </button>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* Biblioteca Lateral (Library) */}
                <div className="lg:col-span-3 space-y-4 order-2 lg:order-1">
                    <div className="flex items-center justify-between px-2">
                        <h3 className="text-[10px] font-black text-highlight uppercase tracking-[0.3em]">Playbook</h3>
                        <SearchIcon className="w-4 h-4 text-text-secondary opacity-40" />
                    </div>
                    <div className="flex lg:flex-col gap-3 overflow-x-auto no-scrollbar lg:max-h-[65vh] lg:overflow-y-auto custom-scrollbar">
                        {savedPlays.map(play => (
                            <div 
                                key={play.id} 
                                onClick={() => handleLoadPlay(play)}
                                className={`p-4 rounded-[2rem] border transition-all cursor-pointer flex-none w-[240px] lg:w-full group ${selectedPlay?.id === play.id ? 'bg-highlight/10 border-highlight shadow-glow' : 'bg-secondary/40 border-white/5 hover:border-white/20'}`}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <h4 className={`font-black uppercase text-xs italic ${selectedPlay?.id === play.id ? 'text-highlight' : 'text-white'}`}>{play.name}</h4>
                                    <span className="text-[8px] font-black text-text-secondary uppercase bg-white/5 px-2 py-0.5 rounded">{play.program}</span>
                                </div>
                                <p className="text-[10px] text-text-secondary line-clamp-2 leading-relaxed italic">"{play.concept}"</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Prancheta Principal (Editor/Viewer) */}
                <div className="lg:col-span-6 space-y-6 order-1 lg:order-2">
                    <div className="bg-black/60 rounded-[3rem] border border-white/10 overflow-hidden shadow-2xl relative group">
                        {/* Control Bar Overlay */}
                        <div className="absolute top-6 left-6 z-20 flex gap-2">
                            <button 
                                onClick={() => setIsPlaying(!isPlaying)}
                                className={`p-4 rounded-full shadow-xl transition-all active:scale-95 ${isPlaying ? 'bg-red-600 text-white' : 'bg-highlight text-white shadow-glow'}`}
                            >
                                <PlayCircleIcon className="w-6 h-6" />
                            </button>
                            {isPlayer && (
                                <div className="bg-black/60 backdrop-blur-md text-white px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-widest border border-white/10 flex items-center gap-2">
                                    <LockIcon className="w-3 h-3 text-highlight" /> Class Mode
                                </div>
                            )}
                        </div>

                        <div className="p-2">
                            <canvas 
                                ref={canvasRef} 
                                width={CANVAS_WIDTH} 
                                height={CANVAS_HEIGHT} 
                                onMouseDown={handleMouseDown}
                                onMouseMove={handleMouseMove}
                                onMouseUp={() => setDraggingId(null)}
                                className={`w-full h-auto rounded-[2.5rem] border border-white/5 ${isPlayer ? 'cursor-default' : 'cursor-grab active:cursor-grabbing'}`}
                            />
                        </div>

                        {/* Watermark do Time */}
                        <div className="absolute bottom-8 right-10 opacity-10 pointer-events-none">
                             <h2 className="text-3xl font-black text-white italic uppercase tracking-[0.2em]">Gladiators FA</h2>
                        </div>
                    </div>

                    <Card title="Technical Insight" className="border-highlight/20 bg-secondary/20">
                         <div className="flex items-start gap-4">
                            <div className="p-4 bg-highlight/10 rounded-2xl">
                                <WhistleIcon className="w-8 h-8 text-highlight" />
                            </div>
                            <div className="flex-1">
                                <p className="text-sm text-text-secondary leading-relaxed italic border-l-2 border-highlight/30 pl-4">
                                    "{selectedPlay?.concept || 'Aguardando seleção de jogada para exibição de conceitos técnicos...'}"
                                </p>
                                <div className="mt-4 flex items-center gap-2 text-[10px] font-black text-white uppercase tracking-widest opacity-50">
                                    <span>Responsável: Head Coach Guto</span>
                                    <span>•</span>
                                    <span>Versão: 2.0</span>
                                </div>
                            </div>
                         </div>
                    </Card>
                </div>

                {/* AI Simulation Panel */}
                <div className="lg:col-span-3 space-y-6 order-3">
                    <Card title="Matchup AI (Gemini)" className="border-purple-500/30 bg-gradient-to-b from-purple-900/5 to-transparent">
                        <div className="space-y-6">
                            {!aiSimulation ? (
                                <div className="space-y-4">
                                    <p className="text-[10px] text-text-secondary font-bold uppercase tracking-widest leading-relaxed">Simule a eficácia desta jogada contra o próximo adversário.</p>
                                    <select 
                                        className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white text-xs font-bold outline-none focus:border-purple-500"
                                        value={selectedGameId}
                                        onChange={e => setSelectedGameId(e.target.value)}
                                    >
                                        <option value="">Selecionar Oponente...</option>
                                        {games.filter(g => g.status === 'SCHEDULED').map(g => (
                                            <option key={g.id} value={g.id}>vs {g.opponent}</option>
                                        ))}
                                    </select>
                                    <button 
                                        onClick={handleSimulateMatchup}
                                        disabled={isAiThinking || !selectedGameId}
                                        className="w-full bg-purple-600 hover:bg-purple-500 text-white font-black py-4 rounded-2xl uppercase text-[10px] transition-all active:scale-95 shadow-lg disabled:opacity-30"
                                    >
                                        {isAiThinking ? 'Calculando Probabilidades...' : 'Simular Contra Scout'}
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-4 animate-fade-in">
                                    <div className="bg-black/40 p-4 rounded-2xl border border-purple-500/20 max-h-[300px] overflow-y-auto custom-scrollbar">
                                        <p className="text-xs text-text-secondary font-medium leading-relaxed whitespace-pre-line">
                                            {aiSimulation}
                                        </p>
                                    </div>
                                    <button onClick={() => setAiSimulation(null)} className="text-[9px] font-black text-purple-400 uppercase hover:text-white transition-colors tracking-widest">Nova Simulação</button>
                                </div>
                            )}

                            <div className="pt-6 border-t border-white/5">
                                <h4 className="text-[10px] font-black text-text-secondary uppercase tracking-widest mb-4">Referências de Estudo</h4>
                                <button className="w-full bg-red-600/10 hover:bg-red-600/20 border border-red-500/20 p-4 rounded-2xl flex items-center gap-3 transition-all group">
                                    <VideoIcon className="w-6 h-6 text-red-500" />
                                    <div className="text-left">
                                        <p className="text-white font-black text-[10px] uppercase italic">Filmagens Reais</p>
                                        <p className="text-[9px] text-text-secondary">Execução técnica {selectedPlay?.name}</p>
                                    </div>
                                </button>
                            </div>
                        </div>
                    </Card>

                    <div className="bg-highlight/5 p-6 rounded-[2rem] border border-highlight/20 text-center">
                        <p className="text-[10px] font-black text-highlight uppercase tracking-[0.3em] mb-2">Study Streak</p>
                        <p className="text-xs text-white font-bold italic">Estude 10 min de playbook hoje para desbloquear o badge <span className="text-highlight">"Scholar"</span></p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TacticalLab;