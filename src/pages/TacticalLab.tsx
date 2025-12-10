
import React, { useState, useEffect, useRef, useContext } from 'react';
import Card from '../components/Card';
import { Game, PlayElement, TacticalPlay, TacticalFrame, InstallMatrixItem } from '../types';
import { storageService } from '../services/storageService';
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
    const { currentRole } = useContext(UserContext);
    const toast = useToast();
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const traceInputRef = useRef<HTMLInputElement>(null); // Ref para upload de decalque
    const [activeTab, setActiveTab] = useState<'PLAYBOOK' | 'INSTALL'>('PLAYBOOK');
    
    // Playbook State
    const [games, setGames] = useState<Game[]>([]);
    const [selectedGameId, setSelectedGameId] = useState<string>('');
    const [playName, setPlayName] = useState('');
    const [conceptDescription, setConceptDescription] = useState('');
    const [sportMode, setSportMode] = useState<'FULLPADS' | 'FLAG'>('FULLPADS');
    const [elements, setElements] = useState<PlayElement[]>([]);
    const [draggingId, setDraggingId] = useState<string | null>(null);
    const [frames, setFrames] = useState<TacticalFrame[]>([]);
    const [currentFrameIndex, setCurrentFrameIndex] = useState(-1); 
    const [isPlaying, setIsPlaying] = useState(false);
    const [simulationResult, setSimulationResult] = useState('');
    const [isSimulating, setIsSimulating] = useState(false);
    const [savedPlays, setSavedPlays] = useState<TacticalPlay[]>([]);
    
    // Import State
    const [isImporting, setIsImporting] = useState(false);

    // Tracing State
    const [traceImage, setTraceImage] = useState<HTMLImageElement | null>(null);
    const [traceOpacity, setTraceOpacity] = useState(0.5);

    // Install Matrix State
    const [installItems, setInstallItems] = useState<InstallMatrixItem[]>([]);
    const [coachContext, setCoachContext] = useState('');
    const [isGeneratingInstall, setIsGeneratingInstall] = useState(false);

    const isPlayer = currentRole === 'PLAYER';

    useEffect(() => {
        setGames(storageService.getGames());
        setSavedPlays(storageService.getTacticalPlays());
        const teamSettings = storageService.getTeamSettings();
        const initialMode = teamSettings.sportType || 'FULLPADS';
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

    // Canvas Rendering
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // 1. Background (Green)
        ctx.fillStyle = '#15803d'; 
        ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

        // 2. Trace Image (If Active)
        if (traceImage) {
            ctx.globalAlpha = traceOpacity;
            ctx.drawImage(traceImage, 0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
            ctx.globalAlpha = 1.0; // Reset alpha
        }

        // 3. Field Lines
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
        ctx.lineWidth = 2;
        const fieldWidth = CANVAS_WIDTH;
        for (let i = 50; i < CANVAS_HEIGHT; i += 50) {
            ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(fieldWidth, i); ctx.stroke();
        }
        ctx.strokeStyle = '#3b82f6'; // LOS
        ctx.beginPath(); ctx.moveTo(0, 200); ctx.lineTo(fieldWidth, 200); ctx.stroke();

        // 4. Players
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
        setTraceImage(null); // Limpa imagem de decalque também
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
        toast.success("Jogada salva na biblioteca!");
    };

    const generateWristband = () => {
        const plays = savedPlays.slice(0, 10).map(p => p.name).join('\n');
        const blob = new Blob([plays], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `Wristband_${sportMode}.txt`;
        a.click();
    };

    // --- IMPORT PLAYBOOK FROM IMAGE (AI OCR) ---
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

    // --- TRACING MODE (MANUAL DECALQUE) ---
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

    // --- SCOUT CARD GENERATOR (COACH BILL FEATURE) ---
    const handlePrintScoutCard = () => {
        if (!canvasRef.current) return;
        
        // Capture canvas image
        const dataUrl = canvasRef.current.toDataURL('image/png');
        
        const win = window.open('', '_blank');
        if (!win) return;

        win.document.write(`
            <html>
                <head>
                    <title>Scout Card - ${playName || 'Jogada'}</title>
                    <style>
                        body { font-family: Arial, sans-serif; text-align: center; padding: 20px; }
                        h1 { font-size: 48px; margin-bottom: 10px; text-transform: uppercase; }
                        h2 { font-size: 24px; color: #555; margin-bottom: 30px; }
                        .card-container { 
                            border: 4px solid black; 
                            padding: 20px; 
                            display: inline-block;
                            width: 100%;
                            max-width: 800px;
                        }
                        img { 
                            width: 100%; 
                            height: auto; 
                            filter: grayscale(100%) contrast(150%); /* High Contrast for B&W Print */
                            border: 2px solid #ccc;
                        }
                        .notes {
                            margin-top: 20px;
                            text-align: left;
                            font-size: 18px;
                            border-top: 2px dashed black;
                            padding-top: 10px;
                        }
                    </style>
                </head>
                <body>
                    <div class="card-container">
                        <h1>${playName || 'JOGADA SEM NOME'}</h1>
                        <h2>${conceptDescription || 'Conceito Tático'}</h2>
                        <img src="${dataUrl}" />
                        <div class="notes">
                            <strong>COACH NOTES:</strong>
                            <p>${simulationResult || 'Imprimir e usar no treino. Focar no alinhamento da defesa.'}</p>
                        </div>
                    </div>
                    <script>window.onload = function() { window.print(); }</script>
                </body>
            </html>
        `);
        win.document.close();
    };

    const loadPlay = (play: TacticalPlay) => {
        setElements(play.elements);
        if(play.frames) setFrames(play.frames);
        setPlayName(play.name);
        setConceptDescription(play.concept);
        setActiveTab('PLAYBOOK');
    };

    // --- INSTALL MATRIX LOGIC ---
    const handleGenerateInstall = async () => {
        if(!coachContext) return;
        setIsGeneratingInstall(true);
        const game = games.find(g => g.id === Number(selectedGameId));
        const weekInfo = game ? `Jogo contra ${game.opponent}` : 'Semana de Bye / Off-Season';
        
        const generatedItems = await generateInstallSchedule(coachContext, weekInfo);
        setInstallItems(generatedItems);
        setIsGeneratingInstall(false);
    };

    const updateMatrixItem = (day: string, category: string, val: string) => {
        // Find existing or create new
        const existingIdx = installItems.findIndex(i => i.day === day && i.category === category);
        const newItems = [...installItems];
        
        if (existingIdx >= 0) {
            newItems[existingIdx] = { ...newItems[existingIdx], concept: val };
        } else {
            newItems.push({
                id: `manual-${Date.now()}-${Math.random()}`,
                day: day as any,
                category: category as any,
                concept: val
            });
        }
        setInstallItems(newItems);
    };

    const getMatrixValue = (day: string, category: string) => {
        return installItems.find(i => i.day === day && i.category === category)?.concept || '';
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
                        <p className="text-text-secondary">{isPlayer ? 'Estudo de Playbook e Simulação.' : 'Planejamento, Design e Instalação.'}</p>
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
                            <CalendarIcon className="w-4 h-4" /> Matriz de Instalação
                        </button>
                    )}
                </div>
            </div>

            {/* === TAB: PLAYBOOK EDITOR === */}
            {activeTab === 'PLAYBOOK' && (
                <>
                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                        {/* Left: Controls */}
                        <div className="space-y-6">
                            <Card title="Configuração">
                                <div className="space-y-4">
                                    <div>
                                        <label className="text-xs font-bold text-text-secondary block mb-2">Modalidade</label>
                                        <div className="flex bg-black/20 p-1 rounded-lg border border-white/10">
                                            <button onClick={() => handleModeSwitch('FULLPADS')} className={`flex-1 py-2 text-xs font-bold rounded transition-colors ${sportMode === 'FULLPADS' ? 'bg-highlight text-white' : 'text-text-secondary hover:text-white'}`}>🏈 Full Pads</button>
                                            <button onClick={() => handleModeSwitch('FLAG')} className={`flex-1 py-2 text-xs font-bold rounded transition-colors ${sportMode === 'FLAG' ? 'bg-yellow-600 text-white' : 'text-text-secondary hover:text-white'}`}>🚩 Flag</button>
                                        </div>
                                    </div>

                                    {!isPlayer && (
                                        <>
                                            <input className="w-full bg-primary border border-tertiary rounded p-2 focus:border-highlight focus:outline-none text-white" placeholder="Nome da Jogada" value={playName} onChange={e => setPlayName(e.target.value)} />
                                            <textarea className="w-full h-24 bg-primary border border-tertiary rounded p-2 focus:border-highlight focus:outline-none text-white text-sm" placeholder="Conceito Tático..." value={conceptDescription} onChange={e => setConceptDescription(e.target.value)} />
                                            
                                            <div className="pt-4 border-t border-white/10">
                                                <h4 className="text-sm font-bold text-white mb-2">Simulação IA</h4>
                                                <select className="w-full bg-primary border border-tertiary rounded p-2 text-white mb-2 text-sm" value={selectedGameId} onChange={e => setSelectedGameId(e.target.value)}>
                                                    <option value="">Selecione Adversário...</option>
                                                    {games.filter(g => new Date(g.date) > new Date()).map(g => (
                                                        <option key={g.id} value={g.id}>vs {g.opponent}</option>
                                                    ))}
                                                </select>
                                                <button onClick={handleSimulate} disabled={isSimulating || !selectedGameId} className="w-full bg-gradient-to-r from-highlight to-cyan-500 text-white font-bold py-2 rounded flex justify-center items-center gap-2 text-sm">
                                                    {isSimulating ? 'Simulando...' : <><SparklesIcon className="w-4 h-4" /> Simular Matchup</>}
                                                </button>
                                                {simulationResult && (
                                                    <div className="mt-2 bg-secondary/50 p-2 rounded text-xs text-text-secondary max-h-32 overflow-y-auto">
                                                        {simulationResult}
                                                    </div>
                                                )}
                                            </div>
                                            <button onClick={handleSavePlay} disabled={!playName} className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded mt-2">Salvar na Biblioteca</button>
                                        </>
                                    )}
                                </div>
                            </Card>
                        </div>

                        {/* Center: Canvas */}
                        <div className="xl:col-span-2">
                            <Card className="h-full flex flex-col">
                                <div className="flex justify-between items-center mb-4 px-2">
                                    <h3 className="font-bold text-white flex items-center gap-2">Prancheta Digital <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded text-text-secondary">{sportMode === 'FULLPADS' ? '11 vs 11' : '5 vs 5'}</span></h3>
                                    <div className="flex gap-2">
                                        {!isPlayer && (
                                            <>
                                                {/* Hidden Inputs */}
                                                <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleFileChange} />
                                                <input type="file" accept="image/*" className="hidden" ref={traceInputRef} onChange={handleTraceFileChange} />
                                                
                                                <button onClick={handleTraceClick} className="bg-yellow-600/20 text-yellow-400 border border-yellow-500/50 hover:bg-yellow-600 hover:text-white px-3 py-1 rounded text-xs font-bold flex items-center gap-2 transition-colors">
                                                    <ImageIcon className="w-3 h-3"/> Decalque (Manual)
                                                </button>

                                                <button onClick={handleImportClick} disabled={isImporting} className="bg-purple-600/20 text-purple-400 border border-purple-500/50 hover:bg-purple-600 hover:text-white px-3 py-1 rounded text-xs font-bold flex items-center gap-2 transition-colors">
                                                    {isImporting ? 'Lendo...' : <><ScanIcon className="w-3 h-3"/> Importar (AI)</>}
                                                </button>
                                            </>
                                        )}
                                        {!isPlayer && <button onClick={handlePrintScoutCard} className="bg-white/10 hover:bg-white/20 text-white px-3 py-1 rounded text-xs font-bold border border-white/20 flex items-center gap-2"><EyeIcon className="w-3 h-3"/> Scout Card</button>}
                                        {!isPlayer && <button onClick={captureFrame} className="bg-white/10 hover:bg-white/20 text-white px-3 py-1 rounded text-xs font-bold border border-white/20">+ Frame ({frames.length})</button>}
                                        <button onClick={() => setIsPlaying(!isPlaying)} className={`px-3 py-1 rounded text-xs font-bold border ${isPlaying ? 'bg-red-500/20 text-red-400 border-red-500' : 'bg-green-500/20 text-green-400 border-green-500'}`}>{isPlaying ? 'Parar' : 'Play'}</button>
                                        <button onClick={clearFrames} className="text-text-secondary hover:text-white px-2 text-xs">Reset</button>
                                    </div>
                                </div>
                                <div className="flex-1 bg-black/50 rounded-lg overflow-hidden flex items-center justify-center border border-white/20 shadow-inner relative">
                                    <canvas ref={canvasRef} width={CANVAS_WIDTH} height={CANVAS_HEIGHT} onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp} onMouseLeave={handleMouseUp} className={`${isPlayer ? 'cursor-default' : 'cursor-move'} touch-none`} style={{ maxWidth: '100%', height: 'auto' }} />
                                </div>
                                {traceImage && (
                                    <div className="px-4 py-2 border-t border-white/10 flex items-center gap-4">
                                        <span className="text-xs text-text-secondary">Opacidade do Decalque:</span>
                                        <input type="range" min="0.1" max="1" step="0.1" value={traceOpacity} onChange={e => setTraceOpacity(Number(e.target.value))} className="accent-highlight w-32" />
                                        <button onClick={() => setTraceImage(null)} className="text-xs text-red-400 hover:text-white ml-auto flex items-center gap-1"><EraserIcon className="w-3 h-3"/> Limpar Imagem</button>
                                    </div>
                                )}
                            </Card>
                        </div>
                    </div>

                    <div className="flex justify-between items-center mt-8">
                        <h3 className="text-xl font-bold text-white">Biblioteca do Playbook</h3>
                        <button onClick={generateWristband} className="bg-secondary border border-white/10 hover:bg-white/10 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2">
                            <PrinterIcon className="w-4 h-4"/> Exportar Wristband (.txt)
                        </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-4">
                        {savedPlays.map(play => (
                            <div key={play.id} onClick={() => loadPlay(play)} className="bg-secondary p-4 rounded-xl border border-white/5 hover:border-highlight/30 transition-colors cursor-pointer group relative">
                                <h4 className="font-bold text-white">{play.name}</h4>
                                <p className="text-xs text-text-secondary mt-1 line-clamp-2">{play.concept}</p>
                                {play.frames && play.frames.length > 0 && <span className="absolute top-2 right-2 text-[10px] bg-green-500/20 text-green-400 px-1 rounded">Animado</span>}
                            </div>
                        ))}
                    </div>
                </>
            )}

            {/* === TAB: INSTALL MATRIX (New Feature) === */}
            {activeTab === 'INSTALL' && !isPlayer && (
                <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 animate-slide-in">
                    {/* Sidebar: AI Assistant */}
                    <div className="xl:col-span-1 space-y-6">
                        <Card title="Assistente de Planejamento (Co-Pilot)">
                            <div className="space-y-4">
                                <div className="bg-blue-900/20 p-3 rounded-lg border border-blue-500/20">
                                    <p className="text-xs text-blue-300">
                                        <strong>Como usar:</strong> Descreva sua visão para a semana. A IA organizará os conceitos no quadro. Você pode editar tudo manualmente depois.
                                    </p>
                                </div>
                                
                                <div>
                                    <label className="text-xs font-bold text-text-secondary block mb-1">Adversário da Semana</label>
                                    <select className="w-full bg-black/20 border border-white/10 rounded p-2 text-white text-sm" value={selectedGameId} onChange={e => setSelectedGameId(e.target.value)}>
                                        <option value="">Off-Season / Bye Week</option>
                                        {games.filter(g => new Date(g.date) > new Date()).map(g => (
                                            <option key={g.id} value={g.id}>vs {g.opponent}</option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label className="text-xs font-bold text-text-secondary block mb-1">Sua Visão Estratégica</label>
                                    <textarea 
                                        className="w-full h-40 bg-black/20 border border-white/10 rounded-lg p-3 text-white text-sm focus:border-highlight focus:outline-none"
                                        placeholder="Ex: Time adversário joga muito em Cover 3. Quero focar em conceitos de Flood e Smash na terça. Na quarta, instalar a blitz Double A Gap."
                                        value={coachContext}
                                        onChange={e => setCoachContext(e.target.value)}
                                    />
                                </div>

                                <button 
                                    onClick={handleGenerateInstall}
                                    disabled={isGeneratingInstall || !coachContext}
                                    className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white font-bold py-2 rounded-lg flex justify-center items-center gap-2 hover:shadow-lg disabled:opacity-50"
                                >
                                    {isGeneratingInstall ? 'Organizando...' : <><SparklesIcon className="w-4 h-4"/> Gerar Matriz Inteligente</>}
                                </button>
                            </div>
                        </Card>
                    </div>

                    {/* Main Content: The Matrix Grid */}
                    <div className="xl:col-span-3">
                        <Card title="Matriz de Instalação Semanal">
                            <div className="overflow-x-auto">
                                <table className="w-full border-collapse">
                                    <thead>
                                        <tr>
                                            <th className="p-3 border border-white/10 bg-black/40 text-left text-xs text-text-secondary w-24">CATEGORIA</th>
                                            {DAYS.map(day => (
                                                <th key={day} className="p-3 border border-white/10 bg-black/40 text-center text-xs font-bold text-white w-1/5">{day}</th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {CATEGORIES.map(cat => (
                                            <tr key={cat}>
                                                <td className="p-3 border border-white/10 bg-secondary font-bold text-xs text-highlight uppercase">{cat}</td>
                                                {DAYS.map(day => (
                                                    <td key={`${day}-${cat}`} className="border border-white/10 bg-secondary/50 p-0 relative group min-h-[80px]">
                                                        <textarea 
                                                            className="w-full h-24 bg-transparent p-2 text-xs text-white resize-none focus:bg-white/5 focus:outline-none placeholder-white/10"
                                                            placeholder="..."
                                                            value={getMatrixValue(day, cat)}
                                                            onChange={(e) => updateMatrixItem(day, cat, e.target.value)}
                                                        />
                                                        <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 pointer-events-none">
                                                            <PenIcon className="w-3 h-3 text-text-secondary" />
                                                        </div>
                                                    </td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="flex justify-end mt-4">
                                <button className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded text-sm font-bold flex items-center gap-2">
                                    <PrinterIcon className="w-4 h-4" /> Imprimir Plano
                                </button>
                            </div>
                        </Card>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TacticalLab;