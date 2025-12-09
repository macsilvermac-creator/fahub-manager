import React, { useState, useEffect, useContext } from 'react';
import Card from '../components/Card';
import { Player, PracticeSession, PracticeCategory, PracticeScriptItem } from '../types';
import { storageService } from '../services/storageService';
import { generatePracticeScript } from '../services/geminiService'; // Importando a nova função
import { SparklesIcon, PlayCircleIcon, ClockIcon, TrashIcon } from '../components/icons/UiIcons';
import { UserContext } from '../components/Layout';
import Button from '../components/Button'; 
import Input from '../components/Input';
import { useToast } from '../contexts/ToastContext';

const PracticePlan: React.FC = () => {
    const { currentRole } = useContext(UserContext);
    const toast = useToast();
    const [practices, setPractices] = useState<PracticeSession[]>([]);
    const [players, setPlayers] = useState<Player[]>([]);
    const [isCreating, setIsCreating] = useState(false);
    const [selectedPractice, setSelectedPractice] = useState<PracticeSession | null>(null);
    const [activeMode, setActiveMode] = useState<'SCRIPT' | 'PERFORMANCE'>('SCRIPT');

    // Form State
    const [newTitle, setNewTitle] = useState('');
    const [newFocus, setNewFocus] = useState('');
    const [newDate, setNewDate] = useState('');
    const [newCategory, setNewCategory] = useState<PracticeCategory>('TACTICAL');
    const [newDuration, setNewDuration] = useState(120); // Duração padrão 2h

    // Script Management State
    const [generatedScript, setGeneratedScript] = useState<PracticeScriptItem[]>([]);
    const [isGeneratingScript, setIsGeneratingScript] = useState(false);
    
    // Timer State
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
            script: generatedScript.length > 0 ? generatedScript : [], // Use generated script if available
            performances: []
        };
        const updated = [practice, ...practices];
        setPractices(updated);
        storageService.savePracticeSessions(updated);
        setIsCreating(false);
        setGeneratedScript([]); // Reset script
        toast.success("Treino agendado com sucesso!");
    };

    // --- AI WIZARD INTEGRATION ---
    const handleAiGenerateScript = async () => {
        if (!newFocus) {
            toast.warning("Defina um foco principal primeiro (ex: 'Defesa Redzone').");
            return;
        }
        setIsGeneratingScript(true);
        toast.info(`🤖 IA: Criando roteiro de ${newDuration}min focado em "${newFocus}"...`);
        
        try {
            const script = await generatePracticeScript(newFocus, newDuration, "High Intensity");
            
            if (script && script.length > 0) {
                setGeneratedScript(script);
                toast.success(`✅ Roteiro gerado com ${script.length} atividades!`);
            } else {
                toast.error("IA não retornou um roteiro válido. Tente simplificar o foco.");
            }
        } catch (e) {
            toast.error("Erro ao comunicar com a IA.");
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
                    <h2 className="text-3xl font-bold text-text-primary">Gestão de Treinos</h2>
                    <p className="text-text-secondary">Planeje scripts minuto-a-minuto com auxílio da IA.</p>
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
                                <Input label="Foco Principal (Prompt da IA)" value={newFocus} onChange={e => setNewFocus(e.target.value)} required placeholder="Ex: Instalação de Blitz, Cover 3..." />
                            </div>
                        </div>
                        
                        <div className="bg-black/20 p-4 rounded-xl border border-white/10">
                            <div className="flex justify-between items-center mb-3">
                                <h4 className="font-bold text-white flex items-center gap-2">
                                    <ClockIcon className="w-4 h-4 text-highlight"/> Roteiro (Script)
                                </h4>
                                <div className="flex items-center gap-2">
                                    <label className="text-xs text-text-secondary">Duração:</label>
                                    <input type="number" className="w-16 bg-black/40 border border-white/10 rounded p-1 text-center text-white text-xs" value={newDuration} onChange={e => setNewDuration(Number(e.target.value))} />
                                    <span className="text-xs text-text-secondary">min</span>
                                </div>
                            </div>

                            {generatedScript.length > 0 ? (
                                <div className="space-y-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                                    {generatedScript.map((item, idx) => (
                                        <div key={idx} className="flex gap-3 bg-secondary/50 p-2 rounded text-xs border border-white/5">
                                            <span className="font-mono text-highlight font-bold w-12">{item.startTime}</span>
                                            <span className="bg-white/10 px-2 rounded font-bold text-white w-20 text-center flex items-center justify-center">{item.type}</span>
                                            <div className="flex-1">
                                                <p className="font-bold text-white">{item.activityName}</p>
                                                <p className="text-text-secondary truncate">{item.description}</p>
                                            </div>
                                            <span className="font-bold text-white">{item.durationMinutes}m</span>
                                        </div>
                                    ))}
                                    <button type="button" onClick={() => setGeneratedScript([])} className="text-xs text-red-400 hover:text-white underline w-full text-center mt-2">Limpar Roteiro</button>
                                </div>
                            ) : (
                                <div className="text-center py-8 border-2 border-dashed border-white/10 rounded-lg">
                                    <button 
                                        type="button" 
                                        onClick={handleAiGenerateScript}
                                        disabled={isGeneratingScript || !newFocus}
                                        className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white px-6 py-3 rounded-xl font-bold shadow-lg flex items-center gap-2 mx-auto transition-transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isGeneratingScript ? <><span className="animate-spin">⚙️</span> Criando Roteiro...</> : <><SparklesIcon className="w-5 h-5"/> Gerar Roteiro Automático (IA)</>}
                                    </button>
                                    <p className="text-[10px] text-text-secondary mt-2">A IA distribuirá o tempo entre Warmup, Indy e Team baseado no foco.</p>
                                </div>
                            )}
                        </div>

                        <div className="flex justify-end pt-2">
                             <Button type="submit">Confirmar Agendamento</Button>
                        </div>
                    </form>
                </Card>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 space-y-4 no-print">
                    {practices.map(practice => (
                        <div key={practice.id} onClick={() => setSelectedPractice(practice)} className={`p-4 rounded-xl border cursor-pointer hover:bg-white/5 transition-all ${selectedPractice?.id === practice.id ? 'bg-highlight/10 border-highlight' : 'bg-secondary border-white/5'}`}>
                            <div className="flex justify-between items-start">
                                <h4 className="font-bold text-white">{practice.title}</h4>
                                <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded text-text-secondary">{practice.script?.length || 0} drills</span>
                            </div>
                            <p className="text-xs text-text-secondary mt-1">{new Date(practice.date).toLocaleDateString()} • {practice.focus}</p>
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
                                            <div className="text-center py-8 text-text-secondary italic">Este treino não possui roteiro cadastrado.</div>
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
        </div>
    );
};
export default PracticePlan;