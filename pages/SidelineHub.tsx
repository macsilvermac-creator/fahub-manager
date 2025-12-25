
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
            toast.warning("Dados incompletos.");
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
        toast.success("Snap arquivado.");
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
        toast.success("Registro corrigido.");
    };

    const renderUnitSelectors = () => (
        <div className="flex bg-black/40 p-1 rounded-2xl border border-white/10 mb-6 shrink-0">
            <button onClick={() => { setActiveUnit('OFFENSE'); resetConsole(); }} className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${activeUnit === 'OFFENSE' ? 'bg-highlight text-white shadow-glow' : 'text-text-secondary hover:text-white'}`}>ATAQUE</button>
            <button onClick={() => { setActiveUnit('DEFENSE'); resetConsole(); }} className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${activeUnit === 'DEFENSE' ? 'bg-blue-600 text-white shadow-glow' : 'text-text-secondary hover:text-white'}`}>DEFESA</button>
            <button onClick={() => { setActiveUnit('ST'); resetConsole(); }} className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase transition-all ${activeUnit === 'ST' ? 'bg-yellow-600 text-white shadow-glow' : 'text-text-secondary hover:text-white'}`}>ST</button>
        </div>
    );

    const renderPlayActionButtons = (currentType: any, currentResult: any, setType: Function, setResult: Function) => {
        if (activeUnit === 'OFFENSE') {
            return (
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                        <button onClick={() => { setType('PASS'); setResult(null); }} className={`p-5 rounded-2xl border-2 font-black italic transition-all ${currentType === 'PASS' ? 'bg-highlight border-highlight text-white' : 'bg-black/30 border-white/5 text-text-secondary hover:border-white/20'}`}>PASSE</button>
                        <button onClick={() => { setType('RUN'); setResult(null); }} className={`p-5 rounded-2xl border-2 font-black italic transition-all ${currentType === 'RUN' ? 'bg-highlight border-highlight text-white' : 'bg-black/30 border-white/5 text-text-secondary hover:border-white/20'}`}>CORRIDA</button>
                    </div>
                    {currentType && (
                        <div className="flex flex-wrap gap-2 animate-fade-in">
                            {(currentType === 'PASS' ? ['CATCH', 'DROP', 'INT', 'SACK'] : ['COMPLETE', 'FUMBLE']).map(r => (
                                <button key={r} onClick={() => setResult(r)} className={`px-4 py-2 rounded-xl text-[9px] font-black border transition-all ${currentResult === r ? 'bg-white text-black' : 'bg-white/5 border-white/10 text-text-secondary'}`}>{r}</button>
                            ))}
                        </div>
                    )}
                </div>
            );
        }

        if (activeUnit === 'DEFENSE') {
            return (
                <div className="grid grid-cols-2 gap-3">
                    {['TACKLE', 'SACK', 'INT', 'FUMBLE', 'PUNT_BLOCK'].map(r => (
                        <button key={r} onClick={() => { setType('RUN'); setResult(r); }} className={`p-4 rounded-2xl border-2 font-black text-xs transition-all ${currentResult === r ? 'bg-blue-600 border-blue-500 text-white shadow-glow' : 'bg-black/30 border-white/5 text-text-secondary'}`}>{r}</button>
                    ))}
                </div>
            );
        }

        return (
            <div className="grid grid-cols-2 gap-3">
                {['PUNT', 'FG', 'KICKOFF', 'PAT'].map(t => (
                    <button key={t} onClick={() => { setType(t); setResult('COMPLETE'); }} className={`p-4 rounded-2xl border-2 font-black text-xs transition-all ${currentType === t ? 'bg-yellow-600 border-yellow-500 text-white shadow-glow' : 'bg-black/30 border-white/5 text-text-secondary'}`}>{t}</button>
                ))}
            </div>
        );
    };

    if (!activeGame) return null;

    return (
        <div className="flex flex-col h-[calc(100vh-5.5rem)] lg:flex-row gap-6 animate-fade-in overflow-hidden">
            
            {/* PAINEL DE COMANDO (ESTÁTICO - ESQUERDA) */}
            <div className="w-full lg:w-[480px] shrink-0 flex flex-col space-y-4">
                <div className="glass-panel rounded-[3rem] p-8 border border-white/10 flex flex-col h-full shadow-2xl relative overflow-hidden">
                    {/* Decorativo HUD */}
                    <div className="absolute top-0 right-0 p-10 opacity-[0.03] pointer-events-none">
                        <WhistleIcon className="w-40 h-40 text-white" />
                    </div>

                    <div className="flex justify-between items-center mb-8 shrink-0">
                        <div>
                            <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter leading-none">Console Sideline</h2>
                            <p className="text-[9px] text-highlight font-black uppercase tracking-[0.4em] mt-1">Status: Ready for Snap</p>
                        </div>
                        <div className="bg-black/60 px-4 py-2 rounded-2xl border border-white/10 text-right">
                             <p className="text-[8px] text-text-secondary font-black uppercase tracking-widest leading-none">Clock</p>
                             <p className="text-lg font-mono font-black text-white">{activeGame.clock}</p>
                        </div>
                    </div>

                    {renderUnitSelectors()}

                    <div className="flex-1 space-y-8">
                        <div>
                            <p className="text-[10px] font-black text-text-secondary uppercase tracking-[0.2em] mb-4">1. Tipo de Jogada</p>
                            {renderPlayActionButtons(playType, playResult, setPlayType, setPlayResult)}
                        </div>

                        <div className="grid grid-cols-2 gap-6 border-t border-white/5 pt-8">
                            <div>
                                <label className="text-[10px] font-black text-text-secondary uppercase mb-3 block tracking-widest">2. Atleta (#)</label>
                                <div className="relative group">
                                    <input 
                                        type="number" 
                                        className="w-full bg-black/40 border-2 border-white/10 rounded-2xl p-5 text-4xl font-black text-white focus:border-highlight outline-none transition-all group-hover:border-white/20"
                                        value={jerseyInput}
                                        onChange={e => setJerseyInput(e.target.value)}
                                        placeholder="00"
                                    />
                                    {selectedPlayer && (
                                        <div className="absolute right-3 top-3 bottom-3 bg-highlight rounded-xl px-3 flex items-center gap-2 animate-fade-in shadow-lg">
                                            <LazyImage src={selectedPlayer.avatarUrl} className="w-8 h-8 rounded-full border border-black/20" />
                                        </div>
                                    )}
                                </div>
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-text-secondary uppercase mb-3 block tracking-widest">3. Ganho (Yds)</label>
                                <div className="flex gap-2">
                                    <button onClick={() => setYardSide(yardSide === '+' ? '-' : '+')} className={`w-14 rounded-2xl font-black text-2xl border-2 transition-all ${yardSide === '+' ? 'bg-green-600/20 border-green-500 text-green-400' : 'bg-red-600/20 border-red-500 text-red-400'}`}>
                                        {yardSide}
                                    </button>
                                    <input 
                                        type="number"
                                        className="flex-1 bg-black/40 border-2 border-white/10 rounded-2xl p-5 text-4xl font-black text-white focus:border-highlight outline-none text-center transition-all"
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
                        className="w-full bg-highlight hover:bg-highlight-hover text-white font-black py-6 rounded-[2rem] uppercase italic text-xl shadow-glow transform active:scale-95 transition-all disabled:opacity-10 mt-8"
                    >
                        REGISTRAR JOGADA
                    </button>
                </div>

                {/* Status bar bottom console */}
                <div className="bg-secondary/40 p-5 rounded-[2rem] border border-white/5 flex items-center justify-between shadow-lg">
                     <div className="flex items-center gap-3">
                         {isOnline ? <div className="w-2 h-2 rounded-full bg-green-500 shadow-glow animate-pulse"></div> : <WifiOffIcon className="w-4 h-4 text-red-500"/>}
                         <span className="text-[9px] font-black text-text-secondary uppercase tracking-[0.2em]">{isOnline ? 'Online Sync' : 'Offline Mode'}</span>
                     </div>
                     <span className="text-[9px] font-black text-text-secondary uppercase">Q{activeGame.currentQuarter} • Session ID: {activeGame.id}</span>
                </div>
            </div>

            {/* TIMELINE FLUIDA (SCROLÁVEL - DIREITA) */}
            <div className="flex-1 flex flex-col space-y-4 overflow-hidden">
                <div className="flex justify-between items-center px-4 shrink-0">
                    <h3 className="text-[11px] font-black text-white uppercase italic tracking-[0.5em] flex items-center gap-3">
                        <ClockIcon className="w-4 h-4 text-highlight" /> Registro de Operações
                    </h3>
                    <div className="flex gap-2">
                        <button className="text-[9px] font-black text-text-secondary uppercase hover:text-white px-3 py-1 bg-white/5 rounded-full transition-all">Limpar</button>
                        <button className="text-[9px] font-black text-purple-400 uppercase border border-purple-500/30 px-4 py-1.5 rounded-full hover:bg-purple-500 hover:text-white transition-all">Analytic AI</button>
                    </div>
                </div>

                <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-4 pr-3 custom-scrollbar bg-black/10 rounded-[3rem] p-6 border border-white/5 relative">
                    {/* Linha da Timeline Vertical */}
                    <div className="absolute left-10 top-10 bottom-10 w-0.5 bg-white/5 -z-10"></div>

                    {(activeGame.timeline || []).map((event, idx) => {
                        const isExpanded = expandedPlayId === event.id;
                        const isEditing = editingPlayId === event.id;
                        const unitColor = event.unit === 'OFFENSE' ? 'border-highlight' : event.unit === 'DEFENSE' ? 'border-blue-600' : 'border-yellow-600';
                        const unitBg = event.unit === 'OFFENSE' ? 'bg-highlight/5' : event.unit === 'DEFENSE' ? 'bg-blue-600/5' : 'bg-yellow-600/5';

                        return (
                            <div 
                                key={event.id} 
                                onClick={() => !isEditing && setExpandedPlayId(isExpanded ? null : event.id)}
                                className={`relative pl-12 animate-slide-in`}
                                style={{ animationDelay: `${idx * 0.05}s` }}
                            >
                                {/* Ponto na linha */}
                                <div className={`absolute left-[38px] top-1/2 -translate-y-1/2 w-2 h-2 rounded-full border-2 bg-black ${unitColor}`}></div>

                                <div className={`group glass-panel rounded-[2rem] border-l-4 ${unitColor} ${unitBg} transition-all duration-500 ${isExpanded ? 'scale-[1.02] shadow-glow border-opacity-100' : 'border-opacity-30 hover:border-opacity-60 cursor-pointer'} overflow-hidden`}>
                                    <div className="p-5 flex items-center justify-between">
                                        <div className="flex items-center gap-6">
                                            <div className="text-center w-10">
                                                <p className="text-[8px] text-text-secondary font-black uppercase">Jersey</p>
                                                <p className="text-xl font-black text-white italic">#{event.primaryJersey}</p>
                                            </div>
                                            <div className="w-px h-8 bg-white/5"></div>
                                            <div>
                                                <div className="flex items-center gap-3">
                                                    <span className="text-[11px] font-black text-white uppercase tracking-widest">{event.playType}</span>
                                                    <span className={`text-[9px] px-2 py-0.5 rounded font-black ${event.result === 'TOUCHDOWN' ? 'bg-green-600 text-white shadow-glow' : 'bg-white/10 text-text-secondary'}`}>{event.result}</span>
                                                </div>
                                                <p className={`text-sm font-bold mt-1 ${event.yards! >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                                                    {event.yards! >= 0 ? '+' : ''}{event.yards} Yards
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4">
                                            <div className="text-right hidden md:block">
                                                <p className="text-[9px] font-mono text-text-secondary opacity-40">{new Date(event.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                            </div>
                                            <ChevronDownIcon className={`w-5 h-5 text-text-secondary transition-transform duration-500 ${isExpanded ? 'rotate-180 text-highlight' : ''}`} />
                                        </div>
                                    </div>

                                    {/* CONTEÚDO EXPANDIDO */}
                                    {isExpanded && (
                                        <div className="px-8 pb-8 pt-2 border-t border-white/5 animate-fade-in bg-black/20">
                                            {!isEditing ? (
                                                <div className="flex justify-between items-center">
                                                    <div className="flex gap-8">
                                                        <div>
                                                            <p className="text-[8px] text-text-secondary uppercase font-black">Unidade</p>
                                                            <p className="text-xs text-white font-bold">{event.unit}</p>
                                                        </div>
                                                        <div>
                                                            <p className="text-[8px] text-text-secondary uppercase font-black">Status</p>
                                                            <p className="text-xs text-green-400 font-bold">Verificado</p>
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-3">
                                                        <button 
                                                            onClick={(e) => { e.stopPropagation(); setEditingPlayId(event.id); setEditFormData({...event}); }} 
                                                            className="flex items-center gap-2 px-6 py-2.5 bg-highlight/10 hover:bg-highlight text-highlight hover:text-white rounded-xl text-[10px] font-black uppercase transition-all border border-highlight/20"
                                                        >
                                                            <PenIcon className="w-3 h-3" /> Editar Registro
                                                        </button>
                                                        <button 
                                                            onClick={(e) => { e.stopPropagation(); if(window.confirm("Anular jogada?")) { /* delete logic */ } }} 
                                                            className="p-3 text-text-secondary hover:text-red-500 transition-colors bg-white/5 rounded-xl"
                                                        >
                                                            <TrashIcon className="w-4 h-4" />
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                /* FORMULÁRIO DE EDIÇÃO IN-PLACE */
                                                <div className="space-y-5 bg-black/40 p-6 rounded-3xl border border-highlight/30 animate-slide-up">
                                                    <div className="flex justify-between items-center mb-2">
                                                        <span className="text-[10px] font-black text-highlight uppercase tracking-[0.4em]">Editor de Registro</span>
                                                        <button onClick={() => setEditingPlayId(null)} className="text-text-secondary hover:text-white transition-colors"><XIcon className="w-5 h-5"/></button>
                                                    </div>
                                                    
                                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                                        <div className="col-span-2">
                                                            <label className="text-[8px] text-text-secondary uppercase font-black mb-1 block">Ação</label>
                                                            <select 
                                                                className="w-full bg-secondary border border-white/10 rounded-xl p-3 text-white text-xs font-bold focus:border-highlight outline-none"
                                                                value={editFormData.playType}
                                                                onChange={e => setEditFormData({ ...editFormData, playType: e.target.value as any })}
                                                            >
                                                                <option value="PASS">PASS</option><option value="RUN">RUN</option><option value="PUNT">PUNT</option>
                                                            </select>
                                                        </div>
                                                        <div>
                                                            <label className="text-[8px] text-text-secondary uppercase font-black mb-1 block">Jersey</label>
                                                            <input 
                                                                type="number" 
                                                                className="w-full bg-secondary border border-white/10 rounded-xl p-3 text-white text-xs font-bold focus:border-highlight outline-none"
                                                                value={editFormData.primaryJersey || ''}
                                                                onChange={e => setEditFormData({ ...editFormData, primaryJersey: Number(e.target.value) })}
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="text-[8px] text-text-secondary uppercase font-black mb-1 block">Yards</label>
                                                            <input 
                                                                type="number" 
                                                                className="w-full bg-secondary border border-white/10 rounded-xl p-3 text-white text-xs font-bold focus:border-highlight outline-none"
                                                                value={editFormData.yards || 0}
                                                                onChange={e => setEditFormData({ ...editFormData, yards: Number(e.target.value) })}
                                                            />
                                                        </div>
                                                    </div>

                                                    <button 
                                                        onClick={(e) => { e.stopPropagation(); handleUpdatePlay(); }}
                                                        className="w-full bg-highlight text-white font-black py-4 rounded-2xl uppercase text-[10px] flex items-center justify-center gap-3 shadow-glow hover:scale-[1.01] transition-transform"
                                                    >
                                                        <SaveIcon className="w-4 h-4" /> ATUALIZAR SNAP
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
                            <ActivityIcon className="w-20 h-20 mb-6" />
                            Aguardando Transmissão de Campo...
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default SidelineHub;