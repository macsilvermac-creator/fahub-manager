
import React, { useState, useEffect, useContext, useRef } from 'react';
import Card from '../components/Card';
import { VideoClip, VideoTag, VideoPlaylist, VideoPermissionGroup, UserRole, Player } from '../types';
import { storageService } from '../services/storageService';
import { VideoIcon } from '../components/icons/NavIcons';
import { ScissorsIcon, FilterIcon, PlayCircleIcon, SettingsIcon, CheckCircleIcon, TrashIcon, SparklesIcon, AlertCircleIcon, LocationIcon, PenIcon, EraserIcon } from '../components/icons/UiIcons';
import { UserContext } from '../components/Layout';
import Modal from '../components/Modal';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ScatterChart, Scatter, ZAxis } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

interface VideoSource {
    id: string;
    title: string;
    url: string;
    type: 'YOUTUBE' | 'LOCAL' | 'VIMEO' | 'DRIVE';
}

const VideoAnalysis: React.FC = () => {
    const { currentRole } = useContext(UserContext);
    const [activeTab, setActiveTab] = useState<'CUTTER' | 'LIBRARY' | 'PLAYLISTS' | 'REPORTS' | 'PERMISSIONS'>('CUTTER');
    
    // Refs for Local Player & Canvas
    const localVideoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    
    // Sport Mode State (Local preference for this session)
    const [taggingMode, setTaggingMode] = useState<'FULLPADS' | 'FLAG'>('FULLPADS');

    // Video Sources State
    const [videoSources, setVideoSources] = useState<VideoSource[]>([
        { id: 'g1', title: 'Gladiators Highlight (Demo)', url: 'https://www.youtube.com/watch?v=2vjPBrBU-TM', type: 'YOUTUBE' }, 
        { id: 'g2', title: 'NFL Analysis', url: 'https://www.youtube.com/watch?v=YoohOn4s5aY', type: 'YOUTUBE' }, 
    ]);
    const [selectedGame, setSelectedGame] = useState(videoSources[0].id);
    
    // Add Video Modal State
    const [isAddingVideo, setIsAddingVideo] = useState(false);
    const [addVideoTab, setAddVideoTab] = useState<'LINK' | 'FILE'>('LINK');
    const [newVideoUrl, setNewVideoUrl] = useState('');
    const [newVideoTitle, setNewVideoTitle] = useState('');
    const [localFile, setLocalFile] = useState<File | null>(null);

    // Data State
    const [clips, setClips] = useState<VideoClip[]>([]);
    const [playlists, setPlaylists] = useState<VideoPlaylist[]>([]);
    const [permissions, setPermissions] = useState<VideoPermissionGroup[]>([]);
    const [players, setPlayers] = useState<Player[]>([]);
    
    // Cutter State
    const [currentTime, setCurrentTime] = useState(0);
    const [startCut, setStartCut] = useState(0);
    const [endCut, setEndCut] = useState(0);
    
    // Tagging Form State
    const [tagData, setTagData] = useState<VideoTag>({
        down: 1, distance: 10, yardLine: 20, hash: 'MIDDLE',
        offensiveFormation: '', defensiveFormation: '',
        offensivePlayCall: '', defensivePlayCall: '',
        personnel: '', result: 'GAIN', gain: 0,
        involvedPlayerIds: [],
        startX: 50, startY: 50 // Default center
    });
    const [clipTitle, setClipTitle] = useState('');

    // Filter State
    const [filterDown, setFilterDown] = useState<string>('ALL');
    const [filterDistance, setFilterDistance] = useState('');
    const [filteredClips, setFilteredClips] = useState<VideoClip[]>([]);

    // Playlist Creation State
    const [playlistModalOpen, setPlaylistModalOpen] = useState(false);
    const [newPlaylistTitle, setNewPlaylistTitle] = useState('');
    const [selectedClipsForPlaylist, setSelectedClipsForPlaylist] = useState<string[]>([]);

    // AI Report State
    const [aiReport, setAiReport] = useState('');
    const [isGeneratingReport, setIsGeneratingReport] = useState(false);

    // Telestration State
    const [isDrawing, setIsDrawing] = useState(false);
    const [drawColor, setDrawColor] = useState('#ffff00'); // Yellow default
    const [drawingActive, setDrawingActive] = useState(false);

    const isPlayer = currentRole === 'PLAYER';

    useEffect(() => {
        setClips(storageService.getClips());
        setPlaylists(storageService.getPlaylists());
        setPermissions(storageService.getPermissions());
        setPlayers(storageService.getPlayers());
        
        // Initialize tagging mode based on team settings, but allow override
        const teamSettings = storageService.getTeamSettings();
        if(teamSettings.sportType) setTaggingMode(teamSettings.sportType);

        if (isPlayer) {
            setActiveTab('LIBRARY'); // Players default to viewing
        }
    }, [isPlayer]);

    useEffect(() => {
        // Simple filter logic
        let res = clips;
        if (filterDown !== 'ALL') res = res.filter(c => c.tags.down === Number(filterDown));
        if (filterDistance) res = res.filter(c => c.tags.distance >= Number(filterDistance));
        setFilteredClips(res);
    }, [clips, filterDown, filterDistance]);

    // Telestration Logic
    const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!isDrawing) return;
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!canvas || !ctx) return;

        setDrawingActive(true);
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.strokeStyle = drawColor;
        ctx.lineWidth = 3;
        ctx.lineCap = 'round';
    };

    const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!drawingActive || !isDrawing) return;
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!canvas || !ctx) return;

        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        ctx.lineTo(x, y);
        ctx.stroke();
    };

    const stopDrawing = () => {
        setDrawingActive(false);
    };

    const clearCanvas = () => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!canvas || !ctx) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    };

    // --- HANDLERS ---

    const handleAddVideoSource = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (addVideoTab === 'LINK') {
            if (!newVideoTitle || !newVideoUrl) return;
            const newSource: VideoSource = { 
                id: `g-${Date.now()}`, 
                title: newVideoTitle, 
                url: newVideoUrl, 
                type: 'YOUTUBE' // Will be refined by getEmbedUrl
            };
            setVideoSources([...videoSources, newSource]);
            setSelectedGame(newSource.id);
        } else {
            // Local File
            if (!newVideoTitle || !localFile) return;
            const objectUrl = URL.createObjectURL(localFile);
            const newSource: VideoSource = { 
                id: `local-${Date.now()}`, 
                title: newVideoTitle, 
                url: objectUrl, 
                type: 'LOCAL' 
            };
            setVideoSources([...videoSources, newSource]);
            setSelectedGame(newSource.id);
        }

        setIsAddingVideo(false);
        setNewVideoTitle(''); setNewVideoUrl(''); setLocalFile(null);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setLocalFile(e.target.files[0]);
            if (!newVideoTitle) setNewVideoTitle(e.target.files[0].name);
        }
    };

    const togglePlayerInvolvement = (playerId: number) => {
        const current = tagData.involvedPlayerIds || [];
        if (current.includes(playerId)) setTagData({ ...tagData, involvedPlayerIds: current.filter(id => id !== playerId) });
        else setTagData({ ...tagData, involvedPlayerIds: [...current, playerId] });
    };

    const handleFieldClick = (e: React.MouseEvent<HTMLDivElement>) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        setTagData({ ...tagData, startX: x, startY: y });
    };

    const captureCurrentTime = () => {
        // If Local Video
        if (activeVideo?.type === 'LOCAL' && localVideoRef.current) {
            const time = Math.floor(localVideoRef.current.currentTime);
            setStartCut(time);
            setEndCut(time + 10); // Auto set end 10s later
        } else {
            alert("Para vídeos do YouTube, insira o tempo manualmente ou use a estimativa visual.");
        }
    };

    const handleSaveClip = () => {
        if (!clipTitle) { alert("Dê um nome ao clip."); return; }
        const newClip: VideoClip = {
            id: `clip-${Date.now()}`,
            gameId: selectedGame,
            title: clipTitle,
            videoUrl: videoSources.find(g => g.id === selectedGame)?.url || '',
            startTime: startCut,
            endTime: endCut || startCut + 10,
            tags: { ...tagData }
        };
        const updated = [...clips, newClip];
        setClips(updated);
        storageService.saveClips(updated);
        setClipTitle('');
        setTagData({ ...tagData, offensivePlayCall: '', defensivePlayCall: '', gain: 0, involvedPlayerIds: [], startX: 50, startY: 50 });
        alert("Clip salvo e tagueado com sucesso!");
    };

    const handleCreatePlaylist = () => {
        if (!newPlaylistTitle) return;
        const clipsToAdd = clips.filter(c => selectedClipsForPlaylist.includes(c.id));
        const newPlaylist: VideoPlaylist = {
            id: `pl-${Date.now()}`, title: newPlaylistTitle, description: `Gerada automaticamente.`, clips: clipsToAdd, assignedToGroups: [], createdBy: currentRole
        };
        const updated = [...playlists, newPlaylist];
        setPlaylists(updated);
        storageService.savePlaylists(updated);
        setPlaylistModalOpen(false); setNewPlaylistTitle(''); setSelectedClipsForPlaylist([]);
    };

    const toggleClipSelection = (id: string) => {
        if (selectedClipsForPlaylist.includes(id)) setSelectedClipsForPlaylist(prev => prev.filter(cid => cid !== id));
        else setSelectedClipsForPlaylist(prev => [...prev, id]);
    };

    // Analytics (Keep existing calculations)
    const getPlayDistribution = () => {
        const dist: Record<string, number> = {};
        clips.forEach(c => {
            const type = c.tags.offensivePlayCall?.includes('Pass') ? 'Passe' : 'Corrida';
            dist[type] = (dist[type] || 0) + 1;
        });
        return Object.keys(dist).map(key => ({ name: key, value: dist[key] }));
    };
    const getDownEfficiency = () => {
        const downs = [1, 2, 3, 4];
        return downs.map(d => {
            const downClips = clips.filter(c => c.tags.down === d);
            const success = downClips.filter(c => c.tags.result === 'FIRST_DOWN' || c.tags.result === 'TOUCHDOWN' || c.tags.gain > 5).length;
            return { name: `${d}ª`, total: downClips.length, sucesso: success };
        });
    };
    const getTargetShare = () => {
        const counts: Record<number, number> = {};
        clips.forEach(clip => {
            if (clip.tags.involvedPlayerIds) {
                clip.tags.involvedPlayerIds.forEach(pid => { counts[pid] = (counts[pid] || 0) + 1; });
            }
        });
        return Object.keys(counts).map(pid => {
            const player = players.find(p => p.id === Number(pid));
            return { name: player ? `#${player.jerseyNumber}` : `ID:${pid}`, fullName: player?.name, value: counts[Number(pid)] };
        }).sort((a,b) => b.value - a.value).slice(0, 5);
    };

    const getSpatialData = () => {
        return clips.map(c => ({
            x: c.tags.startX || 50,
            y: 100 - (c.tags.startY || 50), // Invert Y for chart
            z: 1, // Size
            result: c.tags.result
        }));
    };

    // --- ROBUST YOUTUBE/VIMEO/DRIVE PARSING ---
    const getEmbedUrl = (url: string) => {
        if (!url) return '';
        
        // YouTube (Standard, Short, Embed)
        const ytRegExp = /(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/;
        const ytMatch = url.match(ytRegExp);
        if (ytMatch && ytMatch[1]) {
            const videoId = ytMatch[1];
            const origin = window.location.origin;
            return `https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1&origin=${origin}`;
        } 
        
        // Google Drive
        const driveRegExp = /drive\.google\.com\/file\/d\/([a-zA-Z0-9_-]+)/;
        const driveMatch = url.match(driveRegExp);
        if (driveMatch && driveMatch[1]) {
            return `https://drive.google.com/file/d/${driveMatch[1]}/preview`;
        }

        // Vimeo
        const vimeoRegExp = /vimeo\.com\/([0-9]+)/;
        const vimeoMatch = url.match(vimeoRegExp);
        if (vimeoMatch && vimeoMatch[1]) {
            return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
        }

        return url;
    };

    const activeVideo = videoSources.find(v => v.id === selectedGame);

    const handleGenerateAiReport = async () => {
        setIsGeneratingReport(true);
        // Simulate Service Call
        setTimeout(() => {
            const report = `
            ## Relatório Tático - Pós Jogo (Gerado por IA)
            
            **Resumo Ofensivo:**
            A equipe teve um desempenho sólido nas jogadas de passe, representando **${getPlayDistribution().find(d=>d.name==='Passe')?.value || 0} jogadas**. A eficiência em 3ª descida foi um ponto de destaque.
            
            **Destaques Individuais:**
            O atleta **Michael "Tank"** foi o alvo principal em momentos críticos.
            
            **Sugestões para Próximo Treino:**
            Focar em proteção de passe contra blitz e rotas curtas para 2ª descida longa.
            `;
            setAiReport(report);
            setIsGeneratingReport(false);
        }, 1500);
    };

    return (
        <div className="space-y-6 pb-12 animate-fade-in">
             <div className="flex items-center gap-3">
                <div className="p-3 bg-secondary rounded-xl">
                    <VideoIcon className="text-highlight w-8 h-8" />
                </div>
                <div>
                    <h2 className="text-3xl font-bold text-text-primary">Pro Video Suite</h2>
                    <p className="text-text-secondary">Cortes, Tagging Avançado e Analytics de Jogo.</p>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-white/10 overflow-x-auto">
                {!isPlayer && (
                    <button 
                        onClick={() => setActiveTab('CUTTER')} 
                        className={`px-6 py-3 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${activeTab === 'CUTTER' ? 'border-highlight text-highlight' : 'border-transparent text-text-secondary'}`}
                    >
                        Editor & Tagging
                    </button>
                )}
                <button 
                    onClick={() => setActiveTab('LIBRARY')} 
                    className={`px-6 py-3 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${activeTab === 'LIBRARY' ? 'border-highlight text-highlight' : 'border-transparent text-text-secondary'}`}
                >
                    Biblioteca
                </button>
                <button 
                    onClick={() => setActiveTab('PLAYLISTS')} 
                    className={`px-6 py-3 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${activeTab === 'PLAYLISTS' ? 'border-highlight text-highlight' : 'border-transparent text-text-secondary'}`}
                >
                    Playlists
                </button>
                {!isPlayer && (
                    <button 
                        onClick={() => setActiveTab('REPORTS')} 
                        className={`px-6 py-3 text-sm font-bold border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${activeTab === 'REPORTS' ? 'border-highlight text-highlight' : 'border-transparent text-text-secondary'}`}
                    >
                        Stats & AI
                    </button>
                )}
            </div>

            {/* --- TAB: CUTTER (EDITOR) --- */}
            {activeTab === 'CUTTER' && !isPlayer && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-4">
                        {/* Source Selection Header */}
                        <div className="flex gap-2">
                            <select className="flex-1 bg-secondary border border-white/10 rounded-lg p-2 text-white text-sm" value={selectedGame} onChange={(e) => setSelectedGame(e.target.value)}>
                                {videoSources.map(v => <option key={v.id} value={v.id}>{v.type === 'LOCAL' ? '📁 ' : '📺 '} {v.title}</option>)}
                            </select>
                            <button onClick={() => setIsAddingVideo(true)} className="bg-highlight hover:bg-highlight-hover text-white px-4 py-2 rounded-lg font-bold text-xs whitespace-nowrap">+ Novo Vídeo</button>
                        </div>

                        {/* Hybrid Player (YouTube or Local) with Telestration Overlay */}
                        <div className="relative aspect-video rounded-xl overflow-hidden group shadow-2xl bg-black">
                            {/* Telestration Canvas Layer */}
                            <canvas 
                                ref={canvasRef}
                                width={800}
                                height={450}
                                className={`absolute inset-0 z-20 w-full h-full pointer-events-auto ${isDrawing ? 'cursor-crosshair' : 'pointer-events-none'}`}
                                onMouseDown={startDrawing}
                                onMouseMove={draw}
                                onMouseUp={stopDrawing}
                                onMouseLeave={stopDrawing}
                            />

                            {/* Video Player */}
                            <div className="relative z-10 w-full h-full">
                                {activeVideo ? (
                                    activeVideo.type === 'LOCAL' ? (
                                        <video 
                                            ref={localVideoRef}
                                            src={activeVideo.url} 
                                            controls={!isDrawing} // Hide controls when drawing
                                            className="w-full h-full object-contain"
                                        >
                                            Seu navegador não suporta vídeos.
                                        </video>
                                    ) : (
                                        <iframe 
                                            width="100%" height="100%" 
                                            src={getEmbedUrl(activeVideo.url)} 
                                            title={activeVideo.title}
                                            frameBorder="0"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                            allowFullScreen
                                            className={isDrawing ? "pointer-events-none" : ""} // Disable iframe interaction when drawing
                                        ></iframe>
                                    )
                                ) : (
                                    <div className="flex items-center justify-center h-full text-text-secondary">Selecione um vídeo</div>
                                )}
                            </div>
                        </div>
                        
                        {/* Telestration Controls */}
                        <div className="flex items-center gap-2 bg-black/40 p-2 rounded-lg border border-white/10">
                            <button 
                                onClick={() => setIsDrawing(!isDrawing)} 
                                className={`p-2 rounded ${isDrawing ? 'bg-highlight text-white' : 'text-text-secondary hover:text-white'}`}
                                title={isDrawing ? "Modo Vídeo" : "Modo Desenho"}
                            >
                                <PenIcon className="w-5 h-5" />
                            </button>
                            
                            {isDrawing && (
                                <>
                                    <div className="h-6 w-px bg-white/10 mx-1"></div>
                                    <button onClick={() => setDrawColor('#ffff00')} className={`w-5 h-5 rounded-full bg-yellow-400 border-2 ${drawColor === '#ffff00' ? 'border-white' : 'border-transparent'}`}></button>
                                    <button onClick={() => setDrawColor('#ff0000')} className={`w-5 h-5 rounded-full bg-red-600 border-2 ${drawColor === '#ff0000' ? 'border-white' : 'border-transparent'}`}></button>
                                    <button onClick={() => setDrawColor('#ffffff')} className={`w-5 h-5 rounded-full bg-white border-2 ${drawColor === '#ffffff' ? 'border-gray-400' : 'border-transparent'}`}></button>
                                    <div className="h-6 w-px bg-white/10 mx-1"></div>
                                    <button onClick={clearCanvas} className="text-text-secondary hover:text-red-400 text-xs font-bold flex items-center gap-1">
                                        <EraserIcon className="w-4 h-4" /> Limpar
                                    </button>
                                </>
                            )}
                            
                            {!isDrawing && (
                                <span className="text-xs text-text-secondary ml-auto">Ative o modo desenho para anotar sobre o vídeo (pause antes).</span>
                            )}
                        </div>
                        
                        {/* Timeline Controls */}
                        <div className="bg-secondary p-4 rounded-xl border border-white/5">
                            <div className="flex justify-between mb-2">
                                <h4 className="text-xs font-bold text-text-secondary uppercase">Controle de Corte</h4>
                                <button onClick={captureCurrentTime} className="text-xs text-highlight font-bold flex items-center gap-1 hover:text-white border border-highlight px-2 py-1 rounded hover:bg-highlight/10">
                                    <ScissorsIcon className="w-3 h-3"/> Marcar Tempo Atual {activeVideo?.type === 'LOCAL' && '(Auto)'}
                                </button>
                            </div>
                            <div className="flex gap-4 items-center">
                                <div className="flex flex-col">
                                    <label className="text-[10px] text-text-secondary uppercase">Início (s)</label>
                                    <input type="number" className="w-20 bg-black/20 border border-white/10 rounded p-1 text-white text-sm" value={startCut} onChange={e => setStartCut(Number(e.target.value))} />
                                </div>
                                <div className="flex-1 bg-white/5 h-2 rounded relative mt-4"><div className="absolute top-0 bottom-0 bg-highlight" style={{ left: `${Math.min(startCut, 100)}%`, width: '10%' }}></div></div>
                                <div className="flex flex-col">
                                    <label className="text-[10px] text-text-secondary uppercase">Fim (s)</label>
                                    <input type="number" className="w-20 bg-black/20 border border-white/10 rounded p-1 text-white text-sm" value={endCut} onChange={e => setEndCut(Number(e.target.value))} />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tagging Panel */}
                    <div className="bg-secondary rounded-xl border border-white/5 p-5 h-full overflow-y-auto max-h-[800px] custom-scrollbar">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-white flex items-center gap-2"><FilterIcon className="w-4 h-4 text-highlight"/> Dados da Jogada</h3>
                            
                            {/* SPORT MODE SWITCHER FOR TAGGING */}
                            <div className="flex bg-black/30 rounded p-0.5">
                                <button 
                                    onClick={() => setTaggingMode('FULLPADS')} 
                                    className={`px-2 py-1 text-[10px] font-bold rounded ${taggingMode === 'FULLPADS' ? 'bg-highlight text-white' : 'text-text-secondary hover:text-white'}`}
                                >
                                    11v11
                                </button>
                                <button 
                                    onClick={() => setTaggingMode('FLAG')} 
                                    className={`px-2 py-1 text-[10px] font-bold rounded ${taggingMode === 'FLAG' ? 'bg-yellow-600 text-white' : 'text-text-secondary hover:text-white'}`}
                                >
                                    Flag 5v5
                                </button>
                            </div>
                        </div>
                        
                        <div className="space-y-4">
                            
                            {/* SPATIAL TAGGING (WYCOUT STYLE) */}
                            <div className="border border-white/10 rounded-lg p-2 bg-black/20">
                                <label className="text-xs font-bold text-text-secondary block mb-2 flex items-center gap-1">
                                    <LocationIcon className="w-3 h-3" /> Mapa de Evento (Clique no campo)
                                </label>
                                <div 
                                    className="relative w-full aspect-[1.8] bg-green-800 rounded cursor-crosshair overflow-hidden border border-white/20"
                                    onClick={handleFieldClick}
                                >
                                    {/* Field Markings */}
                                    <div className="absolute inset-0 flex flex-col justify-between p-2 opacity-30">
                                        <div className="border-t border-white h-full w-full flex justify-between">
                                            {[...Array(10)].map((_, i) => <div key={i} className="h-full border-r border-white/50"></div>)}
                                        </div>
                                    </div>
                                    <div className="absolute top-1/2 left-0 right-0 h-px bg-white/30"></div>
                                    
                                    {/* The Clicked Point */}
                                    {tagData.startX && tagData.startY && (
                                        <div 
                                            className="absolute w-3 h-3 bg-red-500 rounded-full border border-white shadow-lg transform -translate-x-1/2 -translate-y-1/2 transition-all duration-200"
                                            style={{ left: `${tagData.startX}%`, top: `${tagData.startY}%` }}
                                        ></div>
                                    )}
                                </div>
                                <p className="text-[10px] text-text-secondary text-center mt-1">
                                    X: {tagData.startX?.toFixed(0)}% Y: {tagData.startY?.toFixed(0)}%
                                </p>
                            </div>

                            <div>
                                <label className="text-xs font-bold text-text-secondary block mb-1">Título do Clip</label>
                                <input className="w-full bg-black/20 border border-white/10 rounded p-2 text-white" value={clipTitle} onChange={e => setClipTitle(e.target.value)} placeholder="Ex: TD Pass Deep Right" />
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-xs font-bold text-text-secondary block mb-1">Descida (Down)</label>
                                    <select className="w-full bg-black/20 border border-white/10 rounded p-2 text-white" value={tagData.down} onChange={e => setTagData({...tagData, down: Number(e.target.value) as any})}>
                                        {[1,2,3,4].map(d => <option key={d} value={d}>{d}ª Descida</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-text-secondary block mb-1">Jardas</label>
                                    <input type="number" className="w-full bg-black/20 border border-white/10 rounded p-2 text-white" value={tagData.distance} onChange={e => setTagData({...tagData, distance: Number(e.target.value)})} />
                                </div>
                            </div>

                            {/* Personnel Dropdown - Dynamic based on Sport Mode */}
                            <div>
                                <label className="text-xs font-bold text-text-secondary block mb-1">Pessoal (Personnel)</label>
                                <select className="w-full bg-black/20 border border-white/10 rounded p-2 text-white" value={tagData.personnel} onChange={e => setTagData({...tagData, personnel: e.target.value})}>
                                    <option value="">Selecione...</option>
                                    {taggingMode === 'FULLPADS' ? (
                                        <>
                                            <option value="11">11 (1 RB, 1 TE, 3 WR)</option>
                                            <option value="12">12 (1 RB, 2 TE, 2 WR)</option>
                                            <option value="21">21 (2 RB, 1 TE, 2 WR)</option>
                                            <option value="10">10 (1 RB, 0 TE, 4 WR)</option>
                                            <option value="00">Empty Backfield</option>
                                        </>
                                    ) : (
                                        <>
                                            <option value="3WR">Spread (3 WR, 1 C, 1 QB)</option>
                                            <option value="BUNCH">Bunch (3 WR Cluster)</option>
                                            <option value="STACK">Stack (WRs Stacked)</option>
                                            <option value="2RB">Power (2 RBs)</option>
                                        </>
                                    )}
                                </select>
                            </div>

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-xs font-bold text-text-secondary block mb-1">Chamada Ataque</label>
                                    <input className="w-full bg-black/20 border border-white/10 rounded p-2 text-white" value={tagData.offensivePlayCall} onChange={e => setTagData({...tagData, offensivePlayCall: e.target.value})} />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-text-secondary block mb-1">Chamada Defesa</label>
                                    <input className="w-full bg-black/20 border border-white/10 rounded p-2 text-white" value={tagData.defensivePlayCall} onChange={e => setTagData({...tagData, defensivePlayCall: e.target.value})} />
                                </div>
                            </div>

                             <div>
                                <label className="text-xs font-bold text-text-secondary block mb-1">Resultado</label>
                                <select className="w-full bg-black/20 border border-white/10 rounded p-2 text-white" value={tagData.result} onChange={e => setTagData({...tagData, result: e.target.value as any})}>
                                    <option value="GAIN">Ganho de Jardas</option>
                                    <option value="FIRST_DOWN">First Down</option>
                                    <option value="TOUCHDOWN">Touchdown</option>
                                    <option value="LOSS">Perda de Jardas/Sack</option>
                                    <option value="TURNOVER">Interceptação/Fumble</option>
                                    <option value="INCOMPLETE">Passe Incompleto</option>
                                </select>
                            </div>

                            {/* Player Involvement */}
                            <div className="pt-2 border-t border-white/5">
                                <label className="text-xs font-bold text-text-secondary block mb-2">Jogadores Envolvidos</label>
                                <div className="max-h-32 overflow-y-auto bg-black/20 rounded border border-white/10 p-2 space-y-1">
                                    {players.map(p => (
                                        <div key={p.id} className="flex items-center gap-2 hover:bg-white/5 p-1 rounded cursor-pointer" onClick={() => togglePlayerInvolvement(p.id)}>
                                            <input type="checkbox" checked={tagData.involvedPlayerIds?.includes(p.id)} onChange={() => {}} className="accent-highlight pointer-events-none" />
                                            <span className="text-xs text-white">{p.name}</span>
                                            <span className="text-[10px] text-text-secondary ml-auto">{p.position} #{p.jerseyNumber}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <button onClick={handleSaveClip} className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 rounded-lg shadow-lg mt-4">Salvar Clip Tagueado</button>
                        </div>
                    </div>
                </div>
            )}

            {/* --- TAB: LIBRARY (FILTERS) --- */}
            {activeTab === 'LIBRARY' && (
                <div className="space-y-6">
                    <Card title="Filtragem Inteligente">
                        <div className="flex flex-wrap gap-4 items-end">
                            <div>
                                <label className="text-xs font-bold text-text-secondary block mb-1">Descida</label>
                                <select className="bg-black/20 border border-white/10 rounded p-2 text-white w-32" value={filterDown} onChange={e => setFilterDown(e.target.value)}>
                                    <option value="ALL">Todas</option>
                                    <option value="1">1ª</option>
                                    <option value="2">2ª</option>
                                    <option value="3">3ª</option>
                                    <option value="4">4ª</option>
                                </select>
                            </div>
                            <div className="flex-1 text-right"><p className="text-sm text-text-secondary">{filteredClips.length} clips encontrados</p></div>
                        </div>
                    </Card>
                    <div className="bg-secondary rounded-xl border border-white/5 overflow-hidden">
                        <div className="p-4 bg-black/20 border-b border-white/5 flex justify-between items-center">
                            <h3 className="font-bold text-white">Clips</h3>
                            {selectedClipsForPlaylist.length > 0 && !isPlayer && (
                                <button onClick={() => setPlaylistModalOpen(true)} className="bg-highlight hover:bg-highlight-hover text-white px-4 py-1.5 rounded text-sm font-bold">Criar Playlist ({selectedClipsForPlaylist.length})</button>
                            )}
                        </div>
                        <table className="w-full text-sm text-left text-text-secondary">
                            <thead className="text-xs uppercase bg-black/20 text-text-secondary">
                                <tr>
                                    {!isPlayer && <th className="px-4 py-3 w-10"><input type="checkbox" className="accent-highlight" /></th>}
                                    <th className="px-4 py-3">Jogada</th>
                                    <th className="px-4 py-3">Situação</th>
                                    <th className="px-4 py-3">Resultado</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredClips.map(clip => (
                                    <tr key={clip.id} className="border-b border-white/5 hover:bg-white/5">
                                        {!isPlayer && <td className="px-4 py-3"><input type="checkbox" className="accent-highlight" checked={selectedClipsForPlaylist.includes(clip.id)} onChange={() => toggleClipSelection(clip.id)} /></td>}
                                        <td className="px-4 py-3 font-bold text-white">{clip.title}</td>
                                        <td className="px-4 py-3"><span className="bg-white/10 px-2 py-0.5 rounded text-xs text-white">{clip.tags.down}ª & {clip.tags.distance}</span></td>
                                        <td className="px-4 py-3"><span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${clip.tags.result === 'TOUCHDOWN' ? 'bg-green-500 text-black' : 'bg-white/10 text-white'}`}>{clip.tags.result}</span></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* --- TAB: REPORTS & STATS (THE WOW FACTOR) --- */}
            {activeTab === 'REPORTS' && !isPlayer && (
                <div className="space-y-6 animate-fade-in">
                    
                    {/* WYSCOUT STYLE HEATMAP WIDGET */}
                    <Card title="Mapa de Calor e Eventos (Shot Map)">
                        <div className="flex flex-col md:flex-row gap-6">
                            <div className="w-full md:w-2/3 h-80 bg-green-900/50 rounded-xl relative border border-white/10 overflow-hidden">
                                {/* Field Grid */}
                                <div className="absolute inset-0 opacity-20 bg-[linear-gradient(0deg,transparent_24%,rgba(255,255,255,.3)_25%,rgba(255,255,255,.3)_26%,transparent_27%,transparent_74%,rgba(255,255,255,.3)_75%,rgba(255,255,255,.3)_76%,transparent_77%,transparent),linear-gradient(90deg,transparent_24%,rgba(255,255,255,.3)_25%,rgba(255,255,255,.3)_26%,transparent_27%,transparent_74%,rgba(255,255,255,.3)_75%,rgba(255,255,255,.3)_76%,transparent_77%,transparent)] bg-[length:50px_50px]"></div>
                                
                                <ResponsiveContainer width="100%" height="100%">
                                    <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                                        <CartesianGrid strokeDasharray="3 3" opacity={0} />
                                        <XAxis type="number" dataKey="x" name="Posição X" hide domain={[0, 100]} />
                                        <YAxis type="number" dataKey="y" name="Posição Y" hide domain={[0, 100]} />
                                        <Tooltip cursor={{ strokeDasharray: '3 3' }} content={({ payload }) => {
                                            if (payload && payload.length) {
                                                const data = payload[0].payload;
                                                return (
                                                    <div className="bg-black/80 p-2 rounded border border-white/10 text-xs">
                                                        <p className="font-bold text-white">{data.result}</p>
                                                        <p className="text-gray-300">Coord: {data.x.toFixed(0)}, {data.y.toFixed(0)}</p>
                                                    </div>
                                                );
                                            }
                                            return null;
                                        }} />
                                        <Scatter name="Jogadas" data={getSpatialData()} fill="#8884d8">
                                            {getSpatialData().map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.result === 'TOUCHDOWN' ? '#10b981' : entry.result === 'TURNOVER' ? '#ef4444' : '#3b82f6'} />
                                            ))}
                                        </Scatter>
                                    </ScatterChart>
                                </ResponsiveContainer>
                            </div>
                            <div className="w-full md:w-1/3 space-y-4">
                                <div className="bg-secondary/50 p-4 rounded-lg">
                                    <h4 className="font-bold text-white mb-2">Legenda</h4>
                                    <div className="space-y-2 text-xs text-text-secondary">
                                        <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-green-500"></span> Touchdown</div>
                                        <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-blue-500"></span> Ganho / Avanço</div>
                                        <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-red-500"></span> Turnover / Perda</div>
                                    </div>
                                </div>
                                <p className="text-xs text-text-secondary italic">
                                    Este gráfico plota as coordenadas (X, Y) registradas durante o tagging, permitindo identificar zonas de maior sucesso ofensivo.
                                </p>
                            </div>
                        </div>
                    </Card>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card title="Distribuição de Jogadas (Passe vs Corrida)">
                            <div className="h-64 flex items-center justify-center">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie data={getPlayDistribution()} cx="50%" cy="50%" outerRadius={80} fill="#8884d8" dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                                            {getPlayDistribution().map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                                        </Pie>
                                        <Tooltip contentStyle={{ backgroundColor: '#1e293b' }} itemStyle={{ color: '#fff' }} />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </Card>
                        <Card title="Eficiência por Descida">
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={getDownEfficiency()} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                                        <XAxis dataKey="name" stroke="#94a3b8" />
                                        <YAxis stroke="#94a3b8" />
                                        <Tooltip contentStyle={{ backgroundColor: '#1e293b' }} />
                                        <Bar dataKey="total" name="Tentativas" fill="#475569" />
                                        <Bar dataKey="sucesso" name="Sucesso" fill="#10b981" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </Card>
                        <Card title="Alvos Preferidos (Target Share)" className="md:col-span-2">
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={getTargetShare()} layout="vertical" margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                                        <XAxis type="number" stroke="#94a3b8" />
                                        <YAxis dataKey="name" type="category" stroke="#fff" width={120} tick={{fontSize: 12}} />
                                        <Tooltip contentStyle={{ backgroundColor: '#1e293b' }} formatter={(value: any, name: any, props: any) => [value, props.payload.fullName]} />
                                        <Bar dataKey="value" name="Alvos" fill="#3b82f6" barSize={30} radius={[0, 4, 4, 0]} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </Card>
                    </div>

                    {/* IA Report Section */}
                    <div className="bg-gradient-to-br from-indigo-900/30 to-secondary border border-indigo-500/30 rounded-xl p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-xl font-bold text-white flex items-center gap-2"><SparklesIcon className="w-5 h-5 text-highlight"/> IA Game Insight</h3>
                            <button onClick={handleGenerateAiReport} disabled={isGeneratingReport} className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2">
                                {isGeneratingReport ? 'Analisando...' : '📝 Gerar Resumo Tático (IA)'}
                            </button>
                        </div>
                        {aiReport ? (
                            <div className="prose prose-invert max-w-none text-sm bg-black/20 p-4 rounded-lg border border-white/5">
                                <div dangerouslySetInnerHTML={{ __html: aiReport.replace(/\n/g, '<br/>').replace(/\*\*(.*?)\*\*/g, '<strong class="text-white">$1</strong>') }} />
                                <button className="mt-4 text-xs text-text-secondary hover:text-white underline" onClick={() => navigator.clipboard.writeText(aiReport)}>Copiar Relatório</button>
                            </div>
                        ) : (
                            <p className="text-text-secondary text-sm italic">Clique em gerar para obter uma análise narrativa do jogo baseada nos dados coletados.</p>
                        )}
                    </div>
                </div>
            )}

            {/* --- TAB: PLAYLISTS & PERMISSIONS --- */}
            {activeTab === 'PLAYLISTS' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {playlists.map(pl => (
                        <div key={pl.id} className="bg-secondary p-4 rounded-xl border border-white/5">
                            <h3 className="font-bold text-white mb-2">{pl.title}</h3>
                            <p className="text-xs text-text-secondary">{pl.clips.length} clips</p>
                            <button className="mt-4 w-full bg-highlight/20 text-highlight py-2 rounded font-bold text-sm hover:bg-highlight hover:text-white transition-colors">Assistir</button>
                        </div>
                    ))}
                </div>
            )}

            {/* Modals */}
            <Modal isOpen={playlistModalOpen} onClose={() => setPlaylistModalOpen(false)} title="Nova Playlist">
                <div className="space-y-4">
                    <input className="w-full bg-black/20 border border-white/10 rounded p-2 text-white" value={newPlaylistTitle} onChange={e => setNewPlaylistTitle(e.target.value)} placeholder="Nome da Playlist" />
                    <button onClick={handleCreatePlaylist} className="bg-highlight text-white px-6 py-2 rounded-lg font-bold w-full">Salvar</button>
                </div>
            </Modal>
            
            <Modal isOpen={isAddingVideo} onClose={() => setIsAddingVideo(false)} title="Adicionar Novo Vídeo">
                <div className="space-y-4">
                    {/* Tabs for Add Video */}
                    <div className="flex bg-black/30 p-1 rounded-lg">
                        <button 
                            onClick={() => setAddVideoTab('LINK')} 
                            className={`flex-1 py-2 text-xs font-bold rounded ${addVideoTab === 'LINK' ? 'bg-highlight text-white' : 'text-text-secondary hover:text-white'}`}
                        >
                            🔗 Link (YouTube/Vimeo)
                        </button>
                        <button 
                            onClick={() => setAddVideoTab('FILE')} 
                            className={`flex-1 py-2 text-xs font-bold rounded ${addVideoTab === 'FILE' ? 'bg-highlight text-white' : 'text-text-secondary hover:text-white'}`}
                        >
                            📁 Arquivo Local (PC)
                        </button>
                    </div>

                    <input className="w-full bg-black/20 border border-white/10 rounded p-2 text-white" value={newVideoTitle} onChange={e => setNewVideoTitle(e.target.value)} placeholder="Título do Jogo" required />
                    
                    {addVideoTab === 'LINK' ? (
                        <input className="w-full bg-black/20 border border-white/10 rounded p-2 text-white" value={newVideoUrl} onChange={e => setNewVideoUrl(e.target.value)} placeholder="URL YouTube/Vimeo" required />
                    ) : (
                        <div className="border border-dashed border-white/20 rounded p-4 text-center">
                            <input type="file" accept="video/*" onChange={handleFileChange} className="hidden" id="local-video-upload" />
                            <label htmlFor="local-video-upload" className="cursor-pointer flex flex-col items-center">
                                <span className="text-3xl mb-2">📂</span>
                                <span className="text-sm font-bold text-white">{localFile ? localFile.name : 'Clique para selecionar arquivo'}</span>
                                <span className="text-xs text-text-secondary mt-1">MP4, MOV, MKV suportados</span>
                            </label>
                        </div>
                    )}

                    <div className="pt-2 border-t border-white/10 mt-4">
                        <p className="text-[10px] text-text-secondary mb-2">
                            <strong>Opção Infra Própria (Futuro):</strong> Integração com Cloudflare Stream para vídeos 4K sem compressão e desenho na tela.
                        </p>
                        <button type="button" onClick={handleAddVideoSource} className="bg-highlight text-white px-6 py-2 rounded-lg font-bold w-full">
                            Adicionar
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};
export default VideoAnalysis;
