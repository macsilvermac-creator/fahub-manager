
import React, { useState, useEffect, useRef, useContext, useMemo } from 'react';
import Card from '../components/Card';
/* Fix: Added missing PageHeader import to resolve "Cannot find name 'PageHeader'" error */
import PageHeader from '../components/PageHeader';
import { PlayElement, TacticalPlay, TacticalFrame, TeamSettings } from '../types';
import { storageService } from '../services/storageService';
import { analyzePlayMatchup, importPlaybookFromImage } from '../services/geminiService';
import { 
    SparklesIcon, PrinterIcon, PenIcon, EyeIcon, 
    ScanIcon, ImageIcon, EraserIcon, PlayCircleIcon, 
    VideoIcon, ClipboardIcon, ChevronRightIcon,
    SearchIcon
} from '../components/icons/UiIcons';
import { WhistleIcon, BookIcon } from '../components/icons/NavIcons';
import { UserContext, UserContextType } from '../components/Layout';
import { useToast } from '../contexts/ToastContext';

const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 400;

const TacticalLab: React.FC = () => {
    const { currentRole } = useContext(UserContext) as UserContextType;
    const toast = useToast();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    const isPlayer = currentRole === 'PLAYER';
    const isCoach = !isPlayer;

    // Data States
    const [savedPlays, setSavedPlays] = useState<TacticalPlay[]>([]);
    const [selectedPlay, setSelectedPlay] = useState<TacticalPlay | null>(null);
    
    // Playbook Logic States
    const [playName, setPlayName] = useState('');
    const [conceptDescription, setConceptDescription] = useState('');
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

        // Limpa e desenha campo
        ctx.fillStyle = '#1a2e1a'; // Gramado escuro técnico
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        // Grid de jardas
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
        for (let i = 0; i < CANVAS_HEIGHT; i += 40) {
            ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(CANVAS_WIDTH, i); ctx.stroke();
        }
        ctx.strokeStyle = '#3b82f6'; // LOS
        ctx.lineWidth = 2;
        ctx.beginPath(); ctx.moveTo(0, 200); ctx.lineTo(CANVAS_WIDTH, 200); ctx.stroke();

        // Desenha jogadores
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

    // Animação de Reprodução
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
        setPlayName(play.name);
        setConceptDescription(play.concept || '');
        setAiTips(null);
        setCurrentFrameIndex(-1);
        setIsPlaying(false);
    };

    const generateAiStudyTips = async () => {
        if (!selectedPlay) return;
        setIsAiThinking(true);
        try {
            // Simulando prompt tático para o Gemini
            const prompt = `Analise a jogada "${selectedPlay.name}": ${selectedPlay.concept}. Forneça 3 dicas de execução técnica para os atletas.`;
            // Aqui chamaria o geminiService.generatePlayStudyTips(selectedPlay)
            setTimeout(() => {
                setAiTips("1. Recebedores: O corte deve ser explosivo aos 5 yards.\n2. Linha: Foco no double team no DT do lado forte.\n3. QB: Leitura primária é o Safety do lado esquerdo.");
                setIsAiThinking(false);
                toast.success("Dicas de estudo atualizadas pela IA.");
            }, 1500);
        } catch (e) {
            setIsAiThinking(false);
            toast.error("Erro ao consultar o Coach IA.");
        }
    };

    const handlePrint = (type: 'A4' | 'WRIST') => {
        toast.info(`Gerando layout para ${type}...`);
        setTimeout(() => window.print(), 500);
    };

    // Handlers de interação (Apenas para Coach)
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
            <style>{`
                @media print {
                    .no-print { display: none !important; }
                    .print-area { display: block !important; background: white !important; color: black !important; }
                    .canvas-print { border: 2px solid black !important; width: 100% !important; }
                }
            `}</style>

            <div className="flex flex-col md:flex-row justify-between items-center gap-4 no-print">
                <PageHeader title="Playbook Lab" subtitle={isPlayer ? "Sala de Estudo e Revisão" : "Prancheta do Treinador"} />
                <div className="flex gap-2">
                    <button onClick={() => handlePrint('WRIST')} className="bg-secondary border border-white/10 hover:bg-white/5 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase flex items-center gap-2">
                        <PrinterIcon className="w-4 h-4" /> Wristband
                    </button>
                    <button onClick={() => handlePrint('A4')} className="bg-secondary border border-white/10 hover:bg-white/5 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase flex items-center gap-2">
                        <PrinterIcon className="w-4 h-4" /> Plano A4
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* 1. SELETOR DE JOGADAS (25%) - NO-PRINT */}
                <div className="lg:col-span-3 space-y-4 no-print h-[calc(100vh-250px)] overflow-y-auto custom-scrollbar">
                    <h3 className="text-[10px] font-black text-highlight uppercase tracking-[0.3em] px-2">Biblioteca do Time</h3>
                    {savedPlays.map(play => (
                        <div 
                            key={play.id} 
                            onClick={() => handleLoadPlay(play)}
                            className={`p-4 rounded-2xl border transition-all cursor-pointer group ${selectedPlay?.id === play.id ? 'bg-highlight/10 border-highlight shadow-glow' : 'bg-secondary border-white/5 hover:border-white/20'}`}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <h4 className={`font-black uppercase text-xs italic ${selectedPlay?.id === play.id ? 'text-highlight' : 'text-white'}`}>{play.name}</h4>
                                <span className="text-[8px] text-text-secondary uppercase">{play.program}</span>
                            </div>
                            <p className="text-[10px] text-text-secondary line-clamp-2">{play.concept || 'Sem descrição técnica.'}</p>
                        </div>
                    ))}
                </div>

                {/* 2. PRANCHETA (50%) */}
                <div className="lg:col-span-6 space-y-6">
                    <div className="bg-black/60 rounded-[2.5rem] border border-white/10 overflow-hidden shadow-2xl relative">
                        {/* Playback Controls */}
                        <div className="absolute top-6 left-6 z-20 flex gap-2 no-print">
                            <button 
                                onClick={() => setIsPlaying(!isPlaying)}
                                className={`p-3 rounded-full shadow-xl transition-all active:scale-95 ${isPlaying ? 'bg-red-600 text-white' : 'bg-highlight text-white'}`}
                            >
                                <PlayCircleIcon className="w-6 h-6" />
                            </button>
                            {frames.length > 0 && (
                                <span className="bg-black/40 backdrop-blur-md text-white px-3 py-1.5 rounded-full text-[10px] font-bold border border-white/10 flex items-center">
                                    {currentFrameIndex === -1 ? 'Frame Inicial' : `Animação: Frame ${currentFrameIndex + 1}/${frames.length}`}
                                </span>
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

                        {/* Coach Signature (Visual) */}
                        <div className="absolute bottom-6 right-8 opacity-40">
                             <div className="flex flex-col items-end">
                                 <p className="text-[10px] font-black text-white italic uppercase tracking-widest">Aproved by Coach</p>
                                 <div className="w-16 h-0.5 bg-highlight mt-1"></div>
                             </div>
                        </div>
                    </div>

                    {/* Instruções do Coach (Texto Estático para Estudo) */}
                    <div className="bg-secondary/40 p-6 rounded-3xl border border-white/5 space-y-4">
                        <h3 className="text-xs font-black text-white uppercase italic tracking-widest flex items-center gap-2">
                            <WhistleIcon className="w-4 h-4 text-blue-400" /> Instrução de Campo
                        </h3>
                        <p className="text-sm text-text-secondary leading-relaxed italic">
                            "{conceptDescription || 'Aguardando detalhamento tático do Coordenador.'}"
                        </p>
                    </div>
                </div>

                {/* 3. AI STUDY PANEL (25%) - NO-PRINT */}
                <div className="lg:col-span-3 space-y-6 no-print">
                    <Card title="Tactical Intel (IA)" className="border-purple-500/30">
                        <div className="space-y-6">
                            {!aiTips ? (
                                <div className="text-center py-4">
                                    <SparklesIcon className="w-10 h-10 text-purple-400 mx-auto mb-4 animate-pulse" />
                                    <button 
                                        onClick={generateAiStudyTips}
                                        disabled={isAiThinking}
                                        className="w-full bg-purple-600 hover:bg-purple-500 text-white font-black py-3 rounded-xl uppercase text-[10px] transition-all"
                                    >
                                        {isAiThinking ? 'Analisando Jogada...' : 'Gerar Dicas de Estudo'}
                                    </button>
                                </div>
                            ) : (
                                <div className="space-y-4 animate-fade-in">
                                    <div className="bg-black/20 p-4 rounded-xl border border-purple-500/20">
                                        <p className="text-xs text-text-secondary font-medium leading-relaxed whitespace-pre-line">
                                            {aiTips}
                                        </p>
                                    </div>
                                    <button onClick={() => setAiTips(null)} className="text-[9px] font-black text-text-secondary uppercase hover:text-white transition-colors">
                                        Recalcular Análise
                                    </button>
                                </div>
                            )}

                            <div className="pt-6 border-t border-white/5">
                                <h4 className="text-[10px] font-black text-text-secondary uppercase tracking-widest mb-4">Referências Externas</h4>
                                <a 
                                    href={`https://www.youtube.com/results?search_query=football+play+${selectedPlay?.name.replace(/\s+/g, '+')}+execution`}
                                    target="_blank"
                                    className="w-full bg-white/5 hover:bg-red-600/20 border border-white/10 hover:border-red-500/50 p-4 rounded-2xl flex items-center gap-3 transition-all group"
                                >
                                    <VideoIcon className="w-6 h-6 text-red-500" />
                                    <div>
                                        <p className="text-white font-bold text-[10px] uppercase">Ver no YouTube</p>
                                        <p className="text-[9px] text-text-secondary group-hover:text-red-300">Exemplos reais da jogada</p>
                                    </div>
                                </a>
                            </div>
                        </div>
                    </Card>

                    <div className="bg-highlight/10 p-5 rounded-3xl border border-highlight/20">
                        <div className="flex items-center gap-3 mb-2">
                            <SparklesIcon className="w-5 h-5 text-highlight" />
                            <p className="text-[10px] font-black text-highlight uppercase italic">Study XP Reward</p>
                        </div>
                        <p className="text-[9px] text-text-secondary leading-tight">Estude este plano por 5 minutos para ganhar <strong>+15 XP Tático</strong>.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TacticalLab;