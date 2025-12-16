
import React, { useState } from 'react';
import Card from '../components/Card';
import { Tenant, ServiceTicket, PlatformMetric } from '../types';
import { BuildingIcon, WalletIcon, ClipboardIcon, CheckCircleIcon, SparklesIcon, AlertTriangleIcon } from '../components/icons/UiIcons';
import { TrophyIcon, GlobeIcon } from '../components/icons/NavIcons'; // Fixed Import
import { BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from 'recharts';

// MOCK DATA PARA DEMONSTRAÇÃO
const MOCK_TENANTS: Tenant[] = [
    { id: 't1', name: 'FAHUB Stars', plan: 'ALL_PRO', status: 'ACTIVE', mrr: 4500, joinedAt: new Date('2023-01-10'), logoUrl: 'https://ui-avatars.com/api/?name=FS&background=00A86B&color=fff', contactEmail: 'presidencia@fahub.com' },
    { id: 't2', name: 'São Paulo Bulls', plan: 'STARTER', status: 'ACTIVE', mrr: 1200, joinedAt: new Date('2023-05-15'), logoUrl: 'https://ui-avatars.com/api/?name=SB&background=red&color=fff', contactEmail: 'admin@bulls.com' },
    { id: 't3', name: 'Minas Locomotiva', plan: 'ROOKIE', status: 'DELINQUENT', mrr: 0, joinedAt: new Date('2023-11-20'), logoUrl: 'https://ui-avatars.com/api/?name=ML&background=blue&color=fff', contactEmail: 'financeiro@locomotiva.com' },
];

const MOCK_TICKETS: ServiceTicket[] = [
    { id: 'svc-1', tenantId: 't1', tenantName: 'FAHUB Stars', serviceName: 'Video Analysis (Game 4)', status: 'PENDING', purchasedAt: new Date(), assignedTo: 'Analista João' },
    { id: 'svc-2', tenantId: 't2', tenantName: 'São Paulo Bulls', serviceName: 'Logo Design Refresh', status: 'IN_PROGRESS', purchasedAt: new Date('2023-10-25'), assignedTo: 'Designer Maria' },
    { id: 'svc-3', tenantId: 't1', tenantName: 'FAHUB Stars', serviceName: 'Scout Report (Nacional)', status: 'DELIVERED', purchasedAt: new Date('2023-10-10'), assignedTo: 'Scout Pedro', deliverableUrl: '#' },
];

const REVENUE_DATA = [
    { month: 'Jun', value: 12000 },
    { month: 'Jul', value: 15400 },
    { month: 'Ago', value: 18200 },
    { month: 'Set', value: 22500 },
    { month: 'Out', value: 28000 },
];

const PlatformHQ: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'TENANTS' | 'SERVICES' | 'FINANCE'>('OVERVIEW');
    const [tickets, setTickets] = useState<ServiceTicket[]>(MOCK_TICKETS);
    
    const stats: PlatformMetric = {
        totalRevenue: 28000,
        activeTeams: 42,
        pendingServices: tickets.filter(t => t.status !== 'DELIVERED').length,
        churnRate: 1.2
    };

    const handleUpdateTicket = (id: string, newStatus: 'IN_PROGRESS' | 'DELIVERED') => {
        const updated = tickets.map(t => t.id === id ? { ...t, status: newStatus } : t);
        setTickets(updated);
    };

    return (
        <div className="space-y-8 pb-12 animate-fade-in bg-[#0B0F19] min-h-screen p-8">
            {/* Super Admin Header */}
            <div className="flex justify-between items-center border-b border-white/10 pb-6">
                <div className="flex items-center gap-4">
                    <div className="p-4 bg-purple-600 rounded-2xl shadow-[0_0_20px_rgba(147,51,234,0.3)]">
                        <GlobeIcon className="w-8 h-8 text-white" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-white tracking-tight">FAHUB HQ</h1>
                        <p className="text-purple-300 text-sm font-bold uppercase tracking-widest">Platform Command Center</p>
                    </div>
                </div>
                <div className="flex gap-4">
                     <div className="text-right">
                        <p className="text-[10px] text-text-secondary uppercase">Faturamento Mensal (MRR)</p>
                        <p className="text-2xl font-mono font-bold text-green-400">R$ {stats.totalRevenue.toLocaleString()}</p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <div className="flex gap-2 mb-6">
                {[
                    { id: 'OVERVIEW', label: 'Visão Geral', icon: SparklesIcon },
                    { id: 'TENANTS', label: 'Times (Clientes)', icon: BuildingIcon },
                    { id: 'SERVICES', label: 'Fulfillment (Serviços)', icon: ClipboardIcon },
                    { id: 'FINANCE', label: 'Transações', icon: WalletIcon }
                ].map(tab => (
                    <button 
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`px-6 py-3 rounded-lg font-bold text-sm flex items-center gap-2 transition-all ${activeTab === tab.id ? 'bg-purple-600 text-white shadow-lg' : 'bg-white/5 text-text-secondary hover:bg-white/10'}`}
                    >
                        <tab.icon className="w-4 h-4" /> {tab.label}
                    </button>
                ))}
            </div>

            {/* === OVERVIEW TAB === */}
            {activeTab === 'OVERVIEW' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <Card title="Crescimento da Plataforma">
                        <div className="h-64 w-full">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={REVENUE_DATA}>
                                    <XAxis dataKey="month" stroke="#94a3b8" />
                                    <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: 'none' }} />
                                    <Bar dataKey="value" fill="#9333ea" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-white/5 p-6 rounded-xl border border-white/5">
                            <h3 className="text-text-secondary text-xs font-bold uppercase mb-2">Times Ativos</h3>
                            <p className="text-4xl font-black text-white">{stats.activeTeams}</p>
                            <p className="text-green-400 text-xs mt-1">+4 novos este mês</p>
                        </div>
                        <div className="bg-white/5 p-6 rounded-xl border border-white/5">
                            <h3 className="text-text-secondary text-xs font-bold uppercase mb-2">Churn Rate</h3>
                            <p className="text-4xl font-black text-white">{stats.churnRate}%</p>
                            <p className="text-text-secondary text-xs mt-1">Abaixo da média (2%)</p>
                        </div>
                        <div className="bg-purple-900/20 p-6 rounded-xl border border-purple-500/20 col-span-2">
                            <h3 className="text-purple-300 text-xs font-bold uppercase mb-2">Serviços Pendentes</h3>
                            <div className="flex justify-between items-end">
                                <p className="text-4xl font-black text-white">{stats.pendingServices}</p>
                                <button onClick={() => setActiveTab('SERVICES')} className="text-xs bg-purple-600 px-3 py-1 rounded text-white font-bold">Ver Fila</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* === TENANTS TAB === */}
            {activeTab === 'TENANTS' && (
                <div className="space-y-6 animate-slide-in">
                    <Card title="Gestão de Clientes (Times)">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm text-text-secondary">
                                <thead className="bg-white/5 uppercase text-xs font-bold">
                                    <tr>
                                        <th className="p-4">Time</th>
                                        <th className="p-4">Plano</th>
                                        <th className="p-4">Status</th>
                                        <th className="p-4">MRR</th>
                                        <th className="p-4">Contato</th>
                                        <th className="p-4 text-right">Ação</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {MOCK_TENANTS.map(tenant => (
                                        <tr key={tenant.id} className="border-b border-white/5 hover:bg-white/5">
                                            <td className="p-4 flex items-center gap-3">
                                                <img src={tenant.logoUrl} className="w-8 h-8 rounded bg-white" />
                                                <span className="font-bold text-white">{tenant.name}</span>
                                            </td>
                                            <td className="p-4">
                                                <span className={`text-[10px] px-2 py-1 rounded border font-bold ${tenant.plan === 'ALL_PRO' ? 'border-purple-500 text-purple-400' : 'border-blue-500 text-blue-400'}`}>
                                                    {tenant.plan}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                <span className={`text-[10px] font-bold ${tenant.status === 'ACTIVE' ? 'text-green-400' : 'text-red-400'}`}>
                                                    {tenant.status}
                                                </span>
                                            </td>
                                            <td className="p-4 text-white font-mono">R$ {tenant.mrr.toFixed(2)}</td>
                                            <td className="p-4 text-xs">{tenant.contactEmail}</td>
                                            <td className="p-4 text-right">
                                                <button className="text-xs bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded font-bold border border-white/10">
                                                    Logar como Admin
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </div>
            )}

            {/* === SERVICES TAB (FULFILLMENT) === */}
            {activeTab === 'SERVICES' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-slide-in">
                    {/* Columns: Pending -> In Progress -> Delivered */}
                    <div className="bg-white/5 rounded-xl p-4 border border-white/10 min-h-[500px]">
                        <h3 className="font-bold text-white mb-4 flex justify-between">
                            Pendente 
                            <span className="bg-yellow-500/20 text-yellow-500 px-2 rounded text-xs">{tickets.filter(t => t.status === 'PENDING').length}</span>
                        </h3>
                        <div className="space-y-3">
                            {tickets.filter(t => t.status === 'PENDING').map(ticket => (
                                <div key={ticket.id} className="bg-[#0B0F19] p-4 rounded-lg border border-white/5 shadow-sm group hover:border-yellow-500/50 transition-colors">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className="text-[10px] text-text-secondary">{ticket.tenantName}</span>
                                        <span className="text-[10px] text-text-secondary">{new Date(ticket.purchasedAt).toLocaleDateString()}</span>
                                    </div>
                                    <p className="text-white font-bold text-sm mb-3">{ticket.serviceName}</p>
                                    <button 
                                        onClick={() => handleUpdateTicket(ticket.id, 'IN_PROGRESS')}
                                        className="w-full bg-white/10 hover:bg-yellow-600 hover:text-black text-white text-xs py-2 rounded font-bold transition-colors"
                                    >
                                        Iniciar Trabalho
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white/5 rounded-xl p-4 border border-white/10 min-h-[500px]">
                        <h3 className="font-bold text-white mb-4 flex justify-between">
                            Em Progresso 
                            <span className="bg-blue-500/20 text-blue-500 px-2 rounded text-xs">{tickets.filter(t => t.status === 'IN_PROGRESS').length}</span>
                        </h3>
                        <div className="space-y-3">
                            {tickets.filter(t => t.status === 'IN_PROGRESS').map(ticket => (
                                <div key={ticket.id} className="bg-[#0B0F19] p-4 rounded-lg border border-blue-500/30 shadow-sm relative overflow-hidden">
                                    <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
                                    <div className="flex justify-between items-start mb-2 pl-2">
                                        <span className="text-[10px] text-blue-300 font-bold">{ticket.tenantName}</span>
                                        <div className="flex items-center gap-1">
                                            <div className="w-4 h-4 rounded-full bg-gray-700 flex items-center justify-center text-[8px] text-white">
                                                {ticket.assignedTo?.charAt(0)}
                                            </div>
                                            <span className="text-[10px] text-text-secondary">{ticket.assignedTo}</span>
                                        </div>
                                    </div>
                                    <p className="text-white font-bold text-sm mb-3 pl-2">{ticket.serviceName}</p>
                                    <button 
                                        onClick={() => handleUpdateTicket(ticket.id, 'DELIVERED')}
                                        className="w-full bg-blue-600 hover:bg-blue-500 text-white text-xs py-2 rounded font-bold transition-colors ml-2 w-[calc(100%-8px)]"
                                    >
                                        Marcar Entregue
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white/5 rounded-xl p-4 border border-white/10 min-h-[500px]">
                        <h3 className="font-bold text-white mb-4 flex justify-between">
                            Entregue 
                            <span className="bg-green-500/20 text-green-500 px-2 rounded text-xs">{tickets.filter(t => t.status === 'DELIVERED').length}</span>
                        </h3>
                        <div className="space-y-3 opacity-60 hover:opacity-100 transition-opacity">
                            {tickets.filter(t => t.status === 'DELIVERED').map(ticket => (
                                <div key={ticket.id} className="bg-[#0B0F19] p-4 rounded-lg border border-green-500/20 shadow-sm flex justify-between items-center">
                                    <div>
                                        <p className="text-[10px] text-text-secondary">{ticket.tenantName}</p>
                                        <p className="text-white font-bold text-xs line-through text-text-secondary">{ticket.serviceName}</p>
                                    </div>
                                    <CheckCircleIcon className="w-5 h-5 text-green-500" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PlatformHQ;