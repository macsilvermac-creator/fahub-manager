
import React, { useState, useRef, useContext } from 'react';
import { UserContext, UserContextType } from '@/components/Layout';
import PageHeader from '@/components/PageHeader';
import Card from '@/components/Card';
import { storageService } from '@/services/storageService';
/* Added CameraIcon and RefreshIcon imports from UiIcons */
import { 
    SparklesIcon, DumbbellIcon, CameraIcon, 
    CheckCircleIcon, AlertTriangleIcon, RefreshIcon 
} from '@/components/icons/UiIcons';
import { useToast } from '@/contexts/ToastContext';
import { generateGymPlan } from '@/services/geminiService';
import LazyImage from '@/components/LazyImage';

const Academy: React.FC = () => {
    const { currentRole } = useContext(UserContext) as UserContextType;
    const toast = useToast();
    const cameraRef = useRef<HTMLInputElement>(null);
    const [view, setView] = useState<'COURSES' | 'IRON_LAB'>('COURSES');
    
    const [location, setLocation] = useState<'GYM' | 'HOME' | 'CALISTHENICS'>('GYM');
    const [valence, setValence] = useState('EXPLOSION');
    const [isGenerating, setIsGenerating] = useState(false);
    const [workout, setWorkout] = useState<string | null>(null);
    const [photoCaptured, setPhotoCaptured] = useState(false);

    const courses = storageService.getCourses();
    const priorityCourses = courses.filter(c => c.priority);
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

    return (
        <div className="space-y-6 animate-fade-in pb-20">
            <PageHeader title="Academy & Lab" subtitle="Onde o atleta de elite é forjado." />

            <div className="flex bg-secondary p-1 rounded-2xl border border-white/5 w-fit shadow-xl">
                <button onClick={() => setView('COURSES')} className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase transition-all ${view === 'COURSES' ? 'bg-highlight text-white shadow-glow' : 'text-text-secondary hover:text-white'}`}>Cursos</button>
                <button onClick={() => setView('IRON_LAB')} className={`px-6 py-2.5 rounded-xl text-xs font-black uppercase transition-all ${view === 'IRON_LAB' ? 'bg-orange-600 text-white shadow-glow' : 'text-text-secondary hover:text-white'}`}>Iron Lab</button>
            </div>

            {view === 'COURSES' ? (
                <div className="space-y-8">
                    {priorityCourses.length > 0 && (
                        <div>
                            <h3 className="text-[10px] font-black text-red-500 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <AlertTriangleIcon className="w-4 h-4 animate-pulse" /> Prioridade Coach
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {priorityCourses.map(course => (
                                    <div key={course.id} className="relative group bg-secondary rounded-3xl border-2 border-red-500/20 overflow-hidden flex h-44">
                                        <div className="w-1/3 relative h-full">
                                            <LazyImage src={course.thumbnailUrl} className="w-full h-full object-cover" />
                                            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-secondary"></div>
                                        </div>
                                        <div className="flex-1 p-6 flex flex-col justify-center">
                                            <h4 className="text-white font-black uppercase italic text-xl">{course.title}</h4>
                                            <p className="text-text-secondary text-[10px] mt-2 line-clamp-2">{course.description}</p>
                                            <button className="mt-4 bg-red-500 text-white font-black text-[10px] uppercase px-6 py-2 rounded-xl w-fit">Estudar</button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-slide-in">
                    <div className="lg:col-span-1 space-y-6">
                        <Card title="Wizard Iron Lab">
                            <div className="space-y-6">
                                <div>
                                    <label className="text-[10px] font-black text-text-secondary uppercase mb-3 block">Ambiente</label>
                                    <div className="grid grid-cols-3 gap-2">
                                        <button onClick={() => setLocation('GYM')} className={`p-3 rounded-2xl border text-[8px] font-black ${location === 'GYM' ? 'bg-orange-600 border-orange-500 text-white shadow-lg' : 'bg-black/20 border-white/5 text-text-secondary'}`}>ACADEMIA</button>
                                        <button onClick={() => setLocation('HOME')} className={`p-3 rounded-2xl border text-[8px] font-black ${location === 'HOME' ? 'bg-orange-600 border-orange-500 text-white shadow-lg' : 'bg-black/20 border-white/5 text-text-secondary'}`}>CASA</button>
                                        <button onClick={() => setLocation('CALISTHENICS')} className={`p-3 rounded-2xl border text-[8px] font-black ${location === 'CALISTHENICS' ? 'bg-orange-600 border-orange-500 text-white shadow-lg' : 'bg-black/20 border-white/5 text-text-secondary'}`}>RUAS</button>
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

                                <button onClick={handleGenerate} disabled={isGenerating} className="w-full bg-white text-black font-black py-4 rounded-2xl uppercase shadow-glow flex items-center justify-center gap-2 group">
                                    {isGenerating ? <RefreshIcon className="w-5 h-5 animate-spin" /> : <><SparklesIcon className="w-4 h-4 text-orange-600" /> Gerar Plano Técnico</>}
                                </button>
                            </div>
                        </Card>
                    </div>

                    <div className="lg:col-span-2 space-y-6">
                        {workout ? (
                            <div className="space-y-4">
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
                            <div className="h-full flex flex-col items-center justify-center opacity-30 py-20 border-2 border-dashed border-white/10 rounded-3xl">
                                <DumbbellIcon className="w-20 h-20 mb-4" />
                                <p className="font-black uppercase tracking-widest text-sm">Aguardando Prancheta...</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Academy;