
import React from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/Card';
import LazyImage from '../../components/LazyImage';
import { 
  TrophyIcon, ActivityIcon, SparklesIcon, 
  CheckCircleIcon, StarIcon, WhistleIcon,
  ClockIcon, WalletIcon, BookIcon
} from '../../components/icons/UiIcons';

interface PlayerCareerModeProps {
    player: any;
    nextGame: any;
    xpLeaders: any[];
}

const PlayerCareerMode: React.FC<PlayerCareerModeProps> = ({ player, nextGame, xpLeaders }) => {
    const navigate = useNavigate();

    return (
        <div className="space-y-8 pb-20 animate-fade-in max-w-6xl mx-auto">
            {/* Seção Superior: O Card de Elite */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
                <div className="lg:col-span-5 flex justify-center">
                    <div 
                        className="relative w-full max-w-[380px] h-[540px] rounded-[3rem] overflow-hidden shadow-[0_0_60px_rgba(5,150,105,0.4)] border-2 border-highlight/30 group perspective-1000 cursor-pointer"
                        onClick={() => navigate('/profile')}
                    >
                        <div className="absolute inset-0 bg-gradient-to-br from-highlight via-[#0B1120] to-black"></div>
                        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
                        
                        {/* Efeito de Brilho Holográfico */}
                        <div className="absolute inset-0 bg-gradient-to-tr from-white/10 via-transparent to-white/10 opacity-0 group-hover:opacity-40 transition-opacity duration-700"></div>

                        <div className="relative z-10 p-10 flex flex-col items-center justify-between h-full">
                            <div className="flex justify-between w-full">
                                <div className="text-center">
                                    <p className="text-6xl font-black text-white italic leading-none drop-shadow-2xl">{player.rating}</p>
                                    <p className="text-[14px] font-black text-highlight uppercase mt-1 tracking-[0.2em]">{player.position}</p>
                                </div>
                                <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center border border-white/20 backdrop-blur-md shadow-2xl">
                                    <StarIcon className="w-8 h-8 text-highlight" />
                                </div>
                            </div>

                            <div className="w-64 h-64 relative">
                                <div className="absolute inset-0 bg-highlight/20 rounded-full blur-[60px] animate-pulse"></div>
                                <LazyImage 
                                    src={player.avatarUrl} 
                                    className="w-full h-full object-cover object-top relative z-10 drop-shadow-[0_20px_40px_rgba(0,0,0,0.8)]" 
                                    style={{maskImage: 'linear-gradient(to bottom, black 85%, transparent 100%)', WebkitMaskImage: 'linear-gradient(to bottom, black 85%, transparent 100%)'}} 
                                    fallbackText={player.name}
                                />
                            </div>

                            <div className="w-full text-center">
                                <h2 className="text-3xl font-black text-white uppercase tracking-tighter italic leading-none mb-1">{player.name}</h2>
                                <p className="text-[10px] font-bold text-text-secondary uppercase tracking-[0.4em] opacity-60">Gladiators FA • Atleta de Elite</p>
                            </div>

                            <div className="grid grid-cols-3 gap-x-6 w-full pt-6 border-t border-white/10">
                                <div className="text-center">
                                    <p className="text-[9px] text-text-secondary uppercase font-black">SPD</p>
                                    <p className="text-xl font-black text-white">88</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-[9px] text-text-secondary uppercase font-black">STR</p>
                                    <p className="text-xl font-black text-white">92</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-[9px] text-text-secondary uppercase font-black">AGI</p>
                                    <p className="text-xl font-black text-white">75</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-7 flex flex-col gap-6">
                    {/* Painel de Progressão XP */}
                    <div className="bg-secondary/40 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/5 shadow-2xl">
                        <div className="flex justify-between items-end mb-6">
                            <div>
                                <h3 className="text-2xl font-black text-white italic uppercase tracking-tight">Temporada 2025</h3>
                                <p className="text-xs text-text-secondary font-bold uppercase tracking-widest mt-1">Nível de Prestígio: {player.level}</p>
                            </div>
                            <div className="text-right">
                                <span className="text-3xl font-black text-highlight italic">{player.xp}</span>
                                <span className="text-xs text-text-secondary font-bold ml-1">XP</span>
                            </div>
                        </div>
                        <div className="h-4 w-full bg-black/40 rounded-full overflow-hidden border border-white/5 relative">
                            <div 
                                className="h-full bg-gradient-to-r from-highlight via-cyan-400 to-highlight transition-all duration-1000 shadow-glow" 
                                style={{ width: `${(player.xp % 1000) / 10}%` }}
                            ></div>
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer"></div>
                        </div>
                        <div className="flex justify-between mt-3">
                            <span className="text-[10px] font-black text-text-secondary uppercase tracking-widest opacity-40">Rookie II</span>
                            <span className="text-[10px] font-black text-highlight uppercase tracking-widest">Veteran I</span>
                        </div>
                    </div>

                    {/* Grade de Ações Rápidas */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 flex-1">
                        {[
                            { label: 'Playbook', icon: BookIcon, path: '/tactical-lab', color: 'text-blue-400', bg: 'bg-blue-600/10' },
                            { label: 'Treino Hoje', icon: WhistleIcon, path: '/training-day', color: 'text-purple-400', bg: 'bg-purple-600/10' },
                            { label: 'Finanças', icon: WalletIcon, path: '/finance', color: 'text-green-400', bg: 'bg-green-600/10' },
                            { label: 'Evolução', icon: ActivityIcon, path: '/performance', color: 'text-orange-400', bg: 'bg-orange-600/10' }
                        ].map((btn, i) => (
                            <button 
                                key={i}
                                onClick={() => navigate(btn.path)}
                                className="bg-secondary/40 border border-white/5 rounded-3xl p-6 flex flex-col items-center justify-center gap-3 hover:border-highlight/50 transition-all group active:scale-95 shadow-xl"
                            >
                                <div className={`p-4 rounded-2xl ${btn.bg} ${btn.color} group-hover:scale-110 transition-transform`}>
                                    <btn.icon className="w-7 h-7" />
                                </div>
                                <span className="text-[10px] font-black text-white uppercase tracking-widest">{btn.label}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Seção Inferior: Próximos Eventos e Ranking */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card title="Próxima Batalha" className="border-l-4 border-l-red-500">
                    {nextGame ? (
                        <div className="flex items-center justify-between gap-6">
                            <div className="flex items-center gap-6">
                                <div className="w-20 h-20 bg-red-600/10 rounded-[2rem] flex flex-col items-center justify-center border border-red-500/20 text-red-500">
                                    <span className="text-[10px] font-black uppercase">{new Date(nextGame.date).toLocaleDateString('pt-BR', { month: 'short' })}</span>
                                    <span className="text-3xl font-black italic leading-none">{new Date(nextGame.date).getDate()}</span>
                                </div>
                                <div>
                                    <h4 className="text-2xl font-black text-white italic uppercase leading-none">VS {nextGame.opponent}</h4>
                                    <p className="text-xs text-text-secondary font-bold uppercase tracking-widest mt-2 flex items-center gap-2">
                                        <ClockIcon className="w-3 h-3" /> {new Date(nextGame.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} • Estádio Municipal
                                    </p>
                                </div>
                            </div>
                            <button className="bg-white text-black font-black px-6 py-3 rounded-2xl text-[10px] uppercase shadow-xl hover:bg-highlight hover:text-white transition-all">Check-in</button>
                        </div>
                    ) : (
                        <p className="text-center py-6 text-text-secondary italic">Nenhum evento agendado no calendário oficial.</p>
                    )}
                </Card>

                <Card title="Líderes de Engajamento" className="border-l-4 border-l-highlight">
                    <div className="space-y-3">
                        {xpLeaders.slice(0, 3).map((l, i) => (
                            <div key={i} className="flex items-center justify-between bg-black/20 p-3 rounded-2xl border border-white/5">
                                <div className="flex items-center gap-3">
                                    <span className={`w-6 text-center font-black italic ${i === 0 ? 'text-yellow-500 text-lg' : 'text-gray-500'}`}>{i + 1}º</span>
                                    <img src={l.avatarUrl} className="w-8 h-8 rounded-full border border-white/10" alt="" />
                                    <span className="text-white font-bold text-sm uppercase">{l.name}</span>
                                </div>
                                <span className="font-mono font-black text-highlight">{l.xp} XP</span>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default PlayerCareerMode;