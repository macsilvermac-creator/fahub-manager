
import React, { useState, useEffect } from 'react';
import Card from '../../components/Card';
import { storageService } from '../../services/storageService';
import { Player, Team } from '../../types';
// Fix: WhistleIcon is exported from NavIcons, not UiIcons
import { CheckCircleIcon, ActivityIcon, SparklesIcon } from '../../components/icons/UiIcons';
import { WhistleIcon } from '../../components/icons/NavIcons';
import { useToast } from '../../contexts/ToastContext';

const CoachPracticeControl: React.FC = () => {
    const toast = useToast();
    // Fix: Updated state to Player[] as storageService.getAthletes() returns Player[]
    const [athletes, setAthletes] = useState<Player[]>([]);
    const [selectedTeamId, setSelectedTeamId] = useState<string>('');
    const [teams, setTeams] = useState<Team[]>([]);

    useEffect(() => {
        const t = storageService.getTeams();
        setTeams(t);
        if (t.length > 0) setSelectedTeamId(t[0].id);
        // Fix: Casting to Player[] to ensure type safety
        setAthletes(storageService.getAthletes() as Player[]);
    }, []);

    const handleAttendance = (id: string | number) => {
        toast.success("Presença registrada para o drill!");
    };

    return (
        <div className="p-6 space-y-6 animate-fade-in max-w-6xl mx-auto">
            <div className="flex justify-between items-center bg-secondary/50 p-4 rounded-2xl border border-white/5 shadow-2xl">
                <div className="flex items-center gap-4">
                    <div className="p-3 bg-blue-600 rounded-xl shadow-lg">
                        <WhistleIcon className="text-white w-8 h-8" />
                    </div>
                    <div>
                        <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter leading-none">Practice Control</h2>
                        <p className="text-blue-300 text-[10px] font-black uppercase tracking-widest mt-1">Sessão Técnica Ativa</p>
                    </div>
                </div>
                
                <select 
                    className="bg-black/40 border border-white/10 rounded-xl p-3 text-white text-xs font-bold focus:border-blue-500 outline-none"
                    value={selectedTeamId}
                    onChange={e => setSelectedTeamId(e.target.value)}
                >
                    {teams.map(t => <option key={t.id} value={t.id}>{t.name.toUpperCase()}</option>)}
                </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card title="Roster de Campo (Check-in)">
                    <div className="space-y-3">
                        {athletes.map(athlete => (
                            <div key={athlete.id} className="flex items-center justify-between p-3 bg-black/20 rounded-xl border border-white/5 hover:border-blue-500 transition-all">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-lg bg-blue-600/20 flex items-center justify-center font-black text-blue-400">
                                        #{athlete.jerseyNumber}
                                    </div>
                                    <div>
                                        <p className="text-white font-bold uppercase text-xs">{athlete.name}</p>
                                        <p className="text-[10px] text-text-secondary font-black">{athlete.position}</p>
                                    </div>
                                </div>
                                <button 
                                    onClick={() => handleAttendance(athlete.id)}
                                    className="p-2 bg-white/5 rounded-lg hover:bg-blue-600 transition-all text-white"
                                >
                                    <CheckCircleIcon className="w-5 h-5" />
                                </button>
                            </div>
                        ))}
                    </div>
                </Card>

                <div className="space-y-6">
                    <Card title="Assistente Tático (IA)">
                        <div className="p-4 bg-blue-900/10 rounded-2xl border border-blue-500/20 flex flex-col items-center text-center space-y-4">
                            <SparklesIcon className="w-12 h-12 text-blue-400 animate-pulse" />
                            <p className="text-sm text-text-secondary font-medium">A IA pode analisar o roster atual e sugerir os melhores drills de explosão para hoje.</p>
                            <button className="w-full py-3 bg-blue-600 text-white font-black rounded-xl uppercase text-xs shadow-lg hover:scale-105 active:scale-95 transition-all">
                                Gerar Script de Treino
                            </button>
                        </div>
                    </Card>

                    <Card title="Health & Status">
                        <div className="grid grid-cols-2 gap-3">
                            <div className="p-4 bg-green-500/10 rounded-xl border border-green-500/20 text-center">
                                <p className="text-[10px] font-black text-green-400 uppercase">Aptos</p>
                                <p className="text-2xl font-black text-white">18</p>
                            </div>
                            <div className="p-4 bg-red-500/10 rounded-xl border border-red-500/20 text-center">
                                <p className="text-[10px] font-black text-red-400 uppercase">Injured</p>
                                <p className="text-2xl font-black text-white">2</p>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default CoachPracticeControl;
