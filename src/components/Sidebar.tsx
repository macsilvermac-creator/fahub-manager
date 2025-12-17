
import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../components/Layout';
import { storageService } from '../services/storageService';
import { SocialFeedPost, User } from '../types';
import { authService } from '../services/authService';
import { HeartIcon, MessageIcon, ShareIcon, ImageIcon, LinkIcon, SparklesIcon, CheckCircleIcon, FireIcon } from '../components/icons/UiIcons';
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
            authorName: isOfficialPost ? 'DIRETORIA' : currentUser.name,
            authorAvatar: isOfficialPost ? storageService.getTeamSettings().logoUrl : currentUser.avatarUrl,
            authorRole: currentUser.role,
            isOfficialTeamPost: isOfficialPost,
            isPinned: isOfficialPost, // Master post is auto-pinned for 24h
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

    return (
        <div className="max-w-2xl mx-auto space-y-6 pb-20 animate-fade-in">
            <div className="text-center py-4">
                <h2 className="text-2xl font-bold text-white flex items-center justify-center gap-2 italic">🏟️ VESTIÁRIO DIGITAL</h2>
                <p className="text-text-secondary text-sm">Onde o hype acontece.</p>
            </div>

            {/* Pinned Section */}
            {pinnedPost && (
                <div className="bg-highlight/10 border-2 border-highlight/30 rounded-2xl p-4 flex gap-4 items-center">
                    <div className="p-3 bg-highlight/20 rounded-full animate-bounce">
                        <FireIcon className="w-6 h-6 text-highlight" />
                    </div>
                    <div>
                        <span className="text-[10px] font-black text-highlight uppercase tracking-widest">Fixado pelo Coach</span>
                        <p className="text-white text-sm font-bold">"{pinnedPost.content}"</p>
                    </div>
                </div>
            )}

            <div className={`bg-secondary rounded-xl p-4 border ${isOfficialPost ? 'border-highlight shadow-glow' : 'border-white/10'}`}>
                <div className="flex gap-3">
                    <LazyImage src={currentUser?.avatarUrl || ''} className="w-10 h-10 rounded-full object-cover" />
                    <form onSubmit={handlePost} className="flex-1">
                        <textarea 
                            className="w-full bg-transparent text-white placeholder-gray-500 focus:outline-none resize-none min-h-[80px]"
                            placeholder="Mande o hype... (+10 XP)"
                            value={content}
                            onChange={e => setContent(e.target.value)}
                        />
                        <div className="flex justify-between items-center pt-2 border-t border-white/5">
                            <div className="flex gap-2 text-text-secondary">
                                <FireIcon className="w-5 h-5 cursor-pointer hover:text-orange-500" />
                                <TrophyIcon className="w-5 h-5 cursor-pointer hover:text-yellow-500" />
                            </div>
                            <div className="flex items-center gap-3">
                                {['MASTER', 'HEAD_COACH'].includes(currentRole) && (
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input type="checkbox" checked={isOfficialPost} onChange={e => setIsOfficialPost(e.target.checked)} className="accent-highlight" />
                                        <span className="text-[10px] font-black text-white uppercase">Oficial</span>
                                    </label>
                                )}
                                <button type="submit" disabled={!content.trim()} className="bg-highlight text-white px-6 py-1.5 rounded-lg text-xs font-bold uppercase">Postar</button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>

            <div className="space-y-4">
                {feed.filter(p => !p.isPinned || p === pinnedPost).map(post => (
                    <div key={post.id} className="bg-secondary rounded-xl p-4 border border-white/5">
                        <div className="flex items-center gap-3 mb-3">
                            <img src={post.authorAvatar} className="w-10 h-10 rounded-full" />
                            <div>
                                <h4 className="font-bold text-white text-sm">{post.authorName}</h4>
                                <span className="text-[10px] text-text-secondary">{new Date(post.timestamp).toLocaleString()}</span>
                            </div>
                        </div>
                        <p className="text-white text-sm leading-relaxed mb-4">{post.content}</p>
                        <div className="flex gap-6 border-t border-white/5 pt-3">
                            <button className="flex items-center gap-2 text-text-secondary hover:text-orange-500 transition-colors">
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