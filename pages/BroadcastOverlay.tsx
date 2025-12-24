import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import { Player, Game } from '../types';
import { storageService } from '../services/storageService';
import { generateColorCommentary } from '../services/geminiService';
// Fix: Added missing TrashIcon import from UiIcons
import { MicIcon, UsersIcon, SparklesIcon, ShareIcon, ActivityIcon, TrashIcon } from '../components/icons/UiIcons';
import LazyImage from '../components/LazyImage';
import { useToast } from '../contexts/ToastContext';

const BroadcastBooth: React.FC = () => {
    const toast = useToast();
    const [games, setGames] = useState<Game[]>([]);
    const [activeGameId, setActiveGameId] = useState<string>('');
    const [game, setGame] = useState<Game | null>(null);
    const [players, setPlayers] = useState<Player[]>([]);
    const [commentaryNotes, setCommentaryNotes] = useState<any>(null);
    const [isGenerating, setIsGenerating] = useState(false);

    useEffect(() => {
        setGames(storageService.getGames().filter(g => g.status !== 'FINAL'));
        setPlayers(storageService.getPlayers());
    }, []);

    const handleGenerateNotes = async () => {
        if (!game) return;
        setIsGenerating(true);
        try {
            const notes = await generateColorCommentary(game.homeTeamName || 'Gladiators', game.opponent, 'Tempo real: Placar apertado, jogo físico.');
            setCommentaryNotes(notes);
            toast.success("Spotter Chart atualizado com IA!");
        } catch (e) {
            toast.error("Erro na conexão com IA.");
        } finally {
            setIsGenerating(false);
        }
    };

    if (!activeGameId) {
        return (
            <div className="flex flex-col items-center justify-center h-full text-center p-10 animate-fade-in">
                <MicIcon className="w-16 h-16 text-text-secondary mb-4 opacity-50" />
                <h2 className="text-2xl font-bold text-white mb-6 uppercase italic tracking-tighter">Cabine de Transmissão</h2>
                <p className="text-text-secondary mb-8 max-w-sm">Selecione uma partida ativa para abrir o Spotter Chart inteligente.</p>
                <div className="grid gap-4 w-full max-w-md">
                    {games.map(g => (
                        <button key={g.id} onClick={() => {setActiveGameId(String(g.id)); setGame(g);}} className="bg-secondary p-6 rounded-3xl border border-white/10 hover:border-red-500 flex justify-between items-center transition-all group">
                            <div className="text-left">
                                <span className="font-black text-white block uppercase italic group-hover:text-red-500">vs {g.opponent}</span>
                                <span className="text-text-secondary text-[10px] font-bold uppercase tracking-widest">{new Date(g.date).toLocaleDateString()}</span>
                            </div>
                            <span className="bg-red-600/10 text-red-500 text-[10px] font-black px-3 py-1 rounded-full border border-red-500/20">LIVE</span>
                        </button>
                    ))}
                    {games.length === 0 && <p className="text-text-secondary italic">Aguardando início das partidas...</p>}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fade-in h-full flex flex-col">
            <div className="flex justify-between items-center bg-black/60 p-4 rounded-2xl border border-white/10">
                <div className="flex items-center gap-4">
                    {/* Fix: TrashIcon is now correctly imported */}
                    <button onClick={() => setActiveGameId('')} className="p-2 bg-white/5 hover:bg-white/10 rounded-xl text-white"><TrashIcon className="w-5 h-5"/></button>
                    <h3 className="text-xl font-black text-white italic uppercase tracking-tighter uppercase">ON AIR: {game?.opponent}</h3>
                </div>
                <button onClick={handleGenerateNotes} disabled={isGenerating} className="bg-purple-600 hover:bg-purple-500 text-white px-6 py-2 rounded-xl font-black text-xs uppercase flex items-center gap-2 shadow-lg animate-pulse disabled:opacity-50">
                    <SparklesIcon className="w-4 h-4"/> {isGenerating ? 'Analisando...' : 'Spotter IA'}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 overflow-hidden">
                {/* Notas de Narração */}
                <div className="lg:col-span-8 space-y-6 overflow-y-auto custom-scrollbar pr-2 pb-20">
                    <Card title="Narrative Suite (Gemini 3.0)">
                        {commentaryNotes ? (
                            <div className="space-y-6">
                                <div className="bg-purple-900/10 p-6 rounded-3xl border-l-4 border-purple-500">
                                    <p className="text-[10px] text-purple-400 font-black uppercase mb-3 tracking-widest">Storyline de Abertura</p>
                                    <p className="text-white italic text-xl leading-tight font-serif">"{commentaryNotes.intro}"</p>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-5 bg-black/40 rounded-2xl border border-white/5">
                                        <p className="text-[10px] text-blue-400 font-black uppercase mb-1">Impact Player (Gladiators)</p>
                                        <p className="text-white font-black uppercase italic text-lg">{commentaryNotes.homePlayerToWatch}</p>
                                    </div>
                                    <div className="p-5 bg-black/40 rounded-2xl border border-white/5">
                                        <p className="text-[10px] text-red-400 font-black uppercase mb-1">Ameaça (Visitante)</p>
                                        <p className="text-white font-black uppercase italic text-lg">{commentaryNotes.awayPlayerToWatch}</p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-20 text-text-secondary italic opacity-50 flex flex-col items-center">
                                <MicIcon className="w-12 h-12 mb-4" />
                                <p>Gere os insights para alimentar sua narração com dados táticos.</p>
                            </div>
                        )}
                    </Card>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card title="Chaves do Matchup">
                            <ul className="space-y-2">
                                {commentaryNotes?.keyMatchups?.map((m: string, i: number) => (
                                    <li key={i} className="text-xs text-text-secondary bg-white/5 p-2 rounded-lg border border-white/5">{m}</li>
                                )) || <p className="text-xs italic text-text-secondary">Nenhum dado processado.</p>}
                            </ul>
                        </Card>
                         <Card title="Tempo & Down">
                             <div className="flex justify-around items-center h-20">
                                 <div className="text-center"><p className="text-[10px] font-bold text-text-secondary uppercase">Quarto</p><p className="text-3xl font-black text-white">Q{game?.currentQuarter || 1}</p></div>
                                 <div className="text-center"><p className="text-[10px] font-bold text-text-secondary uppercase">Clock</p><p className="text-3xl font-black text-highlight">{game?.clock || '12:00'}</p></div>
                                 <div className="text-center"><p className="text-[10px] font-bold text-text-secondary uppercase">Down</p><p className="text-3xl font-black text-white">3rd</p></div>
                             </div>
                         </Card>
                    </div>
                </div>

                {/* Quick Spotter Roster */}
                <div className="lg:col-span-4 flex flex-col h-full overflow-hidden pb-20">
                    <div className="bg-secondary p-6 rounded-[2rem] border border-white/5 flex-1 flex flex-col overflow-hidden">
                        <h4 className="text-xs font-black text-highlight uppercase tracking-widest mb-6 flex items-center gap-2">
                             <UsersIcon className="w-4 h-4"/> Spotter Chart: Gladiators
                        </h4>
                        <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2 pr-1">
                            {players.map(p => (
                                <div key={p.id} className="bg-black/40 p-3 rounded-2xl border border-white/5 flex items-center gap-3 hover:border-highlight transition-all cursor-pointer group">
                                    <div className="w-10 h-10 rounded-xl bg-highlight/20 flex items-center justify-center font-black text-highlight">
                                        #{p.jerseyNumber}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-black text-white truncate uppercase italic">{p.name}</p>
                                        <p className="text-[9px] text-text-secondary font-bold uppercase">{p.position} • OVR {p.rating}</p>
                                    </div>
                                    <button className="opacity-0 group-hover:opacity-100 p-2 bg-white/5 hover:bg-highlight hover:text-white rounded-xl transition-all"><ShareIcon className="w-4 h-4"/></button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BroadcastBooth;