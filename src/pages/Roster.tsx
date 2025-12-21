
import React, { useState, useEffect } from 'react';
import { storageService } from '../services/storageService';
import { Player } from '../types';
import Card from '../components/Card';
import LazyImage from '../components/LazyImage';
import { UsersIcon, StarIcon } from '../components/icons/UiIcons';
import PageHeader from '../components/PageHeader';

const Roster: React.FC = () => {
    const [players, setPlayers] = useState<Player[]>([]);

    useEffect(() => {
        setPlayers(storageService.getPlayers());
    }, []);

    return (
        <div className="space-y-6 animate-fade-in pb-20">
            <PageHeader title="Elenco & Depth Chart" subtitle="Gerencie seus atletas e métricas individuais." />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {players.map(player => (
                    <Card key={player.id} className="group hover:border-highlight transition-all relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-2 bg-highlight/10 text-highlight text-[10px] font-black">OVR {player.rating}</div>
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 rounded-2xl overflow-hidden bg-black/40 border border-white/10">
                                <LazyImage src={player.avatarUrl} fallbackText={player.name} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1">
                                <h4 className="text-white font-bold uppercase text-sm truncate leading-tight">{player.name}</h4>
                                <div className="flex items-center gap-2 mt-1">
                                    <span className="text-[10px] font-black bg-white/5 px-2 py-0.5 rounded text-text-secondary">#{player.jerseyNumber}</span>
                                    <span className="text-[10px] font-black text-highlight uppercase">{player.position}</span>
                                </div>
                            </div>
                        </div>
                        <div className="mt-4 grid grid-cols-3 gap-2 border-t border-white/5 pt-4">
                             <div className="text-center"><p className="text-[8px] text-text-secondary uppercase">SPD</p><p className="text-xs font-bold text-white">82</p></div>
                             <div className="text-center"><p className="text-[8px] text-text-secondary uppercase">STR</p><p className="text-xs font-bold text-white">75</p></div>
                             <div className="text-center"><p className="text-[8px] text-text-secondary uppercase">AGI</p><p className="text-xs font-bold text-white">78</p></div>
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default Roster;
