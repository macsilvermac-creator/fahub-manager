
import React, { useState, useEffect, useContext } from 'react';
import Card from '../components/Card';
import { OKR, UserRole } from '../types';
import { storageService } from '../services/storageService';
import { CheckCircleIcon, TrendingUpIcon, PenIcon, SparklesIcon, TargetIcon, ShieldCheckIcon } from '../components/icons/UiIcons';
import { UserContext, UserContextType } from '../components/Layout';
import Modal from '../components/Modal';
import { useToast } from '../contexts/ToastContext';

const Goals: React.FC = () => {
    const { currentRole } = useContext(UserContext) as UserContextType;
    const toast = useToast();
    const [okrs, setOkrs] = useState<OKR[]>([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    
    // Form state
    const [newTitle, setNewTitle] = useState('');
    const [newTarget, setNewTarget] = useState(100);

    useEffect(() => {
        setOkrs(storageService.getOKRs());
    }, []);

    const handleUpdateProgress = (id: string, delta: number) => {
        const updated = okrs.map(o => {
            if (o.id === id) {
                const newValue = Math.max(0, Math.min(o.targetValue, o.currentValue + delta));
                
                // Dispara sinal para o Presidente caso atinja um marco
                if (newValue === o.targetValue) {
                    storageService.sendSignal({
                        fromRole: currentRole,
                        fromName: "Coordenador",
                        type: 'MILESTONE_REACHED',
                        message: `Meta "${o.title}" foi atingida 100%!`
                    });
                    toast.success("Meta atingida! Sinal enviado ao Presidente.");
                }

                return { ...o, currentValue: newValue, status: newValue >= o.targetValue ? 'COMPLETED' : 'ON_TRACK' };
            }
            return o;
        });
        setOkrs(updated as any);
        storageService.saveOKRs(updated as any);
    };

    const isManager = ['PRESIDENT', 'MASTER', 'FINANCIAL_DIRECTOR', 'SPORTS_DIRECTOR'].includes(currentRole);

    return (
        <div className="space-y-6 animate-fade-in pb-20">
            <div className="flex justify-between items-center px-2">
                <div>
                    <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter">FAHUB OKRs</h2>
                    <p className="text-highlight text-[10px] font-bold uppercase tracking-widest">Motor de Governança por Resultados</p>
                </div>
                {isManager && (
                    <button onClick={() => setIsAddModalOpen(true)} className="bg-highlight hover:bg-highlight-hover text-white px-6 py-2.5 rounded-xl font-black uppercase text-xs shadow-glow transition-all">
                        + Nova Meta Macro
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {okrs.map(okr => (
                    <div key={okr.id} className="bg-secondary p-6 rounded-3xl border border-white/5 hover:border-highlight/30 transition-all flex flex-col h-full relative group">
                        <div className="flex justify-between items-start mb-4">
                            <span className={`text-[9px] font-black px-2 py-1 rounded-full border ${okr.category === 'FINANCE' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-blue-500/10 text-blue-400 border-blue-500/20'}`}>
                                {okr.category}
                            </span>
                            <div className="flex gap-1">
                                {okr.parentOkrId && <ShieldCheckIcon className="w-3 h-3 text-highlight" title="Vinculada à Presidência" />}
                                <span className="text-[10px] font-black text-text-secondary uppercase">{okr.status}</span>
                            </div>
                        </div>

                        <h3 className="text-xl font-bold text-white mb-2 leading-tight uppercase italic">{okr.title}</h3>
                        <p className="text-xs text-text-secondary mb-6 flex-1">{okr.description}</p>
                        
                        <div className="space-y-2 mt-auto pt-4 border-t border-white/5">
                            <div className="flex justify-between items-end">
                                <span className="text-2xl font-black text-white">{okr.currentValue}<span className="text-xs text-text-secondary font-normal ml-1">{okr.unit}</span></span>
                                <span className="text-xs font-bold text-text-secondary opacity-50">Alvo: {okr.targetValue}{okr.unit}</span>
                            </div>
                            <div className="h-1.5 w-full bg-black/40 rounded-full overflow-hidden">
                                <div className="h-full bg-highlight shadow-glow" style={{ width: `${(okr.currentValue/okr.targetValue)*100}%` }}></div>
                            </div>
                            
                            {!isManager && (
                                <div className="flex gap-2 pt-4">
                                    <button onClick={() => handleUpdateProgress(okr.id, -5)} className="flex-1 py-2 bg-white/5 hover:bg-white/10 rounded-lg text-[10px] font-black text-text-secondary">- 5%</button>
                                    <button onClick={() => handleUpdateProgress(okr.id, 5)} className="flex-[2] py-2 bg-highlight/20 hover:bg-highlight text-highlight hover:text-white rounded-lg text-[10px] font-black transition-all">+ ATUALIZAR STATUS</button>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Lançar Meta Estratégica">
                <div className="space-y-4">
                    <div>
                        <label className="text-[10px] font-black text-text-secondary uppercase mb-1 block">Objetivo</label>
                        <input className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white" value={newTitle} onChange={e => setNewTitle(e.target.value)} />
                    </div>
                    <div>
                        <label className="text-[10px] font-black text-text-secondary uppercase mb-1 block">Responsável</label>
                        <select className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-white">
                            <option value="FINANCE">Diretoria Financeira</option>
                            <option value="MARKETING">Diretoria de Marketing</option>
                            <option value="SPORTS">Diretoria de Esportes</option>
                            <option value="TECHNICAL">Head Coach</option>
                        </select>
                    </div>
                    <button className="w-full bg-highlight text-white font-black py-4 rounded-2xl shadow-glow uppercase text-xs mt-4">Delegar Meta</button>
                </div>
            </Modal>
        </div>
    );
};

export default Goals;
