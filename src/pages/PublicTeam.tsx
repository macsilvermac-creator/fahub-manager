import React, { useState, useEffect } from 'react';
import { storageService } from '../services/storageService';
import { TeamSettings, Player, Game, SponsorDeal } from '../types';
import LazyImage from '../components/LazyImage';
import { CalendarIcon, MapPinIcon, UsersIcon } from '../components/icons/UiIcons';
import { GlobeIcon, TrophyIcon } from '../components/icons/NavIcons';

// --- COUNTDOWN COMPONENT ---
const Countdown: React.FC<{ targetDate: Date }> = ({ targetDate }) => {
    const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

    useEffect(() => {
        const interval = setInterval(() => {
            const now = new Date().getTime();
            const distance = targetDate.getTime() - now;

            if (distance < 0) {
                clearInterval(interval);
                return;
            }

            setTimeLeft({
                days: Math.floor(distance / (1000 * 60 * 60 * 24)),
                hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
                minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
                seconds: Math.floor((distance % (1000 * 60)) / 1000)
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [targetDate]);

    return (
        <div className="grid grid-cols-4 gap-2 md:gap-4 text-center">
            <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-lg p-2 md:p-3">
                <span className="block text-2xl md:text-4xl font-black text-white">{String(timeLeft.days).padStart(2, '0')}</span>
                <span className="text-[8px] md:text-xs text-text-secondary uppercase tracking-widest">Dias</span>
            </div>
            <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-lg p-2 md:p-3">
                <span className="block text-2xl md:text-4xl font-black text-white">{String(timeLeft.hours).padStart(2, '0')}</span>
                <span className="text-[8px] md:text-xs text-text-secondary uppercase tracking-widest">Horas</span>
            </div>
            <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-lg p-2 md:p-3">
                <span className="block text-2xl md:text-4xl font-black text-white">{String(timeLeft.minutes).padStart(2, '0')}</span>
                <span className="text-[8px] md:text-xs text-text-secondary uppercase tracking-widest">Min</span>
            </div>
            <div className="bg-black/40 backdrop-blur-md border border-white/10 rounded-lg p-2 md:p-3">
                <span className="block text-2xl md:text-4xl font-black text-highlight animate-pulse">{String(timeLeft.seconds).padStart(2, '0')}</span>
                <span className="text-[8px] md:text-xs text-text-secondary uppercase tracking-widest">Seg</span>
            </div>
        </div>
    );
};

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

    const nextGame = games
        .filter(g => g.status === 'SCHEDULED' && new Date(g.date) > new Date())
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];

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
                    <div className="flex-1 w-full">
                        <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest text-white/80 mb-4 border border-white/10">
                            <GlobeIcon className="w-4 h-4" /> Página Oficial
                        </div>
                        <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-2">{settings.teamName}</h1>
                        <p className="text-xl text-gray-400 max-w-2xl mx-auto md:mx-0">{settings.address} • Futebol Americano</p>
                        
                        {/* NEXT GAME CARD & COUNTDOWN */}
                        {nextGame ? (
                             <div className="mt-8 bg-gradient-to-r from-blue-900/60 to-blue-800/40 p-6 rounded-2xl border border-blue-500/30 w-full max-w-2xl mx-auto md:mx-0">
                                <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                                    <div className="text-center md:text-left">
                                        <p className="text-xs text-blue-300 font-bold uppercase tracking-widest mb-1">Próximo Confronto</p>
                                        <h3 className="text-2xl md:text-3xl font-black text-white">VS {nextGame.opponent.toUpperCase()}</h3>
                                        <div className="flex items-center justify-center md:justify-start gap-2 mt-2 text-sm text-gray-300">
                                            <CalendarIcon className="w-4 h-4" />
                                            {new Date(nextGame.date).toLocaleDateString()} • {new Date(nextGame.date).toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}
                                        </div>
                                    </div>
                                    <div className="w-full md:w-auto">
                                        <Countdown targetDate={new Date(nextGame.date)} />
                                    </div>
                                </div>
                             </div>
                        ) : (
                             <div className="mt-6 inline-block bg-white/5 px-6 py-3 rounded-xl border border-white/10">
                                <p className="text-xs text-gray-500 uppercase font-bold">Temporada 2025</p>
                                <p className="text-2xl font-black text-white">{seasonRecord.wins}-{seasonRecord.losses}</p>
                            </div>
                        )}
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