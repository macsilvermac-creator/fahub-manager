import React, { useState, useRef, useEffect } from 'react';
import PageHeader from '../components/PageHeader';
import { storageService } from '../services/storageService';
import { 
    SparklesIcon, DumbbellIcon, CameraIcon, 
    CheckCircleIcon, ActivityIcon, RefreshIcon,
    ShieldCheckIcon, ClockIcon, TargetIcon,
    ZapIcon, HeartPulseIcon
} from '../components/icons/UiIcons';
import { useToast } from '../contexts/ToastContext';
import { generateGymPlan } from '../services/geminiService';
import LazyImage from '../components/LazyImage';

interface SavedWorkout {
    id: string;
    title: string;
    content: string;
    location: string;
    valence: string;
    date: Date;
    photo?: string;
}

const IronLab: React.FC = () => {
    const toast = useToast();
    const cameraRef = useRef<HTMLInputElement>(null);
    const [location, setLocation] = useState<'GYM' | 'HOME' | 'STREET'>('GYM');
    const [selectedValence, setSelectedValence] = useState('EXPLOSION');
    const [isGenerating, setIsGenerating] = useState(false);
    const [workoutHistory, setWorkoutHistory] = useState<SavedWorkout[]>([]);
    const [activeWorkoutIdForPhoto, setActiveWorkoutIdForPhoto] = useState<string | null>(null);

    const valences = [
        { id: 'EXPLOSION', label: 'Explosão', icon: <ZapIcon className="w-5 h-5" /> },
        { id: 'STRENGTH', label: 'Força', icon: <ShieldCheckIcon className="w-5 h-5" /> },
        { id: 'SPEED', label: 'Velocidade', icon: <ActivityIcon className="w-5 h-5" /> },
        { id: 'AGILITY', label: 'Agilidade', icon: <RefreshIcon className="w-5 h-5" /> },
        { id: 'POWER', label: 'Potência', icon: <ZapIcon className="w-5 h-5" /> },
        { id: 'ENDURANCE', label: 'Resistência', icon: <ClockIcon className="w-5 h-5" /> },
        { id: 'COORDINATION', label: 'Coordenação', icon: <TargetIcon className="w-5 h-5" /> },
        { id: 'STABILITY', label: 'Estabilidade', icon: <ActivityIcon className="w-5 h-5" /> },
        { id: 'RECOVERY', label: 'Recuperação', icon: <HeartPulseIcon className="w-5 h-5" /> },
    ];

    const handleGenerate = async () => {
        setIsGenerating(true);
        try {
            const program = storageService.getActiveProgram();
            const prompt = `Treino de elite para atleta de ${program} focado em ${selectedValence} no ambiente ${location}.`;
            const content = await generateGymPlan(prompt, 'Equipamento disponível no local', program);
            
            const newWorkout: SavedWorkout = {
                id: `wk-${Date.now()}`,
                title: `${valences.find(v => v.id === selectedValence)?.label} @ ${location}`,
                content,
                location,
                valence: selectedValence,
                date: new Date()
            };

            setWorkoutHistory(prev => [newWorkout, ...prev]);
            toast.success("Plano de Performance gerado!");
        } catch (e) {
            toast.error("IA temporariamente offline.");
        } finally {
            setIsGenerating(false);
        }
    };

    const handlePhotoCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0] && activeWorkoutIdForPhoto) {
            const reader = new FileReader();
            reader.onload = () => {
                const photoUrl = reader.result as string;
                setWorkoutHistory(prev => prev.map(w => 
                    w.id === activeWorkoutIdForPhoto ? { ...w, photo: photoUrl } : w
                ));
                toast.success("Missão Validada! +50 XP");
                setActiveWorkoutIdForPhoto(null);
            };
            reader.readAsDataURL(e.target.files[0]);
        }
    };

    return (
        <div className="flex-1 flex flex-col min-h-0 animate-fade-in overflow-hidden">
            <PageHeader title="Iron Lab" subtitle="A Fábrica de Performance do Gladiador." />

            <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 overflow-hidden mt-2">
                {/* LEFT CONTAINER: AI CONSOLE (Narrow) */}
                <div className="lg:col-span-4 bg-secondary/40 rounded-[2.5rem] border border-white/5 p-6 flex flex-col shadow-2xl h-full overflow-hidden">
                    <div className="flex items-center gap-3 mb-6 shrink-0">
                        <SparklesIcon className="w-5 h-5 text-orange-500 animate-pulse" />
                        <h3 className="text-lg font-black text-white italic uppercase tracking-tighter">Forge Console</h3>
                    </div>

                    <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 space-y-8">
                        {/* Environment Buttons */}
                        <section>
                            <p className="text-[9px] font-black text-text-secondary uppercase tracking-[0.2em] mb-3 ml-1">1. Selecione o Ambiente</p>
                            <div className="grid grid-cols-3 gap-2 p-1 bg-black/20 rounded-2xl border border-white/5">
                                {[
                                    { id: 'GYM', label: 'Academia' },
                                    { id: 'HOME', label: 'Casa' },
                                    { id: 'STREET', label: 'Rua' }
                                ].map(env => (
                                    <button 
                                        key={env.id} 
                                        onClick={() => setLocation(env.id as any)}
                                        className={`py-3 rounded-xl text-[9px] font-black uppercase transition-all ${location === env.id ? 'bg-orange-600 text-white shadow-lg' : 'text-text-secondary hover:text-white'}`}
                                    >
                                        {env.label}
                                    </button>
                                ))}
                            </div>
                        </section>

                        {/* Valence Grid 3x3 */}
                        <section>
                            <p className="text-[9px] font-black text-text-secondary uppercase tracking-[0.2em] mb-3 ml-1">2. Valência Técnica</p>
                            <div className="grid grid-cols-3 gap-2">
                                {valences.map(v => (
                                    <button 
                                        key={v.id}
                                        onClick={() => setSelectedValence(v.id)}
                                        className={`aspect-square rounded-2xl border flex flex-col items-center justify-center gap-2 transition-all active:scale-95 ${selectedValence === v.id ? 'bg-orange-600 border-orange-400 text-white shadow-glow-orange' : 'bg-black/20 border-white/5 text-text-secondary hover:border-white/20'}`}
                                    >
                                        {v.icon}
                                        <span className="text-[8px] font-black uppercase text-center px-1">{v.label}</span>
                                    </button>
                                ))}
                            </div>
                        </section>
                    </div>

                    <button 
                        onClick={handleGenerate}
                        disabled={isGenerating}
                        className="mt-6 w-full bg-white text-black font-black py-5 rounded-[2rem] uppercase italic text-xs shadow-glow-orange shrink-0 transition-all active:scale-95 flex justify-center items-center gap-2"
                    >
                        {isGenerating ? <RefreshIcon className="w-5 h-5 animate-spin" /> : <><DumbbellIcon className="w-5 h-5" /> Construir Treino</>}
                    </button>
                </div>

                {/* RIGHT CONTAINER: LIBRARY (Wide) */}
                <div className="lg:col-span-8 bg-black/20 rounded-[3rem] border border-white/5 flex flex-col overflow-hidden h-full">
                    <div className="p-6 border-b border-white/5 flex justify-between items-center shrink-0">
                        <h3 className="text-xs font-black text-text-secondary uppercase tracking-[0.4em]">Workout Library</h3>
                        <span className="text-[10px] text-orange-400 font-bold uppercase">{workoutHistory.length} Sessões</span>
                    </div>

                    <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6">
                        {workoutHistory.map((workout) => (
                            <div key={workout.id} className="bg-secondary/40 rounded-[2.5rem] border border-white/5 p-6 animate-slide-in relative overflow-hidden group">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h4 className="text-xl font-black text-white uppercase italic leading-none">{workout.title}</h4>
                                        <p className="text-[9px] text-text-secondary font-bold mt-2 uppercase tracking-widest">
                                            {new Date(workout.date).toLocaleDateString()} • {new Date(workout.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                        </p>
                                    </div>
                                    
                                    <div className="flex gap-2">
                                        {workout.photo ? (
                                            <div className="w-12 h-12 rounded-xl border border-green-500/30 overflow-hidden shadow-glow">
                                                <img src={workout.photo} className="w-full h-full object-cover" alt="Suor" />
                                            </div>
                                        ) : (
                                            <button 
                                                onClick={() => { setActiveWorkoutIdForPhoto(workout.id); cameraRef.current?.click(); }}
                                                className="p-3 bg-orange-600/10 hover:bg-orange-600 text-orange-400 hover:text-white rounded-xl border border-orange-500/20 transition-all flex flex-col items-center"
                                                title="Modo Snapshot"
                                            >
                                                <CameraIcon className="w-5 h-5" />
                                                <span className="text-[7px] font-black mt-1">SNAP</span>
                                            </button>
                                        )}
                                    </div>
                                </div>

                                <div className="prose prose-invert max-w-none text-[11px] leading-relaxed text-text-secondary bg-black/20 p-4 rounded-2xl border border-white/5">
                                    <div dangerouslySetInnerHTML={{ __html: workout.content }} />
                                </div>
                            </div>
                        ))}

                        {workoutHistory.length === 0 && (
                            <div className="h-full flex flex-col items-center justify-center opacity-10">
                                <DumbbellIcon className="w-20 h-20 mb-4" />
                                <p className="font-black uppercase tracking-[0.5em] text-sm text-center px-10">Sua jornada de ferro começa no console ao lado.</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <input 
                type="file" 
                ref={cameraRef} 
                className="hidden" 
                accept="image/*" 
                capture="environment" 
                onChange={handlePhotoCapture} 
            />
        </div>
    );
};

export default IronLab;