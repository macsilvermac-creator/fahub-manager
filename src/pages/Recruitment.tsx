
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { storageService } from '../services/storageService';
// Fix: Ensuring correct imports from services and types
import { generateMarketingContent } from '../services/geminiService';
import { SocialPost, Announcement } from '../types';
import { MegaphoneIcon, GlobeIcon, VideoIcon } from '../components/icons/NavIcons';
import { SparklesIcon, UsersIcon, BellIcon, ShareIcon, LinkIcon, MicIcon } from '../components/icons/UiIcons';
import Card from '../components/Card';

const Marketing: React.FC = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<'SOCIAL' | 'FAN_PORTAL' | 'BROADCAST'>('SOCIAL');
    const [topic, setTopic] = useState('');
    const [platform, setPlatform] = useState('INSTAGRAM');
    const [isGenerating, setIsGenerating] = useState(false);
    const [generatedContent, setGeneratedContent] = useState('');

    const copyPublicLink = () => {
        const url = `${window.location.origin}/#/public/team`;
        navigator.clipboard.writeText(url);
        alert("Link do Portal do Fã copiado com sucesso!");
    };

    return (
        <div className="space-y-6 pb-12 animate-fade-in">
             <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-secondary rounded-xl"><MegaphoneIcon className="text-highlight w-8 h-8" /></div>
                    <div>
                        <h2 className="text-3xl font-black text-text-primary italic uppercase tracking-tighter">Marketing & Hype</h2>
                        <p className="text-text-secondary text-sm">Hub de Engajamento, Mídia e Comunidade.</p>
                    </div>
                </div>
                
                <div className="flex gap-2">
                    <button onClick={() => navigate('/broadcast-booth')} className="bg-red-600 hover:bg-red-500 text-white px-5 py-2.5 rounded-xl font-black text-xs flex items-center gap-2 shadow-lg transition-all active:scale-95"><MicIcon className="w-4 h-4" /> CABINE TV</button>
                    <button onClick={copyPublicLink} className="bg-white/5 hover:bg-white/10 text-white px-5 py-2.5 rounded-xl font-black text-xs flex items-center gap-2 border border-white/10 transition-all"><GlobeIcon className="w-4 h-4" /> PORTAL DO FÃ</button>
                </div>
            </div>

            <div className="flex border-b border-white/10 overflow-x-auto no-scrollbar">
                <button onClick={() => setActiveTab('SOCIAL')} className={`px-8 py-4 font-black text-xs border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap uppercase tracking-widest ${activeTab === 'SOCIAL' ? 'border-pink-500 text-pink-400' : 'border-transparent text-text-secondary'}`}>
                    Copywriter IA
                </button>
                <button onClick={() => setActiveTab('FAN_PORTAL')} className={`px-8 py-4 font-black text-xs border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap uppercase tracking-widest ${activeTab === 'FAN_PORTAL' ? 'border-blue-500 text-blue-400' : 'border-transparent text-text-secondary'}`}>
                    Gestão de Comunidade
                </button>
            </div>

            {activeTab === 'SOCIAL' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-slide-in">
                    <Card title="Assistente de Conteúdo Esportivo">
                        <p className="text-xs text-text-secondary mb-4">Deixe a IA escrever seus posts baseados nos eventos do time.</p>
                        <div className="space-y-4">
                            <textarea 
                                className="w-full h-32 bg-black/20 border border-white/10 rounded-2xl p-4 text-white focus:border-pink-500 outline-none transition-all placeholder-white/20" 
                                placeholder="Sobre o que vamos postar hoje? (Ex: Vitória no clássico, anúncio de tryout...)" 
                                value={topic} 
                                onChange={e => setTopic(e.target.value)} 
                            />
                            <div className="flex gap-2">
                                {['INSTAGRAM', 'TIKTOK', 'WHATSAPP'].map(p => (
                                    <button 
                                        key={p} 
                                        onClick={() => setPlatform(p)}
                                        className={`flex-1 py-2 rounded-lg text-[10px] font-black border transition-all ${platform === p ? 'bg-pink-500/20 border-pink-500 text-pink-400' : 'bg-black/20 border-white/10 text-text-secondary'}`}
                                    >
                                        {p}
                                    </button>
                                ))}
                            </div>
                            <button onClick={async () => {setIsGenerating(true); setGeneratedContent(await generateMarketingContent(topic, platform)); setIsGenerating(false);}} className="w-full bg-gradient-to-r from-pink-600 to-orange-500 text-white font-black py-4 rounded-2xl shadow-lg transform active:scale-95 transition-all flex items-center justify-center gap-2">
                                {isGenerating ? <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div> Criando...</> : <><SparklesIcon className="w-5 h-5"/> ✨ GERAR CONTEÚDO</>}
                            </button>
                        </div>
                    </Card>
                    <Card title="Preview & Copy (Toque para Copiar)">
                        <div 
                            onClick={() => { if(generatedContent) { navigator.clipboard.writeText(generatedContent); alert("Copiado!"); } }}
                            className={`bg-black/40 p-6 rounded-2xl text-sm leading-relaxed min-h-[250px] transition-all cursor-pointer hover:bg-black/60 relative group ${!generatedContent ? 'flex items-center justify-center italic text-text-secondary opacity-30' : 'text-white'}`}
                        >
                            {generatedContent ? (
                                <>
                                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity bg-white/10 p-2 rounded-lg"><LinkIcon className="w-4 h-4"/></div>
                                    <div className="whitespace-pre-wrap">{generatedContent}</div>
                                </>
                            ) : 'Aguardando comando da IA...'}
                        </div>
                    </Card>
                </div>
            )}

            {activeTab === 'FAN_PORTAL' && (
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-slide-in">
                    <Card title="Métricas de Engajamento">
                        <div className="space-y-4">
                            <div className="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/5">
                                <span className="text-text-secondary font-bold">Fãs Ativos</span>
                                <span className="text-2xl font-black text-white">432</span>
                            </div>
                            <div className="flex justify-between items-center p-4 bg-white/5 rounded-2xl border border-white/5">
                                <span className="text-text-secondary font-bold">XP Distribuído</span>
                                <span className="text-2xl font-black text-highlight">12.5k</span>
                            </div>
                        </div>
                    </Card>
                    <Card title="Ações Rápidas">
                        <div className="grid grid-cols-1 gap-3">
                            <button className="w-full bg-secondary hover:bg-white/5 border border-white/10 text-white font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-2">
                                <BellIcon className="w-4 h-4" /> Disparar Push (Todos)
                            </button>
                            <button className="w-full bg-secondary hover:bg-white/5 border border-white/10 text-white font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-2">
                                <ShareIcon className="w-4 h-4" /> Criar Cupom na Loja
                            </button>
                        </div>
                    </Card>
                 </div>
            )}
        </div>
    );
};
export default Marketing;