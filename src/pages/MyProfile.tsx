
import React, { useState, useEffect, useContext } from 'react';
import Card from '../components/Card';
import { Player, Transaction, CoachCareer } from '../types';
import { storageService } from '../services/storageService';
import { authService } from '../services/authService';
import { UserContext } from '../components/Layout';
import { 
    UsersIcon, WalletIcon, StarIcon, ShareIcon, 
    PrinterIcon, LockIcon, CheckCircleIcon, LinkIcon, ShieldCheckIcon, AlertTriangleIcon, PlayCircleIcon 
} from '../components/icons/UiIcons';
import { TicketIcon, TrophyIcon, ShopIcon, VideoIcon, BriefcaseIcon } from '../components/icons/NavIcons';
import Modal from '../components/Modal';
import LazyImage from '../components/LazyImage';

const MyProfile: React.FC = () => {
    const { currentRole } = useContext(UserContext);
    const [player, setPlayer] = useState<Player | null>(null);
    const [coachProfile, setCoachProfile] = useState<CoachCareer | null>(null);
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [activeTab, setActiveTab] = useState<'PROFILE' | 'CAREER' | 'HIGHLIGHTS' | 'TROPHIES'>('PROFILE');
    
    // Edit State
    const [isEditing, setIsEditing] = useState(false);
    const [showCardModal, setShowCardModal] = useState(false);
    const [loading, setLoading] = useState(true);
    
    // KYC State
    const [isKycModalOpen, setIsKycModalOpen] = useState(false);
    const [kycStep, setKycStep] = useState(1);

    // Form State
    const [formData, setFormData] = useState({
        weight: 0,
        height: '',
        instagram: '',
        bio: '',
        philosophy: '', // For Coaches
        specialties: '' // For Coaches
    });

    const isCoach = currentRole === 'HEAD_COACH' || currentRole === 'MASTER';

    useEffect(() => {
        const user = authService.getCurrentUser();
        
        if (isCoach) {
            // Load Coach Profile
            const profile = storageService.getCoachProfile(user?.id || '');
            setCoachProfile(profile);
            setFormData({
                weight: 0,
                height: '',
                instagram: '@coach.star',
                bio: 'Técnico FAHUB',
                philosophy: profile?.philosophy || '',
                specialties: profile?.specialties?.join(', ') || ''
            });
        } else {
            // Load Athlete Profile
            const allPlayers = storageService.getPlayers();
            const myPlayer = allPlayers.find(p => p.name === user?.name) || allPlayers[0];
            
            if (myPlayer) {
                setPlayer(myPlayer);
                setFormData({
                    weight: myPlayer.weight,
                    height: myPlayer.height,
                    instagram: '@' + myPlayer.name.replace(' ', '').toLowerCase(),
                    bio: 'Atleta focado em performance e evolução constante.',
                    philosophy: '',
                    specialties: ''
                });
            }
        }

        // Get Real Wallet Balance from Transactions
        const myTxs = storageService.getTransactions().filter(t => t.type === 'INCOME'); // Simplify for wallet logic
        if(myTxs.length > 0) {
             setTransactions(myTxs);
        } else {
             // Fallback mock if empty
             setTransactions([
                { id: 't1', title: 'Venda de Capacete', amount: 450.00, type: 'INCOME', date: new Date('2023-10-01'), category: 'STORE', status: 'PAID' },
                { id: 't2', title: 'Comissão Afiliado (Curso)', amount: 45.90, type: 'INCOME', date: new Date('2023-10-05'), category: 'OTHER', status: 'PAID' }
            ]);
        }
        setLoading(false);
    }, [isCoach]);

    const handleSaveProfile = () => {
        const user = authService.getCurrentUser();
        if (isCoach && user) {
            if (coachProfile) {
                const updatedProfile: CoachCareer = {
                    ...coachProfile,
                    philosophy: formData.philosophy,
                    specialties: formData.specialties.split(',').map(s => s.trim())
                };
                storageService.saveCoachProfile(user.id, updatedProfile);
                setCoachProfile(updatedProfile);
                alert("Currículo do Treinador atualizado!");
            }
            setIsEditing(false);
            return;
        }
        if (!player) return;
        const updatedPlayer = { ...player, weight: formData.weight, height: formData.height };
        setPlayer(updatedPlayer);
        // Persist
        storageService.savePlayers(storageService.getPlayers().map(p => p.id === player.id ? updatedPlayer : p));
        setIsEditing(false);
        alert("Perfil atualizado com sucesso!");
    };

    const handleStartKYC = () => {
        setIsKycModalOpen(true);
        setKycStep(1);
    };

    const handleUploadDoc = () => {
        // Simulate upload delay
        setTimeout(() => {
            setKycStep(2);
            // Auto approve after delay for demo
            setTimeout(() => {
                if(player) {
                    const updated = { ...player, verificationStatus: 'VERIFIED' as const };
                    setPlayer(updated);
                    // Update global storage
                    storageService.savePlayers(storageService.getPlayers().map(p => p.id === player.id ? updated : p));
                }
                setKycStep(3);
            }, 2000);
        }, 1500);
    };

    const getCardStats = (p: Player) => {
        const forty = p.combineStats?.fortyYards || 5.0;
        const bench = p.combineStats?.benchPress || 10;
        const spd = Math.max(50, Math.min(99, Math.round(99 - ((forty - 4.2) * 30))));
        const str = Math.max(40, Math.min(99, Math.round(40 + (bench * 1.5))));
        
        return {
            SPD: spd, STR: str, AGI: Math.round(spd * 0.9), ACC: Math.round(spd * 0.95), AWR: Math.round(p.xp / 50) + 60, OVR: p.rating
        };
    };

    if (loading) return <div className="p-8 text-center text-text-secondary">Carregando perfil...</div>;
    if (!player && !isCoach) return <div className="p-8 text-center text-text-secondary">Perfil não encontrado.</div>;

    const stats = player ? getCardStats(player) : null;

    return (
        <div className="space-y-6 pb-12 animate-fade-in">
            {/* ... (Previous Styles) ... */}
            <style>{`
                @media print {
                    body * { visibility: hidden; }
                    #official-card-area, #official-card-area * { visibility: visible; }
                    #official-card-area {
                        position: absolute; left: 50%; top: 50%; transform: translate(-50%, -50%) scale(1.5);
                        width: 300px; height: 420px; border-radius: 15px; overflow: hidden; -webkit-print-color-adjust: exact;
                    }
                    .bg-gradient-to-br { background-image: linear-gradient(to bottom right, #facc15, #854d0e) !important; }
                }
            `}</style>

            {/* Header Profile */}
            <div className="bg-gradient-to-r from-secondary to-primary p-6 rounded-2xl border border-white/10 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-highlight/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>
                
                <div className="relative group">
                    <div className="w-32 h-32 rounded-full p-1 bg-gradient-to-br from-yellow-400 to-highlight">
                        <LazyImage src={isCoach ? (storageService.getTeamSettings().logoUrl) : (player?.avatarUrl || '')} className="w-full h-full rounded-full object-cover border-4 border-primary" />
                    </div>
                    {player?.verificationStatus === 'VERIFIED' && (
                        <div className="absolute bottom-0 right-0 bg-blue-500 text-white p-1.5 rounded-full border-4 border-primary shadow-lg" title="Identidade Verificada">
                            <CheckCircleIcon className="w-5 h-5" />
                        </div>
                    )}
                </div>

                <div className="flex-1 text-center md:text-left z-10">
                    <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                        <h1 className="text-3xl font-black text-white">{isCoach ? 'Head Coach' : player?.name}</h1>
                        <span className="text-sm bg-highlight text-white px-2 py-0.5 rounded font-bold uppercase">{isCoach ? 'Staff' : player?.position}</span>
                    </div>
                    <p className="text-text-secondary mb-4 flex items-center justify-center md:justify-start gap-2">
                        {formData.instagram} • {isCoach ? 'Head Coach' : player?.class} • FAHUB Stars
                    </p>
                    
                    <div className="flex flex-wrap gap-3 justify-center md:justify-start">
                        {!isCoach && (
                            <button onClick={() => setShowCardModal(true)} className="bg-gradient-to-r from-yellow-600 to-yellow-500 hover:from-yellow-500 hover:to-yellow-400 text-white px-6 py-2 rounded-lg font-bold shadow-lg shadow-yellow-500/20 flex items-center gap-2 transition-all transform hover:scale-105">
                                <StarIcon className="w-5 h-5" /> Card Oficial
                            </button>
                        )}
                        <button onClick={() => setIsEditing(!isEditing)} className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-lg font-bold transition-all">
                            {isEditing ? 'Cancelar' : 'Editar Perfil'}
                        </button>
                    </div>
                </div>

                {/* Status & Verification */}
                <div className="flex flex-col gap-2 items-center md:items-end">
                    {isCoach ? (
                        <div className="bg-black/30 p-4 rounded-xl border border-white/10 text-center min-w-[150px]">
                            <p className="text-xs text-text-secondary uppercase font-bold mb-1">Recorde Carreira</p>
                            <p className="text-lg font-bold text-white">
                                {coachProfile?.careerRecord?.wins || 0}-{coachProfile?.careerRecord?.losses || 0}-{coachProfile?.careerRecord?.ties || 0}
                            </p>
                        </div>
                    ) : (
                        <div className="bg-black/30 p-4 rounded-xl border border-white/10 text-center min-w-[150px]">
                            <p className="text-xs text-text-secondary uppercase font-bold mb-1">Status Mercado</p>
                            <p className={`text-lg font-bold ${player?.status === 'ACTIVE' ? 'text-green-400' : 'text-red-400'}`}>
                                {player?.status === 'ACTIVE' ? 'SOB CONTRATO' : 'DISPONÍVEL'}
                            </p>
                        </div>
                    )}
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-white/10 overflow-x-auto">
                <button onClick={() => setActiveTab('PROFILE')} className={`px-6 py-3 font-bold text-sm border-b-2 transition-colors whitespace-nowrap ${activeTab === 'PROFILE' ? 'border-highlight text-highlight' : 'border-transparent text-text-secondary hover:text-white'}`}>
                    Dados & Carteira
                </button>
                {isCoach ? (
                    <button onClick={() => setActiveTab('CAREER')} className={`px-6 py-3 font-bold text-sm border-b-2 transition-colors whitespace-nowrap ${activeTab === 'CAREER' ? 'border-blue-500 text-blue-400' : 'border-transparent text-text-secondary hover:text-white'}`}>
                        Currículo Técnico
                    </button>
                ) : (
                    <>
                        <button onClick={() => setActiveTab('CAREER')} className={`px-6 py-3 font-bold text-sm border-b-2 transition-colors whitespace-nowrap ${activeTab === 'CAREER' ? 'border-blue-500 text-blue-400' : 'border-transparent text-text-secondary hover:text-white'}`}>
                            Carreira & Stats
                        </button>
                        <button onClick={() => setActiveTab('HIGHLIGHTS')} className={`px-6 py-3 font-bold text-sm border-b-2 transition-colors whitespace-nowrap ${activeTab === 'HIGHLIGHTS' ? 'border-red-500 text-red-400' : 'border-transparent text-text-secondary hover:text-white'}`}>
                            Highlights (Vídeo)
                        </button>
                    </>
                )}
                <button onClick={() => setActiveTab('TROPHIES')} className={`px-6 py-3 font-bold text-sm border-b-2 transition-colors whitespace-nowrap ${activeTab === 'TROPHIES' ? 'border-yellow-500 text-yellow-400' : 'border-transparent text-text-secondary hover:text-white'}`}>
                    Sala de Troféus
                </button>
            </div>

            {/* === TAB: PROFILE (Wallet & KYC) === */}
            {activeTab === 'PROFILE' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
                    <div className="lg:col-span-2 space-y-6">
                        <Card title="Dados Pessoais & Físicos">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="text-xs font-bold text-text-secondary uppercase block mb-1">Nome Civil (Imutável)</label>
                                    <div className="flex items-center gap-2 bg-black/20 p-3 rounded border border-white/5 text-gray-400 cursor-not-allowed">
                                        <LockIcon className="w-4 h-4" /> {isCoach ? authService.getCurrentUser()?.name : player?.name}
                                    </div>
                                </div>
                                {!isCoach && (
                                    <>
                                        <div>
                                            <label className="text-xs font-bold text-text-secondary uppercase block mb-1">Altura</label>
                                            <input disabled={!isEditing} value={formData.height} onChange={e => setFormData({...formData, height: e.target.value})} className={`w-full p-3 rounded border ${isEditing ? 'bg-black/40 border-highlight text-white' : 'bg-black/20 border-white/5 text-gray-300'}`} />
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-text-secondary uppercase block mb-1">Peso (kg/lbs)</label>
                                            <input type="number" disabled={!isEditing} value={formData.weight} onChange={e => setFormData({...formData, weight: Number(e.target.value)})} className={`w-full p-3 rounded border ${isEditing ? 'bg-black/40 border-highlight text-white' : 'bg-black/20 border-white/5 text-gray-300'}`} />
                                        </div>
                                    </>
                                )}
                                <div className="md:col-span-2">
                                    <label className="text-xs font-bold text-text-secondary uppercase block mb-1">Bio / Apresentação</label>
                                    <textarea disabled={!isEditing} value={formData.bio} onChange={e => setFormData({...formData, bio: e.target.value})} className={`w-full p-3 rounded border h-24 resize-none ${isEditing ? 'bg-black/40 border-highlight text-white' : 'bg-black/20 border-white/5 text-gray-300'}`} />
                                </div>
                            </div>
                            {isEditing && <div className="mt-4 flex justify-end"><button onClick={handleSaveProfile} className="bg-green-600 hover:bg-green-500 text-white px-6 py-2 rounded-lg font-bold">Salvar Alterações</button></div>}
                        </Card>
                    </div>

                    <div className="space-y-6">
                        <Card title="Minha Carteira">
                            <div className="bg-gradient-to-r from-green-900/40 to-emerald-900/40 p-4 rounded-xl border border-green-500/30 mb-4">
                                <div className="flex items-center gap-3 mb-2"><WalletIcon className="w-6 h-6 text-green-400" /><span className="text-sm font-bold text-green-200">Saldo Disponível</span></div>
                                <p className="text-3xl font-bold text-white">R$ 375,90</p>
                                <button className="mt-3 w-full bg-green-600 hover:bg-green-500 text-white py-2 rounded text-sm font-bold shadow">Solicitar Saque (Pix)</button>
                            </div>
                            <h4 className="text-xs font-bold text-text-secondary uppercase mb-3">Extrato Recente</h4>
                            <div className="space-y-3">{transactions.map(tx => (<div key={tx.id} className="flex justify-between items-center p-2 rounded hover:bg-white/5 border-b border-white/5"><div><p className="text-sm font-bold text-white">{tx.title}</p><p className="text-[10px] text-text-secondary">{tx.date.toLocaleDateString()}</p></div><span className={`text-sm font-mono font-bold ${tx.type === 'INCOME' ? 'text-green-400' : 'text-red-400'}`}>{tx.type === 'INCOME' ? '+' : '-'} R$ {tx.amount.toFixed(2)}</span></div>))}</div>
                        </Card>
                    </div>
                </div>
            )}

            {/* === TAB: CAREER (Coach vs Athlete) === */}
            {activeTab === 'CAREER' && (
                <div className="space-y-6 animate-slide-in">
                    {isCoach ? (
                        <Card title="Currículo e Filosofia">
                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs font-bold text-text-secondary uppercase block mb-1">Filosofia de Trabalho</label>
                                    <textarea disabled={!isEditing} value={formData.philosophy} onChange={e => setFormData({...formData, philosophy: e.target.value})} className={`w-full p-3 rounded border h-32 resize-none ${isEditing ? 'bg-black/40 border-highlight text-white' : 'bg-black/20 border-white/5 text-gray-300'}`} />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-text-secondary uppercase block mb-1">Especialidades (separadas por vírgula)</label>
                                    <input disabled={!isEditing} value={formData.specialties} onChange={e => setFormData({...formData, specialties: e.target.value})} className={`w-full p-3 rounded border ${isEditing ? 'bg-black/40 border-highlight text-white' : 'bg-black/20 border-white/5 text-gray-300'}`} />
                                    <p className="text-[10px] text-text-secondary mt-1">Ex: Quarterbacks, Spread Offense, Liderança</p>
                                </div>
                                {isEditing && <button onClick={handleSaveProfile} className="bg-blue-600 text-white px-4 py-2 rounded font-bold">Salvar Currículo</button>}
                            </div>
                        </Card>
                    ) : (
                        <Card title="Estatísticas da Temporada 2025">
                            <div className="overflow-x-auto">
                                <table className="w-full text-sm text-left text-text-secondary">
                                    <thead className="bg-black/20 uppercase text-xs font-bold text-text-secondary">
                                        <tr>
                                            <th className="px-4 py-3">Semana</th>
                                            <th className="px-4 py-3">Adversário</th>
                                            <th className="px-4 py-3 text-center">Resultado</th>
                                            <th className="px-4 py-3 text-center">{player?.position === 'QB' ? 'Yds Passe' : 'Yds Totais'}</th>
                                            <th className="px-4 py-3 text-center">TDs</th>
                                            <th className="px-4 py-3 text-center">Turnovers</th>
                                            <th className="px-4 py-3 text-center">Nota</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {(player?.gameLogs || []).length > 0 ? player?.gameLogs?.map((log, i) => (
                                            <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                                <td className="px-4 py-3">W{log.week}</td>
                                                <td className="px-4 py-3 font-bold text-white">{log.opponent}</td>
                                                <td className={`px-4 py-3 text-center font-bold ${log.result.startsWith('W') ? 'text-green-400' : 'text-red-400'}`}>{log.result}</td>
                                                <td className="px-4 py-3 text-center text-white">{log.stats.yards}</td>
                                                <td className="px-4 py-3 text-center text-white">{log.stats.tds}</td>
                                                <td className="px-4 py-3 text-center">{log.stats.turnovers}</td>
                                                <td className="px-4 py-3 text-center"><span className="bg-white/10 px-2 py-0.5 rounded font-bold">{log.grade}</span></td>
                                            </tr>
                                        )) : (
                                            <tr><td colSpan={7} className="text-center py-8 italic">Nenhuma estatística registrada ainda.</td></tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </Card>
                    )}
                </div>
            )}

            {/* === TAB: HIGHLIGHTS === */}
            {activeTab === 'HIGHLIGHTS' && !isCoach && (
                <div className="space-y-6 animate-slide-in">
                    <Card title="Meus Melhores Momentos">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {(player?.highlights || []).length > 0 ? player?.highlights?.map((hl, i) => (
                                <div key={i} className="bg-black/30 rounded-xl overflow-hidden border border-white/10 hover:border-highlight/50 transition-all group">
                                    <div className="aspect-video relative bg-black">
                                        <LazyImage src={hl.thumbnailUrl} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                                        <div className="absolute inset-0 flex items-center justify-center">
                                            <PlayCircleIcon className="w-16 h-16 text-white opacity-80 group-hover:opacity-100 drop-shadow-lg transform group-hover:scale-110 transition-all" />
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <h4 className="font-bold text-white text-lg">{hl.title}</h4>
                                        <p className="text-xs text-text-secondary mt-1">{new Date(hl.date).toLocaleDateString()} • {hl.views} visualizações</p>
                                    </div>
                                </div>
                            )) : (
                                <div className="col-span-2 text-center py-12 bg-secondary/20 rounded-xl border border-dashed border-white/10">
                                    <VideoIcon className="w-12 h-12 mx-auto text-text-secondary opacity-50 mb-2" />
                                    <p className="text-text-secondary">Nenhum highlight adicionado ao seu perfil.</p>
                                    <button className="mt-4 text-highlight text-sm font-bold hover:underline">Adicionar Vídeo do YouTube</button>
                                </div>
                            )}
                        </div>
                    </Card>
                </div>
            )}

            {/* === TAB: TROPHIES === */}
            {activeTab === 'TROPHIES' && (
                <div className="space-y-6 animate-slide-in">
                    <Card title="Sala de Troféus & Conquistas">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            {((isCoach ? coachProfile?.achievements : player?.achievements) || []).length > 0 ? (isCoach ? coachProfile?.achievements : player?.achievements)?.map((ach, i) => (
                                <div key={i} className="bg-gradient-to-b from-secondary to-black p-6 rounded-xl border border-yellow-500/20 flex flex-col items-center text-center hover:border-yellow-500/50 transition-all group">
                                    <div className="w-16 h-16 bg-yellow-500/10 rounded-full flex items-center justify-center mb-4 group-hover:bg-yellow-500/20 transition-colors">
                                        <TrophyIcon className="w-8 h-8 text-yellow-400" />
                                    </div>
                                    <h4 className="font-bold text-white text-sm">{ach.title}</h4>
                                    <p className="text-xs text-text-secondary mt-1">{ach.year}</p>
                                    <span className="text-[10px] bg-white/5 px-2 py-0.5 rounded mt-2 text-yellow-200">{ach.type}</span>
                                </div>
                            )) : (
                                <div className="col-span-4 text-center py-12 text-text-secondary italic">
                                    Sua estante ainda está vazia. Vá treinar e conquiste a glória!
                                </div>
                            )}
                        </div>
                    </Card>
                </div>
            )}

            {/* KYC MODAL and CARD GENERATOR (Existing logic) */}
            {/* ... Only rendered if not coach for now or adjusted ... */}
            {!isCoach && showCardModal && player && (
                <Modal isOpen={showCardModal} onClose={() => setShowCardModal(false)} title="Seu Card Oficial (Panini Style)" maxWidth="max-w-xl">
                    <div className="flex flex-col items-center gap-6 max-h-[80vh] overflow-y-auto custom-scrollbar p-2">
                        <div className="bg-black/40 p-4 rounded-xl border border-white/10 w-full text-center"><p className="text-sm text-text-secondary mb-2">Este card é gerado com base nas suas estatísticas oficiais e Combine.</p><div className="flex justify-center gap-4 text-xs font-mono text-highlight"><span>SPD: {stats?.SPD}</span><span>STR: {stats?.STR}</span><span>AGI: {stats?.AGI}</span><span>OVR: {stats?.OVR}</span></div></div>
                        <div id="official-card-area" className="relative w-[300px] h-[420px] rounded-2xl overflow-hidden shadow-[0_0_40px_rgba(234,179,8,0.3)] transition-transform transform hover:scale-105 duration-500 group select-none shrink-0"><div className={`absolute inset-0 bg-gradient-to-br ${player.rating >= 90 ? 'from-yellow-400 via-yellow-600 to-yellow-800' : 'from-gray-300 via-gray-400 to-gray-500'}`}><div className="absolute inset-0 opacity-30" style={{backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.4) 0%, transparent 60%)'}}></div><div className="absolute top-0 right-0 w-[200px] h-[500px] bg-black/10 transform -rotate-12 translate-x-10"></div></div><div className="absolute top-4 left-4 z-20 flex flex-col items-center"><span className="text-4xl font-black text-white drop-shadow-md leading-none">{stats?.OVR}</span><span className="text-xs font-bold text-white uppercase tracking-wider mt-1">{player.position}</span><LazyImage src={storageService.getTeamSettings().logoUrl} className="w-8 h-8 mt-2 drop-shadow-md" /></div><div className="absolute top-10 right-[-20px] w-[280px] h-[280px] z-10"><LazyImage src={player.avatarUrl} className="w-full h-full object-cover object-top drop-shadow-2xl mask-image-gradient" style={{maskImage: 'linear-gradient(to bottom, black 80%, transparent 100%)'}} /></div><div className="absolute bottom-[110px] left-0 right-0 z-20"><div className="bg-gradient-to-r from-transparent via-black/80 to-transparent py-2 text-center"><h2 className="text-xl font-black text-white uppercase tracking-tighter italic drop-shadow-lg">{player.name}</h2></div></div><div className="absolute bottom-4 left-4 right-4 h-[90px] bg-black/40 backdrop-blur-md rounded-xl border border-white/20 p-3 z-20 grid grid-cols-3 gap-y-1 gap-x-2"><div className="flex items-end justify-between border-b border-white/10 pb-1"><span className="text-xs font-bold text-gray-300">SPD</span><span className="text-lg font-black text-yellow-400 leading-none">{stats?.SPD}</span></div><div className="flex items-end justify-between border-b border-white/10 pb-1"><span className="text-xs font-bold text-gray-300">STR</span><span className="text-lg font-black text-yellow-400 leading-none">{stats?.STR}</span></div><div className="flex items-end justify-between border-b border-white/10 pb-1"><span className="text-xs font-bold text-gray-300">AGI</span><span className="text-lg font-black text-yellow-400 leading-none">{stats?.AGI}</span></div><div className="flex items-end justify-between"><span className="text-xs font-bold text-gray-300">ACC</span><span className="text-lg font-black text-yellow-400 leading-none">{stats?.ACC}</span></div><div className="flex items-end justify-between"><span className="text-xs font-bold text-gray-300">AWR</span><span className="text-lg font-black text-yellow-400 leading-none">{stats?.AWR}</span></div><div className="flex items-end justify-between"><span className="text-xs font-bold text-gray-300">XP</span><span className="text-lg font-black text-white leading-none">{player.level}</span></div></div><div className="absolute inset-0 z-30 bg-gradient-to-tr from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" style={{mixBlendMode: 'overlay'}}></div></div>
                        <div className="flex gap-4 w-full"><button onClick={() => window.print()} className="flex-1 bg-white hover:bg-gray-100 text-black font-bold py-3 rounded-xl shadow-lg flex items-center justify-center gap-2"><PrinterIcon className="w-5 h-5" /> Imprimir / PDF</button><button className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold py-3 rounded-xl shadow-lg flex items-center justify-center gap-2"><ShareIcon className="w-5 h-5" /> Compartilhar</button></div>
                    </div>
                </Modal>
            )}
        </div>
    );
};

export default MyProfile;
