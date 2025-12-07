
import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import { League, Game } from '../types';
import { storageService } from '../services/storageService';
import { TrophyIcon, FlagIcon } from '../components/icons/NavIcons';
import { ShieldCheckIcon, GavelIcon, UsersIcon, BuildingIcon, FileTextIcon, MapIcon, SwapIcon, AlertTriangleIcon } from '../components/icons/UiIcons';
import Button from '../components/Button';

// Mocks for Federation Features (Retained for illustrative purposes)
const TRANSFER_WINDOW = { status: 'OPEN', closesIn: '15 dias' };
const RECENT_TRANSFERS = [
    { id: 1, player: 'João "Flash" Silva', from: 'Miners', to: 'FAHUB Stars', date: '12/10/2023', status: 'APPROVED' },
    { id: 2, player: 'Pedro "Tank" Souza', from: 'Free Agent', to: 'Bulls', date: '10/10/2023', status: 'PENDING' }
];
const GOVERNANCE_TEAMS = [
    { name: 'FAHUB Stars', status: 'REGULAR', lastFee: 'Paid', statute: 'Signed' },
    { name: 'Bulls', status: 'REGULAR', lastFee: 'Paid', statute: 'Signed' },
    { name: 'Miners', status: 'PENDING', lastFee: 'Late', statute: 'Signed' },
    { name: 'Spartans', status: 'IRREGULAR', lastFee: 'Unpaid', statute: 'Missing' }
];

