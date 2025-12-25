
import React, { useState, useEffect, useRef } from 'react';
import Card from '../components/Card';
import { storageService } from '../services/storageService';
import { Game, Player, PlayEvent, GameUnit } from '../types';
import { 
    WhistleIcon, ClockIcon, PenIcon, ChevronDownIcon, TrashIcon
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

    const [expandedPlayId, setExpandedPlayId] = useState<string | null>(null);
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
        const handleSync = () => setIsOnline(navigator.onLine);
        window.addEventListener('online', handleSync);
        window.addEventListener('offline', handleSync);
        return () => {
            window.removeEventListener('online', handleSync);
            window.removeEventListener('offline', handleSync);
        };
    }, []);

    useEffect(() => {
        if (jerseyInput.length > 0) {
            const found = players.find(p => String(p.jerseyNumber) === jerseyInput);
            setSelectedPlayer(found || null);
        } else setSelectedPlayer(null);
    }, [jerseyInput, players]);

    const handleSavePlay = () => {
        if (!activeGame || !playType || !playResult) {
            toast.warning("Selecione a Ação");
            return;
        }
        const newEvent: PlayEvent = {
            id: `play-${Date.now()}`,
            gameId: activeGame.id,
            timestamp: new Date(),
            unit: activeUnit,
            playType,
            result: playResult as any,
            primaryJersey: Number(jerseyInput),
            yards: yardSide === '+' ? yards : -yards,
            isVerified: false
        };
        storageService.savePlayEvent(activeGame.id, newEvent);
        resetConsole();
        toast.success("Snap arquivado.");
    };

    const resetConsole = () => {
        setPlayType(null);
        setPlayResult(null);
        setJerseyInput('');
        setYards(0);
    };

    const renderActionGrid = () => {
        const actions = activeUnit === 'OFFENSE' 
            ? [{id:'PASS', l:'PASSE'}, {id:'RUN', l:'CORRIDA'}, {id:'PUNT', l:'PUNT'}, {id:'FG', l:'FG'}, {id:'KICKOFF', l:'K.OFF'}, {id:'PAT', l:'PAT'}]
            : activeUnit === 'DEFENSE'
            ? [{id:'RUN', res:'TACKLE', l:'TACKLE'}, {id:'PASS', res:'SACK', l:'SACK'}, {id:'PASS', res:'INT', l:'INT'}, {id:'RUN', res:'FUMBLE', l:'FUMBLE'}]
            : [{id:'PUNT', l:'PUNT'}, {id:'FG', l:'FG'}, {id:'KICKOFF', l:'K.OFF'}, {id:'PAT', l:'PAT'}];

        return (
            <div className="grid grid-cols-3 gap-2">
                {actions.map(a => (
                    <button 
                        key={a.id + a.l}
                        onClick={() => { setPlayType(a.id as any); setPlayResult(a.res || 'COMPLETE'); }}
                        className={`py-3.5 rounded-xl text-[10px] font-black uppercase transition-all border-2 ${playType === a.id && (a.res ? playResult === a.res : true) ? 'bg-highlight border-highlight text-white shadow-glow' : 'bg-black/20 border-white/5 text-text-secondary hover:border-white/20'}`}
                    >
                        {a.l}
                    </button>
                ))}
            </div>
        );
    };

    if (!activeGame) return null;

    return (
        <div className="flex flex-col lg:flex-row h-[calc(100vh-5rem)] gap-4 animate-fade-in overflow-hidden p-2">
            
            {/* CONSOLE COMPACTO (ESQUERDA) */}
            <div className="w-full lg:w-[420px] shrink-0 flex flex-col gap-3">
                <div className="bg-secondary/60 backdrop-blur-xl border border-white/10 rounded-[2.5rem] p-5 flex flex-col shadow-2xl h-full overflow-hidden">
                    
                    {/* Unidade & Clock Integrados */}
                    <div className="flex flex-col gap-4 mb-4">
                        <div className="flex justify-between items-center">
                            <h3 className="text-xs font-black text-white italic uppercase tracking-widest">Sideline Console</h3>
                            <div className="bg-black/60 px-3 py-1 rounded-lg border border-highlight/20 font-mono text-highlight text-xs font-bold">
                                {activeGame.clock}
                            </div>
                        </div>
                        
                        <div className="flex bg-black/40 p-1 rounded-xl border border-white/5">
                            {['OFFENSE', 'DEFENSE', 'ST'].map(u => (
                                <button 
                                    key={u} 
                                    onClick={() => { setActiveUnit(u as any); resetConsole(); }} 
                                    className={`flex-1 py-2 rounded-lg text-[9px] font-black transition-all ${activeUnit === u ? 'bg-highlight text-white shadow-lg' : 'text-text-secondary'}`}
                                >
                                    {u === 'ST' ? 'ST' : u === 'OFFENSE' ? 'ATAQUE' : 'DEFESA'}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-4 flex-1 overflow-y-auto no-scrollbar">
                        {/* 1. Ações Rápidas */}
                        <section>
                            <p className="text-[9px] font-black text-text-secondary uppercase tracking-widest mb-2 ml-1">1. Escolha a Jogada</p>
                            {renderActionGrid()}
                        </section>

                        {/* 2. Cluster Numérico Otimizado para não vazar */}
                        <section className="grid grid-cols-2 gap-3 pt-4 border-t border-white/5">
                            <div className="min-w-0">
                                <label className="text-[9px] font-black text-text-secondary uppercase mb-1.5 block ml-1">2. Atleta (#)</label>
                                <div className="relative">
                                    <input 
                                        type="number" 
                                        className="w-full bg-black/40 border-2 border-white/10 rounded-xl p-3 text-3xl font-black text-white focus:border-highlight outline-none transition-all"
                                        value={jerseyInput}
                                        onChange={e => setJerseyInput(e.target.value)}
                                        placeholder="00"
                                    />
                                    {selectedPlayer && (
                                        <div className="absolute right-2 top-2 bottom-2 bg-highlight/20 rounded-lg px-2 flex items-center border border-highlight/30">
                                            <LazyImage src={selectedPlayer.avatarUrl} className="w-7 h-7 rounded-full" />
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div className="min-w-0">
                                <label className="text-[9px] font-black text-text-secondary uppercase mb-1.5 block ml-1">3. Jardas (Yds)</label>
                                <div className="flex gap-1.5">
                                    <button 
                                        onClick={() => setYardSide(yardSide === '+' ? '-' : '+')} 
                                        className={`w-10 h-14 rounded-xl font-black text-lg border-2 transition-all shrink-0 ${yardSide === '+' ? 'bg-green-600/20 border-green-500 text-green-400' : 'bg-red-600/20 border-red-500 text-red-400'}`}
                                    >
                                        {yardSide}
                                    </button>
                                    <input 
                                        type="number"
                                        className="flex-1 min-w-0 bg-black/40 border-2 border-white/10 rounded-xl p-3 text-3xl font-black text-white focus:border-highlight outline-none text-center"
                                        value={yards}
                                        onChange={e => setYards(Number(e.target.value))}
                                    />
                                </div>
                            </div>
                        </section>
                    </div>

                    <button 
                        onClick={handleSavePlay}
                        disabled={!playType}
                        className="w-full bg-highlight hover:bg-highlight-hover text-white font-black py-5 rounded-[2rem] uppercase italic text-lg shadow-glow transform active:scale-95 transition-all disabled:opacity-10 mt-4"
                    >
                        ARQUIVAR SNAP
                    </button>
                </div>

                {/* Status Bar */}
                <div className="bg-black/20 p-3 rounded-3xl border border-white/5 flex justify-between items-center px-5 shrink-0">
                    <div className="flex items-center gap-2">
                        <div className={`w-1.5 h-1.5 rounded-full ${isOnline ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`}></div>
                        <span className="text-[8px] font-black text-text-secondary uppercase tracking-widest">{isOnline ? 'Cloud Sync' : 'Offline Mode'}</span>
                    </div>
                    <span className="text-[8px] font-black text-text-secondary uppercase">Q{activeGame.currentQuarter} • {activeGame.clock}</span>
                </div>
            </div>

            {/* TIMELINE FLUIDA (DIREITA) */}
            <div className="flex-1 flex flex-col gap-3 min-h-0">
                <div className="flex justify-between items-center px-4 shrink-0">
                    <h3 className="text-[10px] font-black text-white uppercase italic tracking-[0.4em] flex items-center gap-2">
                        Histórico de Campo
                    </h3>
                </div>

                <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar bg-black/10 rounded-[2.5rem] p-4 border border-white/5 relative">
                    {(activeGame.timeline || []).map((event) => (
                        <div 
                            key={event.id} 
                            onClick={() => setExpandedPlayId(expandedPlayId === event.id ? null : event.id)}
                            className={`bg-secondary/40 backdrop-blur-md rounded-2xl border border-white/5 p-3 cursor-pointer transition-all hover:bg-secondary/60 ${expandedPlayId === event.id ? 'border-highlight/40 ring-1 ring-highlight/20' : ''}`}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <span className="text-lg font-black text-white italic w-8">#{event.primaryJersey}</span>
                                    <div className="w-px h-6 bg-white/10"></div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] font-black text-white uppercase tracking-widest">{event.playType}</span>
                                            <span className={`text-[8px] px-1.5 rounded font-black ${event.result === 'TOUCHDOWN' ? 'bg-green-600 text-white' : 'bg-white/5 text-text-secondary'}`}>{event.result}</span>
                                        </div>
                                        <p className={`text-[10px] font-bold ${event.yards! >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                            {event.yards! >= 0 ? '+' : ''}{event.yards} Yds
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-[9px] font-mono text-text-secondary opacity-40">{new Date(event.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                    <ChevronDownIcon className={`w-4 h-4 text-text-secondary transition-transform ${expandedPlayId === event.id ? 'rotate-180 text-highlight' : ''}`} />
                                </div>
                            </div>
                            
                            {expandedPlayId === event.id && (
                                <div className="mt-3 pt-3 border-t border-white/5 flex justify-end gap-2 animate-fade-in">
                                    <button className="p-2 bg-white/5 hover:bg-white/10 rounded-lg text-text-secondary hover:text-white transition-colors"><PenIcon className="w-3 h-3"/></button>
                                    <button className="p-2 bg-white/5 hover:bg-red-500/20 rounded-lg text-text-secondary hover:text-red-500 transition-colors"><TrashIcon className="w-3 h-3"/></button>
                                </div>
                            )}
                        </div>
                    ))}

                    {(!activeGame.timeline || activeGame.timeline.length === 0) && (
                        <div className="h-full flex flex-col items-center justify-center opacity-10 italic font-black uppercase text-xs text-center py-20">
                            Aguardando Kickoff...
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SidelineHub;
