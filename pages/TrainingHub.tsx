
import React, { useState, useEffect, useCallback, memo, useMemo } from 'react';
import PageHeader from '../components/PageHeader';
// Fix: Added missing import for Card component
import Card from '../components/Card';
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
    <div className="bg-black/40 p-4 rounded-2xl border border-white/5 flex gap-4 items-center animate-fade-in group hover:border-highlight/30 transition-all">
        <div className="flex flex-col shrink-0 text-center border-r border-white/10 pr-4">
            <span className="text-[8px] font-black text-text-secondary uppercase">Início</span>
            <input 
                type="time"
                className="bg-transparent text-highlight font-mono font-black text-sm outline-none"
                value={item.startTime}
                onChange={(e) => onUpdate(item.id, 'startTime', e.target.value)}
            />
        </div>
        <div className="flex-1">
            <input 
                className="w-full bg-transparent text-xs text-white outline-none border-b border-transparent focus:border-highlight font-black uppercase italic" 
                value={item.activityName} 
                onChange={(e) => onUpdate(item.id, 'activityName', e.target.value)} 
                placeholder="NOME DO DRILL..."
            />
            <input 
                className="w-full bg-transparent text-[10px] text-text-secondary outline-none mt-1" 
                value={item.description || ''} 
                onChange={(e) => onUpdate(item.id, 'description', e.target.value)} 
                placeholder="Foco técnico (ex: Alinhamento, mãos...)"
            />
        </div>
        <div className="w-16 flex flex-col items-center">
            <span className="text-[8px] font-black text-text-secondary uppercase">Min</span>
            <input 
                type="number"
                className="w-full bg-black/20 rounded-lg p-1 text-xs text-white outline-none font-bold text-center border border-white/5" 
                value={item.durationMinutes} 
                onChange={(e) => onUpdate(item.id, 'durationMinutes', Number(e.target.value))} 
            />
        </div>
        <button onClick={() => onRemove(item.id)} className="text-red-500/20 hover:text-red-500 transition-colors p-2"><TrashIcon className="w-4 h-4"/></button>
    </div>
));

const SessionCard: React.FC<{ session: PracticeSession }> = ({ session }) => {
    const isIA = session.source === 'AI';
    return (
        <div className="bg-secondary/40 p-5 rounded-[2rem] border border-white/5 group hover:border-highlight transition-all relative overflow-hidden flex flex-col h-full">
            {isIA && <div className="absolute top-0 right-0 p-4 opacity-10"><SparklesIcon className="w-12 h-12 text-purple-400"/></div>}
            <div className="flex justify-between items-start mb-4">
                <span className={`text-[9px] font-black px-3 py-1 rounded-full uppercase italic tracking-widest ${isIA ? 'bg-purple-600 text-white shadow-lg' : 'bg-highlight text-white shadow-lg'}`}>
                    {session.target || 'TEAM'}
                </span>
                <span className="text-[10px] font-black font-mono text-text-secondary opacity-60">{new Date(session.date).toLocaleDateString()}</span>
            </div>
            <h4 className="text-lg font-black text-white uppercase italic truncate leading-none mb-2">{session.title}</h4>
            <p className="text-[10px] text-text-secondary font-bold uppercase tracking-widest mb-6">Foco: {session.focus}</p>
            
            <div className="mt-auto flex justify-between items-center pt-4 border-t border-white/5">
                <span className="text-[10px] text-text-secondary font-black uppercase tracking-widest">{session.script?.length || 0} Drills</span>
                <button 
                    onClick={() => window.location.href=`#/practice-execution/${session.id}`}
                    className="text-[10px] font-black text-highlight hover:text-white uppercase tracking-widest transition-colors"
                >
                    Executar Session →
                </button>
            </div>
        </div>
    );
};

