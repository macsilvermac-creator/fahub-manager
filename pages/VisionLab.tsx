import React, { useState, useEffect, useRef } from 'react';
import Card from '../components/Card';
import { VideoClip, VideoTag, ProgramType } from '../types';
import { storageService } from '../services/storageService';
import { 
    ScissorsIcon, PlayCircleIcon, SparklesIcon, TrashIcon, 
    ClockIcon, PenIcon, EraserIcon, ActivityIcon 
} from '../components/icons/UiIcons';
import { VideoIcon } from '../components/icons/NavIcons';
import { useToast } from '../contexts/ToastContext';
import LazyImage from '../components/LazyImage';

declare global {
  interface Window {
    onYouTubeIframeAPIReady: () => void;
    YT: any;
  }
}

const VisionLab: React.FC = () => {
    const toast = useToast();
    const [program, setProgram] = useState<ProgramType>('TACKLE');
    const [activeTab, setActiveTab] = useState<'ANALYZE' | 'LIBRARY'>('ANALYZE');
    
    // Player State
    const playerRef = useRef<any>(null);
    const [videoUrl, setVideoUrl] = useState('');
    const [isPlayerReady, setIsPlayerReady] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [playbackRate, setPlaybackRate] = useState(1);

    // Data State
    const [clips, setClips] = useState<VideoClip[]>([]);
    const [currentTag, setCurrentTag] = useState<Partial<VideoTag>>({
        down: 1,
        distance: 10,
        result: 'COMPLETE'
    });
    const [isAiAnalyzing, setIsAiAnalyzing] = useState(false);

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
            playerVars: { autoplay: 0, controls: 0, modestbranding: 1, rel: 0 },
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
            toast.success("Vision Lab: Jogo Ingerido!");
        } else toast.error("Link inválido. Use um link do YouTube.");
    };

    const handleAiScout = () => {
        setIsAiAnalyzing(true);
        setTimeout(() => {
            const suggestions = program === 'FLAG' 
                ? { offensivePlayCall: 'Quick Slant', offensiveFormation: 'Trips Right' }
                : { offensivePlayCall: 'Outside Zone', personnel: '11 Personnel' };
            
            setCurrentTag({ ...currentTag, ...suggestions });
            setIsAiAnalyzing(false);
            toast.success("IA: Padrões detectados no frame!");
        }, 1500);
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
        toast.success("Tag salva com sucesso.");
    };

    return (
        <div className="flex flex-col h-full space-y-4 animate-fade-in overflow-hidden">
            <div className="flex justify-between items-center shrink-0">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-secondary rounded-xl shadow-glow">
                        <VideoIcon className="text-highlight w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-xl font-black text-white italic uppercase">Vision Lab</h2>
                        <p className="text-[10px] text-text-secondary font-bold uppercase tracking-widest">Protocolo de Vídeo: {program}</p>
                    </div>
                </div>
                <div className="flex bg-secondary p-1 rounded-xl border border-white/5">
                    <button onClick={() => setActiveTab('ANALYZE')} className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all ${activeTab === 'ANALYZE' ? 'bg-highlight text-white' : 'text-text-secondary'}`}>Analisar</button>
                    <button onClick={() => setActiveTab('LIBRARY')} className={`px-4 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all ${activeTab === 'LIBRARY' ? 'bg-highlight text-white' : 'text-text-secondary'}`}>Biblioteca</button>
                </div>
            </div>

            {activeTab === 'ANALYZE' ? (
                <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 overflow-hidden pb-4">
                    <div className="lg:col-span-8 flex flex-col gap-4 overflow-hidden">
                        <div className="relative flex-1 bg-black rounded-[2rem] border border-white/10 overflow-hidden shadow-2xl group">
                            {!isPlayerReady && (
                                <div className="absolute inset-0 z-20 bg-slate-900 flex flex-col items-center justify-center p-8 text-center">
                                    <input 
                                        className="w-full max-w-md bg-black/40 border border-white/10 rounded-2xl p-4 text-white text-sm mb-4 outline-none focus:border-highlight" 
                                        placeholder="Cole a URL do YouTube do seu jogo..." 
                                        value={videoUrl} 
                                        onChange={e => setVideoUrl(e.target.value)} 
                                    />
                                    <button onClick={handleLoadVideo} className="bg-highlight text-white px-8 py-3 rounded-2xl font-black uppercase text-xs shadow-glow transition-all active:scale-95">
                                        Montar Film Room
                                    </button>
                                </div>
                            )}
                            <div id="yt-player-el" className="w-full h-full pointer-events-none scale-110"></div>
                            
                            {isPlayerReady && (
                                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 bg-black/60 backdrop-blur-xl p-2 rounded-2xl flex items-center gap-4 shadow-2xl opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button onClick={() => playerRef.current.seekTo(playerRef.current.getCurrentTime() - 5)} className="p-2 text-white hover:text-highlight transition-all"><ClockIcon className="w-5 h-5 rotate-180"/></button>
                                    <button onClick={() => playerRef.current.getPlayerState() === 1 ? playerRef.current.pauseVideo() : playerRef.current.playVideo()} className="p-3 bg-highlight text-white rounded-full transition-all active:scale-90"><PlayCircleIcon className="w-6 h-6"/></button>
                                    <button onClick={() => playerRef.current.seekTo(playerRef.current.getCurrentTime() + 5)} className="p-2 text-white hover:text-highlight transition-all"><ClockIcon className="w-5 h-5"/></button>
                                    <div className="w-px h-6 bg-white/10 mx-2"></div>
                                    <button onClick={() => {const rates = [0.25, 0.5, 1, 2]; const next = rates[(rates.indexOf(playbackRate) + 1) % rates.length]; setPlaybackRate(next); playerRef.current.setPlaybackRate(next);}} className="text-[10px] font-black text-white w-10 px-2 py-1 bg-white/5 rounded hover:bg-white/10">{playbackRate}x</button>
                                </div>
                            )}
                        </div>
                        <div className="flex gap-4 p-4 bg-secondary/30 rounded-2xl border border-white/5">
                            <button onClick={handleAiScout} disabled={isAiAnalyzing || !isPlayerReady} className="flex-1 py-3 rounded-xl font-black text-[10px] uppercase bg-purple-600 text-white flex items-center justify-center gap-2 shadow-lg disabled:opacity-30 transition-all hover:bg-purple-500">
                                {isAiAnalyzing ? 'Sincronizando...' : <><SparklesIcon className="w-4 h-4" /> IA Scout Vision</>}
                            </button>
                            <button onClick={handleSaveClip} disabled={!isPlayerReady} className="flex-1 py-3 rounded-xl font-black text-[10px] uppercase bg-highlight text-white flex items-center justify-center gap-2 shadow-lg disabled:opacity-30 transition-all hover:bg-highlight-hover">
                                <ScissorsIcon className="w-4 h-4" /> Salvar Tag Técnica
                            </button>
                        </div>
                    </div>

                    <div className="lg:col-span-4 overflow-y-auto custom-scrollbar pr-2 pb-4">
                        <Card title="Tagging Protocol">
                            <div className="space-y-4">
                                {program === 'TACKLE' ? (
                                    <div className="space-y-4 animate-fade-in">
                                        <div className="grid grid-cols-2 gap-3">
                                            <div>
                                                <label className="text-[9px] font-black text-text-secondary uppercase mb-1 block">Down</label>
                                                <select className="w-full bg-black/20 border border-white/10 rounded-lg p-2 text-white text-xs outline-none focus:border-highlight" value={currentTag.down} onChange={e => setCurrentTag({...currentTag, down: Number(e.target.value)})}>
                                                    <option value={1}>1st Down</option><option value={2}>2nd Down</option><option value={3}>3rd Down</option><option value={4}>4th Down</option>
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
                                            <label className="text-[9px] font-black text-text-secondary uppercase mb-1 block">Play Call</label>
                                            <input className="w-full bg-black/20 border border-white/10 rounded-lg p-2 text-white text-xs outline-none focus:border-highlight" placeholder="Ex: Power O" value={currentTag.offensivePlayCall || ''} onChange={e => setCurrentTag({...currentTag, offensivePlayCall: e.target.value})} />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-4 animate-fade-in">
                                        <div className="p-3 bg-highlight/10 rounded-xl border border-highlight/20 flex justify-between items-center mb-2">
                                            <span className="text-[10px] font-black text-highlight uppercase tracking-widest">Rusher Timing</span>
                                            <span className="font-mono text-xl text-white">{(currentTime % 7).toFixed(2)}s</span>
                                        </div>
                                        <div className="grid grid-cols-2 gap-3">
                                            <button onClick={() => setCurrentTag({...currentTag, result: 'PASS'})} className={`py-4 border-2 rounded-xl font-black text-xs uppercase transition-all ${currentTag.result === 'PASS' ? 'bg-blue-600/20 border-blue-500 text-blue-400' : 'bg-secondary border-white/5 text-text-secondary'}`}>PASSE</button>
                                            <button onClick={() => setCurrentTag({...currentTag, result: 'RUN'})} className={`py-4 border-2 rounded-xl font-black text-xs uppercase transition-all ${currentTag.result === 'RUN' ? 'bg-green-600/20 border-green-500 text-green-400' : 'bg-secondary border-white/5 text-text-secondary'}`}>CORRIDA</button>
                                        </div>
                                        <div>
                                            <label className="text-[9px] font-black text-text-secondary uppercase mb-1 block">Flag Pull Status</label>
                                            <select className="w-full bg-black/20 border border-white/10 rounded-lg p-2 text-white text-xs">
                                                <option>Clean Pull</option><option>Flag Miss</option><option>Diving Pull</option>
                                            </select>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </Card>
                    </div>
                </div>
            ) : (
                <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
                        {clips.map(clip => (
                            <div key={clip.id} className="bg-secondary rounded-2xl overflow-hidden border border-white/10 group hover:border-highlight transition-all relative">
                                <div className="aspect-video bg-black relative">
                                    <LazyImage src={`https://img.youtube.com/vi/${videoUrl.match(/v=([^&]+)/)?.[1] || ''}/0.jpg`} className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/40">
                                        <PlayCircleIcon className="w-12 h-12 text-white shadow-glow" />
                                    </div>
                                </div>
                                <div className="p-4">
                                    <div className="flex justify-between items-start mb-2">
                                        <h4 className="text-white font-bold uppercase italic text-sm truncate pr-4">{clip.tags.offensivePlayCall || 'Snap Técnico'}</h4>
                                        <span className="bg-highlight/20 text-highlight text-[10px] px-2 py-0.5 rounded font-black">#{clip.startTime}s</span>
                                    </div>
                                    <p className="text-[10px] text-text-secondary uppercase font-bold tracking-widest">{clip.tags.personnel || clip.tags.result || 'Sem Detalhes'}</p>
                                </div>
                                <button className="absolute top-2 right-2 p-1.5 bg-black/40 rounded-full text-text-secondary hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all">
                                    <TrashIcon className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                        {clips.length === 0 && (
                            <div className="col-span-full py-20 text-center opacity-30 border-2 border-dashed border-white/10 rounded-3xl">
                                <p className="font-black uppercase tracking-widest">Nenhuma tag salva nesta sessão.</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default VisionLab;