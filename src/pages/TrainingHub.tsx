
import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import { storageService } from '../services/storageService';
import { PracticeSession, Player } from '../types';
import { generatePracticeScript } from '../services/geminiService';
import { 
    WhistleIcon, SparklesIcon, ClockIcon, CheckCircleIcon, 
    ActivityIcon, ClipboardIcon, UsersIcon, TrashIcon 
} from '../components/icons/UiIcons';
import { useToast } from '../contexts/ToastContext';
import Modal from '../components/Modal';
import LazyImage from '../components/LazyImage';

const TrainingHub: React.FC = () => {
    const toast = useToast();
    const [practices, setPractices] = useState<PracticeSession[]>([]);
    const [players, setPlayers] = useState<Player[]>([]);
    const [activeView, setActiveView] = useState<'HUBS' | 'FIELD' | 'FEEDBACK' | 'WIZARD'>('HUBS');
    
    // Timer State
    const [activePractice, setActivePractice] = useState<PracticeSession | null>(null);
    const [timerSeconds, setTimerSeconds] = useState(0);
    const [isTimerRunning, setIsTimerRunning] = useState(false);

    // Feedback State
    const [selectedPlayer, setSelectedPlayer] = useState<Player | null>(null);

    useEffect(() => {
        setPractices(storageService.getPracticeSessions());
        setPlayers(storageService.getPlayers());
    }, []);

    const handleCreatePracticeIA = async () => {
        const focus = prompt("Qual o foco técnico de hoje? (Ex: Blitz & Cover 3)");
        if (!focus) return;

        toast.info("IA escrevendo roteiro minuto-a-minuto...");
        try {
            const script = await generatePracticeScript(focus, 120, "High");
            const newPrac: PracticeSession = {
                id: `pr-${Date.now()}`,
                title: `Sessão: ${focus}`,
                focus,
                date: new Date(),
                attendees: [],
                script: script
            };
            const updated = [newPrac, ...practices];
            setPractices(updated);
            storageService.savePracticeSessions(updated);
            toast.success("Treino gerado e agendado!");
            setActiveView('HUBS');
        } catch (e) {
            toast.error("IA falhou na estratégia.");
        }
    };

    const handleSaveFeedback = (p: Player, field: string, delta: number) => {
        // Logica para atualizar OVR baseado nas valências (+/-)
        toast.success(`${p.name}: ${field} atualizado!`);
    };

    const HubButton = ({ icon: Icon, title, sub, onClick, color = 'highlight' }: any) => (
        <button 
            onClick={onClick}
            className={`glass-panel bg-secondary border border-white/5 rounded-3xl p-8 flex flex-col items-center justify-center text-center group active:scale-95 transition-all hover:border-${color} h-64`}
        >
            <div className={`p-5 bg-${color}/10 rounded-2xl mb-4 group-hover:scale-110 transition-transform`}>
                <Icon className={`w-12 h-12 text-${color}`} />
            </div>
            <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">{title}</h3>
            <p className="text-[10px] text-text-secondary font-bold uppercase tracking-widest mt-2 opacity-60">{sub}</p>
        </button>
    );

    return (
        <div className="space-y-6 pb-24 animate-fade-in">
            <header className="flex justify-between items-center px-2">
                <div>
                    <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter">Training Day</h2>
                    <p className="text-highlight text-[10px] font-bold uppercase tracking-widest">Unidade Técnica Operacional</p>
                </div>
                {activeView !== 'HUBS' && (
                    <button onClick={() => setActiveView('HUBS')} className="bg-white/5 border border-white/10 px-4 py-2 rounded-xl text-xs font-bold text-text-secondary">Voltar ao HUB</button>
                )}
            </header>

            {activeView === 'HUBS' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                    <HubButton 
                        icon={SparklesIcon} 
                        title="Mago de Treino" 
                        sub="Gerar roteiro via IA" 
                        onClick={() => setActiveView('WIZARD')} 
                        color="purple-500" 
                    />
                    <HubButton 
                        icon={WhistleIcon} 
                        title="Dia de Treino" 
                        sub="Lista, Script e Cronômetro" 
                        onClick={() => setActiveView('FIELD')} 
                        color="blue-400" 
                    />
                    <HubButton 
                        icon={ActivityIcon} 
                        title="Feedback Pro" 
                        sub="Avaliar Atletas em Campo" 
                        onClick={() => setActiveView('FEEDBACK')} 
                        color="green-500" 
                    />
                    <HubButton 
                        icon={ClipboardIcon} 
                        title="Acompanhamento" 
                        sub="Histórico de evolução" 
                        onClick={() => toast.info("Relatórios em breve")} 
                        color="amber-400" 
                    />
                </div>
            )}

            {activeView === 'WIZARD' && (
                <Card title="Assistente de Planejamento IA" className="max-w-2xl mx-auto">
                    <div className="space-y-6">
                         <div className="p-4 bg-purple-900/10 border border-purple-500/20 rounded-2xl">
                             <p className="text-sm text-purple-200">A IA irá distribuir 120 minutos entre Warmup, Indy Drills e Team Drills baseada no seu foco.</p>
                         </div>
                         <button onClick={handleCreatePracticeIA} className="w-full bg-purple-600 text-white font-black py-5 rounded-2xl shadow-glow text-lg uppercase italic transform active:scale-95 transition-all">
                             Iniciar Mago Tático
                         </button>
                    </div>
                </Card>
            )}

            {activeView === 'FIELD' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-slide-in">
                    <div className="lg:col-span-2 space-y-4">
                        <h3 className="font-black text-white uppercase italic tracking-widest text-sm flex items-center gap-2">
                            <ClockIcon className="w-5 h-5 text-blue-400"/> Cronograma Ativo
                        </h3>
                        {practices.length > 0 ? (
                            <div className="space-y-2">
                                {practices[0].script?.map((step: any, idx: number) => (
                                    <div key={idx} className="bg-secondary p-4 rounded-2xl border border-white/5 flex justify-between items-center">
                                        <div className="flex items-center gap-4">
                                            <span className="text-blue-400 font-mono font-bold text-lg">{step.startTime}</span>
                                            <div>
                                                <p className="text-white font-bold text-sm uppercase">{step.activityName}</p>
                                                <p className="text-[10px] text-text-secondary uppercase">{step.type}</p>
                                            </div>
                                        </div>
                                        <div className="bg-white/5 px-4 py-1 rounded-lg text-xs font-black text-white">{step.durationMinutes}m</div>
                                    </div>
                                ))}
                            </div>
                        ) : <p className="opacity-30 italic text-center py-10">Nenhum treino hoje.</p>}
                    </div>
                    <Card title="Check-in Sideline">
                        <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                             {players.map(p => (
                                 <div key={p.id} className="flex items-center justify-between p-3 bg-black/20 rounded-xl border border-white/5">
                                     <div className="flex items-center gap-3">
                                         <LazyImage src={p.avatarUrl} className="w-10 h-10 rounded-full grayscale opacity-50" />
                                         <span className="text-xs font-bold text-white uppercase">{p.name}</span>
                                     </div>
                                     <button className="p-2 bg-white/5 rounded-lg text-text-secondary">OK</button>
                                 </div>
                             ))}
                        </div>
                    </Card>
                </div>
            )}

            {activeView === 'FEEDBACK' && (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 animate-slide-in">
                    {players.map(p => (
                        <button 
                            key={p.id} 
                            onClick={() => setSelectedPlayer(p)}
                            className="bg-secondary p-4 rounded-3xl border border-white/5 flex flex-col items-center gap-3 group hover:border-highlight"
                        >
                            <LazyImage src={p.avatarUrl} className="w-16 h-16 rounded-2xl border-2 border-white/10 group-hover:border-highlight transition-all" />
                            <p className="text-[10px] font-black text-white uppercase truncate w-full text-center">{p.name.split(' ')[0]}</p>
                            <div className="text-[10px] font-black text-highlight">OVR {p.rating}</div>
                        </button>
                    ))}
                </div>
            )}

            {/* MODAL DE FEEDBACK RAPIDO */}
            <Modal isOpen={!!selectedPlayer} onClose={() => setSelectedPlayer(null)} title="Avaliação de Campo">
                {selectedPlayer && (
                    <div className="space-y-8 py-4">
                        <div className="flex items-center gap-4 mb-4">
                            <LazyImage src={selectedPlayer.avatarUrl} className="w-16 h-16 rounded-full border-2 border-highlight" />
                            <div>
                                <h4 className="text-xl font-black text-white uppercase italic">{selectedPlayer.name}</h4>
                                <p className="text-highlight font-bold text-xs uppercase">Rating Atual: {selectedPlayer.rating}</p>
                            </div>
                        </div>

                        {['Explosão', 'Velocidade', 'QI Tático', 'Técnica'].map(val => (
                            <div key={val} className="space-y-3">
                                <div className="flex justify-between items-center text-[10px] font-black text-text-secondary uppercase">
                                    <span>{val}</span>
                                    <span className="text-white">Nível 85</span>
                                </div>
                                <div className="flex items-center gap-4">
                                    <button className="w-10 h-10 rounded-xl bg-red-600/20 text-red-500 font-black text-xl">-</button>
                                    <div className="flex-1 h-3 bg-black/40 rounded-full overflow-hidden border border-white/5">
                                        <div className="h-full bg-highlight w-[85%]"></div>
                                    </div>
                                    <button className="w-10 h-10 rounded-xl bg-green-600/20 text-green-500 font-black text-xl">+</button>
                                </div>
                            </div>
                        ))}

                        <button onClick={() => setSelectedPlayer(null)} className="w-full bg-highlight text-white font-black py-4 rounded-2xl uppercase shadow-glow transform active:scale-95 transition-all">Salvar Notas de Treino</button>
                    </div>
                )}
            </Modal>
        </div>
    );
};

export default TrainingHub;