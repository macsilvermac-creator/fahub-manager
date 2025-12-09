
import React, { useState, useEffect, useContext } from 'react';
import { Player, RosterCategory } from '../types';
import AthleteCard from '../components/AthleteCard';
import AddPlayerModal from '../components/AddPlayerModal';
import PlayerDetailsModal from '../components/PlayerDetailsModal';
import ConfirmationModal from '../components/ConfirmationModal';
import Modal from '../components/Modal';
import { UsersIcon, ClipboardIcon, ChevronDownIcon } from '../components/icons/UiIcons';
import { storageService } from '../services/storageService';
import PrintLayout from '../components/PrintLayout';
import { UserContext } from '../components/Layout';
import { useToast } from '../contexts/ToastContext'; // Import Toast

const Roster: React.FC = () => {
    const { currentRole } = useContext(UserContext);
    const toast = useToast(); // Hook Toast
    const [players, setPlayers] = useState<Player[]>([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
    const [playerToDelete, setPlayerToDelete] = useState<Player | null>(null);
    const [viewMode, setViewMode] = useState<'CARDS' | 'DEPTH_CHART'>('CARDS');
    
    // Performance: Paginação
    const [visibleCount, setVisibleCount] = useState(12);
    
    // Squad Management State
    const [activeCategory, setActiveCategory] = useState<RosterCategory>('ACTIVE');
    const [unitFilter, setUnitFilter] = useState<'ALL' | 'OFFENSE' | 'DEFENSE' | 'ST'>('ALL');

    // Comparison State
    const [isCompareMode, setIsCompareMode] = useState(false);
    const [compareSelection, setCompareSelection] = useState<number[]>([]);
    const [showCompareModal, setShowCompareModal] = useState(false);

    const isPlayer = currentRole === 'PLAYER';
    const canEdit = currentRole === 'MASTER' || currentRole === 'HEAD_COACH';

    useEffect(() => {
        setPlayers(storageService.getPlayers());
        // Players forced to card view
        if (isPlayer) setViewMode('CARDS');
    }, [isPlayer]);

    // Reset pagination when filters change
    useEffect(() => {
        setVisibleCount(12);
    }, [activeCategory, unitFilter, viewMode]);

    const handleAddPlayer = (newPlayerData: Omit<Player, 'id' | 'level' | 'xp' | 'badges' | 'rating' | 'status'>) => {
        try {
            const newId = Math.max(0, ...players.map(p => p.id)) + 1;
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
            
            storageService.registerAthlete(newPlayer);
            setPlayers(storageService.getPlayers());
            setIsAddModalOpen(false);
            toast.success(`Atleta ${newPlayer.name} recrutado com sucesso!`); // Toast
        } catch (error: any) {
            toast.error(error.message); // Toast Error
        }
    };

    const handleDeleteClick = (player: Player) => {
        if (canEdit) setPlayerToDelete(player);
    };

    const confirmDeletePlayer = () => {
        if (playerToDelete) {
            const updatedPlayers = players.filter(p => p.id !== playerToDelete.id);
            setPlayers(updatedPlayers);
            storageService.savePlayers(updatedPlayers);
            toast.info(`${playerToDelete.name} removido do elenco.`); // Toast Info
            setPlayerToDelete(null);
        }
    };

    const handleMovePlayer = (player: Player, newCategory: RosterCategory) => {
        if (!canEdit) return;
        const updated = players.map(p => p.id === player.id ? { ...p, rosterCategory: newCategory } : p);
        setPlayers(updated);
        storageService.savePlayers(updated);
        toast.success(`${player.name} movido para ${newCategory}`); // Toast
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

    const handleLoadMore = () => {
        setVisibleCount(prev => prev + 12);
    };

    // Filter players by current squad tab AND unit filter
    const filteredPlayers = players.filter(p => {
        // 1. Squad Filter
        if ((p.rosterCategory || 'ACTIVE') !== activeCategory) return false;
        
        // 2. Unit Filter
        if (unitFilter === 'ALL') return true;
        const pos = p.position;
        if (unitFilter === 'OFFENSE') return ['QB','RB','WR','TE','OL','LT','LG','C','RG','RT'].includes(pos);
        if (unitFilter === 'DEFENSE') return ['DL','DE','DT','LB','CB','S','FS','SS'].includes(pos);
        if (unitFilter === 'ST') return ['K','P','LS'].includes(pos);
        return true;
    });

    const displayedPlayers = filteredPlayers.slice(0, visibleCount);

    // --- Depth Chart Helpers ---
    const getPlayersByUnit = (unit: 'OFFENSE' | 'DEFENSE' | 'SPECIAL') => {
        const offPositions = ['QB', 'RB', 'WR', 'TE', 'OL', 'LT', 'C', 'RT', 'LG', 'RG'];
        const defPositions = ['DL', 'DE', 'DT', 'LB', 'CB', 'S', 'FS', 'SS'];
        const stPositions = ['K', 'P', 'LS'];

        let positionsToCheck: string[] = [];
        if (unit === 'OFFENSE') positionsToCheck = offPositions;
        if (unit === 'DEFENSE') positionsToCheck = defPositions;
        if (unit === 'SPECIAL') positionsToCheck = stPositions;

        // Filter by ACTIVE category for depth chart
        return players
            .filter(p => (p.rosterCategory || 'ACTIVE') === 'ACTIVE')
            .filter(p => positionsToCheck.includes(p.position))
            .sort((a, b) => {
                if (a.position === b.position) return a.depthChartOrder - b.depthChartOrder;
                return a.position.localeCompare(b.position);
            });
    };

    // Helper to get key stat string based on position
    const getPlayerKeyStat = (player: Player) => {
        if (!player.gameLogs || player.gameLogs.length === 0) return `OVR ${player.rating}`;
        
        // Sum stats
        const totalYards = player.gameLogs.reduce((acc, log) => acc + (log.stats.yards || 0), 0);
        const totalTDs = player.gameLogs.reduce((acc, log) => acc + (log.stats.tds || 0), 0);
        const totalTackles = player.gameLogs.reduce((acc, log) => acc + (log.stats.tackles || 0), 0); // Assuming defensive stats exist in logs
        const totalInts = player.gameLogs.reduce((acc, log) => acc + (log.stats.ints || 0), 0);

        if (['QB', 'WR', 'RB', 'TE'].includes(player.position)) {
            return `${totalYards} yds, ${totalTDs} TD`;
        } else if (['LB', 'CB', 'S', 'DL', 'DE', 'DT'].includes(player.position)) {
            // Mock defensive stat display logic (using TD field as Ints/Sacks for simplicity in this mock)
            return `${totalTackles || Math.floor(Math.random() * 20)} Tkls`;
        } else if (['OL', 'C', 'G', 'T'].includes(player.position)) {
            return `Pancakes: ${Math.floor(Math.random() * 10)}`;
        }
        return `OVR ${player.rating}`;
    };

    const renderDepthChartColumn = (title: string, unitPlayers: Player[]) => {
        const grouped: Record<string, Player[]> = {};
        unitPlayers.forEach(p => {
            if(!grouped[p.position]) grouped[p.position] = [];
            grouped[p.position].push(p);
        });

        return (
            <div className="bg-secondary/30 rounded-xl p-4 border border-white/5 print:bg-transparent print:border-black">
                <h3 className="text-xl font-bold text-white mb-4 border-b border-white/10 pb-2 print:text-black print:border-black">{title}</h3>
                <div className="space-y-6">
                    {Object.keys(grouped).map(pos => (
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
                                                <img src={p.avatarUrl} className="w-6 h-6 rounded-full print:hidden" />
                                                <div className="flex flex-col">
                                                    <span className={`text-sm leading-none ${p.depthChartOrder === 1 ? 'font-bold text-white print:text-black' : 'text-text-secondary print:text-gray-800'}`}>{p.name}</span>
                                                    {!isPlayer && <span className="text-[9px] text-text-secondary print:hidden">{getPlayerKeyStat(p)}</span>}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex flex-col items-end">
                                            <span className="text-xs font-bold text-text-secondary print:text-gray-600">{p.rating}</span>
                                            {p.status !== 'ACTIVE' && <span className="text-[8px] bg-red-500/20 text-red-400 px-1 rounded">{p.status}</span>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-8 animate-fade-in pb-12">
            <PrintLayout />
            
            <style>{`
                @media print {
                    body { background: white !important; color: black !important; }
                    .no-print { display: none !important; }
                    .glass-panel { background: none !important; box-shadow: none !important; border: none !important; }
                    .text-white { color: black !important; }
                    .text-text-secondary { color: #333 !important; }
                    .bg-secondary { background: none !important; }
                    /* Push content down for letterhead */
                    .print-safe { margin-top: 150px; }
                }
            `}</style>

            {/* Header Section */}
            <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4 no-print">
                <div>
                    <h2 className="text-3xl font-bold text-text-primary bg-clip-text text-transparent bg-gradient-to-r from-white to-text-secondary">Gestão de Elenco</h2>
                    <p className="text-text-secondary mt-1 flex items-center gap-2">
                        <UsersIcon className="w-4 h-4" />
                        {isPlayer ? 'Seus companheiros de batalha.' : 'Gerencie atletas, depth chart e squads.'}
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
                            <button 
                                onClick={() => setViewMode('CARDS')}
                                className={`px-4 py-2 rounded-md text-sm font-semibold transition-colors ${viewMode === 'CARDS' ? 'bg-highlight text-white shadow-sm' : 'text-text-secondary hover:text-white'}`}
                            >
                                Cards
                            </button>
                            <button 
                                onClick={() => setViewMode('DEPTH_CHART')}
                                className={`px-4 py-2 rounded-md text-sm font-semibold transition-colors ${viewMode === 'DEPTH_CHART' ? 'bg-highlight text-white shadow-sm' : 'text-text-secondary hover:text-white'}`}
                            >
                                Tática
                            </button>
                        </div>
                    )}

                    {canEdit && (
                        <button 
                            onClick={() => setIsAddModalOpen(true)}
                            className="px-6 py-2.5 bg-gradient-to-r from-highlight to-highlight-hover text-white rounded-xl font-semibold hover:shadow-glow transition-all transform hover:-translate-y-0.5 flex items-center gap-2"
                        >
                            <span>+</span> Recrutar
                        </button>
                    )}
                </div>
            </div>

            {/* Squad Tabs (Coach Only) */}
            {!isPlayer && viewMode === 'CARDS' && (
                <div className="flex flex-col space-y-2 md:flex-row md:space-y-0 md:items-center md:justify-between border-b border-white/10 mb-4 no-print">
                    <div className="flex overflow-x-auto">
                        <button onClick={() => setActiveCategory('ACTIVE')} className={`px-6 py-3 font-bold text-sm border-b-2 transition-colors whitespace-nowrap ${activeCategory === 'ACTIVE' ? 'border-green-500 text-green-400' : 'border-transparent text-text-secondary hover:text-white'}`}>
                            Active Roster ({players.filter(p => p.rosterCategory === 'ACTIVE').length})
                        </button>
                        <button onClick={() => setActiveCategory('PRACTICE_SQUAD')} className={`px-6 py-3 font-bold text-sm border-b-2 transition-colors whitespace-nowrap ${activeCategory === 'PRACTICE_SQUAD' ? 'border-yellow-500 text-yellow-400' : 'border-transparent text-text-secondary hover:text-white'}`}>
                            Practice Squad
                        </button>
                        <button onClick={() => setActiveCategory('IR')} className={`px-6 py-3 font-bold text-sm border-b-2 transition-colors whitespace-nowrap ${activeCategory === 'IR' ? 'border-red-500 text-red-400' : 'border-transparent text-text-secondary hover:text-white'}`}>
                            Injured Reserve / Suspensos
                        </button>
                    </div>
                    
                    {/* Unit Filter */}
                    <div className="flex bg-black/20 rounded-lg p-1 gap-1">
                        <button onClick={() => setUnitFilter('ALL')} className={`px-3 py-1 text-xs font-bold rounded transition-all ${unitFilter === 'ALL' ? 'bg-white text-black' : 'text-text-secondary hover:text-white'}`}>Tudo</button>
                        <button onClick={() => setUnitFilter('OFFENSE')} className={`px-3 py-1 text-xs font-bold rounded transition-all ${unitFilter === 'OFFENSE' ? 'bg-blue-600 text-white' : 'text-text-secondary hover:text-white'}`}>ATQ</button>
                        <button onClick={() => setUnitFilter('DEFENSE')} className={`px-3 py-1 text-xs font-bold rounded transition-all ${unitFilter === 'DEFENSE' ? 'bg-red-600 text-white' : 'text-text-secondary hover:text-white'}`}>DEF</button>
                        <button onClick={() => setUnitFilter('ST')} className={`px-3 py-1 text-xs font-bold rounded transition-all ${unitFilter === 'ST' ? 'bg-green-600 text-white' : 'text-text-secondary hover:text-white'}`}>ST</button>
                    </div>
                </div>
            )}

            {/* Content Area */}
            <div className="print-safe">
                {viewMode === 'CARDS' ? (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredPlayers.length === 0 && <p className="col-span-full text-center text-text-secondary py-12 italic">Nenhum atleta nesta categoria/filtro.</p>}
                            
                            {/* Render only visible players */}
                            {displayedPlayers.map(player => (
                                <div key={player.id} className="relative group">
                                    <AthleteCard 
                                        player={player} 
                                        onClick={(p) => isCompareMode ? toggleCompareSelect(p.id) : setSelectedPlayer(p)}
                                        onDelete={canEdit ? handleDeleteClick : () => {}}
                                    />
                                    {isCompareMode && (
                                        <div className={`absolute inset-0 bg-black/50 rounded-xl flex items-center justify-center transition-opacity ${compareSelection.includes(player.id) ? 'opacity-100 ring-4 ring-indigo-500' : 'opacity-0 hover:opacity-100 cursor-pointer'}`} onClick={() => toggleCompareSelect(player.id)}>
                                            <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${compareSelection.includes(player.id) ? 'bg-indigo-500 border-white text-white' : 'border-white text-transparent'}`}>
                                                ✓
                                            </div>
                                        </div>
                                    )}
                                    {/* Quick Squad Move Actions */}
                                    {canEdit && !isCompareMode && (
                                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col gap-1 z-20">
                                            {activeCategory !== 'ACTIVE' && <button onClick={(e) => {e.stopPropagation(); handleMovePlayer(player, 'ACTIVE')}} className="bg-green-600 text-white text-[10px] px-2 py-1 rounded shadow" title="Promover para Ativo">▲ Ativo</button>}
                                            {activeCategory !== 'PRACTICE_SQUAD' && <button onClick={(e) => {e.stopPropagation(); handleMovePlayer(player, 'PRACTICE_SQUAD')}} className="bg-yellow-600 text-white text-[10px] px-2 py-1 rounded shadow" title="Mover para PS">▼ PS</button>}
                                            {activeCategory !== 'IR' && <button onClick={(e) => {e.stopPropagation(); handleMovePlayer(player, 'IR')}} className="bg-red-600 text-white text-[10px] px-2 py-1 rounded shadow" title="Mover para IR">✖ IR</button>}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        {/* Load More Button */}
                        {visibleCount < filteredPlayers.length && (
                            <div className="flex justify-center mt-8">
                                <button 
                                    onClick={handleLoadMore}
                                    className="px-6 py-2 bg-secondary border border-white/10 hover:bg-white/5 rounded-full text-sm font-bold text-text-secondary flex items-center gap-2 transition-all"
                                >
                                    Carregar Mais ({filteredPlayers.length - visibleCount} restantes) <ChevronDownIcon className="w-4 h-4"/>
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-x-auto">
                        {renderDepthChartColumn('Ataque (Offense)', getPlayersByUnit('OFFENSE'))}
                        {renderDepthChartColumn('Defesa (Defense)', getPlayersByUnit('DEFENSE'))}
                        {renderDepthChartColumn('Special Teams', getPlayersByUnit('SPECIAL'))}
                    </div>
                )}
            </div>
            
            <AddPlayerModal 
                isOpen={isAddModalOpen} 
                onClose={() => setIsAddModalOpen(false)} 
                onAdd={handleAddPlayer} 
            />

            <PlayerDetailsModal
                isOpen={!!selectedPlayer}
                onClose={() => setSelectedPlayer(null)}
                player={selectedPlayer}
            />

            <ConfirmationModal
                isOpen={!!playerToDelete}
                onClose={() => setPlayerToDelete(null)}
                onConfirm={confirmDeletePlayer}
                title="Excluir Jogador?"
                message={`Tem certeza que deseja remover ${playerToDelete?.name} do elenco? Esta ação não pode ser desfeita.`}
                confirmLabel="Excluir"
            />

            {/* COMPARISON MODAL */}
            <Modal isOpen={showCompareModal} onClose={() => setShowCompareModal(false)} title="Comparativo de Atletas" maxWidth="max-w-4xl">
                {compareSelection.length === 2 && (() => {
                    const p1 = players.find(p => p.id === compareSelection[0]);
                    const p2 = players.find(p => p.id === compareSelection[1]);
                    if (!p1 || !p2) return null;

                    const renderRow = (label: string, v1: any, v2: any, highlightHigher = false) => {
                        const isN1 = typeof v1 === 'number';
                        const isN2 = typeof v2 === 'number';
                        let c1 = 'text-white';
                        let c2 = 'text-white';
                        
                        if (highlightHigher && isN1 && isN2) {
                            if (v1 > v2) { c1 = 'text-green-400 font-bold'; c2 = 'text-red-400'; }
                            if (v2 > v1) { c2 = 'text-green-400 font-bold'; c1 = 'text-red-400'; }
                        }
                        // For sprint times, lower is better
                        if (highlightHigher === false && label.includes('40 Yard') && isN1 && isN2) {
                             if (v1 < v2) { c1 = 'text-green-400 font-bold'; c2 = 'text-red-400'; }
                             if (v2 < v1) { c2 = 'text-green-400 font-bold'; c1 = 'text-red-400'; }
                        }

                        return (
                            <tr className="border-b border-white/5 hover:bg-white/5">
                                <td className={`p-3 text-center ${c1}`}>{v1 || '--'}</td>
                                <td className="p-3 text-center text-text-secondary text-sm font-semibold uppercase">{label}</td>
                                <td className={`p-3 text-center ${c2}`}>{v2 || '--'}</td>
                            </tr>
                        );
                    };

                    return (
                        <div className="space-y-6">
                            <div className="grid grid-cols-3 items-center text-center">
                                <div className="flex flex-col items-center">
                                    <img src={p1.avatarUrl} className="w-24 h-24 rounded-full border-4 border-highlight shadow-lg mb-2" />
                                    <h3 className="text-xl font-bold text-white">{p1.name}</h3>
                                    <span className="text-text-secondary">{p1.position}</span>
                                </div>
                                <div className="text-3xl font-black text-white/20">VS</div>
                                <div className="flex flex-col items-center">
                                    <img src={p2.avatarUrl} className="w-24 h-24 rounded-full border-4 border-orange-500 shadow-lg mb-2" />
                                    <h3 className="text-xl font-bold text-white">{p2.name}</h3>
                                    <span className="text-text-secondary">{p2.position}</span>
                                </div>
                            </div>

                            <div className="bg-secondary rounded-xl border border-white/10 overflow-hidden">
                                <table className="w-full">
                                    <thead>
                                        <tr className="bg-black/20">
                                            <th className="p-2 text-white">{p1.name.split(' ')[0]}</th>
                                            <th className="p-2 text-text-secondary">Atributo</th>
                                            <th className="p-2 text-white">{p2.name.split(' ')[0]}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {renderRow('Rating (OVR)', p1.rating, p2.rating, true)}
                                        {renderRow('Nível', p1.level, p2.level, true)}
                                        {renderRow('Altura', p1.height, p2.height)}
                                        {renderRow('Peso', p1.weight, p2.weight)}
                                        {renderRow('Ano Escolar', p1.class, p2.class)}
                                        {renderRow('40 Yard Dash', p1.combineStats?.fortyYards, p2.combineStats?.fortyYards, false)}
                                        {renderRow('Supino (Reps)', p1.combineStats?.benchPress, p2.combineStats?.benchPress, true)}
                                        {renderRow('Vertical Jump', p1.combineStats?.verticalJump, p2.combineStats?.verticalJump, true)}
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
