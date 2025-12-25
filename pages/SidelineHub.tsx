
import React, { useState, useEffect, useMemo, useRef } from 'react';
import Card from '../components/Card';
import { storageService } from '../services/storageService';
import { Game, Player, PlayEvent, GameUnit } from '../types';
import { 
    WhistleIcon, TrophyIcon, UsersIcon, CheckCircleIcon, 
    TrashIcon, SparklesIcon, WifiIcon, WifiOffIcon, ClockIcon,
    PenIcon, ChevronDownIcon, XIcon, SaveIcon, TargetIcon, ActivityIcon
} from '../components/icons/UiIcons';
import LazyImage from '../components/LazyImage';
import { useToast } from '../contexts/ToastContext';

const SidelineHub: React.FC = () => {
    const toast = useToast();
    const [activeGame, setActiveGame] = useState<Game | null>(null);
    const [players, setPlayers] = useState<Player[]>([]);
    const [activeUnit, setActiveUnit] = useState<GameUnit>('OFFENSE');
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    
    // Play Entry State
    const [playType, setPlayType] = useState<'PASS' | 'RUN' | 'PUNT' | 'FG' | 'KICKOFF' | 'PAT' | null>(null);
    const [playResult, setPlayResult] = useState<string | null>(null);
    const [jerseyInput, setJerseyInput] = useState('');
    const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
    const [yardSide, setYardSide] = useState<'+' | '-'>('+');
    const [yards, setYards] = useState<number>(0);

    // Timeline Interaction
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
            toast.warning("Selecione o tipo e o resultado da jogada.");
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
        toast.success("Snap registrado com sucesso.");
        if (scrollRef.current) scrollRef.current.scrollTop = 0;
    };

    const resetConsole = () => {
        setPlayType(null);
        setPlayResult(null);
        setJerseyInput('');
        setYards(0);
        setSelectedPlayer(null);
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

    const renderSelectors = () => {
        if (activeUnit === 'OFFENSE') {
            return (
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-2">
                        <button onClick={() => { setPlayType('PASS'); setPlayResult(null); }} className={`p-4 rounded-xl font-black border-2 transition-all ${playType === 'PASS' ? 'bg-highlight border-highlight text-white' : 'bg-secondary/40 border-white/5 text-text-secondary'}`}>PASSE</button>
                        <button onClick={() => { setPlayType('RUN'); setPlayResult(null); }} className={`p-4 rounded-xl font-black border-2 transition-all ${playType === 'RUN' ? 'bg-highlight border-highlight text-white' : 'bg-secondary/40 border-white/5 text-text-secondary'}`}>CORRIDA</button>
                    </div>
                    {playType && (
                        <div className="grid grid-cols-4 gap-2 animate-fade-in">
                            {(playType === 'PASS' ? ['CATCH', 'DROP', 'INT', 'SACK'] : ['COMPLETE', 'FUMBLE', 'TOUCHDOWN']).map(r => (
                                <button key={r} onClick={() => setPlayResult(r)} className={`py-2 rounded-lg text-[9px] font-black border transition-all ${playResult === r ? 'bg-white text-black' : 'bg-black/20 border-white/10 text-text-secondary'}`}>{r}</button>
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
                        <button key={r} onClick={() => { setPlayType('RUN'); setPlayResult(r); }} className={`p-4 rounded-xl font-black border-2 transition-all ${playResult === r ? 'bg-blue-600 border-blue-500 text-white shadow-glow' : 'bg-secondary/40 border-white/5 text-text-secondary'}`}>{r}</button>
                    ))}
                </div>
            );
        }

        return (
            <div className="grid grid-cols-2 gap-2 animate-fade-in">
                {['PUNT', 'FG', 'KICKOFF', 'PAT'].map(t => (
                    <button key={t} onClick={() => { setPlayType(t as any); setPlayResult('COMPLETE'); }} className={`p-4 rounded-xl font-black border-2 transition-all ${playType === t ? 'bg-yellow-600 border-yellow-500 text-white shadow-glow' : 'bg-secondary/40 border-white/5 text-text-secondary'}`}>{t}</button>
                ))}
            </div>
        );
    };

    if (!activeGame) return null;

    return (
        <div className="flex flex-col h-[calc(100vh-6rem)] gap-6 animate-fade-in overflow-hidden p-2">
            
            {/* TABS DE UNIDADE - ALTA VISIBILIDADE */}
            <div className="flex bg-secondary/80 backdrop-blur-md p-1 rounded-2xl border border-white/10 shrink-0">
                <button 
                    onClick={() => { setActiveUnit('OFFENSE'); resetConsole(); }} 
                    className={`flex-1 py-4 rounded-xl text-xs font-black uppercase transition-all ${activeUnit === 'OFFENSE' ? 'bg-highlight text-white shadow-glow' : 'text-text-secondary hover:text-white'}`}
                >
                    ATAQUE
                </button>
                <button 
                    onClick={() => { setActiveUnit('DEFENSE'); resetConsole(); }} 
                    className={`flex-1 py-4 rounded-xl text-xs font-black uppercase transition-all ${activeUnit === 'DEFENSE' ? 'bg-blue-600 text-white shadow-glow' : 'text-text-secondary hover:text-white'}`}
                >
                    DEFESA
                </button>
                <button 
                    onClick={() => { setActiveUnit('ST'); resetConsole(); }} 
                    className={`flex-1 py-4 rounded-xl text-xs font-black uppercase transition-all ${activeUnit === 'ST' ? 'bg-yellow-600 text-white shadow-glow' : 'text-text-secondary hover:text-white'}`}
                >
                    ST (ESPECIAIS)
                </button>
            </div>

            <div className="flex-1 flex flex-col lg:flex-row gap-6 overflow-hidden">
                
                {/* COLUNA ESQUERDA: CONSOLE DE LANÇAMENTO (ESTÁTICO) */}
                <div className="w-full lg:w-[480px] shrink-0 flex flex-col overflow-hidden">
                    <Card className="flex-1 flex flex-col border-highlight/20 bg-gradient-to-b from-secondary/80 to-black/40">
                        <div className="flex-1 space-y-8 overflow-y-auto no-scrollbar pr-1">
                            <div className="flex justify-between items-center mb-2">
                                <h3 className="text-xl font-black text-white italic uppercase tracking-tighter">Console de Campo</h3>
                                <div className="bg-black/60 px-3 py-1 rounded-xl border border-white/10">
                                    <span className="text-[10px] font-mono text-highlight">{activeGame.clock}</span>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <p className="text-[10px] font-black text-text-secondary uppercase tracking-widest border-l-2 border-highlight pl-2">1. Selecione a Ação</p>
                                {renderSelectors()}
                            </div>

                            <div className="grid grid-cols-2 gap-4 border-t border-white/5 pt-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-text-secondary uppercase tracking-widest">2. Atleta (#)</label>
                                    <div className="relative group">
                                        <input 
                                            type="number" 
                                            className="w-full bg-black/40 border-2 border-white/10 rounded-2xl p-4 text-4xl font-black text-white focus:border-highlight outline-none transition-all"
                                            value={jerseyInput}
                                            onChange={e => setJerseyInput(e.target.value)}
                                            placeholder="00"
                                        />
                                        {selectedPlayer && (
                                            <div className="absolute right-3 top-3 bottom-3 bg-highlight/20 rounded-xl px-2 flex items-center gap-2 border border-highlight/40 animate-fade-in">
                                                <LazyImage src={selectedPlayer.avatarUrl} className="w-8 h-8 rounded-full border border-white/10" />
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-text-secondary uppercase tracking-widest">3. Ganho (Yds)</label>
                                    <div className="flex gap-2">
                                        <button onClick={() => setYardSide(yardSide === '+' ? '-' : '+')} className={`w-14 rounded-2xl font-black text-2xl border-2 transition-all ${yardSide === '+' ? 'bg-green-600/20 border-green-500 text-green-400' : 'bg-red-600/20 border-red-500 text-red-400'}`}>
                                            {yardSide}
                                        </button>
                                        <input 
                                            type="number"
                                            className="flex-1 bg-black/40 border-2 border-white/10 rounded-2xl p-4 text-4xl font-black text-white focus:border-highlight outline-none text-center"
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

                    <div className="mt-4 bg-secondary/40 p-4 rounded-2xl border border-white/5 flex items-center justify-between shadow-lg">
                         <div className="flex items-center gap-3">
                             {isOnline ? <div className="w-2 h-2 rounded-full bg-green-500 shadow-glow animate-pulse"></div> : <WifiOffIcon className="w-4 h-4 text-red-500"/>}
                             <span className="text-[9px] font-black text-text-secondary uppercase tracking-[0.2em]">{isOnline ? 'Sincronizado' : 'Offline'}</span>
                         </div>
                         <span className="text-[9px] font-black text-text-secondary uppercase">Q{activeGame.currentQuarter} • {activeGame.clock}</span>
                    </div>
                </div>

                {/* COLUNA DIREITA: CRONOLOGIA (SCROLÁVEL) */}
                <div className="flex-1 flex flex-col space-y-4 overflow-hidden">
                    <div className="flex justify-between items-center px-4 shrink-0">
                        <h3 className="text-[11px] font-black text-white uppercase italic tracking-[0.5em] flex items-center gap-3">
                            <ClockIcon className="w-4 h-4 text-highlight" /> Cronologia do Jogo
                        </h3>
                        <div className="flex gap-2">
                             <button className="text-[9px] font-black text-purple-400 uppercase border border-purple-500/30 px-4 py-1.5 rounded-full hover:bg-purple-500 hover:text-white transition-all">Relatório IA</button>
                        </div>
                    </div>

                    <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar bg-black/10 rounded-[3rem] p-6 border border-white/5 relative">
                        {/* Linha vertical decorativa */}
                        <div className="absolute left-10 top-10 bottom-10 w-0.5 bg-white/5 -z-10"></div>

                        {(activeGame.timeline || []).map((event, idx) => {
                            const isExpanded = expandedPlayId === event.id;
                            const isEditing = editingPlayId === event.id;
                            const unitColor = event.unit === 'OFFENSE' ? 'border-highlight' : event.unit === 'DEFENSE' ? 'border-blue-600' : 'border-yellow-600';

                            return (
                                <div 
                                    key={event.id} 
                                    onClick={() => !isEditing && setExpandedPlayId(isExpanded ? null : event.id)}
                                    className={`relative pl-10 animate-slide-in`}
                                >
                                    <div className={`absolute left-[36px] top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full border-2 bg-black ${unitColor}`}></div>
                                    
                                    <div className={`bg-secondary/60 backdrop-blur-md rounded-[2rem] border transition-all duration-300 ${isExpanded ? 'border-highlight/50 shadow-glow scale-[1.01]' : 'border-white/5 hover:border-white/20 hover:bg-secondary/80'} overflow-hidden cursor-pointer`}>
                                        <div className="p-4 flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="text-center w-8">
                                                    <p className="text-[10px] font-black text-white italic">#{event.primaryJersey}</p>
                                                </div>
                                                <div className="w-px h-6 bg-white/10"></div>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-[10px] font-black text-white uppercase tracking-widest">{event.playType}</span>
                                                        <span className={`text-[8px] px-1.5 py-0.5 rounded font-black ${event.result === 'TOUCHDOWN' ? 'bg-green-600 text-white' : 'bg-white/5 text-text-secondary'}`}>{event.result}</span>
                                                    </div>
                                                    <p className={`text-[10px] font-bold mt-0.5 ${event.yards! >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                                        {event.yards! >= 0 ? '+' : ''}{event.yards} Yds
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                <span className="text-[9px] font-mono text-text-secondary opacity-40">{new Date(event.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                                <ChevronDownIcon className={`w-4 h-4 text-text-secondary transition-transform ${isExpanded ? 'rotate-180 text-highlight' : ''}`} />
                                            </div>
                                        </div>

                                        {/* EXPANSÃO E EDIÇÃO IN-PLACE */}
                                        {isExpanded && (
                                            <div className="px-6 pb-6 pt-2 border-t border-white/5 animate-fade-in bg-black/20">
                                                {!isEditing ? (
                                                    <div className="flex justify-between items-center">
                                                        <div className="flex gap-4">
                                                            <div>
                                                                <p className="text-[8px] text-text-secondary font-black uppercase">Unidade</p>
                                                                <p className="text-[10px] text-white font-bold">{event.unit}</p>
                                                            </div>
                                                        </div>
                                                        <div className="flex gap-2">
                                                            <button 
                                                                onClick={(e) => { e.stopPropagation(); setEditingPlayId(event.id); setEditFormData({...event}); }} 
                                                                className="flex items-center gap-2 px-4 py-2 bg-highlight/10 hover:bg-highlight text-highlight hover:text-white rounded-xl text-[9px] font-black uppercase transition-all"
                                                            >
                                                                <PenIcon className="w-3 h-3" /> Editar
                                                            </button>
                                                            <button 
                                                                onClick={(e) => { e.stopPropagation(); if(window.confirm("Anular este registro?")) { /* delete */ } }} 
                                                                className="p-2 text-text-secondary hover:text-red-500 transition-colors"
                                                            >
                                                                <TrashIcon className="w-4 h-4" />
                                                            </button>
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="space-y-4 bg-black/40 p-4 rounded-2xl border border-highlight/30">
                                                        <div className="flex justify-between items-center">
                                                            <span className="text-[9px] font-black text-highlight uppercase tracking-widest">Modo Edição</span>
                                                            <button onClick={() => setEditingPlayId(null)}><XIcon className="w-4 h-4 text-text-secondary"/></button>
                                                        </div>
                                                        <div className="grid grid-cols-3 gap-2">
                                                            <input 
                                                                type="number" 
                                                                className="bg-secondary border border-white/10 rounded-lg p-2 text-white text-xs font-bold"
                                                                value={editFormData.primaryJersey || ''}
                                                                onChange={e => setEditFormData({ ...editFormData, primaryJersey: Number(e.target.value) })}
                                                                placeholder="#"
                                                            />
                                                            <input 
                                                                type="number" 
                                                                className="bg-secondary border border-white/10 rounded-lg p-2 text-white text-xs font-bold"
                                                                value={editFormData.yards || 0}
                                                                onChange={e => setEditFormData({ ...editFormData, yards: Number(e.target.value) })}
                                                                placeholder="Yds"
                                                            />
                                                            <select 
                                                                className="bg-secondary border border-white/10 rounded-lg p-2 text-[9px] font-bold text-white uppercase"
                                                                value={editFormData.playType}
                                                                onChange={e => setEditFormData({ ...editFormData, playType: e.target.value as any })}
                                                            >
                                                                <option value="PASS">PASS</option><option value="RUN">RUN</option>
                                                            </select>
                                                        </div>
                                                        <button 
                                                            onClick={(e) => { e.stopPropagation(); handleUpdatePlay(); }}
                                                            className="w-full bg-highlight text-white font-black py-2 rounded-xl uppercase text-[9px] shadow-glow"
                                                        >
                                                            Confirmar Alteração
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}

                        {(!activeGame.timeline || activeGame.timeline.length === 0) && (
                            <div className="h-full flex flex-col items-center justify-center opacity-10 italic font-black uppercase text-xs tracking-widest text-center px-10 py-40">
                                <ActivityIcon className="w-16 h-16 mb-6" />
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