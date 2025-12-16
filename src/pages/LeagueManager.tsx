
import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import { League, Game } from '../types';
import { storageService } from '../services/storageService';
import { TrophyIcon, FlagIcon, GlobeIcon } from '../components/icons/NavIcons';
import { ShieldCheckIcon, GavelIcon, UsersIcon, BuildingIcon, AlertTriangleIcon, ClockIcon, MapIcon, SwapIcon, SparklesIcon } from '../components/icons/UiIcons';

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
        const interval = setInterval(loadData, 60000); // Polling every minute
        return () => clearInterval(interval);
    }, []);

    if (!league) return <div className="flex items-center justify-center h-full text-white"><SparklesIcon className="w-6 h-6 animate-spin mr-2"/> Carregando Federação...</div>;

    // Sort teams for standings
    const sortedTeams = league.teams ? [...league.teams].sort((a, b) => {
        if (b.wins !== a.wins) return b.wins - a.wins;
        return (b.pointsFor - b.pointsAgainst) - (a.pointsFor - a.pointsAgainst);
    }) : [];

    const liveGames = games.filter(g => g.status === 'IN_PROGRESS' || g.status === 'HALFTIME');

    // Mocks for sections not yet fully dynamic
    const TRANSFER_WINDOW = { status: 'OPEN', closesIn: '15 dias' };
    const RECENT_TRANSFERS = [
        { id: 1, player: 'João "Flash"', from: 'Miners', to: 'Stars', status: 'APPROVED' },
        { id: 2, player: 'Pedro "Tank"', from: 'FA', to: 'Bulls', status: 'PENDING' }
    ];
    const GOVERNANCE_TEAMS = league.teams?.map(t => ({
        name: t.teamName,
        status: 'REGULAR',
        lastFee: 'Pago'
    })) || [];

    return (
        <div className="space-y-6 pb-20 animate-fade-in">
             {/* Header */}
             <div className="bg-gradient-to-r from-slate-900 to-slate-800 p-6 rounded-2xl border border-white/10 flex flex-col md:flex-row justify-between items-center shadow-2xl gap-4">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-purple-600 rounded-xl shadow-lg shadow-purple-900/50">
                        <GlobeIcon className="text-white w-8 h-8" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-white uppercase tracking-tight">{league.name}</h2>
                        <p className="text-purple-300 text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                            Temporada {league.season}
                        </p>
                    </div>
                </div>
                <div className="flex gap-4 text-center">
                    <div>
                        <p className="text-[10px] text-text-secondary uppercase font-bold">Times</p>
                        <p className="text-2xl font-black text-white">{league.teams?.length || 0}</p>
                    </div>
                    <div className="w-px bg-white/10"></div>
                    <div>
                        <p className="text-[10px] text-text-secondary uppercase font-bold">Jogos Totais</p>
                        <p className="text-2xl font-black text-white">{games.length}</p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <div className="flex bg-black/20 p-1 rounded-xl border border-white/10 gap-1 overflow-x-auto no-scrollbar">
                {[
                    { id: 'OVERVIEW', label: 'Visão Geral', icon: MapIcon },
                    { id: 'WAR_ROOM', label: 'War Room (Live)', icon: AlertTriangleIcon },
                    { id: 'COMPETITION', label: 'Tabela', icon: TrophyIcon },
                    { id: 'GOVERNANCE', label: 'Secretaria', icon: BuildingIcon },
                    { id: 'BID', label: 'BID/TJD', icon: GavelIcon }
                ].map(tab => (
                    <button 
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)} 
                        className={`flex-1 px-4 py-3 text-xs font-bold rounded-lg flex items-center justify-center gap-2 transition-all whitespace-nowrap ${activeTab === tab.id ? 'bg-purple-600 text-white shadow-lg' : 'text-text-secondary hover:text-white hover:bg-white/5'}`}
                    >
                        <tab.icon className="w-4 h-4" /> {tab.label}
                    </button>
                ))}
            </div>

            {/* === TAB: OVERVIEW === */}
            {activeTab === 'OVERVIEW' && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                        <div className="flex items-center gap-4">
                            <UsersIcon className="w-8 h-8 text-blue-400" />
                            <div>
                                <p className="text-xs text-text-secondary font-bold uppercase">Atletas Federados</p>
                                <p className="text-2xl font-bold text-white">1,245</p>
                            </div>
                        </div>
                    </Card>
                    <Card>
                        <div className="flex items-center gap-4">
                            <FlagIcon className="w-8 h-8 text-green-400" />
                            <div>
                                <p className="text-xs text-text-secondary font-bold uppercase">Arbitragem</p>
                                <p className="text-2xl font-bold text-white">42 Oficiais</p>
                            </div>
                        </div>
                    </Card>
                     <Card>
                        <div className="flex items-center gap-4">
                            <ShieldCheckIcon className="w-8 h-8 text-yellow-400" />
                            <div>
                                <p className="text-xs text-text-secondary font-bold uppercase">Segurança</p>
                                <p className="text-2xl font-bold text-white">100%</p>
                            </div>
                        </div>
                    </Card>
                </div>
            )}

            {/* === TAB: WAR ROOM === */}
            {activeTab === 'WAR_ROOM' && (
                <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                            <ClockIcon className="w-5 h-5 text-red-500" /> Jogos em Andamento
                        </h3>
                        <span className="text-xs font-bold bg-red-500/20 text-red-400 px-2 py-1 rounded animate-pulse">Ao Vivo</span>
                    </div>
                    
                    {liveGames.length === 0 && (
                        <div className="col-span-full py-12 text-center border-2 border-dashed border-white/10 rounded-xl bg-secondary/20">
                            <p className="text-text-secondary">Nenhum jogo ativo no momento.</p>
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {liveGames.map(game => {
                            const hasAlert = !game.officialReport?.infrastructure?.ambulancePresent;
                            return (
                                <div key={game.id} className={`bg-secondary rounded-xl overflow-hidden border-2 ${hasAlert ? 'border-red-500 animate-pulse-slow' : 'border-green-500/50'}`}>
                                    <div className="bg-black/40 p-3 flex justify-between items-center border-b border-white/5">
                                        <span className="text-xs font-mono text-white bg-white/10 px-2 py-0.5 rounded">Q{game.currentQuarter || 1} • {game.clock || '00:00'}</span>
                                        {hasAlert && <span className="text-[10px] font-bold bg-red-600 text-white px-2 py-0.5 rounded flex items-center gap-1"><AlertTriangleIcon className="w-3 h-3"/> SEM AMBULÂNCIA</span>}
                                    </div>
                                    <div className="p-5 flex justify-between items-center">
                                        <div className="text-center">
                                            <h4 className="text-xl font-black text-white">{game.homeTeamName?.substring(0,3).toUpperCase() || 'HOM'}</h4>
                                            <p className="text-3xl font-mono text-white mt-1">{game.score?.split('-')[0] || 0}</p>
                                        </div>
                                        <div className="text-xs text-text-secondary font-bold uppercase tracking-widest">VS</div>
                                        <div className="text-center">
                                            <h4 className="text-xl font-black text-white">{game.opponent.substring(0,3).toUpperCase()}</h4>
                                            <p className="text-3xl font-mono text-white mt-1">{game.score?.split('-')[1] || 0}</p>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* === TAB: COMPETITION === */}
            {activeTab === 'COMPETITION' && (
                <Card title="Classificação Oficial">
                    <div className="overflow-x-auto">
                        <table className="w-full text-xs text-left text-text-secondary">
                            <thead className="uppercase bg-black/20 font-bold text-text-secondary">
                                <tr>
                                    <th className="p-3">Pos</th>
                                    <th className="p-3">Time</th>
                                    <th className="p-3 text-center">J</th>
                                    <th className="p-3 text-center">V-D</th>
                                    <th className="p-3 text-center">PF</th>
                                    <th className="p-3 text-center">PC</th>
                                    <th className="p-3 text-center">Saldo</th>
                                    <th className="p-3 text-center">%</th>
                                </tr>
                            </thead>
                            <tbody>
                                {sortedTeams.map((team, index) => (
                                    <tr key={team.teamId} className={`border-b border-white/5 hover:bg-white/5 transition-colors ${index < 4 ? 'bg-green-900/10' : ''}`}>
                                        <td className="p-3 font-bold text-white">{index + 1}</td>
                                        <td className="p-3 font-bold text-white flex items-center gap-2">
                                            {team.teamName}
                                            {index < 4 && <span className="text-[9px] bg-green-500 text-black px-1 rounded font-bold">PO</span>}
                                        </td>
                                        <td className="p-3 text-center">{team.wins + team.losses + team.draws}</td>
                                        <td className="p-3 text-center font-mono text-white">{team.wins}-{team.losses}</td>
                                        <td className="p-3 text-center">{team.pointsFor}</td>
                                        <td className="p-3 text-center">{team.pointsAgainst}</td>
                                        <td className={`p-3 text-center font-bold ${team.pointsFor - team.pointsAgainst > 0 ? 'text-green-400' : 'text-red-400'}`}>{team.pointsFor - team.pointsAgainst}</td>
                                        <td className="p-3 text-center font-bold text-white">{((team.wins / (team.wins+team.losses || 1))*100).toFixed(0)}%</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            )}

            {/* === TAB: GOVERNANCE === */}
            {activeTab === 'GOVERNANCE' && (
                <div className="space-y-3">
                    {GOVERNANCE_TEAMS.map((team, idx) => (
                        <div key={idx} className="bg-secondary p-3 rounded-lg border border-white/5 flex justify-between items-center">
                            <span className="text-white font-bold text-sm">{team.name}</span>
                            <div className="flex gap-2">
                                <span className="text-[10px] bg-white/5 px-2 py-1 rounded text-text-secondary">Taxa: {team.lastFee}</span>
                                <span className={`text-[10px] font-bold px-2 py-1 rounded ${team.status === 'REGULAR' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                    {team.status}
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            )}

             {/* === TAB: BID === */}
             {activeTab === 'BID' && (
                 <Card title="Boletim Informativo Diário (BID)">
                     <div className="mb-4 flex items-center justify-between bg-blue-900/20 p-3 rounded border border-blue-500/30">
                        <span className="text-xs font-bold text-blue-300 uppercase">Janela de Transferências</span>
                        <span className="text-white font-bold">{TRANSFER_WINDOW.status} • Fecha em {TRANSFER_WINDOW.closesIn}</span>
                     </div>
                     <div className="space-y-2">
                         {RECENT_TRANSFERS.map(t => (
                             <div key={t.id} className="text-xs p-3 bg-black/20 rounded flex justify-between items-center border-l-2 border-highlight">
                                 <div>
                                     <span className="text-white font-bold block">{t.player}</span>
                                     <span className="text-text-secondary">{t.from} ➝ {t.to}</span>
                                 </div>
                                 <span className={`px-2 py-1 rounded font-bold ${t.status === 'APPROVED' ? 'text-green-400 bg-green-900/20' : 'text-yellow-400 bg-yellow-900/20'}`}>{t.status}</span>
                             </div>
                         ))}
                     </div>
                 </Card>
             )}
        </div>
    );
};

export default LeagueManager;