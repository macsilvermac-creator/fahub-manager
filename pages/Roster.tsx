
import React, { useState, useMemo } from 'react';
import AthleteCard from '@/components/AthleteCard';
import { storageService } from '@/services/storageService';
import PageHeader from '@/components/PageHeader';
import { FilterIcon, UsersIcon, AlertCircleIcon, ShieldCheckIcon } from '@/components/icons/UiIcons';

const Roster: React.FC = () => {
    const [activeFilter, setActiveFilter] = useState<'ALL' | 'ATAQUE' | 'DEFESA' | 'ST' | 'IR' | 'INAPTOS'>('ALL');
    const players = storageService.getPlayers();

    const filteredPlayers = useMemo(() => {
        return players.filter(p => {
            if (activeFilter === 'ALL') return true;
            if (activeFilter === 'IR') return p.rosterCategory === 'IR';
            if (activeFilter === 'INAPTOS') return p.status === 'BLOCKED' || (p.attendanceRate || 0) < 50;
            
            const pos = p.position;
            if (activeFilter === 'ATAQUE') return ['QB','RB','WR','TE','OL'].includes(pos);
            if (activeFilter === 'DEFESA') return ['DL','LB','CB','S'].includes(pos);
            if (activeFilter === 'ST') return ['K','P','LS'].includes(pos);
            
            return true;
        });
    }, [players, activeFilter]);

    return (
        <div className="space-y-6 animate-fade-in pb-20 flex flex-col h-full overflow-hidden">
            <PageHeader title="Roster Lab" subtitle="Gestão tática de elenco e elegibilidade." />

            {/* FILTROS BROADCAST STYLE */}
            <div className="flex bg-secondary/40 p-1.5 rounded-3xl border border-white/5 shrink-0 overflow-x-auto no-scrollbar">
                {[
                    { id: 'ALL', label: 'Tudo' },
                    { id: 'ATAQUE', label: 'Ataque' },
                    { id: 'DEFESA', label: 'Defesa' },
                    { id: 'ST', label: 'ST' },
                    { id: 'IR', label: 'IR (DM)' },
                    { id: 'INAPTOS', label: 'Inaptos' }
                ].map(f => (
                    <button 
                        key={f.id}
                        onClick={() => setActiveFilter(f.id as any)}
                        className={`flex-1 min-w-[100px] py-3 rounded-2xl text-[10px] font-black transition-all uppercase tracking-widest ${activeFilter === f.id ? (f.id === 'INAPTOS' ? 'bg-red-600 text-white' : 'bg-highlight text-white shadow-glow') : 'text-text-secondary hover:text-white hover:bg-white/5'}`}
                    >
                        {f.label}
                    </button>
                ))}
            </div>

            {/* GRID DE ATLETAS (6 CARDS VISÍVEIS) */}
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
                             Nenhum atleta encontrado nesta categoria
                        </div>
                    )}
                </div>
            </div>

            {/* QUICK STATS FOOTER */}
            <div className="bg-black/40 p-4 rounded-2xl border border-white/5 flex justify-between items-center px-8 shrink-0">
                <div className="flex gap-8">
                    <div className="text-center">
                        <p className="text-[8px] text-text-secondary uppercase font-black">Ativos</p>
                        <p className="text-sm font-black text-white">{players.length}</p>
                    </div>
                    <div className="text-center">
                        <p className="text-[8px] text-text-secondary uppercase font-black">Elegíveis</p>
                        <p className="text-sm font-black text-highlight">{players.filter(p => p.status === 'ACTIVE').length}</p>
                    </div>
                </div>
                <button className="bg-white/5 hover:bg-white/10 text-white px-4 py-2 rounded-lg text-[9px] font-black uppercase tracking-widest border border-white/10">Exportar Roster PDF</button>
            </div>
        </div>
    );
};

export default Roster;