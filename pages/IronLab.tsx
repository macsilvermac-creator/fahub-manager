import React, { useState, useRef, useContext, useEffect, useMemo } from 'react';
import { UserContext, UserContextType } from '../components/Layout';
import PageHeader from '../components/PageHeader';
import Card from '../components/Card';
import { storageService } from '../services/storageService';
import { 
    SparklesIcon, DumbbellIcon, CameraIcon, 
    CheckCircleIcon, AlertTriangleIcon, RefreshIcon,
    StarIcon, LockIcon, PlayCircleIcon,
    ShoppingBagIcon, ChevronRightIcon,
    // Fix: Added missing TrophyIcon import
    TrophyIcon
} from '../components/icons/UiIcons';
import { useToast } from '../contexts/ToastContext';
import { generateGymPlan } from '../services/geminiService';
import LazyImage from '../components/LazyImage';
import Modal from '../components/Modal';
import { Course } from '../types';

const Academy: React.FC = () => {
    const { currentRole } = useContext(UserContext) as UserContextType;
    const toast = useToast();
    const cameraRef = useRef<HTMLInputElement>(null);
    const [view, setView] = useState<'COURSES' | 'IRON_LAB'>('COURSES');
    
    // Gym States
    const [location, setLocation] = useState<'GYM' | 'HOME' | 'CALISTHENICS'>('GYM');
    const [valence, setValence] = useState('EXPLOSION');
    const [isGenerating, setIsGenerating] = useState(false);
    const [workout, setWorkout] = useState<string | null>(null);
    const [photoCaptured, setPhotoCaptured] = useState(false);

    // Course States
    const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
    const [shopIndex, setShopIndex] = useState(0);
    const courses = useMemo(() => storageService.getCourses() || [], []);
    const program = storageService.getActiveProgram();

    const valences = program === 'TACKLE' ? [
        { id: 'EXPLOSION', label: 'Explosão (Power)', icon: '⚡' },
        { id: 'MAX_STRENGTH', label: 'Força Máxima', icon: '🏋️' },
        { id: 'REACTION', label: 'Velocidade Reação', icon: '⏱️' }
    ] : [
        { id: 'AGILITY', label: 'Agilidade Lateral', icon: '↔️' },
        { id: 'ACCELERATION', label: 'Burst / Aceleração', icon: '🚀' },
        { id: 'COORDINATION', label: 'Mãos / Catch', icon: '🏈' }
    ];

    const coachRecommendations = courses.filter(c => c.priority);
    const athleteNeeds = courses.filter(c => !c.priority);
    const shopItems = courses.slice(0, 6);

    useEffect(() => {
        if (view === 'COURSES' && shopItems.length > 0) {
            const timer = setInterval(() => {
                setShopIndex(prev => (prev + 1) % shopItems.length);
            }, 6000);
            return () => clearInterval(timer);
        }
    }, [view, shopItems.length]);

    const handleGenerate = async () => {
        setIsGenerating(true);
        setWorkout(null);
        try {
            const goalText = `Treino focado em ${valence} para atleta de ${program} em ambiente ${location}`;
            const plan = await generateGymPlan(goalText, 'Equipamento básico', program);
            setWorkout(plan);
            toast.success("Plano técnico gerado!");
        } catch (e) {
            toast.error("Erro na Coach IA.");
        } finally {
            setIsGenerating(false);
        }
    };

    const VerticalCourseCard = ({ course, type }: { course: Course, type: 'COACH' | 'ATHLETE' | 'SHOP' }) => {
        if (!course) return null;
        return (
            <div 
                onClick={() => setSelectedCourse(course)}
                className={`flex-none ${type === 'SHOP' ? 'w-full' : 'w-[180px] md:w-[220px]'} snap-start group cursor-pointer`}
            >
                <div className={`relative aspect-[3/4] rounded-3xl overflow-hidden border-2 transition-all duration-500 group-hover:scale-[1.02] group-hover:shadow-glow ${type === 'COACH' ? 'border-blue-500/30' : type === 'SHOP' ? 'border-indigo-500/40' : 'border-highlight/30'}`}>
                    <LazyImage src={course.thumbnailUrl || ''} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
                    <div className="absolute bottom-4 left-4 right-4">
                        <h4 className="text-white font-black uppercase italic text-sm leading-tight group-hover:text-highlight transition-colors line-clamp-2">{course.title}</h4>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="flex-1 flex flex-col min-h-0 animate-fade-in overflow-hidden">
            <PageHeader title="Elite Academy & Iron Lab" subtitle="Evolução técnica fora das 100 jardas." />

            <div className="flex bg-secondary p-1 rounded-2xl border border-white/5 w-fit shadow-xl mb-4 shrink-0">
                <button onClick={() => setView('COURSES')} className={`px-8 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${view === 'COURSES' ? 'bg-highlight text-white shadow-glow' : 'text-text-secondary hover:text-white'}`}>Cursos</button>
                <button onClick={() => setView('IRON_LAB')} className={`px-8 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${view === 'IRON_LAB' ? 'bg-orange-600 text-white shadow-glow' : 'text-text-secondary hover:text-white'}`}>Iron Lab</button>
            </div>

            {view === 'COURSES' ? (
                <div className="flex-1 grid grid-cols-1 lg:grid-cols-4 gap-4 overflow-hidden">
                    <div className="lg:col-span-3 space-y-6 overflow-y-auto custom-scrollbar pr-2 pb-10">
                        <section>
                            <div className="mb-3 px-1">
                                <p className="text-xl font-black text-white italic uppercase tracking-tighter leading-none flex items-center gap-2">
                                    <TrophyIcon className="w-5 h-5 text-blue-400" /> Coach's Selection
                                </p>
                            </div>
                            <div className="flex gap-4 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-2">
                                {coachRecommendations.map(c => <VerticalCourseCard key={c.id} course={c} type="COACH" />)}
                            </div>
                        </section>
                        <section>
                            <div className="mb-3 px-1">
                                <p className="text-xl font-black text-white italic uppercase tracking-tighter leading-none flex items-center gap-2">
                                    <StarIcon className="w-5 h-5 text-highlight" /> Athlete's Growth
                                </p>
                            </div>
                            <div className="flex gap-4 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-2">
                                {athleteNeeds.map(c => <VerticalCourseCard key={c.id} course={c} type="ATHLETE" />)}
                            </div>
                        </section>
                    </div>
                    <div className="lg:col-span-1 bg-black/30 rounded-[2.5rem] border border-white/5 p-5 flex flex-col gap-4 overflow-hidden">
                        <h3 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em]">Market Spotlight</h3>
                        <div className="flex-1 flex flex-col justify-center overflow-hidden">
                            {shopItems.length > 0 && <VerticalCourseCard course={shopItems[shopIndex]} type="SHOP" />}
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 overflow-hidden">
                    <div className="lg:col-span-4 bg-secondary/40 rounded-[2.5rem] border border-white/5 p-6 flex flex-col shadow-2xl h-full overflow-hidden">
                        <div className="flex items-center gap-3 mb-6 shrink-0">
                            <SparklesIcon className="w-5 h-5 text-orange-500 animate-pulse" />
                            <h3 className="text-lg font-black text-white italic uppercase tracking-tighter">Iron Console</h3>
                        </div>
                        <div className="flex-1 overflow-y-auto custom-scrollbar space-y-6 pr-1">
                            <section>
                                <p className="text-[9px] font-black text-text-secondary uppercase tracking-[0.2em] mb-3">Ambiente</p>
                                <div className="grid grid-cols-3 gap-1.5 p-1 bg-black/20 rounded-xl border border-white/5">
                                    {['GYM', 'HOME', 'CAL'].map(env => (
                                        <button key={env} onClick={() => setLocation(env as any)} className={`py-2 rounded-lg text-[8px] font-black transition-all ${location === env ? 'bg-orange-600 text-white' : 'text-text-secondary hover:text-white'}`}>{env}</button>
                                    ))}
                                </div>
                            </section>
                            <section>
                                <p className="text-[9px] font-black text-text-secondary uppercase tracking-[0.2em] mb-3">Valência</p>
                                <div className="space-y-1.5">
                                    {valences.map(v => (
                                        <button key={v.id} onClick={() => setValence(v.id)} className={`w-full p-3 rounded-xl border flex items-center justify-between transition-all ${valence === v.id ? 'bg-orange-600 border-orange-500 text-white shadow-lg' : 'bg-black/20 border-white/5 text-text-secondary'}`}>
                                            <span className="text-[10px] font-black uppercase italic leading-none">{v.label}</span>
                                            {valence === v.id && <CheckCircleIcon className="w-3 h-3" />}
                                        </button>
                                    ))}
                                </div>
                            </section>
                        </div>
                        <button onClick={handleGenerate} disabled={isGenerating} className="mt-4 w-full bg-white text-black font-black py-4 rounded-2xl uppercase italic text-[10px] shadow-glow-orange shrink-0 transition-all active:scale-95">
                            {isGenerating ? <RefreshIcon className="w-4 h-4 animate-spin mx-auto" /> : 'CONSTRUIR TREINO'}
                        </button>
                    </div>

                    <div className="lg:col-span-8 overflow-y-auto custom-scrollbar pr-2 pb-10">
                        {workout ? (
                            <div className="space-y-4 animate-fade-in">
                                <div className="bg-black/60 p-6 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden flex justify-between items-center">
                                    <div className="absolute top-0 left-0 w-1 h-full bg-orange-500"></div>
                                    <div>
                                        <h3 className="text-xl font-black text-white italic uppercase tracking-tighter leading-none">Draft de Treino Ativo</h3>
                                        <p className="text-[10px] text-orange-400 font-bold mt-2 uppercase">{location} • {valence}</p>
                                    </div>
                                    <button onClick={() => cameraRef.current?.click()} className={`w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all ${photoCaptured ? 'bg-green-500 border-green-400' : 'bg-red-600 border-red-500 animate-pulse'}`}>
                                        <CameraIcon className="text-white w-6 h-6" />
                                    </button>
                                    <input type="file" ref={cameraRef} className="hidden" accept="image/*" capture="environment" onChange={() => setPhotoCaptured(true)} />
                                </div>
                                <div className="p-6 bg-secondary/60 rounded-3xl border border-white/5 prose prose-invert max-w-none shadow-xl text-xs">
                                    <div dangerouslySetInnerHTML={{ __html: workout }} />
                                </div>
                            </div>
                        ) : (
                            <div className="h-full min-h-[400px] flex flex-col items-center justify-center opacity-10 border-2 border-dashed border-white/10 rounded-3xl">
                                <DumbbellIcon className="w-16 h-16 mb-4" />
                                <p className="font-black uppercase tracking-widest text-[10px] text-center px-10 leading-relaxed">Selecione o ambiente e a valência para que a IA gere seu planejamento de força elite.</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            <Modal isOpen={!!selectedCourse} onClose={() => setSelectedCourse(null)} title={selectedCourse?.title || "Aula"} maxWidth="max-w-4xl">
                 <div className="bg-black aspect-video rounded-3xl overflow-hidden border border-white/10 relative group">
                     <PlayCircleIcon className="w-20 h-20 text-highlight absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-40 group-hover:opacity-100 transition-all" />
                 </div>
            </Modal>
        </div>
    );
};

export default Academy;