
import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import { storageService } from '../services/storageService';
import { PracticeSession, Player } from '../types';
import { generatePracticeScript } from '../services/geminiService';
import { 
    WhistleIcon, SparklesIcon, ClockIcon, CheckCircleIcon, 
    ActivityIcon, ClipboardIcon, TrashIcon 
} from '../components/icons/UiIcons';
import { useToast } from '../contexts/ToastContext';
import PageHeader from '../components/PageHeader';
import LazyImage from '../components/LazyImage';

const TrainingHub: React.FC = () => {
    const toast = useToast();
    const [practices, setPractices] = useState<PracticeSession[]>([]);
    const [players, setPlayers] = useState<Player[]>([]);
    const [activeView, setActiveView] = useState<'HUBS' | 'FIELD' | 'WIZARD'>('HUBS');
    const [isGenerating, setIsGenerating] = useState(false);
    const [wizardData, setWizardData] = useState<any[]>([]);

    useEffect(() => {
        setPractices(storageService.getPracticeSessions());
        setPlayers(storageService.getPlayers());
    }, []);

    const handleCreatePracticeIA = async () => {
        const focus = prompt("Qual o foco técnico? (Ex: Blitz & Cover 3)");
        if (!focus) return;
        setIsGenerating(true);
        try {
            const script = await generatePracticeScript(focus, 120, "High");
            setWizardData(script);
            setActiveView('WIZARD');
        } catch (e) {
            toast.error("IA Falhou.");
        } finally {
            setIsGenerating(false);
        }
    };

    return (
        <div className="space-y-6 pb-24 animate-fade-in">
            <PageHeader title="Training Day" subtitle="Scripts táticos e controle de carga." />

            {activeView === 'HUBS' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <button 
                        onClick={handleCreatePracticeIA}
                        className="glass-panel bg-gradient-to-br from-purple-900/40 to-secondary border border-white/5 rounded-3xl p-8 flex flex-col items-center justify-center text-center group active:scale-95 transition-all hover:border-purple-500 h-64"
                    >
                        <div className="p-5 bg-purple-500/10 rounded-2xl mb-4 group-hover:scale-110 transition-transform">
                            {isGenerating ? <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div> : <SparklesIcon className="w-12 h-12 text-purple-400" />}
                        </div>
                        <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">Mago de Treino (IA)</h3>
                        <p className="text-[10px] text-text-secondary font-bold uppercase tracking-widest mt-2 opacity-60">Gere roteiros técnicos em 5 segundos</p>
                    </button>

                    <button 
                        onClick={() => setActiveView('FIELD')}
                        className="glass-panel bg-gradient-to-br from-blue-900/40 to-secondary border border-white/5 rounded-3xl p-8 flex flex-col items-center justify-center text-center group active:scale-95 transition-all hover:border-highlight h-64"
                    >
                        <div className="p-5 bg-highlight/10 rounded-2xl mb-4 group-hover:scale-110 transition-transform">
                            <WhistleIcon className="w-12 h-12 text-highlight" />
                        </div>
                        <h3 className="text-xl font-black text-white uppercase italic tracking-tighter">Campo Ativo</h3>
                        <p className="text-[10px] text-text-secondary font-bold uppercase tracking-widest mt-2 opacity-60">Scripts, RPE e Presença</p>
                    </button>
                </div>
            )}
            
            {activeView === 'FIELD' && (
                <div className="space-y-4 animate-slide-in">
                    {practices.map(p => (
                        <Card key={p.id} title={p.title}>
                             <div className="space-y-2">
                                {p.script?.map((s: any, i: number) => (
                                    <div key={i} className="flex justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                                        <div className="flex gap-4">
                                            <span className="font-mono text-highlight font-bold">{s.startTime}</span>
                                            <span className="text-white font-bold text-sm uppercase">{s.activityName}</span>
                                        </div>
                                        <span className="text-[10px] text-text-secondary uppercase">{s.durationMinutes}m</span>
                                    </div>
                                ))}
                             </div>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TrainingHub;
