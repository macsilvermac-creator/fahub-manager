
import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import { League, Game } from '../types';
import { storageService } from '../services/storageService';
import { TrophyIcon, FlagIcon, GlobeIcon } from '../components/icons/NavIcons';
import { ShieldCheckIcon, GavelIcon, UsersIcon, BuildingIcon, FileTextIcon, MapIcon, SwapIcon, AlertTriangleIcon } from '../components/icons/UiIcons';
import Button from '../components/Button';

const LeagueManager: React.FC = () => {
    const [league, setLeague] = useState<League | null>(null);
    const [games, setGames] = useState<Game[]>([]);
    const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'WAR_ROOM' | 'COMPETITION' | 'GOVERNANCE' | 'BID'>('OVERVIEW');

    useEffect(() => {
        const loadData = () => {
            const leagueData = storageService.getLeague();
            // Fix: Ensuring leagueData has all required properties
            setLeague({
                id: leagueData.id || 'default-league',
                name: leagueData.name || 'Liga Regional',
                season: leagueData.season || '2025',
                teams: leagueData.teams || []
            });
            setGames(storageService.getGames());
        };
        loadData();
        const interval = setInterval(loadData, 60000);
        return () => clearInterval(interval);
    }, []);

    if (!league) return <div className="text-white p-6">Carregando Federação...</div>;

    const sortedTeams = [...league.teams].sort((a, b) => {
        if (b.wins !== a.wins) return b.wins - a.wins;
        return (b.pointsFor - b.pointsAgainst) - (a.pointsFor - a.pointsAgainst);
    });

    const liveGames = games.filter(g => g.status === 'IN_PROGRESS' || g.status === 'HALFTIME');

    return (
        <div className="space-y-4 pb-20 animate-fade-in">
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
        </div>
    );
};

export default LeagueManager;
