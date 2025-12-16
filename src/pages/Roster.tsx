
import React, { useState, useEffect, useContext, useMemo, useRef } from 'react';
import { Player, RosterCategory } from '../types';
import AthleteCard from '../components/AthleteCard';
import AddPlayerModal from '../components/AddPlayerModal';
import PlayerDetailsModal from '../components/PlayerDetailsModal';
import ConfirmationModal from '../components/ConfirmationModal';
import Modal from '../components/Modal';
import { UsersIcon, ClipboardIcon, ChevronDownIcon, LockIcon, RefreshIcon } from '../components/icons/UiIcons';
import { storageService } from '../services/storageService';
import PrintLayout from '../components/PrintLayout';
import { UserContext } from '../components/Layout';
import { useToast } from '../contexts/ToastContext'; 
import { useAppStore } from '@/utils/storeHooks';

const Roster: React.FC = () => {
    const { currentRole } = useContext(UserContext);
    const toast = useToast();
    
    // --- REACTIVE DATA STORE ---
    // A mágica acontece aqui. O Roster agora "ouve" o banco de dados.
    const players = useAppStore('players', storageService.getPlayers);
    // @ts-ignore
    const activeProgram = useAppStore('activeProgram', storageService.getActiveProgram);

    // Local UI State
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
    const [playerToDelete, setPlayerToDelete] = useState<Player | null>(null);
    const [viewMode, setViewMode] = useState<'CARDS' | 'DEPTH_CHART'>('CARDS');
    
    // INFINITE SCROLL STATE (PERFORMANCE FIX)
    const [visibleCount, setVisibleCount] = useState(12);
    const loaderRef = useRef<HTMLDivElement>(null);

    const [activeCategory, setActiveCategory] = useState<RosterCategory>('ACTIVE');
    const [unitFilter, setUnitFilter] = useState<'ALL' | 'OFFENSE' | 'DEFENSE' | 'ST'>('ALL');

    const [isCompareMode, setIsCompareMode] = useState(false);
    const [compareSelection, setCompareSelection] = useState<number[]>([]);
    const [showCompareModal, setShowCompareModal] = useState(false);

    // --- PERMISSÕES RÍGIDAS ---
    const isPlayer = currentRole === 'PLAYER';
    const canCreateDelete = currentRole === 'MASTER'; 
    const canManageRoster = currentRole === 'MASTER' || currentRole === 'HEAD_COACH' || currentRole === 'OFFENSIVE_COORD' || currentRole === 'DEFENSIVE_COORD';

    useEffect(() => {
        if (isPlayer) setViewMode('CARDS');
    }, [isPlayer]);

    useEffect(() => {
        setVisibleCount(12); // Reset scroll on filter change
    }, [activeCategory, unitFilter, viewMode, activeProgram]);

    const handleAddPlayer = (newPlayerData: Omit<Player, 'id' | 'level' | 'xp' | 'badges' | 'rating' | 'status'>) => {
        try {
            // Gera um ID numérico seguro
            const newId = Date.now();
            const newPlayer: Player = {
                id: newId,
                level: 1,
                xp: 0,
                badges: ['Novato'],
                rating: 70, 
                status: 'ACTIVE',
                rosterCategory: 'ACTIVE',
                rosterHistory: [{ id: `h-${Date.now()}`, date: new Date(), type: 'RECRUITMENT', description: 'Adicionado ao Roster via Cadastro' }],
                ...newPlayerData
            };
            
            // Apenas chama o método de escrita. A UI atualizará sozinha via useAppStore
            storageService.registerAthlete(newPlayer);
            setIsAddModalOpen(false);
            toast.success(`Atleta ${newPlayer.name} recrutado para o elenco ${newPlayer.program}!`); 
        } catch (error: any) {
            toast.error(error.message); 
        }
    };

    const handleDeleteClick = (player: Player) => {
        if (canCreateDelete) setPlayerToDelete(player);
    };

    const confirmDeletePlayer = () => {
        if (playerToDelete) {
            const updatedPlayers = players.filter(p => p.id !== playerToDelete.id);
            storageService.savePlayers(updatedPlayers);
            toast.info(`${playerToDelete.name} removido do elenco.`); 
            setPlayerToDelete(null);
        }
    };

    const handleMovePlayer = (player: Player, newCategory: RosterCategory) => {
        if (!canManageRoster) return;
        const updated = players.map(p => p.id === player.id ? { ...p, rosterCategory: newCategory } : p);
        storageService.savePlayers(updated);
        toast.success(`${player.name} movido para ${newCategory}`); 
    };

    const toggleCompareSelect = (id: number) => {
        if (compareSelection.includes(id)) {
            setCompareSelection(prev => prev.filter(pid => pid !== id));
        } else {
            if (compareSelection.length < 2) {
                setCompareSelection(prev => [...prev, id]);
            } else {
                toast.warning("Selecione no máximo 2 atletas para comparar.");
            }
        }
    };

    // --- FILTRAGEM OTIMIZADA (MEMOIZATION) ---
    // O filtro só roda se as dependências mudarem, evitando recálculo a cada render
    const filteredPlayers = useMemo(() => {
        return players.filter(p => {
            // Filtro de Modalidade (Contexto Seguro)
            if (activeProgram === 'FLAG' && p.program === 'TACKLE') return false;
            if (activeProgram === 'TACKLE' && p.program === 'FLAG') return false;

            if ((p.rosterCategory || 'ACTIVE') !== activeCategory) return false;
            
            if (unitFilter === 'ALL') return true;
            const pos = p.position;
            
            if (unitFilter === 'OFFENSE') {
                return activeProgram === 'FLAG' 
                    ? ['QB','WR','C','RUSHER','ATH'].includes(pos)
                    : ['QB','RB','WR','TE','OL','LT','LG','C','RG','RT'].includes(pos);
            }
            if (unitFilter === 'DEFENSE') {
                return activeProgram === 'FLAG'
                    ? ['LB','DB','S','RUSHER','ATH'].includes(pos)
                    : ['DL','DE','DT','LB','CB','S','FS','SS'].includes(pos);
            }
            if (unitFilter === 'ST') {
                return ['K','P','LS','KR','PR'].includes(pos);
            }
            return true;
        });
    }, [players, activeCategory, unitFilter, activeProgram]);

    // PAGINAÇÃO VISUAL (Evita renderizar 100 cards de uma vez)
    const displayedPlayers = filteredPlayers.slice(0, visibleCount);

    // --- INFINITE SCROLL OBSERVER ---
    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                // Se o loader estiver visível e houver mais itens, carrega mais
                if (displayedPlayers.length < filteredPlayers.length) {
                    // Pequeno delay artificial para UX suave, sem travar main thread
                    setTimeout(() => {
                         setVisibleCount(prev => prev + 12);
                    }, 100);
                }
            }
        }, { threshold: 0.1 });

        if (loaderRef.current) {
            observer.observe(loaderRef.current);
        }

        return () => observer.disconnect();
    }, [displayedPlayers.length, filteredPlayers.length]);


    // --- Depth Chart Helpers (Mantidos) ---
    const getPlayersByUnit = (unit: 'OFFENSE' | 'DEFENSE' | 'SPECIAL') => {
        const offPositions = activeProgram === 'FLAG' 
            ? ['QB', 'WR', 'C', 'ATH']
            : ['QB', 'RB', 'WR', 'TE', 'OL', 'LT', 'C', 'RT', 'LG', 'RG'];
            
        const defPositions = activeProgram === 'FLAG'
            ? ['RUSHER', 'LB', 'DB', 'S', 'ATH']
            : ['DL', 'DE', 'DT', 'LB', 'CB', 'S', 'FS', 'SS'];
            
        const stPositions = ['K', 'P', 'LS', 'KR', 'PR'];

        let positionsToCheck: string[] = [];
        if (unit === 'OFFENSE') positionsToCheck = offPositions;
        if (unit === 'DEFENSE') positionsToCheck = defPositions;
        if (unit === 'SPECIAL') positionsToCheck = stPositions;

        return players
            .filter(p => {
                if (activeProgram === 'FLAG' && p.program === 'TACKLE') return false;
                if (activeProgram === 'TACKLE' && p.program === 'FLAG') return false;
                return (p.rosterCategory || 'ACTIVE') === 'ACTIVE';
            })
            .filter(p => positionsToCheck.includes(p.position))
            .sort((a, b) => {
                const idxA = positionsToCheck.indexOf(a.position);
                const idxB = positionsToCheck.indexOf(b.position);
                if (idxA !== idxB) return idxA - idxB;
                return a.depthChartOrder - b.depthChartOrder;
            });
    };

    const getPlayerKeyStat = (player: Player) => {
        return `OVR ${player.rating}`;
    };

    const renderDepthChartColumn = (title: string, unitPlayers: Player[]) => {
        const grouped: Record<string, Player[]> = {};
        unitPlayers.forEach(p => {
            if(!grouped[p.position]) grouped[p.position] = [];
            grouped[p.position].push(p);
        });

        const orderedPositions = title.includes('Special') 
            ? ['K', 'P', 'LS', 'KR', 'PR'] 
            : Object.keys(grouped).sort();

        return (
            <div className="bg-secondary/30 rounded-xl p-4 border border-white/5 print:bg-transparent print:border-black min-w-[280px]">
                <h3 className="text-xl font-bold text-white mb-4 border-b border-white/10 pb-2 print:text-black print:border-black">{title}</h3>
                <div className="space-y-6">
                    {orderedPositions.map(pos => {
                        if (!grouped[pos]) return null;
                        return (
                            <div key={pos} className="flex flex-col">
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-sm font-black bg-white/10 px-2 py-0.5 rounded text-white print:text-black print:bg-gray-200">{pos}</span>
                                </div>
                                <div className="space-y-2 pl-2 border-l-2 border-white/5 print:border-black">
                                    {grouped[pos].map(p => (
                                        <div 
                                            key={p.id} 
                                            onClick={() => setSelectedPlayer(p)}
                                            className={`flex items-center justify-between p-2 rounded cursor-pointer hover:bg-white/5 transition-colors ${p.depthChartOrder === 1 ? 'bg-highlight/10 border border-highlight/20 print:border-black print:bg-transparent' : ''}`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <span className={`text-[10px] font-bold w-4 ${p.depthChartOrder === 1 ? 'text-highlight print:text-black' : 'text-text-secondary print:text-gray-600'}`}>
                                                    {p.depthChartOrder === 1 ? '1st' : p.depthChartOrder === 2 ? '2nd' : '3rd'}
                                                </span>
                                                <div className="flex items-center gap-2">
                                                    <div className="flex flex-col">
                                                        <span className={`text-sm leading-none ${p.depthChartOrder === 1 ? 'font-bold text-white print:text-black' : 'text-text-secondary print:text-gray-800'}`}>{p.name}</span>
                                                        {!isPlayer && <span className="text-[9px] text-text-secondary print:hidden">{getPlayerKeyStat(p)}</span>}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex flex-col items-end">
                                                <span className="text-xs font-bold text-text-secondary print:text-gray-600">{p.rating}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-8 animate-fade-in pb-12">
            <PrintLayout />
            
            <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4 no-print">
                <div>
                    <h2 className="text-3xl font-bold text-text-primary bg-clip-text text-transparent bg-gradient-to-r from-white to-text-secondary">
                        Elenco {activeProgram === 'FLAG' ? 'Flag Football' : 'Full Pads'}
                    </h2>
                    <p className="text-text-secondary mt-1 flex items-center gap-2">
                        <UsersIcon className="w-4 h-4" />
                        {isPlayer ? 'Seus companheiros de batalha.' : 'Gerencie o Depth Chart e as unidades.'}
                    </p>
                </div>
                <div className="flex gap-3 flex-wrap">
                     <button 
                        onClick={() => {
                            if (isCompareMode && compareSelection.length === 2) {
                                setShowCompareModal(true);
                            } else {
                                setIsCompareMode(!isCompareMode);
                                setCompareSelection([]);
                            }
                        }}
                        className={`px-4 py-2 rounded-xl font-semibold transition-all border ${isCompareMode ? 'bg-indigo-600 border-indigo-500 text-white shadow-glow' : 'bg-secondary text-text-secondary border-white/10 hover:text-white'}`}
                    >
                        {isCompareMode ? (compareSelection.length === 2 ? 'Ver Comparação' : `Selecionar (${compareSelection.length}/2)`) : 'Comparar Atletas'}
                    </button>

                    {!isPlayer && (
                        <div className="bg-secondary p-1 rounded-lg flex border border-white/10">
                            <button onClick={() => setViewMode('CARDS')} className={`px-4 py-2 rounded-md text-sm font-semibold transition-colors ${viewMode === 'CARDS' ? 'bg-highlight text-white shadow-sm' : 'text-text-secondary hover:text-white'}`}>Cards</button>
                            <button onClick={() => setViewMode('DEPTH_CHART')} className={`px-4 py-2 rounded-md text-sm font-semibold transition-colors ${viewMode === 'DEPTH_CHART' ? 'bg-highlight text-white shadow-sm' : 'text-text-secondary hover:text-white'}`}>Tática</button>
                        </div>
                    )}

                    {canCreateDelete && (
                        <button 
                            onClick={() => setIsAddModalOpen(true)}
                            className="px-6 py-2.5 bg-gradient-to-r from-highlight to-highlight-hover text-white rounded-xl font-semibold hover:shadow-glow transition-all transform hover:-translate-y-0.5 flex items-center gap-2"
                        >
                            <span>+</span> Cadastrar (Admin)
                        </button>
                    )}
                </div>
            </div>

            {!isPlayer && viewMode === 'CARDS' && (
                <div className="flex flex-col space-y-2 md:flex-row md:space-y-0 md:items-center md:justify-between border-b border-white/10 mb-4 no-print">
                    <div className="flex overflow-x-auto">
                        <button onClick={() => setActiveCategory('ACTIVE')} className={`px-6 py-3 font-bold text-sm border-b-2 transition-colors whitespace-nowrap ${activeCategory === 'ACTIVE' ? 'border-green-500 text-green-400' : 'border-transparent text-text-secondary hover:text-white'}`}>Active Roster ({players.filter(p => p.rosterCategory === 'ACTIVE' && (p.program === activeProgram || p.program === 'BOTH')).length})</button>
                        <button onClick={() => setActiveCategory('PRACTICE_SQUAD')} className={`px-6 py-3 font-bold text-sm border-b-2 transition-colors whitespace-nowrap ${activeCategory === 'PRACTICE_SQUAD' ? 'border-yellow-500 text-yellow-400' : 'border-transparent text-text-secondary hover:text-white'}`}>Practice Squad</button>
                        <button onClick={() => setActiveCategory('IR')} className={`px-6 py-3 font-bold text-sm border-b-2 transition-colors whitespace-nowrap ${activeCategory === 'IR' ? 'border-red-500 text-red-400' : 'border-transparent text-text-secondary hover:text-white'}`}>IR / Suspensos</button>
                    </div>
                    
                    <div className="flex bg-black/20 rounded-lg p-1 gap-1 overflow-x-auto">
                        <button onClick={() => setUnitFilter('ALL')} className={`px-3 py-1 text-xs font-bold rounded whitespace-nowrap ${unitFilter === 'ALL' ? 'bg-white text-black' : 'text-text-secondary hover:text-white'}`}>Tudo</button>
                        <button onClick={() => setUnitFilter('OFFENSE')} className={`px-3 py-1 text-xs font-bold rounded whitespace-nowrap ${unitFilter === 'OFFENSE' ? 'bg-blue-600 text-white' : 'text-text-secondary hover:text-white'}`}>ATQ</button>
                        <button onClick={() => setUnitFilter('DEFENSE')} className={`px-3 py-1 text-xs font-bold rounded whitespace-nowrap ${unitFilter === 'DEFENSE' ? 'bg-red-600 text-white' : 'text-text-secondary hover:text-white'}`}>DEF</button>
                        {activeProgram === 'TACKLE' && (
                            <button onClick={() => setUnitFilter('ST')} className={`px-3 py-1 text-xs font-bold rounded whitespace-nowrap ${unitFilter === 'ST' ? 'bg-green-600 text-white' : 'text-text-secondary hover:text-white'}`}>ST</button>
                        )}
                    </div>
                </div>
            )}

            <div className="print-safe">
                {viewMode === 'CARDS' ? (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredPlayers.length === 0 && <p className="col-span-full text-center text-text-secondary py-12 italic">Nenhum atleta nesta categoria/filtro para o programa {activeProgram}.</p>}
                            
                            {displayedPlayers.map(player => (
                                <div key={player.id} className="relative group">
                                    <AthleteCard 
                                        player={player} 
                                        onClick={(p) => isCompareMode ? toggleCompareSelect(p.id) : setSelectedPlayer(p)}
                                        onDelete={canCreateDelete ? handleDeleteClick : () => {}}
                                    />
                                    {player.program === 'BOTH' && (
                                        <span className="absolute top-2 right-12 text-[9px] bg-purple-600 text-white px-1.5 py-0.5 rounded shadow z-10">BOTH</span>
                                    )}
                                    {isCompareMode && (
                                        <div className={`absolute inset-0 bg-black/50 rounded-xl flex items-center justify-center transition-opacity ${compareSelection.includes(player.id) ? 'opacity-100 ring-4 ring-indigo-500' : 'opacity-0 hover:opacity-100 cursor-pointer'}`} onClick={() => toggleCompareSelect(player.id)}>
                                            <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${compareSelection.includes(player.id) ? 'bg-indigo-500 border-white text-white' : 'border-white text-transparent'}`}>✓</div>
                                        </div>
                                    )}
                                    {canManageRoster && !isCompareMode && (
                                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-1 z-20">
                                            {activeCategory !== 'ACTIVE' && <button onClick={(e) => {e.stopPropagation(); handleMovePlayer(player, 'ACTIVE')}} className="bg-green-600 text-white text-[10px] px-2 py-1 rounded shadow" title="Promover para Ativo">▲ Ativo</button>}
                                            {activeCategory !== 'PRACTICE_SQUAD' && <button onClick={(e) => {e.stopPropagation(); handleMovePlayer(player, 'PRACTICE_SQUAD')}} className="bg-yellow-600 text-white text-[10px] px-2 py-1 rounded shadow" title="Mover para PS">▼ PS</button>}
                                            {activeCategory !== 'IR' && <button onClick={(e) => {e.stopPropagation(); handleMovePlayer(player, 'IR')}} className="bg-red-600 text-white text-[10px] px-2 py-1 rounded shadow" title="Mover para IR">✖ IR</button>}
                                        </div>
                                    )}
                                    {!canCreateDelete && !isPlayer && (
                                        <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-60 transition-opacity">
                                            <LockIcon className="w-4 h-4 text-white" />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                        
                        {/* INFINITE SCROLL LOADER (Intersection Observer Target) */}
                        {visibleCount < filteredPlayers.length && (
                             <div ref={loaderRef} className="w-full py-8 flex justify-center items-center">
                                 <div className="flex items-center gap-2 text-text-secondary animate-pulse">
                                     <RefreshIcon className="w-5 h-5 animate-spin" />
                                     <span className="text-sm font-bold">Carregando mais atletas...</span>
                                 </div>
                             </div>
                        )}
                    </>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-x-auto pb-4">
                        {renderDepthChartColumn('Ataque (Offense)', getPlayersByUnit('OFFENSE'))}
                        {renderDepthChartColumn('Defesa (Defense)', getPlayersByUnit('DEFENSE'))}
                        {activeProgram === 'TACKLE' && renderDepthChartColumn('Special Teams (ST)', getPlayersByUnit('SPECIAL'))}
                    </div>
                )}
            </div>
            
            <AddPlayerModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onAdd={handleAddPlayer} />
            <PlayerDetailsModal isOpen={!!selectedPlayer} onClose={() => setSelectedPlayer(null)} player={selectedPlayer} />
            <ConfirmationModal isOpen={!!playerToDelete} onClose={() => setPlayerToDelete(null)} onConfirm={confirmDeletePlayer} title="Excluir Jogador?" message={`Tem certeza que deseja remover ${playerToDelete?.name}?`} confirmLabel="Excluir" />

            <Modal isOpen={showCompareModal} onClose={() => setShowCompareModal(false)} title="Comparativo de Atletas" maxWidth="max-w-4xl">
                {compareSelection.length === 2 && (() => {
                    const p1 = players.find(p => p.id === compareSelection[0]);
                    const p2 = players.find(p => p.id === compareSelection[1]);
                    if (!p1 || !p2) return null;
                    return (
                        <div className="space-y-6">
                            <div className="grid grid-cols-3 items-center text-center">
                                <div className="flex flex-col items-center">
                                    <img src={p1.avatarUrl} className="w-24 h-24 rounded-full border-4 border-highlight shadow-lg mb-2" />
                                    <h3 className="text-xl font-bold text-white">{p1.name}</h3>
                                </div>
                                <div className="text-3xl font-black text-white/20">VS</div>
                                <div className="flex flex-col items-center">
                                    <img src={p2.avatarUrl} className="w-24 h-24 rounded-full border-4 border-orange-500 shadow-lg mb-2" />
                                    <h3 className="text-xl font-bold text-white">{p2.name}</h3>
                                </div>
                            </div>
                            <div className="bg-secondary rounded-xl border border-white/10 overflow-hidden">
                                <table className="w-full text-center">
                                    <thead><tr className="bg-black/20 text-text-secondary"><th>{p1.name}</th><th>Atributo</th><th>{p2.name}</th></tr></thead>
                                    <tbody>
                                        <tr><td className="text-white">{p1.rating}</td><td className="text-text-secondary text-sm font-bold uppercase">OVR</td><td className="text-white">{p2.rating}</td></tr>
                                        <tr><td className="text-white">{p1.level}</td><td className="text-text-secondary text-sm font-bold uppercase">Level</td><td className="text-white">{p2.level}</td></tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    );
                })()}
            </Modal>
        </div>
    );
};

export default Roster;