
import React, { useState } from 'react';
import PageHeader from '../components/PageHeader';
import Card from '../components/Card';
import { storageService } from '../services/storageService';
import { authService } from '../services/authService';
import LazyImage from '../components/LazyImage';
import { 
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
    Radar, RadarChart, PolarGrid, PolarAngleAxis
} from 'recharts';
import { StarIcon, TrophyIcon, BookIcon } from '../components/icons/NavIcons';
import { TrendingUpIcon, ActivityIcon, CheckCircleIcon, ClipboardIcon, ShieldCheckIcon, WalletIcon } from '../components/icons/UiIcons';
import { useToast } from '../contexts/ToastContext';

const MyProfile: React.FC = () => {
    const toast = useToast();
    const [activeTab, setActiveTab] = useState<'LEGACY' | 'DOSSIER'>('LEGACY');
    const user = authService.getCurrentUser();
    const playersList = storageService.getPlayers();
    const player = playersList.find(p => p.name === user?.name) || playersList[0];
    
    // Mock data para evolução
    const skillData = [
        { subject: 'Explosão', A: 85 },
        { subject: 'Força', A: 92 },
        { subject: 'Agilidade', A: 75 },
        { subject: 'Velocidade', A: 88 },
        { subject: 'Técnica', A: 70 },
        { subject: 'IQ Tático', A: 82 },
    ];

    const evolutionData = [
        { date: 'Set', ovr: 72 },
        { date: 'Out', ovr: 75 },
        { date: 'Nov', ovr: 80 },
        { date: 'Dez', ovr: 88 },
    ];

    const handleSaveDossier = (e: React.FormEvent) => {
        e.preventDefault();
        toast.success("Dossiê atualizado! Súmula Digital sincronizada.");
    };

    return (
        <div className="space-y-6 animate-fade-in pb-20">
            <PageHeader title="Meu Perfil" subtitle="Gestão de Carreira e Dossiê Federativo." />

            {/* ABAS DE NAVEGAÇÃO INTERNA */}
            <div className="flex bg-secondary p-1 rounded-2xl border border-white/5 w-fit shadow-xl mb-8">
                <button onClick={() => setActiveTab('LEGACY')} className={`px-10 py-3 rounded-xl text-xs font-black uppercase transition-all flex items-center gap-2 ${activeTab === 'LEGACY' ? 'bg-highlight text-white shadow-glow' : 'text-text-secondary hover:text-white'}`}>
                    <StarIcon className="w-4 h-4"/> Legacy & Stats
                </button>
                <button onClick={() => setActiveTab('DOSSIER')} className={`px-10 py-3 rounded-xl text-xs font-black uppercase transition-all flex items-center gap-2 ${activeTab === 'DOSSIER' ? 'bg-indigo-600 text-white shadow-glow' : 'text-text-secondary hover:text-white'}`}>
                    <ShieldCheckIcon className="w-4 h-4"/> Dossiê (Súmula)
                </button>
            </div>

            {activeTab === 'LEGACY' ? (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* CARD FÍSICO (O QUE JÁ EXISTE) */}
                    <div className="lg:col-span-4 flex justify-center">
                        <div className="relative w-[320px] h-[480px] rounded-3xl overflow-hidden shadow-[0_0_60px_rgba(5,150,105,0.4)] border-2 border-highlight/30 group perspective-1000">
                            <div className="absolute inset-0 bg-gradient-to-br from-highlight via-[#0f172a] to-black"></div>
                            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-30"></div>
                            <div className="relative z-10 p-7 flex flex-col items-center h-full">
                                <div className="flex justify-between w-full mb-6">
                                    <div className="text-center">
                                        <p className="text-5xl font-black text-white italic leading-none">{player?.rating || 0}</p>
                                        <p className="text-[12px] font-black text-highlight uppercase mt-1 tracking-widest">{player?.position}</p>
                                    </div>
                                    <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center border border-white/20 backdrop-blur-sm">
                                        <TrophyIcon className="w-6 h-6 text-highlight" />
                                    </div>
                                </div>
                                <div className="w-56 h-56 relative mb-4">
                                    <LazyImage src={player?.avatarUrl} className="w-full h-full object-cover object-top relative z-10 drop-shadow-[0_20px_30px_rgba(0,0,0,0.5)]" style={{maskImage: 'linear-gradient(to bottom, black 80%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to bottom, black 80%, transparent 100%)'}} fallbackText={player?.name} />
                                </div>
                                <div className="w-full text-center bg-black/40 backdrop-blur-md py-3 rounded-2xl border border-white/10 mb-4 shadow-xl">
                                    <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter leading-none">{player?.name}</h2>
                                </div>
                                <div className="grid grid-cols-3 gap-x-8 gap-y-3 w-full pt-4 border-t border-white/10">
                                    <div className="text-center"><p className="text-[9px] text-text-secondary uppercase font-bold">SPD</p><p className="text-lg font-black text-white">88</p></div>
                                    <div className="text-center"><p className="text-[9px] text-text-secondary uppercase font-bold">STR</p><p className="text-lg font-black text-white">92</p></div>
                                    <div className="text-center"><p className="text-[9px] text-text-secondary uppercase font-bold">AGI</p><p className="text-lg font-black text-white">75</p></div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* DASHBOARD DE PERFORMANCE */}
                    <div className="lg:col-span-8 space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Card title="Matriz de Atributos">
                                <div className="h-64 w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={skillData}>
                                            <PolarGrid stroke="rgba(255,255,255,0.05)" />
                                            <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 'bold' }} />
                                            <Radar name="Skills" dataKey="A" stroke="#059669" fill="#059669" fillOpacity={0.6} />
                                        </RadarChart>
                                    </ResponsiveContainer>
                                </div>
                            </Card>
                            <Card title="Evolução na Temporada">
                                <div className="h-64 w-full">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={evolutionData}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                                            <XAxis dataKey="date" stroke="#94a3b8" />
                                            <YAxis domain={[60, 100]} stroke="#94a3b8" />
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
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <form onSubmit={handleSaveDossier} className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-slide-in">
                    <div className="lg:col-span-2 space-y-6">
                        <Card title="Dados de Registro Federativo">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="text-[10px] font-black text-text-secondary uppercase mb-2 block">Nome Civil Completo</label>
                                    <input className="w-full bg-black/20 border border-white/10 rounded-xl p-4 text-white focus:border-highlight outline-none" defaultValue={player?.name} />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-text-secondary uppercase mb-2 block">CPF (Imutável)</label>
                                    <input className="w-full bg-black/40 border border-white/5 rounded-xl p-4 text-text-secondary outline-none cursor-not-allowed" value="000.000.000-00" readOnly />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-text-secondary uppercase mb-2 block">Data de Nascimento</label>
                                    <input type="date" className="w-full bg-black/20 border border-white/10 rounded-xl p-4 text-white focus:border-highlight outline-none" defaultValue="2000-01-01" />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-text-secondary uppercase mb-2 block">Gênero / Categoria</label>
                                    <select className="w-full bg-black/20 border border-white/10 rounded-xl p-4 text-white focus:border-highlight outline-none">
                                        <option>MASCULINO ADULTO</option>
                                        <option>FEMININO ADULTO</option>
                                        <option>SUB-20</option>
                                    </select>
                                </div>
                            </div>
                        </Card>

                        <Card title="Draft Specs (Aferição Física)">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div>
                                    <label className="text-[10px] font-black text-text-secondary uppercase mb-2 block">Altura (m)</label>
                                    <input className="w-full bg-black/20 border border-white/10 rounded-xl p-4 text-white focus:border-highlight outline-none" defaultValue={player?.height} />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-text-secondary uppercase mb-2 block">Peso (kg)</label>
                                    <input className="w-full bg-black/20 border border-white/10 rounded-xl p-4 text-white focus:border-highlight outline-none" defaultValue={player?.weight} />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-text-secondary uppercase mb-2 block">Envergadura</label>
                                    <input className="w-full bg-black/20 border border-white/10 rounded-xl p-4 text-white focus:border-highlight outline-none" placeholder="1.95m" />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-text-secondary uppercase mb-2 block">Tipo Sanguíneo</label>
                                    <select className="w-full bg-black/20 border border-white/10 rounded-xl p-4 text-white focus:border-highlight outline-none">
                                        <option>A+</option><option>O+</option><option>AB+</option><option>Outro</option>
                                    </select>
                                </div>
                            </div>
                        </Card>

                        <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-black py-4 rounded-2xl shadow-glow uppercase transition-all transform active:scale-95">Atualizar Dossiê de Atleta</button>
                    </div>

                    <div className="space-y-6">
                        <Card title="Kit Lab (Tamanhos)">
                             <div className="space-y-4">
                                 <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl">
                                     <span className="text-[10px] font-black text-text-secondary uppercase">Capacete</span>
                                     <select className="bg-transparent text-white font-bold outline-none"><option>L</option><option>XL</option></select>
                                 </div>
                                 <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl">
                                     <span className="text-[10px] font-black text-text-secondary uppercase">Shoulder Pad</span>
                                     <select className="bg-transparent text-white font-bold outline-none"><option>XL</option><option>2XL</option></select>
                                 </div>
                                 <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl border border-highlight/30">
                                     <span className="text-[10px] font-black text-highlight uppercase">Jersey Oficial</span>
                                     <span className="font-black text-white text-xl">#{player?.jerseyNumber}</span>
                                 </div>
                             </div>
                        </Card>

                        <div className="bg-indigo-900/20 border border-indigo-500/30 p-6 rounded-[2rem] text-center">
                            <ShieldCheckIcon className="w-12 h-12 text-indigo-400 mx-auto mb-4" />
                            <h4 className="text-white font-black uppercase text-xs italic">Súmula Digital</h4>
                            <p className="text-[10px] text-text-secondary mt-2">Seus dados estão 100% em conformidade com o protocolo de identificação da Confederação.</p>
                        </div>
                    </div>
                </form>
            )}
        </div>
    );
};

export default MyProfile;