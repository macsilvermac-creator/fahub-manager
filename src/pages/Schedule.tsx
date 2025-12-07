
import React, { useState, useEffect, useContext } from 'react';
import Card from '../components/Card';
import { Game } from '../types';
import { TrashIcon, CheckCircleIcon } from '../components/icons/UiIcons';
import ConfirmationModal from '../components/ConfirmationModal';
import GameManagementModal from '../components/GameManagementModal';
import { storageService } from '../services/storageService';
import Modal from '../components/Modal';
import { UserContext } from '../components/Layout';

const GameCard: React.FC<{ game: Game; isPlayer: boolean; onDelete: (game: Game) => void; onClick: (game: Game) => void }> = ({ game, isPlayer, onDelete, onClick }) => {
    const isPast = game.date < new Date();
    const resultColor = game.result === 'W' ? 'text-green-400' : game.result === 'L' ? 'text-red-400' : 'text-gray-400';
    const locationText = game.location === 'Home' ? 'Casa' : 'Fora';
    
    // Mock RSVP State for visual feedback
    const [confirmed, setConfirmed] = useState(false);

    return (
        <div 
            onClick={() => onClick(game)}
            className="bg-secondary rounded-lg p-4 flex items-center justify-between shadow-md hover:bg-accent transition-colors group cursor-pointer border border-transparent hover:border-highlight/30"
        >
            <div className="flex items-center">
                <img src={game.opponentLogoUrl} alt={game.opponent} className="w-12 h-12 rounded-full object-cover" />
                <div className="ml-4">
                    <p className="font-bold text-text-primary group-hover:text-highlight transition-colors">{game.opponent}</p>
                    <p className="text-sm text-text-secondary">Jogo em {locationText}</p>
                    {game.scoutingReport && !isPast && <span className="text-[10px] bg-blue-500/20 text-blue-300 px-1.5 py-0.5 rounded ml-[-2px] mt-1 inline-block">Scout Ativo</span>}
                </div>
            </div>
            <div className="flex items-center space-x-6">
                <div className="text-right">
                    {isPast ? (
                        <>
                            <p className={`text-2xl font-bold ${resultColor}`}>{game.result || '-'}</p>
                            <p className="text-sm text-text-secondary">{game.score || 'Sem Placar'}</p>
                        </>
                    ) : (
                        <>
                            <p className="font-semibold text-text-primary">{game.date.toLocaleDateString('pt-BR', { weekday: 'short', month: 'short', day: 'numeric' })}</p>
                            <p className="text-sm text-text-secondary">{game.date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</p>
                        </>
                    )}
                </div>
                
                {isPlayer && !isPast ? (
                    <button 
                        onClick={(e) => { e.stopPropagation(); setConfirmed(!confirmed); }}
                        className={`px-3 py-1 rounded text-xs font-bold flex items-center gap-1 ${confirmed ? 'bg-green-600 text-white' : 'bg-red-600/20 text-red-400 border border-red-500/30'}`}
                    >
                        {confirmed ? <><CheckCircleIcon className="w-3 h-3"/> Confirmado</> : 'Confirmar Presença'}
                    </button>
                ) : !isPlayer && (
                    <button 
                        className="p-2 text-text-secondary hover:text-red-400 rounded-full hover:bg-secondary opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={(e) => { e.stopPropagation(); onDelete(game); }}
                        title="Excluir Jogo"
                    >
                        <TrashIcon />
                    </button>
                )}
            </div>
        </div>
    );
};


const Schedule: React.FC = () => {
    const { currentRole } = useContext(UserContext);
    const [schedule, setSchedule] = useState<Game[]>([]);
    const [gameToDelete, setGameToDelete] = useState<Game | null>(null);
    const [selectedGame, setSelectedGame] = useState<Game | null>(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);

    // New Game Form State
    const [newOpponent, setNewOpponent] = useState('');
    const [newDate, setNewDate] = useState('');
    const [newLocation, setNewLocation] = useState<'Home' | 'Away'>('Home');

    const isPlayer = currentRole === 'PLAYER';

    useEffect(() => {
        setSchedule(storageService.getGames());
    }, []);

    const handleDeleteGame = (game: Game) => {
        setGameToDelete(game);
    };

    const confirmDeleteGame = () => {
        if (gameToDelete) {
            const updated = schedule.filter(g => g.id !== gameToDelete.id);
            setSchedule(updated);
            storageService.saveGames(updated);
            setGameToDelete(null);
        }
    };

    const handleSaveGame = (updatedGame: Game) => {
        const updatedSchedule = schedule.map(g => g.id === updatedGame.id ? updatedGame : g);
        setSchedule(updatedSchedule);
        storageService.saveGames(updatedSchedule);
        setSelectedGame(null); // Close modal
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
        const updated = [...schedule, newGame].sort((a,b) => a.date.getTime() - b.date.getTime());
        setSchedule(updated);
        storageService.saveGames(updated);
        
        // Reset
        setIsAddModalOpen(false);
        setNewOpponent('');
        setNewDate('');
    };

    return (
        <div className="space-y-6 pb-12 animate-fade-in">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold text-text-primary">Calendário de Jogos</h2>
                {!isPlayer && (
                    <button 
                        onClick={() => setIsAddModalOpen(true)}
                        className="px-4 py-2 bg-highlight text-white rounded-lg font-semibold hover:bg-blue-600 transition-colors shadow-lg"
                    >
                        + Adicionar Jogo
                    </button>
                )}
            </div>
            <Card title="Calendário da Temporada & Central de Jogos">
                <div className="space-y-4">
                    {schedule.length === 0 && <p className="text-text-secondary italic text-center py-4">Nenhum jogo agendado.</p>}
                    {schedule.map(game => (
                        <GameCard 
                            key={game.id} 
                            game={game} 
                            isPlayer={isPlayer}
                            onDelete={handleDeleteGame}
                            onClick={setSelectedGame}
                        />
                    ))}
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

            {/* ADD GAME MODAL */}
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
