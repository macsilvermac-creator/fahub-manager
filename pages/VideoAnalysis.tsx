
import React, { useState, useEffect, useRef, useContext } from 'react';
import Card from '../components/Card';
import { VideoClip, VideoTag, ProgramType } from '../types';
import { storageService } from '../services/storageService';
import { 
    ScissorsIcon, PlayCircleIcon, BrainIcon, EyeIcon, 
    SparklesIcon, TrashIcon, ClockIcon, PenIcon, EraserIcon 
} from '../components/icons/UiIcons';
import { VideoIcon } from '../components/icons/NavIcons';
import { useToast } from '../contexts/ToastContext';
import LazyImage from '../components/LazyImage';
import { UserContext, UserContextType } from '../components/Layout';

declare global {
  interface Window {
    onYouTubeIframeAPIReady: () => void;
    YT: any;
  }
}

const VideoAnalysis: React.FC = () => {
    const { currentRole } = useContext(UserContext) as UserContextType;
    const toast = useToast();
    const [program, setProgram] = useState<ProgramType>('TACKLE');
    const [activeTab, setActiveTab] = useState<'ANALYZE' | 'LIBRARY'>('ANALYZE');
    
    // Refs
    const playerRef = useRef<any>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    // States
    const [videoUrl, setVideoUrl] = useState('');
    const [isPlayerReady, setIsPlayerReady] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [playbackRate, setPlaybackRate] = useState(1);
    const [drawMode, setDrawMode] = useState<'NONE' | 'PEN'>('NONE');
    const [isDrawing, setIsDrawing] = useState(false);
    const [zoomLevel, setZoomLevel] = useState(1);

    // Data State
    const [clips, setClips] = useState<VideoClip[]>([]);
    const [currentTag, setCurrentTag] = useState<Partial<VideoTag>>({
        down: 1,
        distance: 10,
        result: 'COMPLETE'
    });

    const isPlayer = currentRole === 'PLAYER';

    useEffect(() => {
        const user = storageService.getCurrentUser();
        setProgram(user.program || 'TACKLE');
        setClips(storageService.getClips());

        if (!window.YT) {
            const tag = document.createElement('script');
            tag.src = "https://www.youtube.com/iframe_api";
            document.head.appendChild(tag);
        }
    }, []);

    const initPlayer = (id: string) => {
        if (playerRef.current) playerRef.current.destroy();
        playerRef.current = new window.YT.Player('yt-player-el', {
            videoId: id,
            playerVars: { autoplay: 0, controls: isPlayer ? 1 : 0, modestbranding: 1, rel: 0 },
            events: {
                onReady: () => setIsPlayerReady(true),
                onStateChange: (event: any) => {
                    if (event.data === window.YT.PlayerState.PLAYING) {
                        const timer = setInterval(() => {
                            if (playerRef.current?.getCurrentTime) {
                                setCurrentTime(playerRef.current.getCurrentTime());
                            } else clearInterval(timer);
                        }, 500);
                    }
                }
            }
        });
    };

    const handleLoadVideo = () => {
        const match = videoUrl.match(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/);
        if (match && match[1]) {
            initPlayer(match[1]);
            toast.success("Sala de Vídeo pronta!");
        } else toast.error("Link inválido.");
    };

    const handleSaveClip = () => {
        const newClip: VideoClip = {
            id: `clip-${Date.now()}`,
            title: `Meu Snap em ${Math.floor(currentTime)}s`,
            videoUrl: videoUrl,
            startTime: Math.floor(currentTime),
            tags: currentTag as VideoTag
        };
        const updated = [newClip, ...clips];
        setClips(updated);
        storageService.saveClips(updated);
        toast.success("Snap marcado para a diretoria!");
    };

    return (
        <div className="flex flex-col h-full space-y-4 animate-fade-in overflow-hidden">
            <div className="flex justify-between items-center shrink-0">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-secondary rounded-xl shadow-glow">
                        <VideoIcon className="text-highlight w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-xl font-black text-white italic uppercase tracking-tighter">{isPlayer ? 'Vision Lab (Study)' : 'Intel Center (Coach)'}</h2>
                        <p className="text-[10px] text-text-secondary font-bold uppercase tracking-widest">{program} Intelligence</p>
                    </div>
                </div>
                <div className="flex bg-secondary p-1 rounded-xl border border-white/5">
                    <button onClick={() => setActiveTab('ANALYZE')} className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all ${activeTab === 'ANALYZE' ? 'bg-highlight text-white' : 'text-text-secondary'}`}>Estudar</button>
                    <button onClick={() => setActiveTab('LIBRARY')} className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all ${activeTab === 'LIBRARY' ? 'bg-highlight text-white' : 'text-text-secondary'}`}>Biblioteca</button>
                </div>
            </div>

            {activeTab === 'ANALYZE' ? (
                <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 overflow-hidden pb-4">
                    <div className="lg:col-span-8 flex flex-col gap-4 overflow-hidden">
                        <div className="relative flex-1 bg-black rounded-[3rem] border border-white/10 overflow-hidden shadow-2xl group">
                            {!isPlayerReady && (
                                <div className="absolute inset-0 z-20 bg-slate-900 flex flex-col items-center justify-center p-8 text-center">
                                    <input className="w-full max-w-md bg-black/40 border border-white/10 rounded-2xl p-4 text-white text-sm mb-4 outline-none focus:border-highlight" placeholder="URL do Jogo no YouTube..." value={videoUrl} onChange={e => setVideoUrl(e.target.value)} />
                                    <button onClick={handleLoadVideo} className="bg-highlight text-white px-10 py-3 rounded-2xl font-black uppercase text-xs shadow-glow transition-all active:scale-95">Carregar Gravação</button>
                                </div>
                            )}
                            
                            <div 
                                className="w-full h-full transition-transform duration-300 origin-center"
                                style={{ transform: `scale(${zoomLevel})` }}
                            >
                                <div id="yt-player-el" className="w-full h-full pointer-events-none"></div>
                            </div>

                            {isPlayerReady && (
                                <div className="absolute top-6 right-6 z-30 flex flex-col gap-2">
                                    <button onClick={() => setZoomLevel(prev => prev === 1 ? 2 : 1)} className="bg-black/60 backdrop-blur-md text-white p-3 rounded-xl border border-white/10 font-black text-xs uppercase shadow-2xl">
                                        {zoomLevel === 1 ? 'Zoom 2x' : 'Reset Zoom'}
                                    </button>
                                    <button onClick={() => {const rates = [0.25, 0.5, 1, 2]; const next = rates[(rates.indexOf(playbackRate) + 1) % rates.length]; setPlaybackRate(next); playerRef.current.setPlaybackRate(next);}} className="bg-black/60 backdrop-blur-md text-white p-3 rounded-xl border border-white/10 font-black text-xs uppercase shadow-2xl">
                                        Velocidade: {playbackRate}x
                                    </button>
                                </div>
                            )}
                        </div>

                        <div className="flex gap-4 p-4 bg-secondary/40 rounded-3xl border border-white/5 shrink-0">
                             <button 
                                onClick={handleSaveClip}
                                disabled={!isPlayerReady}
                                className="flex-1 bg-highlight hover:bg-highlight-hover text-white font-black py-4 rounded-2xl uppercase text-xs shadow-glow transform active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-20"
                             >
                                <ScissorsIcon className="w-5 h-5" /> TAGEAR MINHA JOGADA (SNAP)
                             </button>
                             {isPlayer && (
                                 <button className="flex-1 bg-white/5 hover:bg-white/10 text-white font-black py-4 rounded-2xl uppercase text-[10px] border border-white/10 transition-all flex items-center justify-center gap-2">
                                     <SparklesIcon className="w-4 h-4 text-purple-400" /> Solicitar Análise Técnica
                                 </button>
                             )}
                        </div>
                    </div>

                    <div className="lg:col-span-4 flex flex-col gap-6">
                        <Card title="Status do Estudo">
                             <div className="space-y-6">
                                <div className="text-center bg-black/20 p-6 rounded-3xl border border-white/5">
                                    <ClockIcon className="w-10 h-10 text-highlight mx-auto mb-3" />
                                    <p className="text-[10px] text-text-secondary uppercase font-black tracking-widest mb-1">Tempo em Vídeo (Hoje)</p>
                                    <p className="text-3xl font-black text-white italic">{(currentTime / 60).toFixed(1)} MIN</p>
                                </div>
                                <div className="space-y-4">
                                    <h4 className="text-[10px] font-black text-highlight uppercase tracking-[0.3em] px-2">Checklist Tático</h4>
                                    {[
                                        { l: 'Footwork Analysis', ok: true },
                                        { l: 'Hand Placement', ok: false },
                                        { l: 'Blitz Pickup', ok: false }
                                    ].map((c, i) => (
                                        <div key={i} className="flex items-center gap-3 bg-black/40 p-3 rounded-xl border border-white/5">
                                            {c.ok ? <CheckCircleIcon className="w-4 h-4 text-green-500" /> : <div className="w-4 h-4 rounded-full border-2 border-white/10"></div>}
                                            <span className={`text-xs font-bold ${c.ok ? 'text-white' : 'text-text-secondary'}`}>{c.l}</span>
                                        </div>
                                    ))}
                                </div>
                             </div>
                        </Card>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 overflow-y-auto custom-scrollbar pb-20">
                    {clips.map(clip => (
                        <div key={clip.id} className="bg-secondary/40 rounded-[2.5rem] overflow-hidden border border-white/5 group hover:border-highlight transition-all relative">
                            <div className="aspect-video bg-black relative">
                                <LazyImage src={`https://img.youtube.com/vi/${clip.videoUrl.match(/v=([^&]+)/)?.[1] || ''}/0.jpg`} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                                    <PlayCircleIcon className="w-12 h-12 text-white" />
                                </div>
                            </div>
                            <div className="p-5 flex justify-between items-center">
                                <div>
                                    <h4 className="text-white font-bold uppercase text-xs truncate">{clip.title}</h4>
                                    <p className="text-[9px] text-text-secondary uppercase font-bold mt-1">Tag: Manual Athlete</p>
                                </div>
                                <button className="p-2 text-text-secondary hover:text-red-500 transition-colors"><TrashIcon className="w-4 h-4"/></button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default VideoAnalysis;