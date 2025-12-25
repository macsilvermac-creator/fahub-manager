
import React, { useState, useEffect, useMemo, useRef } from 'react';
import Card from '../components/Card';
import { storageService } from '../services/storageService';
import { Game, Player, PlayEvent, GameUnit } from '../types';
import { 
    WhistleIcon, TrophyIcon, UsersIcon, CheckCircleIcon, 
    TrashIcon, SparklesIcon, WifiIcon, WifiOffIcon, ClockIcon 
} from '../components/icons/UiIcons';
import LazyImage from '../components/LazyImage';
import { useToast } from '../contexts/ToastContext';
import Modal from '../components/Modal';

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

    // Lookup de atleta
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
        
        // Reset Form
        setPlayType(null);
        setPlayResult(null);
        setJerseyInput('');
        setYards(0);
        setSelectedPlayer(null);
        
        toast.success("Míssil Lançado! Jogada salva.");
        
        // Auto-scroll para o topo do feed
        if (scrollRef.current) {
            scrollRef.current.scrollTop = 0;
        }
    };

    const deletePlay = (id: string) => {
        if (activeGame) {
            const updatedTimeline = (activeGame.timeline || []).filter(e => e.id !== id);
            storageService.updateLiveGame(activeGame.id, { timeline: updatedTimeline });
            toast.info("Jogada anulada.");
        }
    };

    const renderSelectors = () => {
        if (activeUnit === 'OFFENSE') {
            return (
                <div className="grid grid-cols-2 gap-2 animate-fade-in">
                    <button onClick={() => { setPlayType('PASS'); setPlayResult(null); }} className={`p-4 rounded-xl font-black border-2 transition-all ${playType === 'PASS' ? 'bg-highlight border-highlight text-white' : 'bg-secondary border-white/5 text-text-secondary'}`}>PASSE</button>
                    <button onClick={() => { setPlayType('RUN'); setPlayResult(null); }} className={`p-4 rounded-xl font-black border-2 transition-all ${playType === 'RUN' ? 'bg-highlight border-highlight text-white' : 'bg-secondary border-white/5 text-text-secondary'}`}>CORRIDA</button>
                    
                    {playType === 'PASS' && (
                        <div className="col-span-2 grid grid-cols-4 gap-1 mt-2 animate-slide-in">
                            {['CATCH', 'DROP', 'INT', 'SACK'].map(r => (
                                <button key={r} onClick={() => setPlayResult(r)} className={`p-2 rounded-lg text-[10px] font-black border transition-all ${playResult === r ? 'bg-blue-600 border-blue-500 text-white' : 'bg-black/40 border-white/10 text-text-secondary'}`}>{r}</button>
                            ))}
                        </div>
                    )}
                    {playType === 'RUN' && (
                        <div className="col-span-2 grid grid-cols-2 gap-1 mt-2 animate-slide-in">
                            {['COMPLETE', 'FUMBLE'].map(r => (
                                <button key={r} onClick={() => setPlayResult(r)} className={`p-2 rounded-lg text-[10px] font-black border transition-all ${playResult === r ? 'bg-orange-600 border-orange-500 text-white' : 'bg-black/40 border-white/10 text-text-secondary'}`}>{r === 'COMPLETE' ? 'GANHO' : 'FUMBLE'}</button>
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
                        <button key={r} onClick={() => { setPlayType('RUN'); setPlayResult(r); }} className={`p-4 rounded-xl font-black border-2 transition-all ${playResult === r ? 'bg-blue-600 border-blue-500 text-white' : 'bg-secondary border-white/5 text-text-secondary'}`}>{r}</button>
                    ))}
                </div>
            );
        }

        return (
            <div className="grid grid-cols-3 gap-2 animate-fade-in">
                {['PUNT', 'FG', 'KICKOFF', 'PAT'].map(t => (
                    <button key={t} onClick={() => { setPlayType(t as any); setPlayResult('COMPLETE'); }} className={`p-3 rounded-xl font-black border-2 transition-all ${playType === t ? 'bg-yellow-600 border-yellow-500 text-white' : 'bg-secondary border-white/5 text-text-secondary'}`}>{t}</button>
                ))}
            </div>
        );
    };

    if (!activeGame) return <div className="p-10 text-center opacity-30 uppercase font-black">Aguardando Início do Jogo...</div>;

    return (
        <div className="flex flex-col h-[calc(100vh-5rem)] space-y-4 animate-fade-in overflow-hidden">
            
            {/* MODO SELETOR (TOP BAR) */}
            <div className="grid grid-cols-3 gap-2 shrink-0">
                <button onClick={() => { setActiveUnit('OFFENSE'); setPlayType(null); }} className={`py-4 rounded-2xl font-black text-xs transition-all border-b-4 ${activeUnit === 'OFFENSE' ? 'bg-highlight/10 border-highlight text-white' : 'bg-secondary border-white/5 text-text-secondary'}`}>ATAQUE</button>
                <button onClick={() => { setActiveUnit('DEFENSE'); setPlayType(null); }} className={`py-4 rounded-2xl font-black text-xs transition-all border-b-4 ${activeUnit === 'DEFENSE' ? 'bg-blue-600/10 border-blue-600 text-white' : 'bg-secondary border-white/5 text-text-secondary'}`}>DEFESA</button>
                <button onClick={() => { setActiveUnit('ST'); setPlayType(null); }} className={`py-4 rounded-2xl font-black text-xs transition-all border-b-4 ${activeUnit === 'ST' ? 'bg-yellow-600/10 border-yellow-600 text-white' : 'bg-secondary border-white/5 text-text-secondary'}`}>SPECIAL TEAMS</button>
            </div>

            <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-6 overflow-hidden">
                
                {/* LANÇADOR DE MÍSSEIS (PAINEL ESQUERDO) */}
                <div className="lg:col-span-5 flex flex-col space-y-4 overflow-y-auto no-scrollbar">
                    <Card title="Novo Registro de Campo" className="border-highlight/30">
                        <div className="space-y-6">
                            {renderSelectors()}

                            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-white/5">
                                <div>
                                    <label className="text-[10px] font-black text-text-secondary uppercase mb-2 block"># Atleta</label>
                                    <div className="relative">
                                        <input 
                                            type="number" 
                                            className="w-full bg-black/40 border-2 border-white/10 rounded-2xl p-4 text-2xl font-black text-white focus:border-highlight outline-none"
                                            value={jerseyInput}
                                            onChange={e => setJerseyInput(e.target.value)}
                                            placeholder="00"
                                        />
                                        {selectedPlayer && (
                                            <div className="absolute right-2 top-2 bottom-2 bg-highlight/20 px-3 rounded-xl flex items-center gap-2 animate-fade-in">
                                                <LazyImage src={selectedPlayer.avatarUrl} className="w-8 h-8 rounded-full border border-white/20" />
                                                <span className="text-[10px] font-black text-white uppercase italic">{selectedPlayer.name.split(' ')[0]}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-text-secondary uppercase mb-2 block">Jardas</label>
                                    <div className="flex gap-2 h-[64px]">
                                        <button onClick={() => setYardSide(yardSide === '+' ? '-' : '+')} className={`w-12 rounded-xl font-black text-xl border-2 transition-all ${yardSide === '+' ? 'bg-green-600/20 border-green-500 text-green-400' : 'bg-red-600/20 border-red-500 text-red-400'}`}>
                                            {yardSide}
                                        </button>
                                        <input 
                                            type="number"
                                            className="flex-1 bg-black/40 border-2 border-white/10 rounded-2xl p-4 text-2xl font-black text-white focus:border-highlight outline-none text-center"
                                            value={yards}
                                            onChange={e => setYards(Number(e.target.value))}
                                        />
                                    </div>
                                </div>
                            </div>

                            <button 
                                onClick={handleSavePlay}
                                disabled={!playResult}
                                className="w-full bg-highlight hover:bg-highlight-hover text-white font-black py-5 rounded-3xl uppercase italic text-lg shadow-glow transform active:scale-95 transition-all disabled:opacity-20"
                            >
                                LANÇAR JOGADA (SNAP)
                            </button>
                        </div>
                    </Card>

                    <div className="bg-secondary/40 p-4 rounded-2xl border border-white/5 flex items-center justify-between">
                         <div className="flex items-center gap-2">
                             {isOnline ? <WifiIcon className="w-4 h-4 text-green-400" /> : <WifiOffIcon className="w-4 h-4 text-red-400 animate-pulse" />}
                             <span className="text-[10px] font-black text-text-secondary uppercase tracking-widest">{isOnline ? 'Sincronizado' : 'Modo Offline - Salvando Local'}</span>
                         </div>
                         <div className="text-right">
                             <p className="text-[8px] text-text-secondary uppercase">Quarto Atual</p>
                             <p className="text-sm font-black text-white">Q{activeGame.currentQuarter} • {activeGame.clock}</p>
                         </div>
                    </div>
                </div>

                {/* CADERNO DE GUERRA (FEED DIREITO) */}
                <div className="lg:col-span-7 flex flex-col space-y-4 overflow-hidden">
                    <div className="flex justify-between items-center px-4 shrink-0">
                        <h3 className="text-xs font-black text-white uppercase italic tracking-widest flex items-center gap-2">
                            <ClockIcon className="w-4 h-4 text-highlight" /> Linha do Tempo (Logs)
                        </h3>
                        <button className="text-[10px] font-black text-purple-400 uppercase border border-purple-500/30 px-3 py-1 rounded-full flex items-center gap-2 hover:bg-purple-500 hover:text-white transition-all">
                            <SparklesIcon className="w-3 h-3" /> Gerar Intel de Quarto
                        </button>
                    </div>

                    <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar bg-black/10 rounded-[2.5rem] p-4 border border-white/5">
                        {(activeGame.timeline || []).map((event) => (
                            <div key={event.id} className="bg-secondary/60 backdrop-blur-md p-4 rounded-2xl border border-white/5 flex items-center justify-between group animate-slide-in">
                                <div className="flex items-center gap-4">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-xs italic ${event.unit === 'OFFENSE' ? 'bg-highlight/10 text-highlight' : event.unit === 'DEFENSE' ? 'bg-blue-600/10 text-blue-400' : 'bg-yellow-600/10 text-yellow-400'}`}>
                                        #{event.primaryJersey || '--'}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <span className="text-[10px] font-black text-white uppercase tracking-widest">{event.playType}</span>
                                            <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${event.result === 'TOUCHDOWN' ? 'bg-green-600 text-white' : 'bg-white/10 text-text-secondary'}`}>{event.result}</span>
                                        </div>
                                        <p className="text-xs text-text-secondary mt-1">Ganho: <strong className={event.yards! >= 0 ? 'text-green-400' : 'text-red-400'}>{event.yards! >= 0 ? '+' : ''}{event.yards} Yds</strong></p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="text-[10px] font-mono text-text-secondary opacity-40">{new Date(event.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                                    <button onClick={() => deletePlay(event.id)} className="p-2 text-text-secondary hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all">
                                        <TrashIcon className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}

                        {(!activeGame.timeline || activeGame.timeline.length === 0) && (
                            <div className="h-full flex flex-col items-center justify-center opacity-20 italic font-black uppercase text-xs tracking-widest text-center px-10">
                                <WhistleIcon className="w-16 h-16 mb-4" />
                                Aguardando o primeiro snap para registrar a história...
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SidelineHub;