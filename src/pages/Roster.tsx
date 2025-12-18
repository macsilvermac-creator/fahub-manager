
import React, { useState, useEffect, useContext, useMemo, useRef } from 'react';
import { Player, RosterCategory } from '../types';
import AthleteCard from '../components/AthleteCard';
import AddPlayerModal from '../components/AddPlayerModal';
import PlayerDetailsModal from '../components/PlayerDetailsModal';
import ConfirmationModal from '../components/ConfirmationModal';
import Modal from '../components/Modal';
import { UsersIcon, ClipboardIcon, ChevronDownIcon, LockIcon, RefreshIcon, TrendingUpIcon } from '../components/icons/UiIcons';
import { storageService } from '../services/storageService';
import PrintLayout from '../components/PrintLayout';
import { UserContext } from '../components/Layout';
import { useToast } from '../contexts/ToastContext'; 
import { useAppStore } from '@/utils/storeHooks';
import LazyImage from '@/components/LazyImage';

const Roster: React.FC = () => {
    const { currentRole } = useContext(UserContext);
    const toast = useToast();
    
    // --- REATIVIDADE ---
    const players = useAppStore('players', storageService.getPlayers);
    const activeProgram = useAppStore('activeProgram', storageService.getActiveProgram);

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
    const [playerToDelete, setPlayerToDelete] = useState<Player | null>(null);
    const [viewMode, setViewMode] = useState<'CARDS' | 'DEPTH_CHART'>('CARDS');
    
    const [visibleCount, setVisibleCount] = useState(12);
    const loaderRef = useRef<HTMLDivElement>(null);

    const [activeCategory, setActiveCategory] = useState<RosterCategory>('ACTIVE');
    const [unitFilter, setUnitFilter] = useState<'ALL' | 'OFFENSE' | 'DEFENSE' | 'ST'>('ALL');

    const [isCompareMode, setIsCompareMode] = useState(false);
    const [compareSelection, setCompareSelection] = useState<number[]>([]);
    const [showCompareModal, setShowCompareModal] = useState(false);

    const isPlayer = currentRole === 'PLAYER';
    const canCreateDelete = currentRole === 'MASTER'; 
    const canManageRoster = currentRole === 'MASTER' || currentRole === 'HEAD_COACH' || currentRole === 'OFFENSIVE_COORD' || currentRole === 'DEFENSIVE_COORD';

    useEffect(() => {
        if (isPlayer) setViewMode('CARDS');
    }, [isPlayer]);

    useEffect(() => {
        setVisibleCount(12);
    }, [activeCategory, unitFilter, viewMode, activeProgram]);

    const handleAddPlayer = (newPlayerData: Omit<Player, 'id' | 'level' | 'xp' | 'badges' | 'rating' | 'status'>) => {
        try {
            const newId = Date.now();
            const newPlayer: Player = {
                id: newId,
                level: 1,
                xp: 0,
                rating: 70, 
                status: 'ACTIVE',
                rosterCategory: 'ACTIVE',
                badges: ['Novato'],
                // Correct property name and initialization for rosterHistory
                rosterHistory: [{ id: `h-${Date.now()}`, date: new Date(), type: 'RECRUITMENT', description: 'Adicionado ao Roster via Cadastro' }],
                depthChartOrder: 3,
                ...newPlayerData
            };
            
            storageService.registerAthlete(newPlayer);
            setIsAddModalOpen(false);
            toast.success(`Atleta ${newPlayer.name} recrutado!`); 
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
            toast.info(`${playerToDelete.name} removido.`); 
            setPlayerToDelete(null);
        }
    };

    const handleMovePlayer = (player: Player, newCategory: RosterCategory) => {
        if (!canManageRoster) return;
        const updated = players.map(p => p.id === player.id ? { ...p, rosterCategory: newCategory } : p);
        storageService.savePlayers(updated);
        toast.success(`${player.name} movido.`); 
    };

    const toggleCompareSelect = (id: number) => {
        if (compareSelection.includes(id)) {
            setCompareSelection(prev => prev.filter(pid => pid !== id));
        } else {
            if (compareSelection.length < 2) {
                setCompareSelection(prev => [...prev, id]);
            } else {
                toast.warning("Selecione no máximo 2 atletas.");
            }
        }
    };

    const filteredPlayers = useMemo(() => {
        return players.filter(p => {
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

    const displayedPlayers = filteredPlayers.slice(0, visibleCount);

    useEffect(() => {
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                if (displayedPlayers.length < filteredPlayers.length) {
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

    const renderComparisonModal = () => {
        const p1 = players.find(p => p.id === compareSelection[0]);
        const p2 = players.find(p => p.id === compareSelection[1]);
        if (!p1 || !p2) return null;

        const renderBar = (val1: number, val2: number, max: number = 100, label: string) => (
            <div className="mb-4">
                <div className="flex justify-between text-xs text-text-secondary mb-1">
                    <span className={val1 > val2 ? 'text-highlight font-bold' : ''}>{val1}</span>
                    <span className="uppercase font-bold text-white">{label}</span>
                    <span className={val2 > val1 ? 'text-blue-400 font-bold' : ''}>{val2}</span>
                </div>
                <div className="flex gap-1 h-2">
                    <div className="flex-1 bg-black/40 rounded-l overflow-hidden flex justify-end">
                        <div className="h-full bg-highlight" style={{ width: `${(val1 / max) * 100}%` }}></div>
                    </div>
                    <div className="w-px bg-white/20"></div>
                    <div className="flex-1 bg-black/40 rounded-r overflow-hidden flex justify-start">
                        <div className="h-full bg-blue-500" style={{ width: `${(val2 / max) * 100}%` }}></div>
                    </div>
                </div>
            </div>
        );

        return (
            <div className="flex flex-col gap-6">
                <div className="flex justify-between items-center bg-black/20 p-6 rounded-2xl border border-white/5">
                    <div className="text-center w-1/3">
                        <div className="relative inline-block">
                            <LazyImage src={p1.avatarUrl} className="w-24 h-24 rounded-full border-4 border-highlight object-cover shadow-lg" />
                            <div className="absolute -bottom-2 -right-2 bg-black text-white font-bold px-2 py-0.5 rounded border border-highlight text-xs">#{p1.jerseyNumber}</div>
                        </div>
                        <h3 className="text-xl font-bold text-white mt-2">{p1.name}</h3>
                        <p className="text-sm text-text-secondary">{p1.position} • {p1.class}</p>
                    </div>
                    
                    <div className="text-center w-1/3 flex flex-col items-center justify-center">
                        <div className="bg-white/10 rounded-full p-3 mb-2">
                            <TrendingUpIcon className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-xs text-text-secondary font-bold uppercase">Comparativo Direto</span>
                    </div>

                    <div className="text-center w-1/3">
                         <div className="relative inline-block">
                            <LazyImage src={p2.avatarUrl} className="w-24 h-24 rounded-full border-4 border-blue-500 object-cover shadow-lg" />
                            <div className="absolute -bottom-2 -right-2 bg-black text-white font-bold px-2 py-0.5 rounded border border-blue-500 text-xs">#{p2.jerseyNumber}</div>
                        </div>
                        <h3 className="text-xl font-bold text-white mt-2">{p2.name}</h3>
                        <p className="text-sm text-text-secondary">{p2.position} • {p2.class}</p>
                    </div>
                </div>

                <div className="bg-secondary/40 p-6 rounded-xl border border-white/5">
                    {renderBar(p1.rating, p2.rating, 100, "OVR (Geral)")}
                    {renderBar(p1.xp, p2.xp, 5000, "Experiência (XP)")}
                    {renderBar(Number(p1.weight), Number(p2.weight), 350, "Peso (lbs)")}
                    {renderBar(p1.combineStats?.fortyYards ? (10 - p1.combineStats.fortyYards) * 10 : 0, p2.combineStats?.fortyYards ? (10 - p2.combineStats.fortyYards) * 10 : 0, 100, "Velocidade (Inv)")}
                    {renderBar(p1.combineStats?.benchPress || 0, p2.combineStats?.benchPress || 0, 40, "Força (Bench)")}
                </div>

                <div className="grid grid-cols-2 gap-4">
                     <div className="bg-highlight/10 p-4 rounded-lg border border-highlight/20">
                         <h4 className="font-bold text-highlight text-sm mb-2">Vantagens {p1.name.split(' ')[0]}</h4>
                         <ul className="text-xs text-text-secondary space-y-1 list-disc pl-4">
                             {p1.rating > p2.rating && <li>Maior Overall</li>}
                             {p1.level > p2.level && <li>Mais Experiente</li>}
                             {p1.badges && <li>Possui {p1.badges.length} insignias</li>}
                         </ul>
                     </div>
                     <div className="bg-blue-900/20 p-4 rounded-lg border border-blue-500/20">
                         <h4 className="font-bold text-blue-400 text-sm mb-2">Vantagens {p2.name.split(' ')[0]}</h4>
                         <ul className="text-xs text-text-secondary space-y-1 list-disc pl-4">
                             {p2.rating > p1.rating && <li>Maior Overall</li>}
                             {p2.level > p1.level && <li>Mais Experiente</li>}
                             {p2.badges && <li>Possui {p2.badges.length} insignias</li>}
                         </ul>
                     </div>
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
                        Elenco {activeProgram === 'FLAG' ? 'Flag' : 'Full Pads'}
                    </h2>
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
                        className={`px-4 py-2 rounded-xl font-semibold border transition-all ${isCompareMode ? 'bg-indigo-600 border-indigo-500 text-white shadow-glow' : 'bg-secondary text-text-secondary border-white/10 hover:text-white'}`}
                    >
                        {isCompareMode ? (compareSelection.length === 2 ? 'Ver Comparação' : `Selecionar (${compareSelection.length}/2)`) : 'Comparar Atletas'}
                    </button>

                    {!isPlayer && (
                        <div className="bg-secondary p-1 rounded-lg flex border border-white/10">
                            <button onClick={() => setViewMode('CARDS')} className={`px-4 py-2 rounded-md text-sm font-semibold transition-colors ${viewMode === 'CARDS' ? 'bg-highlight text-white shadow-sm' : 'text-text-secondary hover:text-white'}`}>Cards</button>
                            <button onClick={() => setViewMode('DEPTH_CHART')} className={`px-4 py-2 rounded-md text-sm font-semibold transition-colors ${viewMode === 'DEPTH_CHART' ? 'bg-highlight text-white' : 'text-text-secondary hover:text-white'}`}>Tática</button>
                        </div>
                    )}
                    {canCreateDelete && (
                        <button onClick={() => setIsAddModalOpen(true)} className="px-6 py-2.5 bg-highlight text-white rounded-xl font-semibold shadow-lg">
                            + Cadastrar
                        </button>
                    )}
                </div>
            </div>

            {!isPlayer && viewMode === 'CARDS' && (
                <div className="flex flex-col space-y-2 md:flex-row md:space-y-0 md:items-center md:justify-between border-b border-white/10 mb-4 no-print">
                    <div className="flex overflow-x-auto">
                        <button onClick={() => setActiveCategory('ACTIVE')} className={`px-6 py-3 font-bold text-sm border-b-2 ${activeCategory === 'ACTIVE' ? 'border-green-500 text-green-400' : 'border-transparent text-text-secondary'}`}>Active</button>
                        <button onClick={() => setActiveCategory('PRACTICE_SQUAD')} className={`px-6 py-3 font-bold text-sm border-b-2 ${activeCategory === 'PRACTICE_SQUAD' ? 'border-yellow-500 text-yellow-400' : 'border-transparent text-text-secondary'}`}>PS</button>
                        <button onClick={() => setActiveCategory('IR')} className={`px-6 py-3 font-bold text-sm border-b-2 ${activeCategory === 'IR' ? 'border-red-500 text-red-400' : 'border-transparent text-text-secondary'}`}>IR</button>
                    </div>
                </div>
            )}

            <div className="print-safe">
                {viewMode === 'CARDS' ? (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {displayedPlayers.map(player => (
                                <div key={player.id} className="relative group">
                                    <AthleteCard 
                                        player={player} 
                                        onClick={(p) => isCompareMode ? toggleCompareSelect(p.id) : setSelectedPlayer(p)}
                                        onDelete={canCreateDelete ? handleDeleteClick : () => {}}
                                    />
                                    {isCompareMode && (
                                        <div className={`absolute inset-0 bg-black/50 rounded-xl flex items-center justify-center cursor-pointer transition-opacity ${compareSelection.includes(player.id) ? 'opacity-100 ring-4 ring-indigo-500' : 'opacity-0 hover:opacity-100'}`} onClick={() => toggleCompareSelect(player.id)}>
                                            <div className={`w-12 h-12 rounded-full border-2 flex items-center justify-center ${compareSelection.includes(player.id) ? 'bg-indigo-600 border-white text-white' : 'border-white text-transparent'}`}>
                                                <TrendingUpIcon className="w-6 h-6 text-white" />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                        
                        {visibleCount < filteredPlayers.length && (
                             <div ref={loaderRef} className="w-full py-8 flex justify-center items-center">
                                 <div className="flex items-center gap-2 text-text-secondary animate-pulse">
                                     <RefreshIcon className="w-5 h-5 animate-spin" />
                                     <span className="text-sm font-bold">Carregando...</span>
                                 </div>
                             </div>
                        )}
                    </>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-x-auto pb-4">
                       <div className="bg-secondary p-8 rounded-xl text-center text-text-secondary border border-white/5">
                           <ClipboardIcon className="w-12 h-12 mx-auto mb-4 opacity-20" />
                           <p>Visualização Tática de Depth Chart (Disponível em breve)</p>
                       </div>
                    </div>
                )}
            </div>
            
            <AddPlayerModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onAdd={handleAddPlayer} />
            <PlayerDetailsModal isOpen={!!selectedPlayer} onClose={() => setSelectedPlayer(null)} player={selectedPlayer} />
            <ConfirmationModal isOpen={!!playerToDelete} onClose={() => setPlayerToDelete(null)} onConfirm={confirmDeletePlayer} title="Excluir Jogador?" message={`Confirmar exclusão de ${playerToDelete?.name}?`} confirmLabel="Excluir" />

            <Modal isOpen={showCompareModal} onClose={() => setShowCompareModal(false)} title="Análise Comparativa (Head-to-Head)" maxWidth="max-w-4xl">
                 {renderComparisonModal()}
            </Modal>
        </div>
    );
};

export default Roster;