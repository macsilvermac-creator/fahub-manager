import React, { useState, useEffect } from 'react';
import { Game, CoachGameNote } from '../types';
import { storageService } from '../services/storageService';
import { ClipboardIcon, ClockIcon, AlertTriangleIcon, PlayCircleIcon, ShieldCheckIcon } from '../components/icons/UiIcons';
import { FlagIcon, TrophyIcon } from '../components/icons/NavIcons';
import Button from '../components/Button';
import Input from '../components/Input';

const CoachGameDay: React.FC = () => {
    const [activeGame, setActiveGame] = useState<Game | null>(null);
    const [notes, setNotes] = useState<CoachGameNote[]>([]);
    const [activeTab, setActiveTab] = useState<'GENERAL' | 'HC' | 'OC' | 'DC' | 'ST'>('GENERAL');
    
    // Tactical Flow State
    const [currentDown, setCurrentDown] = useState<1 | 2 | 3 | 4>(1);
    const [selectedPlayCall, setSelectedPlayCall] = useState('');

    useEffect(() => {
        const games = storageService.getGames();
        const live = games.find(g => g.status === 'IN_PROGRESS' || g.status === 'HALFTIME') || games.find(g => g.status === 'SCHEDULED');
        setActiveGame(live || null);
        setNotes(storageService.getCoachGameNotes());
    }, []);

    const handleQuickAction = (action: string, type: 'OFFENSE' | 'DEFENSE' | 'SPECIAL' | 'GENERAL') => {
        if (!activeGame) return;

        let content = `[${currentDown}ª Descida]`;
        if (selectedPlayCall) content += ` Chamada: ${selectedPlayCall} ->`;
        content += ` ${action}`;

        const note: CoachGameNote = {
            id: Date.now().toString(),
            gameId: activeGame.id,
            quarter: activeGame.currentQuarter || 1,
            content: content,
            timestamp: new Date(),
            category: 'GENERAL',
            tags: [type]
        };

        const updated = [note, ...notes];
        setNotes(updated);
        storageService.saveCoachGameNotes(updated);
        
        // Reset state for next play flow
        if (type === 'OFFENSE' || type === 'DEFENSE') {
            setSelectedPlayCall('');
            // Auto-advance logic could go here, but manual is safer for now
        }
    };

    // MOCK INTELLIGENCE: Suggestions based on Down & Role
    const getSuggestions = (role: 'OC' | 'DC' | 'ST', down: number) => {
        if (role === 'OC') {
            if (down === 1) return ['Inside Zone (Run)', 'RPO Bubble', 'Play Action Shot'];
            if (down === 2) return ['Outside Zone', 'Quick Slant', 'Screen Pass'];
            if (down === 3) return ['Mesh Concept', 'Stick Concept', 'Four Verticals'];
            if (down === 4) return ['QB Sneak', 'Go For It (Best Play)', 'Punt Formation'];
        }
        if (role === 'DC') {
            if (down === 1) return ['Base 4-3', 'Cover 3 Sky', 'Run Blitz'];
            if (down === 2) return ['Nickel Cover 2', 'Man Free', 'Stunt Front'];
            if (down === 3) return ['Dime Package', 'Double A Gap Blitz', 'Cover 0 (Exotic)'];
            if (down === 4) return ['Punt Return Safe', 'Goal Line', 'Block Formation'];
        }
        if (role === 'ST') {
            return ['Punt Return', 'Kickoff Return', 'Field Goal Block'];
        }
        return [];
    };

    if (!activeGame) return <div className="text-center py-20 text-text-secondary">Nenhum jogo ativo no momento.</div>;

    const renderDownSelector = () => (
        <div className="flex gap-2 mb-4 bg-black/40 p-2 rounded-xl">
            {[1, 2, 3, 4].map((d) => (
                <button
                    key={d}
                    onClick={() => setCurrentDown(d as any)}
                    className={`flex-1 py-3 rounded-lg font-black text-xl transition-all ${
                        currentDown === d 
                        ? 'bg-white text-black shadow-glow scale-105' 
                        : 'bg-white/5 text-text-secondary hover:bg-white/10'
                    }`}
                >
                    {d}ª
                </button>
            ))}
        </div>
    );

    const renderSuggestions = (role: 'OC' | 'DC' | 'ST') => (
        <div className="mb-4">
            <p className="text-[10px] text-text-secondary uppercase font-bold mb-2 ml-1">
                Sugestões Táticas ({currentDown}ª Descida)
            </p>
            <div className="grid grid-cols-3 gap-2">
                {getSuggestions(role, currentDown).map((play, idx) => (
                    <button
                        key={idx}
                        onClick={() => setSelectedPlayCall(play)}
                        className={`p-2 rounded-lg border text-xs font-bold text-left transition-all ${
                            selectedPlayCall === play
                            ? 'bg-highlight/20 border-highlight text-highlight'
                            : 'bg-secondary border-white/10 text-white hover:border-white/30'
                        }`}
                    >
                        {play}
                    </button>
                ))}
            </div>
        </div>
    );

    return (
        <div className="space-y-4 pb-24 animate-fade-in relative h-full flex flex-col">
            {/* Header (Immersive) */}
            <div className="bg-black/80 backdrop-blur-md border-b border-white/10 p-4 sticky top-0 z-20 flex justify-between items-center shadow-lg">
                <div>
                    <h1 className="text-xl font-black text-white italic tracking-tighter uppercase">{activeGame.opponent}</h1>
                    <div className="flex gap-3 text-xs font-mono text-text-secondary">
                        <span className="text-yellow-400">Q{activeGame.currentQuarter}</span>
                        <span>{activeGame.clock || '12:00'}</span>
                    </div>
                </div>
                <div className="text-right">
                    <span className="block text-3xl font-mono font-bold text-white leading-none">{activeGame.score || '0-0'}</span>
                </div>
            </div>

            {/* Role Tabs */}
            <div className="flex border-b border-white/10 overflow-x-auto shrink-0 bg-secondary/50">
                <button onClick={() => setActiveTab('GENERAL')} className={`px-6 py-3 font-bold text-xs border-b-2 whitespace-nowrap ${activeTab === 'GENERAL' ? 'border-white text-white' : 'border-transparent text-text-secondary'}`}>Geral (TV)</button>
                <button onClick={() => setActiveTab('HC')} className={`px-6 py-3 font-bold text-xs border-b-2 whitespace-nowrap ${activeTab === 'HC' ? 'border-purple-500 text-purple-400' : 'border-transparent text-text-secondary'}`}>Head Coach</button>
                <button onClick={() => setActiveTab('OC')} className={`px-6 py-3 font-bold text-xs border-b-2 whitespace-nowrap ${activeTab === 'OC' ? 'border-blue-500 text-blue-400' : 'border-transparent text-text-secondary'}`}>Ataque (OC)</button>
                <button onClick={() => setActiveTab('DC')} className={`px-6 py-3 font-bold text-xs border-b-2 whitespace-nowrap ${activeTab === 'DC' ? 'border-red-500 text-red-400' : 'border-transparent text-text-secondary'}`}>Defesa (DC)</button>
                <button onClick={() => setActiveTab('ST')} className={`px-6 py-3 font-bold text-xs border-b-2 whitespace-nowrap ${activeTab === 'ST' ? 'border-green-500 text-green-400' : 'border-transparent text-text-secondary'}`}>Special Teams</button>
            </div>

            <div className="flex-1 overflow-y-auto px-4 py-2">
                {/* === TAB: GENERAL (READ ONLY) === */}
                {activeTab === 'GENERAL' && (
                    <div className="h-full flex flex-col items-center justify-center space-y-8 opacity-80">
                        <div className="text-center">
                            <p className="text-text-secondary uppercase tracking-widest text-sm">Placar</p>
                            <h2 className="text-8xl font-black text-white">{activeGame.score || '0-0'}</h2>
                        </div>
                        <div className="text-center">
                            <p className="text-text-secondary uppercase tracking-widest text-sm">Situação</p>
                            <h3 className="text-4xl font-bold text-yellow-400">1ª & 10</h3>
                            <p className="text-white">Bola na linha de 25</p>
                        </div>
                    </div>
                )}

                {/* === TAB: OC (OFFENSE) === */}
                {activeTab === 'OC' && (
                    <div className="space-y-4">
                        {renderDownSelector()}
                        {renderSuggestions('OC')}
                        
                        <div className="grid grid-cols-2 gap-3">
                            <button onClick={() => handleQuickAction('CORRIDA', 'OFFENSE')} className="bg-blue-600 hover:bg-blue-500 text-white py-4 rounded-xl font-black text-lg shadow-lg active:scale-95 transition-transform">CORRIDA</button>
                            <button onClick={() => handleQuickAction('PASSE COMPLETO', 'OFFENSE')} className="bg-green-600 hover:bg-green-500 text-white py-4 rounded-xl font-black text-lg shadow-lg active:scale-95 transition-transform">PASSE OK</button>
                            <button onClick={() => handleQuickAction('PASSE INCOMPLETO', 'OFFENSE')} className="bg-gray-700 hover:bg-gray-600 text-white py-4 rounded-xl font-bold active:scale-95 transition-transform">Incompleto</button>
                            <button onClick={() => handleQuickAction('SACK / PERDA', 'OFFENSE')} className="bg-red-600 hover:bg-red-500 text-white py-4 rounded-xl font-bold active:scale-95 transition-transform">SACK</button>
                        </div>
                        
                        <div className="mt-4 p-3 bg-blue-900/20 rounded-xl border border-blue-500/20">
                            <p className="text-xs text-blue-300 font-bold uppercase mb-2">Feed do Ataque</p>
                            <div className="space-y-1 max-h-32 overflow-y-auto">
                                {notes.filter(n => n.tags?.includes('OFFENSE')).slice(0, 5).map(n => (
                                    <p key={n.id} className="text-xs text-white truncate border-b border-white/5 pb-1">{n.content}</p>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* === TAB: DC (DEFENSE) === */}
                {activeTab === 'DC' && (
                    <div className="space-y-4">
                        {renderDownSelector()}
                        {renderSuggestions('DC')}

                        <div className="grid grid-cols-2 gap-3">
                            <button onClick={() => handleQuickAction('TACKLE', 'DEFENSE')} className="bg-blue-600 hover:bg-blue-500 text-white py-4 rounded-xl font-black text-lg shadow-lg active:scale-95 transition-transform">TACKLE</button>
                            <button onClick={() => handleQuickAction('SACK', 'DEFENSE')} className="bg-green-600 hover:bg-green-500 text-white py-4 rounded-xl font-black text-lg shadow-lg active:scale-95 transition-transform">SACK</button>
                            <button onClick={() => handleQuickAction('PASSE DESVIADO', 'DEFENSE')} className="bg-gray-700 hover:bg-gray-600 text-white py-4 rounded-xl font-bold active:scale-95 transition-transform">Desviado</button>
                            <button onClick={() => handleQuickAction('TURNOVER', 'DEFENSE')} className="bg-yellow-600 hover:bg-yellow-500 text-black py-4 rounded-xl font-black text-lg shadow-lg active:scale-95 transition-transform">TURNOVER</button>
                        </div>

                        <div className="mt-4 p-3 bg-red-900/20 rounded-xl border border-red-500/20">
                            <p className="text-xs text-red-300 font-bold uppercase mb-2">Feed da Defesa</p>
                            <div className="space-y-1 max-h-32 overflow-y-auto">
                                {notes.filter(n => n.tags?.includes('DEFENSE')).slice(0, 5).map(n => (
                                    <p key={n.id} className="text-xs text-white truncate border-b border-white/5 pb-1">{n.content}</p>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* === TAB: ST (SPECIAL TEAMS) === */}
                {activeTab === 'ST' && (
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 gap-3">
                            <button onClick={() => handleQuickAction('PUNT BOM', 'SPECIAL')} className="bg-secondary border border-white/10 hover:bg-white/10 text-white py-3 rounded-xl font-bold">PUNT (Chute)</button>
                            <button onClick={() => handleQuickAction('FIELD GOAL', 'SPECIAL')} className="bg-secondary border border-white/10 hover:bg-white/10 text-white py-3 rounded-xl font-bold">FIELD GOAL</button>
                            <button onClick={() => handleQuickAction('KICKOFF RETURN', 'SPECIAL')} className="bg-secondary border border-white/10 hover:bg-white/10 text-white py-3 rounded-xl font-bold">RETORNO</button>
                        </div>
                    </div>
                )}

                {/* === TAB: HC (HEAD COACH) === */}
                {activeTab === 'HC' && (
                    <div className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-secondary p-4 rounded-xl border border-white/10 text-center">
                                <p className="text-xs text-text-secondary uppercase font-bold mb-2">Timeouts (Nós)</p>
                                <div className="flex justify-center gap-2">
                                    {[1, 2, 3].map(t => (
                                        <div key={t} className="w-6 h-6 rounded-full bg-yellow-500 shadow-glow"></div>
                                    ))}
                                </div>
                                <button className="mt-3 w-full bg-yellow-600/20 text-yellow-400 text-xs font-bold py-1 rounded border border-yellow-500/50">Pedir Tempo</button>
                            </div>
                            <div className="bg-secondary p-4 rounded-xl border border-white/10 text-center">
                                <p className="text-xs text-text-secondary uppercase font-bold mb-2">Timeouts (Eles)</p>
                                <div className="flex justify-center gap-2">
                                    {[1, 2, 3].map(t => (
                                        <div key={t} className="w-6 h-6 rounded-full bg-gray-600"></div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <button onClick={() => handleQuickAction('ACEITAR FALTA', 'GENERAL')} className="w-full bg-green-600 text-white py-3 rounded-xl font-bold">Aceitar Penalidade</button>
                            <button onClick={() => handleQuickAction('RECUSAR FALTA', 'GENERAL')} className="w-full bg-red-600 text-white py-3 rounded-xl font-bold">Recusar Penalidade</button>
                            <button onClick={() => handleQuickAction('DESAFIO (CHALLENGE)', 'GENERAL')} className="w-full bg-red-800 border-2 border-red-500 text-white py-3 rounded-xl font-black uppercase tracking-widest mt-4">🚩 JOGAR FLAG (Desafio)</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default CoachGameDay;