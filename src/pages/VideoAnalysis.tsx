
import React, { useState, useEffect, useRef, useContext } from 'react';
import Card from '../components/Card';
import { VideoClip, VideoTag, VideoPlaylist, Player, Game } from '../types';
import { storageService } from '../services/storageService';
import { predictPlayCall } from '../services/geminiService';
import { VideoIcon } from '../components/icons/NavIcons';
import { ScissorsIcon, FilterIcon, PlayCircleIcon, CheckCircleIcon, TrashIcon, SparklesIcon, PenIcon, EraserIcon, BrainIcon, EyeIcon, TrendingUpIcon, SearchIcon, XIcon, LinkIcon, ShareIcon } from '../components/icons/UiIcons';
import { UserContext } from '../components/Layout';
import { useToast } from '../contexts/ToastContext';

// --- YOUTUBE HELPER ---
const getYouTubeID = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
};

const VideoAnalysis: React.FC = () => {
    const { currentRole } = useContext(UserContext);
    const toast = useToast();
    
    // --- STATE ---
    const [activeTab, setActiveTab] = useState<'BROADCAST' | 'LIVE_TAG' | 'FILM_ROOM'>('FILM_ROOM');
    const [games, setGames] = useState<Game[]>([]);
    const [selectedGameId, setSelectedGameId] = useState<string>('');
    const [youtubeUrl, setYoutubeUrl] = useState('');
    
    // Video Player & Telestration
    const [videoId, setVideoId] = useState<string | null>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [drawColor, setDrawColor] = useState('#FFFF00'); // Amarelo Padrão NFL
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawingActive, setIsDrawingActive] = useState(false);

    // Tagging Data
    const [clips, setClips] = useState<VideoClip[]>([]);
    const [currentTimestamp, setCurrentTimestamp] = useState(0); // Manual sync for now
    const [tagData, setTagData] = useState<VideoTag>({
        down: 1, distance: 10, yardLine: 20, hash: 'MIDDLE',
        offensiveFormation: '', defensiveFormation: '',
        offensivePlayCall: '', defensivePlayCall: '',
        personnel: '', result: 'GAIN', gain: 0,
        involvedPlayerIds: [], startX: 50, startY: 50
    });
    const [clipTitle, setClipTitle] = useState('');

    useEffect(() => {
        setGames(storageService.getGames());
        setClips(storageService.getClips());
        
        // Auto-load last game if available
        const lastGame = storageService.getGames().find(g => g.status !== 'SCHEDULED');
        if (lastGame) setSelectedGameId(String(lastGame.id));
    }, []);

    // --- HANDLERS ---

    const handleLoadVideo = () => {
        const id = getYouTubeID(youtubeUrl);
        if (id) {
            setVideoId(id);
            toast.success("Vídeo carregado no Film Room.");
        } else {
            toast.error("URL do YouTube inválida.");
        }
    };

    const handleCopyOverlayLink = () => {
        if (!selectedGameId) {
            toast.warning("Selecione um jogo primeiro.");
            return;
        }
        const url = `${window.location.origin}/#/broadcast/${selectedGameId}`;
        navigator.clipboard.writeText(url);
        toast.success("Link do Overlay copiado! Envie para a transmissão.");
    };

    const handleSaveClip = () => {
        if (!selectedGameId || !clipTitle) {
            toast.warning("Selecione um jogo e dê um nome à jogada.");
            return;
        }

        const newClip: VideoClip = {
            id: `clip-${Date.now()}`,
            gameId: selectedGameId,
            title: clipTitle,
            videoUrl: videoId ? `https://www.youtube.com/watch?v=${videoId}&t=${currentTimestamp}s` : '',
            startTime: currentTimestamp,
            endTime: currentTimestamp + 10, // Default 10s clip
            tags: { ...tagData }
        };

        const updatedClips = [...clips, newClip];
        setClips(updatedClips);
        storageService.saveClips(updatedClips);
        toast.success("Jogada tagueada e salva na biblioteca.");
        setClipTitle('');
    };

    // --- TELESTRATION LOGIC ---
    const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!isDrawing) return;
        setIsDrawingActive(true);
        const ctx = canvasRef.current?.getContext('2d');
        if (ctx) {
            const rect = canvasRef.current!.getBoundingClientRect();
            ctx.beginPath();
            ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
            ctx.strokeStyle = drawColor;
            ctx.lineWidth = 4;
            ctx.lineCap = 'round';
        }
    };

    const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
        if (!isDrawingActive || !isDrawing) return;
        const ctx = canvasRef.current?.getContext('2d');
        if (ctx) {
            const rect = canvasRef.current!.getBoundingClientRect();
            ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
            ctx.stroke();
        }
    };

    const stopDrawing = () => setIsDrawingActive(false);
    
    const clearCanvas = () => {
        const ctx = canvasRef.current?.getContext('2d');
        if (ctx && canvasRef.current) {
            ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
        }
    };

    return (
        <div className="space-y-6 pb-12 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-secondary rounded-xl shadow-glow">
                        <EyeIcon className="text-highlight w-8 h-8" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold text-text-primary">Game Day Hub</h2>
                        <p className="text-text-secondary">Conexão Transmissão, Análise Ao Vivo e Film Room.</p>
                    </div>
                </div>
                
                <div className="flex gap-2">
                    <select 
                        className="bg-secondary border border-white/10 rounded-lg p-2 text-white text-sm focus:outline-none"
                        value={selectedGameId}
                        onChange={(e) => setSelectedGameId(e.target.value)}
                    >
                        <option value="">Selecione o Jogo...</option>
                        {games.map(g => (
                            <option key={g.id} value={g.id}>vs {g.opponent} ({new Date(g.date).toLocaleDateString()})</option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-white/10 overflow-x-auto">
                <button onClick={() => setActiveTab('BROADCAST')} className={`px-6 py-3 font-bold border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'BROADCAST' ? 'border-highlight text-highlight' : 'border-transparent text-text-secondary'}`}>
                    <ShareIcon className="w-4 h-4"/> 1. Transmissão (OBS)
                </button>
                <button onClick={() => setActiveTab('LIVE_TAG')} className={`px-6 py-3 font-bold border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'LIVE_TAG' ? 'border-red-500 text-red-400' : 'border-transparent text-text-secondary'}`}>
                    <TrendingUpIcon className="w-4 h-4"/> 2. Análise em Blocos (Live)
                </button>
                <button onClick={() => setActiveTab('FILM_ROOM')} className={`px-6 py-3 font-bold border-b-2 transition-colors flex items-center gap-2 ${activeTab === 'FILM_ROOM' ? 'border-blue-500 text-blue-400' : 'border-transparent text-text-secondary'}`}>
                    <PlayCircleIcon className="w-4 h-4"/> 3. Film Room (Pós-Jogo)
                </button>
            </div>

            {/* === TAB 1: BROADCAST SUPPORT === */}
            {activeTab === 'BROADCAST' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-slide-in">
                    <Card title="Integração com Transmissão (YouTube)">
                        <div className="space-y-6">
                            <p className="text-sm text-text-secondary">
                                O FAHUB gera um painel gráfico (Overlay) transparente para ser usado no OBS Studio ou vMix pela equipe de filmagem.
                                Os dados (Placar, Tempo, Descida) são alimentados automaticamente pelo módulo de Arbitragem ou pelo Coach na sideline.
                            </p>
                            
                            <div className="bg-black/30 p-4 rounded-lg border border-white/10 flex flex-col gap-2">
                                <label className="text-xs font-bold text-text-secondary uppercase">URL do Overlay (Browser Source)</label>
                                <div className="flex gap-2">
                                    <input 
                                        readOnly 
                                        className="flex-1 bg-black/50 border border-white/10 rounded px-3 text-xs text-green-400 font-mono"
                                        value={selectedGameId ? `${window.location.origin}/#/broadcast/${selectedGameId}` : 'Selecione um jogo acima'}
                                    />
                                    <button onClick={handleCopyOverlayLink} className="bg-highlight hover:bg-highlight-hover text-white px-4 py-2 rounded text-xs font-bold">
                                        Copiar
                                    </button>
                                </div>
                            </div>

                            <div className="bg-blue-900/20 p-4 rounded-lg border border-blue-500/20">
                                <h4 className="text-sm font-bold text-blue-300 mb-2">Instruções para a Equipe de Filmagem:</h4>
                                <ul className="text-xs text-text-secondary list-disc pl-4 space-y-1">
                                    <li>Adicione uma nova fonte "Navegador" (Browser Source) no OBS.</li>
                                    <li>Cole a URL acima. Defina tamanho 1920x1080.</li>
                                    <li>Ajuste o CSS personalizado para remover o fundo se necessário (o app já tem fundo transparente).</li>
                                </ul>
                            </div>
                        </div>
                    </Card>
                    
                    <Card title="Preview do Overlay">
                        <div className="aspect-video bg-[url('https://source.unsplash.com/random/800x450/?football,stadium')] bg-cover bg-center rounded-xl relative overflow-hidden border-2 border-white/10">
                            <div className="absolute inset-0 bg-black/20"></div>
                            {/* Mock Overlay Preview */}
                            <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
                                <div className="flex bg-gray-900 border border-white/20 rounded-lg overflow-hidden shadow-2xl">
                                    <div className="bg-black px-4 py-2 text-center border-r border-white/10">
                                        <span className="text-2xl font-black text-white">24</span>
                                        <span className="block text-[8px] text-gray-400 uppercase">HOME</span>
                                    </div>
                                    <div className="bg-gray-800 px-3 py-2 flex flex-col justify-center items-center min-w-[80px]">
                                        <span className="text-yellow-400 font-mono font-bold">12:00</span>
                                        <span className="text-[8px] text-gray-400">Q2</span>
                                    </div>
                                    <div className="bg-black px-4 py-2 text-center border-l border-white/10">
                                        <span className="text-2xl font-black text-white">17</span>
                                        <span className="block text-[8px] text-gray-400 uppercase">VISIT</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <p className="text-xs text-center text-text-secondary mt-2">Simulação de como aparecerá na transmissão.</p>
                    </Card>
                </div>
            )}

            {/* === TAB 2: LIVE TAGGING === */}
            {activeTab === 'LIVE_TAG' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-slide-in">
                    <Card title="Análise em Blocos (Sideline)">
                        <p className="text-sm text-text-secondary mb-4">
                            Registre eventos chave durante as paradas (Timeout, Intervalo, Fim de Quarto) para gerar estatísticas rápidas.
                        </p>
                        
                        <div className="grid grid-cols-2 gap-3 mb-4">
                            <button className="p-4 bg-green-600 hover:bg-green-500 rounded-xl font-bold text-white text-sm shadow-lg">
                                + Touchdown (Nós)
                            </button>
                            <button className="p-4 bg-red-600 hover:bg-red-500 rounded-xl font-bold text-white text-sm shadow-lg">
                                + Touchdown (Eles)
                            </button>
                            <button className="p-4 bg-blue-600 hover:bg-blue-500 rounded-xl font-bold text-white text-sm">
                                Turnover Forçado
                            </button>
                            <button className="p-4 bg-yellow-600 hover:bg-yellow-500 rounded-xl font-bold text-black text-sm">
                                Sack / TFL
                            </button>
                        </div>
                        
                        <div className="bg-black/20 p-3 rounded-lg border border-white/5">
                            <h4 className="text-xs font-bold text-text-secondary uppercase mb-2">Notas Rápidas</h4>
                            <textarea className="w-full bg-transparent text-white text-sm focus:outline-none h-20 resize-none" placeholder="Ex: A defesa deles está jogando Cover 3 em descidas longas..."></textarea>
                        </div>
                    </Card>

                    <Card title="Resumo do Jogo (Blocos)">
                         <div className="space-y-2">
                             <div className="bg-secondary p-3 rounded border border-white/5 flex justify-between">
                                 <span className="text-white font-bold">1º Quarto</span>
                                 <span className="text-text-secondary text-xs">Finalizado</span>
                             </div>
                             <div className="bg-secondary p-3 rounded border border-white/5 flex justify-between">
                                 <span className="text-white font-bold">2º Quarto</span>
                                 <span className="text-green-400 text-xs font-bold">Em Andamento</span>
                             </div>
                             <div className="mt-4 p-4 bg-black/40 rounded-xl text-center">
                                 <p className="text-xs text-text-secondary uppercase">Estatística Chave (Estimada)</p>
                                 <p className="text-2xl font-bold text-white">150 Jardas Totais</p>
                             </div>
                         </div>
                    </Card>
                </div>
            )}

            {/* === TAB 3: FILM ROOM (POST-GAME) === */}
            {activeTab === 'FILM_ROOM' && (
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 animate-slide-in">
                    <div className="xl:col-span-2 space-y-4">
                        {/* URL INPUT */}
                        <div className="flex gap-2">
                            <input 
                                className="flex-1 bg-black/30 border border-white/10 rounded-lg px-4 py-2 text-white focus:border-highlight focus:outline-none"
                                placeholder="Cole a URL do YouTube do jogo completo..."
                                value={youtubeUrl}
                                onChange={(e) => setYoutubeUrl(e.target.value)}
                            />
                            <button onClick={handleLoadVideo} className="bg-highlight hover:bg-highlight-hover text-white px-6 py-2 rounded-lg font-bold">
                                Carregar
                            </button>
                        </div>

                        {/* PLAYER & TELESTRATION */}
                        <div className="relative aspect-video bg-black rounded-xl overflow-hidden shadow-2xl border border-white/10 group">
                            {/* DRAWING CANVAS LAYER */}
                            <canvas 
                                ref={canvasRef}
                                width={1280} 
                                height={720}
                                className={`absolute inset-0 z-20 w-full h-full object-contain ${isDrawing ? 'cursor-crosshair pointer-events-auto bg-transparent' : 'pointer-events-none'}`}
                                onMouseDown={startDrawing} 
                                onMouseMove={draw} 
                                onMouseUp={stopDrawing} 
                                onMouseLeave={stopDrawing}
                            />
                            
                            {/* YOUTUBE IFRAME LAYER */}
                            {videoId ? (
                                <iframe 
                                    width="100%" 
                                    height="100%" 
                                    src={`https://www.youtube.com/embed/${videoId}?enablejsapi=1&rel=0&modestbranding=1`} 
                                    title="YouTube Player" 
                                    frameBorder="0" 
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                                    allowFullScreen
                                    className="absolute inset-0 z-10 w-full h-full"
                                ></iframe>
                            ) : (
                                <div className="flex flex-col items-center justify-center h-full text-text-secondary">
                                    <VideoIcon className="w-16 h-16 opacity-20 mb-4" />
                                    <p>Cole o link do YouTube acima para iniciar a análise.</p>
                                </div>
                            )}

                            {/* TELESTRATION CONTROLS */}
                            <div className="absolute top-4 right-4 z-30 flex gap-2">
                                <button 
                                    onClick={() => setIsDrawing(!isDrawing)} 
                                    className={`p-2 rounded-full backdrop-blur-md border border-white/20 transition-all ${isDrawing ? 'bg-yellow-500 text-black shadow-glow' : 'bg-black/50 text-white hover:bg-white/20'}`} 
                                    title={isDrawing ? "Modo Desenho Ativo" : "Ativar Caneta (Telestration)"}
                                >
                                    <PenIcon className="w-5 h-5"/>
                                </button>
                                {isDrawing && (
                                    <>
                                        <button onClick={() => setDrawColor('#FFFF00')} className={`w-8 h-8 rounded-full border-2 ${drawColor === '#FFFF00' ? 'border-white' : 'border-transparent'} bg-yellow-500`}></button>
                                        <button onClick={() => setDrawColor('#FF0000')} className={`w-8 h-8 rounded-full border-2 ${drawColor === '#FF0000' ? 'border-white' : 'border-transparent'} bg-red-600`}></button>
                                        <button onClick={clearCanvas} className="p-2 rounded-full bg-red-600/80 text-white backdrop-blur-md border border-white/20 hover:bg-red-600" title="Limpar Tela">
                                            <EraserIcon className="w-5 h-5"/>
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* SYNC TOOL */}
                        <div className="bg-secondary/50 p-3 rounded-xl border border-white/5 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <span className="text-xs text-text-secondary font-bold uppercase">Sincronia Manual</span>
                                <div className="flex items-center gap-2">
                                    <button onClick={() => setCurrentTimestamp(Math.max(0, currentTimestamp - 5))} className="p-1 hover:bg-white/10 rounded text-white text-xs">-5s</button>
                                    <input 
                                        type="number" 
                                        className="w-16 bg-black/40 border border-white/10 rounded p-1 text-center text-white font-mono" 
                                        value={currentTimestamp}
                                        onChange={(e) => setCurrentTimestamp(Number(e.target.value))}
                                    />
                                    <button onClick={() => setCurrentTimestamp(currentTimestamp + 5)} className="p-1 hover:bg-white/10 rounded text-white text-xs">+5s</button>
                                </div>
                                <p className="text-[10px] text-text-secondary ml-2">Use o tempo do vídeo para marcar o início da jogada.</p>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT: TAGGING PANEL */}
                    <div className="bg-secondary rounded-xl border border-white/5 p-5 flex flex-col h-full overflow-y-auto">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="font-bold text-white flex items-center gap-2"><BrainIcon className="w-5 h-5 text-highlight"/> Taguear Jogada</h3>
                            <button onClick={handleSaveClip} className="bg-green-600 hover:bg-green-500 text-white px-4 py-1.5 rounded-lg text-xs font-bold shadow-lg">Salvar Clip</button>
                        </div>

                        <div className="space-y-4 flex-1">
                            <input className="w-full bg-black/20 border border-white/10 rounded p-3 text-white text-sm focus:border-highlight focus:outline-none" placeholder="Nome do Clip (Ex: TD Pass Q1)" value={clipTitle} onChange={e => setClipTitle(e.target.value)} />

                            <div className="grid grid-cols-2 gap-3">
                                <div>
                                    <label className="text-[10px] text-text-secondary uppercase font-bold mb-1 block">Situação</label>
                                    <div className="flex gap-2">
                                        <input className="w-full bg-black/20 border border-white/10 rounded p-2 text-white text-center text-xs" placeholder="Down" value={tagData.down} onChange={e => setTagData({...tagData, down: Number(e.target.value) as any})} />
                                        <input className="w-full bg-black/20 border border-white/10 rounded p-2 text-white text-center text-xs" placeholder="Yds" value={tagData.distance} onChange={e => setTagData({...tagData, distance: Number(e.target.value)})} />
                                    </div>
                                </div>
                                <div>
                                    <label className="text-[10px] text-text-secondary uppercase font-bold mb-1 block">Resultado</label>
                                    <select className="w-full bg-black/20 border border-white/10 rounded p-2 text-white text-xs" value={tagData.result} onChange={e => setTagData({...tagData, result: e.target.value as any})}>
                                        <option value="GAIN">Ganho</option>
                                        <option value="LOSS">Perda</option>
                                        <option value="TOUCHDOWN">Touchdown</option>
                                        <option value="TURNOVER">Turnover</option>
                                    </select>
                                </div>
                            </div>
                            
                            <div>
                                <label className="text-[10px] text-text-secondary uppercase font-bold mb-1 block">Conceito Ofensivo</label>
                                <input className="w-full bg-black/20 border border-white/10 rounded p-2 text-white text-xs" placeholder="Ex: Mesh, Outside Zone..." value={tagData.offensivePlayCall} onChange={e => setTagData({...tagData, offensivePlayCall: e.target.value})} />
                            </div>
                            
                            <div className="pt-4 border-t border-white/5">
                                <h4 className="text-xs font-bold text-white mb-2">Clips Salvos neste Jogo</h4>
                                <div className="space-y-2 max-h-[200px] overflow-y-auto custom-scrollbar">
                                    {clips.filter(c => c.gameId === selectedGameId).map(clip => (
                                        <div key={clip.id} className="bg-black/30 p-2 rounded flex justify-between items-center group hover:bg-white/5 cursor-pointer">
                                            <div className="flex items-center gap-2">
                                                <PlayCircleIcon className="w-3 h-3 text-highlight" />
                                                <span className="text-xs text-white truncate max-w-[150px]">{clip.title}</span>
                                            </div>
                                            <span className="text-[10px] text-text-secondary font-mono">{new Date(clip.startTime * 1000).toISOString().substr(14, 5)}</span>
                                        </div>
                                    ))}
                                    {clips.filter(c => c.gameId === selectedGameId).length === 0 && <p className="text-xs text-text-secondary italic">Nenhum clip salvo ainda.</p>}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default VideoAnalysis;
