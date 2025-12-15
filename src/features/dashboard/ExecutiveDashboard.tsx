
import React from 'react';
// @ts-ignore
import { useNavigate } from 'react-router-dom';
import Card from '../../components/Card';
import { ShareIcon, BankIcon, UsersIcon, AlertTriangleIcon } from '../../components/icons/UiIcons';
import { TrophyIcon, WhistleIcon } from '../../components/icons/NavIcons';

interface ExecutiveDashboardProps {
    handleCopyInvite: () => void;
}

const ExecutiveDashboard: React.FC<ExecutiveDashboardProps> = ({ handleCopyInvite }) => {
    const navigate = useNavigate();

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-4">
                <div>
                    <h2 className="text-2xl font-bold text-white">Visão Executiva (Master)</h2>
                    <p className="text-text-secondary text-sm">Controle total da organização.</p>
                </div>
                <button 
                    onClick={handleCopyInvite}
                    className="bg-green-600 hover:bg-green-500 text-white px-6 py-3 rounded-xl font-bold shadow-lg flex items-center gap-2 hover:scale-105 transition-transform animate-pulse"
                >
                    <ShareIcon className="w-5 h-5" />
                    Copiar Convite WhatsApp
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-secondary p-6 rounded-xl border border-white/5 hover:border-highlight/50 transition-all cursor-pointer" onClick={() => navigate('/finance')}>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-white">Saúde Financeira</h3>
                        <BankIcon className="w-6 h-6 text-green-400" />
                    </div>
                    <div className="text-2xl font-bold text-white mb-1">R$ 125.000</div>
                    <p className="text-xs text-text-secondary">Fluxo de Caixa Projetado</p>
                </div>
                <div className="bg-secondary p-6 rounded-xl border border-white/5 hover:border-highlight/50 transition-all cursor-pointer" onClick={() => navigate('/staff')}>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-white">Recursos Humanos</h3>
                        <UsersIcon className="w-6 h-6 text-blue-400" />
                    </div>
                    <div className="text-2xl font-bold text-white mb-1">24 Staff</div>
                    <p className="text-xs text-text-secondary">4 Contratos Pendentes</p>
                </div>
                <div className="bg-secondary p-6 rounded-xl border border-white/5 hover:border-highlight/50 transition-all cursor-pointer" onClick={() => navigate('/league')}>
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="font-bold text-white">Federação</h3>
                        <TrophyIcon className="w-6 h-6 text-yellow-400" />
                    </div>
                    <div className="text-2xl font-bold text-white mb-1">Regular</div>
                    <p className="text-xs text-text-secondary">Status de Filiação</p>
                </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card title="Acesso aos Departamentos Operacionais">
                    <div className="grid grid-cols-2 gap-4">
                        <button onClick={() => navigate('/dashboard?role=COACH')} className="p-4 bg-black/20 rounded-lg border border-white/10 hover:bg-highlight/20 hover:border-highlight transition-all text-left">
                            <WhistleIcon className="w-8 h-8 text-highlight mb-2" />
                            <h4 className="font-bold text-white">Modo Treinador</h4>
                            <p className="text-xs text-text-secondary">Acesso a treinos, scout e playbook.</p>
                        </button>
                        <button onClick={() => navigate('/officiating')} className="p-4 bg-black/20 rounded-lg border border-white/10 hover:bg-red-500/20 hover:border-red-500 transition-all text-left">
                            <AlertTriangleIcon className="w-8 h-8 text-red-500 mb-2" />
                            <h4 className="font-bold text-white">Modo Arbitragem</h4>
                            <p className="text-xs text-text-secondary">Súmulas e relatórios de jogo.</p>
                        </button>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default ExecutiveDashboard;