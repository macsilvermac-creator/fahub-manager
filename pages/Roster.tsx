
import React, { useState, useMemo } from 'react';
import AthleteCard from '@/components/AthleteCard';
import { storageService } from '@/services/storageService';
import PageHeader from '@/components/PageHeader';
import { UsersIcon, AlertTriangleIcon, WalletIcon } from '@/components/icons/UiIcons';

type RosterFilter = 'ALL' | 'OFFENSE' | 'DEFENSE' | 'ST' | 'IR' | 'INELIGIBLE';

const Roster: React.FC = () => {
    const [filter, setFilter] = useState<RosterFilter>('ALL');
    const players = storageService.getPlayers();

    const filteredPlayers = useMemo(() => {
        return players.filter(p => {
            if (filter === 'ALL') return true;
            if (filter === 'IR') return p.rosterCategory === 'IR';
            if (filter === 'INELIGIBLE') {
                // Simulação: inaptos por inadinplencia ou bloqueio CT (attendance baixo ou status)
                return p.status === 'BLOCKED' || (p.attendanceRate || 0) < 50;
            }
            
            const pos = p.position;
            if (filter === 'OFFENSE') return ['QB','RB','WR','TE','OL'].includes(pos);
            if (filter === 'DEFENSE') return ['DL','LB','CB','S'].includes(pos);
            if (filter === 'ST') return ['K','P','LS'].includes(pos);
            return true;
        });
    }, [players, filter]);

    return (
        <div className="h-full flex flex-col space-y-6 animate-fade-in pb-20 overflow-hidden">
            <PageHeader title="Roster Lab" subtitle="Gestão operacional do elenco e elegibilidade de jogo." />

            {/* Broadcasting Filters */}
            <div className="flex bg-secondary/40 p-1.5 rounded-[2.5rem] border border-white/5 shrink-0 overflow-x-auto no-scrollbar gap-1">
                {[
                    { id: 'ALL', label: 'Todo o Elenco' },
                    { id: 'OFFENSE', label: 'Ataque' },
                    { id: 'DEFENSE', label: 'Defesa' },
                    { id: 'ST', label: 'Special Teams' },
                    { id: 'IR', label: 'IR (DM)' },
                    { id: 'INELIGIBLE', label: '⚠️ Inaptos' }
                ].map(f => (
                    <button 
                        key={f.id}
                        onClick={() => setFilter(f.id as RosterFilter)}
                        className={`flex-1 min-w-[140px] py-4 rounded-[1.8rem] text-[10px] font-black transition-all uppercase tracking-widest ${
                            filter === f.id ? (f.id === 'INELIGIBLE' ? 'bg-red-600 text-white' : 'bg-highlight text-white shadow-glow') : 'text-text-secondary hover:text-white'
                        }`}
                    >
                        {f.label}
                    </button>
                ))}
            </div>

            {/* Athletes Grid - 6 cards visible per viewport approx */}
            <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 pb-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredPlayers.map(player => (
                        <AthleteCard 
                            key={player.id} 
                            player={player} 
                            onClick={() => {}}
                            onDelete={() => {}}
                        />
                    ))}
                    {filteredPlayers.length === 0 && (
                        <div className="col-span-full py-40 text-center border-2 border-dashed border-white/10 rounded-[3rem] opacity-20">
                            <UsersIcon className="w-20 h-20 mx-auto mb-4" />
                            <p className="font-black uppercase tracking-[0.5em]">Nenhum atleta nesta categoria</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Bottom Insight Bar */}
            <div className="bg-black/40 p-6 rounded-[2.5rem] border border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 px-10 shrink-0">
                <div className="flex gap-12">
                    <div className="flex items-center gap-3">
                        <WalletIcon className="w-5 h-5 text-red-500" />
                        <div>
                            <p className="text-[9px] text-text-secondary uppercase font-bold">Bloqueio Financeiro</p>
                            <p className="text-white font-black">04 Atletas</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <AlertTriangleIcon className="w-5 h-5 text-orange-500" />
                        <div>
                            <p className="text-[9px] text-text-secondary uppercase font-bold">Bloqueio CT (Disciplina)</p>
                            <p className="text-white font-black">02 Atletas</p>
                        </div>
                    </div>
                </div>
                <button className="bg-white/5 hover:bg-white/10 text-white px-10 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] border border-white/10 transition-all">Notificar Staff Gestão</button>
            </div>
        </div>
    );
};

export default Roster;