const TrainingHub: React.FC = () => {
    const toast = useToast();
    const [practices, setPractices] = useState<PracticeSession[]>([]);
    const [view, setView] = useState<'BUILDER' | 'LIBRARY'>('BUILDER');
    
    // Form State Manual
    const [manualTitle, setManualTitle] = useState('');
    const [manualDate, setManualDate] = useState(new Date().toISOString().split('T')[0]);
    const [manualTime, setManualTime] = useState('19:30');
    const [manualTarget, setManualTarget] = useState<PracticeTarget>('FULL_TEAM');
    const [manualFocus, setManualFocus] = useState('INSTALAÇÃO');
    const [manualScript, setManualScript] = useState<PracticeScriptItem[]>([]);
    
    // IA State
    const [aiPrompt, setAiPrompt] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);

    useEffect(() => {
        const load = () => setPractices(storageService.getPracticeSessions());
        load();
        return storageService.subscribe('storage_update', load);
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
        if (!manualTitle) return toast.warning("Dê um nome à sua sessão de treino!");
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
        toast.success("Plano de treino tático agendado!");
    };

    const handleGenerateAI = async () => {
        if (!aiPrompt) return;
        setIsGenerating(true);
        toast.info("Consultando o Mago tático...");
        try {
            const script = await generatePracticeScript(aiPrompt, 120, "High Performance");
            const newSession: PracticeSession = {
                id: `ai-${Date.now()}`,
                title: `IA: ${aiPrompt.substring(0, 20)}...`,
                focus: "ANALYSIS_GEN",
                date: new Date(manualDate),
                startTime: manualTime,
                target: 'FULL_TEAM',
                source: 'AI',
                attendees: [],
                script: script
            };
            storageService.savePracticeSessions([newSession, ...practices]);
            setAiPrompt('');
            toast.success("Estratégia gerada com sucesso!");
        } catch (e) {
            toast.error("IA ocupada no momento. Tente novamente.");
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="space-y-6 animate-fade-in pb-20">
            <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4">
                <PageHeader title="Command & Training" subtitle="Planejamento de Roteiros e Execução de Campo." />
                <div className="flex bg-secondary p-1 rounded-2xl border border-white/5 shadow-xl">
                    <button onClick={() => setView('BUILDER')} className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase transition-all ${view === 'BUILDER' ? 'bg-highlight text-white shadow-glow' : 'text-text-secondary hover:text-white'}`}>Builder</button>
                    <button onClick={() => setView('LIBRARY')} className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase transition-all ${view === 'LIBRARY' ? 'bg-highlight text-white shadow-glow' : 'text-text-secondary hover:text-white'}`}>Biblioteca</button>
                </div>
            </div>

            {view === 'BUILDER' ? (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    {/* BUILDER MANUAL */}
                    <div className="lg:col-span-8 space-y-6">
                        <Card title="Nova Sessão Técnica">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                <div className="md:col-span-2">
                                    <label className="text-[10px] font-black text-text-secondary uppercase mb-2 block">Título do Treino</label>
                                    <input className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white font-bold italic outline-none focus:border-highlight" placeholder="Ex: Ajustes de Cobertura Cover 2..." value={manualTitle} onChange={e => setManualTitle(e.target.value)} />
                                </div>
                                <div>
                                    <label className="text-[10px] font-black text-text-secondary uppercase mb-2 block">Modalidade Alvo</label>
                                    <select className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white text-xs font-bold outline-none focus:border-highlight" value={manualTarget} onChange={e => setManualTarget(e.target.value as any)}>
                                        <option value="FULL_TEAM">TODO O TIME</option>
                                        <option value="OFFENSE">SÓ ATAQUE</option>
                                        <option value="DEFENSE">SÓ DEFESA</option>
                                    </select>
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex justify-between items-center mb-4">
                                    <h4 className="text-xs font-black text-highlight uppercase tracking-[0.4em]">Drill Script (Timeline)</h4>
                                    <button onClick={addManualDrill} className="flex items-center gap-2 bg-highlight/10 text-highlight px-4 py-2 rounded-xl text-[10px] font-black uppercase border border-highlight/20 hover:bg-highlight hover:text-white transition-all">
                                        <PlusIcon className="w-4 h-4" /> Adicionar Bloco
                                    </button>
                                </div>
                                <div className="space-y-3">
                                    {manualScript.map(item => <DrillItem key={item.id} item={item} onRemove={handleRemoveDrill} onUpdate={handleUpdateDrill} />)}
                                    {manualScript.length === 0 && (
                                        <div className="py-12 text-center border-2 border-dashed border-white/5 rounded-3xl opacity-20">
                                            <p className="font-black uppercase text-xs tracking-widest">Aguardando blocos de tempo...</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                            
                            <div className="mt-8 pt-6 border-t border-white/5">
                                <button onClick={handleSaveManual} className="w-full bg-highlight hover:bg-highlight-hover text-white font-black py-5 rounded-[2rem] uppercase italic tracking-widest shadow-glow transform active:scale-95 transition-all">
                                    Confirmar e Agendar Treino
                                </button>
                            </div>
                        </Card>
                    </div>

                    {/* AI ASSISTANT SIDEBAR */}
                    <div className="lg:col-span-4 space-y-6">
                        <div className="bg-gradient-to-br from-purple-900 to-[#0F172A] p-8 rounded-[2.5rem] border border-purple-500/30 shadow-2xl relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10"><SparklesIcon className="w-20 h-20 text-white" /></div>
                            <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter mb-4">Gênio Tático</h3>
                            <p className="text-xs text-purple-200 leading-relaxed font-medium mb-6">Descreva o objetivo do seu treino e a IA gerará o roteiro minuto-a-minuto com foco técnico.</p>
                            
                            <textarea 
                                className="w-full bg-black/40 border border-purple-500/20 rounded-2xl p-4 text-xs text-white focus:border-purple-500 outline-none placeholder-purple-900/50 resize-none h-32 mb-4"
                                placeholder="Ex: Preciso de um treino de 90min focado em tackles seguros para iniciantes..."
                                value={aiPrompt}
                                onChange={e => setAiPrompt(e.target.value)}
                            />

                            <button 
                                onClick={handleGenerateAI} 
                                disabled={isGenerating || !aiPrompt}
                                className="w-full bg-purple-600 hover:bg-purple-500 text-white font-black py-4 rounded-2xl uppercase text-[10px] shadow-lg flex justify-center items-center gap-2 transition-all disabled:opacity-50"
                            >
                                {isGenerating ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : 'GERAR ROTEIRO MÁGICO'}
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-slide-in">
                    {practices.map(p => <SessionCard key={p.id} session={p} />)}
                    {practices.length === 0 && (
                        <div className="col-span-full py-40 text-center opacity-30">
                            <CalendarIcon className="w-16 h-16 mx-auto mb-4" />
                            <p className="font-black uppercase tracking-widest">Nenhum script na biblioteca</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default TrainingHub;