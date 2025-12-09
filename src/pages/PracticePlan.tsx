
import React, { useState, useEffect, useContext } from 'react';
import Card from '../components/Card';
import Modal from '../components/Modal';
import { Player, PracticeSession, PracticeCategory, Drill, DrillExecutionAnalysis, PracticeScriptItem } from '../types';
import { storageService } from '../services/storageService';
import { analyzeDrillExecution, generatePracticeScript } from '../services/geminiService';
import { PracticeIcon, VideoIcon } from '../components/icons/NavIcons';
import { SparklesIcon, TrashIcon, ClockIcon, PlayCircleIcon, PauseIcon, StopIcon, PrinterIcon, CheckCircleIcon } from '../components/icons/UiIcons';
import PrintLayout from '../components/PrintLayout';
import { UserContext } from '../components/Layout';
import Button from '../components/Button'; // ATOMIC
import Input from '../components/Input';   // ATOMIC
import { useToast } from '../contexts/ToastContext';

const PracticePlan: React.FC = () => {
    const { currentRole } = useContext(UserContext);
    const toast = useToast();
    const [practices, setPractices] = useState<PracticeSession[]>([]);
    const [players, setPlayers] = useState<Player[]>([]);
    const [isCreating, setIsCreating] = useState(false);
    const [selectedPractice, setSelectedPractice] = useState<PracticeSession | null>(null);
    const [activeMode, setActiveMode] = useState<'SCRIPT' | 'DRILLS' | 'ATTENDANCE' | 'PERFORMANCE'>('SCRIPT');

    // Form State
    const [newTitle, setNewTitle] = useState('');
    const [newFocus, setNewFocus] = useState('');
    const [newDate, setNewDate] = useState('');
    const [newCategory, setNewCategory] = useState<PracticeCategory>('TACTICAL');

    // Script Management State
    const [scriptItem, setScriptItem] = useState<Partial<PracticeScriptItem>>({ startTime: '19:00', durationMinutes: 10, type: 'WARMUP', activityName: '', description: '' });
    const [isTimerFullScreen, setIsTimerFullScreen] = useState(false);
    const [isTimerRunning, setIsTimerRunning] = useState(false);
    const [timerSeconds, setTimerSeconds] = useState(0);
    const [activeScriptItemId, setActiveScriptItemId] = useState<string | null>(null);

    const isPlayer = currentRole === 'PLAYER';
    const canEdit = !isPlayer; 

    useEffect(() => {
        setPractices(storageService.getPracticeSessions());
        setPlayers(storageService.getPlayers());
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
            notes: '',
            drills: [],
            script: [],
            performances: []
        };
        const updated = [practice, ...practices];
        setPractices(updated);
        storageService.savePracticeSessions(updated);
        setIsCreating(false);
        toast.success("Treino agendado com sucesso!");
    };

    const handleAiGenerateScript = async () => {
        if (!newFocus) {
            toast.warning("Defina um foco principal primeiro.");
            return;
        }
        toast.info("A IA está gerando o roteiro...");
        const script = await generatePracticeScript(newFocus, "2 hours");
        // In a real scenario, we would auto-populate the script. For now, alert via toast.
        toast.success("Roteiro gerado pela IA (Simulação): " + script.length + " atividades criadas.");
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
                    <h2 className="text-3xl font-bold text-text-primary">Gestão de Treinos</h2>
                    <p className="text-text-secondary">Planeje scripts minuto-a-minuto.</p>
                </div>
                {canEdit && (
                    <Button onClick={() => setIsCreating(!isCreating)} variant="primary">
                        {isCreating ? 'Cancelar' : '+ Novo Treino'}
                    </Button>
                )}
            </div>

            {isCreating && canEdit && (
                <Card className="animate-slide-in no-print border border-highlight/20">
                     <form onSubmit={handleCreatePractice} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input label="Título" value={newTitle} onChange={e => setNewTitle(e.target.value)} required placeholder="Ex: Preparação Playoffs" />
                            <Input label="Data" type="datetime-local" value={newDate} onChange={e => setNewDate(e.target.value)} required />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-bold text-text-secondary uppercase block mb-1.5 ml-1">Categoria</label>
                                <select className="w-full bg-secondary/50 border border-white/10 rounded-lg p-3 text-white focus:border-highlight focus:outline-none" value={newCategory} onChange={e => setNewCategory(e.target.value as any)}>
                                    <option value="TACTICAL">Tático</option>
                                    <option value="PHYSICAL">Físico</option>
                                    <option value="MENTAL">Mental</option>
                                </select>
                            </div>
                            <Input label="Foco Principal" value={newFocus} onChange={e => setNewFocus(e.target.value)} required />
                        </div>
                        
                        <div className="flex gap-2 justify-end pt-2">
                             <Button type="button" variant="secondary" onClick={handleAiGenerateScript} icon={<SparklesIcon className="w-4 h-4"/>}>IA Suggest</Button>
                             <Button type="submit">Agendar Treino</Button>
                        </div>
                    </form>
                </Card>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 space-y-4 no-print">
                    {practices.map(practice => (
                        <div key={practice.id} onClick={() => setSelectedPractice(practice)} className={`p-4 rounded-xl border cursor-pointer hover:bg-white/5 transition-all ${selectedPractice?.id === practice.id ? 'bg-highlight/10 border-highlight' : 'bg-secondary border-white/5'}`}>
                            <h4 className="font-bold text-white">{practice.title}</h4>
                            <p className="text-xs text-text-secondary mt-1">{new Date(practice.date).toLocaleDateString()}</p>
                        </div>
                    ))}
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
                                        {selectedPractice.script?.map((item) => (
                                            <div key={item.id} className={`bg-secondary p-4 rounded-lg border border-white/5 flex justify-between items-center ${activeScriptItemId === item.id ? 'border-highlight bg-highlight/5' : ''}`}>
                                                <div>
                                                    <span className="text-highlight font-mono font-bold text-lg mr-4">{item.startTime}</span>
                                                    <span className="font-bold text-white">{item.activityName}</span>
                                                    <span className="text-xs text-text-secondary ml-2">({item.durationMinutes} min)</span>
                                                </div>
                                                {canEdit && (
                                                    <button onClick={() => startDrillTimer(item)} className="text-green-400 hover:text-white p-2 bg-white/5 rounded-full">
                                                        <PlayCircleIcon className="w-6 h-6" />
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </Card>
                    ) : <div className="text-center p-12 text-text-secondary italic bg-secondary/20 rounded-xl">Selecione um treino.</div>}
                </div>
            </div>
            
            {/* TIMER OVERLAY */}
            {isTimerFullScreen && (
                <div className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center">
                    <button onClick={() => setIsTimerFullScreen(false)} className="absolute top-6 right-6 text-white/50 hover:text-white">Close</button>
                    <div className={`font-mono font-black text-[150px] leading-none ${timerSeconds < 60 ? 'text-red-500 animate-pulse' : 'text-white'}`}>
                        {formatTime(timerSeconds)}
                    </div>
                    <div className="flex gap-8 mt-8">
                        <Button onClick={() => setIsTimerRunning(!isTimerRunning)} size="lg" variant={isTimerRunning ? 'secondary' : 'primary'}>
                            {isTimerRunning ? 'PAUSE' : 'START'}
                        </Button>
                        <Button onClick={() => setTimerSeconds(0)} size="lg" variant="danger">STOP</Button>
                    </div>
                </div>
            )}
        </div>
    );
};
export default PracticePlan;
