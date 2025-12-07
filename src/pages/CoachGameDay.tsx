
import React, { useState, useEffect } from 'react';
import { Game, CoachGameNote } from '../types';
import { storageService } from '../services/storageService';
import { ClipboardIcon, ClockIcon, AlertTriangleIcon } from '../components/icons/UiIcons';
import Button from '../components/Button'; // ATOMIC
import Input from '../components/Input';   // ATOMIC

const CoachGameDay: React.FC = () => {
    const [activeGame, setActiveGame] = useState<Game | null>(null);
    const [notes, setNotes] = useState<CoachGameNote[]>([]);
    const [newNote, setNewNote] = useState('');
    const [activeTab, setActiveTab] = useState<'LIVE' | 'CALL_SHEET'>('LIVE');
    const [quickTags, setQuickTags] = useState<string[]>([]);

    useEffect(() => {
        const games = storageService.getGames();
        const live = games.find(g => g.status === 'IN_PROGRESS' || g.status === 'HALFTIME') || games.find(g => g.status === 'SCHEDULED');
        setActiveGame(live || null);
        setNotes(storageService.getCoachGameNotes());
    }, []);

    const handleAddNote = (e: React.FormEvent) => {
        e.preventDefault();
        if(!newNote || !activeGame) return;
        
        const note: CoachGameNote = {
            id: Date.now().toString(),
            gameId: activeGame.id,
            quarter: activeGame.currentQuarter || 1,
            content: newNote,
            timestamp: new Date(),
            category: 'GENERAL',
            tags: quickTags
        };
        const updated = [note, ...notes];
        setNotes(updated);
        storageService.saveCoachGameNotes(updated);
        setNewNote('');
        setQuickTags([]);
    };

    const toggleQuickTag = (tag: string) => {
        if (quickTags.includes(tag)) setQuickTags(prev => prev.filter(t => t !== tag));
        else setQuickTags(prev => [...prev, tag]);
    };

    if (!activeGame) return <div className="text-center py-20 text-text-secondary">Nenhum jogo ativo.</div>;

    return (
        <div className="space-y-6 pb-24 animate-fade-in relative">
            {/* Header */}
            <div className="bg-black border-b-4 border-red-600 rounded-xl p-6 flex justify-between items-center">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded uppercase animate-pulse">AO VIVO</span>
                    </div>
                    <h1 className="text-3xl font-black text-white italic tracking-tighter">VS {activeGame.opponent.toUpperCase()}</h1>
                </div>
                <div className="text-right">
                    <span className="block text-3xl font-mono font-bold text-white">{activeGame.score || '0-0'}</span>
                    <span className="text-xl text-yellow-400 font-mono block">{activeGame.clock || '00:00'}</span>
                </div>
            </div>

            {/* Navigation Bottom Bar (Mobile optimized in Layout, here just tabs) */}
            <div className="flex border-b border-white/10 overflow-x-auto mb-4">
                <button onClick={() => setActiveTab('LIVE')} className={`px-8 py-3 font-bold text-sm border-b-2 whitespace-nowrap ${activeTab === 'LIVE' ? 'border-red-500 text-red-500' : 'border-transparent text-text-secondary'}`}>Live Notes</button>
                <button onClick={() => setActiveTab('CALL_SHEET')} className={`px-8 py-3 font-bold text-sm border-b-2 whitespace-nowrap ${activeTab === 'CALL_SHEET' ? 'border-blue-500 text-blue-400' : 'border-transparent text-text-secondary'}`}>Call Sheet</button>
            </div>

            {activeTab === 'LIVE' && (
                <div className="space-y-4">
                    {/* Quick Tags Row */}
                    <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                        {['ATQ', 'DEF', 'ST', 'CRÍTICO', 'AJUSTE'].map(tag => (
                            <button 
                                key={tag}
                                onClick={() => toggleQuickTag(tag)}
                                className={`px-4 py-2 rounded-full text-xs font-bold transition-all whitespace-nowrap ${quickTags.includes(tag) ? 'bg-white text-black scale-105' : 'bg-secondary border border-white/10 text-text-secondary'}`}
                            >
                                {tag}
                            </button>
                        ))}
                    </div>

                    {/* Chat Input */}
                    <div className="fixed bottom-20 left-4 right-4 md:static md:bottom-auto md:left-auto md:right-auto z-40">
                        <form onSubmit={handleAddNote} className="flex gap-2 bg-primary p-2 rounded-xl border border-white/10 shadow-2xl md:shadow-none md:border-0 md:bg-transparent md:p-0">
                            <Input 
                                value={newNote}
                                onChange={e => setNewNote(e.target.value)}
                                placeholder="Observação tática..."
                                className="flex-1"
                                autoFocus
                            />
                            <Button type="submit" variant="primary" className="px-6">Enviar</Button>
                        </form>
                    </div>

                    {/* Notes Feed */}
                    <div className="space-y-3 pb-20 md:pb-0">
                        {notes.filter(n => n.gameId === activeGame.id).map(note => (
                            <div key={note.id} className="bg-secondary p-3 rounded-xl border border-white/5 flex gap-3">
                                <div className="flex flex-col items-center justify-center bg-black/20 w-14 rounded-lg">
                                    <span className="text-xs font-bold text-text-secondary">Q{note.quarter}</span>
                                </div>
                                <div className="flex-1">
                                    <div className="flex gap-1 mb-1">
                                        {note.tags?.map(t => <span key={t} className="text-[9px] bg-white/10 px-1.5 rounded text-white font-bold">{t}</span>)}
                                    </div>
                                    <p className="text-white text-sm">{note.content}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};
export default CoachGameDay;
