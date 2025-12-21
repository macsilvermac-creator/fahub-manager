
import React, { useState, useEffect } from 'react';
import PageHeader from '../components/PageHeader';
import Card from '../components/Card';
import { storageService } from '../services/storageService';
import { PracticeSession, PracticeScriptItem } from '../types';
import { 
    WhistleIcon, SparklesIcon, ClockIcon, 
    TrashIcon, PlusIcon, SearchIcon, CheckCircleIcon 
} from '../components/icons/UiIcons';
import { useToast } from '../contexts/ToastContext';
import { generatePracticeScript } from '../services/geminiService';

const TrainingHub: React.FC = () => {
    const toast = useToast();
    const [practices, setPractices] = useState<PracticeSession[]>([]);
    
    // --- ESTADOS COMANDO MANUAL ---
    const [manualTitle, setManualTitle] = useState('');
    const [manualFocus, setManualFocus] = useState('OFFENSE');
    const [manualDuration, setManualDuration] = useState(120);
    const [manualScript, setManualScript] = useState<PracticeScriptItem[]>([]);

    // --- ESTADOS MAGO IA ---
    const [aiPrompt, setAiPrompt] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);
    const [aiSearch, setAiSearch] = useState('');

    useEffect(() => {
        setPractices(storageService.getPracticeSessions());
        return storageService.subscribe('storage_update', () => {
            setPractices(storageService.getPracticeSessions());
        });
    }, []);

    // --- LÓGICA MANUAL ---
    const addManualDrill = () => {
        const newItem: PracticeScriptItem = {
            id: `dr-${Date.now()}`,
            startTime: manualScript.length === 0 ? "19:00" : "19:15", // Simplificado para demo
            durationMinutes: 15,
            activityName: "Novo Drill",
            type: 'TECHNICAL'
        };
        setManualScript([...manualScript, newItem]);
    };

    const handleSaveManual = () => {
        if (!manualTitle) {
            toast.warning("Dê um nome ao treino!");
            return;
        }
        const newSession: PracticeSession = {
            id: `man-${Date.now()}`,
            title: manualTitle,
            focus: manualFocus,
            date: new Date(),
            attendees: [],
            script: manualScript
        };
        const updated = [newSession, ...practices];
        storageService.savePracticeSessions(updated);
        setManualTitle('');
        setManualScript([]);
        toast.success("Treino manual salvo e disparado!");
    };

    // --- LÓGICA IA ---
    const handleGenerateAI = async (preset?: string) => {
        const prompt = preset || aiPrompt;
        if (!prompt) return;

        setIsGenerating(true);
        try {
            const script = await generatePracticeScript(prompt, 120, "High");
            const newSession: PracticeSession = {
                id: `ai-${Date.now()}`,
                title: `IA: ${prompt.substring(0, 20)}...`,
                focus: "INTEL",
                date: new Date(),
                attendees: [],
                script: script
            };
            const updated = [newSession, ...practices];
            storageService.savePracticeSessions(updated);
            setAiPrompt('');
            toast.success("Mago gerou o roteiro com sucesso!");
        } catch (e) {
            toast.error("Erro na inteligência Gemini.");
        } finally {
            setIsGenerating(false);
        }
    };

    const manualHistory = practices.filter(p => String(p.id).startsWith('man'));
    const aiHistory = practices.filter(p => String(p.id).startsWith('ai'))
        .filter(p => p.title.toLowerCase().includes(aiSearch.toLowerCase()));

    const inputClass = "w-full bg-black/20 border border-white/10 rounded-xl p-3 text-white text-xs focus:border-highlight outline-none transition-all";

    return (
        <div className="space-y-6 animate-fade-in pb-20 max-w-7xl mx-auto">
            <PageHeader title="Training Day Matrix" subtitle="O cérebro tático do Head Coach." />

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* 1. SUPERIOR ESQUERDO: COMANDO MANUAL */}
                <div className="bg-secondary/40 rounded-[2.5rem] border-2 border-highlight p-6 flex flex-col h-[500px]">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 bg-highlight/20 rounded-xl text-highlight">
                            <WhistleIcon className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-black text-white italic uppercase tracking-tighter">Deixa que eu Faço</h3>
                    </div>

                    <div className="space-y-4 flex-1 overflow-y-auto pr-2 custom-scrollbar">
                        <div className="grid grid-cols-2 gap-3">
                            <div className="col-span-2">
                                <label className="text-[9px] font-black text-text-secondary uppercase mb-1 block ml-1">Título do Treino</label>
                                <input className={inputClass} placeholder="Ex: Preparação Blitz" value={manualTitle} onChange={e => setManualTitle(e.target.value)} />
                            </div>
                            <div>
                                <label className="text-[9px] font-black text-text-secondary uppercase mb-1 block ml-1">Foco</label>
                                <select className={inputClass} value={manualFocus} onChange={e => setManualFocus(e.target.value)}>
                                    <option value="OFFENSE">ATAQUE</option>
                                    <option value="DEFENSE">DEFESA</option>
                                    <option value="ST">ESPECIAIS</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-[9px] font-black text-text-secondary uppercase mb-1 block ml-1">Duração (Min)</label>
                                <input type="number" className={inputClass} value={manualDuration} onChange={e => setManualDuration(Number(e.target.value))} />
                            </div>
                        </div>

                        <div className="pt-4 border-t border-white/5">
                            <div className="flex justify-between items-center mb-3">
                                <span className="text-[10px] font-black text-highlight uppercase tracking-widest">Script Manual</span>
                                <button onClick={addManualDrill} className="p-1 bg-highlight/10 text-highlight rounded hover:bg-highlight hover:text-white transition-all">
                                    <PlusIcon className="w-4 h-4" />
                                </button>
                            </div>
                            <div className="space-y-2">
                                {manualScript.map((item, idx) => (
                                    <div key={item.id} className="bg-black/40 p-2 rounded-lg border border-white/5 flex gap-3 items-center">
                                        <span className="text-[10px] font-mono text-text-secondary">{item.startTime}</span>
                                        <input className="flex-1 bg-transparent text-xs text-white outline-none" value={item.activityName} onChange={(e) => {
                                            const s = [...manualScript];
                                            s[idx].activityName = e.target.value;
                                            setManualScript(s);
                                        }} />
                                        <button onClick={() => setManualScript(manualScript.filter(i => i.id !== item.id))} className="text-red-500/50 hover:text-red-500"><TrashIcon className="w-3 h-3"/></button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <button onClick={handleSaveManual} className="mt-6 w-full bg-highlight hover:bg-highlight-hover text-white font-black py-4 rounded-2xl shadow-glow uppercase text-xs transform active:scale-95 transition-all">
                        SALVAR E DISPARAR TREINO
                    </button>
                </div>

                {/* 2. SUPERIOR DIREITO: BIBLIOTECA DO COACH */}
                <div className="bg-secondary/40 rounded-[2.5rem] border border-white/5 p-6 flex flex-col h-[500px]">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 bg-white/5 rounded-xl text-text-secondary">
                            <ClockIcon className="w-6 h-6" />
                        </div>
                        <h3 className="text-xl font-black text-white italic uppercase tracking-tighter">Biblioteca do Coach</h3>
                    </div>

                    <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                        {manualHistory.length === 0 && <p className="text-center py-20 text-text-secondary italic text-xs">Nenhum treino manual registrado.</p>}
                        {manualHistory.map(p => (
                            <div key={p.id} className="bg-black/20 p-4 rounded-2xl border border-white/5 hover:border-highlight transition-all flex justify-between items-center group">
                                <div>
                                    <p className="text-[8px] text-highlight font-black uppercase mb-1">{new Date(p.date).toLocaleDateString()}</p>
                                    <h4 className="text-sm font-bold text-white uppercase">{p.title}</h4>
                                    <p className="text-[10px] text-text-secondary uppercase">{p.focus} • {p.script?.length} DRILLS</p>
                                </div>
                                <button onClick={() => { setManualTitle(p.title); setManualScript(p.script || []); }} className="opacity-0 group-hover:opacity-100 bg-white/5 text-white px-3 py-1 rounded-lg text-[10px] font-black uppercase border border-white/10 hover:bg-highlight transition-all">Clonar</button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* 3. INFERIOR ESQUERDO: MAGO IA */}
                <div className="bg-secondary/40 rounded-[2.5rem] border-2 border-purple-500 p-6 flex flex-col h-[500px] relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-8 opacity-5">
                        <SparklesIcon className="w-32 h-32 text-purple-400" />
                    </div>
                    
                    <div className="relative z-10 flex flex-col h-full">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="p-3 bg-purple-500/20 rounded-xl text-purple-400">
                                <SparklesIcon className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-black text-white italic uppercase tracking-tighter">Mago da Estratégia</h3>
                        </div>

                        <div className="space-y-6 flex-1">
                            <div>
                                <label className="text-[10px] font-black text-purple-300 uppercase mb-3 block ml-1">O que vamos instalar hoje, Coach?</label>
                                <textarea 
                                    className="w-full bg-black/40 border-2 border-purple-500/30 rounded-2xl p-4 text-white text-sm focus:border-purple-500 outline-none h-32 placeholder-purple-900"
                                    placeholder="Ex: Gere um treino focado em conter o jogo corrido de um time que usa muito a formação I-Formation..."
                                    value={aiPrompt}
                                    onChange={e => setAiPrompt(e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                <p className="text-[9px] font-black text-text-secondary uppercase tracking-widest ml-1">IA Presets Rápidos</p>
                                <div className="grid grid-cols-2 gap-2">
                                    {["Corrigir erros do último jogo", "Preparar contra Blitz", "Ajustar Redzone", "Instalação Cover 3"].map(p => (
                                        <button 
                                            key={p} 
                                            onClick={() => handleGenerateAI(p)}
                                            disabled={isGenerating}
                                            className="p-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-bold text-text-secondary hover:bg-purple-600 hover:text-white transition-all text-left"
                                        >
                                            {p}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <button 
                            onClick={() => handleGenerateAI()}
                            disabled={isGenerating}
                            className="mt-6 w-full bg-purple-600 hover:bg-purple-500 text-white font-black py-4 rounded-2xl shadow-[0_0_20px_rgba(147,51,234,0.3)] uppercase text-xs flex items-center justify-center gap-2"
                        >
                            {isGenerating ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <SparklesIcon className="w-4 h-4" />}
                            GERAR ROTEIRO MÁGICO
                        </button>
                    </div>
                </div>

                {/* 4. INFERIOR DIREITO: ARQUIVO DE INTELIGÊNCIA */}
                <div className="bg-secondary/40 rounded-[2.5rem] border border-white/5 p-6 flex flex-col h-[500px]">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-purple-500/10 rounded-xl text-purple-400">
                                <CheckCircleIcon className="w-6 h-6" />
                            </div>
                            <h3 className="text-xl font-black text-white italic uppercase tracking-tighter">Arquivo de Inteligência</h3>
                        </div>
                        <div className="relative w-full md:w-48">
                            <SearchIcon className="absolute left-3 top-2.5 w-3 h-3 text-text-secondary" />
                            <input className="w-full bg-black/20 border border-white/10 rounded-full pl-8 pr-4 py-2 text-[10px] text-white outline-none focus:border-purple-500" placeholder="Filtrar por tema..." value={aiSearch} onChange={e => setAiSearch(e.target.value)} />
                        </div>
                    </div>

                    <div className="flex-1 overflow-y-auto pr-2 space-y-3 custom-scrollbar">
                        {aiHistory.length === 0 && <p className="text-center py-20 text-text-secondary italic text-xs">A IA ainda não gerou nada arquivado.</p>}
                        {aiHistory.map(p => (
                            <div key={p.id} className="bg-purple-900/10 p-4 rounded-2xl border border-purple-500/20 hover:border-purple-500 transition-all group relative overflow-hidden">
                                <div className="absolute top-2 right-2 bg-purple-600 text-white text-[7px] font-black px-1.5 py-0.5 rounded">AI GENERATED</div>
                                <div>
                                    <p className="text-[8px] text-purple-400 font-black uppercase mb-1">{new Date(p.date).toLocaleDateString()}</p>
                                    <h4 className="text-sm font-bold text-white uppercase pr-16 line-clamp-1">{p.title}</h4>
                                    <p className="text-[10px] text-text-secondary uppercase mt-1">Sugerido pela IA Mago</p>
                                </div>
                                <div className="mt-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button className="bg-purple-600 text-white px-3 py-1 rounded-lg text-[9px] font-black uppercase">Re-Ativar</button>
                                    <button className="bg-white/5 text-text-secondary px-3 py-1 rounded-lg text-[9px] font-black uppercase border border-white/10">Ver Roteiro</button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
};

export default TrainingHub;