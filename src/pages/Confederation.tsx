
import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import { storageService } from '../services/storageService';
// Fix: Corrected type imports from updated types.ts
import { ConfederationStats, NationalTeamCandidate, Affiliate, TransferRequest, AuditLog } from '../types';
import { GlobeIcon, TrophyIcon, FlagIcon } from '../components/icons/NavIcons';
import { UsersIcon, MapIcon, BuildingIcon, CheckCircleIcon, AlertTriangleIcon, GavelIcon, ShieldCheckIcon, SwapIcon, LockIcon, FileTextIcon } from '../components/icons/UiIcons';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { authService } from '../services/authService';
import LazyImage from '../components/LazyImage';
import { useToast } from '../contexts/ToastContext';

const Confederation: React.FC = () => {
    const toast = useToast();
    const [activeTab, setActiveTab] = useState<'DASHBOARD' | 'NATIONAL_TEAM' | 'AFFILIATES' | 'BID' | 'STJD' | 'SECURITY'>('DASHBOARD');
    const [stats, setStats] = useState<ConfederationStats | null>(null);
    const [candidates, setCandidates] = useState<NationalTeamCandidate[]>([]);
    const [affiliates, setAffiliates] = useState<Affiliate[]>([]);
    const [transfers, setTransfers] = useState<TransferRequest[]>([]);
    const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
    const [selectedPos, setSelectedPos] = useState('ALL');

    useEffect(() => {
        // Fix: Ensured all methods now exist in updated storageService.ts
        setStats(storageService.getConfederationStats());
        setCandidates(storageService.getNationalTeamScouting());
        setAffiliates(storageService.getAffiliatesStatus());
        setTransfers(storageService.getTransferRequests());
        setAuditLogs(storageService.getAuditLogs());
    }, []);

    const handleTransferDecision = (id: string, decision: 'APPROVE' | 'REJECT') => {
        const user = authService.getCurrentUser();
        // Fix: processTransfer and getTransferRequests exist in updated storageService.ts
        storageService.processTransfer(id, decision, user?.name || 'Admin');
        setTransfers(storageService.getTransferRequests()); 
        storageService.notify('audit'); 
        
        if (decision === 'APPROVE') {
            toast.success("Transferência APROVADA e publicada no BID.");
        } else {
            toast.error("Transferência REJEITADA.");
        }
    };

    if (!stats) return <div className="text-white p-8 text-center">Carregando dados da Confederação...</div>;

    const filteredCandidates = selectedPos === 'ALL' ? candidates : candidates.filter(c => c.position === selectedPos);

    const growthData = [
        { name: '2021', athletes: 3200 },
        { name: '2022', athletes: 3800 },
        { name: '2023', athletes: 4300 },
        { name: '2024', athletes: 4850 },
    ];

    return (
        <div className="space-y-6 pb-12 animate-fade-in">
            <div className="bg-gradient-to-r from-yellow-900 to-green-900 p-6 rounded-2xl border border-white/10 flex flex-col md:flex-row justify-between items-center gap-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
                <div className="flex items-center gap-4 relative z-10">
                    <div className="p-4 bg-white/10 rounded-full border border-yellow-500/50">
                        <GlobeIcon className="text-yellow-400 w-12 h-12" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-black text-white uppercase tracking-widest">Confederação Brasileira</h2>
                        <p className="text-yellow-200 text-sm font-bold">Unidade • Governança • Excelência</p>
                    </div>
                </div>
                <div className="flex gap-8 relative z-10">
                    <div className="text-center">
                        <p className="text-xs text-text-secondary uppercase font-bold">População FA</p>
                        <p className="text-3xl font-black text-white">{stats.totalAthletes.toLocaleString()}</p>
                    </div>
                    <div className="w-px bg-white/10"></div>
                    <div className="text-center">
                        <p className="text-xs text-text-secondary uppercase font-bold">Times Ativos</p>
                        <p className="text-3xl font-black text-white">{stats.totalTeams}</p>
                    </div>
                </div>
            </div>

            <div className="flex border-b border-white/10 overflow-x-auto">
                <button onClick={() => setActiveTab('DASHBOARD')} className={`px-6 py-3 text-sm font-bold border-b-2 transition-colors whitespace-nowrap flex items-center gap-2 ${activeTab === 'DASHBOARD' ? 'border-yellow-500 text-yellow-500' : 'border-transparent text-text-secondary'}`}>
                    <MapIcon className="w-4 h-4" /> Censo & Estratégia
                </button>
                <button onClick={() => setActiveTab('NATIONAL_TEAM')} className={`px-6 py-3 text-sm font-bold border-b-2 transition-colors whitespace-nowrap flex items-center gap-2 ${activeTab === 'NATIONAL_TEAM' ? 'border-green-500 text-green-500' : 'border-transparent text-text-secondary'}`}>
                    <FlagIcon className="w-4 h-4" /> Brasil Onças (Scout)
                </button>
                <button onClick={() => setActiveTab('AFFILIATES')} className={`px-6 py-3 text-sm font-bold border-b-2 transition-colors whitespace-nowrap flex items-center gap-2 ${activeTab === 'AFFILIATES' ? 'border-blue-500 text-blue-500' : 'border-transparent text-text-secondary'}`}>
                    <BuildingIcon className="w-4 h-4" /> Federações
                </button>
                <button onClick={() => setActiveTab('BID')} className={`px-6 py-3 text-sm font-bold border-b-2 transition-colors whitespace-nowrap flex items-center gap-2 ${activeTab === 'BID' ? 'border-indigo-500 text-indigo-400' : 'border-transparent text-text-secondary'}`}>
                    <SwapIcon className="w-4 h-4" /> BID Nacional
                </button>
                <button onClick={() => setActiveTab('SECURITY')} className={`px-6 py-3 text-sm font-bold border-b-2 transition-colors whitespace-nowrap flex items-center gap-2 ${activeTab === 'SECURITY' ? 'border-red-500 text-red-400' : 'border-transparent text-text-secondary'}`}>
                    <LockIcon className="w-4 h-4" /> Segurança
                </button>
                <button onClick={() => setActiveTab('STJD')} className={`px-6 py-3 text-sm font-bold border-b-2 transition-colors whitespace-nowrap flex items-center gap-2 ${activeTab === 'STJD' ? 'border-orange-500 text-orange-500' : 'border-transparent text-text-secondary'}`}>
                    <GavelIcon className="w-4 h-4" /> STJD
                </button>
            </div>

            {activeTab === 'DASHBOARD' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-slide-in">
                    <Card title="Crescimento Nacional (Atletas Federados)">
                        <div className="h-64 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={growthData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                                    <XAxis dataKey="name" stroke="#94a3b8" />
                                    <YAxis stroke="#94a3b8" />
                                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.1)' }} />
                                    <Bar dataKey="athletes" fill="#fbbf24" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-secondary p-6 rounded-xl border border-white/5 flex flex-col justify-center items-center">
                            <UsersIcon className="w-10 h-10 text-blue-400 mb-2" />
                            <h3 className="text-3xl font-black text-white">{stats.totalGamesThisYear}</h3>
                            <p className="text-xs text-text-secondary uppercase font-bold">Jogos Realizados (Ano)</p>
                        </div>
                        <div className="bg-secondary p-6 rounded-xl border border-white/5 flex flex-col justify-center items-center">
                            <BuildingIcon className="w-10 h-10 text-green-400 mb-2" />
                            <h3 className="text-3xl font-black text-white">{stats.activeAffiliates}</h3>
                            <p className="text-xs text-text-secondary uppercase font-bold">Federações Ativas</p>
                        </div>
                        <div className="col-span-2 bg-gradient-to-br from-green-900/30 to-secondary p-6 rounded-xl border border-green-500/20 text-center">
                            <h4 className="text-lg font-bold text-white mb-2">Meta de Expansão 2026</h4>
                            <div className="w-full bg-black/30 h-4 rounded-full overflow-hidden mb-2">
                                <div className="h-full bg-green-500" style={{ width: '65%' }}></div>
                            </div>
                            <p className="text-xs text-green-400 font-bold">65% Atingido (Alvo: 6.000 Atletas)</p>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'SECURITY' && (
                <div className="space-y-6">
                    <div className="bg-red-900/10 border-l-4 border-red-500 p-4 rounded-r-lg flex items-center gap-4">
                        <ShieldCheckIcon className="w-10 h-10 text-red-500" />
                        <div>
                            <h3 className="font-bold text-white">Centro de Segurança e Auditoria</h3>
                            <p className="text-sm text-text-secondary">Monitoramento em tempo real de todas as ações críticas do ecossistema.</p>
                        </div>
                    </div>

                    <Card title="Logs de Auditoria (Immutable)">
                        <div className="overflow-x-auto max-h-[600px] custom-scrollbar">
                            <table className="w-full text-sm text-left text-text-secondary font-mono">
                                <thead className="bg-black/40 uppercase text-xs font-bold text-text-secondary sticky top-0">
                                    <tr>
                                        <th className="px-4 py-3">Timestamp</th>
                                        <th className="px-4 py-3">Actor</th>
                                        <th className="px-4 py-3">Evento</th>
                                        <th className="px-4 py-3">Detalhes</th>
                                        <th className="px-4 py-3">IP</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {auditLogs.map(log => (
                                        <tr key={log.id} className="border-b border-white/5 hover:bg-white/5">
                                            <td className="px-4 py-2 text-xs text-gray-400">{new Date(log.timestamp).toLocaleString()}</td>
                                            <td className="px-4 py-2">
                                                <span className="text-white font-bold">{log.userName}</span>
                                                <span className="text-[10px] ml-2 bg-white/10 px-1 rounded">{log.role}</span>
                                            </td>
                                            <td className="px-4 py-2">
                                                <span className={`text-[10px] uppercase px-2 py-0.5 rounded font-bold ${log.action.includes('REJECT') ? 'bg-red-900/30 text-red-400' : 'bg-blue-900/30 text-blue-400'}`}>
                                                    {log.action}
                                                </span>
                                            </td>
                                            <td className="px-4 py-2 text-white">{log.details}</td>
                                            {/* Fix: ipAddress is now a valid property in AuditLog */}
                                            <td className="px-4 py-2 text-xs">{log.ipAddress || '---.---.---.---'}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );
};

export default Confederation;