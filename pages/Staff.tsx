
import React, { useState, useEffect, useContext } from 'react';
import Card from '../components/Card';
import { StaffMember } from '../types';
import { storageService } from '../services/storageService';
import { UsersIcon, FileTextIcon, BankIcon, AlertTriangleIcon } from '../components/icons/UiIcons';
import { UserContext } from '../components/Layout';

const Staff: React.FC = () => {
    const { currentRole } = useContext(UserContext);
    const [staff, setStaff] = useState<StaffMember[]>([]);
    const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'PAYROLL'>('OVERVIEW');

    useEffect(() => {
        /* Fix: Cast contract.type to literal */
        const loadedStaff = storageService.getStaff().map(s => ({
            ...s,
            contract: {
                ...s.contract,
                type: s.contract.type as "PAID" | "VOLUNTEER"
            }
        }));
        setStaff(loadedStaff);
    }, []);

    // Permission Check: Only Master/CFO can see money
    const canViewFinance = currentRole === 'MASTER' || currentRole === 'FINANCIAL_MANAGER';

    const totalMonthlyPayroll = staff.filter(s => s.contract.active && s.contract.type !== 'VOLUNTEER').reduce((acc, s) => acc + s.contract.value, 0);
    const pendingDocsCount = staff.filter(s => s.documentsPending).length;

    return (
        <div className="space-y-6 pb-12 animate-fade-in">
            <div className="flex items-center gap-3">
                <div className="p-3 bg-secondary rounded-xl">
                    <UsersIcon className="text-highlight w-8 h-8" />
                </div>
                <div>
                    <h2 className="text-3xl font-bold text-text-primary">Gestão de Staff & RH</h2>
                    <p className="text-text-secondary">Comissão Técnica e Apoio.</p>
                </div>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {canViewFinance && (
                    <Card className="bg-gradient-to-br from-purple-900/40 to-secondary border-l-4 border-l-purple-500">
                        <div className="flex items-center">
                            <div className="p-3 bg-purple-500/20 rounded-lg text-purple-400">
                                <BankIcon className="h-8 w-8" />
                            </div>
                            <div className="ml-4">
                                <p className="text-xs text-text-secondary font-bold uppercase">Folha Mensal</p>
                                <p className="text-2xl font-bold text-white">R$ {totalMonthlyPayroll.toFixed(2)}</p>
                            </div>
                        </div>
                    </Card>
                )}
                <Card className="bg-gradient-to-br from-orange-900/40 to-secondary border-l-4 border-l-orange-500">
                    <div className="flex items-center">
                        <div className="p-3 bg-orange-500/20 rounded-lg text-orange-400">
                             <AlertTriangleIcon className="h-8 w-8" />
                        </div>
                        <div className="ml-4">
                            <p className="text-xs text-text-secondary font-bold uppercase">Pendências (Docs)</p>
                            <p className="text-2xl font-bold text-white">{pendingDocsCount} <span className="text-sm font-normal text-text-secondary">Pessoas</span></p>
                        </div>
                    </div>
                </Card>
                <Card className="bg-gradient-to-br from-blue-900/40 to-secondary border-l-4 border-l-blue-500">
                    <div className="flex items-center">
                        <div className="p-3 bg-blue-500/20 rounded-lg text-blue-400">
                             <UsersIcon className="h-8 w-8" />
                        </div>
                        <div className="ml-4">
                            <p className="text-xs text-text-secondary font-bold uppercase">Total Staff</p>
                            <p className="text-2xl font-bold text-white">{staff.length}</p>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-white/10">
                <button 
                    onClick={() => setActiveTab('OVERVIEW')}
                    className={`px-6 py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'OVERVIEW' ? 'border-highlight text-highlight' : 'border-transparent text-text-secondary hover:text-white'}`}
                >
                    Visão Geral
                </button>
                {canViewFinance && (
                    <button 
                        onClick={() => setActiveTab('PAYROLL')}
                        className={`px-6 py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'PAYROLL' ? 'border-green-500 text-green-400' : 'border-transparent text-text-secondary hover:text-white'}`}
                    >
                        Folha de Pagamento
                    </button>
                )}
            </div>

            {activeTab === 'OVERVIEW' && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {staff.map(member => (
                        <div key={member.id} className="bg-secondary rounded-xl border border-white/5 p-5 hover:border-highlight/30 transition-all">
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <h3 className="font-bold text-white text-lg">{member.name}</h3>
                                    <span className="text-xs bg-white/10 px-2 py-0.5 rounded text-text-secondary font-bold uppercase">{member.role}</span>
                                </div>
                                {member.documentsPending && (
                                    <span className="text-orange-400" title="Documentação Pendente"><AlertTriangleIcon className="w-5 h-5" /></span>
                                )}
                            </div>
                            
                            <div className="space-y-2 text-sm text-text-secondary mb-4">
                                <p>📧 {member.email}</p>
                                <p>📞 {member.phone}</p>
                                <p className="flex items-center gap-2">
                                    <FileTextIcon className="w-4 h-4" /> 
                                    {member.contract.signed ? <span className="text-green-400">Contrato Ativo</span> : <span className="text-red-400">Contrato Pendente</span>}
                                </p>
                            </div>

                            <div className="pt-4 border-t border-white/5 flex gap-2">
                                <button className="flex-1 bg-white/5 hover:bg-white/10 py-2 rounded text-xs text-white">Editar Perfil</button>
                                {canViewFinance && <button className="flex-1 bg-white/5 hover:bg-white/10 py-2 rounded text-xs text-white">Ver Contrato</button>}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {activeTab === 'PAYROLL' && canViewFinance && (
                <Card title="Processamento de Pagamentos">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-text-secondary">
                            <thead className="text-xs text-text-secondary uppercase bg-black/20 border-b border-white/5">
                                <tr>
                                    <th className="px-4 py-3">Nome</th>
                                    <th className="px-4 py-3">Cargo</th>
                                    <th className="px-4 py-3">Tipo</th>
                                    <th className="px-4 py-3">Valor Mensal</th>
                                    <th className="px-4 py-3">Status (Mês Atual)</th>
                                    <th className="px-4 py-3 text-right">Ação</th>
                                </tr>
                            </thead>
                            <tbody>
                                {staff.map(member => (
                                    <tr key={member.id} className="border-b border-white/5 hover:bg-white/5">
                                        <td className="px-4 py-3 font-bold text-white">{member.name}</td>
                                        <td className="px-4 py-3 text-xs">{member.role}</td>
                                        <td className="px-4 py-3">
                                            <span className={`text-[10px] px-2 py-0.5 rounded font-bold uppercase ${member.contract.type === 'VOLUNTEER' ? 'bg-blue-500/20 text-blue-400' : 'bg-green-500/20 text-green-400'}`}>
                                                {member.contract.type}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-white font-mono">
                                            {member.contract.type === 'VOLUNTEER' ? '-' : `R$ ${member.contract.value.toFixed(2)}`}
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="text-yellow-400 text-xs font-bold">Pendente</span>
                                        </td>
                                        <td className="px-4 py-3 text-right">
                                            {member.contract.type !== 'VOLUNTEER' && (
                                                <button className="text-xs bg-green-600 hover:bg-green-500 text-white px-3 py-1.5 rounded font-bold">
                                                    Pagar
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            )}
        </div>
    );
};

export default Staff;