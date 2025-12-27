
import React, { useState, useMemo } from 'react';
import AthleteCard from '@/components/AthleteCard';
import { storageService } from '@/services/storageService';
import PageHeader from '@/components/PageHeader';
import { UsersIcon, FilterIcon, AlertTriangleIcon, WalletIcon } from '@/components/icons/UiIcons';

const Roster: React.FC = () => {
    const [filter, setFilter] = useState<'ALL' | 'OFF' | 'DEF' | 'ST' | 'IR' | 'INELIGIBLE'>('ALL');
    const players = storageService.getPlayers();

    const filteredPlayers = useMemo(() => {
        return players.filter(p => {
            if (filter === 'ALL') return true;
            if (filter === 'IR') return p.rosterCategory === 'IR';
            if (filter === 'INELIGIBLE') return p.status === 'BLOCKED' || (p.attendanceRate || 0) < 50;
            
            const pos = p.position;
            if (filter === 'OFF') return ['QB','RB','WR','TE','OL'].includes(pos);
            if (filter === 'DEF') return ['DL','LB','CB','S'].includes(pos);
            if (filter === 'ST') return ['K','P','LS'].includes(pos);
            
            return true;
        });
    }, [players, filter]);

    return (
        <div className="space-y-6 animate-fade-in pb-20 flex flex-col h-full overflow-hidden">
            <PageHeader title="Roster Lab" subtitle="Gestão tática e elegibilidade de elenco profissional." />

            {/* BROADCAST FILTERS */}
            <div className="flex bg-secondary/40 p-1.5 rounded-[2rem] border border-white/5 shrink-0 overflow-x-auto no-scrollbar gap-1">
                {[
                    { id: 'ALL', label: 'Tudo' },
                    { id: 'OFF', label: 'Ataque' },
                    { id: 'DEF', label: 'Defesa' },
                    { id: 'ST', label: 'ST' },
                    { id: 'IR', label: 'IR (DM)', color: 'text-orange-400' },
                    { id: 'INELIGIBLE', label: 'Inaptos', color: 'text-red-500' }
                ].map(f => (
                    <button 
                        key={f.id}
                        onClick={() => setFilter(f.id as any)}
                        className={`flex-1 min-w-[100px] py-3.5 rounded-2xl text-[10px] font-black transition-all uppercase tracking-widest ${filter === f.id ? (f.id === 'INELIGIBLE' ? 'bg-red-600 text-white' : 'bg-highlight text-white shadow-glow') : 'text-text-secondary hover:text-white'}`}
                    >
                        {f.label}
                    </button>
                ))}
            </div>

            {/* 6 CARD GRID SCROLLABLE */}
            <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 py-4">
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
                             Nenhum atleta nesta categoria de filtro.
                        </div>
                    )}
                </div>
            </div>

            {/* INELIGIBILITY SUMMARY FOOTER */}
            <div className="bg-black/40 p-4 rounded-2xl border border-white/5 flex flex-col md:flex-row justify-between items-center px-8 shrink-0 gap-4">
                <div className="flex gap-8">
                    <div className="flex items-center gap-3">
                         <div className="p-2 bg-red-600/10 rounded-lg"><WalletIcon className="w-4 h-4 text-red-500" /></div>
                         <div><p className="text-[8px] text-text-secondary uppercase font-black">Pendência Financeira</p><p className="text-sm font-black text-white">04 Atletas</p></div>
                    </div>
                    <div className="flex items-center gap-3">
                         <div className="p-2 bg-orange-600/10 rounded-lg"><AlertTriangleIcon className="w-4 h-4 text-orange-500" /></div>
                         <div><p className="text-[8px] text-text-secondary uppercase font-black">Pendência Gestão</p><p className="text-sm font-black text-white">02 Atletas</p></div>
                    </div>
                </div>
                <button className="bg-white/5 hover:bg-white/10 text-white px-6 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest border border-white/10 transition-all italic">Notificar Pendentes</button>
            </div>
        </div>
    );
};

export default Roster;