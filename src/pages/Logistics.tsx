import React from 'react';
import PageHeader from '../components/PageHeader';
import Card from '../components/Card';
import { storageService } from '../services/storageService';
import { authService } from '../services/authService';
import LazyImage from '../components/LazyImage';
import { 
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    Radar, RadarChart, PolarGrid, PolarAngleAxis
} from 'recharts';
import { StarIcon, TrophyIcon } from '../components/icons/NavIcons';
import { TrendingUpIcon, ActivityIcon, CheckCircleIcon } from '../components/icons/UiIcons';

const MyProfile: React.FC = () => {
    const user = authService.getCurrentUser();
    const playersList = storageService.getPlayers();
    const player = playersList.find(p => p.name === user?.name) || playersList[0];
    const statsHistory = storageService.getAthleteStatsHistory(player?.id || 0);

    const skillData = [
        { subject: 'Explosão', A: 85 },
        { subject: 'Força', A: 92 },
        { subject: 'Agilidade', A: 75 },
        { subject: 'Velocidade', A: 88 },
        { subject: 'Técnica', A: 70 },
        { subject: 'IQ Tático', A: 82 },
    ];

    const evolutionData = statsHistory.map((s: any) => ({
        date: new Date(s.date).toLocaleDateString('pt-BR', {month: 'short'}),
        ovr: 70 + (Math.random() * 20)
    }));

    return (
        <div className="space-y-8 animate-fade-in pb-20">
            <PageHeader title="Meus Stats" subtitle="Performance Lab: Dados Oficiais e Evolução." />

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-4 flex justify-center">
                    <div className="relative w-[320px] h-[450px] rounded-3xl overflow-hidden shadow-[0_0_60px_rgba(5,150,105,0.4)] border-2 border-highlight/30 group perspective-1000">
                        <div className="absolute inset-0 bg-gradient-to-br from-highlight via-[#0f172a] to-black"></div>
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-30"></div>
                        
                        <div className="relative z-10 p-7 flex flex-col items-center h-full">
                            <div className="flex justify-between w-full mb-6">
                                <div className="text-center">
                                    <p className="text-5xl font-black text-white italic leading-none drop-shadow-lg">{player?.rating || 0}</p>
                                    <p className="text-[12px] font-black text-highlight uppercase mt-1 tracking-widest">{player?.position}</p>
                                </div>
                                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center border border-white/20 backdrop-blur-sm">
                                    <TrophyIcon className="w-6 h-6 text-highlight" />
                                </div>
                            </div>

                            <div className="w-56 h-56 relative mb-4">
                                <div className="absolute inset-0 bg-highlight/30 rounded-full blur-[60px] animate-pulse"></div>
                                <LazyImage 
                                    src={player?.avatarUrl} 
                                    className="w-full h-full object-cover object-top relative z-10 drop-shadow-[0_20px_30px_rgba(0,0,0,0.5)]" 
                                    style={{maskImage: 'linear-gradient(to bottom, black 80%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to bottom, black 80%, transparent 100%)'}} 
                                    fallbackText={player?.name}
                                />
                            </div>

                            <div className="w-full text-center bg-black/40 backdrop-blur-md py-3 rounded-2xl border border-white/10 mb-4 shadow-xl">
                                <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter leading-none">{player?.name}</h2>
                            </div>

                            <div className="grid grid-cols-3 gap-x-8 gap-y-3 w-full pt-4 border-t border-white/10">
                                <div className="text-center"><p className="text-[9px] text-text-secondary uppercase font-bold">SPD</p><p className="text-lg font-black text-white">88</p></div>
                                <div className="text-center"><p className="text-[9px] text-text-secondary uppercase font-bold">STR</p><p className="text-lg font-black text-white">92</p></div>
                                <div className="text-center"><p className="text-[9px] text-text-secondary uppercase font-bold">AGI</p><p className="text-lg font-black text-white">75</p></div>
                                <div className="text-center"><p className="text-[9px] text-text-secondary uppercase font-bold">ACC</p><p className="text-lg font-black text-white">82</p></div>
                                <div className="text-center"><p className="text-[9px] text-text-secondary uppercase font-bold">AWR</p><p className="text-lg font-black text-white">70</p></div>
                                <div className="text-center"><p className="text-[9px] text-text-secondary uppercase font-bold">POW</p><p className="text-lg font-black text-white">85</p></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-8 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Card title="Matriz de Atributos">
                            <div className="h-64 w-full flex items-center justify-center">
                                <ResponsiveContainer width="100%" height="100%">
                                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={skillData}>
                                        <PolarGrid stroke="rgba(255,255,255,0.05)" />
                                        <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 'bold' }} />
                                        <Radar name="Skills" dataKey="A" stroke="#059669" fill="#059669" fillOpacity={0.6} />
                                        <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px' }} />
                                    </RadarChart>
                                </ResponsiveContainer>
                            </div>
                        </Card>

                        <Card title="Evolução de Rating">
                            <div className="h-64 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={evolutionData}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                                        <XAxis dataKey="date" stroke="#94a3b8" tick={{ fontSize: 10, fontWeight: 'bold' }} />
                                        <YAxis domain={[60, 100]} stroke="#94a3b8" tick={{ fontSize: 10 }} />
                                        <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '12px' }} />
                                        <Line type="monotone" dataKey="ovr" stroke="#059669" strokeWidth={4} dot={{ fill: '#059669', r: 6 }} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </Card>
                    </div>

                    <div className="bg-secondary/40 p-6 rounded-3xl border border-white/5 shadow-2xl relative overflow-hidden">
                        <h3 className="text-white font-black uppercase italic text-sm mb-6 flex items-center gap-2">
                             <CheckCircleIcon className="w-5 h-5 text-highlight" /> Resultados do Último Combine
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div className="bg-black/40 p-5 rounded-2xl border border-white/5">
                                <p className="text-[9px] text-text-secondary uppercase font-bold mb-1">40 Yard Dash</p>
                                <p className="text-2xl font-black text-white">4.52s</p>
                            </div>
                            <div className="bg-black/40 p-5 rounded-2xl border border-white/5">
                                <p className="text-[9px] text-text-secondary uppercase font-bold mb-1">Bench Press</p>
                                <p className="text-2xl font-black text-white">18 reps</p>
                            </div>
                            <div className="bg-black/40 p-5 rounded-2xl border border-white/5">
                                <p className="text-[9px] text-text-secondary uppercase font-bold mb-1">Vertical Jump</p>
                                <p className="text-2xl font-black text-white">32.5"</p>
                            </div>
                            <div className="bg-black/40 p-5 rounded-2xl border border-white/5">
                                <p className="text-[9px] text-text-secondary uppercase font-bold mb-1">L-Drill</p>
                                <p className="text-2xl font-black text-white">7.15s</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MyProfile;