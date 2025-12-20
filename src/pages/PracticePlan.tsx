
import React, { useContext, useState, useEffect } from 'react';
import { UserContext, UserContextType } from '../components/Layout';
import { storageService } from '../services/storageService';
import Card from '../components/Card';
import { PracticeSession, Player } from '../types';
import { useToast } from '../contexts/ToastContext';
import { WhistleIcon, CheckCircleIcon, UsersIcon, ClockIcon } from '../components/icons/UiIcons';

const PracticePlan: React.FC = () => {
    const { currentRole } = useContext(UserContext) as UserContextType;
    const toast = useToast();
    const [practices, setPractices] = useState<PracticeSession[]>([]);
    const [players, setPlayers] = useState<Player[]>([]);
    const user = storageService.getCurrentUser();

    // Bloqueio de edição para o gestor comum (conforme seu pedido)
    const isReadOnly = user?.role === 'MASTER' && currentRole === 'MASTER';

    useEffect(() => {
        setPractices(storageService.getPracticeSessions());
        setPlayers(storageService.getPlayers());
        
        const unsub = storageService.subscribe('gridiron_practice', () => {
            setPractices(storageService.getPracticeSessions());
        });
        return unsub;
    }, []);

    const handleCreatePractice = () => {
        if (isReadOnly) return;
        const title = prompt("Foco do Treino (ex: Redzone Drill):");
        if (!title) return;

        const newPractice: PracticeSession = {
            // Fix: Initializing ID as string to match type
            id: Date.now().toString(),
            title,
            focus: "Técnico/Tático",
            date: new Date(),
            attendees: [],
            checkedInAttendees: [],
            script: []
        };

        const updated = [newPractice, ...practices];
        storageService.savePracticeSessions(updated);
        storageService.logAuditAction('PRACTICE_CREATED', `Treino "${title}" agendado pelo Coach.`);
        toast.success("Treino criado! Mude para ATLETA para confirmar presença.");
    };

    const handleConfirmPresence = (practiceId: string | number) => {
        const updated = practices.map(p => {
            if (p.id === practiceId) {
                const attendees = p.attendees || [];
                const myId = user?.name || "Atleta Teste";
                if (!attendees.includes(myId)) {
                    return { ...p, attendees: [...attendees, myId] };
                }
            }
            return p;
        });
        storageService.savePracticeSessions(updated);
        toast.success("Presença confirmada!");
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter">Cronograma de Treinos</h2>
                {currentRole === 'HEAD_COACH' && !isReadOnly && (
                    <button onClick={handleCreatePractice} className="bg-blue-600 text-white px-6 py-2 rounded-xl font-black uppercase text-xs shadow-lg hover:bg-blue-500 transition-all">
                        + Agendar Treino
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 gap-4">
                {practices.map(p => (
                    <Card key={p.id} className="border-l-4 border-blue-500">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div className="flex items-center gap-4">
                                <div className="p-3 bg-blue-500/10 rounded-xl text-blue-400">
                                    <WhistleIcon className="w-6 h-6" />
                                </div>
                                <div>
                                    <h4 className="text-white font-bold uppercase">{p.title}</h4>
                                    <p className="text-xs text-text-secondary flex items-center gap-2">
                                        <ClockIcon className="w-3 h-3" /> {new Date(p.date).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="text-right">
                                    <p className="text-[10px] font-black text-text-secondary uppercase">Confirmados</p>
                                    <p className="text-lg font-black text-white">{p.attendees?.length || 0}</p>
                                </div>

                                {currentRole === 'PLAYER' && (
                                    <button 
                                        onClick={() => handleConfirmPresence(p.id)}
                                        className="bg-highlight text-white px-4 py-2 rounded-lg font-black uppercase text-[10px]"
                                    >
                                        Vou ao Treino
                                    </button>
                                )}

                                {currentRole === 'HEAD_COACH' && (
                                    <div className="flex -space-x-2">
                                        {p.attendees?.map((name, i) => (
                                            <div key={i} title={name} className="w-8 h-8 rounded-full bg-highlight border-2 border-secondary flex items-center justify-center text-[10px] font-bold text-white uppercase">
                                                {name.charAt(0)}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </Card>
                ))}
                {practices.length === 0 && (
                    <div className="text-center py-20 opacity-30 border-2 border-dashed border-white/10 rounded-2xl">
                        <p className="font-bold uppercase text-xs">Nenhum treino agendado</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default PracticePlan;