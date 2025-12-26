import React, { useMemo, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '@/components/Card';
import LazyImage from '@/components/LazyImage';
import { 
  Radar, RadarChart, PolarGrid, PolarAngleAxis, 
  ResponsiveContainer, LineChart, Line, XAxis, YAxis, 
  Tooltip, CartesianGrid, AreaChart, Area 
} from 'recharts';
import { 
  TrophyIcon, StarIcon, ClockIcon, 
  ChevronRightIcon, ShieldCheckIcon, ActivityIcon 
} from '@/components/icons/UiIcons';

interface PlayerCareerModeProps {
    player: any;
    nextGame: any;
    xpLeaders: any[];
}

// Componente memoizado para evitar lag na aba
const PlayerCareerMode: React.FC<PlayerCareerModeProps> = memo(({ player, nextGame, xpLeaders }) => {
    const navigate = useNavigate();

    // Dados de exemplo para o "narcisismo" técnico do atleta
    const skillData = useMemo(() => [
        { subject: 'Explosão', A: 85, fullMark: 100 },
        { subject: 'Força', A: 92, fullMark: 100 },
        { subject: 'Agilidade', A: 78, fullMark: 100 },
        { subject: 'Velocidade', A: 90, fullMark: 100 },
        { subject: 'Técnica', A: 74, fullMark: 100 },
        { subject: 'IQ Tático', A: 88, fullMark: 100 },
    ], []);

    const evolutionData = useMemo(() => [
        { name: 'Set', xp: 1200, rating: 82 },
        { name: 'Out', xp: 1900, rating: 83 },
        { name: 'Nov', xp: 2400, rating: 85 },
        { name: 'Dez', xp: 3100, rating: 88 },
    ], []);

    if (!player) return <div className="text-white p-20 text-center animate-pulse font-black uppercase">Sincronizando Legacy Data...</div>;

    return (
        <div className="space-y-6 animate-fade-in pb-10 max-w-[1600px] mx-auto">
            
            {/* 1. TOP BAR: AGENDA DO DIA (MISSION TICKER) */}
            <div className="bg-secondary/40 backdrop-blur-xl border border-white/5 rounded-3xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-2xl overflow-hidden relative">
                <div className="absolute top-0 left-0 w-1 h-full bg-highlight"></div>
                <div className="flex items-center gap-4">
                    <div className="bg-highlight/20 p-2 rounded-xl border border-highlight/30">
                        <ClockIcon className="w-5 h-5 text-highlight" />
                    </div>
                    <div>
                        <span className="text-[10px] font-black text-text-secondary uppercase tracking-widest">Próxima Missão de Campo</span>
                        <p className="text-white font-bold uppercase italic text-sm">
                            {nextGame ? `Jogo vs ${nextGame.opponent} • ${new Date(nextGame.date).toLocaleDateString()} às ${new Date(nextGame.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}` : 'Sem atividades oficiais programadas para hoje'}
                        </p>
                    </div>
                </div>
                <button 
                    onClick={() => navigate('/schedule')}
                    className="bg-white/5 hover:bg-white/10 text-white px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border border-white/10 transition-all flex items-center gap-2 group whitespace-nowrap"
                >
                    Ver Agenda Completa
                    <ChevronRightIcon className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
                
                {/* 2. THE PLAYER CARD (1/3 DA TELA) - O FOCO VISUAL */}
                <div className="lg:col-span-4">
                    <div className="relative h-full bg-gradient-to-br from-gray-900 via-black to-gray-900 rounded-[3rem] border-2 border-highlight/30 overflow-hidden shadow-[0_0_50px_rgba(5,150,105,0.15)] group">
                        
                        {/* Efeito de Fundo Premium */}
                        <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
                        <div className="absolute -top-24 -right-24 w-64 h-64 bg-highlight/10 rounded-full blur-[100px]"></div>
                        
                        <div className="relative z-10 p-8 flex flex-col h-full items-center justify-between">
                            
                            {/* Header: OVR e Stickers de Capacete */}
                            <div className="w-full flex justify-between items-start">
                                <div className="text-center">
                                    <span className="block text-7xl font-black text-white italic leading-none drop-shadow-2xl">{player.rating}</span>
                                    <span className="text-[10px] font-black text-highlight uppercase tracking-[0.3em] mt-1 block">Rating OVR</span>
                                </div>
                                
                                {/* Stickers de Condecoração (Helmet Stickers Style) */}
                                <div className="flex flex-wrap justify-end gap-1.5 max-w-[120px]">
                                    {['🔥', '⭐', '🛡️', '⚡', '🏆', '💎'].map((sticker, i) => (
                                        <div key={i} className="w-7 h-7 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center border border-white/20 text-xs shadow-lg transform hover:scale-125 transition-transform cursor-help" title="Condecoração Técnica">
                                            {sticker}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Imagem Narcisista (Destaque do Atleta) */}
                            <div className="relative w-72 h-72 mt-4">
                                <div className="absolute inset-0 bg-highlight/20 rounded-full blur-[60px] animate-pulse"></div>
                                <LazyImage 
                                    src={player.avatarUrl} 
                                    className="w-full h-full object-cover object-top relative z-10 drop-shadow-[0_25px_50px_rgba(0,0,0,0.9)]"
                                    style={{ maskImage: 'linear-gradient(to bottom, black 85%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to bottom, black 85%, transparent 100%)' }}
                                />
                            </div>

                            {/* Nome e Jersey */}
                            <div className="w-full text-center mt-6">
                                <div className="inline-block bg-highlight text-white font-black px-5 py-1.5 rounded-full text-xs uppercase italic tracking-tighter mb-3 shadow-glow-green">
                                    #{player.jerseyNumber} • {player.position}
                                </div>
                                <h2 className="text-5xl font-black text-white uppercase italic tracking-tighter leading-none">{player.name}</h2>
                                <p className="text-text-secondary text-[10px] font-bold uppercase tracking-[0.4em] mt-4 opacity-40">Joinville Gladiators FA • Sênior</p>
                            </div>

                            {/* Footer Stats Rápidas */}
                            <div className="w-full flex justify-center gap-6 mt-8 pt-6 border-t border-white/5">
                                <div className="text-center">
                                    <p className="text-[9px] font-black text-text-secondary uppercase">Level</p>
                                    <p className="text-2xl font-black text-white">{player.level}</p>
                                </div>
                                <div className="w-px h-10 bg-white/10"></div>
                                <div className="text-center">
                                    <p className="text-[9px] font-black text-text-secondary uppercase">Status</p>
                                    <p className="text-2xl font-black text-highlight italic">ELITE</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* 3. PERFORMANCE ANALYTICS (2/3 DA TELA) - ONDE ELE SE COMPARA */}
                <div className="lg:col-span-8 space-y-6">
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-[400px]">
                        
                        {/* Radar: Perfil Técnico */}
                        <Card title="Atributos de Performance" titleClassName="italic font-black uppercase text-xs">
                            <div className="h-[300px] w-full mt-2">
                                <ResponsiveContainer width="100%" height="100%">
                                    <RadarChart cx="50%" cy="50%" outerRadius="80%" data={skillData}>
                                        <PolarGrid stroke="rgba(255,255,255,0.05)" />
                                        <PolarAngleAxis dataKey="subject" tick={{ fill: '#94a3b8', fontSize: 10, fontWeight: 'bold' }} />
                                        <Radar
                                            name="Atleta"
                                            dataKey="A"
                                            stroke="#059669"
                                            fill="#059669"
                                            fillOpacity={0.5}
                                        />
                                        <Tooltip 
                                            contentStyle={{ backgroundColor: '#0B1120', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '10px' }}
                                        />
                                    </RadarChart>
                                </ResponsiveContainer>
                            </div>
                        </Card>

                        {/* Evolução: Progressão de Rating */}
                        <Card title="Evolução da Temporada" titleClassName="italic font-black uppercase text-xs">
                            <div className="h-[300px] w-full mt-2">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={evolutionData}>
                                        <defs>
                                            <linearGradient id="colorXp" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#059669" stopOpacity={0.3}/>
                                                <stop offset="95%" stopColor="#059669" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                        <XAxis dataKey="name" stroke="#475569" tick={{fontSize: 10}} axisLine={false} />
                                        <YAxis hide domain={['dataMin - 5', 'dataMax + 5']} />
                                        <Tooltip 
                                            contentStyle={{ backgroundColor: '#0B1120', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', fontSize: '10px' }}
                                        />
                                        <Area type="monotone" dataKey="rating" stroke="#059669" strokeWidth={3} fillOpacity={1} fill="url(#colorXp)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </Card>
                    </div>

                    {/* Social Insight: Leaderboard Compacto */}
                    <Card title="Companheiros de Unidade (Líderes de XP)" titleClassName="italic font-black uppercase text-xs">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-2">
                            {xpLeaders.slice(0, 4).map((leader, idx) => (
                                <div key={leader.id} className="bg-black/20 p-4 rounded-2xl border border-white/5 flex items-center gap-3">
                                    <span className="text-highlight font-black italic">{idx + 1}º</span>
                                    <img src={leader.avatarUrl} className="w-8 h-8 rounded-full border border-white/10" />
                                    <div className="flex-1 min-w-0">
                                        <p className="text-white font-bold text-xs truncate uppercase">{leader.name.split(' ')[0]}</p>
                                        <p className="text-[9px] text-text-secondary font-mono">{leader.xp} XP</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
});

export default PlayerCareerMode;