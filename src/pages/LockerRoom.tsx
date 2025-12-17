
import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../components/Layout';
import { storageService } from '../services/storageService';
import { SocialFeedPost, User } from '../types';
import { authService } from '../services/authService';
import { HeartIcon, MessageIcon, FireIcon, CheckCircleIcon } from '../components/icons/UiIcons';
import LazyImage from '@/components/LazyImage';

const LockerRoom: React.FC = () => {
    const { currentRole } = useContext(UserContext);
    const [feed, setFeed] = useState<SocialFeedPost[]>([]);
    const [currentUser, setCurrentUser] = useState<User | null>(null);
    const [content, setContent] = useState('');
    const [isOfficialPost, setIsOfficialPost] = useState(false);

    useEffect(() => {
        setFeed(storageService.getSocialFeed());
        setCurrentUser(authService.getCurrentUser());
    }, []);

    const pinnedPost = feed.find(p => p.isPinned);

    const handlePost = (e: React.FormEvent) => {
        e.preventDefault();
        if (!currentUser || !content.trim()) return;

        const newPost: SocialFeedPost = {
            id: `post-${Date.now()}`,
            authorName: isOfficialPost ? 'COMISSÃO TÉCNICA' : currentUser.name,
            authorAvatar: isOfficialPost ? storageService.getTeamSettings().logoUrl : currentUser.avatarUrl,
            authorRole: currentUser.role,
            isOfficialTeamPost: isOfficialPost,
            isPinned: isOfficialPost, // Master/Coach post is auto-pinned
            content: content,
            likes: 0,
            comments: [],
            timestamp: new Date()
        };

        storageService.saveSocialFeedPost(newPost);
        setFeed(storageService.getSocialFeed()); 
        setContent('');
        setIsOfficialPost(false);
    };

    const handleReaction = (postId: string) => {
        storageService.toggleLikePost(postId);
        setFeed(storageService.getSocialFeed());
    };

    return (
        <div className="max-w-2xl mx-auto space-y-6 pb-20 animate-fade-in">
            <div className="text-center py-4">
                <h2 className="text-2xl font-black text-white italic uppercase flex items-center justify-center gap-2">
                    🏟️ Vestiário Digital
                </h2>
                <p className="text-text-secondary text-sm italic">Culture beats strategy.</p>
            </div>

            {/* Mensagem Fixada */}
            {pinnedPost && (
                <div className="bg-highlight/10 border-2 border-highlight/30 rounded-2xl p-4 flex gap-4 items-center shadow-glow">
                    <div className="p-3 bg-highlight/20 rounded-full animate-bounce">
                        <FireIcon className="w-6 h-6 text-highlight" />
                    </div>
                    <div>
                        <span className="text-[10px] font-black text-highlight uppercase tracking-widest">Fixado pelo Técnico</span>
                        <p className="text-white text-sm font-bold leading-tight mt-1">"{pinnedPost.content}"</p>
                    </div>
                </div>
            )}

            <div className={`bg-secondary rounded-xl p-4 border ${isOfficialPost ? 'border-highlight shadow-glow' : 'border-white/10'} transition-all`}>
                <div className="flex gap-3">
                    <LazyImage src={currentUser?.avatarUrl || ''} className="w-10 h-10 rounded-full object-cover" />
                    <form onSubmit={handlePost} className="flex-1">
                        <textarea 
                            className="w-full bg-transparent text-white placeholder-gray-500 focus:outline-none resize-none min-h-[80px]"
                            placeholder="Mande o hype pro time... (+10 XP)"
                            value={content}
                            onChange={e => setContent(e.target.value)}
                        />
                        <div className="flex justify-between items-center pt-2 border-t border-white/5">
                            <div className="flex gap-2">
                                <button type="button" className="text-text-secondary hover:text-orange-500 p-1"><FireIcon className="w-5 h-5" /></button>
                                <button type="button" className="text-text-secondary hover:text-yellow-500 p-1">🏈</button>
                            </div>
                            <div className="flex items-center gap-3">
                                {['MASTER', 'HEAD_COACH'].includes(currentRole) && (
                                    <label className="flex items-center gap-2 cursor-pointer select-none">
                                        <input type="checkbox" checked={isOfficialPost} onChange={e => setIsOfficialPost(e.target.checked)} className="accent-highlight w-4 h-4" />
                                        <span className="text-[10px] font-black text-white uppercase">Comunicado Oficial</span>
                                    </label>
                                )}
                                <button type="submit" disabled={!content.trim()} className="bg-highlight text-white px-6 py-1.5 rounded-lg text-xs font-bold uppercase shadow-lg">Postar</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            <div className="space-y-4">
                {feed.filter(p => !p.isPinned || p === pinnedPost).map(post => (
                    <div key={post.id} className="bg-secondary rounded-xl p-4 border border-white/5 hover:border-white/20 transition-all">
                        <div className="flex items-center gap-3 mb-3">
                            <img src={post.authorAvatar} className="w-10 h-10 rounded-full border border-white/10" />
                            <div>
                                <h4 className="font-bold text-white text-sm flex items-center gap-1">
                                    {post.authorName}
                                    {post.isOfficialTeamPost && <CheckCircleIcon className="w-3 h-3 text-highlight" />}
                                </h4>
                                <span className="text-[10px] text-text-secondary">{new Date(post.timestamp).toLocaleString()}</span>
                            </div>
                        </div>
                        <p className="text-white text-sm leading-relaxed mb-4 whitespace-pre-wrap">{post.content}</p>
                        <div className="flex gap-6 border-t border-white/5 pt-3">
                            <button onClick={() => handleReaction(post.id)} className="flex items-center gap-2 text-text-secondary hover:text-orange-500 transition-colors">
                                <FireIcon className="w-5 h-5" />
                                <span className="text-xs font-bold">{post.likes}</span>
                            </button>
                            <button className="flex items-center gap-2 text-text-secondary hover:text-highlight transition-colors">
                                <MessageIcon className="w-5 h-5" />
                                <span className="text-xs font-bold">{post.comments.length}</span>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LockerRoom;