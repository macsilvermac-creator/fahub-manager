
import React, { useState, useEffect, useContext } from 'react';
import { Game, Player, PlayerRotation } from '../types';
import { storageService } from '../services/storageService';
import { UsersIcon, CheckCircleIcon, ActivityIcon } from '../components/icons/UiIcons';
import { UserContext, UserContextType } from '../components/Layout';
import { useToast } from '../contexts/ToastContext';
import Card from '../components/Card';
import LazyImage from '../components/LazyImage';

const CoachGameDay: React.FC = () => {
    const { currentRole } = useContext(UserContext) as UserContextType;
    const toast = useToast();
    const [activeGame, setActiveGame] = useState<Game | null>(null);
    const [players, setPlayers] = useState<Player[]>([]);
    const [rotation, setRotation] = useState<PlayerRotation[]>([]);

    useEffect(() => {
        const games = storageService.getGames();
        const live = games.find(g => g.status === 'IN_PROGRESS' || g.status === 'HALFTIME') || games[0];
        setActiveGame(live);
        
        const allPlayers = storageService.getPlayers();
        setPlayers(allPlayers);

        if (live && live.rotation) {
            setRotation(live.rotation);
        } else if (allPlayers.length > 0) {
            const initialRotation = allPlayers.slice(0, 15).map(p => ({
                playerId: String(p.id),
                status: 'BENCH' as const,
                minutesPlayed: 0,
                fatigueLevel: 0
            }));
            setRotation(initialRotation);
        }
    }, []);

    const toggleOnField = (playerId: string | number) => {
        const activeCount = rotation.filter(r => r.status === 'ON_FIELD').length;
        const current = rotation.find(r => String(r.playerId) === String(playerId));
        
        if (current?.status === 'ON_FIELD') {
            updateRotation(String(playerId), 'BENCH');
        } else {
            if (activeCount >= 11) { // Mudado para 11 (Padrão Football)
                toast.warning("Limite de 11 atletas atingido!");
                return;
            }
            updateRotation(String(playerId), 'ON_FIELD');
        }
    };

    const updateRotation = (playerId: string, status: 'ON_FIELD' | 'BENCH') => {
        const updated = rotation.map(r => String(r.playerId) === playerId ? { ...r, status } : r);
        setRotation(updated);
        if (activeGame) {
            storageService.updateLiveGame(activeGame.id, { rotation: updated });
        }
    };

    if (!activeGame) return <div className="text-white text-center py-20 opacity-30 italic font-black uppercase">Nenhum jogo ativo para monitoramento.</div>;

    return (
        <div className="space-y-4 animate-fade-in pb-20">
            <div className="bg-black p-6 rounded-2xl border-b-4 border-highlight flex justify-between items-center shadow-2xl">
                <div>
                    <h1 className="text-2xl font-black text-white italic tracking-tighter uppercase">VS {activeGame.opponent}</h1>
                    <p className="text-xs font-mono text-yellow-400 mt-1">Q{activeGame.currentQuarter || 1} • {activeGame.clock || '12:00'}</p>
                </div>
                <div className="text-4xl font-mono font-black text-white">{activeGame.score || '00-00'}</div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-4">
                    <h3 className="text-white font-black uppercase italic tracking-widest flex items-center gap-2">
                        <UsersIcon className="w-5 h-5 text-highlight"/> Em Campo ({rotation.filter(r => r.status === 'ON_FIELD').length}/11)
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {rotation.filter(r => r.status === 'ON_FIELD').map(r => {
                            const p = players.find(player => String(player.id) === String(r.playerId));
                            if (!p) return null;
                            return (
                                <div key={p.id} onClick={() => toggleOnField(p.id)} className="bg-secondary p-4 rounded-2xl border-l-4 border-highlight flex items-center justify-between group cursor-pointer hover:bg-highlight/10 transition-all">
                                    <div className="flex items-center gap-3">
                                        <LazyImage src={p.avatarUrl} className="w-12 h-12 rounded-full border-2 border-highlight" />
                                        <div>
                                            <p className="font-bold text-white leading-none">{p.name}</p>
                                            <p className="text-[10px] text-text-secondary mt-1">{p.position} • #{p.jerseyNumber}</p>
                                        </div>
                                    </div>
                                    <ActivityIcon className="text-green-400 w-4 h-4" />
                                </div>
                            );
                        })}
                    </div>
                </div>

                <Card title="Banco (Hot Bench)">
                    <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                        {rotation.filter(r => r.status === 'BENCH').map(r => {
                            const p = players.find(player => String(player.id) === String(r.playerId));
                            if (!p) return null;
                            return (
                                <div key={p.id} onClick={() => toggleOnField(p.id)} className="bg-black/20 p-3 rounded-xl border border-white/5 flex items-center justify-between group cursor-pointer hover:border-highlight transition-all">
                                    <div className="flex items-center gap-3">
                                        <LazyImage src={p.avatarUrl} className="w-8 h-8 rounded-full grayscale group-hover:grayscale-0 transition-all" />
                                        <div>
                                            <p className="font-bold text-white text-xs">{p.name}</p>
                                            <p className="text-[9px] text-text-secondary uppercase">{p.position}</p>
                                        </div>
                                    </div>
                                    <button className="bg-highlight/10 text-highlight text-[9px] font-bold px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                        SUB
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default CoachGameDay;