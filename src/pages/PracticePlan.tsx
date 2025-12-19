
import React, { useState, useEffect, useContext } from 'react';
import Card from '../components/Card';
import { Player, PracticeSession, PracticeCategory, PracticeScriptItem, Drill, ProgramType } from '../types';
import { storageService } from '../services/storageService';
// Fix: Importing generatePracticeScript which was missing previously
import { generatePracticeScript } from '../services/geminiService';
import { SparklesIcon, PlayCircleIcon, ClockIcon, TrashIcon, PenIcon, UsersIcon, CheckCircleIcon, ClipboardIcon } from '../components/icons/UiIcons';
import { UserContext } from '../components/Layout';
import Button from '../components/Button'; 
import Input from '../components/Input';
import { useToast } from '../contexts/ToastContext';
import QuickEvaluationModal from '../components/QuickEvaluationModal';
import DrillCard from '../components/DrillCard';
import CheckInModal from '../components/CheckInModal';

// PRESETS TACKLE
const QUICK_BLOCKS_TACKLE = [
    { type: 'WARMUP', name: 'Warmup / Dynamic', duration: 15, desc: 'Mobilidade e Ativação.' },
    { type: 'INDY', name: 'Indy (Posição)', duration: 20, desc: 'Drills de técnica individual.' },
    { type: 'GROUP', name: 'Inside Run (9on7)', duration: 15, desc: 'Bloqueios e Corrida.' },
    { type: 'GROUP', name: 'Skelly (7on7)', duration: 20, desc: 'Passe vs Cobertura.' },
    { type: 'TEAM', name: 'Team (11on11)', duration: 30, desc: 'Situações de jogo.' },
    { type: 'SPECIAL', name: 'Punt / Kickoff', duration: 10, desc: 'Special Teams.' },
];

