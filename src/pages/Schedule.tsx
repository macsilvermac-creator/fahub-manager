
import React, { useState, useEffect, useContext } from 'react';
import Card from '../components/Card';
import { Game, PracticeSession } from '../types';
import { TrashIcon, CheckCircleIcon, DumbbellIcon, XIcon, ClockIcon } from '../components/icons/UiIcons';
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

        // Get Current User ID for RSVP logic
        const user = authService.getCurrentUser();
        if (user) {
            // Also try to find the player ID corresponding to this user
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
        
        // Deadline Logic Check
        if (practice.deadlineDate) {
            const deadline = new Date(practice.deadlineDate);
            if (new Date() > deadline) {
                toast.error("Prazo de confirmação encerrado!");
                return;
            }
        }

        // Toggle Logic
        storageService.togglePracticeAttendance(String(practice.id), String(playerId));
        
        // Refresh local view
        loadSchedule();
        
        // Optimistic Feedback
        const isNowConfirmed = !practice.attendees?.includes(String(playerId));
        if (isNowConfirmed) toast.success("Presença confirmada!");
        else toast.info("Presença cancelada.");
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
        }
    };

    const handleSaveGame = (updatedGame: Game) => {
        const currentGames = storageService.getGames();
        const updatedList = currentGames.map(g => g.id === updatedGame.id ? updatedGame : g);
        storageService.saveGames(updatedList);
        setSelectedGame(null);
        loadSchedule();
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
        loadSchedule();
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
                        const practice = !isGame ? (item.details as PracticeSession) : null;
                        
                        // RSVP Logic
                        const isConfirmed = practice && playerId ? (practice.attendees || []).includes(String(playerId)) : false;
                        const isCheckedIn = practice && playerId ? (practice.checkedInAttendees || []).includes(String(playerId)) : false;
                        
                        // Deadline Logic
                        const deadline = practice?.deadlineDate ? new Date(practice.deadlineDate) : null;
                        const isDeadlinePassed = deadline ? new Date() > deadline : false;
                        
                        return (
                            <div 
                                key={`${item.type}-${item.id}`} 
                                onClick={() => isGame ? setSelectedGame(item.details) : null}
                                className={`rounded-lg p-4 flex flex-col md:flex-row items-start md:items-center justify-between shadow-md transition-colors border cursor-pointer group gap-4 ${isGame ? 'bg-secondary hover:bg-accent border-white/5 hover:border-highlight/30' : 'bg-blue-900/10 hover:bg-blue-900/20 border-blue-500/20 hover:border-blue-500/50'}`}
                            >
                                <div className="flex items-center w-full md:w-auto">
                                    <div className={`p-3 rounded-xl mr-4 flex-shrink-0 ${isGame ? 'bg-secondary border border-white/10' : 'bg-blue-600/20 border border-blue-500/30'}`}>
                                        {isGame ? (
                                            item.details.opponentLogoUrl ? <LazyImage src={item.details.opponentLogoUrl} className="w-8 h-8 rounded-full" /> : <TrophyIcon className="w-8 h-8 text-highlight" />
                                        ) : (
                                            <DumbbellIcon className="w-8 h-8 text-blue-400" />
                                        )}
                                    </div>
                                    <div>
                                        <div className="flex items-center gap-2 flex-wrap">
                                            {isGame && <span className="text-[10px] bg-red-600 text-white px-2 rounded font-bold">GAME</span>}
                                            {!isGame && <span className="text-[10px] bg-blue-600 text-white px-2 rounded font-bold">TREINO</span>}
                                            <p className="font-bold text-text-primary text-lg">{item.title}</p>
                                        </div>
                                        <p className="text-sm text-text-secondary">{item.description}</p>
                                        
                                        {/* Visual Feedback for Deadline */}
                                        {!isGame && deadline && !isPast && (
                                            <div className="flex items-center gap-1 mt-1">
                                                <ClockIcon className={`w-3 h-3 ${isDeadlinePassed ? 'text-red-400' : 'text-yellow-400'}`} />
                                                <span className={`text-[10px] ${isDeadlinePassed ? 'text-red-400 font-bold' : 'text-yellow-400'}`}>
                                                    {isDeadlinePassed ? 'Inscrições Encerradas' : `Confirme até: ${deadline.toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'})}`}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-center justify-between w-full md:w-auto md:justify-end gap-6">
                                    <div className="text-left md:text-right">
                                        <p className={`font-semibold capitalize ${isPast ? 'text-text-secondary' : 'text-white'}`}>{item.date.toLocaleDateString('pt-BR', { weekday: 'short', month: 'short', day: 'numeric' })}</p>
                                        <p className="text-sm text-text-secondary">{item.date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</p>
                                    </div>
                                    
                                    {/* Botão de RSVP (Atleta) - Smart Button Logic */}
                                    {isPlayer && !isGame && !isPast && (
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); handleRSVP(item); }}
                                            disabled={isDeadlinePassed && !isConfirmed} // Allow removing confirmed even if deadline passed? Usually NO.
                                            className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all shadow-md 
                                                ${isConfirmed 
                                                    ? 'bg-green-600 text-white hover:bg-green-500 ring-2 ring-green-400/50' 
                                                    : isDeadlinePassed 
                                                        ? 'bg-gray-700 text-gray-400 cursor-not-allowed border border-gray-600'
                                                        : 'bg-white/10 border border-white/20 text-white hover:bg-white/20'
                                                }`}
                                        >
                                            {isConfirmed ? (
                                                <><CheckCircleIcon className="w-4 h-4"/> Eu Vou</>
                                            ) : isDeadlinePassed ? (
                                                <><XIcon className="w-4 h-4"/> Fechado</>
                                            ) : (
                                                'Confirmar?'
                                            )}
                                        </button>
                                    )}
                                    
                                    {/* Visual Indicator for Past Presence */}
                                    {isPlayer && !isGame && isPast && (
                                        <div className={`px-3 py-1 rounded text-[10px] font-bold border ${isCheckedIn ? 'text-green-400 border-green-500/30 bg-green-500/10' : 'text-red-400 border-red-500/30 bg-red-500/10'}`}>
                                            {isCheckedIn ? 'PRESENÇA CONFIRMADA (+50 XP)' : 'FALTA'}
                                        </div>
                                    )}
                                    
                                    {/* Admin Delete */}
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