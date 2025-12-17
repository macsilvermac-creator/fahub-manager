
import React, { useState, useEffect, useContext } from 'react';
import Card from '../components/Card';
import { Game, Player } from '../types';
import { storageService } from '../services/storageService';
import { realtimeService } from '../services/realtimeService';
import { generateColorCommentary } from '../services/geminiService';
import { MicIcon, PlayCircleIcon, UsersIcon, SparklesIcon } from '../components/icons/UiIcons';
import { VideoIcon } from '../components/icons/NavIcons';
import LazyImage from '@/components/LazyImage';
import { useToast } from '../contexts/ToastContext';

const BroadcastBooth: React.FC = () => {
    const toast = useToast();
    const [games, setGames] = useState<Game[]>([]);
    const [activeGameId, setActiveGameId] = useState<string>('');
    const [game, setGame] = useState<any | null>(null);
    const [homeRoster, setHomeRoster] = useState<Player[]>([]);
    const [players, setPlayers] = useState<Player[]>([]);
    
    // Commentary State
    const [commentaryNotes, setCommentaryNotes] = useState<any>(null);
    const [isGeneratingNotes, setIsGeneratingNotes] = useState(false);
    
    // UI State
    const [activeTab, setActiveTab] = useState<'ROSTERS' | 'STATS' | 'NOTES'>('ROSTERS');
    const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);

    useEffect(() => {
        const allGames = storageService.getGames();
        setGames(allGames.filter(g => g.status !== 'FINAL'));
        setPlayers(storageService.getPlayers());
        
        // Auto-select live game if any
        const live = allGames.find(g => g.status === 'IN_PROGRESS');
        if (live) setActiveGameId(String(live.id));
    }, []);

    useEffect(() => {
        if (!activeGameId) return;

        // Initial Load
        const loadGameData = () => {
            const g = storageService.getGames().find(gm => String(gm.id) === activeGameId);
            if(g) {
                setGame(g);
                setHomeRoster(players.filter(p => p.status === 'ACTIVE')); // In a real app, split by teamId
            }
        };
        loadGameData();

        // Realtime Listener for Score/Clock updates
        const unsubscribe = realtimeService.subscribe((data) => {
            if (String(data.gameId) === activeGameId) {
                setGame((prev: any) => ({ ...prev, ...data.payload }));
            }
        });

        return () => unsubscribe();
    }, [activeGameId, players]);

    const handleGenerateNotes = async () => {
        if (!game) return;
        setIsGeneratingNotes(true);
        try {
            const context = `Placar: ${game.score}. Quarto: ${game.currentQuarter}. Tempo: ${game.clock}. Local: ${game.location}.`;
            const notes = await generateColorCommentary(game.homeTeamName || 'Mandante', game.opponent, context);
            setCommentaryNotes(notes);
            toast.success("Notas de narração geradas!");
        } catch (e) {
            toast.error("Erro ao gerar notas.");
        } finally {
            setIsGeneratingNotes(false);
        }
    };

    const handlePushToLowerThird = (player: Player) => {
        if (!game) return;
        realtimeService.broadcastUpdate(Number(game.id), 'BROADCAST_CONFIG', {
            action: 'SHOW_LOWER_THIRD',
            data: {
                title: player.name,
                subtitle: `${player.position} #${player.jerseyNumber} • ${player.class}`,
                image: player.avatarUrl
            }
        });
        toast.info(`Lower Third: ${player.name} enviado para o AR.`);
        
        // Auto-hide after 8s
        setTimeout(() => {
            realtimeService.broadcastUpdate(Number(game.id), 'BROADCAST_CONFIG', { action: 'HIDE_LOWER_THIRD' });
        }, 8000);
    };

    if (!activeGameId) {
        return (
            <div className="flex flex-col items-center justify-center h-[calc(100vh-100px)] text-center">
                <MicIcon className="w-16 h-16 text-text-secondary mb-4 opacity-50" />
                <h2 className="text-2xl font-bold text-white mb-4">Cabine de Transmissão</h2>
                <p className="text-text-secondary mb-6">Selecione um jogo para iniciar o painel de narração.</p>
                <div className="grid gap-4 w-full max-w-md">
                    {games.map(g => (
                        <button 
                            key={g.id} 
                            onClick={() => setActiveGameId(String(g.id))}
                            className="bg-secondary p-4 rounded-xl border border-white/10 hover:border-highlight text-left flex justify-between items-center group"
                        >
                            <div>
                                <span className="font-bold text-white block">VS {g.opponent}</span>
                                <span className="text-xs text-text-secondary">{new Date(g.date).toLocaleDateString()}</span>
                            </div>
                            <span className="bg-white/10 group-hover:bg-highlight group-hover:text-white text-text-secondary text-xs px-3 py-1 rounded-full transition-colors font-bold">
                                Entrar
                            </span>
                        </button>
                    ))}
                    {games.length === 0 && <p className="text-text-secondary italic">Nenhum jogo agendado.</p>}
                </div>
            </div>
        );
    }

    if (!game) return <div>Carregando dados...</div>;

    const score = game.score ? game.score.split('-') : ['0', '0'];

    return (
        <div className="h-[calc(100vh-80px)] flex flex-col overflow-hidden animate-fade-in">
            {/* TOP BAR: LIVE STATUS */}
            <div className="bg-black border-b border-white/10 p-4 flex justify-between items-center shrink-0">
                <div className="flex items-center gap-4">
                    <button onClick={() => setActiveGameId('')} className="text-xs text-text-secondary hover:text-white">← Voltar</button>
                    <div className="flex items-center gap-2">
                        <div className={`w-3 h-3 rounded-full ${game.status === 'IN_PROGRESS' ? 'bg-red-600 animate-pulse' : 'bg-gray-600'}`}></div>
                        <span className="text-white font-bold uppercase tracking-wider text-sm">{game.status === 'IN_PROGRESS' ? 'NO AR' : 'OFF AIR'}</span>
                    </div>
                    <div className="bg-white/10 px-3 py-1 rounded text-xs font-mono text-white">
                         Q{game.currentQuarter || 1} • {game.clock || '00:00'}
                    </div>
                </div>
                
                <div className="flex items-center gap-6">
                     <div className="text-center">
                         <span className="text-2xl font-black text-white">{score[0]}</span>
                         <span className="text-[10px] text-text-secondary block uppercase">{game.homeTeamName || 'HOME'}</span>
                     </div>
                     <span className="text-text-secondary font-bold text-xl">-</span>
                     <div className="text-center">
                         <span className="text-2xl font-black text-white">{score[1]}</span>
                         <span className="text-[10px] text-text-secondary block uppercase">{game.opponent.substring(0,3)}</span>
                     </div>
                </div>

                <div className="w-32 flex justify-end">
                    <button 
                        onClick={handleGenerateNotes} 
                        disabled={isGeneratingNotes}
                        className="flex items-center gap-2 text-xs bg-purple-600 hover:bg-purple-500 text-white px-3 py-1.5 rounded font-bold transition-colors disabled:opacity-50"
                    >
                        {isGeneratingNotes ? 'Gerando...' : <><SparklesIcon className="w-3 h-3"/> IA Insights</>}
                    </button>
                </div>
            </div>

            {/* MAIN CONTENT GRID */}
            <div className="flex-1 grid grid-cols-12 gap-0 overflow-hidden">
                
                {/* LEFT: HOME ROSTER (4 cols) */}
                <div className="col-span-3 bg-[#0f172a] border-r border-white/5 flex flex-col h-full overflow-hidden">
                    <div className="p-3 bg-black/20 border-b border-white/5 font-bold text-xs text-white uppercase flex justify-between">
                        <span>{game.homeTeamName || 'FAHUB STARS'}</span>
                        <UsersIcon className="w-4 h-4 text-text-secondary"/>
                    </div>
                    <div className="overflow-y-auto flex-1 p-2 space-y-1 custom-scrollbar">
                        {homeRoster.map(p => (
                            <div 
                                key={p.id} 
                                onClick={() => setSelectedPlayer(p)}
                                className={`flex items-center gap-2 p-2 rounded cursor-pointer hover:bg-white/5 group ${selectedPlayer?.id === p.id ? 'bg-highlight/10 border border-highlight/30' : 'border border-transparent'}`}
                            >
                                <span className="font-mono text-highlight font-bold w-6 text-right">#{p.jerseyNumber}</span>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold text-white truncate">{p.name}</p>
                                    <p className="text-[10px] text-text-secondary">{p.position} • {p.height} • {p.weight}lbs</p>
                                </div>
                                <button 
                                    onClick={(e) => { e.stopPropagation(); handlePushToLowerThird(p); }}
                                    className="text-text-secondary hover:text-white opacity-0 group-hover:opacity-100 transition-opacity"
                                    title="Mostrar na TV"
                                >
                                    <VideoIcon className="w-4 h-4" />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* CENTER: PLAYER CARD & NOTES (6 cols) */}
                <div className="col-span-6 bg-[#0B1120] flex flex-col h-full overflow-y-auto custom-scrollbar p-6 space-y-6">
                    
                    {/* AI Commentary Box */}
                    {commentaryNotes && (
                        <div className="bg-gradient-to-br from-purple-900/20 to-black border border-purple-500/30 rounded-xl p-5 animate-fade-in">
                            <h3 className="text-purple-400 font-bold text-sm uppercase mb-3 flex items-center gap-2">
                                <SparklesIcon className="w-4 h-4"/> Notas do Narrador (IA)
                            </h3>
                            <div className="space-y-3">
                                <div>
                                    <span className="text-[10px] text-gray-400 uppercase font-bold">Abertura</span>
                                    <p className="text-white text-sm leading-relaxed italic">"{commentaryNotes.intro}"</p>
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <span className="text-[10px] text-gray-400 uppercase font-bold">Olho nele (Home)</span>
                                        <p className="text-white text-xs font-bold">{commentaryNotes.homePlayerToWatch}</p>
                                    </div>
                                    <div>
                                        <span className="text-[10px] text-gray-400 uppercase font-bold">Olho nele (Visit)</span>
                                        <p className="text-white text-xs font-bold">{commentaryNotes.awayPlayerToWatch}</p>
                                    </div>
                                </div>
                                <div>
                                    <span className="text-[10px] text-gray-400 uppercase font-bold">Chaves do Jogo</span>
                                    <ul className="text-xs text-text-secondary list-disc pl-4 mt-1">
                                        {commentaryNotes.keyMatchups?.map((k: string, i: number) => <li key={i}>{k}</li>)}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Selected Player Detail */}
                    {selectedPlayer ? (
                        <Card title={`${selectedPlayer.name} #${selectedPlayer.jerseyNumber}`}>
                            <div className="flex gap-6">
                                <div className="w-32 h-32 rounded-xl overflow-hidden bg-black border border-white/10 shrink-0">
                                    <LazyImage src={selectedPlayer.avatarUrl} className="w-full h-full object-cover" />
                                </div>
                                <div className="flex-1 space-y-2">
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-xs text-text-secondary uppercase">Posição</p>
                                            <p className="text-lg font-bold text-white">{selectedPlayer.position}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-text-secondary uppercase">Classe</p>
                                            <p className="text-lg font-bold text-white">{selectedPlayer.class}</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-text-secondary uppercase">Bio Física</p>
                                            <p className="text-sm font-bold text-white">{selectedPlayer.height} • {selectedPlayer.weight} lbs</p>
                                        </div>
                                        <div>
                                            <p className="text-xs text-text-secondary uppercase">Badges</p>
                                            <div className="flex gap-1 mt-1">
                                                {selectedPlayer.badges?.map(b => (
                                                    <span key={b} className="text-[9px] bg-white/10 px-1.5 py-0.5 rounded text-gray-300">{b}</span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="pt-2">
                                        <button 
                                            onClick={() => handlePushToLowerThird(selectedPlayer)}
                                            className="w-full bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold py-2 rounded flex items-center justify-center gap-2"
                                        >
                                            <VideoIcon className="w-4 h-4" /> Enviar GC para Transmissão
                                        </button>
                                    </div>
                                </div>
                            </div>
                            
                            {/* Season Stats (Mock) */}
                            <div className="mt-4 pt-4 border-t border-white/5 grid grid-cols-4 gap-2 text-center">
                                <div className="bg-black/20 p-2 rounded">
                                    <p className="text-[10px] text-text-secondary uppercase">Jardas</p>
                                    <p className="text-lg font-bold text-highlight">1,240</p>
                                </div>
                                <div className="bg-black/20 p-2 rounded">
                                    <p className="text-[10px] text-text-secondary uppercase">TDs</p>
                                    <p className="text-lg font-bold text-white">12</p>
                                </div>
                                <div className="bg-black/20 p-2 rounded">
                                    <p className="text-[10px] text-text-secondary uppercase">Jogos</p>
                                    <p className="text-lg font-bold text-white">8</p>
                                </div>
                                <div className="bg-black/20 p-2 rounded">
                                    <p className="text-[10px] text-text-secondary uppercase">Nota</p>
                                    <p className="text-lg font-bold text-yellow-400">{selectedPlayer.rating}</p>
                                </div>
                            </div>
                        </Card>
                    ) : (
                        <div className="flex-1 flex items-center justify-center border-2 border-dashed border-white/5 rounded-xl text-text-secondary">
                            <p>Selecione um jogador na lista para ver detalhes.</p>
                        </div>
                    )}
                </div>

                {/* RIGHT: OPPONENT ROSTER (3 cols) */}
                <div className="col-span-3 bg-[#0f172a] border-l border-white/5 flex flex-col h-full overflow-hidden">
                    <div className="p-3 bg-black/20 border-b border-white/5 font-bold text-xs text-white uppercase flex justify-between">
                         <UsersIcon className="w-4 h-4 text-text-secondary"/>
                        <span>{game.opponent} (VISIT)</span>
                    </div>
                    {/* Mock Opponent Roster for Demo */}
                    <div className="overflow-y-auto flex-1 p-2 space-y-1 custom-scrollbar opacity-60">
                        <p className="text-center text-xs text-text-secondary italic py-4">Roster do visitante indisponível na versão Lite.</p>
                        {/* Placeholder items */}
                        {[1,12,24,52,88,99].map(n => (
                            <div key={n} className="flex items-center gap-2 p-2 rounded border border-white/5">
                                <span className="font-mono text-gray-500 font-bold w-6 text-right">#{n}</span>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold text-gray-400">Atleta Visitante</p>
                                    <p className="text-[10px] text-gray-600">POS • 0.00m • 000lbs</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default BroadcastBooth;