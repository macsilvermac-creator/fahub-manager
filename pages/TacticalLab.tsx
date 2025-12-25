
import React, { useState, useEffect, useRef, useContext } from 'react';
import Card from '../components/Card';
import { PlayElement, TacticalPlay, TacticalFrame } from '../types';
import { storageService } from '../services/storageService';
import { analyzePlayMatchup } from '../services/geminiService';
import { 
    SparklesIcon, PrinterIcon, EyeIcon, 
    PlayCircleIcon, VideoIcon, ClipboardIcon, ChevronRightIcon,
    SearchIcon, LockIcon
} from '../components/icons/UiIcons';
import { WhistleIcon } from '../components/icons/NavIcons';
import { UserContext, UserContextType } from '../components/Layout';
import { useToast } from '../contexts/ToastContext';
import PageHeader from '../components/PageHeader';

const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 400;

const TacticalLab: React.FC = () => {
    const { currentRole } = useContext(UserContext) as UserContextType;
    const toast = useToast();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    
    const isPlayer = currentRole === 'PLAYER';

    // Data States
    const [savedPlays, setSavedPlays] = useState<TacticalPlay[]>([]);
    const [selectedPlay, setSelectedPlay] = useState<TacticalPlay | null>(null);
    
    // Playbook Logic States
    const [elements, setElements] = useState<PlayElement[]>([]);
    const [frames, setFrames] = useState<TacticalFrame[]>([]);
    const [currentFrameIndex, setCurrentFrameIndex] = useState(-1);
    const [isPlaying, setIsPlaying] = useState(false);
    const [draggingId, setDraggingId] = useState<string | null>(null);

    // AI Intel States
    const [isAiThinking, setIsAiThinking] = useState(false);
    const [aiTips, setAiTips] = useState<string | null>(null);

    useEffect(() => {
        const plays = storageService.getTacticalPlays();
        setSavedPlays(plays);
        if (plays.length > 0) {
            handleLoadPlay(plays[0]);
        }
    }, []);

    // Canvas Engine
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.fillStyle = '#1a2e1a'; 
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
        for (let i = 0; i < CANVAS_HEIGHT; i += 40) {
            ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(CANVAS_WIDTH, i); ctx.stroke();
        }
        ctx.strokeStyle = '#3b82f6'; 
        ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(0, 200); ctx.lineTo(CANVAS_WIDTH, 200); ctx.stroke();

        elements.forEach(el => {
            ctx.beginPath();
            ctx.arc(el.x, el.y, 12, 0, 2 * Math.PI);
            ctx.fillStyle = el.type === 'OFFENSE' ? '#3b82f6' : '#ef4444';
            ctx.fill();
            ctx.strokeStyle = '#fff';
            ctx.lineWidth = 2;
            ctx.stroke();
            ctx.fillStyle = '#fff';
            ctx.font = 'bold 10px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(el.label, el.x, el.y + 4);
        });
    }, [elements]);

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
        setAiTips(null);
        setCurrentFrameIndex(-1);
        setIsPlaying(false);
    };

    const generateAiStudyTips = async () => {
        if (!selectedPlay) return;
        setIsAiThinking(true);
        try {
            // Simulando retorno do Gemini focado em execução técnica
            setTimeout(() => {
                setAiTips("🔹 WRs: Corte seco na marca de 12 yards. Mantenha os olhos no quadril do CB.\n🔹 OL: Linha de bloqueio em zona, foco no alcance do LB lado forte.\n🔹 QB: Check primário é o Slant, secundário é o RB no Flat.");
                setIsAiThinking(false);
                toast.success("Intel Tática Gerada!");
            }, 1500);
        } catch (e) {
            setIsAiThinking(false);
        }
    };

    const handlePrint = (type: 'A4' | 'WRIST') => {
        toast.info(`Formatando para ${type}...`);
        window.print();
    };

    // Handlers de interação (Bloqueados para Atleta)
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

    // Fix: Added missing handleSavePlay function to ensure TacticalPlay consistency
    const handleSavePlay = () => {
        if (!selectedPlay && !elements.length) return;
        
        const newPlay: TacticalPlay = {
            id: selectedPlay?.id || Date.now().toString(),
            name: selectedPlay?.name || 'Nova Jogada',
            concept: selectedPlay?.concept || 'Conceito extraído.',
            unit: 'OFFENSE', // Default unit to satisfy TacticalPlay interface
            elements: elements,
            frames: frames,
            createdAt: selectedPlay?.createdAt || new Date()
        };
        
        const currentPlays = storageService.getTacticalPlays();
        const updated = selectedPlay 
            ? currentPlays.map(p => p.id === newPlay.id ? newPlay : p)
            : [newPlay, ...currentPlays];
            
        storageService.saveTacticalPlays(updated);
        setSavedPlays(updated);
        toast.success("Jogada salva!");
    };

    return (
        <div className="space-y-6 animate-fade-in pb-20 overflow-x-hidden">
            <style>{`
                @media print {
                    .no-print { display: none !important; }
                    .print-area { display: block !important; }
                    body { background: white; color: black; }
                }
            `}</style>

            <div className="flex flex-col md:flex-row justify-between items-center gap-4 no-print">
                <PageHeader title="Classroom Playbook" subtitle={isPlayer ? "Central de Estudo Tático" : "Design de Jogadas"} />
                <div className="flex gap-2 w-full md:w-auto">
                    <button onClick={() => handlePrint('WRIST')} className="flex-1 md:flex-none bg-secondary border border-white/10 hover:bg-white/5 text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase flex items-center justify-center gap-2 transition-all">
                        <PrinterIcon className="w-4 h-4" /> Pulseira
                    </button>
                    <button onClick={() => handlePrint('A4')} className="flex-1 md:flex-none bg-secondary border border-white/10 hover:bg-white/5 text-white px-6 py-3 rounded-xl text-[10px] font-black uppercase flex items-center justify-center gap-2 transition-all">
                        <PrinterIcon className="w-4 h-4" /> Plano A4
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* BIBLIOTECA (MOBILE SLIDER NO FUTURO) */}
                <div className="lg:col-span-3 space-y-4 no-print order-2 lg:order-1">
                    <h3 className="text-[10px] font-black text-highlight uppercase tracking-[0.3em] px-2">Play Library</h3>
                    <div className="flex lg:flex-col gap-3 overflow-x-auto no-scrollbar lg:max-h-[60vh] lg:overflow-y-auto">
                        {savedPlays.map(play => (
                            <div 
                                key={play.id} 
                                onClick={() => handleLoadPlay(play)}
                                className={`p-4 rounded-2xl border transition-all cursor-pointer flex-none w-[240px] lg:w-full group ${selectedPlay?.id === play.id ? 'bg-highlight/10 border-highlight shadow-glow' : 'bg-secondary border-white/5 hover:border-white/20'}`}
                            >
                                <div className="flex justify-between items-start mb-2">
                                    <h4 className={`font-black uppercase text-xs italic ${selectedPlay?.id === play.id ? 'text-highlight' : 'text-white'}`}>{play.name}</h4>
                                    <span className="text-[8px] text-text-secondary uppercase">{play.program}</span>
                                </div>
                                <p className="text-[10px] text-text-secondary line-clamp-2">{play.concept}</p>
                            </div>
                        ))}
                    </div>
                </div>

                {/* PRANCHETA PRINCIPAL */}
                <div className="lg:col-span-6 space-y-6 order-1 lg:order-2">
                    <div className="bg-black/60 rounded-[2.5rem] border border-white/10 overflow-hidden shadow-2xl relative">
                        {/* Playback & Locker UI */}
                        <div className="absolute top-6 left-6 z-20 flex gap-2 no-print">
                            <button 
                                onClick={() => setIsPlaying(!isPlaying)}
                                className={`p-4 rounded-full shadow-xl transition-all active:scale-95 ${isPlaying ? 'bg-red-600 text-white' : 'bg-highlight text-white'}`}
                            >
                                <PlayCircleIcon className="w-6 h-6" />
                            </button>
                            {isPlayer && (
                                <div className="bg-black/60 backdrop-blur-md text-white px-4 py-2 rounded-full text-[10px] font-bold border border-white/10 flex items-center gap-2">
                                    <LockIcon className="w-3 h-3 text-highlight" /> Modo Estudo
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
                                className={`w-full h-auto rounded-[2rem] border border-white/5 ${isPlayer ? 'cursor-default' : 'cursor-move'}`}
                            />
                        </div>

                        <div className="absolute bottom-6 right-8 opacity-20 pointer-events-none">
                             <h2 className="text-2xl font-black text-white italic uppercase tracking-widest">Gladiators FA</h2>
                        </div>
                    </div>

                    <div className="bg-secondary/40 p-6 rounded-3xl border border-white/5 space-y-4 shadow-xl">
                        <h3 className="text-xs font-black text-white uppercase italic tracking-widest flex items-center gap-2">
                            <WhistleIcon className="w-4 h-4 text-blue-400" /> Instrução Técnica do Coach
                        </h3>
                        <p className="text-sm text-text-secondary leading-relaxed italic border-l-2 border-highlight pl-4">
                            "{selectedPlay?.concept || 'Aguardando detalhamento tático...'}"
                        </p>
                    </div>
                </div>

                {/* AI INTEL PANEL */}
                <div className="lg:col-span-3 space-y-6 no-print order-3">
                    <Card title="Execution Intel (IA)" className="border-purple-500/30">
                        <div className="space-y-6">
                            {!aiTips ? (
                                <div className="text-center py-6">
                                    <SparklesIcon className="w-10 h-10 text-purple-400 mx-auto mb-4 animate-pulse" />
                                    <button 
                                        onClick={generateAiStudyTips}
                                        disabled={isAiThinking}
                                        className="w-full bg-purple-600 hover:bg-purple-500 text-white font-black py-4 rounded-xl uppercase text-[10px] transition-all active:scale-95 shadow-lg"
                                    >
                                        {isAiThinking ? 'Gerando Análise...' : 'Dicas de Execução IA'}
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-4 animate-fade-in">
                                    <div className="bg-black/40 p-4 rounded-xl border border-purple-500/20">
                                        <p className="text-xs text-text-secondary font-medium leading-relaxed whitespace-pre-line">
                                            {aiTips}
                                        </p>
                                    </div>
                                    <button onClick={() => setAiTips(null)} className="text-[9px] font-black text-text-secondary uppercase hover:text-white transition-colors">Recalcular Dicas</button>
                                </div>
                            )}

                            <div className="pt-6 border-t border-white/5">
                                <h4 className="text-[10px] font-black text-text-secondary uppercase tracking-widest mb-4">Referências de Vídeo</h4>
                                <a 
                                    href={`https://www.youtube.com/results?search_query=american+football+play+${selectedPlay?.name.replace(/\s+/g, '+') || 'football'}+concept`}
                                    target="_blank"
                                    className="w-full bg-red-600/10 hover:bg-red-600/20 border border-red-500/20 p-4 rounded-2xl flex items-center gap-3 transition-all group"
                                >
                                    <VideoIcon className="w-6 h-6 text-red-500" />
                                    <div>
                                        <p className="text-white font-bold text-[10px] uppercase">Ver no YouTube</p>
                                        <p className="text-[9px] text-text-secondary">Execuções reais de {selectedPlay?.name || 'jogadas'}</p>
                                    </div>
                                </a>
                            </div>
                        </div>
                    </Card>

                    <div className="bg-highlight/10 p-5 rounded-3xl border border-highlight/20 text-center">
                        <p className="text-[10px] font-black text-highlight uppercase tracking-[0.2em] mb-1">Study Streak</p>
                        <p className="text-xs text-white">Estude 5 min para ganhar <strong className="text-highlight">+15 XP</strong></p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TacticalLab;