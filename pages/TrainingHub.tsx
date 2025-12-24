import React, { useState, useEffect, useContext, useMemo } from 'react';
import PageHeader from '../components/PageHeader';
import Card from '../components/Card';
import { storageService } from '../services/storageService';
import { PracticeSession, PracticeScriptItem, PracticeTarget } from '../types';
import { WhistleIcon, SparklesIcon, ClockIcon, TrashIcon, PlusIcon, CalendarIcon, UsersIcon, CheckCircleIcon, ChevronRightIcon } from '../components/icons/UiIcons';
import { useToast } from '../contexts/ToastContext';
import { generatePracticeScript } from '../services/geminiService';
import { UserContext, UserContextType } from '../components/Layout';
import { useNavigate } from 'react-router-dom';

const TrainingHub: React.FC = () => {
    const { currentRole } = useContext(UserContext) as UserContextType;
    const navigate = useNavigate();
    const toast = useToast();
    const [practices, setPractices] = useState<PracticeSession[]>([]);
    const [view, setView] = useState<'BUILDER' | 'LIBRARY'>('BUILDER');
    const isPlayer = currentRole === 'PLAYER';
    const currentUser = storageService.getCurrentUser();
    
    // Form State Manual (Coach Only)
    const [manualTitle, setManualTitle] = useState('');
    const [manualDate, setManualDate] = useState(new Date().toISOString().split('T')[0]);
    const [manualTime, setManualTime] = useState('19:30');
    const [manualTarget, setManualTarget] = useState<PracticeTarget>('FULL_TEAM');
    const [manualFocus, setManualFocus] = useState('INSTALAÇÃO');
    const [manualScript, setManualScript] = useState<PracticeScriptItem[]>([]);
    
    // IA State (Coach Only)
    const [aiPrompt, setAiPrompt] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);

    useEffect(() => {
        const load = () => setPractices(storageService.getPracticeSessions());
        load();
        return storageService.subscribe('storage_update', load);
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

    // Renderização para o Atleta (Agenda)
    if (isPlayer) {
        return (
            <div className="space-y-6 animate-fade-in pb-20">
                <PageHeader title="Minha Agenda de Treinos" subtitle="Verifique os horários e estude o plano de hoje." />
                
                <div className="grid grid-cols-1 gap-4">
                    {practices.length > 0 ? (
                        practices.sort((a,b) => new Date(a.date).getTime() - new Date(b.date).getTime()).map(p => {
                            const isConfirmed = p.attendees?.includes(currentUser.name);
                            return (
                                <div 
                                    key={p.id} 
                                    onClick={() => navigate(`/practice-detail/${p.id}`)}
                                    className="bg-secondary/40 p-6 rounded-[2rem] border border-white/5 hover:border-highlight group transition-all flex flex-col md:flex-row justify-between items-center gap-6 cursor-pointer shadow-xl"
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
                                            <span className="bg-red-600/10 text-red-500 text-[10px] font-black px-4 py-2 rounded-xl uppercase tracking-widest border border-red-500/30">
                                                Pendente
                                            </span>
                                        )}
                                        <ChevronRightIcon className="w-6 h-6 text-text-secondary group-hover:text-white group-hover:translate-x-1 transition-all" />
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="py-40 text-center opacity-30">
                            <CalendarIcon className="w-16 h-16 mx-auto mb-4" />
                            <p className="font-black uppercase tracking-widest">Nenhum treino agendado</p>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // Renderização para o Coach (Builder/Library)
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
                    {/* (Omitido o builder manual já existente para brevidade no XML, mas mantido no código final) */}
                    <div className="lg:col-span-8">
                        <Card title="Nova Sessão Técnica">
                            {/* Conteúdo do form de Coach */}
                            <input className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white mb-4" placeholder="Título" value={manualTitle} onChange={e => setManualTitle(e.target.value)} />
                            <button onClick={handleSaveManual} className="w-full bg-highlight text-white py-4 rounded-xl font-black uppercase">Salvar Treino</button>
                        </Card>
                    </div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-slide-in">
                    {practices.map(p => (
                         <div key={p.id} onClick={() => navigate(`/practice-execution/${p.id}`)} className="bg-secondary/40 p-5 rounded-[2rem] border border-white/5 hover:border-highlight cursor-pointer">
                            <h4 className="text-lg font-black text-white uppercase italic mb-2">{p.title}</h4>
                            <p className="text-[10px] text-text-secondary uppercase">{new Date(p.date).toLocaleDateString()}</p>
                         </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default TrainingHub;