
import React, { useState, useEffect } from 'react';
import { storageService } from '../services/storageService';
import { TeamSettings, Player, Game } from '../types';
import LazyImage from '../components/LazyImage';
import { CalendarIcon, FireIcon, CheckCircleIcon } from '../components/icons/UiIcons';
import { GlobeIcon, TrophyIcon, ShopIcon } from '../components/icons/NavIcons';

const PublicTeam: React.FC = () => {
    const [settings, setSettings] = useState<TeamSettings | null>(null);
    const [players, setPlayers] = useState<Player[]>([]);
    const [games, setGames] = useState<Game[]>([]);
    const [fanXP, setFanXP] = useState(0);

    useEffect(() => {
        setSettings(storageService.getTeamSettings());
        setPlayers(storageService.getPlayers().filter(p => p.status === 'ACTIVE').slice(0, 8));
        setGames(storageService.getGames());
    }, []);

    if (!settings) return <div className="text-white text-center py-20">Carregando Estádio Digital...</div>;

    const activeGame = games.find(g => g.status === 'IN_PROGRESS');

    return (
        <div className="min-h-screen bg-[#0B1120] text-white font-sans overflow-x-hidden animate-fade-in">
            {/* Header Hero */}
            <div className="relative bg-gradient-to-b from-gray-900 to-[#0B1120] pb-24 pt-16 px-6 border-b border-white/10">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
                <div className="max-w-6xl mx-auto flex flex-col items-center text-center relative z-10">
                    <div className="w-32 h-32 md:w-40 md:h-40 bg-white/5 rounded-full p-2 border-4 border-white/10 shadow-2xl mb-8 backdrop-blur-sm">
                        <LazyImage src={settings.logoUrl} className="w-full h-full object-contain" />
                    </div>
                    <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-4 italic">{settings.teamName}</h1>
                    <p className="text-gray-400 font-bold uppercase tracking-[0.3em] text-sm">{settings.address}</p>
                    
                    <div className="mt-10 flex gap-4">
                        <div className="bg-white/5 px-8 py-3 rounded-2xl border border-white/10 flex items-center gap-3 shadow-xl">
                             <FireIcon className="text-orange-500 w-6 h-6 animate-bounce" />
                             <div>
                                 <span className="text-[10px] text-gray-500 font-black uppercase block leading-none">Seu Nível de Fã</span>
                                 <span className="text-xl font-black text-white">FAN XP: {fanXP}</span>
                             </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-6xl mx-auto px-6 -mt-16 grid grid-cols-1 lg:grid-cols-3 gap-8 pb-20 relative z-20">
                {/* Coluna Principal: Live e Roster */}
                <div className="lg:col-span-2 space-y-8">
                    {activeGame ? (
                        <div className="bg-red-600 rounded-[2rem] p-10 shadow-2xl relative overflow-hidden group">
                            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:scale-110 transition-transform">
                                <TrophyIcon className="w-32 h-32 text-white" />
                            </div>
                            <div className="relative z-10">
                                <div className="flex justify-between items-center mb-8">
                                    <span className="text-xs font-black bg-white text-red-600 px-4 py-1.5 rounded-full shadow-lg animate-pulse">AO VIVO AGORA</span>
                                    <span className="font-mono text-3xl font-black">{activeGame.clock}</span>
                                </div>
                                <div className="flex justify-between items-center text-center">
                                    <div className="flex-1">
                                        <h4 className="text-2xl font-black opacity-60 uppercase">HOME</h4>
                                        <p className="text-8xl font-black mt-2 drop-shadow-2xl">{activeGame.score?.split('-')[0]}</p>
                                    </div>
                                    <div className="text-3xl font-black px-6 opacity-30 italic">VS</div>
                                    <div className="flex-1">
                                        <h4 className="text-2xl font-black opacity-60 uppercase">{activeGame.opponent.substring(0,3)}</h4>
                                        <p className="text-8xl font-black mt-2 drop-shadow-2xl">{activeGame.score?.split('-')[1]}</p>
                                    </div>
                                </div>
                                <button onClick={() => { setFanXP(prev => prev + 50); }} className="w-full mt-10 bg-white text-red-600 font-black py-5 rounded-2xl uppercase shadow-2xl hover:scale-[1.02] active:scale-95 transition-all text-xl tracking-widest">Gritar TOUCHDOWN! (+50 XP)</button>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-secondary/80 backdrop-blur rounded-[2rem] p-12 border border-white/10 text-center opacity-60">
                            <CalendarIcon className="w-16 h-16 mx-auto mb-6 opacity-20 text-highlight" />
                            <p className="font-black text-2xl uppercase italic tracking-tighter">Nenhum jogo ao vivo no momento</p>
                            <p className="text-text-secondary mt-2">Acompanhe as redes sociais para o próximo Kickoff.</p>
                        </div>
                    )}

                    <div className="space-y-6">
                        <h3 className="text-2xl font-black uppercase italic tracking-widest flex items-center gap-3">
                             <CheckCircleIcon className="text-highlight w-6 h-6" /> Lineup de Elite
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {players.map(p => (
                                <div key={p.id} className="bg-secondary/40 rounded-3xl border border-white/5 p-6 text-center hover:border-highlight transition-all group">
                                    <LazyImage src={p.avatarUrl} className="w-20 h-20 rounded-full mx-auto mb-4 border-2 border-white/10 grayscale group-hover:grayscale-0 transition-all" />
                                    <p className="font-black text-sm truncate uppercase italic tracking-tighter">{p.name}</p>
                                    <p className="text-[10px] text-highlight font-black uppercase mt-1">#{p.jerseyNumber} • {p.position}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Coluna Lateral: Loja e Patrocinadores */}
                <div className="space-y-6">
                    <div className="bg-gradient-to-br from-secondary to-black rounded-[2rem] border border-white/10 p-8 shadow-2xl">
                         <div className="flex items-center gap-3 mb-8">
                             <div className="p-3 bg-highlight/20 rounded-2xl"><ShopIcon className="w-6 h-6 text-highlight" /></div>
                             <h3 className="text-xl font-black uppercase italic">Oficial Store</h3>
                         </div>
                         <div className="space-y-4">
                             <div className="bg-black/40 p-4 rounded-3xl border border-white/5 group cursor-pointer hover:border-highlight transition-all">
                                 <div className="aspect-square bg-gray-800 rounded-2xl mb-4 overflow-hidden">
                                     <div className="w-full h-full bg-gradient-to-tr from-highlight/10 to-transparent"></div>
                                 </div>
                                 <p className="font-black text-white uppercase italic tracking-tighter">Jersey Oficial 2025</p>
                                 <div className="flex justify-between items-center mt-2">
                                     <span className="text-highlight font-black text-xl">R$ 219,90</span>
                                     <button className="bg-white text-black p-2 rounded-xl"><ShopIcon className="w-4 h-4"/></button>
                                 </div>
                             </div>
                             <button className="w-full bg-white/5 hover:bg-white/10 border border-white/10 py-4 rounded-2xl font-black uppercase text-[10px] tracking-widest transition-all">Ver Coleção Completa</button>
                         </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PublicTeam;