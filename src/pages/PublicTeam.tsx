import React, { useState, useEffect } from 'react';
import { storageService } from '../services/storageService';
import { TeamSettings, Player, Game, SponsorDeal } from '../types';
import LazyImage from '@/components/LazyImage';
import { CalendarIcon, MapPinIcon, UsersIcon } from '../components/icons/UiIcons';
import { GlobeIcon, TrophyIcon } from '../components/icons/NavIcons';

const PublicTeam: React.FC = () => {
    const [settings, setSettings] = useState<TeamSettings | null>(null);
    const [players, setPlayers] = useState<Player[]>([]);
    const [games, setGames] = useState<Game[]>([]);
    const [sponsors, setSponsors] = useState<SponsorDeal[]>([]);
    const [activeTab, setActiveTab] = useState<'ROSTER' | 'SCHEDULE'>('ROSTER');

    useEffect(() => {
        setSettings(storageService.getTeamSettings());
        setPlayers(storageService.getPlayers().filter(p => p.status === 'ACTIVE'));
        setGames(storageService.getGames());
        setSponsors(storageService.getSponsors().filter(s => s.status === 'CLOSED_WON'));
    }, []);

    if (!settings) return <div className="min-h-screen bg-[#0B1120] flex items-center justify-center text-white">Carregando...</div>;

    const nextGame = games.find(g => g.status === 'SCHEDULED' && new Date(g.date) > new Date());
    const seasonRecord = {
        wins: games.filter(g => g.result === 'W').length,
        losses: games.filter(g => g.result === 'L').length
    };

    return (
        <div className="min-h-screen bg-[#0B1120] text-white font-sans overflow-x-hidden">
            {/* HERO HEADER */}
            <div className="relative bg-gradient-to-b from-gray-900 to-[#0B1120] pb-12 pt-20 px-6 border-b border-white/10">
                <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
                <div className="max-w-6xl mx-auto relative z-10 flex flex-col md:flex-row items-center gap-8 text-center md:text-left">
                    <div className="w-32 h-32 md:w-48 md:h-48 bg-white/5 rounded-full p-2 border-4 border-white/10 shadow-2xl backdrop-blur-sm">
                        <LazyImage src={settings.logoUrl} className="w-full h-full object-contain" />
                    </div>
                    <div className="flex-1">
                        <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest text-white/80 mb-4 border border-white/10">
                            <GlobeIcon className="w-4 h-4" /> Página Oficial
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-2">{settings.teamName}</h1>
                        <p className="text-xl text-gray-400 max-w-2xl">{settings.address} • Futebol Americano</p>
                        
                        <div className="flex flex-wrap justify-center md:justify-start gap-6 mt-6">
                            <div className="bg-white/5 px-6 py-3 rounded-xl border border-white/10">
                                <p className="text-xs text-gray-500 uppercase font-bold">Temporada 2025</p>
                                <p className="text-2xl font-black text-white">{seasonRecord.wins}-{seasonRecord.losses}</p>
                            </div>
                            {nextGame && (
                                <div className="bg-gradient-to-r from-blue-900/40 to-blue-800/40 px-6 py-3 rounded-xl border border-blue-500/30">
                                    <p className="text-xs text-blue-300 uppercase font-bold">Próximo Jogo</p>
                                    <div className="flex items-center gap-2">
                                        <span className="text-lg font-bold text-white">vs {nextGame.opponent}</span>
                                        <span className="text-xs bg-blue-500 text-white px-2 py-0.5 rounded">{new Date(nextGame.date).toLocaleDateString()}</span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* CONTENT */}
            <div className="max-w-6xl mx-auto px-6 py-12">
                <div className="flex justify-center mb-10">
                    <div className="bg-white/5 p-1 rounded-xl flex">
                        <button 
                            onClick={() => setActiveTab('ROSTER')}
                            className={`px-8 py-3 rounded-lg font-bold transition-all flex items-center gap-2 ${activeTab === 'ROSTER' ? 'bg-white text-black shadow-lg' : 'text-gray-400 hover:text-white'}`}
                        >
                            <UsersIcon className="w-5 h-5" /> Elenco
                        </button>
                        <button 
                            onClick={() => setActiveTab('SCHEDULE')}
                            className={`px-8 py-3 rounded-lg font-bold transition-all flex items-center gap-2 ${activeTab === 'SCHEDULE' ? 'bg-white text-black shadow-lg' : 'text-gray-400 hover:text-white'}`}
                        >
                            <CalendarIcon className="w-5 h-5" /> Calendário
                        </button>
                    </div>
                </div>

                {activeTab === 'ROSTER' && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 animate-fade-in">
                        {players.map(player => (
                            <div key={player.id} className="group bg-white/5 rounded-2xl overflow-hidden border border-white/5 hover:border-white/20 transition-all hover:-translate-y-1">
                                <div className="aspect-square bg-gray-800 relative">
                                    <LazyImage src={player.avatarUrl} className="w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity" />
                                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4">
                                        <p className="text-white font-bold text-lg">{player.name}</p>
                                        <p className="text-gray-400 text-xs font-bold uppercase">{player.position} #{player.jerseyNumber}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === 'SCHEDULE' && (
                    <div className="space-y-4 max-w-3xl mx-auto animate-fade-in">
                        {games.map(game => (
                            <div key={game.id} className="bg-white/5 p-6 rounded-2xl border border-white/5 flex items-center justify-between hover:bg-white/10 transition-colors">
                                <div className="flex items-center gap-6">
                                    <div className="text-center w-16">
                                        <p className="text-sm font-bold text-gray-400 uppercase">{new Date(game.date).toLocaleDateString('pt-BR', { month: 'short' })}</p>
                                        <p className="text-2xl font-black text-white">{new Date(game.date).getDate()}</p>
                                    </div>
                                    <div className="h-10 w-px bg-white/10"></div>
                                    <div>
                                        <p className="text-xl font-bold text-white">vs {game.opponent}</p>
                                        <div className="flex items-center gap-2 text-sm text-gray-400 mt-1">
                                            <MapPinIcon className="w-4 h-4" />
                                            {game.location === 'Home' ? 'Em Casa' : 'Fora'}
                                        </div>
                                    </div>
                                </div>
                                <div>
                                    {game.status === 'FINAL' ? (
                                        <span className={`px-4 py-2 rounded-lg font-black text-lg ${game.result === 'W' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>
                                            {game.score}
                                        </span>
                                    ) : (
                                        <span className="px-4 py-2 rounded-lg bg-white/10 text-white font-bold text-sm">
                                            {new Date(game.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* SPONSORS FOOTER */}
            {sponsors.length > 0 && (
                <div className="border-t border-white/10 bg-black/40 py-12 mt-20">
                    <div className="max-w-6xl mx-auto px-6 text-center">
                        <p className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-8">Patrocinadores Oficiais</p>
                        <div className="flex flex-wrap justify-center gap-12 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                            {sponsors.map(sponsor => (
                                <div key={sponsor.id} className="text-2xl font-black text-white">{sponsor.companyName}</div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PublicTeam;