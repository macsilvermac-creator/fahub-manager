import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import { authService } from '../services/authService';
import { storageService } from '../services/storageService';
import { User, UserRole, ProgramType } from '../types';
// Fix: Added CheckCircleIcon to the imported icons from UiIcons
import { ShieldCheckIcon, UsersIcon, ClipboardIcon, ActivityIcon, CheckCircleIcon } from '../components/icons/UiIcons';
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
            storageService.logAuditAction('USER_APPROVAL', `Usuário ${selectedUser.name} aprovado como ${assignedRole} [${assignedProgram}]`);
            setIsApprovalModalOpen(false);
            toast.success("Acesso configurado com sucesso.");
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
                    <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter">War Room: Governança</h2>
                    <p className="text-text-secondary text-sm font-medium">Controle de Segurança, Membros e Auditoria.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 space-y-6">
                    <Card title="Status do Ecossistema">
                        <div className="space-y-4">
                            <div className="flex justify-between items-center p-3 bg-black/20 rounded-xl">
                                <span className="text-xs text-text-secondary font-bold uppercase">Membros Totais</span>
                                <span className="text-white font-black">{users.length}</span>
                            </div>
                            <div className="flex justify-between items-center p-3 bg-black/20 rounded-xl">
                                <span className="text-xs text-text-secondary font-bold uppercase">Aguardando</span>
                                <span className="text-yellow-500 font-black">{pendingUsers.length}</span>
                            </div>
                            <div className="p-4 bg-highlight/10 rounded-xl border border-highlight/20 text-center">
                                <p className="text-[10px] text-highlight font-black uppercase">Database Integrity</p>
                                <p className="text-xs text-white mt-1">Sincronizado com Nuvem</p>
                            </div>
                        </div>
                    </Card>
                </div>

                <div className="lg:col-span-2">
                    <Card title={`Solicitações de Acesso (${pendingUsers.length})`}>
                        <div className="space-y-3">
                            {pendingUsers.map(user => (
                                <div key={user.id} className="bg-black/20 p-4 rounded-2xl border border-white/5 flex items-center justify-between group hover:border-highlight/30 transition-all">
                                    <div className="flex items-center gap-3">
                                        <LazyImage src={user.avatarUrl} className="w-10 h-10 rounded-full" />
                                        <div>
                                            <p className="font-bold text-white text-sm">{user.name}</p>
                                            <p className="text-[10px] text-text-secondary font-mono">CPF: {user.cpf}</p>
                                        </div>
                                    </div>
                                    <button onClick={() => openApprovalModal(user)} className="px-5 py-2 bg-highlight text-white rounded-xl text-xs font-black uppercase shadow-glow">Configurar</button>
                                </div>
                            ))}
                            {pendingUsers.length === 0 && (
                                <div className="text-center py-20 opacity-20 italic font-black uppercase">
                                    <CheckCircleIcon className="w-10 h-10 mx-auto mb-2" />
                                    Nenhuma pendência
                                </div>
                            )}
                        </div>
                    </Card>
                </div>
            </div>

            <Card title="Log de Eventos Críticos (Auditoria)">
                <div className="space-y-2 max-h-80 overflow-y-auto custom-scrollbar font-mono text-[10px]">
                    {storageService.getAuditLogs().map(log => (
                        <div key={log.id} className="border-b border-white/5 pb-2 flex gap-4">
                            <span className="text-highlight shrink-0">[{new Date(log.timestamp).toLocaleTimeString()}]</span> 
                            <span className="text-white font-bold shrink-0">{log.userName}:</span>
                            <span className="text-text-secondary">{log.details}</span>
                        </div>
                    ))}
                </div>
            </Card>

            <Modal isOpen={isApprovalModalOpen} onClose={() => setIsApprovalModalOpen(false)} title="Autorização de Membro">
                <div className="space-y-6">
                    <div>
                        <label className="block text-[10px] font-black text-text-secondary uppercase mb-2">Função Delegada</label>
                        <select className="w-full bg-black/40 border border-white/10 rounded-xl p-4 text-white font-bold outline-none focus:border-highlight" value={assignedRole} onChange={e => setAssignedRole(e.target.value as UserRole)}>
                            <optgroup label="Gestão">
                                <option value="PRESIDENT">Presidente</option>
                                <option value="VICE_PRESIDENT">Vice-Presidente</option>
                                <option value="FINANCIAL_DIRECTOR">Diretor Financeiro</option>
                                <option value="SPORTS_DIRECTOR">Diretor de Esportes</option>
                            </optgroup>
                            <optgroup label="Técnica">
                                <option value="HEAD_COACH">Head Coach</option>
                                <option value="OFFENSIVE_COORD">Coord. Ofensivo</option>
                                <option value="DEFENSIVE_COORD">Coord. Defensivo</option>
                            </optgroup>
                            <optgroup label="Atletas">
                                <option value="PLAYER">Atleta Profissional</option>
                                <option value="STUDENT">Aluno de Base</option>
                            </optgroup>
                        </select>
                    </div>

                    <div>
                        <label className="block text-[10px] font-black text-text-secondary uppercase mb-2">Pilar de Atuação (Modalidade)</label>
                        <div className="grid grid-cols-2 gap-2">
                            <button onClick={() => setAssignedProgram('TACKLE')} className={`p-4 rounded-xl border font-black text-xs transition-all ${assignedProgram === 'TACKLE' ? 'bg-blue-600 border-blue-500 text-white' : 'bg-black/20 border-white/5 text-text-secondary'}`}>TACKLE (11v11)</button>
                            <button onClick={() => setAssignedProgram('FLAG')} className={`p-4 rounded-xl border font-black text-xs transition-all ${assignedProgram === 'FLAG' ? 'bg-yellow-600 border-yellow-500 text-white' : 'bg-black/20 border-white/5 text-text-secondary'}`}>FLAG (5v5)</button>
                        </div>
                    </div>

                    <button onClick={handleConfirmApproval} className="w-full bg-highlight hover:bg-highlight-hover text-white font-black py-5 rounded-[2rem] uppercase italic tracking-tighter shadow-glow transition-all active:scale-95">
                        Liberar Acesso Vitalício
                    </button>
                </div>
            </Modal>
        </div>
    );
};

export default AdminPanel;