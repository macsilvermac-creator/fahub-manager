
import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import { authService } from '../services/authService';
import { User, AuditLog } from '../types';
import { CheckCircleIcon, TrashIcon, ShieldCheckIcon, LockIcon, SparklesIcon } from '../components/icons/UiIcons';
import { storageService } from '../services/storageService';
import LazyImage from '@/components/LazyImage';

const AdminPanel: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
    const [activeTab, setActiveTab] = useState<'USERS' | 'SYSTEM' | 'COMPLIANCE'>('USERS');
    const [isSeeding, setIsSeeding] = useState(false);

    useEffect(() => {
        setUsers(authService.getUsers());
        setAuditLogs(storageService.getAuditLogs());
    }, []);

    const handleUpdateStatus = (userId: string, status: 'APPROVED' | 'REJECTED') => {
        authService.updateUserStatus(userId, status);
        setUsers(authService.getUsers()); // Refresh
        storageService.logAuditAction('USER_MGMT', `Admin alterou status do usuário ${userId} para ${status}`);
    };

    const handleExportData = () => {
        storageService.exportFullDatabase();
        storageService.logAuditAction('DATA_EXPORT', 'Backup completo realizado pelo Admin');
    };

    const handleSeedData = async () => {
        if(!window.confirm("ATENÇÃO: Isso irá apagar/sobrescrever dados e criar o time de demonstração 'FAHUB Stars' com jogadores e jogos fictícios. Continuar?")) return;
        
        setIsSeeding(true);
        try {
            await storageService.seedDatabaseToCloud();
            alert("Sucesso! Banco de dados populado com dados de demonstração. A página será recarregada.");
            window.location.reload();
        } catch (e: any) {
            alert("Erro ao popular banco: " + e.message);
        } finally {
            setIsSeeding(false);
        }
    };

    const pendingUsers = users.filter(u => u.status === 'PENDING');
    const activeUsers = users.filter(u => u.status === 'APPROVED');

    return (
        <div className="space-y-6 pb-12 animate-fade-in">
            <h2 className="text-3xl font-bold text-white mb-6">Painel Administrativo (Master)</h2>

            {/* Tabs */}
            <div className="flex border-b border-white/10 mb-4 overflow-x-auto">
                <button onClick={() => setActiveTab('USERS')} className={`px-6 py-2 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${activeTab === 'USERS' ? 'border-highlight text-highlight' : 'border-transparent text-text-secondary'}`}>
                    Usuários
                </button>
                <button onClick={() => setActiveTab('COMPLIANCE')} className={`px-6 py-2 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${activeTab === 'COMPLIANCE' ? 'border-red-500 text-red-400' : 'border-transparent text-text-secondary'}`}>
                    Compliance & Logs
                </button>
                <button onClick={() => setActiveTab('SYSTEM')} className={`px-6 py-2 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${activeTab === 'SYSTEM' ? 'border-highlight text-highlight' : 'border-transparent text-text-secondary'}`}>
                    Dados & Arquitetura
                </button>
            </div>

            {activeTab === 'USERS' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card title={`Solicitações Pendentes (${pendingUsers.length})`}>
                        {pendingUsers.length === 0 && <p className="text-text-secondary italic p-4">Nenhuma solicitação pendente.</p>}
                        <div className="space-y-3">
                            {pendingUsers.map(user => (
                                <div key={user.id} className="bg-secondary p-4 rounded-xl border border-white/5 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <LazyImage src={user.avatarUrl} className="w-10 h-10 rounded-full" />
                                        <div>
                                            <p className="font-bold text-white">{user.name}</p>
                                            <p className="text-xs text-text-secondary">{user.email} • <span className="text-highlight font-bold">{user.role}</span></p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button 
                                            onClick={() => handleUpdateStatus(user.id, 'APPROVED')}
                                            className="p-2 bg-green-600 hover:bg-green-500 text-white rounded-lg"
                                            title="Aprovar"
                                        >
                                            <CheckCircleIcon />
                                        </button>
                                        <button 
                                            onClick={() => handleUpdateStatus(user.id, 'REJECTED')}
                                            className="p-2 bg-red-600 hover:bg-red-500 text-white rounded-lg"
                                            title="Rejeitar"
                                        >
                                            <TrashIcon />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>

                    <Card title={`Usuários Ativos (${activeUsers.length})`}>
                        <div className="space-y-3 max-h-[500px] overflow-y-auto custom-scrollbar pr-2">
                            {activeUsers.map(user => (
                                <div key={user.id} className="bg-secondary/40 p-3 rounded-lg border border-white/5 flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <LazyImage src={user.avatarUrl} className="w-8 h-8 rounded-full grayscale" />
                                        <div>
                                            <p className="font-bold text-white text-sm">{user.name}</p>
                                            <p className="text-xs text-text-secondary">{user.role}</p>
                                        </div>
                                    </div>
                                    {user.role !== 'MASTER' && (
                                        <button 
                                            onClick={() => handleUpdateStatus(user.id, 'REJECTED')}
                                            className="text-xs text-red-400 hover:text-red-300 underline"
                                        >
                                            Revogar
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
            )}

            {activeTab === 'COMPLIANCE' && (
                <div className="space-y-6 animate-fade-in">
                    <div className="bg-gradient-to-r from-red-900/20 to-secondary p-4 rounded-xl border border-red-500/20 flex items-center gap-4">
                        <ShieldCheckIcon className="w-10 h-10 text-red-500" />
                        <div>
                            <h3 className="font-bold text-white">Centro de Segurança e Auditoria</h3>
                            <p className="text-sm text-text-secondary">Monitoramento em tempo real de todas as ações críticas do ecossistema.</p>
                        </div>
                    </div>

                    <Card title="Audit Log (Rastreabilidade)">
                        <div className="overflow-x-auto max-h-[600px] custom-scrollbar">
                            <table className="w-full text-sm text-left text-text-secondary font-mono">
                                <thead className="bg-black/40 uppercase text-xs font-bold text-text-secondary sticky top-0">
                                    <tr>
                                        <th className="px-4 py-3">Timestamp</th>
                                        <th className="px-4 py-3">Usuário</th>
                                        <th className="px-4 py-3">Ação</th>
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

            {activeTab === 'SYSTEM' && (
                <div className="space-y-6">
                    <Card title="Operações de Banco de Dados">
                        <div className="p-4 bg-secondary/30 rounded-lg border border-white/5 mb-6">
                            <h4 className="font-bold text-white mb-2">Ambiente Conectado (Firebase)</h4>
                            <p className="text-sm text-text-secondary leading-relaxed">
                                Seu sistema está rodando na nuvem. Use as ferramentas abaixo para manutenção e setup inicial.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-gradient-to-br from-green-900/30 to-black p-6 rounded-xl border border-green-500/30">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="p-2 bg-green-500/20 rounded-lg">
                                        <SparklesIcon className="w-6 h-6 text-green-400" />
                                    </div>
                                    <h4 className="font-bold text-white">Popular Dados de Demo (Seed)</h4>
                                </div>
                                <p className="text-xs text-text-secondary mb-4">
                                    Se seu banco estiver vazio, use esta função para criar o time "FAHUB Stars", adicionar jogadores, jogos e finanças de exemplo.
                                </p>
                                <button 
                                    onClick={handleSeedData} 
                                    disabled={isSeeding}
                                    className="w-full bg-green-600 hover:bg-green-500 text-white px-4 py-3 rounded-lg font-bold shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    {isSeeding ? 'Criando Dados...' : 'Executar Setup Inicial'}
                                </button>
                            </div>

                            <div className="bg-black/20 p-6 rounded-xl border border-white/10">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="p-2 bg-white/10 rounded-lg">
                                        <LockIcon className="w-6 h-6 text-white" />
                                    </div>
                                    <h4 className="font-bold text-white">Backup Completo (JSON)</h4>
                                </div>
                                <p className="text-xs text-text-secondary mb-4">
                                    Baixe uma cópia de segurança de todos os dados atuais do sistema.
                                </p>
                                <button onClick={handleExportData} className="w-full bg-secondary border border-white/10 hover:bg-white/5 text-white px-4 py-3 rounded-lg font-bold shadow-lg flex items-center justify-center gap-2">
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                                    Baixar Backup
                                </button>
                            </div>
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );
};

export default AdminPanel;