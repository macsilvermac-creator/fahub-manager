
import React, { useState, useEffect, useContext, useRef } from 'react';
import Card from '../components/Card';
import { VideoClip, VideoTag, VideoPlaylist, Player } from '../types';
import { storageService } from '../services/storageService';
import { predictPlayCall } from '../services/geminiService';
import { ScissorsIcon, FilterIcon, SettingsIcon, SparklesIcon, PenIcon, EraserIcon, BrainIcon, EyeIcon, TrendingUpIcon, SearchIcon, ScanIcon, XIcon } from '../components/icons/UiIcons';
import { UserContext } from '../components/Layout';

interface VideoSource {
    id: string;
    title: string;
    url: string;
    type: 'YOUTUBE' | 'LOCAL' | 'VIMEO' | 'DRIVE';
}

const VideoAnalysis: React.FC = () => {
    const { currentRole } = useContext(UserContext);
    const [activeTab, setActiveTab] = useState<'CUTTER' | 'LIBRARY' | 'REPORTS'>('CUTTER');
    
    // Refs
    const localVideoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    
    // States
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [videoSources, setVideoSources] = useState<VideoSource[]>([
        { id: 'g1', title: 'Gladiators Highlight (Demo)', url: 'https://www.youtube.com/watch?v=2vjPBrBU-TM', type: 'YOUTUBE' }, 
    ]);
    const [selectedGame, setSelectedGame] = useState(videoSources[0].id);
    const [clips, setClips] = useState<VideoClip[]>([]);
    
    // Tagging
    const [tagData, setTagData] = useState<VideoTag>({
        down: 1, distance: 10, yardLine: 20, hash: 'MIDDLE',
        offensiveFormation: '', defensiveFormation: '',
        offensivePlayCall: '', defensivePlayCall: '',
        personnel: '', result: 'GAIN', gain: 0,
        involvedPlayerIds: [], startX: 50, startY: 50
    });
    const [clipTitle, setClipTitle] = useState('');
    const [startCut, setStartCut] = useState(0);
    const [endCut, setEndCut] = useState(0);

    // AI & Filter
    const [prediction, setPrediction] = useState<{prediction: string, confidence: string, reason: string} | null>(null);
    const [isPredicting, setIsPredicting] = useState(false);
    const [naturalSearch, setNaturalSearch] = useState('');
    const [filteredClips, setFilteredClips] = useState<VideoClip[]>([]);

    // Telestration
    const [isDrawing, setIsDrawing] = useState(false);
    const [drawColor, setDrawColor] = useState('#ffff00');
    const [drawingActive, setDrawingActive] = useState(false);

    useEffect(() => {
        setClips(storageService.getClips());
    }, []);

    useEffect(() => {
        if (!naturalSearch) {
            setFilteredClips(clips);
            return;
        }
        const query = naturalSearch.toLowerCase();
        const res = clips.filter(c => 
            c.title.toLowerCase().includes(query) || 
            c.tags.offensivePlayCall.toLowerCase().includes(query) ||
            c.tags.result.toLowerCase().includes(query)
        );
        setFilteredClips(res);
    }, [naturalSearch, clips]);

    const handlePredictPlay = async () => {
        setIsPredicting(true);
        const result = await predictPlayCall(clips, tagData.down, tagData.distance);
        setPrediction(result);
        setIsPredicting(false);
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

    // --- TELESTRATION ---
    const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!isDrawing) return;
        setDrawingActive(true);
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!canvas || !ctx) return;
        const rect = canvas.getBoundingClientRect();
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
        <div className="flex flex-col h-[calc(100vh-2rem)] animate-fade-in overflow-hidden">
             {/* Header Fixo - Não sobrepõe o conteúdo */}
             <div className="flex-shrink-0 mb-4 bg-primary z-10">
                 <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-3">
                        <div className="p-3 bg-secondary rounded-xl shadow-glow">
                            <EyeIcon className="text-highlight w-8 h-8" />
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold text-text-primary">Vision Core</h2>
                            <p className="text-text-secondary">Análise de Vídeo & Inteligência Tática.</p>
                        </div>
                    </div>
                </div>

                <div className="flex border-b border-white/10 overflow-x-auto">
                    <button onClick={() => setActiveTab('CUTTER')} className={`px-6 py-3 font-bold border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'CUTTER' ? 'border-highlight text-highlight' : 'border-transparent text-text-secondary'}`}>
                        <ScissorsIcon className="w-4 h-4"/> Editor (Cutter)
                    </button>
                    <button onClick={() => setActiveTab('LIBRARY')} className={`px-6 py-3 font-bold border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'LIBRARY' ? 'border-highlight text-highlight' : 'border-transparent text-text-secondary'}`}>
                        <FilterIcon className="w-4 h-4"/> Biblioteca
                    </button>
                    <button onClick={() => setActiveTab('REPORTS')} className={`px-6 py-3 font-bold border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'REPORTS' ? 'border-highlight text-highlight' : 'border-transparent text-text-secondary'}`}>
                        <TrendingUpIcon className="w-4 h-4"/> Stats
                    </button>
                </div>
            </div>

            {/* Content Area - Scroll Interno */}
            <div className="flex-1 overflow-y-auto min-h-0 custom-scrollbar pr-2">
                {activeTab === 'CUTTER' && (
                    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 h-full">
                        {/* Video Player Container */}
                        <div ref={containerRef} className={`xl:col-span-2 flex flex-col gap-4 ${isFullscreen ? 'fixed inset-0 z-50 bg-black p-4 h-screen w-screen' : ''}`}>
                            <div className="relative flex-1 bg-black rounded-xl overflow-hidden shadow-2xl border border-white/10 group flex items-center justify-center">
                                <canvas 
                                    ref={canvasRef}
                                    width={1280} height={720}
                                    className={`absolute inset-0 z-30 w-full h-full object-contain ${isDrawing ? 'cursor-crosshair pointer-events-auto' : 'pointer-events-none'}`}
                                    onMouseDown={startDrawing} onMouseMove={draw} onMouseUp={stopDrawing} onMouseLeave={stopDrawing}
                                />
                                {activeVideo?.type === 'LOCAL' ? (
                                    <video ref={localVideoRef} src={activeVideo.url} controls={!isDrawing} className="w-full h-full object-contain" />
                                ) : (
                                    <iframe className={`w-full h-full ${isDrawing ? 'pointer-events-none' : ''}`} src={getEmbedUrl(activeVideo?.url || '')} title="Player" frameBorder="0" allowFullScreen></iframe>
                                )}
                                
                                {/* Fullscreen Controls Overlay */}
                                <div className="absolute top-4 right-4 z-40 flex gap-2">
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

                            {/* Tagger Bar (Visible in Fullscreen at bottom) */}
                            {isFullscreen && (
                                <div className="absolute bottom-0 left-0 w-full bg-black/90 border-t border-white/10 p-4 flex items-center justify-between z-50">
                                    <div className="flex gap-4">
                                        <div className="flex gap-2">
                                            {['GAIN','LOSS','TD'].map(r => (
                                                <button key={r} onClick={() => setTagData({...tagData, result: r as any})} className="px-4 py-2 bg-white/10 rounded font-bold text-white hover:bg-highlight hover:text-white transition-colors text-sm">{r}</button>
                                            ))}
                                        </div>
                                        <div className="flex items-center gap-2 text-white">
                                            <span className="text-xs font-bold uppercase">Down:</span>
                                            <input className="w-12 bg-white/10 border border-white/20 rounded p-1 text-center font-bold" value={tagData.down} onChange={e => setTagData({...tagData, down: Number(e.target.value) as any})} />
                                        </div>
                                    </div>
                                    <button onClick={handleSaveClip} className="bg-green-600 px-6 py-2 rounded-lg font-bold text-white shadow-glow hover:bg-green-500">Salvar Clip Rápido</button>
                                </div>
                            )}

                            {/* Standard Controls (When not fullscreen) */}
                            {!isFullscreen && (
                                <div className="flex justify-between items-center bg-secondary/50 p-2 rounded-lg border border-white/5">
                                    <div className="flex gap-2 items-center">
                                        <span className="text-xs text-text-secondary uppercase">Recorte (Seg):</span>
                                        <input type="number" className="w-16 bg-black/20 border border-white/10 rounded p-1 text-white text-xs" value={startCut} onChange={e => setStartCut(Number(e.target.value))} placeholder="Início" />
                                        <span className="text-white">-</span>
                                        <input type="number" className="w-16 bg-black/20 border border-white/10 rounded p-1 text-white text-xs" value={endCut} onChange={e => setEndCut(Number(e.target.value))} placeholder="Fim" />
                                    </div>
                                    <div className="text-xs text-text-secondary">
                                        Use a caneta para desenhar na tela.
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Right: Predictive Tagging Form */}
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

                            <div className="space-y-3">
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
                            </div>
                        </div>
                    </div>
                )}

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
                                                    {clip.title}
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
        </div>
    );
};

export default VideoAnalysis;