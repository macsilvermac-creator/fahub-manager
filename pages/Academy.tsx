
import React, { useState, useRef, useContext, useEffect, useMemo } from 'react';
import { UserContext, UserContextType } from '../components/Layout';
import PageHeader from '../components/PageHeader';
import Card from '../components/Card';
import { storageService } from '../services/storageService';
import { 
    SparklesIcon, DumbbellIcon, CameraIcon, 
    CheckCircleIcon, AlertTriangleIcon, RefreshIcon,
    StarIcon, LockIcon, PlayCircleIcon,
    ShoppingBagIcon, ChevronRightIcon
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

    // Fix: Defined 'valences' constant to resolve build error
    const valences = program === 'TACKLE' ? [
        { id: 'EXPLOSION', label: 'Explosão (Power)', icon: '⚡' },
        { id: 'MAX_STRENGTH', label: 'Força Máxima', icon: '🏋️' },
        { id: 'REACTION', label: 'Velocidade Reação', icon: '⏱️' }
    ] : [
        { id: 'AGILITY', label: 'Agilidade Lateral', icon: '↔️' },
        { id: 'ACCELERATION', label: 'Burst / Aceleração', icon: '🚀' },
        { id: 'COORDINATION', label: 'Mãos / Catch', icon: '🏈' }
    ];

    // Filtros por Categoria
    const coachRecommendations = courses.filter(c => c.priority);
    const athleteNeeds = courses.filter(c => !c.priority);
    const shopItems = courses.slice(0, 6); // Itens para a loja lateral

    // Rotação Automática da Loja
    useEffect(() => {
        if (view === 'COURSES') {
            const timer = setInterval(() => {
                setShopIndex(prev => (prev + 2) % shopItems.length);
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

    // Card Vertical (Estilo Retrato)
    const VerticalCourseCard = ({ course, type }: { course: Course, type: 'COACH' | 'ATHLETE' | 'SHOP' }) => (
        <div 
            onClick={() => setSelectedCourse(course)}
            className={`flex-none ${type === 'SHOP' ? 'w-full' : 'w-[220px] md:w-[260px]'} snap-start group cursor-pointer`}
        >
            <div className={`relative aspect-[2/3] rounded-[2rem] overflow-hidden border-2 transition-all duration-500 group-hover:scale-[1.02] group-hover:shadow-glow ${type === 'COACH' ? 'border-blue-500/30' : type === 'SHOP' ? 'border-indigo-500/40' : 'border-highlight/30'}`}>
                <LazyImage src={course.thumbnailUrl} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                
                {/* Overlay Gradiente */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent"></div>
                
                {/* Selos */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                    {type === 'COACH' && (
                        <span className="bg-blue-600 text-white text-[8px] font-black px-2 py-1 rounded-full uppercase italic tracking-widest shadow-lg">Staff Pick</span>
                    )}
                    <span className="bg-black/60 backdrop-blur-md text-white text-[8px] font-black px-2 py-1 rounded-full uppercase border border-white/10 w-fit">
                        {course.level || 'PRO'}
                    </span>
                </div>

                {/* Conteúdo Inferior */}
                <div className="absolute bottom-6 left-6 right-6">
                    <h4 className="text-white font-black uppercase italic text-lg leading-tight mb-2 group-hover:text-highlight transition-colors line-clamp-2">{course.title}</h4>
                    <div className="flex items-center justify-between">
                        <span className={`text-[9px] font-black uppercase tracking-widest ${type === 'SHOP' ? 'text-indigo-400' : 'text-highlight'}`}>
                            {type === 'SHOP' ? 'Desbloquear' : '+50 XP IQ'}
                        </span>
                        <PlayCircleIcon className="w-8 h-8 text-white/50 group-hover:text-white transition-colors" />
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div className="space-y-6 animate-fade-in pb-20">
            <PageHeader title="Elite Academy" subtitle="Evolução técnica e teórica fora das 100 jardas." />

            <div className="flex bg-secondary p-1 rounded-2xl border border-white/5 w-fit shadow-xl mb-8">
                <button onClick={() => setView('COURSES')} className={`px-10 py-3 rounded-xl text-xs font-black uppercase transition-all ${view === 'COURSES' ? 'bg-highlight text-white shadow-glow' : 'text-text-secondary hover:text-white'}`}>Cursos</button>
                <button onClick={() => setView('IRON_LAB')} className={`px-10 py-3 rounded-xl text-xs font-black uppercase transition-all ${view === 'IRON_LAB' ? 'bg-orange-600 text-white shadow-glow' : 'text-text-secondary hover:text-white'}`}>Iron Lab</button>
            </div>

            {view === 'COURSES' ? (
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    
                    {/* CONTAINER CENTRAL (75% - 3 Cards na largura) */}
                    <div className="lg:col-span-3 space-y-16">
                        
                        {/* Linha 1: Coach recommendations */}
                        <section>
                            <div className="flex justify-between items-end mb-6 px-4">
                                <div>
                                    <h3 className="text-xs font-black text-blue-400 uppercase tracking-[0.3em] mb-1">Directives</h3>
                                    <p className="text-3xl font-black text-white italic uppercase tracking-tighter">Coach's Command</p>
                                </div>
                                <div className="flex gap-2 mb-1">
                                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                    <div className="w-2 h-2 rounded-full bg-white/10"></div>
                                    <div className="w-2 h-2 rounded-full bg-white/10"></div>
                                </div>
                            </div>
                            <div className="flex gap-6 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-4 px-2">
                                {coachRecommendations.map(c => <VerticalCourseCard key={c.id} course={c} type="COACH" />)}
                            </div>
                        </section>

                        {/* Linha 2: Athlete Needs */}
                        <section>
                            <div className="flex justify-between items-end mb-6 px-4">
                                <div>
                                    <h3 className="text-xs font-black text-highlight uppercase tracking-[0.3em] mb-1">Bio-Adaptive</h3>
                                    <p className="text-3xl font-black text-white italic uppercase tracking-tighter">Athlete's Growth</p>
                                </div>
                                <div className="flex gap-2 mb-1">
                                    <div className="w-2 h-2 rounded-full bg-highlight"></div>
                                    <div className="w-2 h-2 rounded-full bg-white/10"></div>
                                    <div className="w-2 h-2 rounded-full bg-white/10"></div>
                                </div>
                            </div>
                            <div className="flex gap-6 overflow-x-auto no-scrollbar snap-x snap-mandatory pb-4 px-2">
                                {athleteNeeds.map(c => <VerticalCourseCard key={c.id} course={c} type="ATHLETE" />)}
                            </div>
                        </section>
                    </div>

                    {/* CONTAINER LATERAL (25% - 1 Card na largura, 2 na altura) */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24 bg-gradient-to-b from-indigo-950/30 to-black rounded-[3rem] border-2 border-indigo-500/20 p-6 flex flex-col gap-8 shadow-2xl">
                            <div className="flex items-center justify-between px-2">
                                <h3 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em]">Market Spotlight</h3>
                                <ShoppingBagIcon className="w-4 h-4 text-indigo-400" />
                            </div>

                            {/* Card Superior Loja (Alinhado com Linha 1) */}
                            <div className="animate-fade-in" key={`shop-1-${shopIndex}`}>
                                <VerticalCourseCard course={shopItems[shopIndex % shopItems.length]} type="SHOP" />
                            </div>

                            {/* Card Inferior Loja (Alinhado com Linha 2) */}
                            <div className="animate-fade-in" key={`shop-2-${shopIndex}`}>
                                <VerticalCourseCard course={shopItems[(shopIndex + 1) % shopItems.length]} type="SHOP" />
                            </div>

                            <button className="w-full py-4 bg-white/5 hover:bg-indigo-500 text-text-secondary hover:text-white rounded-2xl text-[10px] font-black uppercase transition-all border border-white/10 flex items-center justify-center gap-2">
                                Ver Loja Completa <ChevronRightIcon className="w-3 h-3" />
                            </button>
                        </div>
                    </div>
                </div>
            ) : (
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

            {/* THEATER MODE MODAL */}
            <Modal isOpen={!!selectedCourse} onClose={() => setSelectedCourse(null)} title={selectedCourse?.title || "Aula"} maxWidth="max-w-6xl">
                 <div className="bg-black aspect-video rounded-3xl overflow-hidden border border-white/10 flex items-center justify-center relative group">
                     <PlayCircleIcon className="w-24 h-24 text-highlight opacity-40 group-hover:opacity-100 transition-all scale-90 group-hover:scale-100" />
                     <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black to-transparent">
                         <h2 className="text-3xl font-black text-white uppercase italic">{selectedCourse?.title}</h2>
                         <p className="text-text-secondary mt-2">Módulo 1: Introdução aos Conceitos</p>
                     </div>
                 </div>
                 <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                     <div className="md:col-span-2">
                        <h3 className="text-white font-bold mb-4 uppercase text-xs tracking-widest">Resumo do Módulo</h3>
                        <p className="text-text-secondary text-sm leading-relaxed">{selectedCourse?.description}</p>
                     </div>
                     <div className="bg-white/5 rounded-3xl p-6 border border-white/5">
                         <h3 className="text-white font-bold mb-4 uppercase text-[10px] tracking-widest">Seu Progresso</h3>
                         <div className="h-1.5 w-full bg-black/40 rounded-full mb-4">
                             <div className="h-full bg-highlight" style={{width: '25%'}}></div>
                         </div>
                         <button className="w-full py-3 bg-highlight text-white rounded-xl font-black uppercase text-xs">Continuar de onde parou</button>
                     </div>
                 </div>
            </Modal>
        </div>
    );
};

export default Academy;
