
import React, { useState, useEffect } from 'react';
import PageHeader from '../components/PageHeader';
import Card from '../components/Card';
import { storageService } from '../services/storageService';
import { authService } from '../services/authService';
import LazyImage from '../components/LazyImage';
import { 
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis
} from 'recharts';
// Fixed: Imported TrophyIcon from NavIcons where it exists
import { StarIcon } from '../components/icons/UiIcons';
import { TrophyIcon } from '../components/icons/NavIcons';

const MyProfile: React.FC = () => {
    const user = authService.getCurrentUser();
    const player = storageService.getPlayers().find(p => p.name === user?.name) || storageService.getPlayers()[0];

    // MOCK DE DADOS DE COMBINE
    const evolutionData = [
        { date: 'Jan', ovr: 72, speed: 4.8 },
        { date: 'Mar', ovr: 75, speed: 4.7 },
        { date: 'Mai', ovr: 78, speed: 4.6 },
        { date: 'Jul', ovr: 82, speed: 4.5 },
    ];

    const skillData = [
        { subject: 'Explosão', A: 85, fullMark: 100 },
        { subject: 'Força', A: 90, fullMark: 100 },
        { subject: 'Agilidade', A: 70, fullMark: 100 },
        { subject: 'Velo', A: 80, fullMark: 100 },
        { subject: 'Técnica', A: 75, fullMark: 100 },
    ];

    return (
        <div className="space-y-8 animate-fade-in pb-20">
            <PageHeader title="Performance Lab" subtitle="Análise biomecânica e evolução de atributos." />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                
                {/* FIFA STYLE CARD (UAU EFFECT) */}
                <div className="lg:col-span-4 flex justify-center">
                    <div className="relative w-[300px] h-[420px] rounded-2xl overflow-hidden shadow-[0_0_50px_rgba(5,150,105,0.3)] border-2 border-highlight/50 group perspective-1000">
                        <div className="absolute inset-0 bg-gradient-to-br from-highlight via-[#0f172a] to-black"></div>
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
                        
                        <div className="relative z-10 p-6 flex flex-col items-center h-full">
                            <div className="flex justify-between w-full mb-4">
                                <div className="text-center">
                                    <p className="text-4xl font-black text-white italic leading-none">{player?.rating}</p>
                                    <p className="text-[10px] font-black text-highlight uppercase mt-1">{player?.position}</p>
                                </div>
                                <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center border border-white/20">
                                    <img src="https://ui-avatars.com/api/?name=Stars&background=059669&color=fff" className="w-6 h-6 rounded-full" />
                                </div>
                            </div>

                            <div className="w-48 h-48 relative mb-4">
                                <div className="absolute inset-0 bg-highlight/20 rounded-full blur-3xl"></div>
                                <LazyImage src={player?.avatarUrl} className="w-full h-full object-cover object-top mask-image-gradient" style={{maskImage: 'linear-gradient(to bottom, black 80%, transparent 100%)'}} />
                            </div>

                            <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter mb-4">{player?.name}</h2>

                            <div className="grid grid-cols-3 gap-x-6 gap-y-2 w-full border-t border-white/10 pt-4">
                                <div className="text-center"><p className="text-[8px] text-text-secondary uppercase">SPD</p><p className="text-sm font-black text-white">88</p></div>
                                <div className="text-center"><p className="text-[8px] text-text-secondary uppercase">STR</p><p className="text-sm font-black text-white">92</p></div>
                                <div className="text-center"><p className="text-[8px] text-text-secondary uppercase">AGI</p><p className="text-sm font-black text-white">75</p></div>
                                <div className="text-center"><p className="text-[8px] text-text-secondary uppercase">ACC</p><p className="text-sm font-black text-white">82</p></div>
                                <div className="text-center"><p className="text-[8px] text-text-secondary uppercase">AWR</p><p className="text-sm font-black text-white">70</p></div>
                                <div className="text-center"><p className="text-[8px] text-text-secondary uppercase">POW</p><p className="text-sm font-black text-white">85</p></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ANALYTICS AREA */}
                <div className="lg:col-span-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card title="Skill Matrix (Radar)">
                            <div className="h-64 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={skillData}>
                                        <PolarGrid stroke="rgba(255,255,255,0.1)" />
                                        <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 10 }} />
                                        <Radar name="Skills" dataKey="A" stroke="#059669" fill="#059669" fillOpacity={0.5} />
                                    </RadarChart>
                                </ResponsiveContainer>
                            </div>
                        </Card>

                        <Card title="Evolução de Rating (Combine)">
                            <div className="h-64 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={evolutionData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                                        <XAxis dataKey="date" stroke="#94a3b8" tick={{ fontSize: 10 }} />
                                        <YAxis stroke="#94a3b8" tick={{ fontSize: 10 }} />
                                        <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px' }} />
                                        <Line type="monotone" dataKey="ovr" stroke="#059669" strokeWidth={3} dot={{ fill: '#059669', r: 5 }} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                            <p className="text-[10px] text-center text-text-secondary mt-2">Próximo Combine: 15 de Outubro</p>
                        </Card>
                    </div>

                    <div className="bg-secondary/40 p-6 rounded-3xl border border-white/5">
                        <h3 className="text-white font-black uppercase italic text-sm mb-4">Últimos Testes Oficiais</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-black/20 p-4 rounded-2xl border border-white/5">
                                <p className="text-[8px] text-text-secondary uppercase font-bold">40 Yard Dash</p>
                                <p className="text-xl font-black text-white">4.52s</p>
                                <p className="text-[8px] text-green-400">▼ -0.2s melhoria</p>
                            </div>
                            <div className="bg-black/20 p-4 rounded-2xl border border-white/5">
                                <p className="text-[8px] text-text-secondary uppercase font-bold">Bench Press (225)</p>
                                <p className="text-xl font-black text-white">18 reps</p>
                                <p className="text-[8px] text-green-400">▲ +2 reps melhoria</p>
                            </div>
                            <div className="bg-black/20 p-4 rounded-2xl border border-white/5">
                                <p className="text-[8px] text-text-secondary uppercase font-bold">Vertical Jump</p>
                                <p className="text-xl font-black text-white">32.5"</p>
                                <p className="text-[8px] text-text-secondary">Sem alteração</p>
                            </div>
                            <div className="bg-black/20 p-4 rounded-2xl border border-white/5">
                                <p className="text-[8px] text-text-secondary uppercase font-bold">Broad Jump</p>
                                <p className="text-xl font-black text-white">10' 4"</p>
                                <p className="text-[8px] text-green-400">▲ +3" melhoria</p>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default MyProfile;