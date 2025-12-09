
import React, { useState, useEffect, useContext } from 'react';
import Card from '../components/Card';
import { Course, CourseLevel, SavedWorkout } from '../types';
import { storageService } from '../services/storageService';
import { generateCourseCurriculum, generateGymPlan } from '../services/geminiService';
import { AcademyIcon, VideoIcon, FolderIcon } from '../components/icons/NavIcons';
import { SparklesIcon, ChevronDownIcon, DumbbellIcon } from '../components/icons/UiIcons';
import { UserContext } from '../components/Layout';
import { authService } from '../services/authService';
import LazyImage from '@/components/LazyImage';

const Academy: React.FC = () => {
    const { currentRole } = useContext(UserContext);
    const [courses, setCourses] = useState<Course[]>([]);
    const [activeCourse, setActiveCourse] = useState<Course | null>(null);
    const [viewMode, setViewMode] = useState<'CATALOG' | 'LEARNING' | 'GYM' | 'MY_WORKOUTS'>('CATALOG');
    
    const [topic, setTopic] = useState('');
    const [level, setLevel] = useState<CourseLevel>('FAN');
    const [isGenerating, setIsGenerating] = useState(false);
    const [showGenerator, setShowGenerator] = useState(false);

    const [gymGoal, setGymGoal] = useState('');
    const [gymEquipment, setGymEquipment] = useState('ACADEMIA');
    const [generatedWorkout, setGeneratedWorkout] = useState('');
    const [isGeneratingWorkout, setIsGeneratingWorkout] = useState(false);
    const [savedWorkouts, setSavedWorkouts] = useState<SavedWorkout[]>([]);

    const isPlayer = currentRole === 'PLAYER';

    useEffect(() => {
        setCourses(storageService.getCourses());
        const user = authService.getCurrentUser();
        if(user) {
            const player = storageService.getPlayers().find(p => p.name === user.name);
            if(player && player.savedWorkouts) {
                setSavedWorkouts(player.savedWorkouts);
            }
        }
    }, [viewMode]);

    const handleGenerateCourse = async () => {
        if (!topic) return;
        setIsGenerating(true);
        const jsonString = await generateCourseCurriculum(topic, level);
        try {
            const parsed = JSON.parse(jsonString);
            const newCourse: Course = {
                id: Date.now().toString(),
                title: parsed.title,
                description: parsed.description,
                level: level,
                author: 'Gridiron AI',
                createdAt: new Date(),
                modules: parsed.modules.map((m: any, i: number) => ({
                    id: `mod-${i}`,
                    title: m.title,
                    lessons: m.lessons.map((l: any, j: number) => ({
                        id: `les-${i}-${j}`,
                        title: l.title,
                        content: l.content,
                        videoSearchTerm: l.videoSearchTerm,
                        completed: false
                    }))
                })),
                thumbnailUrl: `https://source.unsplash.com/random/400x250/?football,stadium&sig=${Date.now()}`
            };
            const updated = [...courses, newCourse];
            setCourses(updated);
            storageService.saveCourses(updated);
            setIsGenerating(false);
            setShowGenerator(false);
            setTopic('');
        } catch (e) {
            console.error("Failed to parse course JSON", e);
            setIsGenerating(false);
        }
    };

    const handleGenerateWorkout = async () => {
        if (!gymGoal) return;
        setIsGeneratingWorkout(true);
        const plan = await generateGymPlan(gymGoal, gymEquipment, 'Atleta');
        setGeneratedWorkout(plan);
        setIsGeneratingWorkout(false);
    };

    const handleSaveWorkout = () => {
        const user = authService.getCurrentUser();
        if (!user) return;
        const player = storageService.getPlayers().find(p => p.name === user.name);
        if (player) {
            storageService.savePlayerWorkout(player.id, generatedWorkout, `Treino: ${gymGoal.substring(0, 20)}...`);
            alert("Treino salvo no seu perfil!");
            setViewMode('MY_WORKOUTS');
        }
    };

    const toggleLessonComplete = (courseId: string, modIdx: number, lesIdx: number) => {
        const updatedCourses = courses.map(c => {
            if (c.id === courseId) {
                const newModules = [...c.modules];
                newModules[modIdx].lessons[lesIdx].completed = !newModules[modIdx].lessons[lesIdx].completed;
                return { ...c, modules: newModules };
            }
            return c;
        });
        setCourses(updatedCourses);
        storageService.saveCourses(updatedCourses);
        if (activeCourse && activeCourse.id === courseId) {
            setActiveCourse(updatedCourses.find(c => c.id === courseId) || null);
        }
    };

    const getLevelBadge = (lvl: CourseLevel) => {
        if (lvl === 'FAN') return <span className="bg-green-500/20 text-green-400 text-[10px] font-bold px-2 py-0.5 rounded uppercase">Iniciante / Fã</span>;
        if (lvl === 'PLAYER') return <span className="bg-blue-500/20 text-blue-400 text-[10px] font-bold px-2 py-0.5 rounded uppercase">Atleta</span>;
        return <span className="bg-red-500/20 text-red-400 text-[10px] font-bold px-2 py-0.5 rounded uppercase">Coach / Avançado</span>;
    };

    const calculateProgress = (course: Course) => {
        let total = 0;
        let completed = 0;
        course.modules.forEach(m => {
            m.lessons.forEach(l => {
                total++;
                if (l.completed) completed++;
            });
        });
        return total === 0 ? 0 : Math.round((completed / total) * 100);
    };

    return (
        <div className="space-y-6 pb-12 animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-secondary rounded-xl">
                        <AcademyIcon className="text-highlight w-8 h-8" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold text-text-primary">Gridiron Academy</h2>
                        <p className="text-text-secondary">Conhecimento Técnico e Preparação Física.</p>
                    </div>
                </div>
                
                <div className="flex bg-secondary p-1 rounded-xl border border-white/10">
                    <button 
                        onClick={() => setViewMode('CATALOG')} 
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${viewMode === 'CATALOG' || viewMode === 'LEARNING' ? 'bg-highlight text-white' : 'text-text-secondary hover:text-white'}`}
                    >
                        Cursos
                    </button>
                    <button 
                        onClick={() => setViewMode('GYM')} 
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${viewMode === 'GYM' ? 'bg-red-600 text-white' : 'text-text-secondary hover:text-white'}`}
                    >
                        <DumbbellIcon className="w-4 h-4" /> Iron Athlete
                    </button>
                    <button 
                        onClick={() => setViewMode('MY_WORKOUTS')} 
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${viewMode === 'MY_WORKOUTS' ? 'bg-blue-600 text-white' : 'text-text-secondary hover:text-white'}`}
                    >
                        <FolderIcon className="w-4 h-4" /> Meus Treinos
                    </button>
                </div>
            </div>

            {viewMode === 'GYM' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
                    <div className="lg:col-span-1 space-y-6">
                        <Card title="Configurar Treino de Força">
                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs text-text-secondary font-bold uppercase mb-1 block">Objetivo Principal</label>
                                    <textarea 
                                        className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:border-highlight focus:outline-none h-24 text-sm"
                                        placeholder="Ex: Ganhar explosão para saída de DL, focar em pernas e core..."
                                        value={gymGoal}
                                        onChange={e => setGymGoal(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-text-secondary font-bold uppercase mb-1 block">Equipamento Disponível</label>
                                    <select 
                                        className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:border-highlight focus:outline-none"
                                        value={gymEquipment}
                                        onChange={e => setGymEquipment(e.target.value)}
                                    >
                                        <option value="ACADEMIA">Academia Completa (Pesos Livres + Máquinas)</option>
                                        <option value="HOME_DUMBBELLS">Casa (Apenas Halteres)</option>
                                        <option value="CALISTENIA">Calistenia (Peso do Corpo / Barra)</option>
                                        <option value="FUNCIONAL">Funcional (Elásticos, Kettlebell)</option>
                                    </select>
                                </div>
                                <button 
                                    onClick={handleGenerateWorkout}
                                    disabled={!gymGoal || isGeneratingWorkout}
                                    className="w-full bg-gradient-to-r from-red-600 to-orange-600 hover:to-orange-500 text-white font-bold py-3 rounded-lg shadow-lg flex justify-center items-center gap-2 disabled:opacity-50"
                                >
                                    {isGeneratingWorkout ? 'Montando Série...' : <><SparklesIcon className="w-5 h-5"/> Gerar Treino Personalizado</>}
                                </button>
                            </div>
                        </Card>
                    </div>

                    <div className="lg:col-span-2">
                        {generatedWorkout ? (
                            <div className="bg-secondary/50 rounded-xl border border-white/10 p-6 h-full">
                                <div className="flex justify-between items-center mb-6 pb-4 border-b border-white/10">
                                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                        <DumbbellIcon className="w-6 h-6 text-red-500" />
                                        Seu Plano de Treino
                                    </h3>
                                    <div className="flex gap-2">
                                        <button className="text-xs bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded font-bold" onClick={handleSaveWorkout}>
                                            Salvar na Minha Rotina
                                        </button>
                                        <button className="text-xs bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded" onClick={() => window.print()}>
                                            Imprimir PDF
                                        </button>
                                    </div>
                                </div>
                                <div className="prose prose-invert max-w-none text-sm custom-scrollbar max-h-[600px] overflow-y-auto">
                                    <div dangerouslySetInnerHTML={{ __html: generatedWorkout.replace(/\n/g, '<br/>').replace(/\*\*(.*?)\*\*/g, '<strong class="text-white">$1</strong>') }} />
                                </div>
                            </div>
                        ) : (
                            <div className="h-full flex flex-col items-center justify-center bg-secondary/20 rounded-xl border border-dashed border-white/10 p-12 text-center text-text-secondary">
                                <DumbbellIcon className="w-16 h-16 mb-4 opacity-20" />
                                <p>Preencha os dados ao lado para a IA criar seu treino de força específico.</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            {viewMode === 'MY_WORKOUTS' && (
                <div className="animate-fade-in">
                    <Card title="Histórico de Treinos Salvos">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {savedWorkouts.length === 0 && <p className="text-text-secondary italic">Nenhum treino salvo.</p>}
                            {savedWorkouts.map(w => (
                                <div key={w.id} className="bg-secondary p-4 rounded-xl border border-white/5 hover:border-blue-500/50 transition-all cursor-pointer" onClick={() => { setGeneratedWorkout(w.content); setViewMode('GYM'); }}>
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="text-[10px] bg-blue-900/30 text-blue-300 px-2 py-0.5 rounded font-bold">{new Date(w.date).toLocaleDateString()}</span>
                                        <FolderIcon className="w-4 h-4 text-text-secondary" />
                                    </div>
                                    <h4 className="font-bold text-white text-sm mb-2">{w.title}</h4>
                                    <p className="text-xs text-text-secondary line-clamp-3">Clique para visualizar...</p>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
            )}

            {(viewMode === 'CATALOG' || viewMode === 'LEARNING') && (
                <>
                    {!isPlayer && viewMode === 'CATALOG' && (
                        <div className="flex justify-end mb-6">
                            <button 
                                onClick={() => setShowGenerator(!showGenerator)}
                                className="bg-gradient-to-r from-highlight to-cyan-500 hover:shadow-glow text-white px-6 py-2.5 rounded-xl font-bold transition-all flex items-center gap-2"
                            >
                                <SparklesIcon className="w-4 h-4" />
                                Criar Curso com IA
                            </button>
                        </div>
                    )}

                    {showGenerator && viewMode === 'CATALOG' && (
                        <div className="bg-gradient-to-br from-secondary to-primary border border-highlight/30 rounded-2xl p-6 animate-slide-in relative overflow-hidden mb-8">
                            <div className="absolute top-0 right-0 p-4 opacity-10">
                                <AcademyIcon className="w-32 h-32" />
                            </div>
                            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                                <SparklesIcon className="text-cyan-400" />
                                Pedagogo Virtual
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                <div className="md:col-span-2">
                                    <label className="text-xs text-text-secondary font-bold uppercase mb-1 block">Tópico do Curso</label>
                                    <input 
                                        placeholder="Ex: Defesa 4-3, Regras de Penalidade, História do Super Bowl..."
                                        className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:border-highlight focus:outline-none"
                                        value={topic}
                                        onChange={e => setTopic(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-text-secondary font-bold uppercase mb-1 block">Público Alvo</label>
                                    <select 
                                        className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:border-highlight focus:outline-none"
                                        value={level}
                                        onChange={e => setLevel(e.target.value as CourseLevel)}
                                    >
                                        <option value="FAN">Fã / Iniciante</option>
                                        <option value="PLAYER">Atleta</option>
                                        <option value="COACH">Coach / Técnico</option>
                                    </select>
                                </div>
                            </div>
                            <div className="flex justify-end">
                                <button 
                                    onClick={handleGenerateCourse}
                                    disabled={isGenerating || !topic}
                                    className="bg-highlight hover:bg-highlight-hover text-white px-8 py-3 rounded-lg font-bold shadow-lg flex items-center gap-2 disabled:opacity-50"
                                >
                                    {isGenerating ? 'Criando Currículo...' : 'Gerar Curso'}
                                </button>
                            </div>
                        </div>
                    )}

                    {viewMode === 'CATALOG' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {courses.map(course => {
                                const progress = calculateProgress(course);
                                return (
                                    <div key={course.id} className="group bg-secondary hover:bg-secondary/80 rounded-xl border border-white/5 overflow-hidden transition-all hover:shadow-glow hover:-translate-y-1">
                                        <div className="h-40 bg-gray-800 relative overflow-hidden">
                                            <LazyImage src={course.thumbnailUrl || 'https://via.placeholder.com/400x200'} className="w-full h-full object-cover opacity-60 group-hover:opacity-80 transition-opacity" />
                                            <div className="absolute top-2 right-2">
                                                {getLevelBadge(course.level)}
                                            </div>
                                            <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/50">
                                                <div className="h-full bg-green-500" style={{ width: `${progress}%` }}></div>
                                            </div>
                                        </div>
                                        <div className="p-5">
                                            <h3 className="text-xl font-bold text-white mb-2 line-clamp-1">{course.title}</h3>
                                            <p className="text-text-secondary text-sm mb-4 line-clamp-2 h-10">{course.description}</p>
                                            
                                            <div className="flex justify-between items-center mt-4 pt-4 border-t border-white/5">
                                                <div className="text-xs text-text-secondary">
                                                    <span>{course.modules.reduce((acc, m) => acc + m.lessons.length, 0)} Lições</span>
                                                    <span className="mx-2">•</span>
                                                    <span>{progress}% Concluído</span>
                                                </div>
                                                <button 
                                                    onClick={() => { setActiveCourse(course); setViewMode('LEARNING'); }}
                                                    className="text-sm font-bold text-highlight hover:text-white transition-colors"
                                                >
                                                    {progress > 0 ? 'Continuar' : 'Iniciar'} →
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}

                    {viewMode === 'LEARNING' && activeCourse && (
                        <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-12rem)]">
                            <div className="w-full lg:w-1/3 bg-secondary rounded-xl border border-white/5 overflow-y-auto custom-scrollbar">
                                <div className="p-4 border-b border-white/5 bg-secondary/80 sticky top-0 backdrop-blur-sm z-10">
                                    <button onClick={() => setViewMode('CATALOG')} className="text-xs text-text-secondary hover:text-white mb-2">← Voltar</button>
                                    <h3 className="font-bold text-white leading-tight">{activeCourse.title}</h3>
                                    <div className="mt-2 w-full bg-black/30 h-1.5 rounded-full overflow-hidden">
                                        <div className="bg-green-500 h-full" style={{ width: `${calculateProgress(activeCourse)}%` }}></div>
                                    </div>
                                </div>
                                <div className="p-2">
                                    {activeCourse.modules.map((module, mIdx) => (
                                        <div key={module.id} className="mb-2">
                                            <div className="px-3 py-2 text-xs font-bold text-text-secondary uppercase tracking-wider bg-black/20 rounded mb-1">
                                                {module.title}
                                            </div>
                                            <div className="space-y-1">
                                                {module.lessons.map((lesson, lIdx) => (
                                                    <div key={lesson.id} className="flex items-center gap-3 p-3 rounded hover:bg-white/5 cursor-pointer group">
                                                        <input 
                                                            type="checkbox" 
                                                            checked={lesson.completed}
                                                            onChange={() => toggleLessonComplete(activeCourse.id, mIdx, lIdx)}
                                                            className="accent-green-500 w-4 h-4 cursor-pointer"
                                                        />
                                                        <span className={`text-sm flex-1 ${lesson.completed ? 'text-text-secondary line-through opacity-50' : 'text-white'}`}>
                                                            {lesson.title}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="flex-1 bg-secondary rounded-xl border border-white/5 overflow-y-auto p-8 custom-scrollbar relative">
                                <div className="max-w-3xl mx-auto space-y-12">
                                    <div className="text-center mb-10">
                                        <span className="text-xs font-bold text-highlight uppercase tracking-widest border border-highlight/30 px-3 py-1 rounded-full">
                                            Módulo de Aprendizado
                                        </span>
                                        <h1 className="text-3xl font-bold text-white mt-4">{activeCourse.title}</h1>
                                        <p className="text-text-secondary mt-2 text-lg">{activeCourse.description}</p>
                                    </div>

                                    {activeCourse.modules.map((module) => (
                                        <div key={module.id} className="space-y-6">
                                            <h2 className="text-2xl font-bold text-white border-b border-white/10 pb-2">{module.title}</h2>
                                            {module.lessons.map((lesson) => (
                                                <div key={lesson.id} className="bg-primary/30 p-6 rounded-xl border border-white/5 hover:border-white/10 transition-colors">
                                                    <div className="flex items-center gap-3 mb-4">
                                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${lesson.completed ? 'bg-green-500 text-white' : 'bg-white/10 text-text-secondary'}`}>
                                                            {lesson.completed ? '✓' : '?'}
                                                        </div>
                                                        <h3 className="text-xl font-bold text-white">{lesson.title}</h3>
                                                    </div>
                                                    
                                                    <div className="prose prose-invert max-w-none prose-p:text-text-secondary prose-p:leading-relaxed">
                                                        <p>{lesson.content}</p>
                                                    </div>

                                                    {lesson.videoSearchTerm && (
                                                        <div className="mt-6 pt-4 border-t border-white/5">
                                                            <a 
                                                                href={`https://www.youtube.com/results?search_query=${encodeURIComponent(lesson.videoSearchTerm)}`} 
                                                                target="_blank" 
                                                                rel="noreferrer"
                                                                className="inline-flex items-center gap-2 bg-red-600/10 hover:bg-red-600/20 text-red-400 px-4 py-2 rounded-lg transition-colors border border-red-500/20"
                                                            >
                                                                <VideoIcon className="w-5 h-5" />
                                                                <span>Ver Vídeos sobre: "{lesson.videoSearchTerm}"</span>
                                                            </a>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    ))}
                                    
                                    <div className="h-20"></div>
                                </div>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default Academy;