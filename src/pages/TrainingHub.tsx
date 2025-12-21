
import React, { useState, useEffect, useCallback, memo } from 'react';
import PageHeader from '../components/PageHeader';
import { storageService } from '../services/storageService';
import { PracticeSession, PracticeScriptItem } from '../types';
import { WhistleIcon, SparklesIcon, ClockIcon, TrashIcon, PlusIcon, CalendarIcon } from '../components/icons/UiIcons';
import { useToast } from '../contexts/ToastContext';
import { generatePracticeScript } from '../services/geminiService';
import Card from '../components/Card';

// Componente Memoizado para evitar re-renders pesados durante a edição do script
const DrillItem = memo(({ item, onRemove, onUpdate }: { 
    item: PracticeScriptItem, 
    onRemove: (id: string) => void, 
    onUpdate: (id: string, field: string, val: any) => void 
}) => (
    <div className="bg-black/20 p-3 rounded-xl border border-white/5 flex gap-3 items-center animate-fade-in group hover:border-highlight/30 transition-all">
        <div className="flex flex-col">
            <span className="text-[8px] text-text-secondary uppercase font-black">Início</span>
            <input 
                type="time"
                className="bg-transparent text-highlight font-mono font-bold text-xs outline-none"
                value={item.startTime}
                onChange={(e) => onUpdate(item.id, 'startTime', e.target.value)}
            />
        </div>
        <div className="flex-1">
            <span className="text-[8px] text-text-secondary uppercase font-black">Atividade</span>
            <input 
                className="w-full bg-transparent text-xs text-white outline-none border-b border-transparent focus:border-highlight font-bold" 
                value={item.activityName} 
                onChange={(e) => onUpdate(item.id, 'activityName', e.target.value)} 
                placeholder="Ex: Individual Drills"
            />
        </div>
        <div className="w-16">
            <span className="text-[8px] text-text-secondary uppercase font-black">Duração</span>
            <div className="flex items-center gap-1">
                <input 
                    type="number"
                    className="w-8 bg-transparent text-xs text-white outline-none font-bold" 
                    value={item.durationMinutes} 
                    onChange={(e) => onUpdate(item.id, 'durationMinutes', Number(e.target.value))} 
                />
                <span className="text-[8px] text-text-secondary">min</span>
            </div>
        </div>
        <button onClick={() => onRemove(item.id)} className="text-red-500/30 hover:text-red-500 transition-colors mt-2"><TrashIcon className="w-4 h-4"/></button>
    </div>
));

