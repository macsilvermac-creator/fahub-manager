
import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import { storageService } from '../services/storageService';
import { PracticeSession, Player, PracticeScriptItem } from '../types';
import { generatePracticeScript } from '../services/geminiService';
import { 
    WhistleIcon, SparklesIcon, ClockIcon, CheckCircleIcon, 
    ActivityIcon, ClipboardIcon, TrashIcon, PenIcon 
} from '../components/icons/UiIcons';
import { useToast } from '../contexts/ToastContext';
import LazyImage from '../components/LazyImage';

// Chaves em ASCII puro para evitar erros de compilação no esbuild/Vercel
const QUICK_BLOCKS = [
    { name: 'Alongamento / Aquecimento', duration: 15, type: 'WARMUP' },
    { name: 'Drills de Posição (Indy)', duration: 25, type: 'TECHNICAL' },
    { name: '7 contra 7 / Skelly', duration: 20, type: 'TACTICAL' },
    { name: 'Inside Run / 9 contra 7', duration: 15, type: 'TACTICAL' },
    { name: 'Período de Time (11 contra 11)', duration: 30, type: 'LIVE' },
    { name: 'Condicionamento / Sprints', duration: 10, type: 'PHYSICAL' },
];

const TrainingHub: React.FC = () => {
    const toast = useToast();
    const [practices, setPractices] = useState<PracticeSession[]>([]);
    const [players, setPlayers] = useState<Player[]>([]);
    const [activeView, setActiveView] = useState<'HUBS' | 'FIELD' | 'BUILDER'>('HUBS');
    
    // Builder State
    const [currentScript, setCurrentScript] = useState<PracticeScriptItem[]>([]);
    const [isGenerating, setIsGenerating] = useState(false);
    const [practiceTitle, setPracticeTitle] = useState('Sessão Técnica');

    useEffect(() => {
        setPractices(storageService.getPracticeSessions());
        setPlayers(storageService.getPlayers());
    }, []);

    const handleCreatePracticeIA = async () => {
        const focus = prompt("Qual o foco técnico para a IA sugerir? (Ex: Blitz & Cover 3)");
        if (!focus) return;

        setIsGenerating(true);
        toast.info("A IA está construindo um rascunho técnico...");
        try {
            const script = await generatePracticeScript(focus, 120, "High");
            setCurrentScript(script);
            setActiveView('BUILDER');
            toast.success("Roteiro gerado! Você pode editar as linhas agora.");
        } catch (e) {
            toast.error("Erro na inteligência.");
        } finally {
            setIsGenerating(false);
        }
    };

    const addManualBlock = (block: typeof QUICK_BLOCKS[0]) => {
        let startTime = '19:00';
        if (currentScript.length > 0) {
            const last = currentScript[currentScript.length - 1];
            const [h, m] = last.startTime.split(':').map(Number);
            const date = new Date();
            date.setHours(h, m + last.durationMinutes);
            startTime = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }

        const newItem: PracticeScriptItem = {
            id: `item-${Date.now()}`,
            startTime,
            durationMinutes: block.duration,
            activityName: block.name,
            description: 'Entrada manual',
            type: block.type as any
        };
        setCurrentScript([...currentScript, newItem]);
        toast.info("Bloco adicionado.");
    };

    const removeBlock = (id: string) => {
        setCurrentScript(currentScript.filter(s => s.id !== id));
    };

    const handleSavePractice = () => {
        if (currentScript.length === 0) return;
        
        const activeProg = storageService.getActiveProgram();
        const newPrac: PracticeSession = {
            id: `pr-${Date.now()}`,
            title: practiceTitle,
            focus: "Customizado",
            date: new Date(),
            attendees: [],
            program: activeProg,
            script: currentScript
        };
        
        const updated = [newPrac, ...practices];
        setPractices(updated);
        storageService.savePracticeSessions(updated);
        storageService.logAuditAction('PRACTICE_CREATED', `Treino "${practiceTitle}" criado via Builder.`);
        toast.success("Treino salvo com sucesso!");
        setActiveView('HUBS');
        setCurrentScript([]);
    };

    return (
        <div className="space-y-6 pb-24 animate-fade-in">
            <header className="flex justify-between items-center px-2">
                <div>
                    <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter">Training Center</h2>
                    <p className="text-highlight text-[10px] font-bold uppercase tracking-widest">Planejamento e Execução</p>
                </div>
                {activeView !== 'HUBS' && (
                    <button onClick={() => setActiveView('HUBS')} className="text-xs font-black text-text-secondary uppercase underline">Sair do Modo Edição</button>
                )}
            </header>

            {activeView === 'HUBS' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <button 
                        onClick={handleCreatePracticeIA}
                        disabled={isGenerating}
                        className="glass-panel bg-gradient-to-br from-purple-900/40 to-secondary border border-white/5 rounded-3xl p-8 flex flex-col items-center justify-center text-center group active:scale-95 transition-all hover:border-purple-500 h-64"
                    >
                        <div className="p-5 bg-purple-500/10 rounded-2xl mb-4 group-hover:scale-110 transition-transform">
                            {isGenerating ? <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div> : <SparklesIcon className="w-12 h-12 text-purple-400" />}
                        </div>
                        <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">IA Coach Assistant</h3>
                        <p className="text-[10px] text-text-secondary font-bold uppercase tracking-widest mt-2 opacity-60">IA gera o rascunho, você ajusta</p>
                    </button>

                    <button 
                        onClick={() => { setActiveView('BUILDER'); setCurrentScript([]); }}
                        className="glass-panel bg-gradient-to-br from-blue-900/40 to-secondary border border-white/5 rounded-3xl p-8 flex flex-col items-center justify-center text-center group active:scale-95 transition-all hover:border-blue-500 h-64"
                    >
                        <div className="p-5 bg-blue-500/10 rounded-2xl mb-4 group-hover:scale-110 transition-transform">
                            <PenIcon className="w-12 h-12 text-blue-400" />
                        </div>
                        <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">Eu Faço Sozinho</h3>
                        <p className="text-[10px] text-text-secondary font-bold uppercase tracking-widest mt-2 opacity-60">Construção manual bloco a bloco</p>
                    </button>

                    <Card title="Últimas Sessões" className="md:col-span-2">
                         <div className="space-y-3">
                            {practices.slice(0,3).map(p => (
                                <div key={p.id} className="flex justify-between items-center p-4 bg-black/20 rounded-2xl border border-white/5">
                                    <div>
                                        <h4 className="text-white font-bold uppercase text-sm">{p.title}</h4>
                                        <p className="text-xs text-text-secondary">{new Date(p.date).toLocaleDateString()} • {p.script?.length || 0} Atividades</p>
                                    </div>
                                    <button onClick={() => setActiveView('FIELD')} className="p-2 bg-white/5 rounded-lg hover:bg-highlight text-white transition-all"><WhistleIcon className="w-4 h-4"/></button>
                                </div>
                            ))}
                            {practices.length === 0 && <p className="text-center text-xs text-text-secondary italic py-4">Nenhum treino agendado.</p>}
                         </div>
                    </Card>
                </div>
            )}

            {activeView === 'BUILDER' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-slide-in">
                    <div className="lg:col-span-8 space-y-4">
                        <Card title="Roteiro em Construção">
                            <div className="mb-6">
                                <label className="text-[10px] font-black text-text-secondary uppercase mb-2 block">Título da Sessão</label>
                                <input 
                                    className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white font-bold focus:border-highlight outline-none" 
                                    value={practiceTitle}
                                    onChange={e => setPracticeTitle(e.target.value)}
                                />
                            </div>

                            <div className="space-y-2">
                                {currentScript.map((item, idx) => (
                                    <div key={item.id} className="flex gap-4 p-4 bg-white/5 rounded-2xl border border-white/5 items-center group">
                                        <div className="text-center w-16">
                                            <span className="font-mono text-highlight font-bold block">{item.startTime}</span>
                                            <span className="text-[9px] text-text-secondary font-black uppercase">{item.durationMinutes}m</span>
                                        </div>
                                        <div className="flex-1">
                                            <input 
                                                className="bg-transparent text-white font-bold text-sm uppercase w-full outline-none" 
                                                value={item.activityName}
                                                onChange={e => {
                                                    const updated = [...currentScript];
                                                    updated[idx].activityName = e.target.value;
                                                    setCurrentScript(updated);
                                                }}
                                            />
                                            <input 
                                                className="bg-transparent text-text-secondary text-[10px] w-full outline-none" 
                                                value={item.description}
                                                onChange={e => {
                                                    const updated = [...currentScript];
                                                    updated[idx].description = e.target.value;
                                                    setCurrentScript(updated);
                                                }}
                                            />
                                        </div>
                                        <button onClick={() => removeBlock(item.id)} className="p-2 text-text-secondary hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all">
                                            <TrashIcon className="w-4 h-4" />
                                        </button>
                                    </div>
                                ))}
                                {currentScript.length === 0 && (
                                    <div className="py-20 text-center opacity-30 border-2 border-dashed border-white/10 rounded-3xl">
                                        <p className="font-black text-xs uppercase">Roteiro Vazio</p>
                                        <p className="text-[10px] mt-1">Use os blocos rápidos ao lado ou IA</p>
                                    </div>
                                )}
                            </div>

                            {currentScript.length > 0 && (
                                <button 
                                    onClick={handleSavePractice}
                                    className="w-full mt-6 bg-highlight text-white font-black py-4 rounded-2xl uppercase shadow-glow transition-all active:scale-95"
                                >
                                    Confirmar e Agendar Treino
                                </button>
                            )}
                        </Card>
                    </div>

                    <div className="lg:col-span-4 space-y-4">
                        <Card title="Peças do Quebra-Cabeça">
                            <p className="text-[10px] text-text-secondary uppercase mb-4 font-bold">Clique para adicionar ao script</p>
                            <div className="grid grid-cols-1 gap-2">
                                {QUICK_BLOCKS.map(block => (
                                    <button 
                                        key={block.name}
                                        onClick={() => addManualBlock(block)}
                                        className="bg-secondary p-4 rounded-xl border border-white/5 hover:border-highlight text-left flex justify-between items-center transition-all active:scale-95"
                                    >
                                        <div>
                                            <p className="text-white font-bold text-xs uppercase">{block.name}</p>
                                            <p className="text-[9px] text-text-secondary font-black">{block.duration} MINUTOS</p>
                                        </div>
                                        <span className="text-highlight text-xl">+</span>
                                    </button>
                                ))}
                            </div>
                        </Card>

                        <div className="p-6 bg-purple-900/20 rounded-3xl border border-purple-500/20 text-center">
                            <SparklesIcon className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                            <p className="text-xs text-purple-200 font-bold mb-3 uppercase">Precisa de Inspiração?</p>
                            <button 
                                onClick={handleCreatePracticeIA}
                                className="w-full py-2 bg-purple-600 text-white text-[10px] font-black rounded-lg uppercase"
                            >
                                Perguntar ao Gemini
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {activeView === 'FIELD' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-slide-in">
                    <div className="lg:col-span-2 space-y-4">
                        <h3 className="font-black text-white uppercase italic tracking-widest text-sm flex items-center gap-2">
                            <ClockIcon className="w-5 h-5 text-blue-400"/> Próximo Treino Agendado
                        </h3>
                        {practices.length > 0 && practices[0].script ? (
                            <div className="space-y-2">
                                {practices[0].script.map((step: any, idx: number) => (
                                    <div key={idx} className="bg-secondary p-4 rounded-2xl border border-white/5 flex justify-between items-center group hover:border-highlight transition-all">
                                        <div className="flex items-center gap-4">
                                            <span className="text-blue-400 font-mono font-bold text-lg">{step.startTime}</span>
                                            <div>
                                                <p className="text-white font-bold text-sm uppercase">{step.activityName}</p>
                                                <p className="text-[10px] text-text-secondary uppercase">{step.type}</p>
                                            </div>
                                        </div>
                                        <div className="bg-white/5 px-4 py-1 rounded-lg text-xs font-black text-white group-hover:bg-highlight group-hover:text-black transition-colors">{step.durationMinutes}m</div>
                                    </div>
                                ))}
                            </div>
                        ) : <p className="opacity-30 italic text-center py-10 font-bold uppercase text-xs">Nenhum roteiro carregado.</p>}
                    </div>

                    <Card title="Quick RPE (Check-out)">
                        <p className="text-[10px] text-text-secondary mb-4">Ao fim do treino, valide a carga com os atletas.</p>
                        <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                             {players.map(p => (
                                 <div key={p.id} className="flex items-center justify-between p-3 bg-black/20 rounded-xl border border-white/5">
                                     <div className="flex items-center gap-3">
                                         <LazyImage src={p.avatarUrl} className="w-8 h-8 rounded-full grayscale opacity-50" />
                                         <span className="text-xs font-bold text-white uppercase">{p.name.split(' ')[0]}</span>
                                     </div>
                                     <div className="flex gap-1">
                                         {[1,2,3,4,5].map(n => <button key={n} className="w-6 h-6 rounded bg-white/5 hover:bg-highlight text-[10px] font-bold text-white transition-colors">{n}</button>)}
                                     </div>
                                 </div>
                             ))}
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );
};

export default TrainingHub;
