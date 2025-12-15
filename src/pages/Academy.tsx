
import React, { useState, useEffect, useContext } from 'react';
import Card from '../components/Card';
import { Course, CourseLevel, SavedWorkout, GymDay, QuizQuestion } from '../types';
import { storageService } from '../services/storageService';
import { generateCourseCurriculum, generateStructuredGymPlan, generateQuizFromContent } from '../services/geminiService';
import { AcademyIcon, VideoIcon, FolderIcon, TrophyIcon } from '../components/icons/NavIcons';
import { SparklesIcon, DumbbellIcon, CheckCircleIcon, BrainIcon, XIcon } from '../components/icons/UiIcons';
import { UserContext } from '../components/Layout';
import { authService } from '../services/authService';
import LazyImage from '@/components/LazyImage';
import { useToast } from '../contexts/ToastContext';

// --- FEATURE FLAG PARA ROLLBACK ---
const ENABLE_AI_BETA = true; 

const Academy: React.FC = () => {
    const { currentRole } = useContext(UserContext);
    const toast = useToast();
    const [courses, setCourses] = useState<Course[]>([]);
    const [activeCourse, setActiveCourse] = useState<Course | null>(null);
    const [viewMode, setViewMode] = useState<'CATALOG' | 'LEARNING' | 'GYM' | 'MY_WORKOUTS' | 'QUIZ'>('CATALOG');
    
    // Config Cursos
    const [topic, setTopic] = useState('');
    const [level, setLevel] = useState<CourseLevel>('FAN');
    const [isGenerating, setIsGenerating] = useState(false);
    const [showGenerator, setShowGenerator] = useState(false);

    // Config Gym
    const [gymGoal, setGymGoal] = useState('');
    const [gymEquipment, setGymEquipment] = useState('ACADEMIA');
    const [structuredWorkout, setStructuredWorkout] = useState<GymDay[] | null>(null);
    const [isGeneratingWorkout, setIsGeneratingWorkout] = useState(false);
    const [savedWorkouts, setSavedWorkouts] = useState<SavedWorkout[]>([]);

    // Config Quiz
    const [quizQuestions, setQuizQuestions] = useState<QuizQuestion[]>([]);
    const [currentQuizIdx, setCurrentQuizIdx] = useState(0);
    const [quizScore, setQuizScore] = useState(0);
    const [showQuizResult, setShowQuizResult] = useState(false);
    const [isGeneratingQuiz, setIsGeneratingQuiz] = useState(false);
    const [quizTopic, setQuizTopic] = useState('');

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

    // --- LOGIC: GYM ---
    const handleGenerateWorkout = async () => {
        if (!gymGoal) return;
        setIsGeneratingWorkout(true);
        if (ENABLE_AI_BETA) {
            try {
                const plan = await generateStructuredGymPlan(gymGoal, gymEquipment);
                if (plan && plan.length > 0) {
                    setStructuredWorkout(plan);
                } else {
                    toast.error("IA não retornou plano válido. Tente simplificar.");
                }
            } catch (e) {
                toast.error("Erro ao gerar treino.");
            }
        } else {
            // Fallback for non-beta
            toast.info("Modo Beta desativado. Usando modo texto simples.");
        }
        setIsGeneratingWorkout(false);
    };

    const handleSaveWorkout = () => {
        const user = authService.getCurrentUser();
        if (!user || !structuredWorkout) return;
        const player = storageService.getPlayers().find(p => p.name === user.name);
        if (player) {
            // Salva como JSON no content para renderizar depois
            storageService.savePlayerWorkout(player.id, JSON.stringify(structuredWorkout), `Treino: ${gymGoal.substring(0, 15)}...`);
            toast.success("Treino salvo no perfil!");
            setViewMode('MY_WORKOUTS');
        }
    };

    // --- LOGIC: QUIZ ---
    const handleStartQuiz = async (contentTopic: string) => {
        setIsGeneratingQuiz(true);
        setQuizTopic(contentTopic);
        try {
            const questions = await generateQuizFromContent(contentTopic);
            if (questions.length > 0) {
                setQuizQuestions(questions);
                setCurrentQuizIdx(0);
                setQuizScore(0);
                setShowQuizResult(false);
                setViewMode('QUIZ');
            } else {
                toast.error("Erro ao criar quiz.");
            }
        } catch (e) {
            toast.error("Erro de conexão IA.");
        } finally {
            setIsGeneratingQuiz(false);
        }
    };

    const handleQuizAnswer = (optionIdx: number) => {
        const currentQ = quizQuestions[currentQuizIdx];
        if (optionIdx === currentQ.correctAnswer) {
            setQuizScore(prev => prev + 1);
            toast.success("Correto! +10 XP");
        } else {
            toast.error("Errado.");
        }

        if (currentQuizIdx < quizQuestions.length - 1) {
            setTimeout(() => setCurrentQuizIdx(prev => prev + 1), 1000);
        } else {
            setTimeout(() => {
                setShowQuizResult(true);
                // Award XP logic here
                const user = authService.getCurrentUser();
                if(user) {
                    const player = storageService.getPlayers().find(p => p.name === user.name);
                    if(player) storageService.addPlayerXP(player.id, quizScore * 20, `Quiz: ${quizTopic}`);
                }
            }, 1000);
        }
    };

    // --- RENDER HELPERS ---
    const renderWorkoutView = (plan: GymDay[]) => (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {plan.map((day, idx) => (
                <div key={idx} className="bg-secondary p-4 rounded-xl border border-white/5">
                    <h4 className="font-bold text-highlight text-lg mb-1">{day.title}</h4>
                    <p className="text-xs text-text-secondary mb-4 italic">{day.focus}</p>
                    <div className="space-y-2">
                        {day.exercises.map((ex, i) => (
                            <div key={i} className="bg-black/20 p-2 rounded flex justify-between items-center text-sm">
                                <div>
                                    <p className="font-bold text-white">{ex.name}</p>
                                    {ex.notes && <p className="text-[10px] text-text-secondary">{ex.notes}</p>}
                                </div>
                                <div className="text-right">
                                    <p className="text-xs font-mono text-white">{ex.sets} x {ex.reps}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ))}
        </div>
    );

    return (
        <div className="space-y-6 pb-12 animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-secondary rounded-xl">
                        <AcademyIcon className="text-highlight w-8 h-8" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold text-text-primary">Gridiron Academy {ENABLE_AI_BETA && <span className="text-xs bg-purple-600 px-2 py-0.5 rounded text-white ml-2">AI BETA</span>}</h2>
                        <p className="text-text-secondary">Conhecimento Técnico e Preparação Física.</p>
                    </div>
                </div>
                
                <div className="flex bg-secondary p-1 rounded-xl border border-white/10 overflow-x-auto">
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
                        <DumbbellIcon className="w-4 h-4" /> Iron Lab
                    </button>
                    <button 
                        onClick={() => setViewMode('MY_WORKOUTS')} 
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${viewMode === 'MY_WORKOUTS' ? 'bg-blue-600 text-white' : 'text-text-secondary hover:text-white'}`}
                    >
                        <FolderIcon className="w-4 h-4" /> Arquivo
                    </button>
                </div>
            </div>

            {/* --- QUIZ MODE --- */}
            {viewMode === 'QUIZ' && ENABLE_AI_BETA && (
                <div className="max-w-2xl mx-auto">
                    <Card title={`Desafio de Conhecimento: ${quizTopic}`}>
                        {!showQuizResult ? (
                            <div className="space-y-6">
                                <div className="flex justify-between items-center text-sm text-text-secondary">
                                    <span>Questão {currentQuizIdx + 1} de {quizQuestions.length}</span>
                                    <span>Score: {quizScore}</span>
                                </div>
                                <div className="h-2 w-full bg-black/40 rounded-full overflow-hidden">
                                    <div className="h-full bg-highlight transition-all duration-500" style={{ width: `${((currentQuizIdx + 1) / quizQuestions.length) * 100}%` }}></div>
                                </div>
                                
                                <h3 className="text-xl font-bold text-white py-4">{quizQuestions[currentQuizIdx].question}</h3>
                                
                                <div className="space-y-3">
                                    {quizQuestions[currentQuizIdx].options.map((opt, idx) => (
                                        <button 
                                            key={idx}
                                            onClick={() => handleQuizAnswer(idx)}
                                            className="w-full text-left p-4 rounded-xl bg-secondary border border-white/10 hover:border-highlight hover:bg-white/5 transition-all text-sm font-bold text-white"
                                        >
                                            {opt}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-10">
                                <TrophyIcon className="w-20 h-20 text-yellow-400 mx-auto mb-4" />
                                <h3 className="text-3xl font-black text-white">Resultado Final</h3>
                                <p className="text-xl mt-2 text-text-secondary">Você acertou <strong className="text-white">{quizScore}</strong> de {quizQuestions.length}!</p>
                                <p className="text-green-400 font-bold mt-4">+ {quizScore * 20} XP Adicionados</p>
                                <button onClick={() => setViewMode('CATALOG')} className="mt-8 bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded-lg font-bold">Voltar aos Cursos</button>
                            </div>
                        )}
                    </Card>
                </div>
            )}

            {/* --- GYM MODE --- */}
            {viewMode === 'GYM' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
                    <div className="lg:col-span-1 space-y-6">
                        <Card title="Configurar Treino de Força">
                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs text-text-secondary font-bold uppercase mb-1 block">Objetivo Principal</label>
                                    <textarea 
                                        className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:border-highlight focus:outline-none h-24 text-sm"
                                        placeholder="Ex: Ganhar explosão para saída de DL..."
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
                                        <option value="ACADEMIA">Academia Completa</option>
                                        <option value="HOME_DUMBBELLS">Casa (Halteres)</option>
                                        <option value="CALISTENIA">Peso do Corpo</option>
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
                        {structuredWorkout ? (
                            <div className="bg-secondary/30 rounded-xl border border-white/10 p-6 h-full">
                                <div className="flex justify-between items-center mb-6 pb-4 border-b border-white/10">
                                    <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                        <DumbbellIcon className="w-6 h-6 text-red-500" />
                                        Seu Plano de Treino
                                    </h3>
                                    <button className="text-xs bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded font-bold" onClick={handleSaveWorkout}>
                                        Salvar na Rotina
                                    </button>
                                </div>
                                {renderWorkoutView(structuredWorkout)}
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

            {/* --- SAVED WORKOUTS --- */}
            {viewMode === 'MY_WORKOUTS' && (
                <div className="animate-fade-in">
                    <Card title="Histórico de Treinos Salvos">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {savedWorkouts.length === 0 && <p className="text-text-secondary italic">Nenhum treino salvo.</p>}
                            {savedWorkouts.map(w => {
                                let content: any = w.content;
                                try {
                                    if (typeof w.content === 'string' && w.content.startsWith('[')) {
                                        content = JSON.parse(w.content);
                                    }
                                } catch (e) {}

                                const isStructured = Array.isArray(content);

                                return (
                                    <div key={w.id} className="bg-secondary p-4 rounded-xl border border-white/5 hover:border-blue-500/50 transition-all cursor-pointer" onClick={() => { 
                                        if(isStructured) {
                                            setStructuredWorkout(content);
                                            setViewMode('GYM');
                                        } else {
                                            alert("Formato legado (Texto): " + content);
                                        }
                                    }}>
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="text-[10px] bg-blue-900/30 text-blue-300 px-2 py-0.5 rounded font-bold">{new Date(w.date).toLocaleDateString()}</span>
                                            <FolderIcon className="w-4 h-4 text-text-secondary" />
                                        </div>
                                        <h4 className="font-bold text-white text-sm mb-2">{w.title}</h4>
                                        <p className="text-xs text-text-secondary">{isStructured ? 'Formato: Tabela Interativa' : 'Formato: Texto'}</p>
                                    </div>
                                );
                            })}
                        </div>
                    </Card>
                </div>
            )}

            {/* --- CATALOG (EXISTING) --- */}
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
                    
                    {/* ... Existing Generator UI ... */}

                    {viewMode === 'CATALOG' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {courses.map(course => (
                                <div key={course.id} className="group bg-secondary hover:bg-secondary/80 rounded-xl border border-white/5 overflow-hidden transition-all hover:shadow-glow hover:-translate-y-1">
                                    {/* ... Course Card Content ... */}
                                    <div className="p-5">
                                        <h3 className="text-xl font-bold text-white mb-2 line-clamp-1">{course.title}</h3>
                                        <p className="text-text-secondary text-sm mb-4 line-clamp-2 h-10">{course.description}</p>
                                        <button 
                                            onClick={() => { setActiveCourse(course); setViewMode('LEARNING'); }}
                                            className="text-sm font-bold text-highlight hover:text-white transition-colors"
                                        >
                                            Iniciar →
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

                    {viewMode === 'LEARNING' && activeCourse && (
                         <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-12rem)]">
                            {/* ... Learning View ... */}
                            <div className="w-full lg:w-1/3 bg-secondary rounded-xl border border-white/5 overflow-y-auto custom-scrollbar">
                                <div className="p-4 border-b border-white/5 bg-secondary/80 sticky top-0 backdrop-blur-sm z-10">
                                    <button onClick={() => setViewMode('CATALOG')} className="text-xs text-text-secondary hover:text-white mb-2">← Voltar</button>
                                    <h3 className="font-bold text-white leading-tight">{activeCourse.title}</h3>
                                </div>
                                <div className="p-2">
                                    {/* ... Module List ... */}
                                    {ENABLE_AI_BETA && (
                                        <button 
                                            onClick={() => handleStartQuiz(activeCourse.title)}
                                            className="w-full mt-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold py-3 rounded-lg shadow-lg flex items-center justify-center gap-2 hover:scale-105 transition-transform"
                                        >
                                            <BrainIcon className="w-5 h-5" /> Desafiar Conhecimento (+XP)
                                        </button>
                                    )}
                                </div>
                            </div>
                            <div className="flex-1 bg-secondary rounded-xl border border-white/5 overflow-y-auto p-8 custom-scrollbar relative">
                                {/* ... Content ... */}
                                <h1 className="text-3xl font-bold text-white mt-4">{activeCourse.title}</h1>
                                <p className="text-text-secondary mt-2 text-lg">{activeCourse.description}</p>
                                <div className="mt-8 border-t border-white/5 pt-8 text-center">
                                    <p className="text-sm text-text-secondary">Terminou o estudo?</p>
                                    {ENABLE_AI_BETA && <button onClick={() => handleStartQuiz(activeCourse.title)} className="mt-2 text-highlight font-bold underline">Faça a Prova Agora</button>}
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