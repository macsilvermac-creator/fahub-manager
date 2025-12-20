
import React, { useState, useEffect, useContext } from 'react';
import Card from '../components/Card';
import { Objective, KeyResult, UserRole } from '../types';
import { storageService } from '../services/storageService';
import { CheckCircleIcon, AlertTriangleIcon, TrendingUpIcon, PenIcon } from '../components/icons/UiIcons';
import { TargetIcon } from '../components/icons/NavIcons';
import { UserContext } from '../components/Layout';
import Modal from '../components/Modal';
import { useToast } from '../contexts/ToastContext';

const Goals: React.FC = () => {
    const { currentRole } = useContext(UserContext) as any;
    const toast = useToast();
    const [objectives, setObjectives] = useState<Objective[]>([]);
    
    // Permission: Only Master can CREATE Objectives. Managers can UPDATE Key Results.
    const canCreate = currentRole === 'MASTER';
    const canUpdate = currentRole === 'MASTER' || currentRole === 'FINANCIAL_MANAGER' || (currentRole as string) === 'MARKETING_MANAGER' || currentRole === 'HEAD_COACH';

    // Modal State
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
    
    // New Objective Form
    const [newTitle, setNewTitle] = useState('');
    const [newCategory, setNewCategory] = useState<'SPORTING' | 'FINANCIAL' | 'MARKETING'>('SPORTING');
    const [newKRTitle, setNewKRTitle] = useState('');
    const [newKRTarget, setNewKRTarget] = useState('');

    // Update Form
    const [selectedKR, setSelectedKR] = useState<{objId: string, krId: string, current: number, target: number, title: string} | null>(null);
    const [updateValue, setUpdateValue] = useState('');

    useEffect(() => {
        setObjectives(storageService.getObjectives());
    }, []);

    const handleCreateObjective = (e: React.FormEvent) => {
        e.preventDefault();
        const newObj: Objective = {
            id: `obj-${Date.now()}`,
            title: newTitle,
            category: newCategory,
            status: 'ON_TRACK',
            progress: 0,
            deadline: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
            ownerRole: 'MASTER',
            keyResults: [{
                id: `kr-${Date.now()}`,
                title: newKRTitle,
                currentValue: 0,
                targetValue: Number(newKRTarget),
                unit: '#',
                lastUpdated: new Date()
            }]
        };
        const updated = [...objectives, newObj];
        setObjectives(updated);
        storageService.saveObjectives(updated);
        setIsAddModalOpen(false);
        setNewTitle('');
        setNewKRTitle('');
        toast.success("Objetivo estratégico definido!");
    };

    const handleUpdateKR = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedKR) return;

        const updated = objectives.map(obj => {
            if (obj.id === selectedKR.objId && obj.keyResults) {
                const updatedKRs = obj.keyResults.map(kr => {
                    if (kr.id === selectedKR.krId) {
                        return { ...kr, currentValue: Number(updateValue), lastUpdated: new Date() };
                    }
                    return kr;
                });
                
                const totalProgress = updatedKRs.reduce((acc, kr) => acc + (kr.currentValue / kr.targetValue), 0) / updatedKRs.length;
                const status = totalProgress >= 1 ? 'COMPLETED' : totalProgress < 0.5 ? 'BEHIND' : 'ON_TRACK';
                
                return { ...obj, keyResults: updatedKRs, progress: Math.min(100, totalProgress * 100), status: status as any };
            }
            return obj;
        });

        setObjectives(updated);
        storageService.saveObjectives(updated);
        setIsUpdateModalOpen(false);
        toast.success("Progresso atualizado!");
    };

    const getStatusColor = (status: string) => {
        if (status === 'COMPLETED') return 'text-green-400 bg-green-500/10';
        if (status === 'ON_TRACK') return 'text-blue-400 bg-blue-500/10';
        if (status === 'BEHIND') return 'text-yellow-400 bg-yellow-500/10';
        return 'text-red-400 bg-red-500/10';
    };

    return (
        <div className="space-y-6 pb-12 animate-fade-in">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-secondary rounded-xl">
                        <TargetIcon className="text-highlight w-8 h-8" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold text-text-primary">Estratégia & OKRs</h2>
                        <p className="text-text-secondary">Metas Corporativas e Esportivas (2025).</p>
                    </div>
                </div>
                {canCreate && (
                    <button onClick={() => setIsAddModalOpen(true)} className="bg-highlight hover:bg-highlight-hover text-white px-6 py-2 rounded-xl font-bold shadow-lg">
                        + Novo Objetivo
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {objectives.length === 0 && <div className="col-span-full text-center py-20 text-text-secondary italic border-2 border-dashed border-white/10 rounded-xl">Nenhum objetivo definido. O Presidente deve criar a estratégia.</div>}
                
                {objectives.map(obj => (
                    <div key={obj.id} className="bg-secondary p-5 rounded-xl border border-white/5 hover:border-highlight/30 transition-all flex flex-col h-full">
                        <div className="flex justify-between items-start mb-4">
                            <span className={`text-xs font-bold px-2 py-1 rounded uppercase ${getStatusColor(obj.status)}`}>{obj.status}</span>
                            <span className="text-[10px] text-text-secondary bg-white/5 px-2 py-1 rounded">{obj.category}</span>
                        </div>
                        <h3 className="text-xl font-bold text-white mb-2">{obj.title}</h3>
                        <div className="w-full bg-black/30 h-2 rounded-full mb-4">
                            <div className="h-full bg-highlight rounded-full transition-all duration-1000" style={{width: `${obj.progress}%`}}></div>
                        </div>
                        
                        <div className="flex-1 space-y-3">
                            <p className="text-xs font-bold text-text-secondary uppercase">Resultados Chave (KRs)</p>
                            {obj.keyResults?.map(kr => (
                                <div key={kr.id} className="bg-black/20 p-3 rounded-lg flex justify-between items-center group">
                                    <div>
                                        <p className="text-sm text-white font-medium">{kr.title}</p>
                                        <p className="text-xs text-text-secondary">
                                            {kr.currentValue} / {kr.targetValue} <span className="opacity-50">({Math.round((kr.currentValue/kr.targetValue)*100)}%)</span>
                                        </p>
                                    </div>
                                    {canUpdate && (
                                        <button 
                                            onClick={() => {
                                                setSelectedKR({ objId: obj.id, krId: kr.id, current: kr.currentValue, target: kr.targetValue, title: kr.title });
                                                setUpdateValue(String(kr.currentValue));
                                                setIsUpdateModalOpen(true);
                                            }}
                                            className="text-text-secondary hover:text-highlight opacity-0 group-hover:opacity-100 transition-opacity"
                                        >
                                            <PenIcon className="w-4 h-4" />
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            {/* CREATE MODAL */}
            <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Definir Objetivo Estratégico">
                <form onSubmit={handleCreateObjective} className="space-y-4">
                    <div>
                        <label className="text-xs font-bold text-text-secondary">Objetivo (O)</label>
                        <input className="w-full bg-black/20 border border-white/10 rounded p-2 text-white" value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="Ex: Subir para Primeira Divisão" required />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-text-secondary">Departamento</label>
                        <select className="w-full bg-black/20 border border-white/10 rounded p-2 text-white" value={newCategory} onChange={e => setNewCategory(e.target.value as any)}>
                            <option value="SPORTING">Esportivo</option>
                            <option value="FINANCIAL">Financeiro</option>
                            <option value="MARKETING">Marketing</option>
                        </select>
                    </div>
                    <div className="p-4 bg-white/5 rounded border border-white/10">
                        <p className="text-xs font-bold text-highlight mb-2">Resultado Chave Inicial (KR)</p>
                        <input className="w-full bg-black/20 border border-white/10 rounded p-2 text-white mb-2" value={newKRTitle} onChange={e => setNewKRTitle(e.target.value)} placeholder="Ex: Vencer 8 jogos" required />
                        <input type="number" className="w-full bg-black/20 border border-white/10 rounded p-2 text-white" value={newKRTarget} onChange={e => setNewKRTarget(e.target.value)} placeholder="Meta Numérica (Ex: 8)" required />
                    </div>
                    <button type="submit" className="w-full bg-green-600 text-white font-bold py-2 rounded mt-2">Lançar Meta</button>
                </form>
            </Modal>

            {/* UPDATE MODAL */}
            <Modal isOpen={isUpdateModalOpen} onClose={() => setIsUpdateModalOpen(false)} title="Atualizar Progresso">
                <div className="space-y-4">
                    <p className="text-sm text-text-secondary">Atualizando: <strong className="text-white">{selectedKR?.title}</strong></p>
                    <div className="flex items-center gap-2">
                        <input type="number" className="flex-1 bg-black/20 border border-white/10 rounded p-2 text-white text-center text-lg font-bold" value={updateValue} onChange={e => setUpdateValue(e.target.value)} />
                        <span className="text-text-secondary">/ {selectedKR?.target}</span>
                    </div>
                    <button onClick={handleUpdateKR} className="w-full bg-blue-600 text-white font-bold py-2 rounded">Salvar Progresso</button>
                </div>
            </Modal>
        </div>
    );
};

export default Goals;
