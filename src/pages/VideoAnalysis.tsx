
import React, { useState, useEffect, useContext, useRef } from 'react';
import Card from '../components/Card';
import { VideoClip, VideoTag, Player, ProgramType } from '../types';
import { storageService } from '../services/storageService';
import { GoogleGenAI } from '@google/genai';
import { 
    ScissorsIcon, PlayCircleIcon, BrainIcon, EyeIcon, 
    SearchIcon, SparklesIcon, TrashIcon, ClockIcon,
    PenIcon, EraserIcon, ChevronRightIcon, ActivityIcon
} from '../components/icons/UiIcons';
import { VideoIcon } from '../components/icons/NavIcons';
import { UserContext } from '../components/Layout';
import { useToast } from '../contexts/ToastContext';
import LazyImage from '../components/LazyImage';

declare global {
  interface Window {
    onYouTubeIframeAPIReady: () => void;
    YT: any;
  }
}

const VideoAnalysis: React.FC = () => {
    const { currentRole } = useContext(UserContext) as any;
    const toast = useToast();
    const [program, setProgram] = useState<ProgramType>('TACKLE');
    
    // Refs
    const playerRef = useRef<any>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // States
    const [activeTab, setActiveTab] = useState<'ANALYZE' | 'LIBRARY'>('ANALYZE');
    const [videoUrl, setVideoUrl] = useState('');
    const [isPlayerReady, setIsPlayerReady] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [playbackRate, setPlaybackRate] = useState(1);
    
    // Drawing State
    const [isDrawing, setIsDrawing] = useState(false);
    const [drawMode, setDrawMode] = useState<'NONE' | 'PEN'>('NONE');

    // Tagging State
    const [clips, setClips] = useState<VideoClip[]>([]);
    const [currentTag, setCurrentTag] = useState<Partial<VideoTag>>({
        down: 1,
        distance: 10,
        offensivePlayCall: '',
        result: 'COMPLETE'
    });

    // IA State
    const [isAiAnalyzing, setIsAiAnalyzing] = useState(false);

    useEffect(() => {
        // Detecta o programa do usuário
        const user = storageService.getCurrentUser();
        setProgram(user.program || 'TACKLE');
        setClips(storageService.getClips());

        // Setup YouTube API if not already there
        if (!window.YT) {
            const tag = document.createElement('script');
            tag.src = "https://www.youtube.com/iframe_api";
            const firstScriptTag = document.getElementsByTagName('script')[0];
            firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);
        }
    }, []);

    const initPlayer = (id: string) => {
        if (playerRef.current) playerRef.current.destroy();

        playerRef.current = new window.YT.Player('yt-player', {
            videoId: id,
            playerVars: {
                autoplay: 0,
                controls: 0, // Tiramos os controles do YT para usar os nossos de alta performance
                modestbranding: 1,
                rel: 0
            },
            events: {
                onReady: () => setIsPlayerReady(true),
                onStateChange: (event: any) => {
                    if (event.data === window.YT.PlayerState.PLAYING) {
                        startTimer();
                    }
                }
            }
        });
    };

    const startTimer = () => {
        const timer = setInterval(() => {
            if (playerRef.current && playerRef.current.getCurrentTime) {
                setCurrentTime(playerRef.current.getCurrentTime());
            } else {
                clearInterval(timer);
            }
        }, 500);
    };

    const handleLoadVideo = () => {
        const match = videoUrl.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
        if (match && match[1]) {
            initPlayer(match[1]);
            toast.success("Jogo carregado no Vision Lab!");
        } else {
            toast.error("Link do YouTube inválido.");
        }
    };

    // --- CONTROLES DE VÍDEO ---
    const togglePlay = () => {
        const state = playerRef.current.getPlayerState();
        if (state === 1) playerRef.current.pauseVideo();
        else playerRef.current.playVideo();
    };

    const skip = (seconds: number) => {
        const time = playerRef.current.getCurrentTime();
        playerRef.current.seekTo(time + seconds, true);
    };

    const changeSpeed = () => {
        const rates = [0.25, 0.5, 1, 1.5, 2];
        const next = rates[(rates.indexOf(playbackRate) + 1) % rates.length];
        setPlaybackRate(next);
        playerRef.current.setPlaybackRate(next);
    };

    // --- DRAWING LOGIC ---
    const startPen = (e: React.MouseEvent) => {
        if (drawMode !== 'PEN') return;
        setIsDrawing(true);
        const ctx = canvasRef.current?.getContext('2d');
        if (!ctx || !canvasRef.current) return;
        
        const rect = canvasRef.current.getBoundingClientRect();
        ctx.beginPath();
        ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 3;
    };

    const draw = (e: React.MouseEvent) => {
        if (!isDrawing) return;
        const ctx = canvasRef.current?.getContext('2d');
        const rect = canvasRef.current?.getBoundingClientRect();
        if (ctx && rect) {
            ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
            ctx.stroke();
        }
    };

    const stopDrawing = () => setIsDrawing(false);
    const clearCanvas = () => {
        const ctx = canvasRef.current?.getContext('2d');
        ctx?.clearRect(0, 0, canvasRef.current?.width || 0, canvasRef.current?.height || 0);
    };

    // --- IA SCOUT ---
    const handleAiAnalyze = async () => {
        setIsAiAnalyzing(true);
        toast.info("Gemini assistindo o frame...");
        
        // Simulação de análise Gemini baseada no tempo e contexto
        setTimeout(() => {
            if (program === 'TACKLE') {
                setCurrentTag({
                    ...currentTag,
                    offensiveFormation: 'I-Slot Strong',
                    defensiveFormation: 'Cover 3 Sky',
                    offensivePlayCall: 'ISO Lead Left'
                });
            } else {
                setCurrentTag({
                    ...currentTag,
                    offensiveFormation: 'Trips Right',
                    defensiveFormation: 'Man-to-Man',
                    offensivePlayCall: 'Quick Slant'
                });
            }
            setIsAiAnalyzing(false);
            toast.success("Análise da IA concluída!");
        }, 2000);
    };

    const handleSaveClip = () => {
        const newClip: VideoClip = {
            id: `clip-${Date.now()}`,
            title: `Clip @ ${Math.floor(currentTime)}s`,
            videoUrl: videoUrl,
            startTime: Math.floor(currentTime),
            tags: currentTag as VideoTag
        };
        const updated = [newClip, ...clips];
        setClips(updated);
        storageService.saveClips(updated);
        toast.success("Lance tageado e salvo!");
    };

    return (
        <div className="flex flex-col h-full space-y-4 animate-fade-in overflow-hidden">
            <div className="flex justify-between items-center shrink-0">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-secondary rounded-xl shadow-glow">
                        <VideoIcon className="text-highlight w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-xl font-black text-white italic uppercase tracking-tighter">Vision Lab <span className="text-highlight">3.0</span></h2>
                        <p className="text-[10px] text-text-secondary font-bold uppercase tracking-widest">
                            Modo: {program === 'TACKLE' ? 'Full Pads Deep Dive' : 'Flag Nitro Analyzer'}
                        </p>
                    </div>
                </div>
                
                <div className="flex bg-secondary p-1 rounded-xl border border-white/5">
                    <button onClick={() => setActiveTab('ANALYZE')} className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all ${activeTab === 'ANALYZE' ? 'bg-highlight text-white' : 'text-text-secondary'}`}>Analisar</button>
                    <button onClick={() => setActiveTab('LIBRARY')} className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all ${activeTab === 'LIBRARY' ? 'bg-highlight text-white' : 'text-text-secondary'}`}>Biblioteca</button>
                </div>
            </div>

            {activeTab === 'ANALYZE' ? (
                <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 overflow-hidden pb-4">
                    {/* ZONA DO VÍDEO (ESQUERDA) */}
                    <div className="lg:col-span-8 flex flex-col gap-4 overflow-hidden">
                        <div className="relative flex-1 bg-black rounded-[2rem] border border-white/10 overflow-hidden shadow-2xl group" ref={containerRef}>
                            {!isPlayerReady && (
                                <div className="absolute inset-0 z-20 bg-slate-900 flex flex-col items-center justify-center p-8 text-center">
                                    <VideoIcon className="w-16 h-16 text-white/10 mb-4" />
                                    <input 
                                        className="w-full max-w-md bg-black/40 border border-white/10 rounded-2xl p-4 text-white text-sm focus:border-highlight outline-none mb-4"
                                        placeholder="Cole o link do YouTube (Público ou Não Listado)..."
                                        value={videoUrl}
                                        onChange={e => setVideoUrl(e.target.value)}
                                    />
                                    <button onClick={handleLoadVideo} className="bg-highlight hover:bg-highlight-hover text-white px-8 py-3 rounded-2xl font-black uppercase text-xs shadow-glow transition-all">Ingerir Jogo</button>
                                </div>
                            )}

                            {/* PLAYER CONTAINER */}
                            <div className="w-full h-full pointer-events-none">
                                <div id="yt-player" className="w-full h-full absolute inset-0"></div>
                            </div>

                            {/* TELESTRATION LAYER */}
                            <canvas 
                                ref={canvasRef}
                                width={1280}
                                height={720}
                                onMouseDown={startPen}
                                onMouseMove={draw}
                                onMouseUp={stopDrawing}
                                onMouseLeave={stopDrawing}
                                className={`absolute inset-0 z-10 w-full h-full ${drawMode === 'PEN' ? 'cursor-crosshair' : 'pointer-events-none'}`}
                            ></canvas>

                            {/* CUSTOM CONTROLS OVERLAY */}
                            {isPlayerReady && (
                                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 bg-black/60 backdrop-blur-xl border border-white/10 p-2 rounded-2xl flex items-center gap-4 shadow-2xl opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => skip(-5)} className="p-2 text-white hover:text-highlight transition-colors"><ClockIcon className="w-5 h-5 rotate-180"/></button>
                                    <button onClick={togglePlay} className="p-3 bg-highlight text-white rounded-full shadow-glow active:scale-90 transition-all">
                                        <PlayCircleIcon className="w-6 h-6" />
                                    </button>
                                    <button onClick={() => skip(5)} className="p-2 text-white hover:text-highlight transition-colors"><ClockIcon className="w-5 h-5"/></button>
                                    <div className="w-px h-6 bg-white/10 mx-2"></div>
                                    <button onClick={changeSpeed} className="text-[10px] font-black text-white w-10">{playbackRate}x</button>
                                </div>
                            )}
                        </div>

                        {/* TOOLBAR TÉCNICA */}
                        <div className="flex gap-4 p-4 bg-secondary/30 rounded-2xl border border-white/5">
                            <button 
                                onClick={() => setDrawMode(drawMode === 'PEN' ? 'NONE' : 'PEN')}
                                className={`flex-1 py-3 rounded-xl font-black text-[10px] uppercase flex items-center justify-center gap-2 transition-all ${drawMode === 'PEN' ? 'bg-highlight text-white shadow-glow' : 'bg-white/5 text-text-secondary hover:bg-white/10'}`}
                            >
                                <PenIcon className="w-4 h-4" /> Desenhar
                            </button>
                            <button 
                                onClick={clearCanvas}
                                className="flex-1 py-3 rounded-xl font-black text-[10px] uppercase bg-white/5 text-text-secondary hover:bg-white/10 flex items-center justify-center gap-2"
                            >
                                <EraserIcon className="w-4 h-4" /> Limpar
                            </button>
                            <button 
                                onClick={handleAiAnalyze}
                                disabled={isAiAnalyzing}
                                className="flex-[2] py-3 rounded-xl font-black text-[10px] uppercase bg-purple-600 hover:bg-purple-500 text-white flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
                            >
                                {isAiAnalyzing ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <><SparklesIcon className="w-4 h-4" /> Sugestão IA</>}
                            </button>
                        </div>
                    </div>

                    {/* PAINEL DE TAGGING (DIREITA) */}
                    <div className="lg:col-span-4 overflow-y-auto custom-scrollbar pr-2 pb-4">
                        <Card title="Tagging do Lance">
                            <div className="space-y-4">
                                {program === 'TACKLE' ? (
                                    /* INTERFACE TACKLE */
                                    <div className="space-y-4 animate-fade-in">
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className="text-[9px] font-black text-text-secondary uppercase mb-1 block">Down</label>
                                                <select className="w-full bg-black/20 border border-white/10 rounded-lg p-2 text-white text-xs outline-none focus:border-highlight" value={currentTag.down} onChange={e => setCurrentTag({...currentTag, down: Number(e.target.value)})}>
                                                    <option value={1}>1st Down</option>
                                                    <option value={2}>2nd Down</option>
                                                    <option value={3}>3rd Down</option>
                                                    <option value={4}>4th Down</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="text-[9px] font-black text-text-secondary uppercase mb-1 block">Distance</label>
                                                <input type="number" className="w-full bg-black/20 border border-white/10 rounded-lg p-2 text-white text-xs outline-none focus:border-highlight" value={currentTag.distance} onChange={e => setCurrentTag({...currentTag, distance: Number(e.target.value)})} />
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-[9px] font-black text-text-secondary uppercase mb-1 block">Personnel</label>
                                            <input className="w-full bg-black/20 border border-white/10 rounded-lg p-2 text-white text-xs outline-none focus:border-highlight" placeholder="Ex: 11 Personnel" value={currentTag.personnel || ''} onChange={e => setCurrentTag({...currentTag, personnel: e.target.value})} />
                                        </div>
                                        <div>
                                            <label className="text-[9px] font-black text-text-secondary uppercase mb-1 block">Off. Play Call</label>
                                            <input className="w-full bg-black/20 border border-white/10 rounded-lg p-2 text-white text-xs outline-none focus:border-highlight" placeholder="Ex: Mesh" value={currentTag.offensivePlayCall} onChange={e => setCurrentTag({...currentTag, offensivePlayCall: e.target.value})} />
                                        </div>
                                    </div>
                                ) : (
                                    /* INTERFACE FLAG */
                                    <div className="space-y-4 animate-fade-in">
                                        <div className="p-3 bg-highlight/10 rounded-xl border border-highlight/20 flex justify-between items-center mb-2">
                                            <span className="text-[10px] font-black text-highlight uppercase">Rusher Clock</span>
                                            <span className="font-mono text-xl text-white">0.00s</span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            <button className="py-4 bg-blue-600/20 border-2 border-blue-500 rounded-xl font-black text-xs uppercase text-blue-400">PASSE</button>
                                            <button className="py-4 bg-green-600/20 border-2 border-green-500 rounded-xl font-black text-xs uppercase text-green-400">CORRIDA</button>
                                        </div>
                                        <div>
                                            <label className="text-[9px] font-black text-text-secondary uppercase mb-1 block">Blitzer ID</label>
                                            <input className="w-full bg-black/20 border border-white/10 rounded-lg p-2 text-white text-xs outline-none focus:border-highlight" placeholder="#88" />
                                        </div>
                                        <div>
                                            <label className="text-[9px] font-black text-text-secondary uppercase mb-1 block">Pull Result</label>
                                            <select className="w-full bg-black/20 border border-white/10 rounded-lg p-2 text-white text-xs outline-none focus:border-highlight">
                                                <option>Clean Pull</option>
                                                <option>Missed Pull</option>
                                                <option>Shielding Foul</option>
                                            </select>
                                        </div>
                                    </div>
                                )}

                                <div className="pt-4 border-t border-white/5">
                                    <button 
                                        onClick={handleSaveClip}
                                        className="w-full bg-highlight text-white font-black py-4 rounded-2xl uppercase text-xs shadow-glow transform active:scale-95 transition-all flex items-center justify-center gap-2"
                                    >
                                        <ScissorsIcon className="w-4 h-4" /> Salvar Clip Selecionado
                                    </button>
                                </div>
                            </div>
                        </Card>
                        
                        {/* RECENT CLIPS PREVIEW */}
                        <div className="mt-4 space-y-2">
                             <p className="text-[10px] font-black text-text-secondary uppercase tracking-[0.2em] ml-2">Ultimos Cortes</p>
                             {clips.slice(0, 3).map(clip => (
                                 <div key={clip.id} className="bg-secondary p-3 rounded-xl border border-white/5 flex items-center justify-between group">
                                     <div className="flex items-center gap-3">
                                         <div className="w-10 h-10 bg-black rounded-lg flex items-center justify-center text-xs font-bold text-highlight">
                                             {clip.startTime}s
                                         </div>
                                         <div>
                                             <p className="text-xs font-bold text-white uppercase">{clip.tags.offensivePlayCall || 'Play'}</p>
                                             <p className="text-[8px] text-text-secondary uppercase font-black">{clip.tags.result}</p>
                                         </div>
                                     </div>
                                     <TrashIcon className="w-4 h-4 text-text-secondary opacity-0 group-hover:opacity-100 cursor-pointer hover:text-red-500 transition-all" />
                                 </div>
                             ))}
                        </div>
                    </div>
                </div>
            ) : (
                /* BIBLIOTECA DE VÍDEOS */
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-10">
                        {clips.map(clip => (
                            <div key={clip.id} className="bg-secondary rounded-2xl overflow-hidden border border-white/10 group hover:border-highlight transition-all">
                                <div className="aspect-video bg-black relative">
                                    <LazyImage src={`https://img.youtube.com/vi/${videoUrl.split('v=')[1]}/0.jpg`} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <PlayCircleIcon className="w-12 h-12 text-white shadow-glow" />
                                    </div>
                                    <div className="absolute top-2 right-2 bg-black/60 px-2 py-1 rounded text-[10px] font-black text-white backdrop-blur-md">
                                        {clip.startTime}s
                                    </div>
                                </div>
                                <div className="p-4">
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="text-sm font-black text-white uppercase italic">{clip.tags.offensivePlayCall || 'Snap s/ Nome'}</h4>
                                        <span className="text-[8px] bg-white/10 px-2 py-0.5 rounded text-highlight font-black">{clip.tags.result}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-[10px] text-text-secondary font-bold uppercase">
                                        <ActivityIcon className="w-3 h-3"/> {clip.tags.personnel || 'N/A'} • {clip.tags.down}º Down
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default VideoAnalysis;