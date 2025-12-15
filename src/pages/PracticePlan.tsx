
import React, { useState, useEffect, useContext } from 'react';
import Card from '../components/Card';
import { PracticeSession, PracticeCategory, PracticeScriptItem, Announcement, Player } from '../types';
import { storageService } from '../services/storageService';
import { generatePracticeScript } from '../services/geminiService';
import { SparklesIcon, PlayCircleIcon, ClockIcon, TrashIcon, PenIcon, ShareIcon, AlertCircleIcon, UsersIcon, CheckCircleIcon } from '../components/icons/UiIcons';
import { UserContext } from '../components/Layout';
import Button from '../components/Button'; 
import Input from '../components/Input';
import { useToast } from '../contexts/ToastContext';
import Modal from '../components/Modal'; 
import LazyImage from '../components/LazyImage';

// PRESETS TACKLE
const QUICK_BLOCKS_TACKLE = [
    { type: 'WARMUP', name: 'Warmup / Dynamic', duration: 15, desc: 'Mobilidade e Ativação.' },
    { type: 'INDY', name: 'Indy (Posição)', duration: 20, desc: 'Drills de técnica individual.' },
    { type: 'GROUP', name: 'Inside Run (9on7)', duration: 15, desc: 'Bloqueios e Corrida.' },
    { type: 'GROUP', name: 'Skelly (7on7)', duration: 20, desc: 'Passe vs Cobertura.' },
    { type: 'TEAM', name: 'Team (11on11)', duration: 30, desc: 'Situações de jogo.' },
    { type: 'SPECIAL', name: 'Punt / Kickoff', duration: 10, desc: 'Special Teams.' },
];

// PRESETS FLAG (NOVO!)
const QUICK_BLOCKS_FLAG = [
    { type: 'WARMUP', name: 'Agility Ladder', duration: 10, desc: 'Escada de agilidade e cone drill.' },
    { type: 'INDY', name: 'Flag Pulling', duration: 15, desc: 'Técnica de retirada de flag.' },
    { type: 'GROUP', name: 'Route Tree', duration: 15, desc: 'Rotas e Catching.' },
    { type: 'GROUP', name: '1on1 WR/DB', duration: 15, desc: 'Man coverage drills.' },
    { type: 'TEAM', name: 'Scrimmage (5on5)', duration: 30, desc: 'Simulação de jogo.' },
    { type: 'SPECIAL', name: 'Rusher Drills', duration: 10, desc: 'Pass rush específico 7s.' },
];

