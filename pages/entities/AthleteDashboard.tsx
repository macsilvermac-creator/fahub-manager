import React, { useEffect, useState } from 'react';
import Card from '../../components/Card';
import { storageService } from '../../services/storageService';
// Fix: Updated component state to use Player instead of Athlete to match return type of service
import { Player } from '../../types';
import LazyImage from '../../components/LazyImage';
// Fix: TrophyIcon is exported from NavIcons, not UiIcons
import { ActivityIcon, FireIcon } from '../../components/icons/UiIcons';
import { TrophyIcon } from '../../components/icons/NavIcons';

const AthleteDashboard: React.FC = () => {
    // Fix: Using Player state as getAthleteByUserId returns Player
    const [athlete, setAthlete] = useState<Player | null>(null);
    const user = storageService.getCurrentUser();

    useEffect(() => {
        if (user) {
            const data = storageService.getAthleteByUserId(user.id);
            setAthlete(data || null);
        }
    }, [user]);

    if (!athlete) return <div className="p-10 text-white">Configurando perfil do atleta...</div>;

    return (
        <div className="p-6 space-y-6 animate-fade-in max-w-4xl mx-auto">
            <header className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-black text-white italic uppercase tracking-tighter">My Stats</h1>
                    <p className="text-highlight font-bold text-xs uppercase tracking-widest">Atleta de Elite</p>
                </div>
                <div className="bg-white/5 p-3 rounded-2xl border border-white/10 flex items-center gap-3">
                    <FireIcon className="text-orange-500 w-6 h-6" />
                    <div className="text-right">
                        <p className="text-[10px] text-text-secondary font-bold uppercase">Nível</p>
                        <p className="text-xl font-black text-white leading-none">{athlete.level}</p>
                    </div>
                </div>
            </header>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="md:col-span-1 flex flex-col items-center p-8 bg-gradient-to-b from-secondary to-black">
                    <div className="w-32 h-32 rounded-full p-1 bg-gradient-to-br from-highlight to-blue-500 mb-4 shadow-glow">
                        <LazyImage src={user?.avatarUrl || ''} className="w-full h-full rounded-full object-cover border-4 border-primary" />
                    </div>
                    <h2 className="text-xl font-bold text-white uppercase">{athlete.name}</h2>
                    <p className="text-text-secondary font-bold">#{athlete.jerseyNumber} • {athlete.position}</p>
                </Card>

                <div className="md:col-span-2 space-y-6">
                    <Card title="Performance Atual (OVR)">
                        <div className="flex items-end gap-2 mb-4">
                            {/* Fix: stats is now a property on Player in src/types.ts */}
                            <span className="text-6xl font-black text-white">{athlete.stats?.ovr || athlete.rating}</span>
                            <span className="text-highlight font-bold mb-2">Rating Geral</span>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            {/* Fix: Cast val as any to avoid 'unknown' assignability errors */}
                            {athlete.stats && Object.entries(athlete.stats).filter(([k]) => k !== 'ovr').map(([key, val]) => (
                                <div key={key} className="bg-black/20 p-3 rounded-xl border border-white/5">
                                    <p className="text-[10px] text-text-secondary uppercase font-bold">{key}</p>
                                    <div className="flex items-center justify-between">
                                        <div className="h-1.5 flex-1 bg-white/5 rounded-full overflow-hidden mr-3">
                                            <div className="h-full bg-highlight" style={{ width: `${(val as number)}%` }}></div>
                                        </div>
                                        <span className="text-white font-bold text-sm">{val as number}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default AthleteDashboard;