
import React, { useState, useRef, useContext, useEffect, useMemo } from 'react';
import { UserContext, UserContextType } from '../components/Layout';
import PageHeader from '../components/PageHeader';
import Card from '../components/Card';
import { storageService } from '../services/storageService';
import { 
    SparklesIcon, DumbbellIcon, CameraIcon, 
    CheckCircleIcon, AlertTriangleIcon, RefreshIcon,
    ChevronRightIcon, StarIcon, LockIcon, PlayCircleIcon,
    ShoppingBagIcon
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
    const courses = useMemo(() => storageService.getCourses(), []);
    const program = storageService.getActiveProgram();

    // Mock Categories for UI demo
    const coachRecommendations = courses.filter(c => c.priority);
    const athleteNeeds = courses.filter(c => !c.priority);
    const shopSpotlight = courses.slice(0, 4); // Cursos populares na loja

    // Shop Rotation Logic
    useEffect(() => {
        if (view === 'COURSES') {
            const timer = setInterval(() => {
                setShopIndex(prev => (prev + 1) % shopSpotlight.length);
            }, 8000);
            return () => clearInterval(timer);
        }
    }, [view, shopSpotlight.length]);

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

    const CourseCard = ({ course, type }: { course: Course, type: 'COACH' | 'ATHLETE' }) => (
        <div 
            onClick={() => setSelectedCourse(course)}
            className="flex-none w-[320px] snap-start group cursor-pointer"
        >
            <div className={`relative aspect-video rounded-2xl overflow-hidden border-2 transition-all group-hover:scale-[1.02] group-hover:shadow-glow ${type === 'COACH' ? 'border-blue-500/30 group-hover:border-blue-500' : 'border-highlight/30 group-hover:border-highlight'}`}>
                <LazyImage src={course.thumbnailUrl} className="w-full h-full object-cover grayscale-[30%] group-hover:grayscale-0 transition-all duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent"></div>
                
                {type === 'COACH' && (
                    <div className="absolute top-3 left-3 bg-blue-600 text-white text-[8px] font-black px-2 py-1 rounded uppercase tracking-tighter">
                        Recomendado pelo Staff
                    </div>
                )}

                <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex items-center gap-1 mb-1">
                        <StarIcon className="w-3 h-3 text-yellow-500 fill-yellow-500" />
                        <span className="text-[10px] text-white font-bold">{course.level || 'PRO'}</span>
                    </div>
                    <h4 className="text-white font-black uppercase italic text-sm line-clamp-1 leading-tight">{course.title}</h4>
                    <div className="flex justify-between items-center mt-2">
                        <span className="text-highlight text-[9px] font-black uppercase tracking-widest">+50 XP TÁTICO</span>
                        <PlayCircleIcon className="w-6 h-6 text-white/50 group-hover:text-white transition-colors" />
                    </div>
                </div>
            </div>
        </div>
    );

    const renderCourses = () => (
        <div className="flex flex-col lg:flex-row gap-8 animate-slide-in">
            {/* 75% MAIN AREA */}
            <div className="flex-1 space-y-12">
                {/* Section 1: Coach Command */}
                <section>
                    <div className="flex justify-between items-end mb-6 px-2">
                        <div>
                            <h3 className="text-xs font-black text-blue-400 uppercase tracking-[0.3em]">Coach's Command</h3>
                            <p className="text-2xl font-black text-white italic uppercase tracking-tighter">Diretrizes da Semana</p>
                        </div>
                        <button className="text-[10px] font-black text-text-secondary uppercase hover:text-white transition-colors">Ver Tudo</button>
                    </div>
                    <div className="flex gap-6 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-4">
                        {coachRecommendations.map(c => <CourseCard key={c.id} course={c} type="COACH" />)}
                        {coachRecommendations.length === 0 && <p className="text-text-secondary italic text-sm">Sem recomendações do coach hoje.</p>}
                    </div>
                </section>

                {/* Section 2: Athlete Growth */}
                <section>
                    <div className="flex justify-between items-end mb-6 px-2">
                        <div>
                            <h3 className="text-xs font-black text-highlight uppercase tracking-[0.3em]">Athlete's Growth</h3>
                            <p className="text-2xl font-black text-white italic uppercase tracking-tighter">Sugestões para sua Posição</p>
                        </div>
                        <button className="text-[10px] font-black text-text-secondary uppercase hover:text-white transition-colors">Personalizar</button>
                    </div>
                    <div className="flex gap-6 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-4">
                        {athleteNeeds.map(c => <CourseCard key={c.id} course={c} type="ATHLETE" />)}
                    </div>
                </section>
            </div>

            {/* 25% SHOP SPOTLIGHT (Opposite to sidebar) */}
            <div className="lg:w-[300px] shrink-0">
                <div className="sticky top-24 space-y-6">
                    <div className="bg-gradient-to-br from-indigo-900/40 to-black rounded-[2.5rem] border border-white/10 p-6 shadow-2xl relative overflow-hidden">
                        <div className="relative z-10">
                            <h3 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] mb-6 flex items-center gap-2">
                                <ShoppingBagIcon className="w-4 h-4" /> Market Spotlight
                            </h3>
                            
                            <div className="relative aspect-[3/4] rounded-3xl overflow-hidden border border-white/5 mb-6 shadow-2xl group">
                                <LazyImage 
                                    src={shopSpotlight[shopIndex].thumbnailUrl} 
                                    className="w-full h-full object-cover animate-fade-in transition-transform duration-700 group-hover:scale-110" 
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-indigo-950 via-transparent to-transparent"></div>
                                <div className="absolute bottom-6 left-6 right-6">
                                    <p className="text-[10px] font-black text-indigo-300 uppercase mb-2">Novo Lançamento</p>
                                    <h4 className="text-xl font-black text-white uppercase italic leading-none">{shopSpotlight[shopIndex].title}</h4>
                                    <button className="w-full bg-white text-indigo-950 font-black py-3 rounded-xl uppercase text-xs mt-6 shadow-glow transition-all active:scale-95">Desbloquear Acesso</button>
                                </div>
                            </div>

                            <div className="flex justify-center gap-1.5">
                                {shopSpotlight.map((_, i) => (
                                    <div key={i} className={`h-1 rounded-full transition-all ${i === shopIndex ? 'w-6 bg-indigo-500' : 'w-2 bg-white/10'}`}></div>
                                ))}
                            </div>
                        </div>

                        {/* Background Decor */}
                        <div className="absolute -top-10 -right-10 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl"></div>
                    </div>

                    <div className="bg-secondary/40 p-6 rounded-[2rem] border border-white/5">
                        <p className="text-[10px] font-black text-text-secondary uppercase mb-4 tracking-widest text-center">Créditos de Time: <span className="text-white">F$ 2.450</span></p>
                        <button className="w-full py-3 bg-white/5 hover:bg-white/10 text-white text-[10px] font-black uppercase rounded-xl transition-all border border-white/10">Ver Todos na Loja</button>
                    </div>
                </div>
            </div>
        </div>
    );

    const valences = program === 'TACKLE' ? [
        { id: 'EXPLOSION', label: 'Explosão (Power)', icon: '⚡' },
        { id: 'MAX_STRENGTH', label: 'Força Máxima', icon: '🏋️' },
        { id: 'REACTION', label: 'Velocidade Reação', icon: '⏱️' }
    ] : [
        { id: 'AGILITY', label: 'Agilidade Lateral', icon: '↔️' },
        { id: 'ACCELERATION', label: 'Burst / Aceleração', icon: '🚀' },
        { id: 'COORDINATION', label: 'Mãos / Catch', icon: '🏈' }
    ];

    return (
        <div className="space-y-6 animate-fade-in pb-20">
            <PageHeader title="Performance Hub" subtitle="Onde o conhecimento vira campo." />

            <div className="flex bg-secondary p-1 rounded-2xl border border-white/5 w-fit shadow-xl no-print">
                <button onClick={() => setView('COURSES')} className={`px-8 py-2.5 rounded-xl text-xs font-black uppercase transition-all ${view === 'COURSES' ? 'bg-highlight text-white shadow-glow' : 'text-text-secondary hover:text-white'}`}>Academy</button>
                <button onClick={() => setView('IRON_LAB')} className={`px-8 py-2.5 rounded-xl text-xs font-black uppercase transition-all ${view === 'IRON_LAB' ? 'bg-orange-600 text-white shadow-glow' : 'text-text-secondary hover:text-white'}`}>Iron Lab</button>
            </div>

            {view === 'COURSES' ? renderCourses() : (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-slide-in">
                    <div className="lg:col-span-4 space-y-6">
                        <Card title="Wizard Iron Lab">
                            <div className="space-y-6">
                                <div>
                                    <label className="text-[10px] font-black text-text-secondary uppercase mb-3 block">Ambiente</label>
                                    <div className="grid grid-cols-3 gap-2">
                                        <button onClick={() => setLocation('GYM')} className={`p-3 rounded-2xl border text-[8px] font-black transition-all ${location === 'GYM' ? 'bg-orange-600 border-orange-500 text-white shadow-lg' : 'bg-black/20 border-white/5 text-text-secondary'}`}>ACADEMIA</button>
                                        <button onClick={() => setLocation('HOME')} className={`p-3 rounded-2xl border text-[8px] font-black transition-all ${location === 'HOME' ? 'bg-orange-600 border-orange-500 text-white shadow-lg' : 'bg-black/20 border-white/5 text-text-secondary'}`}>CASA</button>
                                        <button onClick={() => setLocation('CALISTHENICS')} className={`p-3 rounded-2xl border text-[8px] font-black transition-all ${location === 'CALISTHENICS' ? 'bg-orange-600 border-orange-500 text-white shadow-lg' : 'bg-black/20 border-white/5 text-text-secondary'}`}>RUAS</button>
                                    </div>
                                </div>

                                <div>
                                    <label className="text-[10px] font-black text-text-secondary uppercase mb-3 block">Valência Técnica</label>
                                    <div className="space-y-2">
                                        {valences.map(v => (
                                            <button key={v.id} onClick={() => setValence(v.id)} className={`w-full p-4 rounded-2xl border flex items-center justify-between transition-all ${valence === v.id ? 'bg-orange-600 border-orange-500 text-white shadow-lg' : 'bg-black/20 border-white/5 text-text-secondary'}`}>
                                                <div className="flex items-center gap-3">
                                                    <span className="text-xl">{v.icon}</span>
                                                    <span className="text-xs font-black uppercase italic">{v.label}</span>
                                                </div>
                                                {valence === v.id && <CheckCircleIcon className="w-4 h-4" />}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <button onClick={handleGenerate} disabled={isGenerating} className="w-full bg-white text-black font-black py-4 rounded-2xl uppercase shadow-glow flex items-center justify-center gap-2 group transition-all active:scale-95">
                                    {isGenerating ? <RefreshIcon className="w-5 h-5 animate-spin" /> : <><SparklesIcon className="w-4 h-4 text-orange-600" /> Gerar Plano Técnico</>}
                                </button>
                            </div>
                        </Card>
                    </div>

                    <div className="lg:col-span-8 space-y-6">
                        {workout ? (
                            <div className="space-y-4 animate-fade-in">
                                <div className="flex justify-between items-center bg-black/60 p-6 rounded-3xl border border-white/10 shadow-2xl relative overflow-hidden">
                                    <div className="absolute top-0 left-0 w-1 h-full bg-orange-500"></div>
                                    <div>
                                        <h3 className="text-2xl font-black text-white italic uppercase tracking-tighter">Plano de Evolução</h3>
                                        <p className="text-xs text-orange-400 font-bold mt-2 uppercase">{location} • {valence}</p>
                                    </div>
                                    <div className="flex flex-col items-center gap-2 bg-black/40 p-4 rounded-2xl">
                                        <input type="file" accept="image/*" capture="environment" className="hidden" ref={cameraRef} onChange={() => {setPhotoCaptured(true); toast.success("Foto validada!");}} />
                                        <button onClick={() => cameraRef.current?.click()} className={`w-14 h-14 rounded-full border-4 flex items-center justify-center transition-all ${photoCaptured ? 'bg-green-500 border-green-400' : 'bg-red-600 border-red-500 animate-pulse'}`}>
                                            {photoCaptured ? <CheckCircleIcon className="text-white w-7 h-7" /> : <CameraIcon className="text-white w-7 h-7" />}
                                        </button>
                                        <span className={`text-[8px] font-black uppercase ${photoCaptured ? 'text-green-400' : 'text-red-400'}`}>{photoCaptured ? 'OK' : 'SNAP'}</span>
                                    </div>
                                </div>
                                <div className="p-6 bg-secondary/60 rounded-3xl border border-white/5 prose prose-invert max-w-none shadow-xl">
                                    <div dangerouslySetInnerHTML={{ __html: workout }} />
                                </div>
                            </div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center opacity-30 py-40 border-2 border-dashed border-white/10 rounded-3xl">
                                <DumbbellIcon className="w-20 h-20 mb-4" />
                                <p className="font-black uppercase tracking-widest text-sm text-center">Aguardando definição dos parâmetros<br/>pelo atleta...</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {/* COURSE THEATER MODAL */}
            <Modal 
                isOpen={!!selectedCourse} 
                onClose={() => setSelectedCourse(null)} 
                title={selectedCourse?.title || "Curso"} 
                maxWidth="max-w-6xl"
            >
                <div className="bg-black rounded-3xl overflow-hidden aspect-video border border-white/10 shadow-2xl relative group">
                    <div className="absolute inset-0 flex items-center justify-center">
                         <div className="text-center">
                             <PlayCircleIcon className="w-20 h-20 text-white/20 group-hover:text-highlight transition-all group-hover:scale-110" />
                             <p className="text-white/40 font-black uppercase text-xs mt-4 tracking-widest">Clique para iniciar a aula</p>
                         </div>
                    </div>
                </div>
                <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-2 space-y-4">
                        <h2 className="text-2xl font-black text-white uppercase italic">{selectedCourse?.title}</h2>
                        <p className="text-text-secondary text-sm leading-relaxed">{selectedCourse?.description}</p>
                    </div>
                    <div className="bg-secondary/60 p-6 rounded-3xl border border-white/5 space-y-4 h-fit">
                        <div className="flex justify-between items-center pb-4 border-b border-white/5">
                            <span className="text-[10px] font-black text-text-secondary uppercase">Progresso</span>
                            <span className="text-highlight font-bold">15%</span>
                        </div>
                        <div className="space-y-2">
                             <p className="text-[10px] font-black text-text-secondary uppercase tracking-widest">Conteúdos:</p>
                             <div className="space-y-1">
                                 <div className="p-3 bg-highlight/10 rounded-xl border border-highlight/20 flex items-center justify-between">
                                     <span className="text-[10px] text-white font-bold">1. Introdução</span>
                                     <CheckCircleIcon className="w-4 h-4 text-highlight" />
                                 </div>
                                 <div className="p-3 bg-white/5 rounded-xl border border-white/10 flex items-center justify-between opacity-50">
                                     <span className="text-[10px] text-white font-bold">2. Execução Técnica</span>
                                     <LockIcon className="w-4 h-4" />
                                 </div>
                             </div>
                        </div>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default Academy;
