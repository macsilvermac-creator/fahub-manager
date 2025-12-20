
import React, { useState, useEffect, useRef, useContext } from 'react';
import Card from '../components/Card';
/* Fix: Ensuring correct type imports */
import { Game, PlayElement, TacticalPlay, TacticalFrame, InstallMatrixItem } from '../types';
import { storageService } from '../services/storageService';
/* Fix: Updated imported functions */
import { analyzePlayMatchup, generateInstallSchedule, importPlaybookFromImage } from '../services/geminiService';
import { SparklesIcon, TrashIcon, PrinterIcon, CalendarIcon, PenIcon, EyeIcon, ScanIcon, ImageIcon, EraserIcon } from '../components/icons/UiIcons';
import { WhistleIcon } from '../components/icons/NavIcons';
import { UserContext } from '../components/Layout';
import { useToast } from '../contexts/ToastContext';

const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 400;

const DAYS = ['TUE', 'WED', 'THU', 'FRI', 'SAT'];
const CATEGORIES = ['RUN', 'PASS', 'DEFENSE', 'SITUATION'];

const TacticalLab: React.FC = () => {
    const { currentRole } = useContext(UserContext) as any;
    const toast = useToast();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const traceInputRef = useRef<HTMLInputElement>(null); 
    const [activeTab, setActiveTab] = useState<'PLAYBOOK' | 'INSTALL'>('PLAYBOOK');
    
    const [games, setGames] = useState<Game[]>([]);
    const [selectedGameId, setSelectedGameId] = useState<string>('');
    const [playName, setPlayName] = useState('');
    const [conceptDescription, setConceptDescription] = useState('');
    const [sportMode, setSportMode] = useState<'FLAG' | 'FULLPADS'>('FULLPADS');
    const [elements, setElements] = useState<PlayElement[]>([]);
    const [draggingId, setDraggingId] = useState<string | null>(null);
    const [frames, setFrames] = useState<TacticalFrame[]>([]);
    const [currentFrameIndex, setCurrentFrameIndex] = useState(-1); 
    const [isPlaying, setIsPlaying] = useState(false);
    const [simulationResult, setSimulationResult] = useState('');
    const [isSimulating, setIsSimulating] = useState(false);
    const [savedPlays, setSavedPlays] = useState<TacticalPlay[]>([]);
    const [isImporting, setIsImporting] = useState(false);
    const [traceImage, setTraceImage] = useState<HTMLImageElement | null>(null);
    const [traceOpacity, setTraceOpacity] = useState(0.5);
    const [installItems, setInstallItems] = useState<InstallMatrixItem[]>([]);
    const [coachContext, setCoachContext] = useState('');
    const [isGeneratingInstall, setIsGeneratingInstall] = useState(false);

    const isPlayer = currentRole === 'PLAYER';

    useEffect(() => {
        setGames(storageService.getGames());
        setSavedPlays(storageService.getTacticalPlays());
        const teamSettings = storageService.getTeamSettings();
        /* Fix: Correct mapping for sportMode */
        const initialMode: 'FLAG' | 'FULLPADS' = teamSettings.sportType === 'FLAG' ? 'FLAG' : 'FULLPADS';
        setSportMode(initialMode);
        resetTokens(initialMode);
    }, []);

    const resetTokens = (mode: 'FULLPADS' | 'FLAG') => {
        if (mode === 'FLAG') {
            setElements([
                { id: 'c', type: 'OFFENSE', label: 'C', x: 300, y: 200 },
                { id: 'qb', type: 'OFFENSE', label: 'QB', x: 300, y: 230 },
                { id: 'wr1', type: 'OFFENSE', label: 'WR', x: 100, y: 200 },
                { id: 'wr2', type: 'OFFENSE', label: 'WR', x: 500, y: 200 },
                { id: 'wr3', type: 'OFFENSE', label: 'WR', x: 200, y: 210 },
                { id: 'rusher', type: 'DEFENSE', label: 'R', x: 300, y: 150 },
                { id: 'lb', type: 'DEFENSE', label: 'LB', x: 300, y: 120 },
                { id: 'cb1', type: 'DEFENSE', label: 'CB', x: 100, y: 150 },
                { id: 'cb2', type: 'DEFENSE', label: 'CB', x: 500, y: 150 },
                { id: 's', type: 'DEFENSE', label: 'S', x: 300, y: 80 },
            ]);
        } else {
            setElements([
                { id: 'c', type: 'OFFENSE', label: 'C', x: 300, y: 200 },
                { id: 'lg', type: 'OFFENSE', label: 'LG', x: 270, y: 200 },
                { id: 'rg', type: 'OFFENSE', label: 'RG', x: 330, y: 200 },
                { id: 'lt', type: 'OFFENSE', label: 'LT', x: 240, y: 200 },
                { id: 'rt', type: 'OFFENSE', label: 'RT', x: 360, y: 200 },
                { id: 'qb', type: 'OFFENSE', label: 'QB', x: 300, y: 230 },
                { id: 'rb', type: 'OFFENSE', label: 'RB', x: 300, y: 260 },
                { id: 'te', type: 'OFFENSE', label: 'TE', x: 390, y: 200 },
                { id: 'wr1', type: 'OFFENSE', label: 'WR', x: 100, y: 200 },
                { id: 'wr2', type: 'OFFENSE', label: 'WR', x: 500, y: 200 },
                { id: 'wr3', type: 'OFFENSE', label: 'WR', x: 150, y: 210 },
                { id: 'de1', type: 'DEFENSE', label: 'DE', x: 220, y: 180 },
                { id: 'de2', type: 'DEFENSE', label: 'DE', x: 380, y: 180 },
                { id: 'dt1', type: 'DEFENSE', label: 'DT', x: 280, y: 180 },
                { id: 'dt2', type: 'DEFENSE', label: 'DT', x: 320, y: 180 },
                { id: 'lb1', type: 'DEFENSE', label: 'LB', x: 250, y: 150 },
                { id: 'lb2', type: 'DEFENSE', label: 'LB', x: 350, y: 150 },
                { id: 'lb3', type: 'DEFENSE', label: 'LB', x: 300, y: 150 },
                { id: 'cb1', type: 'DEFENSE', label: 'CB', x: 100, y: 160 },
                { id: 'cb2', type: 'DEFENSE', label: 'CB', x: 500, y: 160 },
                { id: 'fs', type: 'DEFENSE', label: 'S', x: 260, y: 100 },
                { id: 'ss', type: 'DEFENSE', label: 'S', x: 340, y: 100 },
            ]);
        }
    };

    const handleModeSwitch = (mode: 'FULLPADS' | 'FLAG') => {
        setSportMode(mode);
        resetTokens(mode);
        setFrames([]); 
    };

    useEffect(() => {
        let interval: ReturnType<typeof setInterval>;
        if (isPlaying && frames.length > 0) {
            interval = setInterval(() => {
                setCurrentFrameIndex(prev => {
                    const next = prev + 1;
                    if (next >= frames.length) return 0; 
                    return next;
                });
            }, 800); 
        }
        return () => clearInterval(interval);
    }, [isPlaying, frames]);

    useEffect(() => {
        if (currentFrameIndex >= 0 && frames[currentFrameIndex]) {
            setElements(frames[currentFrameIndex].elements);
        }
    }, [currentFrameIndex, frames]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.fillStyle = '#15803d'; 
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        if (traceImage) {
            ctx.globalAlpha = traceOpacity;
            ctx.drawImage(traceImage, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
            ctx.globalAlpha = 1.0; 
        }

        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 2;
        const fieldWidth = CANVAS_WIDTH;
        for (let i = 50; i < CANVAS_HEIGHT; i += 50) {
            ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(fieldWidth, i); ctx.stroke();
        }
        ctx.strokeStyle = '#3b82f6'; // LOS
        ctx.beginPath(); ctx.moveTo(0, 200); ctx.lineTo(fieldWidth, 200); ctx.stroke();

        elements.forEach(el => {
            ctx.beginPath();
            ctx.arc(el.x, el.y, 10, 0, 2 * Math.PI);
            ctx.fillStyle = el.type === 'OFFENSE' ? '#3b82f6' : '#ef4444';
            ctx.fill();
            ctx.strokeStyle = '#fff';
            ctx.stroke();
            ctx.fillStyle = '#fff';
            ctx.font = '10px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(el.label, el.x, el.y - 12);
        });

    }, [elements, sportMode, activeTab, traceImage, traceOpacity]);

    const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (isPlaying || currentFrameIndex !== -1 || isPlayer) return; 
        const rect = canvasRef.current?.getBoundingClientRect();
        if (!rect) return;
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const clicked = elements.find(el => Math.hypot(el.x - x, el.y - y) < 15);
        if (clicked) setDraggingId(clicked.id);
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!draggingId) return;
        const rect = canvasRef.current?.getBoundingClientRect();
        if (!rect) return;
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        setElements(prev => prev.map(el => el.id === draggingId ? { ...el, x, y } : el));
    };

    const handleMouseUp = () => setDraggingId(null);

    const captureFrame = () => {
        const newFrame: TacticalFrame = {
            id: frames.length,
            elements: JSON.parse(JSON.stringify(elements))
        };
        setFrames([...frames, newFrame]);
    };

    const clearFrames = () => {
        setFrames([]);
        setCurrentFrameIndex(-1);
        setIsPlaying(false);
        resetTokens(sportMode); 
        setTraceImage(null); 
    };

    const handleSimulate = async () => {
        if (!selectedGameId || !conceptDescription) return;
        const game = games.find(g => g.id === Number(selectedGameId));
        if (!game || !game.scoutingReport) return;

        setIsSimulating(true);
        const result = await analyzePlayMatchup(conceptDescription, game.scoutingReport, game.opponent);
        setSimulationResult(result);
        setIsSimulating(false);
    };

    const handleSavePlay = () => {
        const newPlay: TacticalPlay = {
            id: Date.now().toString(),
            name: playName || 'Sem Nome',
            concept: conceptDescription,
            elements: elements,
            frames: frames,
            routes: [],
            aiAnalysis: simulationResult,
            createdAt: new Date()
        };
        const updated = [newPlay, ...savedPlays];
        setSavedPlays(updated);
        storageService.saveTacticalPlays(updated);
        setPlayName('');
        toast.success("Jogada salva!");
    };

    const loadPlay = (play: TacticalPlay) => {
        setElements(play.elements);
        if(play.frames) setFrames(play.frames);
        setPlayName(play.name);
        setConceptDescription(play.concept);
        setActiveTab('PLAYBOOK');
    };

    const handleImportClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setIsImporting(true);
            toast.info("Processando imagem com IA Vision...");

            try {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = async () => {
                    const base64 = reader.result as string;
                    const detectedElements = await importPlaybookFromImage(base64);
                    
                    if (detectedElements.length > 0) {
                        setElements(detectedElements);
                        toast.success(`Sucesso! ${detectedElements.length} jogadores identificados.`);
                    } else {
                        toast.error("IA não identificou jogadores. Tente uma imagem mais clara.");
                    }
                    setIsImporting(false);
                };
            } catch (err) {
                toast.error("Erro ao importar.");
                setIsImporting(false);
            }
        }
    };

    const handleTraceClick = () => {
        traceInputRef.current?.click();
    };

    const handleTraceFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target?.result as string;
                img.onload = () => {
                    setTraceImage(img);
                    toast.success("Modo Decalque Ativo! Desenhe sobre a imagem.");
                };
            };
        }
    };

    const handlePrintScoutCard = () => {
        if (!canvasRef.current) return;
        const dataUrl = canvasRef.current.toDataURL('image/png');
        const win = window.open('', '_blank');
        if (!win) return;

        win.document.write(`
            <html><head><title>Scout Card</title></head><body style="text-align:center;">
                <h1>${playName || 'PLAY'}</h1>
                <img src="${dataUrl}" style="border:1px solid #000;"/>
                <script>window.onload=function(){window.print();}</script>
            </body></html>
        `);
        win.document.close();
    };

    return (
        <div className="space-y-6 pb-12 animate-fade-in">
             <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-secondary rounded-xl">
                        <WhistleIcon className="text-highlight w-8 h-8" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold text-text-primary">Laboratório Tático</h2>
                        <p className="text-text-secondary">{isPlayer ? 'Estudo de Playbook.' : 'Planejamento e Design.'}</p>
                    </div>
                </div>
                
                <div className="flex bg-secondary p-1 rounded-xl border border-white/10">
                    <button 
                        onClick={() => setActiveTab('PLAYBOOK')}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'PLAYBOOK' ? 'bg-highlight text-white' : 'text-text-secondary hover:text-white'}`}
                    >
                        Prancheta Digital
                    </button>
                    {!isPlayer && (
                        <button 
                            onClick={() => setActiveTab('INSTALL')}
                            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${activeTab === 'INSTALL' ? 'bg-blue-600 text-white' : 'text-text-secondary hover:text-white'}`}
                        >
                            <CalendarIcon className="w-4 h-4" /> Matriz
                        </button>
                    )}
                </div>
            </div>

            {activeTab === 'PLAYBOOK' && (
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                    <Card title="Configuração">
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-bold text-text-secondary block mb-2">Modalidade</label>
                                <div className="flex bg-black/20 p-1 rounded-lg">
                                    <button onClick={() => handleModeSwitch('FULLPADS')} className={`flex-1 py-2 text-xs font-bold rounded ${sportMode === 'FULLPADS' ? 'bg-highlight text-white' : 'text-text-secondary'}`}>Tackle</button>
                                    <button onClick={() => handleModeSwitch('FLAG')} className={`flex-1 py-2 text-xs font-bold rounded ${sportMode === 'FLAG' ? 'bg-highlight text-white' : 'text-text-secondary'}`}>Flag</button>
                                </div>
                            </div>
                            <input className="w-full bg-primary border border-tertiary rounded p-2 text-white" placeholder="Nome" value={playName} onChange={e => setPlayName(e.target.value)} />
                            
                            <div className="flex flex-col gap-2">
                                <button onClick={handleSavePlay} className="w-full bg-green-600 text-white py-2 rounded font-bold">Salvar</button>
                                <button onClick={handleImportClick} className="w-full bg-purple-600/20 text-purple-400 border border-purple-500/50 py-2 rounded text-xs font-bold flex items-center justify-center gap-2">
                                    <ScanIcon className="w-3 h-3"/> Importar (AI)
                                </button>
                                <button onClick={handleTraceClick} className="w-full bg-yellow-600/20 text-yellow-400 border border-yellow-500/50 py-2 rounded text-xs font-bold flex items-center justify-center gap-2">
                                    <ImageIcon className="w-3 h-3"/> Decalque
                                </button>
                                <button onClick={handlePrintScoutCard} className="w-full bg-white/10 py-2 rounded text-xs font-bold text-white border border-white/10 flex items-center justify-center gap-2">
                                    <EyeIcon className="w-3 h-3"/> Scout Card
                                </button>
                            </div>
                            
                            <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleFileChange} />
                            <input type="file" accept="image/*" className="hidden" ref={traceInputRef} onChange={handleTraceFileChange} />
                        </div>
                    </Card>
                    <div className="xl:col-span-2">
                        <Card className="flex flex-col items-center">
                            <canvas ref={canvasRef} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp} className="border border-white/10 cursor-move" />
                            <div className="flex gap-2 mt-4">
                                <button onClick={captureFrame} className="bg-white/10 px-4 py-1 rounded text-xs">+ Frame</button>
                                <button onClick={() => setIsPlaying(!isPlaying)} className="bg-highlight px-4 py-1 rounded text-xs">{isPlaying ? 'Stop' : 'Play'}</button>
                                <button onClick={clearFrames} className="text-xs text-text-secondary">Reset</button>
                            </div>
                            {traceImage && (
                                <div className="mt-4 w-full flex items-center gap-4 px-4">
                                    <span className="text-xs text-text-secondary">Opacidade:</span>
                                    <input type="range" min="0.1" max="1" step="0.1" value={traceOpacity} onChange={e => setTraceOpacity(Number(e.target.value))} className="accent-highlight w-32" />
                                    <button onClick={() => setTraceImage(null)} className="text-xs text-red-400 hover:text-white ml-auto flex items-center gap-1"><EraserIcon className="w-3 h-3"/> Limpar</button>
                                </div>
                            )}
                        </Card>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TacticalLab;
