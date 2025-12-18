
import React, { useState, useEffect, useContext, useRef } from 'react';
import { UserContext, UserContextType } from '../components/Layout';
import PageHeader from '../components/PageHeader';
import Card from '../components/Card';
import { storageService } from '../services/storageService';
import { 
    SparklesIcon, DumbbellIcon, CameraIcon, 
    CheckCircleIcon, AlertTriangleIcon, RefreshIcon 
} from '../components/icons/UiIcons';
import { useToast } from '../contexts/ToastContext';
import { generateGymPlan } from '../services/geminiService';
import LazyImage from '../components/LazyImage';

const Academy: React.FC = () => {
    const { currentRole } = useContext(UserContext) as UserContextType;
    const toast = useToast();
    const cameraRef = useRef<HTMLInputElement>(null);
    const [view, setView] = useState<'COURSES' | 'IRON_LAB'>('COURSES');
    
    // Iron Lab Wizard State
    const [location, setLocation] = useState<'GYM' | 'HOME' | 'CALISTHENICS'>('GYM');
    const [valence, setValence] = useState('EXPLOSION');
    const [isGenerating, setIsGenerating] = useState(false);
    const [workout, setWorkout] = useState<any>(null);
    const [photoCaptured, setPhotoCaptured] = useState(false);

    const courses = storageService.getCourses();
    const priorityCourses = courses.filter(c => c.priority);
    const program = storageService.getActiveProgram();

    // Valências Específicas baseadas no Estudo Flag vs Tackle
    const valences = program === 'TACKLE' ? [
        { id: 'EXPLOSION', label: 'Explosão (Power)', icon: '⚡' },
        { id: 'MAX_STRENGTH', label: 'Força Máxima', icon: '🏋️' },
        { id: 'REACTION', label: 'Velocidade Reação', icon: '⏱️' }
    ] : [
        { id: 'AGILITY', label: 'Agilidade Lateral', icon: '↔️' },
        { id: 'ACCELERATION', label: 'Burst / Aceleração', icon: '🚀' },
        { id: 'COORDINATION', label: 'Mãos / Catch', icon: '🏈' }
    ];

    const handleGenerate = async () => {
        setIsGenerating(true);
        setWorkout(null);
        setPhotoCaptured(false);
        try {
            const goalText = `Treino focado em ${valence} para atleta de ${program} em ambiente ${location}`;
            const planHtml = await generateGymPlan(goalText, 'Equipamento disponível no local', program);
            setWorkout(planHtml);
            toast.success("IA gerou seu plano técnico!");
        } catch (e) {
            toast.error("Erro ao processar com a IA.");
        } finally {
            setIsGenerating(false);
        }
    };

    const handleCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setPhotoCaptured(true);
            toast.success("Treino comprovado com sucesso!");
        }
    };

    return (
        <div className="space-y-6 animate-fade-in pb-20">
            <PageHeader title="Academy & Lab" subtitle="Onde o atleta de elite é forjado." />

            <div className="flex bg-secondary p-1 rounded-2xl border border-white/5 w-fit shadow-xl">
                <button onClick={() => setView('COURSES')} className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase transition-all ${view === 'COURSES' ? 'bg-highlight text-white shadow-glow' : 'text-text-secondary hover:text-white'}`}>Cursos & Loja</button>
                <button onClick={() => setView('IRON_LAB')} className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase transition-all ${view === 'IRON_LAB' ? 'bg-orange-600 text-white shadow-glow' : 'text-text-secondary hover:text-white'}`}>Iron Lab (Treino)</button>
            </div>

            {view === 'COURSES' ? (
                <div className="space-y-10 animate-slide-in">
                    {/* PRIORIDADES DO COACH */}
                    {priorityCourses.length > 0 && (
                        <div>
                            <h3 className="text-[10px] font-black text-red-500 uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                                <AlertTriangleIcon className="w-4 h-4 animate-pulse" /> Urgent: Prioridade do Coach
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {priorityCourses.map(course => (
                                    <div key={course.id} className="relative group bg-gradient-to-br from-red-950/40 to-secondary rounded-3xl border-2 border-red-500/20 overflow-hidden hover:border-red-500/50 transition-all flex h-44 shadow-2xl">
                                        <div className="w-1/3 relative h-full">
                                            <LazyImage src={course.thumbnailUrl} className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-secondary"></div>
                                        </div>
                                        <div className="flex-1 p-6 flex flex-col justify-center">
                                            <div className="flex gap-2 mb-2">
                                                <span className="bg-red-500 text-white text-[8px] font-black px-1.5 py-0.5 rounded uppercase">Urgente</span>
                                                <span className="bg-white/10 text-white text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-tighter">Futebol {program}</span>
                                            </div>
                                            <h4 className="text-white font-black uppercase italic text-xl leading-tight">{course.title}</h4>
                                            <p className="text-text-secondary text-[10px] mt-2 line-clamp-2 leading-relaxed">{course.description}</p>
                                            <button className="mt-4 bg-red-500 hover:bg-red-600 text-white font-black text-[10px] uppercase px-6 py-2.5 rounded-xl w-fit transition-all shadow-lg active:scale-95">Iniciar Estudo</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* CATÁLOGO GERAL */}
                    <div>
                        <h3 className="text-[10px] font-black text-white uppercase tracking-[0.2em] mb-4">Loja da Entidade (Cursos)</h3>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {courses.filter(c => !c.priority).map(course => (
                                <div key={course.id} className="bg-secondary/40 p-4 rounded-2xl border border-white/5 group hover:border-highlight transition-all cursor-pointer shadow-lg">
                                    <div className="aspect-video rounded-xl overflow-hidden mb-3 bg-black/40 relative">
                                        <LazyImage src={course.thumbnailUrl} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
                                        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                            <span className="bg-white text-black text-[10px] font-black px-3 py-1 rounded-lg shadow-xl uppercase">Ver Detalhes</span>
                                        </div>
                                    </div>
                                    <h4 className="text-white font-bold text-xs uppercase leading-tight line-clamp-2">{course.title}</h4>
                                    <div className="flex justify-between items-center mt-3">
                                        <p className="text-highlight font-black text-[10px] uppercase tracking-tighter">Adquirido</p>
                                        <span className="text-[9px] text-text-secondary">8 Módulos</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            ) : (
                /* IRON LAB WIZARD */
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-slide-in">
                    <div className="lg:col-span-1 space-y-6">
                        <Card title="Wizard de Treino">
                            <div className="space-y-6">
                                <div>
                                    <label className="text-[10px] font-black text-text-secondary uppercase tracking-[0.1em] mb-3 block">1. Onde você vai treinar?</label>
                                    <div className="grid grid-cols-3 gap-2">
                                        {[
                                            {id: 'GYM', label: 'ACADEMIA', icon: '🏋️'},
                                            {id: 'HOME', label: 'CASA', icon: '🏠'},
                                            {id: 'CALISTHENICS', label: 'RUA/CORPO', icon: '🌳'}
                                        ].map(loc => (
                                            <button 
                                                key={loc.id}
                                                onClick={() => setLocation(loc.id as any)} 
                                                className={`p-3 rounded-2xl border flex flex-col items-center gap-1 transition-all ${location === loc.id ? 'bg-orange-600 border-orange-500 text-white shadow-lg' : 'bg-black/20 border-white/5 text-text-secondary'}`}
                                            >
                                                <span className="text-xl">{loc.icon}</span>
                                                <span className="text-[8px] font-black">{loc.label}</span>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="text-[10px] font-black text-text-secondary uppercase tracking-[0.1em] mb-3 block">2. Qual a valência necessária?</label>
                                    <div className="space-y-2">
                                        {valences.map(v => (
                                            <button 
                                                key={v.id} 
                                                onClick={() => setValence(v.id)}
                                                className={`w-full p-4 rounded-2xl border flex items-center justify-between transition-all active:scale-95 ${valence === v.id ? 'bg-orange-600 border-orange-500 text-white shadow-lg' : 'bg-black/20 border-white/5 text-text-secondary hover:bg-white/5'}`}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <span className="text-xl">{v.icon}</span>
                                                    <span className="text-xs font-black uppercase italic">{v.label}</span>
                                                </div>
                                                {valence === v.id && <CheckCircleIcon className="w-4 h-4" />}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <button 
                                    onClick={handleGenerate}
                                    disabled={isGenerating}
                                    className="w-full bg-white text-black font-black py-4 rounded-2xl uppercase shadow-glow hover:scale-[1.02] transition-all flex items-center justify-center gap-2 group"
                                >
                                    {isGenerating ? <RefreshIcon className="w-5 h-5 animate-spin" /> : <><SparklesIcon className="w-4 h-4 text-orange-600 group-hover:scale-125 transition-transform" /> Gerar Plano Técnico</>}
                                </button>
                            </div>
                        </Card>
                    </div>

                    <div className="lg:col-span-2 space-y-6">
                        {workout ? (
                            <div className="space-y-4 animate-fade-in">
                                <div className="flex justify-between items-center bg-black/60 p-6 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden">
                                    <div className="absolute top-0 left-0 w-1 h-full bg-orange-500"></div>
                                    <div>
                                        <h3 className="text-2xl font-black text-white italic uppercase leading-none tracking-tighter">Sessão Gerada</h3>
                                        <p className="text-xs text-orange-400 font-bold mt-2 uppercase tracking-widest flex items-center gap-2">
                                            {location} • {valence} <span className="w-1 h-1 rounded-full bg-orange-400"></span> PROGRAMA {program}
                                        </p>
                                    </div>
                                    
                                    {/* BOTÃO SNAP DE COMPROVAÇÃO - MELHORADO */}
                                    <div className="flex flex-col items-center gap-2 bg-black/40 p-4 rounded-2xl border border-white/5">
                                        <input type="file" accept="image/*" capture="environment" className="hidden" ref={cameraRef} onChange={handleCapture} />
                                        <button 
                                            onClick={() => cameraRef.current?.click()}
                                            className={`w-14 h-14 rounded-full border-4 flex items-center justify-center transition-all transform active:scale-90 ${photoCaptured ? 'bg-green-500 border-green-400 shadow-[0_0_20px_rgba(34,197,94,0.6)]' : 'bg-red-600 border-red-500 animate-pulse shadow-[0_0_20px_rgba(220,38,38,0.3)]'}`}
                                        >
                                            {photoCaptured ? <CheckCircleIcon className="text-white w-7 h-7" /> : <CameraIcon className="text-white w-7 h-7" />}
                                        </button>
                                        <span className={`text-[8px] font-black uppercase tracking-widest ${photoCaptured ? 'text-green-400' : 'text-red-400'}`}>
                                            {photoCaptured ? 'TREINO OK' : 'COMPROVAR'}
                                        </span>
                                    </div>
                                </div>

                                <div className="p-6 bg-secondary/60 rounded-3xl border border-white/5 shadow-lg prose prose-invert max-w-none">
                                    <div dangerouslySetInnerHTML={{ __html: workout }} />
                                </div>
                                
                                <div className="p-4 bg-highlight/5 border border-highlight/20 rounded-2xl text-center">
                                    <p className="text-xs text-highlight font-bold uppercase tracking-widest">Finalize todos os exercícios e registre a foto para ganhar +25 XP</p>
                                </div>
                            </div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center opacity-30 py-20 border-2 border-dashed border-white/10 rounded-3xl bg-secondary/20">
                                <DumbbellIcon className="w-20 h-20 mb-4 text-text-secondary" />
                                <p className="font-black uppercase tracking-[0.2em] text-sm">Prancheta de Treino Vazia</p>
                                <p className="text-[10px] mt-2">Utilize o Wizard ao lado para iniciar sua evolução física.</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Academy;