// PRESETS FLAG
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
    const [drillLibrary, setDrillLibrary] = useState<Drill[]>([]);
    
    const [isCreating, setIsCreating] = useState(false);
    const [selectedPractice, setSelectedPractice] = useState<PracticeSession | null>(null);
    const [activeMode, setActiveMode] = useState<'SCRIPT' | 'EVALUATION' | 'LIBRARY'>('SCRIPT');

    // Context & Config
    const [activeProgram, setActiveProgram] = useState<ProgramType>('TACKLE');
    const [quickBlocks, setQuickBlocks] = useState(QUICK_BLOCKS_TACKLE);

    // Form State
    const [newTitle, setNewTitle] = useState('');
    const [newFocus, setNewFocus] = useState('');
    const [newDate, setNewDate] = useState('');
    const [newCategory, setNewCategory] = useState<PracticeCategory>('TACTICAL');
    const [newDuration, setNewDuration] = useState(120); 

    // Script Management State
    const [generatedScript, setGeneratedScript] = useState<PracticeScriptItem[]>([]);
    const [isGeneratingScript, setIsGeneratingScript] = useState(false);
    
    // Timer State
    const [isTimerFullScreen, setIsTimerFullScreen] = useState(false);
    const [isTimerRunning, setIsTimerRunning] = useState(false);
    const [timerSeconds, setTimerSeconds] = useState(0);
    const [activeScriptItemId, setActiveScriptItemId] = useState<string | null>(null);

    // EVALUATION & CHECK-IN STATE
    const [isCheckInModalOpen, setIsCheckInModalOpen] = useState(false);
    const [isEvalModalOpen, setIsEvalModalOpen] = useState(false);
    const [evalPlayer, setEvalPlayer] = useState<Player | null>(null);
    const [unitFilter, setUnitFilter] = useState<'OFFENSE' | 'DEFENSE'>('OFFENSE');

    const isPlayer = currentRole === 'PLAYER';
    const canEdit = !isPlayer; 

    useEffect(() => {
        setPractices(storageService.getPracticeSessions());
        setPlayers(storageService.getPlayers());
        setDrillLibrary(storageService.getDrillLibrary());

        const prog = storageService.getActiveProgram();
        setActiveProgram(prog);
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
        const practice: PracticeSession = {
            id: Date.now().toString(),
            title: newTitle,
            focus: newFocus,
            date: new Date(newDate),
            category: newCategory,
            locationType: 'FIELD',
            instructor: '',
            attendees: [],
            checkedInAttendees: [], 
            notes: '',
            drills: [],
            script: generatedScript.length > 0 ? generatedScript : [], 
            performances: []
        };
        const updated = [practice, ...practices];
        setPractices(updated);
        storageService.savePracticeSessions(updated);
        setIsCreating(false);
        setGeneratedScript([]); 
        toast.success("Treino agendado com sucesso!");
    };

    // --- SCRIPT LOGIC ---
    const addTime = (timeStr: string, minutes: number): string => {
        const [h, m] = timeStr.split(':').map(Number);
        const date = new Date();
        date.setHours(h, m + minutes);
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

    const handleAddDrillFromLibrary = (drill: Drill) => {
        let startTime = '19:00'; 
        if (generatedScript.length > 0) {
            const lastItem = generatedScript[generatedScript.length - 1];
            startTime = addTime(lastItem.startTime, lastItem.durationMinutes);
        }
        const newItem: PracticeScriptItem = {
            id: `blk-lib-${Date.now()}`,
            startTime: startTime,
            durationMinutes: drill.durationMinutes,
            type: 'INDY', 
            activityName: drill.name,
            description: drill.description || ''
        };
        setGeneratedScript([...generatedScript, newItem]);
        toast.success(`Drill "${drill.name}" adicionado ao script.`);
    };

    // --- AI WIZARD ---
    const handleAiGenerateScript = async () => {
        if (!newFocus) {
            toast.warning("Defina um foco principal primeiro.");
            return;
        }
        setIsGeneratingScript(true);
        try {
            const script = await generatePracticeScript(newFocus, newDuration, "High Intensity");
            if (script && script.length > 0) {
                setGeneratedScript(script);
                toast.success(`✅ Roteiro gerado com sucesso!`);
            } else {
                toast.error("IA não retornou um roteiro válido.");
            }
        } catch (e) {
            toast.error("Erro ao comunicar com a IA.");
        } finally {
            setIsGeneratingScript(false);
        }
    };

    // --- CHECK-IN LOGIC ---
    const handleCheckInSave = (checkedInIds: string[]) => {
        if (!selectedPractice) return;
        
        const updatedSession = { ...selectedPractice, checkedInAttendees: checkedInIds };
        setSelectedPractice(updatedSession);
        storageService.savePracticeCheckIn(String(updatedSession.id), checkedInIds);
        
        setPractices(prev => prev.map(p => p.id === updatedSession.id ? updatedSession : p));
        
        toast.success(`Check-in realizado! ${checkedInIds.length} atletas presentes.`);
    };

    // --- EVALUATION LOGIC ---
    const openEvaluation = (player: Player) => {
        setEvalPlayer(player);
        setIsEvalModalOpen(true);
    };

    const handleSaveEvaluation = (playerId: number, grade: number, notes: string, tags: string[]) => {
        toast.success(`Avaliação salva: Nota ${grade}`);
        storageService.addPlayerXP(playerId, grade > 70 ? 20 : 5, `Treino: ${notes}`);
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

    // Filter players for evaluation list based on CHECK-IN
    const playersToEvaluate = players.filter(p => {
        if (p.status !== 'ACTIVE') return false;
        
        const hasCheckIn = selectedPractice?.checkedInAttendees && selectedPractice.checkedInAttendees.length > 0;
        if (hasCheckIn) {
             if (!selectedPractice?.checkedInAttendees?.includes(String(p.id))) return false;
        } else {
             if (!selectedPractice?.attendees?.includes(String(p.id))) return false;
        }

        if (unitFilter === 'OFFENSE') return ['QB','RB','WR','TE','OL','LT','LG','C','RG','RT'].includes(p.position) || activeProgram === 'FLAG' && ['QB','WR','CENTER','ATH'].includes(p.position);
        if (unitFilter === 'DEFENSE') return ['DL','DE','DT','LB','CB','S','SS','FS'].includes(p.position) || activeProgram === 'FLAG' && ['RUSHER','LB','DB','S'].includes(p.position);
        return true;
    });

    const printAttendanceSheet = () => {
        window.print();
    };

    return (
        <div className="space-y-6 pb-12 animate-fade-in relative">
             <div className="flex flex-col md:flex-row justify-between items-center gap-4 no-print">
                <div>
                    <h2 className="text-3xl font-bold text-text-primary">Gestão de Treinos</h2>
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
                        <Card className="animate-slide-in no-print border border-highlight/20">
                             <form onSubmit={handleCreatePractice} className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Input label="Título" value={newTitle} onChange={e => setNewTitle(e.target.value)} required placeholder="Ex: Preparação Playoffs" />
                                    <Input label="Data" type="datetime-local" value={newDate} onChange={e => setNewDate(e.target.value)} required />
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
                                        <Input label="Foco Principal" value={newFocus} onChange={e => setNewFocus(e.target.value)} required placeholder="Ex: Instalação de Blitz..." />
                                    </div>
                                </div>
                                
                                <div className="bg-black/20 p-4 rounded-xl border border-white/10">
                                    <h4 className="font-bold text-white flex items-center gap-2 mb-3">
                                        <ClockIcon className="w-4 h-4 text-highlight"/> Roteiro (Script)
                                    </h4>
                                    
                                    {generatedScript.length > 0 ? (
                                        <div className="space-y-2 max-h-96 overflow-y-auto pr-2 custom-scrollbar">
                                            {generatedScript.map((item, idx) => (
                                                <div key={idx} className="flex gap-3 bg-secondary/50 p-2 rounded text-xs border border-white/5 items-center group">
                                                    <span className="font-mono text-highlight font-bold w-12">{item.startTime}</span>
                                                    <span className="bg-white/10 px-2 rounded font-bold text-white w-20 text-center truncate">{item.type}</span>
                                                    <div className="flex-1">
                                                        <span className="font-bold text-white block">{item.activityName}</span>
                                                        <span className="text-text-secondary">{item.description}</span>
                                                    </div>
                                                    <span className="font-bold text-white">{item.durationMinutes}m</span>
                                                    <button type="button" onClick={() => setGeneratedScript(generatedScript.filter((_, i) => i !== idx))} className="text-text-secondary hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <TrashIcon className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            ))}
                                            <button type="button" onClick={() => setGeneratedScript([])} className="text-xs text-red-400 hover:text-white underline w-full text-center mt-2">Limpar Roteiro</button>
                                        </div>
                                    ) : (
                                        <div className="text-center py-8 border-2 border-dashed border-white/10 rounded-lg">
                                            <p className="text-text-secondary text-sm">Adicione blocos da biblioteca ou use a IA.</p>
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
                        <div className="flex border-b border-white/10">
                            <button onClick={() => setActiveMode('SCRIPT')} className={`flex-1 py-2 text-xs font-bold ${activeMode === 'SCRIPT' ? 'text-highlight border-b-2 border-highlight' : 'text-text-secondary'}`}>Rápido</button>
                            <button onClick={() => setActiveMode('LIBRARY')} className={`flex-1 py-2 text-xs font-bold ${activeMode === 'LIBRARY' ? 'text-highlight border-b-2 border-highlight' : 'text-text-secondary'}`}>Biblioteca</button>
                        </div>

                        {activeMode === 'SCRIPT' && (
                            <div className="space-y-2">
                                {quickBlocks.map((block, idx) => (
                                    <button 
                                        key={idx}
                                        onClick={() => handleAddQuickBlock(block)}
                                        className="w-full p-3 rounded-lg border border-white/10 bg-black/20 hover:bg-white/5 transition-all text-left flex items-center justify-between group"
                                    >
                                        <div>
                                            <p className="font-bold text-xs text-white">{block.name}</p>
                                            <p className="text-[10px] text-text-secondary">{block.duration} min</p>
                                        </div>
                                        <span className="text-white opacity-0 group-hover:opacity-100">+</span>
                                    </button>
                                ))}
                                <div className="bg-gradient-to-br from-purple-900/30 to-secondary p-4 rounded-xl border border-purple-500/30 mt-4">
                                    <button 
                                        type="button" 
                                        onClick={handleAiGenerateScript}
                                        disabled={isGeneratingScript || !newFocus}
                                        className="w-full bg-purple-600 hover:bg-purple-500 text-white py-2 rounded-lg font-bold shadow-lg flex items-center justify-center gap-2 transition-transform active:scale-95 disabled:opacity-50"
                                    >
                                        {isGeneratingScript ? <><span className="animate-spin">⚙️</span> Gerando...</> : <><SparklesIcon className="w-4 h-4"/> Gerar com IA</>}
                                    </button>
                                </div>
                            </div>
                        )}

                        {activeMode === 'LIBRARY' && (
                            <div className="space-y-2 max-h-[500px] overflow-y-auto custom-scrollbar">
                                {drillLibrary.length === 0 && <p className="text-text-secondary text-xs text-center py-4">Nenhum drill salvo.</p>}
                                {drillLibrary.map(drill => (
                                    <div key={drill.id} onClick={() => handleAddDrillFromLibrary(drill)} className="cursor-pointer">
                                        <DrillCard drill={drill} />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 space-y-4 no-print">
                    {practices.map(practice => (
                        <div key={practice.id} onClick={() => setSelectedPractice(practice)} className={`p-4 rounded-xl border cursor-pointer hover:bg-white/5 transition-all ${selectedPractice?.id === practice.id ? 'bg-highlight/10 border-highlight' : 'bg-secondary border-white/5'}`}>
                            <div className="flex justify-between items-start">
                                <h4 className="font-bold text-white">{practice.title}</h4>
                                <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded text-text-secondary">{practice.script?.length || 0} items</span>
                            </div>
                            <p className="text-xs text-text-secondary mt-1">{new Date(practice.date).toLocaleDateString()} • {practice.focus}</p>
                            {practice.checkedInAttendees && practice.checkedInAttendees.length > 0 && (
                                <div className="mt-2 flex items-center gap-1 text-[10px] text-green-400">
                                    <CheckCircleIcon className="w-3 h-3" /> Check-in Realizado ({practice.checkedInAttendees.length})
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                <div className="lg:col-span-2">
                    {selectedPractice ? (
                        <Card title={selectedPractice.title} className="print-safe h-full">
                             <div className="flex flex-wrap gap-4 mb-6 border-b border-white/10 pb-4 no-print overflow-x-auto">
                                <button onClick={() => setActiveMode('SCRIPT')} className={`text-sm font-bold pb-1 border-b-2 ${activeMode === 'SCRIPT' ? 'border-highlight text-highlight' : 'border-transparent text-text-secondary'}`}>Roteiro</button>
                                <button onClick={() => setActiveMode('EVALUATION')} className={`text-sm font-bold pb-1 border-b-2 ${activeMode === 'EVALUATION' ? 'border-highlight text-highlight' : 'border-transparent text-text-secondary'}`}>Avaliação de Campo</button>
                                
                                {canEdit && (
                                    <div className="ml-auto flex gap-2">
                                        <button 
                                            onClick={() => setIsCheckInModalOpen(true)}
                                            className="px-3 py-1 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-bold text-white flex items-center gap-2 border border-white/10"
                                        >
                                            <ClipboardIcon className="w-4 h-4" /> Chamada / Check-in
                                        </button>
                                        <button 
                                            onClick={printAttendanceSheet}
                                            className="px-3 py-1 bg-white/10 hover:bg-white/20 rounded-lg text-xs font-bold text-white flex items-center gap-2 border border-white/10"
                                        >
                                            Imprimir Lista
                                        </button>
                                    </div>
                                )}
                            </div>

                            {activeMode === 'SCRIPT' && (
                                <div className="space-y-3">
                                    {selectedPractice.script?.map((item, idx) => (
                                        <div key={idx} className={`bg-secondary p-4 rounded-lg border border-white/5 flex justify-between items-center group hover:border-white/20 transition-all ${activeScriptItemId === item.id ? 'border-highlight bg-highlight/5' : ''}`}>
                                            <div className="flex items-center gap-4">
                                                <span className="text-highlight font-mono font-bold text-lg">{item.startTime}</span>
                                                <div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="bg-white/10 text-[10px] px-2 rounded uppercase font-bold text-text-secondary">{item.type}</span>
                                                        <span className="font-bold text-white">{item.activityName}</span>
                                                    </div>
                                                    <span className="text-xs text-text-secondary line-clamp-1">{item.description}</span>
                                                </div>
                                            </div>
                                            {canEdit && (
                                                <button onClick={() => startDrillTimer(item)} className="text-green-400 hover:text-white p-2 bg-white/5 rounded-full hover:bg-green-600 transition-colors">
                                                    <PlayCircleIcon className="w-6 h-6" />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}

                            {activeMode === 'EVALUATION' && (
                                <div className="space-y-4">
                                    <div className="flex justify-between items-center bg-black/20 p-2 rounded-lg border border-white/5">
                                        <div className="flex gap-2">
                                            <button onClick={() => setUnitFilter('OFFENSE')} className={`px-4 py-1 text-xs font-bold rounded ${unitFilter === 'OFFENSE' ? 'bg-white text-black' : 'text-text-secondary'}`}>Ataque</button>
                                            <button onClick={() => setUnitFilter('DEFENSE')} className={`px-4 py-1 text-xs font-bold rounded ${unitFilter === 'DEFENSE' ? 'bg-white text-black' : 'text-text-secondary'}`}>Defesa</button>
                                        </div>
                                        <div className="text-xs text-text-secondary italic px-2">
                                            {selectedPractice.checkedInAttendees?.length 
                                                ? `Mostrando ${playersToEvaluate.length} presentes.` 
                                                : "Mostrando RSVP (Check-in pendente)."}
                                        </div>
                                    </div>
                                    
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                        {playersToEvaluate.map(player => (
                                            <div 
                                                key={player.id} 
                                                onClick={() => openEvaluation(player)}
                                                className="bg-secondary border border-white/5 p-3 rounded-xl flex items-center gap-3 cursor-pointer hover:bg-white/5 hover:border-highlight/50 transition-all"
                                            >
                                                <div className="w-10 h-10 rounded-full bg-black/40 overflow-hidden">
                                                    <img src={player.avatarUrl} className="w-full h-full object-cover" />
                                                </div>
                                                <div>
                                                    <p className="font-bold text-white text-sm">{player.name}</p>
                                                    <p className="text-[10px] text-text-secondary">{player.position} #{player.jerseyNumber}</p>
                                                </div>
                                            </div>
                                        ))}
                                        {playersToEvaluate.length === 0 && (
                                            <div className="col-span-full text-center py-8 text-text-secondary italic">
                                                Nenhum atleta encontrado.
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </Card>
                    ) : (
                        <div className="text-center p-12 text-text-secondary italic bg-secondary/20 rounded-xl">Selecione um treino para visualizar.</div>
                    )}
                </div>
            </div>
            
            <QuickEvaluationModal 
                isOpen={isEvalModalOpen}
                onClose={() => setIsEvalModalOpen(false)}
                player={evalPlayer}
                onSave={handleSaveEvaluation}
            />

            {selectedPractice && (
                <CheckInModal 
                    isOpen={isCheckInModalOpen}
                    onClose={() => setIsCheckInModalOpen(false)}
                    session={selectedPractice}
                    allPlayers={players}
                    onSave={handleCheckInSave}
                />
            )}

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
        </div>
    );
};
export default PracticePlan;