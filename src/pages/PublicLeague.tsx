
import React, { useEffect, useState } from 'react';
import { storageService } from '../services/storageService';
import { TrophyIcon, GlobeIcon } from '../components/icons/NavIcons';
import { UsersIcon, StarIcon, ShieldCheckIcon } from '../components/icons/UiIcons';

const PublicLeague: React.FC = () => {
    const [data, setData] = useState<any>(null);

    useEffect(() => {
        // Fetch aggregated data
        setData(storageService.getPublicLeagueStats());
    }, []);

    if (!data) return <div className="min-h-screen bg-primary flex items-center justify-center text-white">Carregando Portal...</div>;

    const { leagueTable, name, season, leaders } = data;

    return (
        <div className="min-h-screen bg-primary text-white font-sans overflow-x-hidden">
            {/* HERO SECTION */}
            <div className="relative h-[400px] flex items-center justify-center bg-gradient-to-b from-gray-900 to-primary border-b border-highlight/20 overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-30"></div>
                {/* Decorative Glows */}
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-highlight/20 rounded-full blur-[100px]"></div>
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-yellow-500/10 rounded-full blur-[100px]"></div>

                <div className="relative z-10 text-center animate-fade-in">
                    <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-1 rounded-full mb-4 border border-white/10">
                        <GlobeIcon className="w-4 h-4 text-highlight" />
                        <span className="text-xs font-bold uppercase tracking-widest text-highlight">Portal Oficial do Fã</span>
                    </div>
                    <h1 className="text-6xl md:text-8xl font-black uppercase tracking-tighter mb-2 italic">
                        {name} <span className="text-transparent bg-clip-text bg-gradient-to-r from-highlight to-yellow-400">{season}</span>
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        A casa do Futebol Americano no Estado. Estatísticas, Classificação e Destaques em Tempo Real.
                    </p>
                </div>
            </div>

            {/* MAIN CONTENT */}
            <div className="max-w-7xl mx-auto px-6 -mt-20 relative z-20">
                
                {/* STANDINGS CARD */}
                <div className="bg-secondary/80 backdrop-blur-md rounded-2xl border border-white/10 shadow-2xl overflow-hidden mb-12">
                    <div className="p-6 border-b border-white/10 bg-black/40 flex justify-between items-center">
                        <h3 className="text-2xl font-bold flex items-center gap-3">
                            <TrophyIcon className="w-8 h-8 text-yellow-500" /> Classificação Geral
                        </h3>
                        <span className="text-xs font-bold bg-green-600 text-white px-3 py-1 rounded animate-pulse">● Atualizado Agora</span>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-white/5 text-gray-400 uppercase text-xs font-bold">
                                <tr>
                                    <th className="p-4 w-16">Pos</th>
                                    <th className="p-4">Time</th>
                                    <th className="p-4 text-center">V</th>
                                    <th className="p-4 text-center">D</th>
                                    <th className="p-4 text-center">E</th>
                                    <th className="p-4 text-center">PF</th>
                                    <th className="p-4 text-center">PC</th>
                                    <th className="p-4 text-center">Saldo</th>
                                </tr>
                            </thead>
                            <tbody className="text-sm font-medium">
                                {leagueTable.map((team: any, idx: number) => (
                                    <tr key={team.teamId} className={`border-b border-white/5 hover:bg-white/5 transition-colors ${idx < 4 ? 'bg-highlight/5' : ''}`}>
                                        <td className="p-4 font-black text-lg text-gray-500">{idx + 1}</td>
                                        <td className="p-4 flex items-center gap-4">
                                            <img src={team.logoUrl} className="w-10 h-10 rounded-full shadow-md" />
                                            <span className="text-lg font-bold">{team.teamName}</span>
                                            {idx < 4 && <span className="text-[10px] bg-highlight text-white px-2 py-0.5 rounded font-bold uppercase ml-2">Playoffs</span>}
                                        </td>
                                        <td className="p-4 text-center font-bold text-green-400 text-lg">{team.wins}</td>
                                        <td className="p-4 text-center text-red-400">{team.losses}</td>
                                        <td className="p-4 text-center text-gray-400">{team.draws}</td>
                                        <td className="p-4 text-center">{team.pointsFor}</td>
                                        <td className="p-4 text-center">{team.pointsAgainst}</td>
                                        <td className="p-4 text-center font-bold">{team.pointsFor - team.pointsAgainst}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* LEADERS GRID (The "Winners") */}
                <h3 className="text-3xl font-black text-white mb-8 flex items-center gap-3">
                    <StarIcon className="w-8 h-8 text-yellow-400" /> Líderes da Temporada
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
                    {/* PASSING */}
                    <div className="bg-secondary rounded-xl border border-white/10 overflow-hidden group hover:border-blue-500 transition-all">
                        <div className="p-4 bg-gradient-to-r from-blue-900 to-secondary border-b border-white/10">
                            <h4 className="font-bold text-blue-400 uppercase tracking-wider text-sm">Passando (Jardas)</h4>
                        </div>
                        <div className="p-4 space-y-4">
                            {leaders.passing.map((p: any, idx: number) => (
                                <div key={p.id} className="flex items-center gap-4">
                                    <span className={`w-6 text-center font-bold ${idx === 0 ? 'text-yellow-400 text-xl' : 'text-gray-500'}`}>{idx + 1}</span>
                                    <img src={p.avatarUrl} className="w-12 h-12 rounded-full border-2 border-secondary" />
                                    <div className="flex-1">
                                        <p className="font-bold text-white leading-tight">{p.name}</p>
                                        <p className="text-xs text-gray-400">QB • {p.jerseyNumber}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xl font-black text-white">{p.statValue}</p>
                                        <p className="text-[10px] text-gray-500 uppercase">Yds</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* RUSHING */}
                    <div className="bg-secondary rounded-xl border border-white/10 overflow-hidden group hover:border-green-500 transition-all">
                        <div className="p-4 bg-gradient-to-r from-green-900 to-secondary border-b border-white/10">
                            <h4 className="font-bold text-green-400 uppercase tracking-wider text-sm">Correndo (Jardas)</h4>
                        </div>
                        <div className="p-4 space-y-4">
                            {leaders.rushing.map((p: any, idx: number) => (
                                <div key={p.id} className="flex items-center gap-4">
                                    <span className={`w-6 text-center font-bold ${idx === 0 ? 'text-yellow-400 text-xl' : 'text-gray-500'}`}>{idx + 1}</span>
                                    <img src={p.avatarUrl} className="w-12 h-12 rounded-full border-2 border-secondary" />
                                    <div className="flex-1">
                                        <p className="font-bold text-white leading-tight">{p.name}</p>
                                        <p className="text-xs text-gray-400">RB • {p.jerseyNumber}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xl font-black text-white">{p.statValue}</p>
                                        <p className="text-[10px] text-gray-500 uppercase">Yds</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* DEFENSE */}
                    <div className="bg-secondary rounded-xl border border-white/10 overflow-hidden group hover:border-red-500 transition-all">
                        <div className="p-4 bg-gradient-to-r from-red-900 to-secondary border-b border-white/10">
                            <h4 className="font-bold text-red-400 uppercase tracking-wider text-sm">Defesa (Tackles)</h4>
                        </div>
                        <div className="p-4 space-y-4">
                            {leaders.defense.map((p: any, idx: number) => (
                                <div key={p.id} className="flex items-center gap-4">
                                    <span className={`w-6 text-center font-bold ${idx === 0 ? 'text-yellow-400 text-xl' : 'text-gray-500'}`}>{idx + 1}</span>
                                    <img src={p.avatarUrl} className="w-12 h-12 rounded-full border-2 border-secondary" />
                                    <div className="flex-1">
                                        <p className="font-bold text-white leading-tight">{p.name}</p>
                                        <p className="text-xs text-gray-400">{p.position} • {p.jerseyNumber}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xl font-black text-white">{p.statValue}</p>
                                        <p className="text-[10px] text-gray-500 uppercase">Tkls</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="text-center pb-12 text-gray-500 text-sm">
                    <p>Desenvolvido por FAHUB MANAGER © 2025. Todos os direitos reservados.</p>
                    <p className="mt-2 text-xs">Dados atualizados em tempo real via Súmula Digital.</p>
                </div>
            </div>
        </div>
    );
};

export default PublicLeague;
