
import React, { useState, useEffect } from 'react';
// @ts-ignore
import { useNavigate } from 'react-router-dom';
import { storageService } from '../services/storageService';
import { generateMarketingContent } from '../services/geminiService';
import { SocialPost, Announcement, Course } from '../types';
import { MegaphoneIcon, AcademyIcon, TicketIcon, GlobeIcon } from '../components/icons/NavIcons';
import { SparklesIcon, UsersIcon, BellIcon, ShareIcon, UserPlusIcon, QrcodeIcon, LinkIcon, AlertTriangleIcon } from '../components/icons/UiIcons';
import Card from '../components/Card';
import LazyImage from '../components/LazyImage';

const Marketing: React.FC = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'SOCIAL' | 'COMMUNITY' | 'INTERNAL'>('SOCIAL');
    
    // Social State
    const [posts, setPosts] = useState<SocialPost[]>([]);
    const [topic, setTopic] = useState('');
    const [platform, setPlatform] = useState('INSTAGRAM');
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedContent, setGeneratedContent] = useState('');
    const [apiError, setApiError] = useState('');

    // Community & Internal Data
    const [courses, setCourses] = useState<Course[]>([]);
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [candidateCount, setCandidateCount] = useState(0);

    useEffect(() => {
        setPosts(storageService.getSocialPosts());
        setCourses(storageService.getCourses());
        setAnnouncements(storageService.getAnnouncements());
        setCandidateCount(storageService.getCandidates().length);
    }, []);

    // --- SOCIAL GENERATOR ---
    const handleGenerate = async () => {
        if (!topic) return;
        setIsGenerating(true);
        setApiError('');
        
        try {
            const content = await generateMarketingContent(topic, platform);
            setGeneratedContent(content);
        } catch (error: any) {
            console.error(error);
            setApiError("Erro ao conectar com a IA. Verifique se o ambiente está configurado.");
            setGeneratedContent("Erro na geração. Tente novamente mais tarde.");
        } finally {
            setIsGenerating(false);
        }
    };

    const handleSavePost = () => {
        const newPost: SocialPost = {
            id: Date.now().toString(),
            platform: platform as any,
            topic,
            content: generatedContent,
            status: 'SCHEDULED',
            scheduledDate: new Date()
        };
        const updated = [newPost, ...posts];
        setPosts(updated);
        storageService.saveSocialPosts(updated);
        setGeneratedContent('');
        setTopic('');
    };

    const copyPublicLink = () => {
        const url = `${window.location.origin}/#/public/team`;
        navigator.clipboard.writeText(url);
        alert("Link copiado: " + url);
    };

    const copyTryoutLink = () => {
        const url = `${window.location.origin}/#/onboarding?mode=tryout`;
        navigator.clipboard.writeText(url);
        alert("Link da Seletiva copiado! Use na Bio do Instagram.");
    };

    return (
        <div className="space-y-6 pb-12 animate-fade-in">
             <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-secondary rounded-xl">
                        <MegaphoneIcon className="h-8 w-8 text-highlight" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold text-text-primary">Diretoria de Marketing</h2>
                        <p className="text-text-secondary">Brand Command Center & Engajamento.</p>
                    </div>
                </div>
                
                <div className="flex gap-3">
                    <button 
                        onClick={() => navigate('/event-desk')} 
                        className="bg-gradient-to-r from-green-600 to-green-500 hover:from-green-500 hover:to-green-400 text-white px-4 py-2 rounded-lg font-bold text-xs flex items-center gap-2 shadow-lg transition-transform hover:scale-105"
                    >
                        <TicketIcon className="w-4 h-4" />
                        PDV: Bar & Eventos
                    </button>
                    <button 
                        onClick={copyPublicLink} 
                        className="bg-white/10 hover:bg-white/20 border border-white/10 text-white px-4 py-2 rounded-lg font-bold text-xs flex items-center gap-2"
                    >
                        <GlobeIcon className="w-4 h-4 text-green-400" /> Site Oficial
                    </button>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-white/10 overflow-x-auto">
                <button onClick={() => setActiveTab('SOCIAL')} className={`px-6 py-3 font-bold text-sm border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${activeTab === 'SOCIAL' ? 'border-pink-500 text-pink-400' : 'border-transparent text-text-secondary hover:text-white'}`}>
                    <ShareIcon className="w-4 h-4"/> Social Media (IA)
                </button>
                <button onClick={() => setActiveTab('COMMUNITY')} className={`px-6 py-3 font-bold text-sm border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${activeTab === 'COMMUNITY' ? 'border-blue-500 text-blue-400' : 'border-transparent text-text-secondary hover:text-white'}`}>
                    <AcademyIcon className="w-4 h-4"/> Comunidade & Leads
                </button>
                <button onClick={() => setActiveTab('INTERNAL')} className={`px-6 py-3 font-bold text-sm border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${activeTab === 'INTERNAL' ? 'border-yellow-500 text-yellow-400' : 'border-transparent text-text-secondary hover:text-white'}`}>
                    <BellIcon className="w-4 h-4"/> Mural Interno
                </button>
            </div>

            {/* === TAB 1: SOCIAL MEDIA === */}
            {activeTab === 'SOCIAL' && (
                <div className="space-y-6 animate-slide-in">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card title="Criador de Conteúdo (IA Generativa)">
                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs font-bold text-text-secondary block mb-1">Tópico do Post</label>
                                    <input className="w-full bg-black/20 border border-white/10 rounded p-2 text-white" placeholder="Ex: Vitória no clássico, Venda de ingressos..." value={topic} onChange={e => setTopic(e.target.value)} />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-text-secondary block mb-1">Plataforma</label>
                                    <select className="w-full bg-black/20 border border-white/10 rounded p-2 text-white" value={platform} onChange={e => setPlatform(e.target.value)}>
                                        <option value="INSTAGRAM">Instagram (Feed/Reels)</option>
                                        <option value="TIKTOK">TikTok</option>
                                        <option value="WEBSITE">Site (Notícia)</option>
                                    </select>
                                </div>
                                
                                <button onClick={handleGenerate} disabled={isGenerating || !topic} className="w-full bg-gradient-to-r from-pink-500 to-orange-500 text-white font-bold py-2 rounded flex justify-center items-center gap-2 disabled:opacity-50">
                                     {isGenerating ? 'Criando...' : <><SparklesIcon className="w-4 h-4"/> ✨ Gerar Copy</>}
                                </button>
                            </div>
                        </Card>

                        <Card title="Preview & Agendamento">
                            {apiError && (
                                <div className="bg-red-900/50 border border-red-500/30 p-3 rounded mb-4 flex items-center gap-2 text-red-200 text-xs">
                                    <AlertTriangleIcon className="w-4 h-4" />
                                    {apiError}
                                </div>
                            )}
                            {generatedContent ? (
                                <div className="space-y-4">
                                    <textarea className="w-full h-40 bg-black/20 border border-white/10 rounded p-3 text-white text-sm" value={generatedContent} onChange={e => setGeneratedContent(e.target.value)} />
                                    <button onClick={handleSavePost} className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded">
                                        Agendar Postagem
                                    </button>
                                </div>
                            ) : (
                                <div className="h-full flex items-center justify-center text-text-secondary opacity-50 text-center text-sm p-4">
                                    Gere um conteúdo ao lado para visualizar aqui. <br/>
                                </div>
                            )}
                        </Card>
                    </div>

                    <h3 className="font-bold text-xl text-white mt-8">Calendário de Postagens</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {posts.map(post => (
                            <div key={post.id} className="bg-secondary p-4 rounded-xl border border-white/5">
                                <div className="flex justify-between mb-2">
                                    <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded text-white font-bold">{post.platform}</span>
                                    <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${post.status === 'POSTED' ? 'text-green-400' : 'text-yellow-400'}`}>{post.status}</span>
                                </div>
                                <h4 className="font-bold text-white text-sm mb-2">{post.topic}</h4>
                                <p className="text-xs text-text-secondary line-clamp-3 whitespace-pre-wrap">{post.content}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* === TAB 2: COMMUNITY (ACADEMY + TRYOUTS) === */}
            {activeTab === 'COMMUNITY' && (
                <div className="space-y-6 animate-slide-in">
                    {/* TRYOUT CAMPAIGN CARD - NEW FEATURE */}
                    <div className="bg-gradient-to-r from-green-900/40 to-secondary p-6 rounded-2xl border border-green-500/20 relative overflow-hidden">
                        <div className="absolute right-0 top-0 p-4 opacity-10">
                            <UserPlusIcon className="w-32 h-32" />
                        </div>
                        <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                            <UserPlusIcon className="w-6 h-6 text-green-400" />
                            Campanha de Seletiva (Tryouts)
                        </h3>
                        <div className="flex flex-col md:flex-row gap-8 items-center">
                            <div className="flex-1">
                                <p className="text-sm text-text-secondary mb-4">
                                    Use este link para divulgar a próxima peneira nas redes sociais. Os candidatos cairão direto no banco de dados do Coach.
                                </p>
                                <div className="flex gap-3">
                                    <button onClick={copyTryoutLink} className="bg-green-600 hover:bg-green-500 text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 shadow-lg">
                                        <LinkIcon className="w-4 h-4" /> Copiar Link de Inscrição
                                    </button>
                                    <button className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 border border-white/10">
                                        <QrcodeIcon className="w-4 h-4" /> Baixar QR Code
                                    </button>
                                </div>
                            </div>
                            <div className="bg-black/30 p-4 rounded-xl border border-white/10 text-center min-w-[200px]">
                                <p className="text-xs text-text-secondary font-bold uppercase mb-1">Candidatos Inscritos</p>
                                <p className="text-4xl font-black text-white">{candidateCount}</p>
                                <p className="text-[10px] text-green-400 mt-1">Funil Ativo</p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <Card className="bg-blue-900/20 border-l-4 border-l-blue-500">
                            <div className="flex items-center gap-4">
                                <AcademyIcon className="w-8 h-8 text-blue-400" />
                                <div>
                                    <p className="text-xs text-text-secondary uppercase font-bold">Cursos Ativos</p>
                                    <p className="text-2xl font-black text-white">{courses.length}</p>
                                </div>
                            </div>
                        </Card>
                        <Card className="bg-indigo-900/20 border-l-4 border-l-indigo-500">
                            <div className="flex items-center gap-4">
                                <UsersIcon className="w-8 h-8 text-indigo-400" />
                                <div>
                                    <p className="text-xs text-text-secondary uppercase font-bold">Alunos / Fãs</p>
                                    <p className="text-2xl font-black text-white">142</p>
                                </div>
                            </div>
                        </Card>
                    </div>

                    <Card title="Catálogo de Cursos (Produtos Digitais)">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {courses.map(course => (
                                <div key={course.id} className="bg-secondary p-4 rounded-xl border border-white/5 flex gap-3">
                                    <div className="w-16 h-16 bg-black/30 rounded-lg flex-shrink-0 overflow-hidden">
                                        <LazyImage src={course.thumbnailUrl} className="w-full h-full object-cover" />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white text-sm line-clamp-1">{course.title}</h4>
                                        <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded text-text-secondary uppercase">{course.level}</span>
                                        <p className="text-xs text-green-400 mt-1 font-bold">R$ 49,90</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <button onClick={() => window.location.href='#/academy'} className="mt-4 text-xs text-highlight hover:underline">Gerenciar Cursos na Academy →</button>
                    </Card>
                </div>
            )}

            {/* === TAB 3: INTERNAL (COMMS) === */}
            {activeTab === 'INTERNAL' && (
                <div className="space-y-6 animate-slide-in">
                    <Card title="Mural de Comunicados (Endomarketing)">
                        <p className="text-sm text-text-secondary mb-4">Gerencie as mensagens que aparecem para Atletas e Staff na tela de "Comunicações".</p>
                        <div className="space-y-3">
                            {announcements.map(announcement => (
                                <div key={announcement.id} className="flex justify-between items-center bg-secondary p-4 rounded-xl border border-white/5">
                                    <div>
                                        <h4 className="font-bold text-white">{announcement.title}</h4>
                                        <p className="text-xs text-text-secondary line-clamp-1">{announcement.content}</p>
                                        <span className="text-[10px] text-text-secondary mt-1 block">{new Date(announcement.date).toLocaleDateString()}</span>
                                    </div>
                                    <span className={`text-[10px] px-2 py-1 rounded font-bold ${announcement.priority === 'URGENT' ? 'bg-red-500/20 text-red-400' : 'bg-blue-500/20 text-blue-400'}`}>
                                        {announcement.priority}
                                    </span>
                                </div>
                            ))}
                        </div>
                        <button onClick={() => window.location.href='#/communications'} className="w-full mt-4 bg-secondary hover:bg-white/10 border border-white/10 text-white py-2 rounded text-sm font-bold">
                            Criar Novo Comunicado
                        </button>
                    </Card>
                </div>
            )}
        </div>
    );
};
export default Marketing;