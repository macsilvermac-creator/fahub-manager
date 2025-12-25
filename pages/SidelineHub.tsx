
import React, { useState, useEffect, useMemo, useRef } from 'react';
import Card from '../components/Card';
import { storageService } from '../services/storageService';
import { Game, Player, PlayEvent, GameUnit } from '../types';
import { 
    WhistleIcon, TrophyIcon, UsersIcon, CheckCircleIcon, 
    TrashIcon, SparklesIcon, WifiIcon, WifiOffIcon, ClockIcon,
    PenIcon, ChevronDownIcon, XIcon, SaveIcon
} from '../components/icons/UiIcons';
import LazyImage from '../components/LazyImage';
import { useToast } from '../contexts/ToastContext';

const SidelineHub: React.FC = () => {
    const toast = useToast();
    const [activeGame, setActiveGame] = useState<Game | null>(null);
    const [players, setPlayers] = useState<Player[]>([]);
    const [activeUnit, setActiveUnit] = useState<GameUnit>('OFFENSE');
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    
    // Play Entry State (Console Principal)
    const [playType, setPlayType] = useState<'PASS' | 'RUN' | 'PUNT' | 'FG' | 'KICKOFF' | 'PAT' | null>(null);
    const [playResult, setPlayResult] = useState<string | null>(null);
    const [jerseyInput, setJerseyInput] = useState('');
    const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
    const [yardSide, setYardSide] = useState<'+' | '-'>('+');
    const [yards, setYards] = useState<number>(0);

    // Timeline Interaction State
    const [expandedPlayId, setExpandedPlayId] = useState<string | null>(null);
    const [editingPlayId, setEditingPlayId] = useState<string | null>(null);
    const [editFormData, setEditFormData] = useState<Partial<PlayEvent>>({});

    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        storageService.initializeRAM();
        const load = () => {
            const games = storageService.getGames();
            const live = games.find(g => g.status === 'IN_PROGRESS') || games[0];
            setActiveGame(live);
            setPlayers(storageService.getPlayers());
        };
        load();
        
        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);
        window.addEventListener('online', handleOnline);
        window.addEventListener('offline', handleOffline);
        
        return () => {
            window.removeEventListener('online', handleOnline);
            window.removeEventListener('offline', handleOffline);
        };
    }, []);

    // Lookup de atleta para console principal
    useEffect(() => {
        if (jerseyInput.length > 0) {
            const found = players.find(p => String(p.jerseyNumber) === jerseyInput);
            setSelectedPlayer(found || null);
        } else {
            setSelectedPlayer(null);
        }
    }, [jerseyInput, players]);

    const handleSavePlay = () => {
        if (!activeGame || !playType || !playResult) {
            toast.warning("Complete as informações básicas da jogada.");
            return;
        }

        const newEvent: PlayEvent = {
            id: `play-${Date.now()}`,
            gameId: activeGame.id,
            timestamp: new Date(),
            unit: activeUnit,
            playType,
            result: playResult as any,
            primaryPlayerId: selectedPlayer?.id,
            primaryJersey: Number(jerseyInput),
            yards: yardSide === '+' ? yards : -yards,
            isVerified: false
        };

        storageService.savePlayEvent(activeGame.id, newEvent);
        resetConsole();
        toast.success("Snap registrado!");
        
        if (scrollRef.current) scrollRef.current.scrollTop = 0;
    };

    const resetConsole = () => {
        setPlayType(null);
        setPlayResult(null);
        setJerseyInput('');
        setYards(0);
        setSelectedPlayer(null);
    };

    const startEdit = (e: React.MouseEvent, play: PlayEvent) => {
        e.stopPropagation();
        setEditingPlayId(play.id);
        setEditFormData({ ...play });
    };

    const handleUpdatePlay = () => {
        if (!activeGame || !editingPlayId) return;
        
        const updatedTimeline = (activeGame.timeline || []).map(p => 
            p.id === editingPlayId ? { ...p, ...editFormData } : p
        );
        
        storageService.updateLiveGame(activeGame.id, { timeline: updatedTimeline });
        setEditingPlayId(null);
        toast.success("Registro atualizado.");
    };

    const deletePlay = (id: string) => {
        if (activeGame && window.confirm("Deseja anular este registro permanentemente?")) {
            const updatedTimeline = (activeGame.timeline || []).filter(e => e.id !== id);
            storageService.updateLiveGame(activeGame.id, { timeline: updatedTimeline });
            toast.info("Registro removido.");
        }
    };

    const renderSelectors = (currentType: any, currentResult: any, setType: Function, setResult: Function) => {
        if (activeUnit === 'OFFENSE') {
            return (
                <div className="grid grid-cols-2 gap-2">
                    <button onClick={() => { setType('PASS'); setResult(null); }} className={`p-4 rounded-xl font-black border-2 transition-all ${currentType === 'PASS' ? 'bg-highlight border-highlight text-white shadow-glow' : 'bg-secondary border-white/5 text-text-secondary'}`}>PASSE</button>
                    <button onClick={() => { setType('RUN'); setResult(null); }} className={`p-4 rounded-xl font-black border-2 transition-all ${currentType === 'RUN' ? 'bg-highlight border-highlight text-white shadow-glow' : 'bg-secondary border-white/5 text-text-secondary'}`}>CORRIDA</button>
                    
                    {currentType === 'PASS' && (
                        <div className="col-span-2 grid grid-cols-4 gap-1 mt-2 animate-fade-in">
                            {['CATCH', 'DROP', 'INT', 'SACK'].map(r => (
                                <button key={r} onClick={() => setResult(r)} className={`p-2 rounded-lg text-[10px] font-black border transition-all ${currentResult === r ? 'bg-blue-600 border-blue-500 text-white' : 'bg-black/40 border-white/10 text-text-secondary'}`}>{r}</button>
                            ))}
                        </div>
                    )}
                    {currentType === 'RUN' && (
                        <div className="col-span-2 grid grid-cols-2 gap-1 mt-2 animate-fade-in">
                            {['COMPLETE', 'FUMBLE'].map(r => (
                                <button key={r} onClick={() => setResult(r)} className={`p-2 rounded-lg text-[10px] font-black border transition-all ${currentResult === r ? 'bg-orange-600 border-orange-500 text-white' : 'bg-black/40 border-white/10 text-text-secondary'}`}>{r === 'COMPLETE' ? 'GANHO' : 'FUMBLE'}</button>
                            ))}
                        </div>
                    )}
                </div>
            );
        }

        if (activeUnit === 'DEFENSE') {
            return (
                <div className="grid grid-cols-2 gap-2 animate-fade-in">
                    {['TACKLE', 'SACK', 'INT', 'FUMBLE'].map(r => (
                        <button key={r} onClick={() => { setType('RUN'); setResult(r); }} className={`p-4 rounded-xl font-black border-2 transition-all ${currentResult === r ? 'bg-blue-600 border-blue-500 text-white shadow-glow' : 'bg-secondary border-white/5 text-text-secondary'}`}>{r}</button>
                    ))}
                </div>
            );
        }

        return (
            <div className="grid grid-cols-2 gap-2 animate-fade-in">
                {['PUNT', 'FG', 'KICKOFF', 'PAT'].map(t => (
                    <button key={t} onClick={() => { setType(t); setResult('COMPLETE'); }} className={`p-3 rounded-xl font-black border-2 transition-all ${currentType === t ? 'bg-yellow-600 border-yellow-500 text-white shadow-glow' : 'bg-secondary border-white/5 text-text-secondary'}`}>{t}</button>
                ))}
            </div>
        );
    };

    if (!activeGame) return <div className="p-10 text-center opacity-30 uppercase font-black">Aguardando Início do Jogo...</div>;

    return (
        <div className="flex flex-col h-[calc(100vh-5rem)] space-y-4 animate-fade-in overflow-hidden bg-[#0B1120]">
            
            {/* TABS DE UNIDADE */}
            <div className="grid grid-cols-3 gap-2 shrink-0 px-1">
                <button onClick={() => { setActiveUnit('OFFENSE'); resetConsole(); }} className={`py-4 rounded-2xl font-black text-xs transition-all border-b-4 ${activeUnit === 'OFFENSE' ? 'bg-highlight/10 border-highlight text-white' : 'bg-secondary border-white/5 text-text-secondary'}`}>ATAQUE</button>
                <button onClick={() => { setActiveUnit('DEFENSE'); resetConsole(); }} className={`py-4 rounded-2xl font-black text-xs transition-all border-b-4 ${activeUnit === 'DEFENSE' ? 'bg-blue-600/10 border-blue-600 text-white' : 'bg-secondary border-white/5 text-text-secondary'}`}>DEFESA</button>
                <button onClick={() => { setActiveUnit('ST'); resetConsole(); }} className={`py-4 rounded-2xl font-black text-xs transition-all border-b-4 ${activeUnit === 'ST' ? 'bg-yellow-600/10 border-yellow-600 text-white' : 'bg-secondary border-white/5 text-text-secondary'}`}>ST</button>
            </div>

            <div className="flex-1 flex flex-col lg:flex-row gap-6 overflow-hidden">
                
                {/* COLUNA ESQUERDA: CONSOLE ESTÁTICO */}
                <div className="w-full lg:w-[450px] flex flex-col space-y-4 shrink-0 overflow-hidden">
                    <Card title="Comando de Campo" className="border-highlight/30 h-full flex flex-col">
                        <div className="space-y-6 flex-1">
                            {renderSelectors(playType, playResult, setPlayType, setPlayResult)}

                            <div className="grid grid-cols-2 gap-4 pt-6 border-t border-white/5">
                                <div>
                                    <label className="text-[10px] font-black text-text-secondary uppercase mb-2 block tracking-widest"># Atleta</label>
                                    <div className="relative">
                                        <input 
                                            type="number" 
                                            className="w-full bg-black/40 border-2 border-white/10 rounded-2xl p-4 text-3xl font-black text-white focus:border-highlight outline-none transition-all"
                                            value={jerseyInput}
                                            onChange={e => setJerseyInput(e.target.value)}
                                            placeholder="00"
                                        />
                                        {selectedPlayer && (
                                            <div className="absolute right-2 top-2 bottom-2 bg-highlight/20 px-3 rounded-xl flex items-center gap-2 animate-fade-in border border-highlight/30">
                                                <LazyImage src={selectedPlayer.avatarUrl} className="w-8 h-8 rounded-full border border-white/20" />
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-text-secondary uppercase mb-2 block tracking-widest">Jardas</label>
                                    <div className="flex gap-2">
                                        <button onClick={() => setYardSide(yardSide === '+' ? '-' : '+')} className={`w-12 rounded-xl font-black text-xl border-2 transition-all ${yardSide === '+' ? 'bg-green-600/20 border-green-500 text-green-400' : 'bg-red-600/20 border-red-500 text-red-400'}`}>
                                            {yardSide}
                                        </button>
                                        <input 
                                            type="number"
                                            className="flex-1 bg-black/40 border-2 border-white/10 rounded-2xl p-4 text-3xl font-black text-white focus:border-highlight outline-none text-center"
                                            value={yards}
                                            onChange={e => setYards(Number(e.target.value))}
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button 
                            onClick={handleSavePlay}
                            disabled={!playResult}
                            className="w-full bg-highlight hover:bg-highlight-hover text-white font-black py-6 rounded-3xl uppercase italic text-xl shadow-glow transform active:scale-95 transition-all disabled:opacity-20 mt-6"
                        >
                            LANÇAR SNAP (SAVE)
                        </button>
                    </Card>

                    <div className="bg-secondary/40 p-4 rounded-2xl border border-white/5 flex items-center justify-between shrink-0">
                         <div className="flex items-center gap-2">
                             {isOnline ? <WifiIcon className="w-4 h-4 text-green-400" /> : <WifiOffIcon className="w-4 h-4 text-red-400 animate-pulse" />}
                             <span className="text-[9px] font-black text-text-secondary uppercase tracking-[0.2em]">{isOnline ? 'Sincronizado' : 'Modo Offline'}</span>
                         </div>
                         <div className="text-right">
                             <p className="text-[8px] text-text-secondary uppercase font-black">Q{activeGame.currentQuarter} • {activeGame.clock}</p>
                         </div>
                    </div>
                </div>

                {/* COLUNA DIREITA: TIMELINE SCROLÁVEL */}
                <div className="flex-1 flex flex-col space-y-4 overflow-hidden pr-1">
                    <div className="flex justify-between items-center px-4 shrink-0">
                        <h3 className="text-[10px] font-black text-white uppercase italic tracking-[0.4em] flex items-center gap-2">
                            <ClockIcon className="w-4 h-4 text-highlight" /> Cronologia do Jogo
                        </h3>
                        <button className="text-[9px] font-black text-purple-400 uppercase border border-purple-500/30 px-4 py-2 rounded-full hover:bg-purple-500 hover:text-white transition-all">
                            RESUMO IA
                        </button>
                    </div>

                    <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-3 custom-scrollbar bg-black/10 rounded-[3rem] p-4 border border-white/5">
                        {(activeGame.timeline || []).map((event) => {
                            const isExpanded = expandedPlayId === event.id;
                            const isEditing = editingPlayId === event.id;

                            return (
                                <div 
                                    key={event.id} 
                                    onClick={() => !isEditing && setExpandedPlayId(isExpanded ? null : event.id)}
                                    className={`bg-secondary/60 backdrop-blur-md rounded-[2rem] border transition-all duration-300 ${isExpanded ? 'border-highlight/50 shadow-glow' : 'border-white/5 hover:border-white/20'} overflow-hidden cursor-pointer`}
                                >
                                    <div className="p-4 flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black italic text-sm ${event.unit === 'OFFENSE' ? 'bg-highlight/10 text-highlight' : event.unit === 'DEFENSE' ? 'bg-blue-600/10 text-blue-400' : 'bg-yellow-600/10 text-yellow-400'}`}>
                                                #{event.primaryJersey || '--'}
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[10px] font-black text-white uppercase tracking-widest">{event.playType}</span>
                                                    <span className={`text-[9px] px-2 py-0.5 rounded font-black ${event.result === 'TOUCHDOWN' ? 'bg-green-600 text-white shadow-glow' : 'bg-white/5 text-text-secondary'}`}>{event.result}</span>
                                                </div>
                                                <p className="text-xs text-text-secondary mt-1">Ganho: <strong className={event.yards! >= 0 ? 'text-green-400' : 'text-red-400'}>{event.yards! >= 0 ? '+' : ''}{event.yards} Yds</strong></p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <span className="text-[9px] font-mono text-text-secondary opacity-40">{new Date(event.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                            <ChevronDownIcon className={`w-4 h-4 text-text-secondary transition-transform duration-300 ${isExpanded ? 'rotate-180 text-highlight' : ''}`} />
                                        </div>
                                    </div>

                                    {/* ÁREA EXPANSÍVEL */}
                                    {isExpanded && (
                                        <div className="px-6 pb-6 pt-2 border-t border-white/5 animate-slide-in">
                                            {!isEditing ? (
                                                <div className="flex justify-between items-center bg-black/20 p-4 rounded-2xl border border-white/5">
                                                    <div className="text-[10px] text-text-secondary font-bold uppercase tracking-widest">
                                                        Unidade: <span className="text-white">{event.unit}</span>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <button 
                                                            onClick={(e) => startEdit(e, event)} 
                                                            className="flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-highlight text-white rounded-xl text-[10px] font-black uppercase transition-all"
                                                        >
                                                            <PenIcon className="w-3 h-3" /> Editar
                                                        </button>
                                                        <button 
                                                            onClick={(e) => { e.stopPropagation(); deletePlay(event.id); }} 
                                                            className="p-2 text-text-secondary hover:text-red-500 transition-colors"
                                                        >
                                                            <TrashIcon className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                /* FORMULÁRIO DE EDIÇÃO IN-PLACE */
                                                <div className="space-y-4 bg-black/40 p-5 rounded-[2rem] border border-highlight/30 animate-fade-in">
                                                    <div className="flex justify-between items-center mb-2">
                                                        <span className="text-[9px] font-black text-highlight uppercase tracking-[0.3em]">Modo Edição</span>
                                                        <button onClick={(e) => { e.stopPropagation(); setEditingPlayId(null); }} className="text-text-secondary"><XIcon className="w-4 h-4"/></button>
                                                    </div>
                                                    
                                                    <div className="grid grid-cols-2 gap-3">
                                                        <input 
                                                            type="number" 
                                                            className="bg-secondary border border-white/10 rounded-xl p-3 text-white text-sm font-bold focus:border-highlight outline-none"
                                                            value={editFormData.primaryJersey || ''}
                                                            onChange={e => setEditFormData({ ...editFormData, primaryJersey: Number(e.target.value) })}
                                                            placeholder="Atleta #"
                                                        />
                                                        <input 
                                                            type="number" 
                                                            className="bg-secondary border border-white/10 rounded-xl p-3 text-white text-sm font-bold focus:border-highlight outline-none"
                                                            value={editFormData.yards || 0}
                                                            onChange={e => setEditFormData({ ...editFormData, yards: Number(e.target.value) })}
                                                            placeholder="Jardas"
                                                        />
                                                    </div>

                                                    <div className="grid grid-cols-2 gap-2">
                                                        <select 
                                                            className="bg-secondary border border-white/10 rounded-xl p-2 text-[10px] font-bold text-white uppercase"
                                                            value={editFormData.playType}
                                                            onChange={e => setEditFormData({ ...editFormData, playType: e.target.value as any })}
                                                        >
                                                            <option value="PASS">PASS</option>
                                                            <option value="RUN">RUN</option>
                                                            <option value="PUNT">PUNT</option>
                                                            <option value="FG">FG</option>
                                                        </select>
                                                        <select 
                                                            className="bg-secondary border border-white/10 rounded-xl p-2 text-[10px] font-bold text-white uppercase"
                                                            value={editFormData.result}
                                                            onChange={e => setEditFormData({ ...editFormData, result: e.target.value as any })}
                                                        >
                                                            <option value="CATCH">CATCH</option>
                                                            <option value="DROP">DROP</option>
                                                            <option value="INT">INT</option>
                                                            <option value="TOUCHDOWN">TOUCHDOWN</option>
                                                            <option value="COMPLETE">GANHO</option>
                                                            <option value="FUMBLE">FUMBLE</option>
                                                        </select>
                                                    </div>

                                                    <button 
                                                        onClick={(e) => { e.stopPropagation(); handleUpdatePlay(); }}
                                                        className="w-full bg-highlight text-white font-black py-3 rounded-2xl uppercase text-[10px] flex items-center justify-center gap-2 shadow-glow"
                                                    >
                                                        <SaveIcon className="w-4 h-4" /> Atualizar Registro
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </div>
                            );
                        })}

                        {(!activeGame.timeline || activeGame.timeline.length === 0) && (
                            <div className="h-full flex flex-col items-center justify-center opacity-20 italic font-black uppercase text-xs tracking-widest text-center px-10 py-20">
                                <WhistleIcon className="w-16 h-16 mb-4" />
                                Aguardando o primeiro snap...
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SidelineHub;
