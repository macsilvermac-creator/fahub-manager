
import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import { authService } from '../services/authService';
import { storageService } from '../services/storageService';
import { User, UserRole, ProgramType } from '../types';
import { ShieldCheckIcon, UsersIcon, WhistleIcon, ClipboardIcon, SparklesIcon, TrashIcon } from '../components/icons/UiIcons';
import LazyImage from '../components/LazyImage';
import Modal from '../components/Modal';
import { useToast } from '../contexts/ToastContext';

const AdminPanel: React.FC = () => {
    const toast = useToast();
    const [users, setUsers] = useState<User[]>([]);
    const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [assignedRole, setAssignedRole] = useState<UserRole>('PLAYER');
    const [assignedProgram, setAssignedProgram] = useState<ProgramType>('BOTH');

    useEffect(() => {
        setUsers(authService.getUsers());
    }, []);

    const openApprovalModal = (user: User) => {
        setSelectedUser(user);
        setAssignedRole(user.role || 'PLAYER');
        setAssignedProgram(user.program || 'BOTH');
        setIsApprovalModalOpen(true);
    };

    const handleConfirmApproval = () => {
        if (selectedUser) {
            authService.updateUserStatus(selectedUser.id, 'APPROVED', assignedRole, assignedProgram);
            setUsers(authService.getUsers());
            storageService.logAuditAction('USER_MGMT', `Aprovado: ${selectedUser.name} como ${assignedRole} [MODALIDADE: ${assignedProgram}]`);
            setIsApprovalModalOpen(false);
            toast.success("Acesso configurado e liberado!");
        }
    };

    const handlePersonaMatrix = (role: UserRole) => {
        const current = storageService.getCurrentUser();
        if (current) {
            const updated = { ...current, role };
            storageService.setCurrentUser(updated);
            storageService.logAuditAction('PERSONA_SWITCH', `Simulação para ${role}`);
            window.location.reload();
        }
    };

    const pendingUsers = users.filter(u => u.status === 'PENDING');

    return (
        <div className="space-y-6 animate-fade-in pb-12">
            <div className="flex items-center gap-3">
                <div className="p-3 bg-red-600 rounded-xl shadow-lg">
                    <ShieldCheckIcon className="w-8 h-8 text-white" />
                </div>
                <div>
                    <h2 className="text-3xl font-bold text-white uppercase italic tracking-tighter">War Room: Governança</h2>
                    <p className="text-text-secondary text-sm">Controle de Membros e Permissões de Modalidade.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card title="Simulador de Personas (Testes)">
                    <div className="grid grid-cols-2 gap-3">
                        <button onClick={() => handlePersonaMatrix('MASTER')} className="p-4 bg-red-600 text-white rounded-xl font-black uppercase text-[10px] flex items-center justify-center gap-2">MASTER</button>
                        <button onClick={() => handlePersonaMatrix('HEAD_COACH')} className="p-4 bg-blue-600 text-white rounded-xl font-black uppercase text-[10px] flex items-center justify-center gap-2">COACH</button>
                    </div>
                </Card>

                <Card title={`Aguardando Liberação (${pendingUsers.length})`}>
                    <div className="space-y-3 max-h-80 overflow-y-auto custom-scrollbar">
                        {pendingUsers.map(user => (
                            <div key={user.id} className="bg-black/20 p-4 rounded-2xl border border-white/5 flex items-center justify-between group">
                                <div className="flex items-center gap-3">
                                    <LazyImage src={user.avatarUrl} className="w-10 h-10 rounded-full" />
                                    <div>
                                        <p className="font-bold text-white text-sm">{user.name}</p>
                                        <p className="text-[10px] text-text-secondary font-mono">CADASTRO EM ANÁLISE</p>
                                    </div>
                                </div>
                                <button onClick={() => openApprovalModal(user)} className="px-5 py-2 bg-highlight text-white rounded-xl text-xs font-black uppercase shadow-glow">Liberar</button>
                            </div>
                        ))}
                        {pendingUsers.length === 0 && <p className="text-center py-10 text-text-secondary italic">Nenhum novo pedido de acesso.</p>}
                    </div>
                </Card>
            </div>

            <Modal isOpen={isApprovalModalOpen} onClose={() => setIsApprovalModalOpen(false)} title="Atribuição de Função e Modalidade">
                <div className="space-y-6">
                    <div className="p-4 bg-highlight/10 rounded-2xl border border-highlight/20">
                        <p className="text-highlight font-bold text-sm">Usuário: {selectedUser?.name}</p>
                        <p className="text-text-secondary text-xs">{selectedUser?.email}</p>
                    </div>

                    <div>
                        <label className="block text-xs font-black text-text-secondary uppercase mb-2">1. Cargo Hierárquico</label>
                        <select className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white font-bold" value={assignedRole} onChange={e => setAssignedRole(e.target.value as UserRole)}>
                            <option value="PLAYER">Atleta</option>
                            <option value="HEAD_COACH">Head Coach</option>
                            <option value="OFFENSIVE_COORD">Coord. Ofensivo</option>
                            <option value="DEFENSIVE_COORD">Coord. Defensivo</option>
                            <option value="FINANCIAL_MANAGER">Diretor Financeiro</option>
                            <option value="MARKETING_MANAGER">Diretor de Marketing</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-xs font-black text-text-secondary uppercase mb-2">2. Contexto de Atuação (Modalidade)</label>
                        <div className="grid grid-cols-3 gap-2">
                            <button onClick={() => setAssignedProgram('TACKLE')} className={`p-3 rounded-xl border font-black text-[10px] transition-all ${assignedProgram === 'TACKLE' ? 'bg-blue-600 border-blue-500 text-white shadow-lg' : 'bg-black/20 border-white/5 text-text-secondary'}`}>TACKLE (11v11)</button>
                            <button onClick={() => setAssignedProgram('FLAG')} className={`p-3 rounded-xl border font-black text-[10px] transition-all ${assignedProgram === 'FLAG' ? 'bg-yellow-600 border-yellow-500 text-white shadow-lg' : 'bg-black/20 border-white/5 text-text-secondary'}`}>FLAG (5v5)</button>
                            <button onClick={() => setAssignedProgram('BOTH')} className={`p-3 rounded-xl border font-black text-[10px] transition-all ${assignedProgram === 'BOTH' ? 'bg-highlight border-highlight text-white shadow-lg' : 'bg-black/20 border-white/5 text-text-secondary'}`}>AMBOS / MASTER</button>
                        </div>
                    </div>

                    <button onClick={handleConfirmApproval} className="w-full bg-highlight hover:bg-highlight-hover text-white font-black py-5 rounded-[2rem] uppercase italic tracking-tighter shadow-glow transition-all active:scale-95 mt-4">
                        Confirmar e Notificar Atleta/Coach
                    </button>
                </div>
            </Modal>

            <Card title="Logs de Auditoria de Acesso">
                <div className="space-y-2 max-h-64 overflow-y-auto custom-scrollbar font-mono text-[10px]">
                    {storageService.getAuditLogs().map(log => (
                        <div key={log.id} className="border-b border-white/5 pb-2">
                            <span className="text-highlight">[{new Date(log.timestamp).toLocaleTimeString()}]</span> 
                            <span className="text-white ml-2">{log.userName}</span>: {log.details}
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    );
};

export default AdminPanel;
