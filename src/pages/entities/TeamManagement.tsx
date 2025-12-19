
import React, { useState, useEffect } from 'react';
import Card from '../../components/Card';
import { storageService } from '../../services/storageService';
import { Team, Athlete, User } from '../../types';
import LazyImage from '../../components/LazyImage';
import { UsersIcon, SettingsNavIcon, CheckCircleIcon, ShareIcon } from '../../components/icons/UiIcons';
import { useToast } from '../../contexts/ToastContext';

const TeamManagement: React.FC = () => {
    const toast = useToast();
    const [teams, setTeams] = useState<Team[]>([]);
    const [athletes, setAthletes] = useState<Athlete[]>([]);
    const [isCreating, setIsCreating] = useState(false);
    
    // Form State
    const [newTeamName, setNewTeamName] = useState('');
    const [primaryColor, setPrimaryColor] = useState('#059669');

    useEffect(() => {
        setTeams(storageService.getTeams());
        setAthletes(storageService.getAthletes());
    }, []);

    const handleCreateTeam = (e: React.FormEvent) => {
        e.preventDefault();
        const team: Team = {
            id: `team-${Date.now()}`,
            name: newTeamName,
            logoUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(newTeamName)}&background=${primaryColor.replace('#', '')}&color=fff`,
            primaryColor,
            secondaryColor: '#ffffff',
            rosterIds: [],
            coachIds: [],
            settings: { isPublic: true, allowRegistration: true }
        };
        storageService.saveTeam(team);
        setTeams([...teams, team]);
        setNewTeamName('');
        setIsCreating(false);
        toast.success(`Equipe ${team.name} fundada com sucesso!`);
    };

    return (
        <div className="p-6 space-y-6 animate-fade-in max-w-6xl mx-auto">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-secondary rounded-xl shadow-lg border border-white/5">
                        <UsersIcon className="text-highlight w-8 h-8" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter">Equipes & Elenco</h2>
                        <p className="text-text-secondary text-sm">Gestão de rosters e identidade visual da associação.</p>
                    </div>
                </div>
                <button 
                    onClick={() => setIsCreating(true)}
                    className="bg-highlight hover:bg-highlight-hover text-white px-6 py-3 rounded-xl font-bold shadow-glow transition-all uppercase text-xs"
                >
                    + Fundar Equipe
                </button>
            </div>

            {isCreating && (
                <Card title="Nova Fundação" className="animate-slide-in border-highlight/30">
                    <form onSubmit={handleCreateTeam} className="space-y-4">
                        <div>
                            <label className="text-[10px] font-black text-text-secondary uppercase mb-1 block">Nome da Equipe</label>
                            <input 
                                className="w-full bg-black/20 border border-white/10 rounded-xl p-4 text-white focus:border-highlight outline-none"
                                value={newTeamName}
                                onChange={e => setNewTeamName(e.target.value)}
                                placeholder="Ex: Rio Raptors"
                                required
                            />
                        </div>
                        <div>
                            <label className="text-[10px] font-black text-text-secondary uppercase mb-1 block">Cor Principal</label>
                            <input 
                                type="color"
                                className="w-full h-12 bg-black/20 border border-white/10 rounded-xl p-1 cursor-pointer"
                                value={primaryColor}
                                onChange={e => setPrimaryColor(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-2 pt-2">
                            <button type="submit" className="flex-1 bg-highlight text-white font-black py-3 rounded-xl uppercase text-xs">Confirmar Fundação</button>
                            <button type="button" onClick={() => setIsCreating(false)} className="px-6 py-3 text-text-secondary font-bold text-xs uppercase">Cancelar</button>
                        </div>
                    </form>
                </Card>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-4 space-y-4">
                    <h3 className="text-xs font-black text-highlight uppercase tracking-widest px-2">Suas Equipes Ativas</h3>
                    {teams.map(team => (
                        <div key={team.id} className="bg-secondary p-5 rounded-2xl border border-white/5 hover:border-highlight/50 transition-all cursor-pointer group shadow-xl">
                            <div className="flex items-center gap-4">
                                <div className="w-14 h-14 bg-white/5 rounded-2xl p-2 border border-white/10">
                                    <LazyImage src={team.logoUrl} className="w-full h-full object-contain" />
                                </div>
                                <div className="flex-1">
                                    <h4 className="text-white font-black uppercase italic text-lg leading-none">{team.name}</h4>
                                    <p className="text-[10px] text-text-secondary mt-1 font-bold">{team.rosterIds.length} Atletas • {team.coachIds.length} Coaches</p>
                                </div>
                                <div className="flex flex-col gap-2">
                                    <button className="p-2 bg-white/5 rounded-lg hover:bg-highlight transition-colors"><SettingsNavIcon className="w-4 h-4 text-white" /></button>
                                    <button className="p-2 bg-white/5 rounded-lg hover:bg-blue-500 transition-colors"><ShareIcon className="w-4 h-4 text-white" /></button>
                                </div>
                            </div>
                        </div>
                    ))}
                    {teams.length === 0 && !isCreating && (
                        <div className="text-center py-10 opacity-30 border-2 border-dashed border-white/10 rounded-2xl">
                            <p className="text-xs font-bold uppercase">Nenhuma equipe fundada</p>
                        </div>
                    )}
                </div>

                <div className="lg:col-span-8">
                    <Card title="Database Unificada de Atletas">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm text-text-secondary">
                                <thead className="bg-black/20 text-[10px] uppercase font-bold text-white/40">
                                    <tr>
                                        <th className="p-4">Atleta</th>
                                        <th className="p-4">Posição</th>
                                        <th className="p-4 text-center">Presença</th>
                                        <th className="p-4 text-right">Rating</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {athletes.map(athlete => (
                                        <tr key={athlete.id} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                                            <td className="p-4 font-bold text-white flex items-center gap-3">
                                                <div className="w-8 h-8 rounded-full bg-black/40 overflow-hidden">
                                                    <LazyImage src="" fallbackText={athlete.name} className="w-full h-full" />
                                                </div>
                                                {athlete.name} <span className="opacity-20 group-hover:opacity-100 transition-opacity">#{athlete.jerseyNumber}</span>
                                            </td>
                                            <td className="p-4"><span className="bg-white/5 px-2 py-1 rounded text-[10px] font-black">{athlete.position}</span></td>
                                            <td className="p-4 text-center">
                                                <div className="flex items-center justify-center gap-1">
                                                    <div className="h-1 w-12 bg-white/10 rounded-full overflow-hidden">
                                                        <div className="h-full bg-highlight" style={{ width: `${athlete.attendanceRate}%` }}></div>
                                                    </div>
                                                    <span className="text-[10px] font-bold">{athlete.attendanceRate}%</span>
                                                </div>
                                            </td>
                                            <td className="p-4 text-right">
                                                <span className="font-black text-white bg-highlight/20 px-2 py-1 rounded border border-highlight/30 text-xs">{athlete.stats.ovr}</span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            {athletes.length === 0 && <p className="text-center py-20 italic opacity-50 font-bold uppercase text-xs tracking-widest">Aguardando inscrições...</p>}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default TeamManagement;
