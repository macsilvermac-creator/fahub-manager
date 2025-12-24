import React, { useState, useEffect, useContext, useMemo } from 'react';
import { Player, RosterCategory, ProgramType } from '../types';
import AthleteCard from '../components/AthleteCard';
import AddPlayerModal from '../components/AddPlayerModal';
import PlayerDetailsModal from '../components/PlayerDetailsModal';
import ConfirmationModal from '../components/ConfirmationModal';
import { storageService } from '../services/storageService';
import { UserContext } from '../components/Layout';
import { useToast } from '../contexts/ToastContext'; 
import { useAppStore } from '../utils/storeHooks';
import PageHeader from '../components/PageHeader';
import { FilterIcon, UsersIcon } from '../components/icons/UiIcons';

const Roster: React.FC = () => {
    const { currentRole } = useContext(UserContext) as any;
    const toast = useToast();
    
    const players = useAppStore('players', storageService.getPlayers);
    const activeProgram = useAppStore('activeProgram', storageService.getActiveProgram);

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);
    const [playerToDelete, setPlayerToDelete] = useState<Player | null>(null);
    const [activeCategory, setActiveCategory] = useState<RosterCategory>('ACTIVE');
    const [unitFilter, setUnitFilter] = useState<'ALL' | 'OFFENSE' | 'DEFENSE' | 'ST'>('ALL');

    const canManageRoster = currentRole === 'MASTER' || currentRole === 'HEAD_COACH';

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
                ...newPlayerData,
                program: activeProgram
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
            const updatedPlayers = players.filter(p => p.id !== playerToDelete.id);
            storageService.savePlayers(updatedPlayers);
            toast.info(`${playerToDelete.name} removido.`); 
            setPlayerToDelete(null);
        }
    };

    const filteredPlayers = useMemo(() => {
        return players.filter(p => {
            // Filtro por Modalidade (PWA Context)
            if (p.program && p.program !== activeProgram && p.program !== 'BOTH') return false;

            // Filtro por Categoria de Roster
            if ((p.rosterCategory || 'ACTIVE') !== activeCategory) return false;
            
            // Filtro por Unidade Tática
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

    return (
        <div className="space-y-6 animate-fade-in pb-20">
            <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4">
                <PageHeader 
                    title={`Elenco ${activeProgram}`} 
                    subtitle={`Gerenciamento de Atletas para a temporada 2025.`} 
                />
                <div className="flex gap-2">
                    {canManageRoster && (
                        <button onClick={() => setIsAddModalOpen(true)} className="px-6 py-3 bg-highlight text-white rounded-2xl font-black uppercase text-xs shadow-glow transition-all active:scale-95">
                            + Recrutar Atleta
                        </button>
                    )}
                </div>
            </div>

            {/* BARRA DE CATEGORIAS */}
            <div className="flex flex-col md:flex-row md:items-center gap-4 border-b border-white/5 pb-1">
                <div className="flex overflow-x-auto no-scrollbar shrink-0">
                    <button onClick={() => setActiveCategory('ACTIVE')} className={`px-6 py-3 text-[10px] font-black uppercase tracking-widest border-b-2 transition-all ${activeCategory === 'ACTIVE' ? 'border-highlight text-highlight' : 'border-transparent text-text-secondary hover:text-white'}`}>Ativos</button>
                    <button onClick={() => setActiveCategory('PRACTICE_SQUAD')} className={`px-6 py-3 text-[10px] font-black uppercase tracking-widest border-b-2 transition-all ${activeCategory === 'PRACTICE_SQUAD' ? 'border-blue-400 text-blue-400' : 'border-transparent text-text-secondary hover:text-white'}`}>Practice Squad</button>
                    <button onClick={() => setActiveCategory('IR')} className={`px-6 py-3 text-[10px] font-black uppercase tracking-widest border-b-2 transition-all ${activeCategory === 'IR' ? 'border-red-500 text-red-500' : 'border-transparent text-text-secondary hover:text-white'}`}>Injured Reserve</button>
                </div>
                
                <div className="w-px h-6 bg-white/10 hidden md:block"></div>

                <div className="flex gap-1 bg-black/20 p-1 rounded-xl border border-white/5">
                    {['ALL', 'OFFENSE', 'DEFENSE', 'ST'].map(unit => (
                        <button 
                            key={unit}
                            onClick={() => setUnitFilter(unit as any)}
                            className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase transition-all ${unitFilter === unit ? 'bg-white/10 text-white' : 'text-text-secondary hover:text-white'}`}
                        >
                            {unit}
                        </button>
                    ))}
                </div>
            </div>

            {/* GRID DE ATLETAS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredPlayers.map(player => (
                    <AthleteCard 
                        key={player.id} 
                        player={player} 
                        onClick={setSelectedPlayer}
                        onDelete={setPlayerToDelete}
                    />
                ))}
                {filteredPlayers.length === 0 && (
                    <div className="col-span-full py-20 text-center opacity-30 border-2 border-dashed border-white/10 rounded-[2.5rem]">
                        <UsersIcon className="w-12 h-12 mx-auto mb-4" />
                        <p className="font-black uppercase tracking-widest text-xs">Nenhum atleta nesta categoria</p>
                    </div>
                )}
            </div>
            
            <AddPlayerModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onAdd={handleAddPlayer} />
            <PlayerDetailsModal isOpen={!!selectedPlayer} onClose={() => setSelectedPlayer(null)} player={selectedPlayer} />
            <ConfirmationModal isOpen={!!playerToDelete} onClose={() => setPlayerToDelete(null)} onConfirm={confirmDeletePlayer} title="Confirmar Remoção" message={`Tem certeza que deseja remover ${playerToDelete?.name} do elenco? Esta ação é irreversível.`} confirmLabel="Excluir Definitivamente" />
        </div>
    );
};

export default Roster;