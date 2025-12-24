
import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { Player, PracticeSession } from '../types';
import LazyImage from './LazyImage';
import { CheckCircleIcon, SearchIcon } from './icons/UiIcons';

interface CheckInModalProps {
    isOpen: boolean;
    onClose: () => void;
    session: PracticeSession;
    allPlayers: Player[];
    onSave: (checkedInIds: string[]) => void;
}

const CheckInModal: React.FC<CheckInModalProps> = ({ isOpen, onClose, session, allPlayers, onSave }) => {
    const [presentIds, setPresentIds] = useState<Set<string>>(new Set());
    const [searchTerm, setSearchTerm] = useState('');
    const [filter, setFilter] = useState<'RSVP' | 'ALL'>('RSVP');

    useEffect(() => {
        if (isOpen) {
            // Fix: checkedInAttendees is now valid in PracticeSession
            if (session.checkedInAttendees && session.checkedInAttendees.length > 0) {
                setPresentIds(new Set(session.checkedInAttendees));
            } else {
                setPresentIds(new Set(session.attendees || []));
            }
            setFilter('RSVP');
            setSearchTerm('');
        }
    }, [isOpen, session]);

    const togglePresence = (playerId: string) => {
        const newSet = new Set(presentIds);
        if (newSet.has(playerId)) {
            newSet.delete(playerId);
        } else {
            newSet.add(playerId);
        }
        setPresentIds(newSet);
    };

    const handleSave = () => {
        onSave(Array.from(presentIds));
        onClose();
    };

    const displayedPlayers = allPlayers.filter(p => {
        const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                              String(p.jerseyNumber).includes(searchTerm);
        
        if (!matchesSearch) return false;

        if (filter === 'RSVP') {
            return (session.attendees || []).includes(String(p.id)) || presentIds.has(String(p.id));
        }
        
        return true; 
    }).sort((a, b) => {
        const aPresent = presentIds.has(String(a.id));
        const bPresent = presentIds.has(String(b.id));
        if (aPresent && !bPresent) return -1;
        if (!aPresent && bPresent) return 1;
        return a.name.localeCompare(b.name);
    });

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Lista de Presença (Check-in)" maxWidth="max-w-2xl">
            <div className="flex flex-col h-[70vh] md:h-auto">
                <div className="space-y-4 px-1">
                    {/* Header Stats */}
                    <div className="flex justify-between items-center bg-black/20 p-3 rounded-xl border border-white/5">
                        <div className="text-center flex-1">
                            <p className="text-[10px] text-text-secondary uppercase font-bold">RSVP (Previsto)</p>
                            <p className="text-xl font-bold text-white">{session.attendees?.length || 0}</p>
                        </div>
                        <div className="w-px h-8 bg-white/10"></div>
                        <div className="text-center flex-1">
                            <p className="text-[10px] text-text-secondary uppercase font-bold">Confirmados (Real)</p>
                            <p className="text-2xl font-black text-green-400">{presentIds.size}</p>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="flex gap-2">
                        <div className="relative flex-1">
                            <SearchIcon className="absolute left-3 top-2.5 w-4 h-4 text-text-secondary" />
                            <input 
                                className="w-full bg-secondary border border-white/10 rounded-lg pl-9 pr-3 py-2 text-sm text-white focus:border-highlight focus:outline-none"
                                placeholder="Buscar atleta..."
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <div className="flex bg-secondary rounded-lg p-1 border border-white/10 shrink-0">
                            <button onClick={() => setFilter('RSVP')} className={`px-3 py-1 rounded text-xs font-bold transition-all ${filter === 'RSVP' ? 'bg-highlight text-white' : 'text-text-secondary'}`}>
                                RSVP
                            </button>
                            <button onClick={() => setFilter('ALL')} className={`px-3 py-1 rounded text-xs font-bold transition-all ${filter === 'ALL' ? 'bg-white text-black' : 'text-text-secondary'}`}>
                                Todos
                            </button>
                        </div>
                    </div>
                </div>

                {/* Player Grid - Scrollable Area */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-1 mt-4 border-t border-b border-white/5 min-h-0">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pb-2">
                        {displayedPlayers.map(player => {
                            const isPresent = presentIds.has(String(player.id));
                            return (
                                <div 
                                    key={player.id} 
                                    onClick={() => togglePresence(String(player.id))}
                                    className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all select-none ${isPresent ? 'bg-green-900/20 border-green-500' : 'bg-secondary border-white/5 opacity-70 hover:opacity-100'}`}
                                >
                                    <div className="relative">
                                        <LazyImage src={player.avatarUrl} className={`w-10 h-10 rounded-full ${isPresent ? 'grayscale-0' : 'grayscale'}`} />
                                        {isPresent && <div className="absolute -bottom-1 -right-1 bg-green-500 text-black rounded-full p-0.5"><CheckCircleIcon className="w-3 h-3"/></div>}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-center">
                                            <p className={`font-bold text-sm truncate ${isPresent ? 'text-white' : 'text-text-secondary'}`}>{player.name}</p>
                                        </div>
                                        <p className="text-xs text-text-secondary">{player.position} #{player.jerseyNumber}</p>
                                    </div>
                                </div>
                            );
                        })}
                        {displayedPlayers.length === 0 && (
                            <p className="col-span-full text-center text-text-secondary py-8 italic">Nenhum atleta encontrado.</p>
                        )}
                    </div>
                </div>

                {/* Fixed Footer */}
                <div className="flex gap-3 pt-4 mt-auto">
                    <button onClick={onClose} className="flex-1 py-3 rounded-xl text-text-secondary hover:text-white font-bold transition-colors bg-white/5 border border-white/5">
                        Cancelar
                    </button>
                    <button onClick={handleSave} className="flex-[2] bg-green-600 hover:bg-green-500 text-white font-bold py-3 rounded-xl shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-transform">
                        <CheckCircleIcon className="w-5 h-5" /> Salvar Chamada
                    </button>
                </div>
            </div>
        </Modal>
    );
};

export default CheckInModal;
