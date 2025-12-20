
import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import { authService } from '../services/authService';
import { storageService } from '../services/storageService';
import { User, UserRole } from '../types';
import { ShieldCheckIcon, UsersIcon, WhistleIcon, ClipboardIcon } from '../components/icons/UiIcons';

const AdminPanel: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    
    useEffect(() => {
        setUsers(authService.getUsers());
    }, []);

    const handlePersonaMatrix = (role: UserRole) => {
        const current = storageService.getCurrentUser();
        if (current) {
            const updated = { ...current, role };
            storageService.setCurrentUser(updated);
            storageService.logAction('PERSONA_SWITCH', `Admin mudou visualização para ${role}`, current);
            window.location.reload(); // Recarrega com o novo contexto de permissões
        }
    };

    return (
        <div className="space-y-6 animate-fade-in pb-12">
            <div className="flex items-center gap-3">
                <div className="p-3 bg-red-600 rounded-xl shadow-lg">
                    <ShieldCheckIcon className="w-8 h-8 text-white" />
                </div>
                <div>
                    <h2 className="text-3xl font-bold text-white">The War Room</h2>
                    <p className="text-text-secondary text-sm">God Mode & Monitoramento Global</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card title="Persona Matrix (God Mode)">
                    <p className="text-xs text-text-secondary mb-4 italic">Troque de identidade instantaneamente para testar fluxos de permissão.</p>
                    <div className="grid grid-cols-2 gap-3">
                        <button onClick={() => handlePersonaMatrix('MASTER')} className="p-4 bg-red-600 text-white rounded-xl font-black uppercase text-[10px] flex items-center justify-center gap-2">
                            <ShieldCheckIcon className="w-4 h-4"/> MASTER (CEO)
                        </button>
                        <button onClick={() => handlePersonaMatrix('HEAD_COACH')} className="p-4 bg-blue-600 text-white rounded-xl font-black uppercase text-[10px] flex items-center justify-center gap-2">
                            <WhistleIcon className="w-4 h-4"/> COACH
                        </button>
                        <button onClick={() => handlePersonaMatrix('PLAYER')} className="p-4 bg-orange-600 text-white rounded-xl font-black uppercase text-[10px] flex items-center justify-center gap-2">
                            <UsersIcon className="w-4 h-4"/> ATLETA
                        </button>
                        <button onClick={() => handlePersonaMatrix('FINANCIAL_MANAGER')} className="p-4 bg-green-600 text-white rounded-xl font-black uppercase text-[10px] flex items-center justify-center gap-2">
                             CFO / FINANCEIRO
                        </button>
                    </div>
                </Card>

                <Card title="Atividade do Sistema (Real-time)">
                    <div className="space-y-2 max-h-64 overflow-y-auto custom-scrollbar">
                        {storageService.getAuditLogs().map(log => (
                            <div key={log.id} className="text-[10px] border-b border-white/5 pb-2 font-mono">
                                <span className="text-highlight">[{new Date(log.timestamp).toLocaleTimeString()}]</span> 
                                <span className="text-white ml-2">{log.userName}</span>: {log.details}
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default AdminPanel;
