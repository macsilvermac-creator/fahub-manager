
import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import { Game, Player } from '../types';
import { storageService } from '../services/storageService';
import { generateColorCommentary } from '../services/geminiService';
import { MicIcon, UsersIcon, SparklesIcon, ShareIcon } from '../components/icons/UiIcons';
import LazyImage from '../components/LazyImage';
import { useToast } from '../contexts/ToastContext';

const BroadcastBooth: React.FC = () => {
    const toast = useToast();
    const [games, setGames] = useState<Game[]>([]);
    const [activeGameId, setActiveGameId] = useState<string>('');
    const [game, setGame] = useState<any | null>(null);
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
            const notes = await generateColorCommentary(game.homeTeamName || 'Mandante', game.opponent, 'Tempo real: Placar apertado.');
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
                <h2 className="text-2xl font-bold text-white mb-6 uppercase italic tracking-tighter">Cabine de Transmissão TV</h2>
                <div className="grid gap-4 w-full max-w-md">
                    {games.map(g => (
                        <button key={g.id} onClick={() => {setActiveGameId(String(g.id)); setGame(g);}} className="bg-secondary p-5 rounded-2xl border border-white/10 hover:border-highlight flex justify-between items-center transition-all">
                            <div className="text-left">
                                <span className="font-black text-white block uppercase italic">vs {g.opponent}</span>
                                <span className="text-text-secondary text-xs">{new Date(g.date).toLocaleDateString()}</span>
                            </div>
                            <span className="bg-highlight/10 text-highlight text-[10px] font-bold px-3 py-1 rounded-full border border-highlight/20">AO VIVO</span>
                        </button>
                    ))}
                    {games.length === 0 && <p className="text-text-secondary italic">Nenhum jogo ativo para transmissão.</p>}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fade-in h-full flex flex-col">
            <div className="flex justify-between items-center bg-black/40 p-4 rounded-2xl border border-white/10">
                <div className="flex items-center gap-4">
                    <button onClick={() => setActiveGameId('')} className="bg-white/5 hover:bg-white/10 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all border border-white/10">← SAIR</button>
                    <h3 className="text-xl font-black text-white italic tracking-tighter uppercase">No Ar: {game.homeTeamName} vs {game.opponent}</h3>
                </div>
                <button onClick={handleGenerateNotes} disabled={isGenerating} className="bg-purple-600 hover:bg-purple-500 text-white px-5 py-2 rounded-xl font-black text-xs uppercase flex items-center gap-2 shadow-lg animate-pulse">
                    <SparklesIcon className="w-4 h-4"/> {isGenerating ? 'Analisando Jogo...' : 'IA Spotter Chart'}
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 overflow-hidden">
                {/* Notas de Narração */}
                <div className="lg:col-span-8 flex flex-col gap-6 overflow-y-auto custom-scrollbar pr-2">
                    <Card title="Script & Insights em Tempo Real">
                        {commentaryNotes ? (
                            <div className="space-y-6">
                                <div className="bg-purple-900/10 p-5 rounded-2xl border-l-4 border-purple-500 shadow-inner">
                                    <p className="text-[10px] text-purple-400 font-black uppercase mb-2 tracking-widest">Introdução Sugerida</p>
                                    <p className="text-white italic text-lg leading-tight">"{commentaryNotes.intro}"</p>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="p-4 bg-black/20 rounded-xl border border-white/5">
                                        <p className="text-[10px] text-text-secondary uppercase font-bold mb-1">Ponto Focal (Mandante)</p>
                                        <p className="text-white font-black uppercase italic">{commentaryNotes.homePlayerToWatch}</p>
                                    </div>
                                    <div className="p-4 bg-black/20 rounded-xl border border-white/5">
                                        <p className="text-[10px] text-text-secondary uppercase font-bold mb-1">Ponto Focal (Visitante)</p>
                                        <p className="text-white font-black uppercase italic">{commentaryNotes.awayPlayerToWatch}</p>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-20 text-text-secondary italic opacity-50 flex flex-col items-center">
                                <MicIcon className="w-12 h-12 mb-4" />
                                <p>Aguardando análise da IA para gerar estatísticas narrativas...</p>
                            </div>
                        )}
                    </Card>

                    <Card title="Fatos do Jogo (Live Metadata)">
                         <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                             <div className="bg-black/40 p-4 rounded-xl text-center">
                                 <p className="text-[10px] text-text-secondary uppercase font-bold">Posse de Bola</p>
                                 <p className="text-xl font-black text-white">HOME</p>
                             </div>
                             <div className="bg-black/40 p-4 rounded-xl text-center">
                                 <p className="text-[10px] text-text-secondary uppercase font-bold">Down</p>
                                 <p className="text-xl font-black text-highlight">3rd & 4</p>
                             </div>
                             <div className="bg-black/40 p-4 rounded-xl text-center">
                                 <p className="text-[10px] text-text-secondary uppercase font-bold">Yardline</p>
                                 <p className="text-xl font-black text-white">OPP 32</p>
                             </div>
                             <div className="bg-black/40 p-4 rounded-xl text-center">
                                 <p className="text-[10px] text-text-secondary uppercase font-bold">Drive</p>
                                 <p className="text-xl font-black text-white">8 Plays</p>
                             </div>
                         </div>
                    </Card>
                </div>

                {/* Quick Roster Sidepanel */}
                <div className="lg:col-span-4 space-y-4 flex flex-col overflow-hidden">
                    <div className="bg-secondary p-4 rounded-2xl border border-white/5 flex-1 flex flex-col overflow-hidden">
                        <h4 className="text-xs font-black text-highlight uppercase tracking-widest mb-4 flex items-center gap-2">
                             <UsersIcon className="w-4 h-4"/> Roster de Campo
                        </h4>
                        <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2 pr-1">
                            {players.map(p => (
                                <div key={p.id} className="bg-black/20 p-3 rounded-xl border border-white/5 flex items-center gap-3 hover:border-highlight transition-all cursor-pointer group">
                                    <div className="w-8 h-8 rounded-lg bg-highlight/20 flex items-center justify-center font-mono text-highlight font-black">
                                        #{p.jerseyNumber}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-bold text-white truncate">{p.name}</p>
                                        <p className="text-[9px] text-text-secondary uppercase">{p.position} • OVR {p.rating}</p>
                                    </div>
                                    <button className="opacity-0 group-hover:opacity-100 p-1.5 bg-white/5 hover:bg-highlight hover:text-white rounded-lg transition-all" title="Ver Stats Detalhadas">
                                        <ShareIcon className="w-3 h-3"/>
                                    </button>
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