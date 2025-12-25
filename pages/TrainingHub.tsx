
import React, { useState, useEffect, useContext, useCallback, memo, useMemo } from 'react';
import PageHeader from '../components/PageHeader';
import Card from '../components/Card';
import { storageService } from '../services/storageService';
import { PracticeSession, PracticeScriptItem, PracticeTarget } from '../types';
import { 
    WhistleIcon, SparklesIcon, ClockIcon, TrashIcon, 
    PlusIcon, CalendarIcon, UsersIcon, CheckCircleIcon, 
    ChevronRightIcon 
} from '../components/icons/UiIcons';
import { useToast } from '../contexts/ToastContext';
import { generatePracticeScript } from '../services/geminiService';
import { UserContext, UserContextType } from '../components/Layout';
import { useNavigate } from 'react-router-dom';

const DrillItem = memo(({ item, onRemove, onUpdate }: { 
    item: PracticeScriptItem, 
    onRemove: (id: string) => void, 
    onUpdate: (id: string, field: string, val: any) => void 
}) => (
    <div className="bg-black/20 p-3 rounded-xl border border-white/5 flex gap-3 items-center animate-fade-in group hover:border-highlight/30 transition-all">
        <div className="flex flex-col shrink-0">
            <input 
                type="time"
                className="bg-transparent text-highlight font-mono font-black text-xs outline-none"
                value={item.startTime}
                onChange={(e) => onUpdate(item.id, 'startTime', e.target.value)}
            />
        </div>
        <div className="flex-1">
            <input 
                className="w-full bg-transparent text-xs text-white outline-none border-b border-transparent focus:border-highlight font-bold" 
                value={item.activityName} 
                onChange={(e) => onUpdate(item.id, 'activityName', e.target.value)} 
                placeholder="Nome do Drill..."
            />
        </div>
        <div className="w-12">
            <input 
                type="number"
                className="w-full bg-transparent text-xs text-white outline-none font-bold text-right" 
                value={item.durationMinutes} 
                onChange={(e) => onUpdate(item.id, 'durationMinutes', Number(e.target.value))} 
            />
        </div>
        <button onClick={() => onRemove(item.id)} className="text-red-500/30 hover:text-red-500 transition-colors">
            <TrashIcon className="w-4 h-4"/>
        </button>
    </div>
));

const SessionCard = ({ session, onClick }: { session: PracticeSession, onClick: () => void }) => {
    const isIA = session.source === 'AI';
    return (
        <div 
            onClick={onClick}
            className="bg-black/40 p-5 rounded-[2rem] border border-white/5 group hover:border-highlight transition-all relative overflow-hidden cursor-pointer"
        >
            {isIA && <div className="absolute top-0 right-0 p-4 opacity-10"><SparklesIcon className="w-10 h-10 text-purple-400"/></div>}
            <div className="flex justify-between items-start mb-3">
                <span className={`text-[9px] font-black px-3 py-1 rounded-full uppercase tracking-widest ${isIA ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30' : 'bg-highlight/20 text-highlight border border-highlight/30'}`}>
                    {session.target || 'GERAL'}
                </span>
                <span className="text-[10px] font-mono text-text-secondary font-bold">
                    {new Date(session.date).toLocaleDateString('pt-BR')}
                </span>
            </div>
            <h4 className="text-sm font-black text-white uppercase italic truncate mb-4">{session.title}</h4>
            <div className="flex justify-between items-center border-t border-white/5 pt-4">
                <div className="flex items-center gap-1.5 text-[10px] text-text-secondary font-black uppercase">
                    <ClockIcon className="w-3 h-3"/> {session.script?.length || 0} Drills
                </div>
                <span className="text-[10px] font-black text-highlight uppercase tracking-widest group-hover:translate-x-1 transition-transform flex items-center gap-1">
                    Detalhes <ChevronRightIcon className="w-3 h-3" />
                </span>
            </div>
        </div>
    );
};

