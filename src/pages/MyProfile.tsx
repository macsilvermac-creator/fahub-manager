
import React, { useState, useEffect, useContext } from 'react';
import Card from '../components/Card';
import { Player, Transaction, CoachCareer } from '../types';
import { storageService } from '../services/storageService';
import { authService } from '../services/authService';
import { UserContext } from '../components/Layout';
import { 
    UsersIcon, WalletIcon, StarIcon, ShareIcon, 
    PrinterIcon, LockIcon, CheckCircleIcon, LinkIcon, ShieldCheckIcon, AlertTriangleIcon, PlayCircleIcon, ActivityIcon 
} from '../components/icons/UiIcons';
import { TrophyIcon, ShopIcon, VideoIcon, BriefcaseIcon } from '../components/icons/NavIcons';
import Modal from '../components/Modal';
import LazyImage from '@/components/LazyImage';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const MyProfile: React.FC = () => {
    const { currentRole } = useContext(UserContext);
    const [player, setPlayer] = useState<Player | null>(null);
    const [activeTab, setActiveTab] = useState<'PROFILE' | 'ANALYSIS' | 'CAREER' | 'TROPHIES'>('PROFILE');
    
    const [isEditing, setIsEditing] = useState(false);
    const [showCardModal, setShowCardModal] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const user = authService.getCurrentUser();
        const allPlayers = storageService.getPlayers();
        const myPlayer = allPlayers.find(p => p.name === user?.name) || allPlayers[0];
        if (myPlayer) setPlayer(myPlayer);
        setLoading(false);
    }, []);

    const performanceHistory = [
        { name: 'Jan', rating: 72 },
        { name: 'Fev', rating: 75 },
        { name: 'Mar', rating: 74 },
        { name: 'Abr', rating: 78 },
        { name: 'Mai', rating: 82 },
    ];

    if (loading) return <div className="p-8 text-center text-text-secondary">Carregando...</div>;
    if (!player) return <div className="p-8 text-center text-text-secondary">Perfil não encontrado.</div>;

    return (
        <div className="space-y-6 pb-12 animate-fade-in">
            {/* Banner Superior com Avatar e Badge de Verificação */}
            <div className="bg-gradient-to-r from-slate-900 to-primary p-6 rounded-2xl border border-white/10 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
                <div className="relative group">
                    <div className="w-32 h-32 rounded-full p-1 bg-gradient-to-br from-yellow-400 to-highlight">
                        <LazyImage src={player.avatarUrl} className="w-full h-full rounded-full object-cover border-4 border-primary" />
                    </div>
                    {player.verificationStatus === 'VERIFIED' && (
                        <div className="absolute bottom-0 right-0 bg-blue-500 text-white p-1.5 rounded-full border-4 border-primary shadow-lg">
                            <CheckCircleIcon className="w-5 h-5" />
                        </div>
                    )}
                </div>

                <div className="flex-1 text-center md:text-left z-10">
                    <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                        <h1 className="text-3xl font-black text-white">{player.name}</h1>
                        <span className="text-sm bg-highlight text-white px-2 py-0.5 rounded font-bold uppercase">{player.position}</span>
                    </div>
                    <p className="text-text-secondary mb-4">#{player.jerseyNumber} • {player.class} • FAHUB Stars</p>
                    
                    <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                        <button onClick={() => setShowCardModal(true)} className="bg-yellow-600 hover:bg-yellow-500 text-white px-6 py-2 rounded-lg font-bold shadow-lg flex items-center gap-2 transition-all">
                            <StarIcon className="w-5 h-5" /> Card Oficial
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex border-b border-white/10 overflow-x-auto">
                <button onClick={() => setActiveTab('PROFILE')} className={`px-6 py-3 font-bold text-sm border-b-2 transition-colors whitespace-nowrap ${activeTab === 'PROFILE' ? 'border-highlight text-highlight' : 'border-transparent text-text-secondary'}`}>Dados</button>
                <button onClick={() => setActiveTab('ANALYSIS')} className={`px-6 py-3 font-bold text-sm border-b-2 transition-colors whitespace-nowrap ${activeTab === 'ANALYSIS' ? 'border-highlight text-highlight' : 'border-transparent text-text-secondary'}`}>Evolução (Lab)</button>
                <button onClick={() => setActiveTab('CAREER')} className={`px-6 py-3 font-bold text-sm border-b-2 transition-colors whitespace-nowrap ${activeTab === 'CAREER' ? 'border-highlight text-highlight' : 'border-transparent text-text-secondary'}`}>Carreira</button>
                <button onClick={() => setActiveTab('TROPHIES')} className={`px-6 py-3 font-bold text-sm border-b-2 transition-colors whitespace-nowrap ${activeTab === 'TROPHIES' ? 'border-highlight text-highlight' : 'border-transparent text-text-secondary'}`}>Troféus</button>
            </div>

            {activeTab === 'ANALYSIS' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-slide-in">
                    <div className="lg:col-span-2">
                        <Card title="Progresso de Atributos (Season Trend)">
                            <div className="h-72 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <LineChart data={performanceHistory}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                                        <XAxis dataKey="name" stroke="#94a3b8" />
                                        <YAxis domain={[0, 100]} stroke="#94a3b8" />
                                        <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none' }} />
                                        <Line type="monotone" dataKey="rating" stroke="#059669" strokeWidth={3} dot={{ fill: '#059669', r: 5 }} activeDot={{ r: 8 }} />
                                    </LineChart>
                                </ResponsiveContainer>
                            </div>
                        </Card>
                    </div>
                    <div className="space-y-6">
                        <Card title="Histórico de Combine">
                            <div className="space-y-4">
                                <div className="flex justify-between items-center p-3 bg-black/20 rounded-xl border border-white/5">
                                    <span className="text-xs text-text-secondary uppercase">40 Yard Dash</span>
                                    <span className="text-white font-black">{player.combineStats?.fortyYards || '--'}s</span>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-black/20 rounded-xl border border-white/5">
                                    <span className="text-xs text-text-secondary uppercase">Supino (225lbs)</span>
                                    <span className="text-white font-black">{player.combineStats?.benchPress || '--'} reps</span>
                                </div>
                                <div className="flex justify-between items-center p-3 bg-black/20 rounded-xl border border-white/5">
                                    <span className="text-xs text-text-secondary uppercase">Vertical Jump</span>
                                    <span className="text-white font-black">{player.combineStats?.verticalJump || '--'} in</span>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            )}

            {/* Outras abas (PROFILE, CAREER, TROPHIES) permanecem como estão... */}
        </div>
    );
};

export default MyProfile;
