
import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../components/Layout';
import { storageService } from '../services/storageService';
import { SocialFeedPost, User } from '../types';
import { authService } from '../services/authService';
import { HeartIcon, MessageIcon, ShareIcon, ImageIcon, LinkIcon, SparklesIcon, CheckCircleIcon } from '../components/icons/UiIcons';
import LazyImage from '@/components/LazyImage';

const LockerRoom: React.FC = () => {
    const { currentRole } = useContext(UserContext);
    const [feed, setFeed] = useState<SocialFeedPost[]>([]);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    
    const [content, setContent] = useState('');
    const [mediaUrl, setMediaUrl] = useState('');
    const [isOfficialPost, setIsOfficialPost] = useState(false);
    const [showMediaInput, setShowMediaInput] = useState(false);

    useEffect(() => {
        setFeed(storageService.getSocialFeed());
        setCurrentUser(authService.getCurrentUser());
    }, []);

    const handlePost = (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentUser || !content.trim()) return;

        const newPost: SocialFeedPost = {
            id: `post-${Date.now()}`,
            authorName: isOfficialPost ? 'Gridiron Titans' : currentUser.name,
            authorAvatar: isOfficialPost ? (storageService.getTeamSettings().logoUrl) : currentUser.avatarUrl,
            authorRole: isOfficialPost ? 'MASTER' : currentUser.role,
            isOfficialTeamPost: isOfficialPost,
            content: content,
            mediaType: mediaUrl ? 'IMAGE' : undefined,
            mediaUrl: mediaUrl || undefined,
            likes: 0,
            comments: [],
            timestamp: new Date()
        };

        storageService.saveSocialFeedPost(newPost);
        setFeed(storageService.getSocialFeed()); 
        
        if (isOfficialPost) {
            storageService.addTeamXP(50);
        }

        setContent('');
        setMediaUrl('');
        setShowMediaInput(false);
        setIsOfficialPost(false);
    };

    const handleLike = (postId: string) => {
        storageService.toggleLikePost(postId);
        setFeed(storageService.getSocialFeed());
    };

    const canPostOfficial = currentRole === 'MASTER' || currentRole === 'MARKETING_MANAGER' || currentRole === 'HEAD_COACH';

    return (
        <div className="max-w-2xl mx-auto space-y-6 pb-20 animate-fade-in">
            <div className="text-center py-4">
                <h2 className="text-2xl font-bold text-white flex items-center justify-center gap-2">
                    <span className="text-3xl">🏟️</span> Vestiário Digital
                </h2>
                <p className="text-text-secondary text-sm">Onde o time se conecta e celebra.</p>
            </div>

            <div className={`bg-secondary rounded-xl p-4 border ${isOfficialPost ? 'border-yellow-500/50 shadow-[0_0_15px_rgba(234,179,8,0.2)]' : 'border-white/10'} transition-all duration-300`}>
                <div className="flex gap-3">
                    <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                        <LazyImage src={isOfficialPost ? storageService.getTeamSettings().logoUrl : (currentUser?.avatarUrl || '')} className="w-full h-full object-cover" />
                    </div>
                    <form onSubmit={handlePost} className="flex-1">
                        <textarea 
                            className="w-full bg-transparent text-white placeholder-gray-500 focus:outline-none resize-none min-h-[80px]"
                            placeholder={isOfficialPost ? "Faça um comunicado oficial..." : "No que você está pensando? (+10 XP)"}
                            value={content}
                            onChange={e => setContent(e.target.value)}
                        />
                        
                        {showMediaInput && (
                            <input 
                                className="w-full bg-black/20 border border-white/10 rounded p-2 text-xs text-white mb-2"
                                placeholder="Cole a URL da imagem ou vídeo..."
                                value={mediaUrl}
                                onChange={e => setMediaUrl(e.target.value)}
                                autoFocus
                            />
                        )}

                        <div className="flex justify-between items-center pt-2 border-t border-white/5">
                            <div className="flex gap-2">
                                <button type="button" onClick={() => setShowMediaInput(!showMediaInput)} className="text-text-secondary hover:text-highlight p-1 rounded hover:bg-white/5">
                                    <ImageIcon className="w-5 h-5" />
                                </button>
                                <button type="button" className="text-text-secondary hover:text-highlight p-1 rounded hover:bg-white/5">
                                    <LinkIcon className="w-5 h-5" />
                                </button>
                            </div>
                            
                            <div className="flex items-center gap-3">
                                {canPostOfficial && (
                                    <label className="flex items-center gap-2 cursor-pointer select-none">
                                        <input 
                                            type="checkbox" 
                                            checked={isOfficialPost} 
                                            onChange={e => setIsOfficialPost(e.target.checked)}
                                            className="w-4 h-4 accent-yellow-500 rounded bg-white/10 border-white/20"
                                        />
                                        <span className={`text-xs font-bold ${isOfficialPost ? 'text-yellow-400' : 'text-text-secondary'}`}>Modo Oficial</span>
                                    </label>
                                )}
                                <button 
                                    type="submit" 
                                    disabled={!content.trim()}
                                    className={`px-4 py-1.5 rounded-lg text-sm font-bold text-white transition-all disabled:opacity-50 disabled:cursor-not-allowed ${isOfficialPost ? 'bg-gradient-to-r from-yellow-600 to-orange-600 shadow-lg' : 'bg-highlight hover:bg-highlight-hover'}`}
                                >
                                    {isOfficialPost ? 'Publicar Oficial' : 'Postar'}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            <div className="space-y-4">
                {feed.map(post => (
                    <div key={post.id} className={`bg-secondary rounded-xl p-4 border ${post.isOfficialTeamPost ? 'border-yellow-500/30 bg-gradient-to-br from-secondary to-yellow-900/10' : 'border-white/5'} transition-all hover:border-white/20`}>
                        <div className="flex justify-between items-start mb-3">
                            <div className="flex items-center gap-3">
                                <div className="relative">
                                    <LazyImage src={post.authorAvatar} className={`w-10 h-10 rounded-full object-cover ${post.isOfficialTeamPost ? 'border-2 border-yellow-500' : ''}`} />
                                    {post.isOfficialTeamPost && (
                                        <div className="absolute -bottom-1 -right-1 bg-yellow-500 text-black rounded-full p-0.5" title="Oficial">
                                            <CheckCircleIcon className="w-3 h-3" />
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <h4 className={`font-bold text-sm flex items-center gap-1 ${post.isOfficialTeamPost ? 'text-yellow-400' : 'text-white'}`}>
                                        {post.authorName}
                                        {post.isOfficialTeamPost && <span className="text-[10px] border border-yellow-500/50 px-1 rounded text-yellow-500 uppercase">Oficial</span>}
                                    </h4>
                                    <span className="text-xs text-text-secondary">{new Date(post.timestamp).toLocaleString()}</span>
                                </div>
                            </div>
                            <button className="text-text-secondary hover:text-white">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" /></svg>
                            </button>
                        </div>

                        <p className="text-white text-sm whitespace-pre-wrap mb-3 leading-relaxed">
                            {post.content}
                        </p>

                        {post.mediaUrl && (
                            <div className="rounded-lg overflow-hidden mb-3 border border-white/5">
                                <LazyImage src={post.mediaUrl} alt="Post media" className="w-full h-auto object-cover max-h-96" />
                            </div>
                        )}

                        <div className="flex items-center gap-6 pt-3 border-t border-white/5">
                            <button 
                                onClick={() => handleLike(post.id)}
                                className="flex items-center gap-2 text-text-secondary hover:text-red-400 transition-colors group"
                            >
                                <HeartIcon className="w-5 h-5 group-hover:fill-current" />
                                <span className="text-xs font-bold">{post.likes}</span>
                            </button>
                            <button className="flex items-center gap-2 text-text-secondary hover:text-highlight transition-colors">
                                <MessageIcon className="w-5 h-5" />
                                <span className="text-xs font-bold">{post.comments.length}</span>
                            </button>
                            <button className="flex items-center gap-2 text-text-secondary hover:text-green-400 transition-colors ml-auto">
                                <ShareIcon className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LockerRoom;