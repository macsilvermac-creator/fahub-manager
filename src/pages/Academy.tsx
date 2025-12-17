
import React, { useState, useEffect, useContext, useRef } from 'react';
import Card from '../components/Card';
import { SavedWorkout, GymDay, WorkoutProof, Player } from '../types';
import { storageService } from '../services/storageService';
import { generateStructuredGymPlan, validateGymImage } from '../services/geminiService';
import { AcademyIcon, VideoIcon, FolderIcon } from '../components/icons/NavIcons';
import { SparklesIcon, DumbbellIcon, CameraIcon, CheckCircleIcon, ClockIcon } from '../components/icons/UiIcons';
import { UserContext } from '../components/Layout';
import { authService } from '../services/authService';
import LazyImage from '@/components/LazyImage';
import { useToast } from '../contexts/ToastContext';

const Academy: React.FC = () => {
    const { currentRole } = useContext(UserContext);
    const toast = useToast();
    const cameraRef = useRef<HTMLInputElement>(null);
    const [viewMode, setViewMode] = useState<'CATALOG' | 'GYM' | 'PENDING'>('CATALOG');
    
    // Gym State
    const [gymGoal, setGymGoal] = useState('');
    const [gymEquipment, setGymEquipment] = useState('ACADEMIA');
    const [structuredWorkout, setStructuredWorkout] = useState<GymDay[] | null>(null);
    const [isGeneratingWorkout, setIsGeneratingWorkout] = useState(false);
    
    // Validation State
    const [isValidating, setIsValidating] = useState(false);
    const [pendingValidation, setPendingValidation] = useState<WorkoutProof | null>(null);
    const [coachQueue, setCoachQueue] = useState<any[]>([]);

    const isPlayer = currentRole === 'PLAYER';

    useEffect(() => {
        if (!isPlayer) {
            // Coach sees all pending proofs
            const players = storageService.getPlayers();
            const queue: any[] = [];
            players.forEach(p => {
                p.workoutProofs?.filter(pr => pr.coachValidation === 'PENDING').forEach(pr => {
                    queue.push({ player: p, proof: pr });
                });
            });
            setCoachQueue(queue);
        }
    }, [isPlayer]);

    const handleGenerateWorkout = async () => {
        if (!gymGoal) return;
        setIsGeneratingWorkout(true);
        try {
            const plan = await generateStructuredGymPlan(gymGoal, gymEquipment);
            setStructuredWorkout(plan);
            toast.success("Treino gerado com sucesso!");
        } catch (e) {
            toast.error("Erro ao gerar treino.");
        } finally {
            setIsGeneratingWorkout(false);
        }
    };

    const handleCameraClick = () => cameraRef.current?.click();

    const handleCapture = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setIsValidating(true);
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = async () => {
                const base64 = reader.result as string;
                const isValidByAI = await validateGymImage(base64);
                
                const user = authService.getCurrentUser();
                const player = storageService.getPlayers().find(p => p.name === user?.name);
                
                if (player) {
                    const newProof: WorkoutProof = {
                        id: `proof-${Date.now()}`,
                        imageUrl: base64,
                        aiValidation: isValidByAI ? 'VALID' : 'INVALID',
                        coachValidation: 'PENDING',
                        timestamp: new Date()
                    };
                    
                    const updatedPlayer: Player = {
                        ...player,
                        workoutProofs: [newProof, ...(player.workoutProofs || [])]
                    };
                    
                    storageService.savePlayers(storageService.getPlayers().map(p => p.id === player.id ? updatedPlayer : p));
                    setPendingValidation(newProof);
                    
                    if (isValidByAI) {
                        toast.success("IA Validou! Aguardando o 'OK' final do Coach.");
                    } else {
                        toast.warning("IA não reconheceu o ambiente, mas enviamos para o Coach conferir.");
                    }
                }
                setIsValidating(false);
            };
        }
    };

    const handleCoachApprove = (playerId: number, proofId: string, approve: boolean) => {
        const players = storageService.getPlayers();
        const updated = players.map(p => {
            if (p.id === playerId) {
                const updatedProofs = p.workoutProofs?.map(pr => 
                    pr.id === proofId ? { ...pr, coachValidation: approve ? 'APPROVED' : 'REJECTED' as any } : pr
                );
                // Dar XP se aprovado
                if (approve) p.xp += 50; 
                return { ...p, workoutProofs: updatedProofs };
            }
            return p;
        });
        storageService.savePlayers(updated);
        setCoachQueue(prev => prev.filter(item => item.proof.id !== proofId));
        toast.success(approve ? "Treino aprovado!" : "Treino rejeitado.");
    };

    return (
        <div className="space-y-6 pb-12 animate-fade-in">
            <div className="flex justify-between items-center bg-secondary p-4 rounded-2xl border border-white/5">
                <div className="flex items-center gap-3">
                    <AcademyIcon className="text-highlight w-8 h-8" />
                    <h2 className="text-2xl font-bold text-white uppercase italic">Gridiron Academy</h2>
                </div>
                <div className="flex bg-black/40 p-1 rounded-xl">
                    <button onClick={() => setViewMode('CATALOG')} className={`px-4 py-2 rounded-lg text-xs font-bold ${viewMode === 'CATALOG' ? 'bg-highlight text-white' : 'text-text-secondary'}`}>Cursos</button>
                    <button onClick={() => setViewMode('GYM')} className={`px-4 py-2 rounded-lg text-xs font-bold ${viewMode === 'GYM' ? 'bg-highlight text-white' : 'text-text-secondary'}`}>Iron Lab</button>
                    {!isPlayer && (
                        <button onClick={() => setViewMode('PENDING')} className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 ${viewMode === 'PENDING' ? 'bg-red-600 text-white' : 'text-red-400'}`}>
                            Validar Treinos {coachQueue.length > 0 && <span className="bg-white text-red-600 w-4 h-4 rounded-full flex items-center justify-center text-[10px]">{coachQueue.length}</span>}
                        </button>
                    )}
                </div>
            </div>

            {viewMode === 'GYM' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-slide-in">
                    <div className="lg:col-span-1 space-y-6">
                        <Card title="Gerar Ficha IA">
                            <div className="space-y-4">
                                <textarea 
                                    className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white text-sm focus:border-highlight outline-none"
                                    placeholder="Ex: Treino de força para LB focado em explosão..."
                                    value={gymGoal}
                                    onChange={e => setGymGoal(e.target.value)}
                                />
                                <button onClick={handleGenerateWorkout} disabled={isGeneratingWorkout} className="w-full bg-purple-600 hover:bg-purple-500 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2">
                                    {isGeneratingWorkout ? 'Montando...' : <><SparklesIcon className="w-4 h-4"/> Gerar Estratégia Física</>}
                                </button>
                                
                                <div className="pt-4 border-t border-white/5">
                                    <h4 className="text-xs font-bold text-text-secondary uppercase mb-3">Check-in de Treino (Prova Real)</h4>
                                    <input type="file" accept="image/*" capture="environment" className="hidden" ref={cameraRef} onChange={handleCapture} />
                                    <button 
                                        onClick={handleCameraClick}
                                        disabled={isValidating}
                                        className={`w-full h-32 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center gap-2 transition-all ${isValidating ? 'border-highlight animate-pulse' : 'border-white/10 hover:border-highlight/50 hover:bg-white/5'}`}
                                    >
                                        <CameraIcon className="w-8 h-8 text-text-secondary" />
                                        <span className="text-[10px] font-bold text-text-secondary uppercase">{isValidating ? 'IA Analisando Pixels...' : 'Tirar Foto do Treino'}</span>
                                    </button>
                                    <p className="text-[9px] text-text-secondary mt-2 text-center">⚠ Câmera obrigatória. Fotos da galeria não são aceitas para validar XP.</p>
                                </div>
                            </div>
                        </Card>
                    </div>

                    <div className="lg:col-span-2">
                        {structuredWorkout ? (
                            <div className="space-y-4">
                                {structuredWorkout.map((day, d) => (
                                    <Card key={d} title={day.title}>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                            {day.exercises.map((ex, i) => (
                                                <div key={i} className="bg-black/20 p-3 rounded-xl border border-white/5 flex justify-between">
                                                    <div>
                                                        <p className="text-white font-bold text-sm">{ex.name}</p>
                                                        <p className="text-[10px] text-text-secondary">{ex.notes}</p>
                                                    </div>
                                                    <span className="text-highlight font-mono font-bold">{ex.sets}x{ex.reps}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center bg-secondary/30 rounded-3xl border border-dashed border-white/5 p-12 opacity-50">
                                <DumbbellIcon className="w-16 h-16 mb-4" />
                                <p>Crie seu plano personalizado com a IA acima.</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {viewMode === 'PENDING' && !isPlayer && (
                <div className="space-y-4 animate-slide-in">
                    <h3 className="text-xl font-bold text-white">Fila de Validação de Treino</h3>
                    {coachQueue.length === 0 && <p className="text-text-secondary italic">Nenhum treino aguardando validação.</p>}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {coachQueue.map((item, idx) => (
                            <div key={idx} className="bg-secondary rounded-2xl overflow-hidden border border-white/10 flex flex-col">
                                <div className="h-64 bg-black relative">
                                    <img src={item.proof.imageUrl} className="w-full h-full object-cover" />
                                    <div className={`absolute top-2 right-2 px-2 py-1 rounded text-[8px] font-black uppercase ${item.proof.aiValidation === 'VALID' ? 'bg-green-500 text-black' : 'bg-red-500 text-white'}`}>
                                        AI: {item.proof.aiValidation}
                                    </div>
                                </div>
                                <div className="p-4 flex-1">
                                    <p className="text-white font-bold">{item.player.name}</p>
                                    <p className="text-xs text-text-secondary mb-4">{new Date(item.proof.timestamp).toLocaleString()}</p>
                                    <div className="flex gap-2">
                                        <button onClick={() => handleCoachApprove(item.player.id, item.proof.id, true)} className="flex-1 bg-green-600 hover:bg-green-500 text-white font-bold py-2 rounded-lg text-xs">APROVAR (+50 XP)</button>
                                        <button onClick={() => handleCoachApprove(item.player.id, item.proof.id, false)} className="flex-1 bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white font-bold py-2 rounded-lg text-xs">REJEITAR</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Academy;