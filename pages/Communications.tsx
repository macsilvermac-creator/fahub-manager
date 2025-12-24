
import React, { useState, useEffect, useContext } from 'react';
import { UserRole, Announcement, ChatMessage } from '../types';
import Card from '../components/Card';
import { storageService } from '../services/storageService';
import { BellIcon, UsersIcon, TrashIcon } from '../components/icons/UiIcons';
import { UserContext } from '../components/Layout';

const Communications: React.FC = () => {
    const { currentRole } = useContext(UserContext);
    const [announcements, setAnnouncements] = useState<Announcement[]>([]);
    const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
    const [newMessage, setNewMessage] = useState('');
    const [activeChannel, setActiveChannel] = useState<'GENERAL' | 'OFFENSE' | 'DEFENSE'>('GENERAL');
    const [newAnnouncement, setNewAnnouncement] = useState({ title: '', content: '', priority: 'NORMAL' as 'NORMAL' | 'HIGH' | 'URGENT' });
    const [isPostingAnnouncement, setIsPostingAnnouncement] = useState(false);

    const isCoach = currentRole !== 'PLAYER';

    useEffect(() => {
        setAnnouncements(storageService.getAnnouncements());
        setChatMessages(storageService.getChatMessages());
    }, []);

    const handlePostAnnouncement = (e: React.FormEvent) => {
        e.preventDefault();
        const post: Announcement = {
            id: Date.now().toString(),
            title: newAnnouncement.title,
            content: newAnnouncement.content,
            priority: newAnnouncement.priority,
            date: new Date(),
            authorRole: currentRole,
            readBy: []
        };
        const updated = [post, ...announcements];
        setAnnouncements(updated);
        storageService.saveAnnouncements(updated);
        setNewAnnouncement({ title: '', content: '', priority: 'NORMAL' });
        setIsPostingAnnouncement(false);
    };

    const handleDeleteAnnouncement = (id: string) => {
        const updated = announcements.filter(a => a.id !== id);
        setAnnouncements(updated);
        storageService.saveAnnouncements(updated);
    };

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if(!newMessage.trim()) return;

        const msg: ChatMessage = {
            id: Date.now().toString(),
            senderName: isCoach ? 'Coach' : 'Atleta',
            senderRole: currentRole,
            content: newMessage,
            timestamp: new Date(),
            channel: activeChannel
        };
        const updated = [...chatMessages, msg];
        setChatMessages(updated);
        storageService.saveChatMessages(updated);
        setNewMessage('');
    };

    const filteredMessages = chatMessages.filter(m => !m.channel || m.channel === activeChannel);

    return (
        <div className="h-[calc(100vh-8rem)] flex flex-col md:flex-row gap-6 animate-fade-in">
            {/* Left: Announcements */}
            <div className="w-full md:w-1/3 flex flex-col gap-4">
                <div className="flex justify-between items-center">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <BellIcon className="text-highlight" /> Mural
                    </h2>
                    {isCoach && <button onClick={() => setIsPostingAnnouncement(!isPostingAnnouncement)} className="text-xs bg-highlight text-white px-3 py-1 rounded">Novo Aviso</button>}
                </div>

                {isPostingAnnouncement && (
                    <Card>
                        <form onSubmit={handlePostAnnouncement} className="space-y-3">
                            <input className="w-full bg-primary/50 border border-white/10 rounded p-2 text-sm text-white" placeholder="Título" value={newAnnouncement.title} onChange={e => setNewAnnouncement({...newAnnouncement, title: e.target.value})} required />
                            <textarea className="w-full bg-primary/50 border border-white/10 rounded p-2 text-sm h-20 text-white" placeholder="Mensagem..." value={newAnnouncement.content} onChange={e => setNewAnnouncement({...newAnnouncement, content: e.target.value})} required />
                            <div className="flex justify-between">
                                <select className="bg-primary/50 border border-white/10 rounded p-1 text-xs text-white" value={newAnnouncement.priority} onChange={(e: any) => setNewAnnouncement({...newAnnouncement, priority: e.target.value})}>
                                    <option value="NORMAL">Normal</option>
                                    <option value="HIGH">Alta</option>
                                    <option value="URGENT">Urgente</option>
                                </select>
                                <button type="submit" className="bg-white/10 hover:bg-white/20 px-3 py-1 rounded text-xs text-white">Postar</button>
                            </div>
                        </form>
                    </Card>
                )}

                <div className="flex-1 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                    {announcements.map(announcement => (
                        <div key={announcement.id} className={`relative p-4 rounded-xl border-l-4 ${announcement.priority === 'URGENT' ? 'bg-red-900/20 border-l-red-500' : 'bg-secondary border-l-highlight'}`}>
                            {isCoach && <button onClick={() => handleDeleteAnnouncement(announcement.id)} className="absolute top-2 right-2 text-text-secondary hover:text-red-400"><TrashIcon className="h-4 w-4" /></button>}
                            <h3 className="font-bold text-white text-sm mb-1">{announcement.title}</h3>
                            <p className="text-text-secondary text-xs mb-2">{announcement.content}</p>
                            <div className="flex justify-between items-center text-[10px] text-text-secondary opacity-60">
                                <span>{new Date(announcement.date).toLocaleDateString()}</span>
                                {isCoach && <span>Lido por {announcement.readBy?.length || 0}</span>}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Right: Team Chat */}
            <div className="w-full md:w-2/3 flex flex-col h-full bg-secondary/30 rounded-2xl border border-white/5 overflow-hidden backdrop-blur-sm">
                 <div className="p-4 border-b border-white/5 bg-secondary/50 flex items-center justify-between">
                    <h2 className="font-bold flex items-center gap-2 text-white">
                        <UsersIcon className="text-green-400" /> Chat
                    </h2>
                    <div className="flex gap-2">
                        {['GENERAL', 'OFFENSE', 'DEFENSE'].map(ch => (
                            <button 
                                key={ch} 
                                onClick={() => setActiveChannel(ch as any)} 
                                className={`text-xs px-2 py-1 rounded font-bold ${activeChannel === ch ? 'bg-highlight text-white' : 'bg-white/10 text-text-secondary'}`}
                            >
                                {ch === 'GENERAL' ? 'Geral' : ch === 'OFFENSE' ? 'Ataque' : 'Defesa'}
                            </button>
                        ))}
                    </div>
                 </div>

                 <div className="flex-1 overflow-y-auto p-4 space-y-4 flex flex-col-reverse custom-scrollbar">
                    {[...filteredMessages].reverse().map(msg => {
                        const isMe = msg.senderRole === currentRole;
                        return (
                            <div key={msg.id} className={`flex flex-col max-w-[80%] ${isMe ? 'self-end items-end' : 'self-start items-start'}`}>
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-[10px] text-text-secondary font-bold">{msg.senderName}</span>
                                </div>
                                <div className={`px-4 py-2 rounded-2xl text-sm ${isMe ? 'bg-highlight text-white rounded-tr-none' : 'bg-tertiary text-text-primary rounded-tl-none'}`}>
                                    {msg.content}
                                </div>
                            </div>
                        );
                    })}
                 </div>

                 <form onSubmit={handleSendMessage} className="p-4 bg-black/20 border-t border-white/5 flex gap-3">
                    <input className="flex-1 bg-primary border border-tertiary rounded-full px-4 py-2 text-sm text-white focus:outline-none focus:border-highlight" placeholder={`Mensagem em #${activeChannel}...`} value={newMessage} onChange={e => setNewMessage(e.target.value)} />
                    <button type="submit" className="bg-highlight hover:bg-highlight-hover text-white p-2 rounded-full" disabled={!newMessage.trim()}>
                        <svg className="w-5 h-5 translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
                    </button>
                 </form>
            </div>
        </div>
    );
};
export default Communications;