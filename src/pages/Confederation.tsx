import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import { storageService } from '../services/storageService';
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
        setStats(storageService.getConfederationStats());
        setCandidates(storageService.getNationalTeamScouting());
        setAffiliates(storageService.getAffiliatesStatus());
        setTransfers(storageService.getTransferRequests());
        setAuditLogs(storageService.getAuditLogs());
    }, []);

    const handleTransferDecision = (id: string, decision: 'APPROVE' | 'REJECT') => {
        const user = authService.getCurrentUser();
        storageService.processTransfer(id, decision, user?.name || 'Admin');
        setTransfers(storageService.getTransferRequests()); 
        setAuditLogs(storageService.getAuditLogs()); 
        
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

            {activeTab === 'NATIONAL_TEAM' && (
                <div className="space-y-6 animate-slide-in">
                    <Card title="Brasil Onças War Room (Shadow Roster)">
                        <div className="mb-4 flex gap-2 overflow-x-auto pb-2">
                            {['ALL', 'QB', 'RB', 'WR', 'TE', 'OL', 'DL', 'LB', 'DB', 'K/P'].map(pos => (
                                <button 
                                    key={pos}
                                    onClick={() => setSelectedPos(pos)}
                                    className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${selectedPos === pos ? 'bg-yellow-500 text-black' : 'bg-secondary text-text-secondary border border-white/10 hover:text-white'}`}
                                >
                                    {pos}
                                </button>
                            ))}
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {filteredCandidates.map(player => (
                                <div key={player.id} className="bg-secondary p-4 rounded-xl border border-white/5 flex items-center gap-4 hover:border-yellow-500/50 transition-all group">
                                    <div className="relative">
                                        <LazyImage src={player.avatarUrl} className="w-12 h-12 rounded-full border-2 border-white/20 group-hover:border-yellow-500 transition-colors" />
                                        <div className="absolute -bottom-1 -right-1 bg-black text-white text-[10px] font-bold px-1 rounded border border-white/20">{player.rating}</div>
                                    </div>
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start">
                                            <h4 className="font-bold text-white text-sm">{player.name}</h4>
                                            <span className="text-xs font-bold bg-white/10 px-2 py-0.5 rounded text-yellow-400">{player.position}</span>
                                        </div>
                                        <div className="flex items-center gap-2 mt-1">
                                            <LazyImage src={player.teamLogo} className="w-4 h-4 rounded-full" />
                                            <span className="text-xs text-text-secondary">{player.teamName}</span>
                                        </div>
                                        <div className="mt-2 flex gap-3 text-[10px] text-text-secondary">
                                            <span>40y: <strong className="text-white">{player.combineStats?.fortyYards || '--'}</strong></span>
                                            <span>Bench: <strong className="text-white">{player.combineStats?.benchPress || '--'}</strong></span>
                                        </div>
                                    </div>
                                    <button onClick={() => toast.success(`${player.name} adicionado à lista de observação.`)} className="text-xs bg-green-600 hover:bg-green-500 text-white px-3 py-1.5 rounded font-bold self-center">
                                        Monitorar
                                    </button>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
            )}

            {activeTab === 'AFFILIATES' && (
                <div className="space-y-6 animate-slide-in">
                    <Card title="Governança de Federações Estaduais">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left text-text-secondary">
                                <thead className="bg-black/20 uppercase text-xs font-bold">
                                    <tr>
                                        <th className="px-4 py-3">Estado/Federação</th>
                                        <th className="px-4 py-3">Região</th>
                                        <th className="px-4 py-3">Presidente</th>
                                        <th className="px-4 py-3 text-center">Status</th>
                                        <th className="px-4 py-3 text-center">Atletas</th>
                                        <th className="px-4 py-3 text-center">Times</th>
                                        <th className="px-4 py-3 text-right">Última Auditoria</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {affiliates.map(aff => (
                                        <tr key={aff.id} className="border-b border-white/5 hover:bg-white/5">
                                            <td className="px-4 py-3 font-bold text-white">{aff.name}</td>
                                            <td className="px-4 py-3">{aff.region}</td>
                                            <td className="px-4 py-3">{aff.president}</td>
                                            <td className="px-4 py-3 text-center">
                                                <span className={`text-[10px] font-bold px-2 py-1 rounded border ${aff.status === 'REGULAR' ? 'bg-green-500/20 text-green-400 border-green-500/30' : aff.status === 'PENDING' ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30' : 'bg-red-500/20 text-red-400 border-red-500/30'}`}>
                                                    {aff.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-center text-white">{aff.athletesCount}</td>
                                            <td className="px-4 py-3 text-center text-white">{aff.teamsCount}</td>
                                            <td className="px-4 py-3 text-right text-xs">{new Date(aff.lastAuditDate).toLocaleDateString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </div>
            )}

            {activeTab === 'BID' && (
                <Card title="Boletim Informativo Diário (BID) - Gestão de Transferências">
                    <div className="space-y-4">
                        <div className="bg-indigo-900/20 p-4 rounded-lg border border-indigo-500/30 flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <SwapIcon className="w-8 h-8 text-indigo-400" />
                                <div>
                                    <h4 className="font-bold text-white">Janela de Transferências: ABERTA</h4>
                                    <p className="text-xs text-text-secondary">Fecha em 15 de Outubro</p>
                                </div>
                            </div>
                            <button className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded text-sm font-bold">
                                Regras de Elegibilidade
                            </button>
                        </div>

                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left text-text-secondary">
                                <thead className="bg-black/20 uppercase text-xs font-bold">
                                    <tr>
                                        <th className="px-4 py-3">Atleta</th>
                                        <th className="px-4 py-3">Origem</th>
                                        <th className="px-4 py-3">Destino</th>
                                        <th className="px-4 py-3">Taxa (R$)</th>
                                        <th className="px-4 py-3">Status</th>
                                        <th className="px-4 py-3 text-right">Ação</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {transfers.map(transfer => (
                                        <tr key={transfer.id} className="border-b border-white/5 hover:bg-white/5">
                                            <td className="px-4 py-3 font-bold text-white">{transfer.playerName}</td>
                                            <td className="px-4 py-3">{transfer.originTeamName}</td>
                                            <td className="px-4 py-3 text-white font-bold">{transfer.destinationTeamName}</td>
                                            <td className="px-4 py-3 text-green-400 font-mono">R$ {transfer.fee}</td>
                                            <td className="px-4 py-3">
                                                <span className={`text-[10px] px-2 py-1 rounded font-bold ${transfer.status === 'APPROVED' ? 'bg-green-500/20 text-green-400' : transfer.status === 'PENDING' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-red-500/20 text-red-400'}`}>
                                                    {transfer.status}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-right flex justify-end gap-2">
                                                {transfer.status === 'PENDING' && (
                                                    <>
                                                        <button 
                                                            onClick={() => handleTransferDecision(transfer.id, 'APPROVE')}
                                                            className="bg-green-600 hover:bg-green-500 text-white px-2 py-1 rounded text-xs"
                                                        >
                                                            Aprovar
                                                        </button>
                                                        <button 
                                                            onClick={() => handleTransferDecision(transfer.id, 'REJECT')}
                                                            className="bg-red-600 hover:bg-red-500 text-white px-2 py-1 rounded text-xs"
                                                        >
                                                            Rejeitar
                                                        </button>
                                                    </>
                                                )}
                                                {transfer.status !== 'PENDING' && <span className="text-xs text-text-secondary italic">Finalizado</span>}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </Card>
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
                                            <td className="px-4 py-2 text-xs">{log.ipAddress}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </div>
            )}

            {activeTab === 'STJD' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card title="Corte Suprema (STJD)">
                        <div className="bg-black/20 p-4 rounded-lg border border-white/10 mb-4 flex items-start gap-4">
                            <ShieldCheckIcon className="w-8 h-8 text-yellow-500 mt-1" />
                            <div>
                                <h4 className="font-bold text-white">Última Instância</h4>
                                <p className="text-sm text-text-secondary">
                                    O Superior Tribunal de Justiça Desportiva (STJD) julga recursos das federações estaduais e casos de disciplinar de competições nacionais.
                                </p>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <div className="bg-secondary p-3 rounded border border-white/5 flex justify-between items-center">
                                <div>
                                    <p className="text-white font-bold text-sm">Processo #2025-042</p>
                                    <p className="text-xs text-text-secondary">Recurso: Minas Locomotiva vs TJD-MG</p>
                                </div>
                                <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded">Em Análise</span>
                            </div>
                            <div className="bg-secondary p-3 rounded border border-white/5 flex justify-between items-center">
                                <div>
                                    <p className="text-white font-bold text-sm">Processo #2025-039</p>
                                    <p className="text-xs text-text-secondary">Infração Disciplinar: Final BFA</p>
                                </div>
                                <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded">Julgado</span>
                            </div>
                        </div>
                    </Card>
                    <Card title="Ações do Tribunal">
                        <div className="space-y-3">
                            <button className="w-full bg-secondary hover:bg-white/5 border border-white/10 p-3 rounded-lg text-left text-sm text-white flex items-center gap-2">
                                <GavelIcon className="w-4 h-4 text-text-secondary" /> Pautar Julgamento
                            </button>
                            <button className="w-full bg-secondary hover:bg-white/5 border border-white/10 p-3 rounded-lg text-left text-sm text-white flex items-center gap-2">
                                <AlertTriangleIcon className="w-4 h-4 text-text-secondary" /> Emitir Mandado de Citação
                            </button>
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );
};

export default Confederation;