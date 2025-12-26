
import React, { useState, useEffect, useContext, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '../components/PageHeader';
import Card from '../components/Card';
import { storageService } from '../services/storageService';
import { PracticeSession, PracticeScriptItem, PracticeTarget } from '../types';
import { 
    WhistleIcon, SparklesIcon, ClockIcon, 
    TrashIcon, PlusIcon, CalendarIcon, 
    CheckCircleIcon, ChevronRightIcon, PenIcon,
    /* Fix: Added missing RefreshIcon import */
    RefreshIcon
} from '../components/icons/UiIcons';
import { useToast } from '../contexts/ToastContext';
import { generatePracticeScript } from '../services/geminiService';
import { UserContext, UserContextType } from '../components/Layout';

const TrainingHub: React.FC = () => {
    const { currentRole } = useContext(UserContext) as UserContextType;
    const navigate = useNavigate();
    const toast = useToast();
    const [practices, setPractices] = useState<PracticeSession[]>([]);
    const [view, setView] = useState<'BUILDER' | 'LIST'>('BUILDER');
    
    // Manual Form States
    const [title, setTitle] = useState('');
    const [focus, setFocus] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [startTime, setStartTime] = useState('19:30');
    const [duration, setDuration] = useState(120);
    const [target, setTarget] = useState<PracticeTarget>('FULL_TEAM');
    const [script, setScript] = useState<PracticeScriptItem[]>([]);
    
    const [isGenerating, setIsGenerating] = useState(false);

    useEffect(() => {
        setPractices(storageService.getPracticeSessions());
    }, []);

    const addDrill = () => {
        let start = startTime;
        if (script.length > 0) {
            const last = script[script.length - 1];
            const [h, m] = last.startTime.split(':').map(Number);
            const d = new Date(); d.setHours(h, m + last.durationMinutes);
            start = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
        }
        const newItem: PracticeScriptItem = {
            id: `drill-${Date.now()}`,
            startTime: start,
            durationMinutes: 15,
            activityName: "Novo Drill",
            type: 'TECHNICAL'
        };
        setScript([...script, newItem]);
    };

    const handleUpdateDrill = (id: string, field: string, val: any) => {
        setScript(script.map(s => s.id === id ? { ...s, [field]: val } : s));
    };

    const handleAiGenerate = async () => {
        if (!focus) return toast.warning("Defina um foco para a IA (ex: Defesa Redzone)");
        setIsGenerating(true);
        try {
            const result = await generatePracticeScript(focus, duration, "Elite");
            setScript(result);
            toast.success("Roteiro otimizado pela IA!");
        } catch (e) {
            toast.error("IA temporariamente indisponível.");
        } finally {
            setIsGenerating(false);
        }
    };

    const handleSave = () => {
        if (!title) return toast.warning("Título obrigatório.");
        const newSession: PracticeSession = {
            id: `prac-${Date.now()}`,
            title,
            focus,
            date: new Date(date),
            startTime,
            target,
            source: 'MANUAL',
            attendees: [],
            script
        };
        const updated = [newSession, ...practices];
        setPractices(updated);
        storageService.savePracticeSessions(updated);
        toast.success("Treino agendado com sucesso!");
        setView('LIST');
    };

    return (
        <div className="space-y-8 animate-fade-in pb-20">
            <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-6">
                <PageHeader title="Training Hub" subtitle="Engenharia de campo e planejamento de sessões." />
                <div className="flex bg-secondary p-1 rounded-2xl border border-white/5 shadow-xl">
                    <button onClick={() => setView('BUILDER')} className={`px-10 py-3 rounded-xl text-xs font-black uppercase transition-all ${view === 'BUILDER' ? 'bg-highlight text-white shadow-glow' : 'text-text-secondary hover:text-white'}`}>Builder</button>
                    <button onClick={() => setView('LIST')} className={`px-10 py-3 rounded-xl text-xs font-black uppercase transition-all ${view === 'LIST' ? 'bg-highlight text-white shadow-glow' : 'text-text-secondary hover:text-white'}`}>Histórico</button>
                </div>
            </div>

            {view === 'BUILDER' ? (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <div className="lg:col-span-7 space-y-6">
                        <Card title="Prancheta de Sessão" titleClassName="italic font-black uppercase text-sm">
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <input className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-sm text-white focus:border-highlight outline-none" placeholder="Nome do Treino (ex: Preparação Playoffs)" value={title} onChange={e => setTitle(e.target.value)} />
                                    <input type="date" className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-sm text-white outline-none" value={date} onChange={e => setDate(e.target.value)} />
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    <input type="time" className="w-full bg-black/40 border border-white/10 rounded-2xl p-3 text-xs text-white" value={startTime} onChange={e => setStartTime(e.target.value)} />
                                    <select className="col-span-2 bg-black/40 border border-white/10 rounded-2xl p-3 text-[10px] font-black uppercase text-white" value={target} onChange={e => setTarget(e.target.value as any)}>
                                        <option value="FULL_TEAM">TODO O TIME</option>
                                        <option value="OFFENSE">UNIDADE: ATAQUE</option>
                                        <option value="DEFENSE">UNIDADE: DEFESA</option>
                                    </select>
                                    <input className="w-full bg-black/40 border border-white/10 rounded-2xl p-3 text-xs text-white" placeholder="Foco (ex: Redzone)" value={focus} onChange={e => setFocus(e.target.value)} />
                                </div>

                                <div className="pt-8 border-t border-white/5">
                                    <div className="flex justify-between items-center mb-6">
                                        <h4 className="text-[10px] font-black text-highlight uppercase tracking-[0.4em] flex items-center gap-2">
                                            <ClockIcon className="w-4 h-4"/> Minute-by-Minute Script
                                        </h4>
                                        <div className="flex gap-2">
                                            <button onClick={handleAiGenerate} disabled={isGenerating} className="p-2 bg-purple-600/20 text-purple-400 border border-purple-500/30 rounded-xl hover:bg-purple-600 hover:text-white transition-all">
                                                {isGenerating ? <RefreshIcon className="w-4 h-4 animate-spin"/> : <SparklesIcon className="w-4 h-4"/>}
                                            </button>
                                            <button onClick={addDrill} className="p-2 bg-highlight/20 text-highlight border border-highlight/30 rounded-xl hover:bg-highlight hover:text-white transition-all"><PlusIcon className="w-4 h-4"/></button>
                                        </div>
                                    </div>

                                    <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                                        {script.map((item, idx) => (
                                            <div key={item.id} className="bg-black/40 p-4 rounded-2xl border border-white/5 flex items-center gap-4 group hover:border-highlight/30 transition-all">
                                                <input type="time" className="bg-transparent text-highlight font-mono font-black text-sm outline-none" value={item.startTime} onChange={e => handleUpdateDrill(item.id, 'startTime', e.target.value)} />
                                                <div className="flex-1">
                                                    <input className="w-full bg-transparent text-xs text-white outline-none border-b border-transparent focus:border-highlight font-bold" value={item.activityName} onChange={e => handleUpdateDrill(item.id, 'activityName', e.target.value)} placeholder="Título do Drill..." />
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <input type="number" className="w-10 bg-transparent text-right text-xs text-white font-bold outline-none" value={item.durationMinutes} onChange={e => handleUpdateDrill(item.id, 'durationMinutes', Number(e.target.value))} />
                                                    <span className="text-[8px] text-text-secondary font-black uppercase">MIN</span>
                                                </div>
                                                <button onClick={() => setScript(script.filter(s => s.id !== item.id))} className="text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"><TrashIcon className="w-4 h-4"/></button>
                                            </div>
                                        ))}
                                        {script.length === 0 && <p className="text-center py-20 text-text-secondary text-xs italic opacity-30">Adicione drills ou use o assistente IA para compor seu roteiro.</p>}
                                    </div>
                                </div>
                                
                                <button onClick={handleSave} className="w-full bg-highlight hover:bg-highlight-hover text-white font-black py-5 rounded-[2.5rem] uppercase italic tracking-tighter shadow-glow transition-all active:scale-95 mt-6">Publicar Agenda de Treino</button>
                            </div>
                        </Card>
                    </div>

                    <div className="lg:col-span-5 space-y-6">
                        <div className="bg-gradient-to-br from-blue-900/60 to-black p-8 rounded-[3rem] border border-blue-500/20 shadow-2xl">
                             <WhistleIcon className="w-12 h-12 text-blue-400 mb-6" />
                             <h4 className="text-white font-black uppercase italic text-xl">The Field Command</h4>
                             <p className="text-sm text-blue-200 mt-4 leading-relaxed font-medium">Os roteiros publicados aqui são sincronizados com o app dos atletas. Cada segundo conta para a disciplina de uma unidade campeã.</p>
                             <div className="mt-8 grid grid-cols-2 gap-4">
                                 <div className="bg-black/40 p-4 rounded-2xl text-center">
                                     <p className="text-[8px] text-text-secondary uppercase font-black">Efficiency Goal</p>
                                     <p className="text-2xl font-black text-white italic">100%</p>
                                 </div>
                                 <div className="bg-black/40 p-4 rounded-2xl text-center">
                                     <p className="text-[8px] text-text-secondary uppercase font-black">Tempo de Estudo</p>
                                     <p className="text-2xl font-black text-white italic">{duration} min</p>
                                 </div>
                             </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {practices.map(p => (
                        <div 
                            key={p.id} 
                            onClick={() => navigate(`/practice-execution/${p.id}`)}
                            className="bg-secondary/40 p-6 rounded-[2.5rem] border border-white/5 hover:border-highlight transition-all cursor-pointer group shadow-xl"
                        >
                            <div className="flex justify-between items-start mb-4">
                                <span className="bg-highlight/20 text-highlight text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest">{p.target || 'GERAL'}</span>
                                <span className="text-[10px] font-mono text-text-secondary font-bold">{new Date(p.date).toLocaleDateString()}</span>
                            </div>
                            <h4 className="text-xl font-black text-white uppercase italic truncate leading-tight">{p.title}</h4>
                            <div className="mt-6 flex justify-between items-center border-t border-white/5 pt-4">
                                <span className="text-[10px] font-black text-text-secondary uppercase">{p.script?.length || 0} Drills de Campo</span>
                                <ChevronRightIcon className="w-5 h-5 text-text-secondary group-hover:translate-x-1 transition-transform" />
                            </div>
                        </div>
                    ))}
                    {practices.length === 0 && <p className="col-span-full text-center py-40 opacity-20 italic font-black uppercase">Nenhuma sessão histórica encontrada.</p>}
                </div>
            )}
        </div>
    );
};

export default TrainingHub;
