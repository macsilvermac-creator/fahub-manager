
import React, { useState, useEffect, useRef, useContext } from 'react';
import Card from '../components/Card';
import { VideoClip, Player, Game } from '../types';
import { storageService } from '../services/storageService';
// Fix: Added missing icon imports
import { ScissorsIcon, PlayCircleIcon, BrainIcon, EyeIcon, SearchIcon, SwapIcon, SparklesIcon, TrashIcon, ClockIcon } from '../components/icons/UiIcons';
import { UserContext } from '../components/Layout';
import { useToast } from '../contexts/ToastContext';
import LazyImage from '../components/LazyImage';

const VideoAnalysis: React.FC = () => {
    const { currentRole } = useContext(UserContext);
    const toast = useToast();
    const [activeTab, setActiveTab] = useState<'FILM_ROOM' | 'MOSAIC' | 'COMPARISON'>('FILM_ROOM');
    const [clips, setClips] = useState<VideoClip[]>([]);
    const [selectedClip, setSelectedClip] = useState<VideoClip | null>(null);
    const [comparisonClip, setComparisonClip] = useState<VideoClip | null>(null);

    // Fix: Corrected state type to resolve compilation error
    const [taggingMode, setTaggingMode] = useState<'FLAG' | 'FULLPADS'>('FULLPADS');

    useEffect(() => {
        setClips(storageService.getClips());
        const settings = storageService.getTeamSettings();
        if (settings.sportType) {
            // Fix: Mapping TACKLE/BOTH to FULLPADS to resolve type errors
            const mode = settings.sportType === 'FLAG' ? 'FLAG' : 'FULLPADS';
            setTaggingMode(mode);
        }
    }, []);

    const handleCompare = (clip: VideoClip) => {
        setSelectedClip(clip);
        setActiveTab('COMPARISON');
        toast.info("Selecione o vídeo de referência para comparação.");
    };

    return (
        <div className="space-y-6 pb-12 animate-fade-in">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-secondary rounded-xl shadow-glow">
                        <EyeIcon className="text-highlight w-8 h-8" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold text-text-primary italic uppercase tracking-tighter">Vision Lab</h2>
                        <p className="text-text-secondary text-sm">Análise periódica e Correção Técnica.</p>
                    </div>
                </div>
            </div>

            <div className="flex border-b border-white/10 overflow-x-auto no-scrollbar">
                <button onClick={() => setActiveTab('FILM_ROOM')} className={`px-6 py-3 font-bold text-xs border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 ${activeTab === 'FILM_ROOM' ? 'border-highlight text-highlight' : 'border-transparent text-text-secondary'}`}>
                    FILM ROOM
                </button>
                <button onClick={() => setActiveTab('MOSAIC')} className={`px-6 py-3 font-bold text-xs border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 ${activeTab === 'MOSAIC' ? 'border-purple-500 text-purple-400' : 'border-transparent text-text-secondary'}`}>
                    MOSAICO DE QUARTER (IA)
                </button>
                <button onClick={() => setActiveTab('COMPARISON')} className={`px-6 py-3 font-bold text-xs border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 ${activeTab === 'COMPARISON' ? 'border-blue-500 text-blue-400' : 'border-transparent text-text-secondary'}`}>
                    SIDE-BY-SIDE REVIEW
                </button>
            </div>

            {activeTab === 'COMPARISON' && (
                <div className="space-y-6 animate-slide-in">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {/* Player Player 1 */}
                        <div className="space-y-2">
                             <div className="flex justify-between items-center bg-black/40 p-2 rounded-t-xl border-x border-t border-white/10">
                                <span className="text-[10px] font-bold text-highlight uppercase">Vídeo Atleta</span>
                                <span className="text-[10px] text-text-secondary">{selectedClip?.title || 'Selecione um clip'}</span>
                             </div>
                             <div className="aspect-video bg-black rounded-b-xl overflow-hidden border border-white/10 relative">
                                {selectedClip ? (
                                    <iframe width="100%" height="100%" src={selectedClip.videoUrl} title="A" frameBorder="0" allowFullScreen></iframe>
                                ) : <div className="h-full flex items-center justify-center opacity-20"><PlayCircleIcon className="w-12 h-12"/></div>}
                             </div>
                        </div>
                        {/* Player Player 2 (Pro/Reference) */}
                        <div className="space-y-2">
                             <div className="flex justify-between items-center bg-black/40 p-2 rounded-t-xl border-x border-t border-white/10">
                                <span className="text-[10px] font-bold text-blue-400 uppercase">Referência Técnica (NFL Flag)</span>
                                <span className="text-[10px] text-text-secondary">Comparativo Pro</span>
                             </div>
                             <div className="aspect-video bg-black rounded-b-xl overflow-hidden border border-white/10 relative">
                                <iframe width="100%" height="100%" src="https://www.youtube.com/embed/2vjPBrBU-TM" title="B" frameBorder="0" allowFullScreen></iframe>
                             </div>
                        </div>
                    </div>
                    <Card title="Correção Técnica de IA">
                         <div className="flex items-start gap-4">
                             <div className="p-3 bg-blue-600/20 rounded-full"><SparklesIcon className="text-blue-400 w-6 h-6"/></div>
                             <div>
                                 <p className="text-white font-bold">Análise de Rota (Slant)</p>
                                 <p className="text-sm text-text-secondary leading-relaxed">
                                     O seu corte de rota está ocorrendo com 0.4s de atraso em relação à referência. 
                                     Dica: Mantenha o centro de gravidade mais baixo na desaceleração para explosão lateral.
                                 </p>
                             </div>
                         </div>
                    </Card>
                </div>
            )}

            {activeTab === 'MOSAIC' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-slide-in">
                    {['Q1', 'Q2', 'Q3', 'Q4'].map(q => (
                        <div key={q} className="bg-secondary p-4 rounded-2xl border border-white/5 hover:border-purple-500/50 transition-all cursor-pointer">
                            <div className="flex justify-between items-center mb-4">
                                <span className="bg-purple-600 text-white text-[10px] font-black px-2 py-0.5 rounded">{q} SUMMARY</span>
                                <ClockIcon className="w-4 h-4 text-text-secondary"/>
                            </div>
                            <div className="aspect-square bg-black/40 rounded-xl mb-4 flex items-center justify-center border border-white/10">
                                <BrainIcon className="w-12 h-12 text-purple-400 opacity-20"/>
                            </div>
                            <h4 className="text-white font-bold text-sm">Mosaic Drive Analysis</h4>
                            <p className="text-[10px] text-text-secondary mt-1">Status: Processado por IA</p>
                        </div>
                    ))}
                </div>
            )}

            {activeTab === 'FILM_ROOM' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-slide-in">
                    {clips.map(clip => (
                        <div key={clip.id} className="bg-secondary rounded-2xl overflow-hidden border border-white/5 hover:border-highlight group transition-all">
                            <div className="aspect-video bg-black relative">
                                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity z-10 bg-black/40">
                                    <button onClick={() => handleCompare(clip)} className="bg-white text-black px-4 py-2 rounded-lg text-xs font-black uppercase">Review Tech</button>
                                </div>
                                <LazyImage src={`https://img.youtube.com/vi/${clip.videoUrl.split('v=')[1]}/0.jpg`} className="w-full h-full object-cover" />
                            </div>
                            <div className="p-4">
                                <h4 className="font-bold text-white text-sm truncate">{clip.title}</h4>
                                <div className="flex justify-between items-center mt-3">
                                    <span className="text-[10px] text-text-secondary">{new Date(clip.startTime * 1000).toISOString().substr(14, 5)}</span>
                                    <span className="bg-white/10 px-2 py-0.5 rounded text-[10px] text-white">TD PLAY</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default VideoAnalysis;