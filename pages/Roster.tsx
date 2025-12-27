
import React, { useState, useContext, useMemo } from 'react';
import { Player, RosterCategory } from '@/types';
import AthleteCard from '@/components/AthleteCard';
import { storageService } from '@/services/storageService';
import { UserContext } from '@/components/Layout';
import { useToast } from '@/contexts/ToastContext'; 
import { useAppStore } from '@/utils/storeHooks';
import PageHeader from '@/components/PageHeader';
import { UsersIcon, AlertCircleIcon } from '@/components/icons/UiIcons';

const Roster: React.FC = () => {
    const { currentRole } = useContext(UserContext) as any;
    const toast = useToast();
    
    const players = useAppStore('players', storageService.getPlayers);
    const activeProgram = useAppStore('activeProgram', storageService.getActiveProgram);

    const [activeFilter, setActiveFilter] = useState<'ALL' | 'OFFENSE' | 'DEFENSE' | 'ST' | 'IR' | 'INELIGIBLE'>('ALL');

    const filteredPlayers = useMemo(() => {
        return players.filter(p => {
            if (activeFilter === 'ALL') return true;
            if (activeFilter === 'IR') return p.rosterCategory === 'IR';
            if (activeFilter === 'INELIGIBLE') return p.status === 'BLOCKED' || (p.attendanceRate || 0) < 50;
            
            const pos = p.position;
            if (activeFilter === 'OFFENSE') return ['QB','RB','WR','TE','OL'].includes(pos);
            if (activeFilter === 'DEFENSE') return ['DL','LB','CB','S','FS','SS'].includes(pos);
            if (activeFilter === 'ST') return ['K','P','LS'].includes(pos);
            
            return true;
        });
    }, [players, activeFilter]);

    return (
        <div className="space-y-6 animate-fade-in pb-20 flex flex-col h-full overflow-hidden">
            <PageHeader title="Roster Master" subtitle="Visualização tática e elegibilidade de elenco." />

            {/* FILTROS DE ELITE */}
            <div className="flex bg-secondary/40 p-1.5 rounded-3xl border border-white/5 shrink-0 overflow-x-auto no-scrollbar">
                {[
                    { id: 'ALL', label: 'TUDO' },
                    { id: 'OFFENSE', label: 'ATAQUE' },
                    { id: 'DEFENSE', label: 'DEFESA' },
                    { id: 'ST', label: 'ST' },
                    { id: 'IR', label: 'IR (DM)' },
                    { id: 'INELIGIBLE', label: 'INAPTOS' }
                ].map(f => (
                    <button 
                        key={f.id}
                        onClick={() => setActiveFilter(f.id as any)}
                        className={`flex-1 min-w-[100px] py-3 rounded-2xl text-[10px] font-black transition-all uppercase tracking-widest ${activeFilter === f.id ? (f.id === 'INELIGIBLE' ? 'bg-red-600 text-white' : 'bg-highlight text-white') : 'text-text-secondary hover:text-white'}`}
                    >
                        {f.label}
                    </button>
                ))}
            </div>

            {/* GRID DE 6 CARDS (PAGINADO NO SCROLL) */}
            <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 py-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredPlayers.map(player => (
                        <AthleteCard 
                            key={player.id} 
                            player={player} 
                            onClick={() => {}}
                            onDelete={() => {}}
                        />
                    ))}
                    {filteredPlayers.length === 0 && (
                        <div className="col-span-full py-40 text-center opacity-20 italic font-black uppercase text-sm border-2 border-dashed border-white/10 rounded-[3rem]">
                             <UsersIcon className="w-16 h-16 mx-auto mb-4" />
                             Nenhum atleta nesta categoria
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Roster;