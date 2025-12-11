
import React, { useState, useEffect, useContext } from 'react';
import Card from '../components/Card';
import { Game, PracticeSession } from '../types';
import { TrashIcon, CheckCircleIcon, DumbbellIcon } from '../components/icons/UiIcons';
import { TrophyIcon } from '../components/icons/NavIcons';
import ConfirmationModal from '../components/ConfirmationModal';
import GameManagementModal from '../components/GameManagementModal';
import { storageService } from '../services/storageService';
import Modal from '../components/Modal';
import { UserContext } from '../components/Layout';
import LazyImage from '@/components/LazyImage';

interface ScheduleItem {
    id: string | number;
    type: 'GAME' | 'PRACTICE';
    date: Date;
    title: string;
    description: string;
    details: any; // Game or PracticeSession object
}

const Schedule: React.FC = () => {
    const { currentRole } = useContext(UserContext);
    const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
    const [gameToDelete, setGameToDelete] = useState<Game | null>(null);
    const [selectedGame, setSelectedGame] = useState<Game | null>(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    const [newOpponent, setNewOpponent] = useState('');
    const [newDate, setNewDate] = useState('');
    const [newLocation, setNewLocation] = useState<'Home' | 'Away'>('Home');

    const isPlayer = currentRole === 'PLAYER';

    useEffect(() => {
        // PERFORMANCE: Load data optimized
        const games = storageService.getGames().map(g => ({
            id: g.id,
            type: 'GAME' as const,
            date: new Date(g.date),
            title: `VS ${g.opponent}`,
            description: `Jogo ${g.location === 'Home' ? 'em Casa' : 'Fora'}`,
            details: g
        }));

        const practices = storageService.getPracticeSessions().map(p => ({
            id: p.id,
            type: 'PRACTICE' as const,
            date: new Date(p.date),
            title: p.title || 'Treino Tático',
            description: `Foco: ${p.focus}`,
            details: p
        }));

        // Merge and Sort by Date Ascending (Oldest first? No, let's show upcoming first but keep recent history)
        // Better UX: Sort by date. 
        const merged = [...games, ...practices].sort((a, b) => a.date.getTime() - b.date.getTime());
        
        // Optional: Filter out VERY old events (older than 30 days) to keep list snappy
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        
        setSchedule(merged.filter(i => i.date > thirtyDaysAgo));
    }, []);

    const handleDeleteGame = (game: Game) => {
        setGameToDelete(game);
    };

    const confirmDeleteGame = () => {
        if (gameToDelete) {
            const currentGames = storageService.getGames();
            const updated = currentGames.filter(g => g.id !== gameToDelete.id);
            storageService.saveGames(updated);
            
            // Update local combined schedule
            setSchedule(prev => prev.filter(i => !(i.type === 'GAME' && i.details.id === gameToDelete.id)));
            setGameToDelete(null);
        }
    };

    const handleSaveGame = (updatedGame: Game) => {
        const currentGames = storageService.getGames();
        const updatedList = currentGames.map(g => g.id === updatedGame.id ? updatedGame : g);
        storageService.saveGames(updatedList);
        setSelectedGame(null);
        window.location.reload(); 
    };

    const handleCreateGame = (e: React.FormEvent) => {
        e.preventDefault();
        const newGame: Game = {
            id: Date.now(),
            opponent: newOpponent,
            opponentLogoUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(newOpponent)}&background=random&color=fff`,
            date: new Date(newDate),
            location: newLocation,
            status: 'SCHEDULED'
        };
        
        const currentGames = storageService.getGames();
        const updated = [...currentGames, newGame];
        storageService.saveGames(updated);
        
        setIsAddModalOpen(false);
        setNewOpponent('');
        setNewDate('');
        
        // Add to local state immediately
        const newItem: ScheduleItem = {
            id: newGame.id,
            type: 'GAME',
            date: newGame.date,
            title: `VS ${newGame.opponent}`,
            description: `Jogo ${newGame.location === 'Home' ? 'em Casa' : 'Fora'}`,
            details: newGame
        };
        setSchedule(prev => [...prev, newItem].sort((a,b) => a.date.getTime() - b.date.getTime()));
    };

    return (
        <div className="space-y-6 pb-12 animate-fade-in">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold text-text-primary">Calendário Oficial</h2>
                {!isPlayer && (
                    <button 
                        onClick={() => setIsAddModalOpen(true)}
                        className="px-4 py-2 bg-highlight text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors shadow-lg"
                    >
                        + Adicionar Jogo
                    </button>
                )}
            </div>
            <Card title="Agenda da Temporada (Jogos & Treinos)">
                <div className="space-y-4">
                    {schedule.length === 0 && <p className="text-text-secondary italic text-center py-4">Nenhum evento agendado.</p>}
                    
                    {schedule.map(item => {
                        const isPast = item.date < new Date();
                        const isGame = item.type === 'GAME';
                        
                        return (
                            <div 
                                key={`${item.type}-${item.id}`} 
                                onClick={() => isGame ? setSelectedGame(item.details) : null}
                                className={`rounded-lg p-4 flex items-center justify-between shadow-md transition-colors border cursor-pointer group ${isGame ? 'bg-secondary hover:bg-accent border-white/5 hover:border-highlight/30' : 'bg-blue-900/10 hover:bg-blue-900/20 border-blue-500/20 hover:border-blue-500/50'}`}
                            >
                                <div className="flex items-center">
                                    <div className={`p-3 rounded-xl mr-4 ${isGame ? 'bg-secondary border border-white/10' : 'bg-blue-600/20 border border-blue-500/30'}`}>
                                        {isGame ? (
                                            item.details.opponentLogoUrl ? <LazyImage src={item.details.opponentLogoUrl} className="w-8 h-8 rounded-full" /> : <TrophyIcon className="w-8 h-8 text-highlight" />
                                        ) : (
                                            <DumbbellIcon className="w-8 h-8 text-blue-400" />
                                        )}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2">
                                            {isGame && <span className="text-[10px] bg-red-600 text-white px-2 rounded font-bold">GAME</span>}
                                            {!isGame && <span className="text-[10px] bg-blue-600 text-white px-2 rounded font-bold">TREINO</span>}
                                            <p className="font-bold text-text-primary text-lg">{item.title}</p>
                                        </div>
                                        <p className="text-sm text-text-secondary">{item.description}</p>
                                        {isGame && item.details.scoutingReport && !isPast && <span className="text-[10px] bg-blue-500/20 text-blue-300 px-1.5 py-0.5 rounded mt-1 inline-block">Scout Ativo</span>}
                                    </div>
                                </div>
                                <div className="flex items-center space-x-6">
                                    <div className="text-right">
                                        <p className={`font-semibold capitalize ${isPast ? 'text-text-secondary' : 'text-white'}`}>{item.date.toLocaleDateString('pt-BR', { weekday: 'short', month: 'short', day: 'numeric' })}</p>
                                        <p className="text-sm text-text-secondary">{item.date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</p>
                                    </div>
                                    
                                    {isPlayer && !isPast && (
                                        <button className={`px-3 py-1 rounded text-xs font-bold flex items-center gap-1 bg-white/5 border border-white/10 text-text-secondary hover:text-white hover:bg-white/10`}>
                                            Confirmar
                                        </button>
                                    )}
                                    
                                    {!isPlayer && isGame && (
                                        <button 
                                            className="p-2 text-text-secondary hover:text-red-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                            onClick={(e) => { e.stopPropagation(); handleDeleteGame(item.details); }}
                                        >
                                            <TrashIcon />
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </Card>

            <ConfirmationModal
                isOpen={!!gameToDelete}
                onClose={() => setGameToDelete(null)}
                onConfirm={confirmDeleteGame}
                title="Cancelar Jogo?"
                message={`Tem certeza que deseja remover o jogo contra ${gameToDelete?.opponent}?`}
                confirmLabel="Excluir Jogo"
            />

            {!isPlayer && (
                <GameManagementModal 
                    isOpen={!!selectedGame}
                    onClose={() => setSelectedGame(null)}
                    game={selectedGame}
                    onSave={handleSaveGame}
                />
            )}

            <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Novo Jogo">
                <form onSubmit={handleCreateGame} className="space-y-4">
                    <div>
                        <label className="text-xs font-bold text-text-secondary uppercase">Adversário</label>
                        <input className="w-full bg-black/20 border border-white/10 rounded p-2 text-white" required value={newOpponent} onChange={e => setNewOpponent(e.target.value)} placeholder="Nome do time" />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-text-secondary uppercase">Data e Hora</label>
                        <input type="datetime-local" className="w-full bg-black/20 border border-white/10 rounded p-2 text-white" required value={newDate} onChange={e => setNewDate(e.target.value)} />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-text-secondary uppercase">Local</label>
                        <select className="w-full bg-black/20 border border-white/10 rounded p-2 text-white" value={newLocation} onChange={e => setNewLocation(e.target.value as any)}>
                            <option value="Home">Em Casa (Home)</option>
                            <option value="Away">Fora (Away)</option>
                        </select>
                    </div>
                    <div className="flex justify-end pt-2">
                        <button type="submit" className="bg-highlight hover:bg-highlight-hover text-white px-6 py-2 rounded-lg font-bold">Agendar</button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Schedule;