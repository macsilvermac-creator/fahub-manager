
import React from 'react';
// @ts-ignore
import { useNavigate } from 'react-router-dom';
import Card from '../../components/Card';
import LazyImage from '../../components/LazyImage';
import { ClipboardIcon } from '../../components/icons/UiIcons';
import { TrophyIcon, UsersIcon, BookIcon, ShopIcon, ActivityIcon } from '../../components/icons/NavIcons';

interface PlayerCareerModeProps {
    player: any;
    nextGame: any;
    xpLeaders: any[];
}

const PlayerCareerMode: React.FC<PlayerCareerModeProps> = ({ player, nextGame, xpLeaders }) => {
    const navigate = useNavigate();

    if (!player) return <div className="text-white">Carregando Carreira...</div>;

    return (
        <div className="space-y-6 pb-20 animate-fade-in">
            {/* HERO SECTION: PLAYER CARD */}
            <div className="relative bg-gradient-to-br from-gray-900 to-black rounded-3xl p-6 border border-white/10 overflow-hidden shadow-2xl">
                {/* Background Decor */}
                <div className="absolute top-0 right-0 w-64 h-64 bg-highlight/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2"></div>
                
                <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
                    {/* Avatar with Level Ring */}
                    <div className="relative group cursor-pointer" onClick={() => navigate('/profile')}>
                        <div className="w-28 h-28 rounded-full p-[3px] bg-gradient-to-br from-highlight to-cyan-400">
                            <LazyImage src={player.avatarUrl} className="w-full h-full rounded-full object-cover border-4 border-black" />
                        </div>
                        <div className="absolute -bottom-2 -right-2 bg-black text-white font-black text-xl w-10 h-10 flex items-center justify-center rounded-lg border-2 border-highlight shadow-lg">
                            {player.level}
                        </div>
                    </div>

                    {/* Stats & Progress */}
                    <div className="flex-1 text-center md:text-left">
                        <h1 className="text-3xl font-black text-white uppercase italic tracking-tighter">{player.name}</h1>
                        <p className="text-highlight font-bold text-sm mb-4">{player.position} • {player.class} • FAHUB Stars</p>
                        
                        <div className="bg-white/5 rounded-xl p-3 border border-white/5 mb-3">
                            <div className="flex justify-between text-xs font-bold text-text-secondary uppercase mb-1">
                                <span>XP da Temporada</span>
                                <span>{player.xp} / 5000</span>
                            </div>
                            <div className="h-2 w-full bg-black/50 rounded-full overflow-hidden">
                                <div className="h-full bg-gradient-to-r from-highlight to-cyan-400" style={{ width: `${(player.xp % 1000) / 10}%` }}></div>
                            </div>
                        </div>

                        <button 
                            onClick={() => navigate('/profile')} 
                            className="text-xs font-bold text-text-secondary hover:text-white flex items-center gap-1 mx-auto md:mx-0 transition-colors"
                        >
                            <ClipboardIcon className="w-3 h-3" /> Atualizar Meus Dados Cadastrais
                        </button>
                    </div>

                    {/* OVR Badge */}
                    <div className="flex flex-col items-center justify-center bg-white/5 p-4 rounded-xl border border-white/10 min-w-[80px]">
                        <span className="text-xs text-text-secondary font-bold uppercase">OVR</span>
                        <span className="text-4xl font-black text-white">{player.rating}</span>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* NEXT MISSION */}
                <div className="lg:col-span-2">
                    <Card title="Próxima Missão" className="border-l-4 border-l-highlight h-full">
                        {nextGame ? (
                            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                                <div className="flex items-center gap-4">
                                    <div className="p-4 bg-highlight/10 rounded-2xl">
                                        <TrophyIcon className="w-8 h-8 text-highlight" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black text-white uppercase">Jogo vs {nextGame.opponent}</h3>
                                        <p className="text-sm text-text-secondary">{new Date(nextGame.date).toLocaleDateString()} • {new Date(nextGame.date).toLocaleTimeString()}</p>
                                        <p className="text-xs text-text-secondary mt-1 flex items-center gap-1">
                                            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                            Presença Obrigatória
                                        </p>
                                    </div>
                                </div>
                                <button className="w-full md:w-auto bg-highlight hover:bg-highlight-hover text-white px-8 py-4 rounded-xl font-black uppercase tracking-wider shadow-lg transform active:scale-95 transition-all">
                                    Confirmar Presença
                                </button>
                            </div>
                        ) : (
                            <div className="text-center py-8 opacity-50">
                                <TrophyIcon className="w-12 h-12 mx-auto mb-2 text-text-secondary" />
                                <p>Nenhum jogo agendado.</p>
                            </div>
                        )}
                    </Card>
                </div>

                {/* BODY STATUS (Check-in Rápido) */}
                <div className="lg:col-span-1">
                    <Card title="Status Físico (Hoje)">
                        <div className="grid grid-cols-3 gap-2">
                            <button className="flex flex-col items-center gap-2 p-3 bg-green-500/10 hover:bg-green-500/20 border border-green-500/20 rounded-xl transition-all" onClick={() => alert("Check-in: 100%")}>
                                <span className="text-2xl">⚡</span>
                                <span className="text-[10px] font-bold text-green-400 uppercase">100%</span>
                            </button>
                            <button className="flex flex-col items-center gap-2 p-3 bg-yellow-500/10 hover:bg-yellow-500/20 border border-yellow-500/20 rounded-xl transition-all" onClick={() => alert("Check-in: Cansado")}>
                                <span className="text-2xl">🥱</span>
                                <span className="text-[10px] font-bold text-yellow-400 uppercase">Sore</span>
                            </button>
                            <button className="flex flex-col items-center gap-2 p-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-xl transition-all" onClick={() => navigate('/performance')}>
                                <span className="text-2xl">🚑</span>
                                <span className="text-[10px] font-bold text-red-400 uppercase">Dor</span>
                            </button>
                        </div>
                    </Card>
                </div>
            </div>

            {/* LEADERBOARD & ACTIONS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card title="Leaderboard do Time (XP)">
                    <div className="space-y-3">
                        {xpLeaders.map((p: any, idx: number) => (
                            <div key={p.id} className="flex items-center justify-between bg-secondary p-3 rounded-lg border border-white/5">
                                <div className="flex items-center gap-3">
                                    <span className={`font-black w-6 text-center ${idx === 0 ? 'text-yellow-400 text-lg' : 'text-gray-500'}`}>{idx + 1}</span>
                                    <LazyImage src={p.avatarUrl} className="w-8 h-8 rounded-full bg-black" />
                                    <span className={`font-bold text-sm ${p.id === player.id ? 'text-highlight' : 'text-white'}`}>{p.name}</span>
                                </div>
                                <span className="font-mono font-bold text-white text-sm">{p.xp} XP</span>
                            </div>
                        ))}
                    </div>
                </Card>

                <div className="grid grid-cols-2 gap-4">
                    <button onClick={() => navigate('/gemini-playbook')} className="bg-purple-900/40 hover:bg-purple-900/60 border border-purple-500/30 p-4 rounded-xl flex flex-col items-center justify-center gap-2 transition-all">
                        <BookIcon className="w-8 h-8 text-purple-400" />
                        <span className="font-bold text-white text-sm">Estudar Playbook</span>
                    </button>
                    <button onClick={() => navigate('/locker-room')} className="bg-blue-900/40 hover:bg-blue-900/60 border border-blue-500/30 p-4 rounded-xl flex flex-col items-center justify-center gap-2 transition-all">
                        <UsersIcon className="w-8 h-8 text-blue-400" />
                        <span className="font-bold text-white text-sm">Vestiário</span>
                    </button>
                    <button onClick={() => navigate('/marketplace')} className="bg-yellow-900/40 hover:bg-yellow-900/60 border border-yellow-500/30 p-4 rounded-xl flex flex-col items-center justify-center gap-2 transition-all">
                        <TrophyIcon className="w-8 h-8 text-yellow-400" />
                        <span className="font-bold text-white text-sm">Loja & Itens</span>
                    </button>
                    <button onClick={() => navigate('/profile')} className="bg-gray-800 hover:bg-gray-700 border border-white/10 p-4 rounded-xl flex flex-col items-center justify-center gap-2 transition-all">
                        <ActivityIcon className="w-8 h-8 text-gray-400" />
                        <span className="font-bold text-white text-sm">Meus Highlights</span>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PlayerCareerMode;
