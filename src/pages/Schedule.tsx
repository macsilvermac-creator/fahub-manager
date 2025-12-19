
import React, { useState, useEffect, useContext } from 'react';
import Card from '../components/Card';
import { Game, PracticeSession, GameTimelineEvent, SidelineAudioNote } from '../types';
import { TrashIcon, CheckCircleIcon, DumbbellIcon, XIcon, ClockIcon, PenIcon, SaveIcon } from '../components/icons/UiIcons';
import { TrophyIcon } from '../components/icons/NavIcons';
import ConfirmationModal from '../components/ConfirmationModal';
import GameManagementModal from '../components/GameManagementModal';
import { storageService } from '../services/storageService';
import Modal from '../components/Modal';
import { UserContext } from '../components/Layout';
import LazyImage from '@/components/LazyImage';
import { authService } from '@/services/authService';
import { useToast } from '@/contexts/ToastContext';

interface ScheduleItem {
    id: string | number;
    type: 'GAME' | 'PRACTICE';
    date: Date;
    title: string;
    description: string;
    details: any; 
}

const GameCard: React.FC<{ 
    game: Game; 
    isPlayer: boolean; 
    onDelete: (game: Game) => void; 
    onClick: (game: Game) => void;
    onUpdateScore: (game: Game, newScore: string) => void;
}> = ({ game, isPlayer, onDelete, onClick, onUpdateScore }) => {
    const [isEditingScore, setIsEditingScore] = useState(false);
    const [scoreInput, setScoreInput] = useState(game.score || '0-0');
    
    const isPast = new Date(game.date) < new Date();
    // Fix: Using type-safe property access for result
    const resultColor = game.result === 'W' ? 'text-green-400' : game.result === 'L' ? 'text-red-400' : 'text-gray-400';
    const locationText = game.location === 'Home' ? 'Casa' : 'Fora';
    
    const [confirmed, setConfirmed] = useState(false);

    const handleSaveScore = (e: React.MouseEvent) => {
        e.stopPropagation();
        onUpdateScore(game, scoreInput);
        setIsEditingScore(false);
    };

    return (
        <div 
            onClick={() => !isEditingScore && onClick(game)}
            className="bg-secondary rounded-lg p-4 flex flex-col md:flex-row items-center justify-between shadow-md hover:bg-accent transition-colors group cursor-pointer border border-transparent hover:border-highlight/30 gap-4"
        >
            <div className="flex items-center w-full md:w-auto">
                <LazyImage src={game.opponentLogoUrl} alt={game.opponent} className="w-12 h-12 rounded-full object-cover flex-shrink-0" />
                <div className="ml-4">
                    <p className="font-bold text-text-primary group-hover:text-highlight transition-colors flex items-center gap-2">
                        {game.opponent}
                        {game.status === 'FINAL' && game.result && <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${game.result === 'W' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>{game.result}</span>}
                    </p>
                    <p className="text-sm text-text-secondary">Jogo em {locationText}</p>
                </div>
            </div>

            <div className="flex items-center space-x-6 w-full md:w-auto justify-between md:justify-end">
                <div className="text-right" onClick={e => e.stopPropagation()}>
                    {isPast || game.status === 'FINAL' ? (
                        isEditingScore ? (
                            <div className="flex items-center gap-2">
                                <input 
                                    className="w-20 bg-black/40 border border-highlight rounded px-2 py-1 text-center font-bold text-white focus:outline-none"
                                    value={scoreInput}
                                    onChange={e => setScoreInput(e.target.value)}
                                    placeholder="00-00"
                                    autoFocus
                                />
                                <button onClick={handleSaveScore} className="text-green-400 hover:text-white"><SaveIcon className="w-5 h-5"/></button>
                            </div>
                        ) : (
                            <div className="group/score flex items-center gap-2 justify-end">
                                <div>
                                    <p className={`text-2xl font-bold ${resultColor}`}>{game.score || '0-0'}</p>
                                    <p className="text-[10px] text-text-secondary uppercase">Placar Final</p>
                                </div>
                                {!isPlayer && (
                                    <button onClick={() => setIsEditingScore(true)} className="text-text-secondary hover:text-highlight opacity-0 group-hover/score:opacity-100 transition-opacity">
                                        <PenIcon className="w-3 h-3" />
                                    </button>
                                )}
                            </div>
                        )
                    ) : (
                        <div>
                            <p className="font-semibold text-text-primary">{new Date(game.date).toLocaleDateString('pt-BR', { weekday: 'short', month: 'short', day: 'numeric' })}</p>
                            <p className="text-sm text-text-secondary">{new Date(game.date).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</p>
                        </div>
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
    const toast = useToast();
    const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
    const [gameToDelete, setGameToDelete] = useState<Game | null>(null);
    const [selectedGame, setSelectedGame] = useState<Game | null>(null);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [playerId, setPlayerId] = useState<string | number | null>(null);

    const [newOpponent, setNewOpponent] = useState('');
    const [newDate, setNewDate] = useState('');
    const [newLocation, setNewLocation] = useState<'Home' | 'Away'>('Home');

    const isPlayer = currentRole === 'PLAYER';

    useEffect(() => {
        loadSchedule();
        const user = authService.getCurrentUser();
        if (user) {
            const p = storageService.getPlayers().find(player => player.name === user.name);
            if(p) setPlayerId(p.id);
        }
    }, []);

    const loadSchedule = () => {
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

        const merged = [...games, ...practices].sort((a, b) => a.date.getTime() - b.date.getTime());
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        setSchedule(merged.filter(i => i.date > thirtyDaysAgo));
    };

    const handleRSVP = (item: ScheduleItem) => {
        if (item.type !== 'PRACTICE' || !playerId) return;
        const practice = item.details as PracticeSession;
        if (practice.deadlineDate && new Date() > new Date(practice.deadlineDate)) {
            toast.error("Prazo de confirmação encerrado!");
            return;
        }
        storageService.togglePracticeAttendance(String(practice.id), String(playerId));
        loadSchedule();
        toast.success("Presença atualizada!");
    };

    const handleDeleteGame = (game: Game) => {
        setGameToDelete(game);
    };

    const confirmDeleteGame = () => {
        if (gameToDelete) {
            const currentGames = storageService.getGames();
            const updated = currentGames.filter(g => g.id !== gameToDelete.id);
            storageService.saveGames(updated);
            loadSchedule();
            setGameToDelete(null);
            toast.success("Jogo removido do calendário.");
        }
    };

    const handleSaveGame = (updatedGame: Game) => {
        const currentGames = storageService.getGames();
        const updatedList = currentGames.map(g => g.id === updatedGame.id ? updatedGame : g);
        storageService.saveGames(updatedList);
        setSelectedGame(null);
        loadSchedule();
    };

    const handleQuickScoreUpdate = (game: Game, newScore: string) => {
        const [home, away] = newScore.split('-').map(s => Number(s.trim()));
        const result: 'W' | 'L' | 'T' = home > away ? 'W' : home < away ? 'L' : 'T';
        
        const updatedGame: Game = { 
            ...game, 
            score: newScore, 
            result, 
            status: 'FINAL'
        };
        const currentGames = storageService.getGames();
        const updatedList = currentGames.map(g => g.id === game.id ? updatedGame : g);
        
        storageService.saveGames(updatedList);
        loadSchedule();
        toast.success("Placar atualizado!");
    };

    const handleCreateGame = (e: React.FormEvent) => {
        e.preventDefault();
        // Fix: Added missing required properties timeline and audioNotes
        const newGame: Game = {
            id: Date.now(),
            opponent: newOpponent,
            opponentLogoUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(newOpponent)}&background=random&color=fff`,
            date: new Date(newDate),
            location: newLocation,
            status: 'SCHEDULED',
            timeline: [],
            audioNotes: []
        };
        
        const currentGames = storageService.getGames();
        const updated = [...currentGames, newGame];
        storageService.saveGames(updated);
        
        setIsAddModalOpen(false);
        setNewOpponent('');
        setNewDate('');
        loadSchedule();
        toast.success("Novo jogo agendado!");
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
                        
                        if (isGame) {
                            return (
                                <GameCard 
                                    key={`game-${item.id}`}
                                    game={item.details}
                                    isPlayer={isPlayer}
                                    onDelete={handleDeleteGame}
                                    onClick={setSelectedGame}
                                    onUpdateScore={handleQuickScoreUpdate}
                                />
                            );
                        }
                        
                        const practice = item.details as PracticeSession;
                        const isConfirmed = playerId && (practice.attendees || []).includes(String(playerId));
                        const deadline = practice.deadlineDate ? new Date(practice.deadlineDate) : null;
                        const isDeadlinePassed = deadline ? new Date() > deadline : false;

                        return (
                            <div 
                                key={`prac-${item.id}`} 
                                className="rounded-lg p-4 flex flex-col md:flex-row items-start md:items-center justify-between shadow-md transition-colors border bg-blue-900/10 hover:bg-blue-900/20 border-blue-500/20 hover:border-blue-500/50"
                            >
                                <div className="flex items-center w-full md:w-auto">
                                    <div className="p-3 rounded-xl mr-4 flex-shrink-0 bg-blue-600/20 border border-blue-500/30">
                                        <DumbbellIcon className="w-8 h-8 text-blue-400" />
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <span className="text-[10px] bg-blue-600 text-white px-2 rounded font-bold">TREINO</span>
                                            <p className="font-bold text-text-primary text-lg">{item.title}</p>
                                        </div>
                                        <p className="text-sm text-text-secondary">{item.description}</p>
                                        
                                        {deadline && !isPast && (
                                            <div className="flex items-center gap-1 mt-1">
                                                <ClockIcon className={`w-3 h-3 ${isDeadlinePassed ? 'text-red-400' : 'text-yellow-400'}`} />
                                                <span className={`text-[10px] ${isDeadlinePassed ? 'text-red-400 font-bold' : 'text-yellow-400'}`}>
                                                    {isDeadlinePassed ? 'Inscrições Encerradas' : `Confirme até: ${deadline.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}`}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center justify-between w-full md:w-auto md:justify-end gap-6 mt-4 md:mt-0">
                                    <div className="text-left md:text-right">
                                        <p className={`font-semibold capitalize ${isPast ? 'text-text-secondary' : 'text-white'}`}>{item.date.toLocaleDateString('pt-BR', { weekday: 'short', month: 'short', day: 'numeric' })}</p>
                                        <p className="text-sm text-text-secondary">{item.date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</p>
                                    </div>
                                    
                                    {isPlayer && !isPast && (
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); handleRSVP(item); }}
                                            disabled={isDeadlinePassed && !isConfirmed}
                                            className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all shadow-md 
                                                ${isConfirmed 
                                                    ? 'bg-green-600 text-white hover:bg-green-500' 
                                                    : isDeadlinePassed 
                                                        ? 'bg-gray-700 text-gray-400 cursor-not-allowed'
                                                        : 'bg-white/10 border border-white/20 text-white hover:bg-white/20'
                                                }`}
                                        >
                                            {isConfirmed ? <><CheckCircleIcon className="w-4 h-4"/> Vou</> : isDeadlinePassed ? <XIcon className="w-4 h-4"/> : 'Confirmar'}
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