const TrainingHub: React.FC = () => {
    const { currentRole } = useContext(UserContext) as UserContextType;
    const navigate = useNavigate();
    const toast = useToast();
    const [practices, setPractices] = useState<PracticeSession[]>([]);
    const [view, setView] = useState<'BUILDER' | 'LIBRARY'>('BUILDER');
    const isPlayer = currentRole === 'PLAYER';
    const currentUser = storageService.getCurrentUser();
    
    // Coach Form States
    const [manualTitle, setManualTitle] = useState('');
    const [manualDate, setManualDate] = useState(new Date().toISOString().split('T')[0]);
    const [manualTime, setManualTime] = useState('19:30');
    const [manualTarget, setManualTarget] = useState<PracticeTarget>('FULL_TEAM');
    const [manualFocus, setManualFocus] = useState('INSTALAÇÃO');
    const [manualScript, setManualScript] = useState<PracticeScriptItem[]>([]);
    
    // IA States
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
        if (!manualTitle) return toast.warning("Dê um nome à sua sessão!");
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
        if (!aiPrompt) return toast.warning("Descreva o objetivo do treino para a IA.");
        setIsGenerating(true);
        try {
            const script = await generatePracticeScript(aiPrompt, 120, "High Intensity");
            const newSession: PracticeSession = {
                id: `ai-${Date.now()}`,
                title: `IA: ${aiPrompt.substring(0, 30)}...`,
                focus: "INTEL",
                date: new Date(manualDate),
                startTime: manualTime,
                target: 'FULL_TEAM',
                source: 'AI',
                attendees: [],
                script: script
            };
            storageService.savePracticeSessions([newSession, ...practices]);
            setAiPrompt('');
            toast.success("O roteiro tático foi gerado com sucesso!");
        } catch (e) {
            toast.error("IA temporariamente indisponível.");
        } finally {
            setIsGenerating(false);
        }
    };

    const sortedPractices = useMemo(() => {
        return [...practices].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    }, [practices]);

    if (isPlayer) {
        return (
            <div className="space-y-6 animate-fade-in pb-20">
                <PageHeader title="Minha Agenda" subtitle="Estude o plano de hoje e confirme presença." />
                <div className="grid grid-cols-1 gap-4">
                    {sortedPractices.length > 0 ? (
                        sortedPractices.map(p => {
                            const isConfirmed = p.attendees?.includes(currentUser.name);
                            return (
                                <div 
                                    key={p.id} 
                                    onClick={() => navigate(`/practice-detail/${p.id}`)}
                                    className="bg-secondary/40 p-6 rounded-[2.5rem] border border-white/5 hover:border-highlight group transition-all flex flex-col md:flex-row justify-between items-center gap-6 cursor-pointer shadow-xl"
                                >
                                    <div className="flex items-center gap-6 w-full md:w-auto">
                                        <div className={`w-16 h-16 rounded-2xl flex flex-col items-center justify-center border transition-all ${isConfirmed ? 'bg-highlight/10 border-highlight text-highlight' : 'bg-white/5 border-white/10 text-white'}`}>
                                            <span className="text-[10px] font-black uppercase leading-none">{new Date(p.date).toLocaleDateString('pt-BR', { month: 'short' })}</span>
                                            <span className="text-2xl font-black">{new Date(p.date).getDate()}</span>
                                        </div>
                                        <div>
                                            <h4 className="text-xl font-black text-white uppercase italic group-hover:text-highlight transition-colors">{p.title}</h4>
                                            <div className="flex gap-4 mt-1">
                                                <span className="text-[10px] font-bold text-text-secondary flex items-center gap-1 uppercase tracking-widest">
                                                    <ClockIcon className="w-3 h-3"/> {p.startTime || '19:30'}
                                                </span>
                                                <span className="text-[10px] font-bold text-blue-400 flex items-center gap-1 uppercase tracking-widest">
                                                    <WhistleIcon className="w-3 h-3"/> {p.focus}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-4 w-full md:w-auto justify-between">
                                        {isConfirmed ? (
                                            <span className="bg-highlight/20 text-highlight text-[10px] font-black px-4 py-2 rounded-xl uppercase tracking-widest border border-highlight/30 flex items-center gap-2">
                                                <CheckCircleIcon className="w-4 h-4"/> Confirmado
                                            </span>
                                        ) : (
                                            <span className="bg-red-600/10 text-red-500 text-[10px] font-black px-4 py-2 rounded-xl uppercase tracking-widest border border-red-500/30">Pendente</span>
                                        )}
                                        <ChevronRightIcon className="w-6 h-6 text-text-secondary group-hover:text-white group-hover:translate-x-1 transition-all" />
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="py-40 text-center opacity-30 border-2 border-dashed border-white/10 rounded-[3rem]">
                            <CalendarIcon className="w-16 h-16 mx-auto mb-4" />
                            <p className="font-black uppercase tracking-widest">Nenhum treino agendado</p>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-fade-in pb-20">
            <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4">
                <PageHeader title="Training Command" subtitle="Crie roteiros táticos minuto a minuto." />
                <div className="flex bg-secondary p-1 rounded-2xl border border-white/5 shadow-xl">
                    <button onClick={() => setView('BUILDER')} className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase transition-all ${view === 'BUILDER' ? 'bg-highlight text-white shadow-glow' : 'text-text-secondary hover:text-white'}`}>Builder</button>
                    <button onClick={() => setView('LIBRARY')} className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase transition-all ${view === 'LIBRARY' ? 'bg-highlight text-white shadow-glow' : 'text-text-secondary hover:text-white'}`}>Histórico</button>
                </div>
            </div>

            {view === 'BUILDER' ? (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                    <div className="lg:col-span-7 space-y-6">
                        <Card title="Planejador Manual" className="border-highlight/20 h-full flex flex-col">
                            <div className="space-y-4 flex-1">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <input className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-sm text-white focus:border-highlight outline-none transition-all" placeholder="Título da Sessão" value={manualTitle} onChange={e => setManualTitle(e.target.value)} />
                                    <input type="date" className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-sm text-white focus:border-highlight outline-none" value={manualDate} onChange={e => setManualDate(e.target.value)} />
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                    <input type="time" className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-xs text-white focus:border-highlight outline-none" value={manualTime} onChange={e => setManualTime(e.target.value)} />
                                    <select className="col-span-2 bg-black/40 border border-white/10 rounded-xl p-3 text-[10px] font-black uppercase text-white focus:border-highlight outline-none" value={manualTarget} onChange={e => setManualTarget(e.target.value as any)}>
                                        <option value="FULL_TEAM">Todo o Time</option>
                                        <option value="OFFENSE">Unidade: Ataque</option>
                                        <option value="DEFENSE">Unidade: Defesa</option>
                                    </select>
                                    <input className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-xs text-white focus:border-highlight outline-none" placeholder="Foco (ex: Blitz)" value={manualFocus} onChange={e => setManualFocus(e.target.value)} />
                                </div>
                                <div className="pt-6 border-t border-white/5">
                                    <div className="flex justify-between items-center mb-4">
                                        <h4 className="text-[10px] font-black text-highlight uppercase tracking-[0.2em]">Practice Script</h4>
                                        <button onClick={addManualDrill} className="p-2 bg-highlight/10 text-highlight rounded-xl hover:bg-highlight hover:text-white transition-all"><PlusIcon className="w-5 h-5"/></button>
                                    </div>
                                    <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                        {manualScript.map(item => <DrillItem key={item.id} item={item} onRemove={handleRemoveDrill} onUpdate={handleUpdateDrill} />)}
                                        {manualScript.length === 0 && <p className="text-center py-10 text-text-secondary text-xs italic opacity-30">Adicione drills para compor o roteiro técnico.</p>}
                                    </div>
                                </div>
                            </div>
                            <button onClick={handleSaveManual} className="w-full bg-highlight hover:bg-highlight-hover text-white font-black py-5 rounded-[2rem] uppercase italic tracking-tighter mt-6 shadow-glow transition-all active:scale-95">Publicar Plano de Campo</button>
                        </Card>
                    </div>

                    <div className="lg:col-span-5 space-y-6">
                        <Card title="Geração Mágica (IA)" className="border-purple-500/20 bg-gradient-to-br from-purple-900/5 to-transparent">
                            <p className="text-xs text-purple-300 font-bold uppercase tracking-widest mb-4">Mago Tático Gemini</p>
                            <textarea 
                                className="w-full h-40 bg-black/40 border-2 border-purple-500/20 rounded-2xl p-4 text-sm text-white focus:border-purple-500 outline-none placeholder-purple-900/50 resize-none mb-4 transition-all"
                                placeholder="Descreva o treino: 'Treino de 90min para receivers focado em release e rotas de média distância em Cover 2...'"
                                value={aiPrompt}
                                onChange={e => setAiPrompt(e.target.value)}
                            />
                            <button onClick={handleGenerateAI} disabled={isGenerating} className="w-full bg-purple-600 hover:bg-purple-500 text-white font-black py-4 rounded-2xl uppercase text-[10px] shadow-lg flex justify-center items-center gap-3 transition-all active:scale-95 disabled:opacity-50">
                                {isGenerating ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> : <><SparklesIcon className="w-5 h-5"/> Gerar Roteiro Pro</>}
                            </button>
                        </Card>
                        <div className="bg-blue-600/10 border border-blue-500/30 p-6 rounded-[2.5rem] flex items-center gap-4">
                             <div className="p-3 bg-blue-600/20 rounded-xl text-blue-400"><CalendarIcon className="w-6 h-6"/></div>
                             <div>
                                 <p className="text-white font-black uppercase text-xs">Sincronia de Calendário</p>
                                 <p className="text-[10px] text-text-secondary">Os planos publicados aparecem instantaneamente na agenda dos atletas para estudo.</p>
                             </div>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-slide-in">
                    {practices.map(p => (
                        <SessionCard key={p.id} session={p} onClick={() => navigate(`/practice-execution/${p.id}`)} />
                    ))}
                    {practices.length === 0 && (
                        <div className="col-span-full py-40 text-center opacity-30 border-2 border-dashed border-white/10 rounded-[3rem]">
                            <WhistleIcon className="w-16 h-16 mx-auto mb-4" />
                            <p className="font-black uppercase tracking-widest text-sm">Nenhuma sessão no histórico</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default TrainingHub;