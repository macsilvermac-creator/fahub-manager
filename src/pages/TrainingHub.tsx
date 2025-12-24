
import React, { useState, useEffect, useCallback, memo, useMemo } from 'react';
import PageHeader from '../components/PageHeader';
import { storageService } from '../services/storageService';
import { PracticeSession, PracticeScriptItem, PracticeTarget } from '../types';
import { WhistleIcon, SparklesIcon, ClockIcon, TrashIcon, PlusIcon, CalendarIcon, UsersIcon } from '../components/icons/UiIcons';
import { useToast } from '../contexts/ToastContext';
import { generatePracticeScript } from '../services/geminiService';

const DrillItem = memo(({ item, onRemove, onUpdate }: { 
    item: PracticeScriptItem, 
    onRemove: (id: string) => void, 
    onUpdate: (id: string, field: string, val: any) => void 
}) => (
    <div className="bg-black/20 p-2 rounded-xl border border-white/5 flex gap-2 items-center animate-fade-in group hover:border-highlight/30 transition-all">
        <div className="flex flex-col shrink-0">
            <input 
                type="time"
                className="bg-transparent text-highlight font-mono font-bold text-[10px] outline-none"
                value={item.startTime}
                onChange={(e) => onUpdate(item.id, 'startTime', e.target.value)}
            />
        </div>
        <div className="flex-1">
            <input 
                className="w-full bg-transparent text-[10px] text-white outline-none border-b border-transparent focus:border-highlight font-bold" 
                value={item.activityName} 
                onChange={(e) => onUpdate(item.id, 'activityName', e.target.value)} 
                placeholder="Drill..."
            />
        </div>
        <div className="w-10">
            <input 
                type="number"
                className="w-full bg-transparent text-[10px] text-white outline-none font-bold text-right" 
                value={item.durationMinutes} 
                onChange={(e) => onUpdate(item.id, 'durationMinutes', Number(e.target.value))} 
            />
        </div>
        <button onClick={() => onRemove(item.id)} className="text-red-500/30 hover:text-red-500 transition-colors"><TrashIcon className="w-3 h-3"/></button>
    </div>
));

/* Fix: Typed SessionCard as React.FC to allow 'key' prop when used in list mapping */
const SessionCard: React.FC<{ session: PracticeSession }> = ({ session }) => {
    const isIA = session.source === 'AI';
    return (
        <div className="bg-black/40 p-4 rounded-2xl border border-white/5 group hover:border-highlight transition-all relative overflow-hidden">
            {isIA && <div className="absolute top-0 right-0 p-2 opacity-10"><SparklesIcon className="w-8 h-8 text-purple-400"/></div>}
            <div className="flex justify-between items-start mb-2">
                <span className={`text-[8px] font-black px-2 py-0.5 rounded-full uppercase ${isIA ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' : 'bg-highlight/20 text-highlight border border-highlight/30'}`}>
                    {session.target || 'GERAL'}
                </span>
                <span className="text-[8px] font-mono text-text-secondary">{new Date(session.date).toLocaleDateString()} • {session.startTime}</span>
            </div>
            <h4 className="text-xs font-black text-white uppercase italic truncate">{session.title}</h4>
            <div className="mt-4 flex justify-between items-center">
                <span className="text-[9px] text-text-secondary font-bold">{session.script?.length || 0} Atividades</span>
                <button 
                    onClick={() => window.location.href=`#/practice-execution/${session.id}`}
                    className="text-[9px] font-black text-highlight hover:underline uppercase tracking-widest"
                >
                    Executar →
                </button>
            </div>
        </div>
    );
};

