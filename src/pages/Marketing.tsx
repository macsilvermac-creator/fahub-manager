import React, { useState, useEffect } from 'react';
import { storageService } from '../services/storageService';
import { generateMarketingContent } from '../services/geminiService';
import { SocialPost } from '../types';
import { MegaphoneIcon } from '../components/icons/NavIcons';
import { SparklesIcon } from '../components/icons/UiIcons';
import Card from '../components/Card';

const Marketing: React.FC = () => {
    const [posts, setPosts] = useState<SocialPost[]>([]);
    const [topic, setTopic] = useState('');
    const [platform, setPlatform] = useState('INSTAGRAM');
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedContent, setGeneratedContent] = useState('');

    useEffect(() => {
        setPosts(storageService.getSocialPosts());
    }, []);

    const handleGenerate = async () => {
        if (!topic) return;
        setIsGenerating(true);
        const content = await generateMarketingContent(topic, platform);
        setGeneratedContent(content);
        setIsGenerating(false);
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

    return (
        <div className="space-y-6 pb-12 animate-fade-in">
             <div className="flex items-center gap-3">
                <div className="p-3 bg-secondary rounded-xl">
                    <MegaphoneIcon className="h-8 w-8 text-highlight" />
                </div>
                <div>
                    <h2 className="text-3xl font-bold text-text-primary">Marketing & Social Media</h2>
                    <p className="text-text-secondary">Gerenciamento de Comunidade e Criação de Conteúdo.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card title="Criador de Conteúdo (IA)">
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
                        <button onClick={handleGenerate} disabled={isGenerating || !topic} className="w-full bg-gradient-to-r from-pink-500 to-orange-500 text-white font-bold py-2 rounded flex justify-center items-center gap-2">
                             {isGenerating ? 'Criando...' : <><SparklesIcon className="w-4 h-4"/> ✨ Gerar Copy</>}
                        </button>
                    </div>
                </Card>

                <Card title="Preview & Agendamento">
                    {generatedContent ? (
                        <div className="space-y-4">
                            <textarea className="w-full h-40 bg-black/20 border border-white/10 rounded p-3 text-white text-sm" value={generatedContent} onChange={e => setGeneratedContent(e.target.value)} />
                            <button onClick={handleSavePost} className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded">
                                Agendar Postagem
                            </button>
                        </div>
                    ) : (
                        <div className="h-full flex items-center justify-center text-text-secondary opacity-50">
                            Gere um conteúdo ao lado para visualizar.
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
    );
};
export default Marketing;