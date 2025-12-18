import React, { useEffect, useState } from 'react';
import { storageService } from '../services/storageService';
import { TrophyIcon, GlobeIcon } from '../components/icons/NavIcons';
import { UsersIcon, StarIcon, ShieldCheckIcon } from '../components/icons/UiIcons';
import LazyImage from '../components/LazyImage';

const PublicLeague: React.FC = () => {
    const [data, setData] = useState<any>(null);
    const [games, setGames] = useState<any[]>([]);

    useEffect(() => {
        setData(storageService.getPublicLeagueStats());
        setGames(storageService.getGames());
        
        const interval = setInterval(() => {
             setGames(storageService.getGames());
        }, 30000); 
        return () => clearInterval(interval);
    }, []);

    if (!data) return <div className="min-h-screen bg-primary flex items-center justify-center text-white">Carregando Portal...</div>;

    const { leagueTable, name, season, leaders } = data;
    const liveOrRecentGames = games.filter(g => g.status !== 'SCHEDULED').slice(0, 3);

    return (
        <div className="min-h-screen bg-primary text-white font-sans overflow-x-hidden">
            <div className="relative h-[400px] flex items-center justify-center bg-gradient-to-b from-gray-900 to-primary border-b border-highlight/20 overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-30"></div>
                <div className="relative z-10 text-center animate-fade-in">
                    <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-1 rounded-full mb-4 border border-white/10">
                        <GlobeIcon className="w-4 h-4 text-highlight" />
                        <span className="text-xs font-bold uppercase tracking-widest text-highlight">Portal Oficial do Fã</span>
                    </div>
                    <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter mb-2 italic">
                        {name} <span className="text-transparent bg-clip-text bg-gradient-to-r from-highlight to-yellow-400">{season}</span>
                    </h1>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 -mt-20 relative z-20">
                {liveOrRecentGames.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                        {liveOrRecentGames.map(game => (
                            <div key={game.id} className="bg-secondary/90 backdrop-blur rounded-xl border border-white/10 overflow-hidden shadow-lg transform hover:-translate-y-1 transition-all">
                                <div className="bg-black/50 p-3 flex justify-between items-center border-b border-white/5">
                                    <span className="text-xs font-bold text-red-400 uppercase animate-pulse">
                                        {game.status === 'IN_PROGRESS' ? 'AO VIVO' : 'FINAL'}
                                    </span>
                                    <span className="text-xs font-mono text-white">{game.score}</span>
                                </div>
                                <div className="p-4">
                                    <h4 className="font-black text-white uppercase text-sm mb-3">
                                        {game.homeTeamName || 'MANDANTE'} vs {game.opponent}
                                    </h4>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                <div className="bg-secondary/80 backdrop-blur-md rounded-2xl border border-white/10 shadow-2xl overflow-hidden mb-12">
                    <div className="p-6 border-b border-white/10 bg-black/40 flex justify-between items-center">
                        <h3 className="text-2xl font-bold flex items-center gap-3">
                            <TrophyIcon className="w-8 h-8 text-yellow-500" /> Classificação Geral
                        </h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-white/5 text-gray-400 uppercase text-xs font-bold">
                                <tr>
                                    <th className="p-4">Time</th>
                                    <th className="p-4 text-center">V</th>
                                    <th className="p-4 text-center">D</th>
                                    <th className="p-4 text-center">Saldo</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm font-medium">
                                {leagueTable.map((team: any, idx: number) => (
                                    <tr key={team.teamId} className="border-b border-white/5">
                                        <td className="p-4 flex items-center gap-4">
                                            <LazyImage src={team.logoUrl} className="w-10 h-10 rounded-full" />
                                            <span className="text-lg font-bold">{team.teamName}</span>
                                        </td>
                                        <td className="p-4 text-center text-green-400 font-bold">{team.wins}</td>
                                        <td className="p-4 text-center text-red-400">{team.losses}</td>
                                        <td className="p-4 text-center">{team.pointsFor - team.pointsAgainst}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PublicLeague;