const LeagueManager: React.FC = () => {
    const [league, setLeague] = useState<League | null>(null);
    const [games, setGames] = useState<Game[]>([]);
    const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'WAR_ROOM' | 'COMPETITION' | 'GOVERNANCE' | 'BID'>('OVERVIEW');

    useEffect(() => {
        const loadData = () => {
            setLeague(storageService.getLeague());
            setGames(storageService.getGames());
        };
        loadData();
        
        // PERFORMANCE: Reduced polling to 60s
        const interval = setInterval(loadData, 60000);
        return () => clearInterval(interval);
    }, []);

    if (!league) return <div className="text-white p-6">Carregando Federação...</div>;

    // Sort by Wins
    const sortedTeams = [...league.teams].sort((a, b) => {
        if (b.wins !== a.wins) return b.wins - a.wins;
        return (b.pointsFor - b.pointsAgainst) - (a.pointsFor - a.pointsAgainst);
    });

    const liveGames = games.filter(g => g.status === 'IN_PROGRESS' || g.status === 'HALFTIME');

    return (
        <div className="space-y-4 pb-20 animate-fade-in">
             {/* Header Compacto */}
             <div className="bg-secondary p-4 rounded-xl border border-white/5 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <BuildingIcon className="text-yellow-500 w-8 h-8" />
                    <div>
                        <h2 className="text-xl font-bold text-white uppercase">Federação</h2>
                        <p className="text-text-secondary text-xs">SIGE v1.0</p>
                    </div>
                </div>
                <div className="text-right">
                    <p className="text-[10px] text-text-secondary uppercase font-bold">Ao Vivo</p>
                    <p className="text-red-500 font-bold text-lg">{liveGames.length}</p>
                </div>
            </div>

            {/* Navigation Scrollable */}
            <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                {[
                    { id: 'OVERVIEW', label: 'Visão', icon: MapIcon },
                    { id: 'WAR_ROOM', label: 'War Room', icon: AlertTriangleIcon },
                    { id: 'COMPETITION', label: 'Tabelas', icon: TrophyIcon },
                    { id: 'GOVERNANCE', label: 'Secretaria', icon: BuildingIcon },
                    { id: 'BID', label: 'BID/TJD', icon: GavelIcon }
                ].map(tab => (
                    <button 
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)} 
                        className={`px-4 py-2 text-xs font-bold rounded-full border whitespace-nowrap flex items-center gap-2 transition-colors ${activeTab === tab.id ? 'bg-highlight text-white border-highlight' : 'bg-secondary text-text-secondary border-white/10'}`}
                    >
                        <tab.icon className="w-3 h-3" /> {tab.label}
                    </button>
                ))}
            </div>

            {/* === TAB 1: OVERVIEW === */}
            {activeTab === 'OVERVIEW' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                        <div className="flex items-center gap-4">
                            <UsersIcon className="w-8 h-8 text-blue-400" />
                            <div>
                                <p className="text-xs text-text-secondary font-bold uppercase">Atletas</p>
                                <p className="text-2xl font-bold text-white">1,245</p>
                            </div>
                        </div>
                    </Card>
                    <Card>
                        <div className="flex items-center gap-4">
                            <FlagIcon className="w-8 h-8 text-green-400" />
                            <div>
                                <p className="text-xs text-text-secondary font-bold uppercase">Times</p>
                                <p className="text-2xl font-bold text-white">18</p>
                            </div>
                        </div>
                    </Card>
                </div>
            )}

            {/* === TAB 2: WAR ROOM === */}
            {activeTab === 'WAR_ROOM' && (
                <div className="space-y-4">
                    <h3 className="text-sm font-bold text-text-secondary uppercase">Jogos em Andamento</h3>
                    {liveGames.length === 0 && (
                        <p className="text-center text-text-secondary italic py-8 bg-secondary/30 rounded-xl">Nenhum jogo ao vivo.</p>
                    )}
                    {liveGames.map(game => (
                        <div key={game.id} className="bg-secondary border-l-4 border-red-500 rounded-r-xl p-4 shadow-sm">
                            <div className="flex justify-between mb-2">
                                <span className="text-red-400 text-xs font-bold uppercase animate-pulse">● Live</span>
                                <span className="text-white font-mono font-bold">{game.clock || '00:00'}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-white font-bold text-lg">HOME</span>
                                <span className="text-2xl font-mono text-white bg-black/30 px-3 py-1 rounded">{game.score || '0-0'}</span>
                                <span className="text-white font-bold text-lg">VISIT</span>
                            </div>
                            {game.officialReport?.infrastructure.ambulancePresent === false && (
                                <div className="mt-2 bg-red-900/30 text-red-300 text-xs p-2 rounded border border-red-500/30 flex items-center gap-2">
                                    <AlertTriangleIcon className="w-3 h-3" /> Alerta: Sem Ambulância
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}

            {/* === TAB 3: COMPETITION === */}
            {activeTab === 'COMPETITION' && (
                <Card title="Classificação Série A">
                    <div className="overflow-x-auto">
                        <table className="w-full text-xs text-left text-text-secondary">
                            <thead className="uppercase bg-black/20 font-bold text-text-secondary">
                                <tr>
                                    <th className="p-3">Time</th>
                                    <th className="p-3 text-center">V-D</th>
                                    <th className="p-3 text-center">Saldo</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sortedTeams.map((team, index) => (
                                    <tr key={team.teamId} className="border-b border-white/5">
                                        <td className="p-3 font-bold text-white flex items-center gap-2">
                                            <span className="text-gray-500 w-4">{index + 1}</span>
                                            {team.teamName}
                                        </td>
                                        <td className="p-3 text-center">{team.wins}-{team.losses}</td>
                                        <td className="p-3 text-center">{team.pointsFor - team.pointsAgainst}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            )}

            {/* === TAB 4: GOVERNANCE === */}
            {activeTab === 'GOVERNANCE' && (
                <div className="space-y-3">
                    {GOVERNANCE_TEAMS.map((team, idx) => (
                        <div key={idx} className="bg-secondary p-3 rounded-lg border border-white/5 flex justify-between items-center">
                            <span className="text-white font-bold text-sm">{team.name}</span>
                            <span className={`text-[10px] font-bold px-2 py-1 rounded ${team.status === 'REGULAR' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                {team.status}
                            </span>
                        </div>
                    ))}
                </div>
            )}

             {/* === TAB 5: BID === */}
             {activeTab === 'BID' && (
                 <Card title="Últimas Transferências">
                     <div className="space-y-2">
                         {RECENT_TRANSFERS.map(t => (
                             <div key={t.id} className="text-xs p-2 bg-black/20 rounded flex justify-between">
                                 <span className="text-white">{t.player}</span>
                                 <span className="text-text-secondary">{t.from} ➝ {t.to}</span>
                             </div>
                         ))}
                     </div>
                 </Card>
             )}
        </div>
    );
};

export default LeagueManager;