const TrainingHub: React.FC = () => {
    const toast = useToast();
    const [practices, setPractices] = useState<PracticeSession[]>([]);
    
    // Form State Manual
    const [manualTitle, setManualTitle] = useState('');
    const [manualDate, setManualDate] = useState(new Date().toISOString().split('T')[0]);
    const [manualTime, setManualTime] = useState('19:00');
    const [manualTarget, setManualTarget] = useState<PracticeTarget>('FULL_TEAM');
    const [manualFocus, setManualFocus] = useState('INSTALAÇÃO');
    const [manualScript, setManualScript] = useState<PracticeScriptItem[]>([]);
    
    // IA State
    const [aiPrompt, setAiPrompt] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);

    useEffect(() => {
        setPractices(storageService.getPracticeSessions());
        return storageService.subscribe('storage_update', () => setPractices(storageService.getPracticeSessions()));
    }, []);

    const addManualDrill = useCallback(() => {
        let startTime = manualTime;
        if (manualScript.length > 0) {
            const last = manualScript[manualScript.length - 1];
            const [h, m] = last.startTime.split(':').map(Number);
            const date = new Date();
            date.setHours(h, m + last.durationMinutes);
            startTime = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
        }
        const newItem: PracticeScriptItem = {
            id: `dr-${Date.now()}`,
            startTime: startTime,
            durationMinutes: 15,
            activityName: "",
            type: 'TECHNICAL'
        };
        setManualScript(prev => [...prev, newItem]);
    }, [manualScript, manualTime]);

    const handleUpdateDrill = useCallback((id: string, field: string, val: any) => {
        setManualScript(prev => prev.map(s => s.id === id ? { ...s, [field]: val } : s));
    }, []);

    const handleRemoveDrill = useCallback((id: string) => {
        setManualScript(prev => prev.filter(s => s.id !== id));
    }, []);

    const handleSaveManual = () => {
        if (!manualTitle) return toast.warning("Dê um nome ao treino!");
        const newSession: PracticeSession = {
            id: `man-${Date.now()}`,
            title: manualTitle,
            focus: manualFocus,
            date: new Date(manualDate),
            startTime: manualTime,
            target: manualTarget,
            source: 'MANUAL',
            attendees: [],
            script: manualScript
        };
        storageService.savePracticeSessions([newSession, ...practices]);
        setManualTitle('');
        setManualScript([]);
        toast.success("Plano de treino manual agendado!");
    };

    const handleGenerateAI = async () => {
        if (!aiPrompt) return;
        setIsGenerating(true);
        toast.info("Convocando o Mago...");
        try {
            const script = await generatePracticeScript(aiPrompt, 120, "Elite");
            const newSession: PracticeSession = {
                id: `ai-${Date.now()}`,
                title: `IA: ${aiPrompt.substring(0, 25)}...`,
                focus: "INTEL",
                date: new Date(manualDate), // Usa a data setada no form
                startTime: manualTime,
                target: 'FULL_TEAM',
                source: 'AI',
                attendees: [],
                script: script
            };
            storageService.savePracticeSessions([newSession, ...practices]);
            setAiPrompt('');
            toast.success("O Mago gerou um roteiro tático!");
        } catch (e) {
            toast.error("IA temporariamente offline.");
        } finally {
            setIsGenerating(false);
        }
    };

    const manualLibrary = useMemo(() => practices.filter(p => p.source === 'MANUAL').slice(0, 10), [practices]);
    const aiLibrary = useMemo(() => practices.filter(p => p.source === 'AI').slice(0, 10), [practices]);

    return (
        <div className="space-y-4 animate-fade-in pb-10 h-[calc(100vh-100px)] flex flex-col overflow-hidden">
            <PageHeader title="Training Hub Matrix" subtitle="Central de Comando Técnico" />

            <div className="grid grid-cols-1 lg:grid-cols-2 grid-rows-2 gap-4 flex-1 overflow-hidden">
                
                {/* 1. EU MESMO FAÇO (CRIAÇÃO MANUAL) */}
                <div className="bg-secondary/40 rounded-[2rem] border-2 border-highlight p-6 flex flex-col overflow-hidden shadow-2xl relative">
                    <div className="flex items-center gap-3 mb-4 shrink-0">
                        <div className="p-2 bg-highlight/20 rounded-xl text-highlight">
                            <WhistleIcon className="w-5 h-5" />
                        </div>
                        <h3 className="text-lg font-black text-white italic uppercase tracking-tighter">Deixa que eu Faço</h3>
                    </div>
                    
                    <div className="space-y-3 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                        <div className="grid grid-cols-2 gap-2">
                            <div className="col-span-2">
                                <input className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white text-xs focus:border-highlight outline-none" placeholder="Título da Sessão" value={manualTitle} onChange={e => setManualTitle(e.target.value)} />
                            </div>
                            <input type="date" className="bg-black/40 border border-white/10 rounded-xl p-3 text-white text-xs outline-none focus:border-highlight" value={manualDate} onChange={e => setManualDate(e.target.value)} />
                            <input type="time" className="bg-black/40 border border-white/10 rounded-xl p-3 text-white text-xs outline-none focus:border-highlight" value={manualTime} onChange={e => setManualTime(e.target.value)} />
                            
                            <select className="bg-black/40 border border-white/10 rounded-xl p-3 text-white text-[10px] font-bold uppercase outline-none focus:border-highlight" value={manualTarget} onChange={e => setManualTarget(e.target.value as any)}>
                                <option value="FULL_TEAM">TODO O TIME</option>
                                <option value="OFFENSE">SÓ ATAQUE</option>
                                <option value="DEFENSE">SÓ DEFESA</option>
                                <option value="UNIT">POR UNIDADE</option>
                                <option value="POSITION">POR POSIÇÃO</option>
                            </select>
                            
                            <input className="bg-black/40 border border-white/10 rounded-xl p-3 text-white text-xs focus:border-highlight outline-none" placeholder="Foco (ex: Redzone)" value={manualFocus} onChange={e => setManualFocus(e.target.value)} />
                        </div>

                        <div className="pt-4 border-t border-white/5">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-[10px] font-black text-highlight uppercase tracking-[0.2em]">Roteiro de Drills</span>
                                <button onClick={addManualDrill} className="p-1.5 bg-highlight/10 text-highlight rounded-lg hover:bg-highlight hover:text-white transition-all">
                                    <PlusIcon className="w-4 h-4" />
                                </button>
                            </div>
                            <div className="space-y-2">
                                {manualScript.map(item => <DrillItem key={item.id} item={item} onRemove={handleRemoveDrill} onUpdate={handleUpdateDrill} />)}
                            </div>
                        </div>
                    </div>
                    <button onClick={handleSaveManual} className="mt-4 w-full bg-highlight hover:bg-highlight-hover text-white font-black py-3 rounded-2xl uppercase text-[10px] shadow-glow shrink-0 transition-all">AGENDAR TREINO MANUAL</button>
                </div>

                {/* 2. BIBLIOTECA MANUAL (AO LADO DO 1) */}
                <div className="bg-secondary/20 rounded-[2rem] border border-white/10 p-6 flex flex-col overflow-hidden">
                    <div className="flex items-center gap-3 mb-4 shrink-0">
                        <div className="p-2 bg-white/5 rounded-xl text-white">
                            <CalendarIcon className="w-5 h-5" />
                        </div>
                        <h3 className="text-lg font-black text-white italic uppercase tracking-tighter">Scripts Manuais</h3>
                    </div>
                    <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-3">
                        {manualLibrary.map(p => <SessionCard key={p.id} session={p} />)}
                        {manualLibrary.length === 0 && <div className="h-full flex flex-col items-center justify-center opacity-20"><WhistleIcon className="w-12 h-12 mb-2"/><p className="text-[10px] uppercase font-black">Nenhum plano manual</p></div>}
                    </div>
                </div>

                {/* 3. MAGO IA (ABAIXO DO 1) */}
                <div className="bg-secondary/40 rounded-[2rem] border-2 border-purple-500 p-6 flex flex-col overflow-hidden shadow-2xl relative">
                    <div className="flex items-center gap-3 mb-4 shrink-0">
                        <div className="p-2 bg-purple-500/20 rounded-xl text-purple-400">
                            <SparklesIcon className="w-5 h-5" />
                        </div>
                        <h3 className="text-lg font-black text-white italic uppercase tracking-tighter">Mago IA</h3>
                    </div>
                    <div className="space-y-4 flex-1 flex flex-col">
                        <p className="text-[10px] text-text-secondary leading-relaxed px-1 uppercase font-bold tracking-widest">A IA gera o roteiro perfeito baseado no seu foco tático.</p>
                        <textarea 
                            className="w-full flex-1 bg-black/40 border-2 border-purple-500/30 rounded-2xl p-4 text-white text-xs focus:border-purple-500 outline-none placeholder-purple-900/50 resize-none"
                            placeholder="Ex: Treino de 90min para Linebackers focado em blitzing e leitura de gap..."
                            value={aiPrompt}
                            onChange={e => setAiPrompt(e.target.value)}
                        />
                    </div>
                    <button onClick={handleGenerateAI} disabled={isGenerating} className="mt-4 w-full bg-purple-600 hover:bg-purple-500 text-white font-black py-4 rounded-2xl uppercase text-[10px] shadow-lg shrink-0 flex justify-center items-center gap-2 transition-all">
                        {isGenerating ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : 'GERAR ROTEIRO COM IA'}
                    </button>
                </div>

                {/* 4. BIBLIOTECA IA (AO LADO DO 3) */}
                <div className="bg-secondary/20 rounded-[2rem] border border-white/10 p-6 flex flex-col overflow-hidden">
                    <div className="flex items-center gap-3 mb-4 shrink-0">
                        <div className="p-2 bg-purple-500/10 rounded-xl text-purple-400">
                            <SparklesIcon className="w-5 h-5" />
                        </div>
                        <h3 className="text-lg font-black text-white italic uppercase tracking-tighter">Histórico de IA</h3>
                    </div>
                    <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-3">
                        {aiLibrary.map(p => <SessionCard key={p.id} session={p} />)}
                        {aiLibrary.length === 0 && <div className="h-full flex flex-col items-center justify-center opacity-20"><SparklesIcon className="w-12 h-12 mb-2"/><p className="text-[10px] uppercase font-black">Nenhum plano gerado</p></div>}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default TrainingHub;
