
import React, { useState, useEffect, useRef } from 'react';
import Card from '../components/Card';
import { storageService } from '../services/storageService';
import { Game, Player, PlayEvent, GameUnit } from '../types';
import { 
    WhistleIcon, ClockIcon, PenIcon, 
    ChevronDownIcon, TrashIcon, CheckCircleIcon,
    PlusIcon, ActivityIcon
} from '../components/icons/UiIcons';
import LazyImage from '../components/LazyImage';
import { useToast } from '../contexts/ToastContext';

const SidelineHub: React.FC = () => {
    const toast = useToast();
    const [activeGame, setActiveGame] = useState<Game | null>(null);
    const [players, setPlayers] = useState<Player[]>([]);
    const [activeUnit, setActiveUnit] = useState<GameUnit>('OFFENSE');
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    
    // Entry State
    const [playType, setPlayType] = useState<'PASS' | 'RUN' | 'ST' | null>(null);
    const [playResult, setPlayResult] = useState<string | null>(null);
    const [jerseyInput, setJerseyInput] = useState('');
    const [yards, setYards] = useState<number>(0);
    const [yardSide, setYardSide] = useState<'+' | '-'>('+');

    const [expandedPlayId, setExpandedPlayId] = useState<string | null>(null);

    useEffect(() => {
        const load = () => {
            const games = storageService.getGames();
            const live = games.find(g => g.status === 'IN_PROGRESS') || games[0];
            setActiveGame(live);
            setPlayers(storageService.getPlayers());
        };
        load();
        window.addEventListener('online', () => setIsOnline(true));
        window.addEventListener('offline', () => setIsOnline(false));
    }, []);

    const handleSavePlay = () => {
        if (!activeGame || !playType || !playResult) {
            toast.warning("Preencha todos os campos do snap.");
            return;
        }
        const newEvent: PlayEvent = {
            id: `snap-${Date.now()}`,
            gameId: activeGame.id,
            timestamp: new Date(),
            unit: activeUnit,
            playType: playType as any,
            result: playResult as any,
            primaryJersey: Number(jerseyInput) || 0,
            yards: yardSide === '+' ? yards : -yards,
            isVerified: true
        };
        storageService.savePlayEvent(activeGame.id, newEvent);
        resetConsole();
        toast.success("Snap arquivado!");
    };

    const resetConsole = () => {
        setPlayType(null);
        setPlayResult(null);
        setJerseyInput('');
        setYards(0);
    };

    if (!activeGame) return <div className="text-white text-center py-20 italic">Aguardando início do jogo...</div>;

    return (
        <div className="flex flex-col lg:flex-row h-[calc(100vh-6rem)] gap-6 animate-fade-in overflow-hidden p-2">
            
            {/* CONSOLE DE CAMPO (FIELD-GRADE UI) */}
            <div className="w-full lg:w-[450px] shrink-0 flex flex-col gap-4">
                <div className="bg-secondary/60 backdrop-blur-2xl border border-white/10 rounded-[3rem] p-8 flex flex-col shadow-2xl h-full overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-8 opacity-5">
                         <WhistleIcon className="w-32 h-32 text-white" />
                    </div>

                    <div className="flex justify-between items-start mb-8 relative z-10">
                        <div>
                            <h3 className="text-xl font-black text-white italic uppercase tracking-tighter leading-none">Sideline Console</h3>
                            <p className="text-highlight text-[9px] font-black uppercase tracking-[0.3em] mt-2 italic">Unidade Ativa: {activeUnit}</p>
                        </div>
                        <div className="bg-black/60 px-4 py-2 rounded-2xl border border-highlight/30 text-highlight font-mono font-black text-xl shadow-glow">
                            {activeGame.clock || '00:00'}
                        </div>
                    </div>

                    <div className="flex bg-black/40 p-1.5 rounded-2xl border border-white/5 mb-8">
                        {['OFFENSE', 'DEFENSE', 'ST'].map(u => (
                            <button 
                                key={u} 
                                onClick={() => { setActiveUnit(u as any); resetConsole(); }} 
                                className={`flex-1 py-3 rounded-xl text-[10px] font-black transition-all ${activeUnit === u ? 'bg-highlight text-white shadow-lg' : 'text-text-secondary hover:text-white'}`}
                            >
                                {u === 'OFFENSE' ? 'ATAQUE' : u === 'DEFENSE' ? 'DEFESA' : 'ST'}
                            </button>
                        ))}
                    </div>

                    <div className="space-y-6 flex-1 overflow-y-auto custom-scrollbar pr-1">
                        {/* 1. Play Type Selector */}
                        <section>
                            <p className="text-[10px] font-black text-text-secondary uppercase tracking-widest mb-3 ml-2">1. Tipo de Snap</p>
                            <div className="grid grid-cols-2 gap-3">
                                {['PASS', 'RUN'].map(t => (
                                    <button 
                                        key={t}
                                        onClick={() => { setPlayType(t as any); setPlayResult('COMPLETE'); }}
                                        className={`py-6 rounded-2xl font-black text-lg transition-all border-2 ${playType === t ? 'bg-highlight border-highlight text-white shadow-glow' : 'bg-black/20 border-white/5 text-text-secondary'}`}
                                    >
                                        {t === 'PASS' ? 'PASSE' : 'CORRIDA'}
                                    </button>
                                ))}
                            </div>
                        </section>

                        {/* 2. Primary Athlete & Yards */}
                        <section className="grid grid-cols-2 gap-4 pt-6 border-t border-white/5">
                            <div>
                                <label className="text-[10px] font-black text-text-secondary uppercase mb-2 block ml-2">2. Atleta (#)</label>
                                <input 
                                    type="number" 
                                    className="w-full bg-black/40 border-2 border-white/10 rounded-2xl p-4 text-4xl font-black text-white focus:border-highlight outline-none text-center shadow-inner"
                                    value={jerseyInput}
                                    onChange={e => setJerseyInput(e.target.value)}
                                    placeholder="--"
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-text-secondary uppercase mb-2 block ml-2">3. Ganho (Yds)</label>
                                <div className="flex gap-2">
                                    <button 
                                        onClick={() => setYardSide(yardSide === '+' ? '-' : '+')}
                                        className={`w-14 rounded-2xl font-black text-2xl border-2 transition-all ${yardSide === '+' ? 'bg-green-600/20 border-green-500 text-green-400' : 'bg-red-600/20 border-red-500 text-red-400'}`}
                                    >
                                        {yardSide}
                                    </button>
                                    <input 
                                        type="number"
                                        className="flex-1 bg-black/40 border-2 border-white/10 rounded-2xl p-4 text-4xl font-black text-white focus:border-highlight outline-none text-center shadow-inner"
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
                        className="w-full bg-highlight hover:bg-highlight-hover text-white font-black py-6 rounded-[2.5rem] uppercase italic text-xl shadow-glow transform active:scale-95 transition-all disabled:opacity-20 mt-6"
                    >
                        ARQUIVAR SNAP
                    </button>
                </div>

                <div className="bg-black/20 p-4 rounded-3xl border border-white/5 flex justify-between items-center px-6">
                    <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-red-500'}`}></div>
                        <span className="text-[10px] font-black text-text-secondary uppercase tracking-widest">{isOnline ? 'Cloud Sync' : 'Offline Mode'}</span>
                    </div>
                    <span className="text-[10px] font-black text-white italic uppercase">{activeGame.opponent} DRIVE</span>
                </div>
            </div>

            {/* TIMELINE DE CAMPO (DIREITA) */}
            <div className="flex-1 flex flex-col gap-4 overflow-hidden">
                <div className="flex justify-between items-center px-4">
                    <h3 className="text-xs font-black text-white uppercase italic tracking-[0.4em]">Live Timeline</h3>
                    <div className="flex gap-2">
                        <div className="bg-secondary/60 px-4 py-2 rounded-xl border border-white/5 text-[10px] font-black text-text-secondary">ATAQUE: <span className="text-white">{(activeGame.timeline || []).filter(e => e.unit === 'OFFENSE').length} SNAPS</span></div>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar bg-black/10 rounded-[3rem] p-6 border border-white/5">
                    {(activeGame.timeline || []).length > 0 ? (
                        [...activeGame.timeline].reverse().map((event) => (
                            <div 
                                key={event.id} 
                                onClick={() => setExpandedPlayId(expandedPlayId === event.id ? null : event.id)}
                                className={`bg-secondary/40 backdrop-blur-md rounded-[2rem] border border-white/5 p-5 cursor-pointer transition-all hover:bg-secondary/60 ${expandedPlayId === event.id ? 'border-highlight shadow-glow' : ''}`}
                            >
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-6">
                                        <div className="w-12 h-12 bg-black/60 rounded-2xl flex items-center justify-center font-black text-highlight text-xl italic border border-highlight/20 shadow-2xl">
                                            #{event.primaryJersey}
                                        </div>
                                        <div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-xs font-black text-white uppercase tracking-widest">{event.playType}</span>
                                                {event.result === 'TOUCHDOWN' && <span className="text-[8px] bg-yellow-500 text-black px-2 py-0.5 rounded-full font-black animate-pulse">TOUCHDOWN!</span>}
                                            </div>
                                            <p className={`text-sm font-black italic ${event.yards! >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                                {event.yards! >= 0 ? '+' : ''}{event.yards} YARDS
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4">
                                        <span className="text-[10px] font-mono text-text-secondary opacity-40 uppercase">{new Date(event.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                        <ChevronDownIcon className={`w-5 h-5 text-text-secondary transition-transform ${expandedPlayId === event.id ? 'rotate-180 text-highlight' : ''}`} />
                                    </div>
                                </div>
                                
                                {expandedPlayId === event.id && (
                                    <div className="mt-5 pt-5 border-t border-white/5 flex justify-between items-center animate-fade-in">
                                        <div className="flex gap-2">
                                            <span className="text-[8px] font-black text-text-secondary uppercase border border-white/10 px-2 py-1 rounded">Unit: {event.unit}</span>
                                            <span className="text-[8px] font-black text-text-secondary uppercase border border-white/10 px-2 py-1 rounded">Verified</span>
                                        </div>
                                        <div className="flex gap-2">
                                            <button className="p-2 bg-white/5 hover:bg-white/10 rounded-xl text-text-secondary transition-all"><PenIcon className="w-4 h-4"/></button>
                                            <button className="p-2 bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white rounded-xl transition-all"><TrashIcon className="w-4 h-4"/></button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center opacity-10 py-40">
                             <ActivityIcon className="w-20 h-20 mb-4" />
                             <p className="font-black uppercase tracking-[0.5em] text-center">Aguardando Kickoff</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SidelineHub;
