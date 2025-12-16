
import React, { useState, useEffect, useContext, useRef } from 'react';
import Card from '../components/Card';
import { VideoClip, VideoTag, VideoPlaylist, VideoPermissionGroup, UserRole, Player } from '../types';
import { storageService } from '../services/storageService';
import { predictPlayCall } from '../services/geminiService';
import { VideoIcon } from '../components/icons/NavIcons';
import { ScissorsIcon, FilterIcon, PlayCircleIcon, SettingsIcon, CheckCircleIcon, TrashIcon, SparklesIcon, AlertCircleIcon, LocationIcon, PenIcon, EraserIcon, BrainIcon, EyeIcon, TrendingUpIcon, SearchIcon, ScanIcon, XIcon } from '../components/icons/UiIcons';
import { UserContext } from '../components/Layout';
import Modal from '../components/Modal';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ScatterChart, Scatter, ZAxis } from 'recharts';
import LazyImage from '../components/LazyImage';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

interface VideoSource {
    id: string;
    title: string;
    url: string;
    type: 'YOUTUBE' | 'LOCAL' | 'VIMEO' | 'DRIVE';
}

const VideoAnalysis: React.FC = () => {
    const { currentRole } = useContext(UserContext);
    const [activeTab, setActiveTab] = useState<'CUTTER' | 'LIBRARY' | 'PLAYLISTS' | 'REPORTS'>('CUTTER');
    
    // Refs for Local Player & Canvas
    const localVideoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    
    const [taggingMode, setTaggingMode] = useState<'FULLPADS' | 'FLAG'>('FULLPADS');
    const [isFullscreen, setIsFullscreen] = useState(false);

    // Video Sources
    const [videoSources, setVideoSources] = useState<VideoSource[]>([
        { id: 'g1', title: 'Gladiators Highlight (Demo)', url: 'https://www.youtube.com/watch?v=2vjPBrBU-TM', type: 'YOUTUBE' }, 
    ]);
    const [selectedGame, setSelectedGame] = useState(videoSources[0].id);
    
    // Data State
    const [clips, setClips] = useState<VideoClip[]>([]);
    const [playlists, setPlaylists] = useState<VideoPlaylist[]>([]);
    const [players, setPlayers] = useState<Player[]>([]);
    
    // Cutter State
    const [startCut, setStartCut] = useState(0);
    const [endCut, setEndCut] = useState(0);
    
    // Tagging Form
    const [tagData, setTagData] = useState<VideoTag>({
        down: 1, distance: 10, yardLine: 20, hash: 'MIDDLE',
        offensiveFormation: '', defensiveFormation: '',
        offensivePlayCall: '', defensivePlayCall: '',
        personnel: '', result: 'GAIN', gain: 0,
        involvedPlayerIds: [], startX: 50, startY: 50
    });
    const [clipTitle, setClipTitle] = useState('');

    // AI Prediction State
    const [prediction, setPrediction] = useState<{prediction: string, confidence: string, reason: string} | null>(null);
    const [isPredicting, setIsPredicting] = useState(false);

    // Smart Filter
    const [naturalSearch, setNaturalSearch] = useState('');
    const [filteredClips, setFilteredClips] = useState<VideoClip[]>([]);

    // Telestration
    const [isDrawing, setIsDrawing] = useState(false);
    const [drawColor, setDrawColor] = useState('#ffff00');
    const [drawingActive, setDrawingActive] = useState(false);

    const isPlayer = currentRole === 'PLAYER';

    useEffect(() => {
        setClips(storageService.getClips());
        setPlaylists(storageService.getPlaylists());
        setPlayers(storageService.getPlayers());
        const teamSettings = storageService.getTeamSettings();
        if(teamSettings.sportType) setTaggingMode(teamSettings.sportType);
    }, []);

    // Smart Filtering Logic (Natural Language Approximation)
    useEffect(() => {
        if (!naturalSearch) {
            setFilteredClips(clips);
            return;
        }
        const query = naturalSearch.toLowerCase();
        const res = clips.filter(c => 
            c.title.toLowerCase().includes(query) || 
            c.tags.offensivePlayCall.toLowerCase().includes(query) ||
            c.tags.result.toLowerCase().includes(query) ||
            (query.includes('passe') && c.tags.offensivePlayCall.toLowerCase().includes('pass')) ||
            (query.includes('corrida') && c.tags.offensivePlayCall.toLowerCase().includes('run')) ||
            (query.includes('touchdown') && c.tags.result === 'TOUCHDOWN')
        );
        setFilteredClips(res);
    }, [naturalSearch, clips]);

    // AI Prediction Handler
    const handlePredictPlay = async () => {
        setIsPredicting(true);
        const result = await predictPlayCall(clips, tagData.down, tagData.distance);
        setPrediction(result);
        setIsPredicting(false);
    };

    // --- TELESTRATION ---
    const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!isDrawing) return;
        setDrawingActive(true);
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!canvas || !ctx) return;
        const rect = canvas.getBoundingClientRect();
        
        // Adjust for scaling
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;

        ctx.beginPath();
        ctx.moveTo((e.clientX - rect.left) * scaleX, (e.clientY - rect.top) * scaleY);
        ctx.strokeStyle = drawColor;
        ctx.lineWidth = 4;
        ctx.lineCap = 'round';
    };

    const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!drawingActive || !isDrawing) return;
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!canvas || !ctx) return;
        const rect = canvas.getBoundingClientRect();
        
        const scaleX = canvas.width / rect.width;
        const scaleY = canvas.height / rect.height;

        ctx.lineTo((e.clientX - rect.left) * scaleX, (e.clientY - rect.top) * scaleY);
        ctx.stroke();
    };

    const stopDrawing = () => setDrawingActive(false);
    const clearCanvas = () => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        ctx?.clearRect(0, 0, canvas?.width || 0, canvas?.height || 0);
    };

    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
            containerRef.current?.requestFullscreen().catch(err => {
                console.error(`Error attempting to enable fullscreen: ${err.message}`);
            });
            setIsFullscreen(true);
        } else {
            document.exitFullscreen();
            setIsFullscreen(false);
        }
    };

    // --- HELPERS ---
    const getEmbedUrl = (url: string) => {
        if (!url) return '';
        const ytMatch = url.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
        if (ytMatch && ytMatch[1]) return `https://www.youtube.com/embed/${ytMatch[1]}?rel=0&modestbranding=1`;
        return url;
    };

    const activeVideo = videoSources.find(v => v.id === selectedGame);

    const handleSaveClip = () => {
        if (!clipTitle) { alert("Dê um nome ao clip."); return; }
        const newClip: VideoClip = {
            id: `clip-${Date.now()}`,
            gameId: selectedGame,
            title: clipTitle,
            videoUrl: activeVideo?.url || '',
            startTime: startCut,
            endTime: endCut || startCut + 10,
            tags: { ...tagData }
        };
        const updated = [...clips, newClip];
        setClips(updated);
        storageService.saveClips(updated);
        setClipTitle('');
        alert("Clip salvo!");
    };

    return (
        <div className="space-y-6 pb-12 animate-fade-in">
             {/* Header */}
             <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-secondary rounded-xl shadow-glow">
                        <EyeIcon className="text-highlight w-8 h-8" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold text-text-primary">Vision Core</h2>
                        <p className="text-text-secondary">Análise de Vídeo Preditiva & Inteligência Tática.</p>
                    </div>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-white/10 overflow-x-auto">
                <button onClick={() => setActiveTab('CUTTER')} className={`px-6 py-3 font-bold border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'CUTTER' ? 'border-highlight text-highlight' : 'border-transparent text-text-secondary'}`}>
                    <ScissorsIcon className="w-4 h-4"/> Editor (Cutter)
                </button>
                <button onClick={() => setActiveTab('LIBRARY')} className={`px-6 py-3 font-bold border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'LIBRARY' ? 'border-highlight text-highlight' : 'border-transparent text-text-secondary'}`}>
                    <FilterIcon className="w-4 h-4"/> Biblioteca Inteligente
                </button>
                <button onClick={() => setActiveTab('REPORTS')} className={`px-6 py-3 font-bold border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'REPORTS' ? 'border-highlight text-highlight' : 'border-transparent text-text-secondary'}`}>
                    <TrendingUpIcon className="w-4 h-4"/> Stats
                </button>
            </div>

            {/* --- CUTTER MODE --- */}
            {activeTab === 'CUTTER' && (
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                    {/* Left: Video Player Container */}
                    <div ref={containerRef} className={`xl:col-span-2 flex flex-col gap-4 ${isFullscreen ? 'fixed inset-0 z-50 bg-black p-4 h-screen w-screen' : ''}`}>
                        <div className="relative flex-1 bg-black rounded-xl overflow-hidden shadow-2xl border border-white/10 group flex items-center justify-center min-h-[400px]">
                            <canvas 
                                ref={canvasRef}
                                width={1280} height={720}
                                className={`absolute inset-0 z-20 w-full h-full object-contain ${isDrawing ? 'cursor-crosshair pointer-events-auto' : 'pointer-events-none'}`}
                                onMouseDown={startDrawing} onMouseMove={draw} onMouseUp={stopDrawing} onMouseLeave={stopDrawing}
                            />
                            {activeVideo?.type === 'LOCAL' ? (
                                <video ref={localVideoRef} src={activeVideo.url} controls={!isDrawing} className="w-full h-full object-contain" />
                            ) : (
                                <iframe className={`w-full h-full ${isDrawing ? 'pointer-events-none' : ''}`} src={getEmbedUrl(activeVideo?.url || '')} title="Player" frameBorder="0" allowFullScreen></iframe>
                            )}
                            
                            {/* Fullscreen Controls Overlay */}
                            <div className="absolute top-4 right-4 z-30 flex gap-2">
                                <button onClick={() => setIsDrawing(!isDrawing)} className={`p-2 rounded-full backdrop-blur-md border border-white/20 ${isDrawing ? 'bg-highlight text-white' : 'bg-black/50 text-white hover:bg-white/20'}`} title="Desenhar">
                                    <PenIcon className="w-5 h-5"/>
                                </button>
                                {isDrawing && (
                                    <button onClick={clearCanvas} className="p-2 rounded-full bg-red-600/80 text-white backdrop-blur-md border border-white/20 hover:bg-red-600" title="Limpar Desenho">
                                        <EraserIcon className="w-5 h-5"/>
                                    </button>
                                )}
                                <button onClick={toggleFullscreen} className="p-2 rounded-full bg-black/50 text-white backdrop-blur-md border border-white/20 hover:bg-white/20" title={isFullscreen ? "Sair da Tela Cheia" : "Tela Cheia"}>
                                    {isFullscreen ? <XIcon className="w-5 h-5"/> : <ScanIcon className="w-5 h-5"/>}
                                </button>
                            </div>
                        </div>

                        {/* Interactive Timeline (Visible only in non-fullscreen or bottom overlay) */}
                        {!isFullscreen && (
                            <div className="bg-secondary/50 h-16 rounded-lg border border-white/10 flex items-center px-4 relative overflow-hidden">
                                <div className="absolute inset-y-0 left-0 w-full flex items-center">
                                    <div className="h-1 bg-white/20 w-full relative">
                                        {clips.filter(c => c.gameId === selectedGame).map(clip => (
                                            <div 
                                                key={clip.id}
                                                className={`absolute h-3 w-3 rounded-full top-1/2 transform -translate-y-1/2 cursor-pointer hover:scale-150 transition-transform ${clip.tags.result === 'TOUCHDOWN' ? 'bg-green-500' : clip.tags.result === 'TURNOVER' ? 'bg-red-500' : 'bg-blue-500'}`}
                                                style={{ left: `${Math.min(clip.startTime / 60, 100)}%` }} 
                                                title={`${clip.title} (${clip.tags.result})`}
                                            ></div>
                                        ))}
                                    </div>
                                </div>
                                <span className="text-xs text-text-secondary absolute bottom-1 right-2">Timeline de Eventos</span>
                            </div>
                        )}

                        {!isFullscreen && (
                            <div className="flex justify-between items-center bg-secondary/50 p-2 rounded-lg border border-white/5">
                                <div className="flex gap-2 items-center">
                                    <span className="text-xs text-text-secondary uppercase">Recorte (Seg):</span>
                                    <input type="number" className="w-16 bg-black/20 border border-white/10 rounded p-1 text-white text-xs" value={startCut} onChange={e => setStartCut(Number(e.target.value))} placeholder="Início" />
                                    <span className="text-white">-</span>
                                    <input type="number" className="w-16 bg-black/20 border border-white/10 rounded p-1 text-white text-xs" value={endCut} onChange={e => setEndCut(Number(e.target.value))} placeholder="Fim" />
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right: Tagging & AI */}
                    <div className="bg-secondary rounded-xl border border-white/5 p-5 flex flex-col h-full overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-white flex items-center gap-2"><BrainIcon className="w-5 h-5 text-highlight"/> AI Logger</h3>
                            <button onClick={handleSaveClip} className="bg-green-600 hover:bg-green-500 text-white px-4 py-1.5 rounded-lg text-xs font-bold shadow-lg">Salvar Clip</button>
                        </div>

                        {/* Prediction Widget */}
                        <div className="bg-gradient-to-br from-indigo-900/40 to-black p-4 rounded-xl border border-indigo-500/30 mb-4 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-2 opacity-20"><SparklesIcon className="w-12 h-12 text-indigo-400"/></div>
                            <h4 className="text-xs font-bold text-indigo-300 uppercase mb-2">Previsão Tática</h4>
                            <div className="flex gap-2 mb-2">
                                <input className="w-16 bg-black/40 border border-indigo-500/30 rounded p-1 text-white text-xs text-center" value={tagData.down} onChange={e => setTagData({...tagData, down: Number(e.target.value) as any})} placeholder="Down" />
                                <span className="text-white text-xs flex items-center">&</span>
                                <input className="w-16 bg-black/40 border border-indigo-500/30 rounded p-1 text-white text-xs text-center" value={tagData.distance} onChange={e => setTagData({...tagData, distance: Number(e.target.value)})} placeholder="Dist" />
                                <button onClick={handlePredictPlay} className="ml-auto bg-indigo-600 hover:bg-indigo-500 text-white p-1.5 rounded text-xs">
                                    {isPredicting ? '...' : 'Prever'}
                                </button>
                            </div>
                            {prediction && (
                                <div className="text-xs animate-fade-in">
                                    <p className="text-white font-bold">{prediction.prediction} <span className="text-green-400">({prediction.confidence})</span></p>
                                    <p className="text-text-secondary mt-1 leading-tight">{prediction.reason}</p>
                                </div>
                            )}
                        </div>

                        {/* Standard Fields */}
                        <div className="space-y-3 flex-1">
                            <input className="w-full bg-black/20 border border-white/10 rounded p-2 text-white text-sm" placeholder="Nome do Clip (Ex: TD Pass)" value={clipTitle} onChange={e => setClipTitle(e.target.value)} />
                            
                            <div className="grid grid-cols-2 gap-2">
                                <div>
                                    <label className="text-[10px] text-text-secondary uppercase">Formação</label>
                                    <input className="w-full bg-black/20 border border-white/10 rounded p-2 text-white text-xs" value={tagData.offensiveFormation} onChange={e => setTagData({...tagData, offensiveFormation: e.target.value})} placeholder="Ex: Trips Right" />
                                </div>
                                <div>
                                    <label className="text-[10px] text-text-secondary uppercase">Jogada</label>
                                    <input className="w-full bg-black/20 border border-white/10 rounded p-2 text-white text-xs" value={tagData.offensivePlayCall} onChange={e => setTagData({...tagData, offensivePlayCall: e.target.value})} placeholder="Ex: Mesh" />
                                </div>
                            </div>

                            <div>
                                <label className="text-[10px] text-text-secondary uppercase block mb-1">Resultado</label>
                                <div className="flex gap-1 flex-wrap">
                                    {['GAIN','LOSS','TOUCHDOWN','TURNOVER'].map(r => (
                                        <button key={r} onClick={() => setTagData({...tagData, result: r as any})} className={`px-2 py-1 rounded text-[10px] font-bold border transition-colors ${tagData.result === r ? 'bg-white text-black border-white' : 'bg-transparent text-text-secondary border-white/10'}`}>{r}</button>
                                    ))}
                                </div>
                            </div>

                            {/* Mini Field for Spot */}
                            <div className="border border-white/10 rounded h-32 bg-green-900/50 relative cursor-crosshair" onClick={(e) => {
                                const rect = e.currentTarget.getBoundingClientRect();
                                setTagData({...tagData, startX: ((e.clientX - rect.left)/rect.width)*100, startY: ((e.clientY - rect.top)/rect.height)*100});
                            }}>
                                {/* Yard lines simulation */}
                                <div className="absolute top-0 bottom-0 left-[10%] w-px bg-white/10"></div>
                                <div className="absolute top-0 bottom-0 left-[20%] w-px bg-white/10"></div>
                                <div className="absolute top-0 bottom-0 left-[30%] w-px bg-white/10"></div>
                                <div className="absolute top-0 bottom-0 left-[40%] w-px bg-white/10"></div>
                                <div className="absolute top-0 bottom-0 left-[50%] w-px bg-white/30"></div>
                                <div className="absolute top-0 bottom-0 left-[60%] w-px bg-white/10"></div>
                                <div className="absolute top-0 bottom-0 left-[70%] w-px bg-white/10"></div>
                                <div className="absolute top-0 bottom-0 left-[80%] w-px bg-white/10"></div>
                                <div className="absolute top-0 bottom-0 left-[90%] w-px bg-white/10"></div>
                                
                                {tagData.startX && <div className="absolute w-3 h-3 bg-red-500 rounded-full transform -translate-x-1/2 -translate-y-1/2 shadow border border-white" style={{left: `${tagData.startX}%`, top: `${tagData.startY}%`}}></div>}
                                <span className="absolute bottom-1 right-1 text-[9px] text-white/50">Clique para marcar ponto da bola</span>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* --- LIBRARY MODE --- */}
            {activeTab === 'LIBRARY' && (
                <div className="space-y-6">
                    <Card title="Biblioteca Inteligente">
                        <div className="relative mb-6">
                            <SearchIcon className="absolute left-4 top-3.5 w-5 h-5 text-text-secondary" />
                            <input 
                                className="w-full bg-black/30 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white focus:border-highlight focus:outline-none"
                                placeholder="Busca Natural: 'Mostre todos os passes completos na Redzone'..."
                                value={naturalSearch}
                                onChange={e => setNaturalSearch(e.target.value)}
                            />
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left text-text-secondary">
                                <thead className="bg-black/20 uppercase text-xs font-bold">
                                    <tr>
                                        <th className="px-4 py-3">Jogada</th>
                                        <th className="px-4 py-3">Descida</th>
                                        <th className="px-4 py-3">Formação</th>
                                        <th className="px-4 py-3">Chamada</th>
                                        <th className="px-4 py-3">Resultado</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredClips.map(clip => (
                                        <tr key={clip.id} className="border-b border-white/5 hover:bg-white/5 group cursor-pointer">
                                            <td className="px-4 py-3 font-bold text-white group-hover:text-highlight flex items-center gap-2">
                                                <PlayCircleIcon className="w-4 h-4" /> {clip.title}
                                            </td>
                                            <td className="px-4 py-3">{clip.tags.down}ª & {clip.tags.distance}</td>
                                            <td className="px-4 py-3 font-mono text-xs">{clip.tags.offensiveFormation || '-'}</td>
                                            <td className="px-4 py-3">{clip.tags.offensivePlayCall || '-'}</td>
                                            <td className="px-4 py-3">
                                                <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${clip.tags.result === 'TOUCHDOWN' ? 'bg-green-500 text-black' : 'bg-white/10 text-white'}`}>{clip.tags.result}</span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );
};

export default VideoAnalysis;