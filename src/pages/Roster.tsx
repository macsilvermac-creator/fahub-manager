import React, { useState, useEffect, useContext, useMemo, useRef } from 'react';
import { Player, RosterCategory } from '../types';
import AthleteCard from '../components/AthleteCard';
import AddPlayerModal from '../components/AddPlayerModal';
import PlayerDetailsModal from '../components/PlayerDetailsModal';
import ConfirmationModal from '../components/ConfirmationModal';
import Modal from '../components/Modal';
import { UsersIcon, ClipboardIcon, ChevronDownIcon, RefreshIcon, TrendingUpIcon } from '../components/icons/UiIcons';
import { storageService } from '../services/storageService';
import PrintLayout from '../components/PrintLayout';
import { UserContext } from '../components/Layout';
import { useToast } from '../contexts/ToastContext'; 
import { useAppStore } from '../utils/storeHooks';
import LazyImage from '../components/LazyImage';

const Roster: React.FC = () => {
    const { currentRole } = useContext(UserContext);
    const toast = useToast();
    
    // Hooks Reativos para Sincronização em Tempo Real
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
    const canManage = currentRole === 'MASTER' || currentRole === 'HEAD_COACH';

    // Fix: Added missing toggleCompareSelect function
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

    useEffect(() => {
        if (isPlayer) setViewMode('CARDS');
    }, [isPlayer]);

    useEffect(() => {
        setVisibleCount(12);
    }, [activeCategory, unitFilter, viewMode, activeProgram]);

    const handleAddPlayer = (newPlayerData: any) => {
        try {
            const newPlayer: Player = {
                id: Date.now(),
                level: 1,
                xp: 0,
                rating: 70, 
                status: 'ACTIVE',
                rosterCategory: 'ACTIVE',
                badges: ['Novato'],
                rosterHistory: [{ id: `h-${Date.now()}`, date: new Date(), type: 'RECRUITMENT', description: 'Novo Recruta' }],
                depthChartOrder: 3,
                ...newPlayerData
            };
            
            storageService.registerAthlete(newPlayer);
            setIsAddModalOpen(false);
            toast.success(`Atleta ${newPlayer.name} registrado!`); 
        } catch (error: any) {
            toast.error(error.message); 
        }
    };

    const confirmDeletePlayer = () => {
        if (playerToDelete) {
            const updated = players.filter(p => p.id !== playerToDelete.id);
            storageService.savePlayers(updated);
            toast.info("Atleta removido."); 
            setPlayerToDelete(null);
        }
    };

    const filteredPlayers = useMemo(() => {
        return players.filter(p => {
            if (activeProgram !== 'BOTH' && p.program && p.program !== activeProgram) return false;
            if ((p.rosterCategory || 'ACTIVE') !== activeCategory) return false;
            
            if (unitFilter === 'ALL') return true;
            const pos = p.position;
            
            if (unitFilter === 'OFFENSE') return ['QB','RB','WR','TE','OL','LT','LG','C','RG','RT','CENTER','RUSHER'].includes(pos);
            if (unitFilter === 'DEFENSE') return ['DL','DE','DT','LB','CB','S','FS','SS','DB','RUSHER'].includes(pos);
            if (unitFilter === 'ST') return ['K','P','LS','KR','PR'].includes(pos);
            return true;
        });
    }, [players, activeCategory, unitFilter, activeProgram]);

    const displayedPlayers = filteredPlayers.slice(0, visibleCount);

    return (
        <div className="space-y-8 animate-fade-in pb-12">
            <PrintLayout />
            
            <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4 no-print">
                <div>
                    <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter">
                        Depth Chart <span className="text-highlight">{activeProgram}</span>
                    </h2>
                    <p className="text-text-secondary text-sm">Gestão técnica e física de alto rendimento.</p>
                </div>
                <div className="flex gap-3">
                     <button 
                        onClick={() => {
                            if (isCompareMode && compareSelection.length === 2) setShowCompareModal(true);
                            else { setIsCompareMode(!isCompareMode); setCompareSelection([]); }
                        }}
                        className={`px-4 py-2 rounded-xl font-bold text-xs uppercase transition-all border ${isCompareMode ? 'bg-indigo-600 border-indigo-500 text-white shadow-glow' : 'bg-secondary text-text-secondary border-white/10'}`}
                    >
                        {isCompareMode ? (compareSelection.length === 2 ? 'Comparar' : `Selecionar (${compareSelection.length}/2)`) : 'Comparar'}
                    </button>
                    {canManage && (
                        <button onClick={() => setIsAddModalOpen(true)} className="bg-highlight text-white px-6 py-2 rounded-xl font-bold text-xs uppercase shadow-lg">+ Recrutar</button>
                    )}
                </div>
            </div>

            {!isPlayer && (
                <div className="flex gap-4 border-b border-white/10 no-print">
                    <button onClick={() => setActiveCategory('ACTIVE')} className={`pb-3 text-xs font-bold uppercase tracking-widest ${activeCategory === 'ACTIVE' ? 'border-b-2 border-highlight text-highlight' : 'text-text-secondary'}`}>Ativos</button>
                    <button onClick={() => setActiveCategory('PRACTICE_SQUAD')} className={`pb-3 text-xs font-bold uppercase tracking-widest ${activeCategory === 'PRACTICE_SQUAD' ? 'border-b-2 border-yellow-500 text-yellow-500' : 'text-text-secondary'}`}>Practice Squad</button>
                    <button onClick={() => setActiveCategory('IR')} className={`pb-3 text-xs font-bold uppercase tracking-widest ${activeCategory === 'IR' ? 'border-b-2 border-red-500 text-red-500' : 'text-text-secondary'}`}>Inativos</button>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {displayedPlayers.map(player => (
                    <div key={player.id} className="relative">
                        <AthleteCard 
                            player={player} 
                            onClick={(p) => isCompareMode ? toggleCompareSelect(p.id) : setSelectedPlayer(p)}
                            onDelete={canManage ? (p) => setPlayerToDelete(p) : () => {}}
                        />
                        {isCompareMode && (
                            <div className={`absolute inset-0 z-20 rounded-2xl flex items-center justify-center cursor-pointer transition-all ${compareSelection.includes(player.id) ? 'bg-indigo-600/40 ring-4 ring-indigo-500' : 'bg-black/20 hover:bg-black/40'}`} onClick={() => toggleCompareSelect(player.id)}>
                                {compareSelection.includes(player.id) && <TrendingUpIcon className="w-10 h-10 text-white" />}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <AddPlayerModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onAdd={handleAddPlayer} />
            <PlayerDetailsModal isOpen={!!selectedPlayer} onClose={() => setSelectedPlayer(null)} player={selectedPlayer} />
            <ConfirmationModal isOpen={!!playerToDelete} onClose={() => setPlayerToDelete(null)} onConfirm={confirmDeletePlayer} title="Excluir Atleta?" message={`Tem certeza que deseja remover ${playerToDelete?.name}?`} />
        </div>
    );
};

export default Roster;