
import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import { authService } from '../services/authService';
import { User, AuditLog, UserRole } from '../types';
import { CheckCircleIcon, TrashIcon, ShieldCheckIcon, LockIcon, SparklesIcon, ScanIcon, ClipboardIcon, UsersIcon } from '../components/icons/UiIcons';
import { storageService } from '../services/storageService';
import LazyImage from '@/components/LazyImage';
import Modal from '../components/Modal';

const AdminPanel: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
    const [activeTab, setActiveTab] = useState<'USERS' | 'SYSTEM' | 'COMPLIANCE' | 'INSPECTOR'>('USERS');
    const [isSeeding, setIsSeeding] = useState(false);
    
    // Approval Modal State
    const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [assignedRole, setAssignedRole] = useState<UserRole>('PLAYER');

    // Inspector State
    const [inspectedEntity, setInspectedEntity] = useState<string | null>(null);
    const [entityData, setEntityData] = useState<string>('');

    useEffect(() => {
        setUsers(authService.getUsers());
        setAuditLogs(storageService.getAuditLogs());
    }, []);

    const openApprovalModal = (user: User) => {
        setSelectedUser(user);
        setAssignedRole('PLAYER'); // Default
        setIsApprovalModalOpen(true);
    };

    const handleConfirmApproval = () => {
        if (selectedUser) {
            authService.updateUserStatus(selectedUser.id, 'APPROVED', assignedRole);
            setUsers(authService.getUsers());
            storageService.logAuditAction('USER_MGMT', `Admin aprovou ${selectedUser.name} como ${assignedRole}`);
            setIsApprovalModalOpen(false);
            setSelectedUser(null);
        }
    };

    const handleRejectUser = (userId: string) => {
        if(confirm("Tem certeza que deseja rejeitar e bloquear este usuário?")) {
            authService.updateUserStatus(userId, 'REJECTED');
            setUsers(authService.getUsers());
        }
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

    const loadEntityData = (key: string) => {
        setInspectedEntity(key);
        const data = localStorage.getItem(key);
        try {
            const parsed = data ? JSON.parse(data) : null;
            setEntityData(JSON.stringify(parsed, null, 2));
        } catch {
            setEntityData(data || 'Vazio/Inválido');
        }
    };

    const pendingUsers = users.filter(u => u.status === 'PENDING');
    const activeUsers = users.filter(u => u.status === 'APPROVED');

    return (
        <div className="space-y-6 pb-12 animate-fade-in">
            <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-red-600 rounded-xl shadow-lg">
                    <ShieldCheckIcon className="w-8 h-8 text-white" />
                </div>
                <div>
                    <h2 className="text-3xl font-bold text-white">Painel Administrativo (Master)</h2>
                    <p className="text-text-secondary text-sm">Controle Total da Organização (God Mode)</p>
                </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-white/10 mb-4 overflow-x-auto">
                <button onClick={() => setActiveTab('USERS')} className={`px-6 py-2 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${activeTab === 'USERS' ? 'border-highlight text-highlight' : 'border-transparent text-text-secondary'}`}>
                    Usuários
                </button>
                <button onClick={() => setActiveTab('COMPLIANCE')} className={`px-6 py-2 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${activeTab === 'COMPLIANCE' ? 'border-red-500 text-red-400' : 'border-transparent text-text-secondary'}`}>
                    Compliance & Logs
                </button>
                <button onClick={() => setActiveTab('INSPECTOR')} className={`px-6 py-2 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${activeTab === 'INSPECTOR' ? 'border-purple-500 text-purple-400' : 'border-transparent text-text-secondary'}`}>
                    Inspetor de Dados
                </button>
                <button onClick={() => setActiveTab('SYSTEM')} className={`px-6 py-2 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${activeTab === 'SYSTEM' ? 'border-blue-500 text-blue-400' : 'border-transparent text-text-secondary'}`}>
                    Sistema
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
                                            <p className="text-xs text-text-secondary">{user.email}</p>
                                            <p className="text-[10px] text-text-secondary font-mono bg-black/20 px-1 rounded inline-block mt-1">CPF: {user.cpf}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button 
                                            onClick={() => openApprovalModal(user)}
                                            className="px-3 py-1.5 bg-green-600 hover:bg-green-500 text-white rounded-lg text-xs font-bold"
                                        >
                                            Avaliar
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
                                            onClick={() => handleRejectUser(user.id)}
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

            {/* MODAL DE APROVAÇÃO */}
            <Modal isOpen={isApprovalModalOpen} onClose={() => setIsApprovalModalOpen(false)} title="Definir Função do Membro">
                <div className="space-y-6">
                    <div className="text-center">
                        <div className="w-20 h-20 mx-auto rounded-full overflow-hidden mb-3 border-2 border-white/10">
                            <LazyImage src={selectedUser?.avatarUrl} className="w-full h-full object-cover" />
                        </div>
                        <h3 className="text-xl font-bold text-white">{selectedUser?.name}</h3>
                        <p className="text-sm text-text-secondary">{selectedUser?.email}</p>
                        <p className="text-xs font-mono text-text-secondary mt-1">CPF: {selectedUser?.cpf}</p>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-text-secondary uppercase mb-2">Cargo no Time</label>
                        <div className="grid grid-cols-2 gap-2">
                            <button onClick={() => setAssignedRole('PLAYER')} className={`p-3 rounded-lg border text-sm font-bold transition-all ${assignedRole === 'PLAYER' ? 'bg-highlight border-highlight text-white' : 'bg-black/20 border-white/10 text-text-secondary'}`}>
                                🏃 Atleta
                            </button>
                            <button onClick={() => setAssignedRole('HEAD_COACH')} className={`p-3 rounded-lg border text-sm font-bold transition-all ${assignedRole === 'HEAD_COACH' ? 'bg-blue-600 border-blue-600 text-white' : 'bg-black/20 border-white/10 text-text-secondary'}`}>
                                📋 Coach
                            </button>
                            <button onClick={() => setAssignedRole('FINANCIAL_MANAGER')} className={`p-3 rounded-lg border text-sm font-bold transition-all ${assignedRole === 'FINANCIAL_MANAGER' ? 'bg-yellow-600 border-yellow-600 text-white' : 'bg-black/20 border-white/10 text-text-secondary'}`}>
                                💰 Financeiro
                            </button>
                            <button onClick={() => setAssignedRole('MARKETING_MANAGER')} className={`p-3 rounded-lg border text-sm font-bold transition-all ${assignedRole === 'MARKETING_MANAGER' ? 'bg-pink-600 border-pink-600 text-white' : 'bg-black/20 border-white/10 text-text-secondary'}`}>
                                📢 Marketing
                            </button>
                        </div>
                    </div>

                    <div className="flex gap-3 pt-4 border-t border-white/10">
                        <button onClick={() => { handleRejectUser(selectedUser!.id); setIsApprovalModalOpen(false); }} className="flex-1 bg-red-600/20 hover:bg-red-600 text-red-300 hover:text-white py-3 rounded-lg font-bold transition-colors">
                            Rejeitar
                        </button>
                        <button onClick={handleConfirmApproval} className="flex-1 bg-green-600 hover:bg-green-500 text-white py-3 rounded-lg font-bold shadow-lg transition-colors">
                            Confirmar & Aprovar
                        </button>
                    </div>
                </div>
            </Modal>

            {/* RESTO DO CÓDIGO DO PAINEL (INSPECTOR, ETC) MANTIDO IGUAL AO ANTERIOR */}
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

            {activeTab === 'INSPECTOR' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
                    <div className="bg-secondary p-4 rounded-xl border border-white/5 overflow-y-auto custom-scrollbar">
                        <h4 className="text-xs font-bold text-purple-400 uppercase mb-4 flex items-center gap-2">
                            <ScanIcon className="w-4 h-4"/> Entidades (DB Local)
                        </h4>
                        <div className="space-y-2">
                            {[
                                { k: 'gridiron_players', label: 'Jogadores' },
                                { k: 'gridiron_games', label: 'Jogos' },
                                { k: 'gridiron_users_list', label: 'Usuários (Auth)' },
                                { k: 'gridiron_settings', label: 'Configurações' },
                            ].map(ent => (
                                <button 
                                    key={ent.k}
                                    onClick={() => loadEntityData(ent.k)}
                                    className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${inspectedEntity === ent.k ? 'bg-purple-600 text-white font-bold' : 'text-text-secondary hover:bg-white/5 hover:text-white'}`}
                                >
                                    {ent.label}
                                    <span className="float-right text-[10px] opacity-50 font-mono">{ent.k}</span>
                                </button>
                            ))}
                        </div>
                    </div>
                    
                    <div className="lg:col-span-2 bg-[#0d1117] rounded-xl border border-white/10 p-4 flex flex-col">
                        <div className="flex justify-between items-center mb-2">
                            <h4 className="text-xs font-bold text-text-secondary uppercase">Dados Brutos (JSON)</h4>
                            <button className="text-xs text-blue-400 hover:text-white flex items-center gap-1" onClick={() => navigator.clipboard.writeText(entityData)}>
                                <ClipboardIcon className="w-3 h-3" /> Copiar JSON
                            </button>
                        </div>
                        <textarea 
                            className="flex-1 w-full bg-transparent text-green-400 font-mono text-xs resize-none focus:outline-none"
                            value={entityData || '// Selecione uma entidade para inspecionar'}
                            readOnly
                        />
                    </div>
                </div>
            )}

            {activeTab === 'SYSTEM' && (
                <div className="space-y-6">
                    <Card title="Operações de Banco de Dados">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-gradient-to-br from-green-900/30 to-black p-6 rounded-xl border border-green-500/30">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="p-2 bg-green-500/20 rounded-lg">
                                        <SparklesIcon className="w-6 h-6 text-green-400" />
                                    </div>
                                    <h4 className="font-bold text-white">Popular Dados de Demo (Seed)</h4>
                                </div>
                                <button 
                                    onClick={handleSeedData} 
                                    disabled={isSeeding}
                                    className="w-full bg-green-600 hover:bg-green-500 text-white px-4 py-3 rounded-lg font-bold shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
                                >
                                    {isSeeding ? 'Criando Dados...' : 'Executar Setup Inicial'}
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