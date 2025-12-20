
import React, { useState, useEffect, useContext } from 'react';
import { Game, Player, PlayerRotation } from '../types';
import { storageService } from '../services/storageService';
import { realtimeService } from '../services/realtimeService';
import { ClockIcon, UsersIcon, ActivityIcon, FireIcon, AlertTriangleIcon, CheckCircleIcon } from '../components/icons/UiIcons';
import { UserContext } from '../components/Layout';
import { useToast } from '../contexts/ToastContext';
import Card from '../components/Card';
import LazyImage from '../components/LazyImage';

const CoachGameDay: React.FC = () => {
    const { currentRole } = useContext(UserContext) as any;
    const toast = useToast();
    const [activeGame, setActiveGame] = useState<Game | null>(null);
    const [players, setPlayers] = useState<Player[]>([]);
    const [rotation, setRotation] = useState<PlayerRotation[]>([]);
    const [activeView, setActiveView] = useState<'TACTICAL' | 'ROTATION'>('ROTATION');

    useEffect(() => {
        const games = storageService.getGames();
        const live = games.find(g => g.status === 'IN_PROGRESS' || g.status === 'HALFTIME') || games[0];
        setActiveGame(live);
        
        const allPlayers = storageService.getPlayers();
        setPlayers(allPlayers);

        // Inicializa rotação se não houver
        if (live && !live.rotation) {
            const initialRotation = allPlayers.slice(0, 12).map(p => ({
                playerId: p.id,
                status: 'BENCH' as const,
                minutesPlayed: 0,
                fatigueLevel: 0
            }));
            setRotation(initialRotation);
        } else if (live?.rotation) {
            setRotation(live.rotation);
        }
    }, []);

    const toggleOnField = (playerId: string | number) => {
        const activeCount = rotation.filter(r => r.status === 'ON_FIELD').length;
        const current = rotation.find(r => String(r.playerId) === String(playerId));
        
        if (current?.status === 'ON_FIELD') {
            updateRotation(playerId, 'BENCH');
        } else {
            if (activeCount >= 5) {
                toast.warning("Limite de 5 atletas em campo atingido!");
                return;
            }
            updateRotation(playerId, 'ON_FIELD');
        }
    };

    const updateRotation = (playerId: string | number, status: 'ON_FIELD' | 'BENCH') => {
        const updated = rotation.map(r => r.playerId === playerId ? { ...r, status } : r);
        setRotation(updated);
        if (activeGame) {
            // Fix: updated rotation correctly on Game
            storageService.updateLiveGame(activeGame.id, { rotation: updated });
        }
    };

    const getFatigueColor = (fatigue: number) => {
        if (fatigue > 80) return 'text-red-500';
        if (fatigue > 50) return 'text-yellow-500';
        return 'text-green-500';
    };

    if (!activeGame) return <div className="text-white text-center py-20">Nenhum jogo ativo.</div>;

    return (
        <div className="space-y-4 animate-fade-in pb-20">
            {/* Game Header */}
            <div className="bg-black p-4 rounded-2xl border-b-4 border-highlight flex justify-between items-center shadow-2xl">
                <div>
                    <h1 className="text-xl font-black text-white italic tracking-tighter">VS {activeGame.opponent.toUpperCase()}</h1>
                    <div className="flex gap-3 text-xs font-mono text-text-secondary">
                        <span className="text-yellow-400">Q{activeGame.currentQuarter || 1}</span>
                        <span>{activeGame.clock || '12:00'}</span>
                    </div>
                </div>
                <div className="flex bg-secondary p-1 rounded-lg">
                    <button onClick={() => setActiveView('TACTICAL')} className={`px-4 py-1.5 rounded-md text-[10px] font-bold ${activeView === 'TACTICAL' ? 'bg-highlight text-white' : 'text-text-secondary'}`}>TÁTICO</button>
                    <button onClick={() => setActiveView('ROTATION')} className={`px-4 py-1.5 rounded-md text-[10px] font-bold ${activeView === 'ROTATION' ? 'bg-red-600 text-white' : 'text-text-secondary'}`}>HOT BENCH</button>
                </div>
                <span className="text-3xl font-mono font-bold text-white">{activeGame.score || '0-0'}</span>
            </div>

            {activeView === 'ROTATION' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Active 5 on Field */}
                    <div className="lg:col-span-2 space-y-4">
                        <div className="flex justify-between items-center">
                            <h3 className="text-white font-black uppercase italic tracking-widest flex items-center gap-2">
                                <UsersIcon className="w-5 h-5 text-highlight"/> Em Campo (5v5)
                            </h3>
                            <div className="text-[10px] font-bold text-text-secondary bg-white/5 px-2 py-1 rounded">
                                {rotation.filter(r => r.status === 'ON_FIELD').length}/5 JOGADORES
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {rotation.filter(r => r.status === 'ON_FIELD').map(r => {
                                const p = players.find(player => player.id === r.playerId);
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
                                        <div className="text-right">
                                            <p className={`text-xs font-black ${getFatigueColor(r.fatigueLevel)}`}>FATIGUE: {r.fatigueLevel}%</p>
                                            <p className="text-[10px] text-text-secondary">{r.minutesPlayed}m played</p>
                                        </div>
                                    </div>
                                );
                            })}
                            {rotation.filter(r => r.status === 'ON_FIELD').length === 0 && (
                                <div className="col-span-2 py-12 border-2 border-dashed border-white/5 rounded-2xl flex flex-col items-center justify-center opacity-40">
                                    <UsersIcon className="w-12 h-12 mb-2" />
                                    <p className="text-sm font-bold">Campo Vazio. Selecione atletas do banco.</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Bench / Available */}
                    <Card title="Banco (Hot Bench)">
                        <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                            {rotation.filter(r => r.status === 'BENCH').map(r => {
                                const p = players.find(player => player.id === r.playerId);
                                if (!p) return null;
                                return (
                                    <div key={p.id} onClick={() => toggleOnField(p.id)} className="bg-black/20 p-3 rounded-xl border border-white/5 flex items-center justify-between group cursor-pointer hover:border-highlight transition-all">
                                        <div className="flex items-center gap-3">
                                            <LazyImage src={p.avatarUrl} className="w-8 h-8 rounded-full grayscale group-hover:grayscale-0 transition-all" />
                                            <div>
                                                <p className="font-bold text-white text-xs">{p.name}</p>
                                                <p className="text-[9px] text-text-secondary">{p.position}</p>
                                            </div>
                                        </div>
                                        <div className="bg-highlight/10 text-highlight text-[9px] font-bold px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                            ENTRAR
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </Card>
                </div>
            )}

            {/* Tactical View Placeholder */}
            {activeView === 'TACTICAL' && (
                <div className="text-center py-20 text-text-secondary italic">
                    Modo tático sincronizado com Playbook IA...
                </div>
            )}
        </div>
    );
};

export default CoachGameDay;