const TrainingHub: React.FC = () => {
    const toast = useToast();
    const [practices, setPractices] = useState<PracticeSession[]>([]);
    
    // Form State
    const [manualTitle, setManualTitle] = useState('');
    const [manualDate, setManualDate] = useState(new Date().toISOString().split('T')[0]);
    const [manualTime, setManualTime] = useState('19:00');
    const [manualFocus, setManualFocus] = useState('GERAL');
    const [manualScript, setManualScript] = useState<PracticeScriptItem[]>([]);
    
    const [aiPrompt, setAiPrompt] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);

    useEffect(() => {
        setPractices(storageService.getPracticeSessions());
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
        if (!manualTitle) {
            toast.warning("Dê um nome ao treino!");
            return;
        }
        const newSession: PracticeSession = {
            id: `man-${Date.now()}`,
            title: manualTitle,
            focus: manualFocus,
            date: new Date(manualDate),
            startTime: manualTime,
            attendees: [], // Confirmados virão via RSVP do atleta
            script: manualScript
        };
        const updated = [newSession, ...practices];
        storageService.savePracticeSessions(updated);
        setPractices(updated);
        
        // Reset form
        setManualTitle('');
        setManualScript([]);
        toast.success("Treino agendado com sucesso!");
    };

    const handleGenerateAI = async () => {
        if (!aiPrompt) return;
        setIsGenerating(true);
        try {
            const script = await generatePracticeScript(aiPrompt, 120, "High");
            const newSession: PracticeSession = {
                id: `ai-${Date.now()}`,
                title: `IA: ${aiPrompt.substring(0, 20)}...`,
                focus: "INTEL",
                date: new Date(manualDate),
                startTime: manualTime,
                attendees: [],
                script: script
            };
            const updated = [newSession, ...practices];
            storageService.savePracticeSessions(updated);
            setPractices(updated);
            setAiPrompt('');
            toast.success("Mago gerou o roteiro completo!");
        } catch (e) {
            toast.error("Erro na inteligência Gemini.");
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="space-y-6 animate-fade-in pb-20 max-w-7xl mx-auto">
            <PageHeader title="Training Day Matrix" subtitle="Agendamento e Planejamento Tático." />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* COLUNA 1: COMANDO MANUAL (DEIXA QUE EU FAÇO) */}
                <div className="bg-secondary/40 rounded-[2.5rem] border-2 border-highlight p-8 flex flex-col h-[700px] shadow-2xl relative overflow-hidden">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-highlight/20 rounded-xl text-highlight">
                                <WhistleIcon className="w-6 h-6" />
                            </div>
                            <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">Deixa que eu Faço</h3>
                        </div>
                    </div>

                    <div className="space-y-6 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="col-span-2">
                                <label className="text-[10px] font-black text-text-secondary uppercase mb-2 block ml-1 tracking-widest">Título da Missão</label>
                                <input 
                                    className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-white text-sm focus:border-highlight outline-none transition-all" 
                                    placeholder="Ex: Ajuste de Blitz e Redzone" 
                                    value={manualTitle} 
                                    onChange={e => setManualTitle(e.target.value)} 
                                />
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-text-secondary uppercase mb-2 block ml-1 tracking-widest">Data do Campo</label>
                                <div className="relative">
                                    <input 
                                        type="date" 
                                        className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-white text-sm focus:border-highlight outline-none" 
                                        value={manualDate} 
                                        onChange={e => setManualDate(e.target.value)} 
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="text-[10px] font-black text-text-secondary uppercase mb-2 block ml-1 tracking-widest">Hora Kickoff</label>
                                <input 
                                    type="time" 
                                    className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 text-white text-sm focus:border-highlight outline-none" 
                                    value={manualTime} 
                                    onChange={e => setManualTime(e.target.value)} 
                                />
                            </div>
                        </div>

                        <div className="pt-6 border-t border-white/5">
                            <div className="flex justify-between items-center mb-4">
                                <span className="text-[10px] font-black text-highlight uppercase tracking-[0.2em]">Cronograma de Drills</span>
                                <button onClick={addManualDrill} className="flex items-center gap-2 bg-highlight/10 hover:bg-highlight text-highlight hover:text-white px-3 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all">
                                    <PlusIcon className="w-3 h-3" /> Add Drill
                                </button>
                            </div>
                            <div className="space-y-3">
                                {manualScript.map((item) => (
                                    <DrillItem 
                                        key={item.id} 
                                        item={item} 
                                        onRemove={handleRemoveDrill} 
                                        onUpdate={handleUpdateDrill}
                                    />
                                ))}
                                {manualScript.length === 0 && (
                                    <div className="text-center py-10 border-2 border-dashed border-white/5 rounded-3xl opacity-30">
                                        <p className="text-xs font-bold uppercase">Nenhum drill adicionado</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    <button 
                        onClick={handleSaveManual} 
                        disabled={!manualTitle}
                        className="mt-8 w-full bg-highlight hover:bg-highlight-hover text-white font-black py-5 rounded-3xl shadow-glow uppercase text-sm transform active:scale-95 transition-all disabled:opacity-50"
                    >
                        PUBLICAR TREINO NO CALENDÁRIO
                    </button>
                </div>

                {/* COLUNA 2: MAGO IA (ESTRATÉGIA) */}
                <div className="bg-secondary/40 rounded-[2.5rem] border-2 border-purple-500 p-8 flex flex-col h-[700px] relative overflow-hidden shadow-2xl">
                    <div className="absolute top-0 right-0 p-8 opacity-5">
                        <SparklesIcon className="w-48 h-48 text-white" />
                    </div>
                    
                    <div className="relative z-10 flex flex-col h-full">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="p-3 bg-purple-500/20 rounded-xl text-purple-400">
                                <SparklesIcon className="w-6 h-6" />
                            </div>
                            <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">Mago da Estratégia</h3>
                        </div>

                        <div className="space-y-6 flex-1">
                            <p className="text-sm text-text-secondary leading-relaxed">
                                Descreva o foco tático e o tempo total. A IA irá sugerir os melhores drills da NFL e NCAA para sua unidade.
                            </p>
                            <textarea 
                                className="w-full bg-black/40 border-2 border-purple-500/30 rounded-3xl p-6 text-white text-sm focus:border-purple-500 outline-none h-48 placeholder-purple-900/50"
                                placeholder="Ex: Preciso de um treino de 90min para Linebackers focado em leitura de gaps e tackle em campo aberto..."
                                value={aiPrompt}
                                onChange={e => setAiPrompt(e.target.value)}
                            />
                            <div className="bg-purple-900/10 p-5 rounded-3xl border border-purple-500/20">
                                <p className="text-[10px] text-purple-300 font-black uppercase mb-3 tracking-widest">Sugestões de Contexto:</p>
                                <div className="flex flex-wrap gap-2">
                                    {['Ajuste de Redzone', 'Foco em Blitz', 'Especiais (Punt)', 'Fundamentos QB'].map(s => (
                                        <button key={s} onClick={() => setAiPrompt(s)} className="px-4 py-2 bg-white/5 rounded-xl text-[10px] font-bold text-text-secondary hover:bg-purple-600 hover:text-white transition-all"># {s}</button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <button 
                            onClick={handleGenerateAI} 
                            disabled={isGenerating || !aiPrompt} 
                            className="mt-8 w-full bg-purple-600 hover:bg-purple-500 text-white font-black py-5 rounded-3xl shadow-[0_0_30px_rgba(147,51,234,0.3)] uppercase text-sm flex items-center justify-center gap-2 transform active:scale-95 transition-all disabled:opacity-50"
                        >
                            {isGenerating ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : 'CONVOCAR MAGO E GERAR ROTEIRO'}
                        </button>
                    </div>
                </div>
            </div>

            {/* LISTA DE TREINOS AGENDADOS (LZY PREVIEW) */}
            <div className="mt-12">
                <h3 className="text-xl font-black text-white italic uppercase tracking-tighter mb-6 px-2">Próximas Sessões</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {practices.slice(0, 6).map(p => (
                        <div key={p.id} className="bg-secondary p-6 rounded-[2rem] border border-white/5 group hover:border-highlight transition-all">
                            <div className="flex justify-between items-start mb-4">
                                <span className="text-[10px] font-black text-highlight bg-highlight/10 px-3 py-1 rounded-full uppercase">{new Date(p.date).toLocaleDateString('pt-BR', { weekday: 'short' })}</span>
                                <span className="text-[10px] font-mono text-text-secondary">{new Date(p.date).toLocaleDateString()} • {p.startTime}</span>
                            </div>
                            <h4 className="text-lg font-black text-white uppercase italic leading-none">{p.title}</h4>
                            <p className="text-xs text-text-secondary mt-2">Foco: <span className="text-white">{p.focus}</span></p>
                            <div className="mt-6 pt-4 border-t border-white/5 flex justify-between items-center">
                                <span className="text-[10px] font-bold text-text-secondary">{p.script?.length || 0} Drills Planejados</span>
                                <button onClick={() => window.location.href=`#/practice-execution/${p.id}`} className="text-[10px] font-black text-highlight hover:underline uppercase">Ver Detalhes →</button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default TrainingHub;