const PracticePlan: React.FC = () => {
    const { currentRole } = useContext(UserContext);
    const toast = useToast();
    const [practices, setPractices] = useState<PracticeSession[]>([]);
    const [players, setPlayers] = useState<Player[]>([]);
    const [isCreating, setIsCreating] = useState(false);
    const [selectedPractice, setSelectedPractice] = useState<PracticeSession | null>(null);
    const [activeMode, setActiveMode] = useState<'SCRIPT' | 'PERFORMANCE'>('SCRIPT');

    // Context & Config
    const [activeProgram, setActiveProgram] = useState<'TACKLE' | 'FLAG'>('TACKLE');
    const [quickBlocks, setQuickBlocks] = useState(QUICK_BLOCKS_TACKLE);

    // Form State
    const [newTitle, setNewTitle] = useState('');
    const [newFocus, setNewFocus] = useState('');
    const [newDate, setNewDate] = useState('');
    const [newCategory, setNewCategory] = useState<PracticeCategory>('TACTICAL');
    const [newDuration, setNewDuration] = useState(120); 
    const [newDeadlineHours, setNewDeadlineHours] = useState(2);

    // Script Management State
    const [generatedScript, setGeneratedScript] = useState<PracticeScriptItem[]>([]);
    const [isGeneratingScript, setIsGeneratingScript] = useState(false);
    
    // Timer State
    const [isTimerFullScreen, setIsTimerFullScreen] = useState(false);
    const [isTimerRunning, setIsTimerRunning] = useState(false);
    const [timerSeconds, setTimerSeconds] = useState(0);
    const [activeScriptItemId, setActiveScriptItemId] = useState<string | null>(null);

    // CHAMADA DIGITAL STATE
    const [isRollCallOpen, setIsRollCallOpen] = useState(false);
    const [rollCallPractice, setRollCallPractice] = useState<PracticeSession | null>(null);

    const isPlayer = currentRole === 'PLAYER';
    const canEdit = !isPlayer; 

    useEffect(() => {
        setPractices(storageService.getPracticeSessions());
        setPlayers(storageService.getPlayers());
        
        // Detect Program Context
        const prog = storageService.getActiveProgram();
        setActiveProgram(prog === 'BOTH' ? 'TACKLE' : prog);
        setQuickBlocks(prog === 'FLAG' ? QUICK_BLOCKS_FLAG : QUICK_BLOCKS_TACKLE);
        setNewDuration(prog === 'FLAG' ? 90 : 120); 
    }, []);

    useEffect(() => {
        let interval: any;
        if (isTimerRunning && timerSeconds > 0) {
            interval = setInterval(() => setTimerSeconds(prev => prev - 1), 1000);
        } else if (timerSeconds === 0) {
            setIsTimerRunning(false);
        }
        return () => clearInterval(interval);
    }, [isTimerRunning, timerSeconds]);

    const handleCreatePractice = (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!newTitle || !newDate) {
            toast.error("Preencha título e data.");
            return;
        }

        const practiceDate = new Date(newDate);
        const deadline = new Date(practiceDate);
        deadline.setHours(deadline.getHours() - newDeadlineHours);

        const practice: PracticeSession = {
            id: `prat-${Date.now()}`,
            title: newTitle,
            focus: newFocus,
            date: practiceDate,
            deadlineDate: deadline, 
            category: newCategory,
            locationType: 'FIELD',
            instructor: 'Coach',
            attendees: [],
            checkedInAttendees: [], // New list for real presence
            notes: `Programa: ${activeProgram}`,
            drills: [],
            script: generatedScript.length > 0 ? generatedScript : [], 
            performances: []
        };
        
        const currentPractices = storageService.getPracticeSessions();
        const updatedPractices = [practice, ...currentPractices];
        setPractices(updatedPractices);
        storageService.savePracticeSessions(updatedPractices);

        // Notificar jogadores
        const dateStr = practiceDate.toLocaleString('pt-BR', { weekday: 'long', day: '2-digit', month: '2-digit', hour: '2-digit', minute:'2-digit' });
        
        const notification: Announcement = {
            id: `notif-prat-${Date.now()}`,
            title: `📅 TREINO (${activeProgram}): ${newTitle.toUpperCase()}`,
            content: `Foco: ${newFocus}. Data: ${dateStr}. Confirmação até ${deadline.toLocaleTimeString()}.`,
            priority: 'HIGH',
            date: new Date(),
            authorRole: 'HEAD_COACH',
            readBy: []
        };
        
        const currentAnnouncements = storageService.getAnnouncements();
        storageService.saveAnnouncements([notification, ...currentAnnouncements]);

        setIsCreating(false);
        setGeneratedScript([]); 
        setNewTitle('');
        setNewFocus('');
        setNewDate('');
        
        toast.success("Treino agendado e prazo definido!");
    };

    // --- ROLL CALL LOGIC (CHAMADA DIGITAL) ---
    const openRollCall = (practice: PracticeSession) => {
        setRollCallPractice(practice);
        setIsRollCallOpen(true);
    };

    const handleCheckIn = (playerId: string) => {
        if (!rollCallPractice) return;
        
        // 1. Atualiza no Storage (Lógica centralizada)
        storageService.confirmPracticePresence(rollCallPractice.id, playerId);
        
        // 2. Atualiza Local State para feedback imediato
        setRollCallPractice(prev => {
            if (!prev) return null;
            const currentCheckedIn = prev.checkedInAttendees || [];
            return {
                ...prev,
                checkedInAttendees: [...currentCheckedIn, playerId]
            };
        });
        
        // Atualiza a lista principal para refletir mudança se fechar modal
        const updatedPractices = practices.map(p => {
            if (p.id === rollCallPractice.id) {
                const currentCheckedIn = p.checkedInAttendees || [];
                return { ...p, checkedInAttendees: [...currentCheckedIn, playerId] };
            }
            return p;
        });
        setPractices(updatedPractices);

        toast.success("Presença confirmada! +50 XP");
    };

    // --- UTILS ---
    const generateWhatsAppInvite = (p: PracticeSession) => {
        const deadlineStr = p.deadlineDate ? new Date(p.deadlineDate).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}) : 'Indefinido';
        const msg = `🏈 *CONVOCAÇÃO DE TREINO - ${p.title.toUpperCase()}*\n` +
                    `📅 *Data:* ${new Date(p.date).toLocaleString([], {weekday:'short', day:'2-digit', month:'2-digit', hour:'2-digit', minute:'2-digit'})}\n` +
                    `🎯 *Foco:* ${p.focus}\n` +
                    `⚠️ *Prazo de Confirmação:* ${deadlineStr}\n\n` +
                    `👉 *Confirme no App:* ${window.location.origin}/#/schedule`;
        
        const url = `https://wa.me/?text=${encodeURIComponent(msg)}`;
        window.open(url, '_blank');
    };

    const addTime = (timeStr: string, minutes: number): string => {
        if (!timeStr) return '19:00';
        const [h, m] = timeStr.split(':').map(Number);
        const date = new Date();
        date.setHours(h || 0, (m || 0) + minutes);
        return date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    };

    const handleAddQuickBlock = (block: any) => {
        let startTime = '19:00';
        if (generatedScript.length > 0) {
            const lastItem = generatedScript[generatedScript.length - 1];
            startTime = addTime(lastItem.startTime, lastItem.durationMinutes);
        }
        const newItem: PracticeScriptItem = {
            id: `blk-${Date.now()}-${Math.random()}`,
            startTime: startTime,
            durationMinutes: block.duration,
            type: block.type,
            activityName: block.name,
            description: block.desc
        };
        setGeneratedScript([...generatedScript, newItem]);
    };

    const handleRemoveBlock = (id: string) => {
        const updated = generatedScript.filter(i => i.id !== id);
        setGeneratedScript(updated);
    };

    const handleAiGenerateScript = async () => {
        if (!newFocus) {
            toast.warning("Defina um foco principal primeiro.");
            return;
        }
        setIsGeneratingScript(true);
        toast.info(`🤖 IA Criando roteiro para ${activeProgram}...`);
        
        try {
            const context = activeProgram === 'FLAG' ? 'Flag Football 5v5' : 'American Football 11v11 Tackle';
            const promptContext = `${newFocus} (${context})`;
            
            const script = await generatePracticeScript(promptContext, newDuration, "High Intensity");
            if (script && script.length > 0) {
                setGeneratedScript(script);
                toast.success(`Roteiro gerado com sucesso!`);
            } else {
                toast.error("IA falhou. Tente simplificar o foco.");
            }
        } catch (e) {
            toast.error("Erro de conexão com IA.");
        } finally {
            setIsGeneratingScript(false);
        }
    };

    const startDrillTimer = (item: PracticeScriptItem) => {
        setActiveScriptItemId(item.id);
        setTimerSeconds(item.durationMinutes * 60);
        setIsTimerRunning(true);
        setIsTimerFullScreen(true);
    };

    const formatTime = (totalSeconds: number) => {
        const m = Math.floor(totalSeconds / 60);
        const s = totalSeconds % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    return (
        <div className="space-y-6 pb-12 animate-fade-in relative">
             <div className="flex flex-col md:flex-row justify-between items-center gap-4 no-print">
                <div>
                    <h2 className="text-3xl font-bold text-text-primary">Gestão de Treinos <span className="text-sm font-normal text-text-secondary">({activeProgram})</span></h2>
                    <p className="text-text-secondary">Planeje scripts minuto-a-minuto com IA ou Manualmente.</p>
                </div>
                {canEdit && (
                    <Button onClick={() => setIsCreating(!isCreating)} variant="primary">
                        {isCreating ? 'Cancelar' : '+ Novo Treino'}
                    </Button>
                )}
            </div>

            {isCreating && canEdit && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <Card className="animate-slide-in no-print border border-highlight/20 relative overflow-hidden">
                             {/* AI Badge */}
                             <div className="bg-gradient-to-r from-purple-900/40 to-indigo-900/40 p-4 rounded-xl border border-purple-500/30 mb-6 flex flex-col md:flex-row gap-4 items-center">
                                <div className="flex-1">
                                    <h4 className="font-bold text-white flex items-center gap-2 mb-1">
                                        <SparklesIcon className="w-5 h-5 text-purple-400" /> 
                                        Coach Copilot (IA)
                                    </h4>
                                    <p className="text-xs text-text-secondary">
                                        IA ajustada para contexto: <strong>{activeProgram}</strong>.
                                    </p>
                                </div>
                                <button 
                                    type="button" 
                                    onClick={handleAiGenerateScript}
                                    disabled={isGeneratingScript || !newFocus}
                                    className="bg-purple-600 hover:bg-purple-500 text-white px-6 py-3 rounded-xl font-bold shadow-lg flex items-center justify-center gap-2 transition-transform active:scale-95 disabled:opacity-50 min-w-[200px]"
                                >
                                    {isGeneratingScript ? 'Criando...' : 'Gerar Roteiro'}
                                </button>
                             </div>

                             <form onSubmit={handleCreatePractice} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Input label="Título" value={newTitle} onChange={e => setNewTitle(e.target.value)} required placeholder="Ex: Preparação Playoffs" />
                                    <Input label="Data e Hora" type="datetime-local" value={newDate} onChange={e => setNewDate(e.target.value)} required />
                                </div>
                                
                                {/* DEADLINE CONFIGURATION */}
                                <div className="p-3 bg-yellow-900/20 border border-yellow-500/20 rounded-lg">
                                    <label className="text-xs font-bold text-yellow-500 uppercase block mb-2 flex items-center gap-2">
                                        <AlertCircleIcon className="w-4 h-4" /> Configuração de RSVP (Prazo)
                                    </label>
                                    <div className="flex items-center gap-4">
                                        <span className="text-sm text-text-secondary">Fechar confirmações</span>
                                        <input 
                                            type="number" 
                                            min="1" max="48" 
                                            value={newDeadlineHours} 
                                            onChange={e => setNewDeadlineHours(Number(e.target.value))}
                                            className="w-16 bg-black/40 border border-white/20 rounded p-1 text-center text-white" 
                                        />
                                        <span className="text-sm text-text-secondary">horas antes do treino.</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div>
                                        <label className="text-xs font-bold text-text-secondary uppercase block mb-1.5 ml-1">Categoria</label>
                                        <select className="w-full bg-secondary/50 border border-white/10 rounded-lg p-3 text-white focus:border-highlight focus:outline-none" value={newCategory} onChange={e => setNewCategory(e.target.value as any)}>
                                            <option value="TACTICAL">Tático</option>
                                            <option value="PHYSICAL">Físico</option>
                                            <option value="MENTAL">Mental</option>
                                        </select>
                                    </div>
                                    <div className="md:col-span-2">
                                        <Input label="Foco Principal (Para IA)" value={newFocus} onChange={e => setNewFocus(e.target.value)} required placeholder={activeProgram === 'FLAG' ? "Ex: Pulling flags e Rotas Curtas" : "Ex: Defesa contra corrida"} />
                                    </div>
                                </div>
                                
                                <div className="bg-black/20 p-4 rounded-xl border border-white/10">
                                    <div className="flex justify-between items-center mb-3">
                                        <h4 className="font-bold text-white flex items-center gap-2">
                                            <ClockIcon className="w-4 h-4 text-highlight"/> Roteiro (Script)
                                        </h4>
                                        <div className="flex items-center gap-2">
                                            <label className="text-xs text-text-secondary">Minutos:</label>
                                            <input type="number" className="w-16 bg-black/40 border border-white/10 rounded p-1 text-center text-white text-xs" value={newDuration} onChange={e => setNewDuration(Number(e.target.value))} />
                                        </div>
                                    </div>

                                    {generatedScript.length > 0 ? (
                                        <div className="space-y-2 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                                            {generatedScript.map((item, idx) => (
                                                <div key={idx} className="flex gap-3 bg-secondary/50 p-2 rounded text-xs border border-white/5 items-center group">
                                                    <span className="font-mono text-highlight font-bold w-12">{item.startTime}</span>
                                                    <span className="bg-white/10 px-2 rounded font-bold text-white w-20 text-center flex items-center justify-center">{item.type}</span>
                                                    <div className="flex-1 text-white font-bold">{item.activityName}</div>
                                                    <span className="font-bold text-white">{item.durationMinutes}m</span>
                                                    <button type="button" onClick={() => handleRemoveBlock(item.id)} className="text-text-secondary hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <TrashIcon className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            ))}
                                            <button type="button" onClick={() => setGeneratedScript([])} className="text-xs text-red-400 hover:text-white underline w-full text-center mt-2">Limpar Roteiro</button>
                                        </div>
                                    ) : (
                                        <div className="text-center py-8 border-2 border-dashed border-white/10 rounded-lg">
                                            <p className="text-text-secondary text-sm">Adicione blocos ou use a IA.</p>
                                        </div>
                                    )}
                                </div>

                                <div className="flex justify-end pt-2">
                                     <Button type="submit">Confirmar Agendamento</Button>
                                </div>
                            </form>
                        </Card>
                    </div>

                    <div className="lg:col-span-1 space-y-4">
                        <div className="bg-secondary p-4 rounded-xl border border-white/5">
                            <h4 className="font-bold text-white mb-4 flex items-center gap-2">
                                <PenIcon className="w-4 h-4 text-blue-400" /> Blocos Rápidos ({activeProgram})
                            </h4>
                            <div className="grid grid-cols-1 gap-2">
                                {quickBlocks.map((block, idx) => (
                                    <button 
                                        key={idx}
                                        onClick={() => handleAddQuickBlock(block)}
                                        className="p-3 rounded-lg border bg-black/20 hover:bg-white/5 transition-all text-left flex items-center justify-between group border-white/10"
                                    >
                                        <div>
                                            <p className="font-bold text-xs text-white">{block.name}</p>
                                            <p className="text-[10px] text-text-secondary">{block.duration} min</p>
                                        </div>
                                        <span className="text-white opacity-0 group-hover:opacity-100">+</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 space-y-4 no-print">
                    <h3 className="font-bold text-white px-2">Próximos Treinos</h3>
                    {practices.length === 0 && <p className="text-text-secondary px-2 italic">Nenhum treino agendado.</p>}
                    {practices.map(practice => {
                         const confirmedCount = practice.attendees?.length || 0;
                         const checkedInCount = practice.checkedInAttendees?.length || 0;
                         const isPast = new Date() > new Date(practice.date);
                         
                         return (
                            <div key={practice.id} onClick={() => setSelectedPractice(practice)} className={`p-4 rounded-xl border cursor-pointer hover:bg-white/5 transition-all ${selectedPractice?.id === practice.id ? 'bg-highlight/10 border-highlight' : 'bg-secondary border-white/5'}`}>
                                <div className="flex justify-between items-start">
                                    <h4 className="font-bold text-white">{practice.title}</h4>
                                    {/* Action Button for Coach */}
                                    {canEdit && (
                                        <button 
                                            onClick={(e) => { e.stopPropagation(); openRollCall(practice); }} 
                                            className="text-[10px] bg-blue-600 hover:bg-blue-500 text-white px-2 py-1 rounded font-bold flex items-center gap-1 shadow-lg"
                                        >
                                            <UsersIcon className="w-3 h-3" /> Chamada
                                        </button>
                                    )}
                                </div>
                                <p className="text-xs text-text-secondary mt-1">{new Date(practice.date).toLocaleDateString()} • {new Date(practice.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                                <p className="text-xs text-highlight mt-1 font-bold">{practice.focus}</p>
                                
                                <div className="flex gap-4 mt-2 pt-2 border-t border-white/10 text-[10px] text-text-secondary">
                                    <span>RSVP: <strong className="text-white">{confirmedCount}</strong></span>
                                    {checkedInCount > 0 && <span>Presentes: <strong className="text-green-400">{checkedInCount}</strong></span>}
                                </div>
                                
                                {canEdit && !isPast && (
                                    <div className="mt-3 flex justify-end">
                                        <button onClick={(e) => { e.stopPropagation(); generateWhatsAppInvite(practice); }} className="text-xs bg-green-600/20 text-green-400 hover:bg-green-600 hover:text-white px-3 py-1.5 rounded-lg flex items-center gap-1 transition-colors font-bold">
                                            <ShareIcon className="w-3 h-3" /> WhatsApp Invite
                                        </button>
                                    </div>
                                )}
                            </div>
                         );
                    })}
                </div>

                <div className="lg:col-span-2">
                    {selectedPractice ? (
                        <Card title={selectedPractice.title} className="print-safe">
                             <div className="flex gap-4 mb-6 border-b border-white/10 pb-4 no-print overflow-x-auto">
                                <button onClick={() => setActiveMode('SCRIPT')} className={`text-sm font-bold pb-1 border-b-2 ${activeMode === 'SCRIPT' ? 'border-highlight text-highlight' : 'border-transparent text-text-secondary'}`}>Roteiro</button>
                                <button onClick={() => setActiveMode('PERFORMANCE')} className={`text-sm font-bold pb-1 border-b-2 ${activeMode === 'PERFORMANCE' ? 'border-highlight text-highlight' : 'border-transparent text-text-secondary'}`}>Avaliação</button>
                            </div>

                            {activeMode === 'SCRIPT' && (
                                <div className="space-y-6">
                                    <div className="space-y-3">
                                        {selectedPractice.script && selectedPractice.script.length > 0 ? (
                                            selectedPractice.script.map((item, idx) => (
                                                <div key={idx} className={`bg-secondary p-4 rounded-lg border border-white/5 flex justify-between items-center group hover:border-white/20 transition-all ${activeScriptItemId === item.id ? 'border-highlight bg-highlight/5' : ''}`}>
                                                    <div className="flex items-center gap-4">
                                                        <span className="text-highlight font-mono font-bold text-lg">{item.startTime}</span>
                                                        <div className="flex flex-col">
                                                            <div className="flex items-center gap-2">
                                                                <span className="bg-white/10 text-[10px] px-2 rounded uppercase font-bold text-text-secondary">{item.type}</span>
                                                                <span className="font-bold text-white">{item.activityName}</span>
                                                            </div>
                                                            <span className="text-xs text-text-secondary line-clamp-1">{item.description}</span>
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-4">
                                                        <span className="text-xs font-bold text-white bg-black/30 px-2 py-1 rounded">{item.durationMinutes} min</span>
                                                        {canEdit && (
                                                            <button onClick={() => startDrillTimer(item)} className="text-green-400 hover:text-white p-2 bg-white/5 rounded-full hover:bg-green-600 transition-colors" title="Iniciar Timer">
                                                                <PlayCircleIcon className="w-6 h-6" />
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="text-center py-8 text-text-secondary italic">Este treino não possui roteiro detalhado.</div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </Card>
                    ) : <div className="text-center p-12 text-text-secondary italic bg-secondary/20 rounded-xl">Selecione um treino para visualizar os detalhes.</div>}
                </div>
            </div>
            
            {/* TIMER OVERLAY */}
            {isTimerFullScreen && (
                <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center animate-fade-in">
                    <button onClick={() => setIsTimerFullScreen(false)} className="absolute top-6 right-6 text-white/50 hover:text-white">Fechar</button>
                    <p className="text-text-secondary uppercase tracking-widest text-sm mb-4">Drill em Andamento</p>
                    <div className={`font-mono font-black text-[150px] leading-none tabular-nums ${timerSeconds < 60 ? 'text-red-500 animate-pulse' : 'text-white'}`}>
                        {formatTime(timerSeconds)}
                    </div>
                    <div className="flex gap-8 mt-12">
                        <Button onClick={() => setIsTimerRunning(!isTimerRunning)} size="lg" variant={isTimerRunning ? 'secondary' : 'primary'} className="min-w-[150px]">
                            {isTimerRunning ? 'PAUSAR' : 'RETOMAR'}
                        </Button>
                        <Button onClick={() => setTimerSeconds(0)} size="lg" variant="danger" className="min-w-[150px]">ENCERRAR</Button>
                    </div>
                </div>
            )}

            {/* CHAMADA DIGITAL MODAL */}
            <Modal isOpen={isRollCallOpen} onClose={() => setIsRollCallOpen(false)} title="Chamada Digital (Roll Call)">
                <div className="space-y-4">
                    <div className="bg-blue-900/20 p-4 rounded-lg border border-blue-500/20 mb-4">
                        <h4 className="text-white font-bold text-sm">Lista de Confirmados (RSVP)</h4>
                        <p className="text-xs text-blue-200">
                            Clique no botão para confirmar presença e dar XP. Apenas atletas que confirmaram no app aparecem aqui.
                        </p>
                    </div>
                    
                    <div className="max-h-[400px] overflow-y-auto custom-scrollbar space-y-2">
                        {rollCallPractice?.attendees?.length === 0 && (
                            <p className="text-center text-text-secondary italic py-8">Ninguém confirmou presença para este treino.</p>
                        )}
                        
                        {rollCallPractice?.attendees?.map(playerId => {
                            const player = players.find(p => p.id === Number(playerId));
                            if (!player) return null;
                            const isCheckedIn = (rollCallPractice.checkedInAttendees || []).includes(String(playerId));
                            
                            return (
                                <div key={playerId} className={`flex items-center justify-between p-3 rounded-lg border ${isCheckedIn ? 'bg-green-900/20 border-green-500/50' : 'bg-secondary border-white/5'}`}>
                                    <div className="flex items-center gap-3">
                                        <LazyImage src={player.avatarUrl} className="w-10 h-10 rounded-full" />
                                        <div>
                                            <p className="font-bold text-white text-sm">{player.name}</p>
                                            <p className="text-xs text-text-secondary">{player.position}</p>
                                        </div>
                                    </div>
                                    
                                    <button 
                                        onClick={() => !isCheckedIn && handleCheckIn(String(playerId))}
                                        disabled={isCheckedIn}
                                        className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-all ${isCheckedIn ? 'bg-green-600 text-white cursor-default' : 'bg-white/10 hover:bg-green-600 hover:text-white text-text-secondary'}`}
                                    >
                                        {isCheckedIn ? <><CheckCircleIcon className="w-4 h-4" /> Presente (+50 XP)</> : 'Check-in'}
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                    
                    <div className="pt-4 border-t border-white/10 flex justify-end">
                        <button onClick={() => setIsRollCallOpen(false)} className="text-text-secondary hover:text-white text-sm">Fechar</button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};
export default PracticePlan;