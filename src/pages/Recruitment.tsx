
import React, { useState, useEffect, useContext } from 'react';
import Card from '../components/Card';
import { RecruitmentCandidate, CombineStats } from '../types';
import { storageService } from '../services/storageService';
// Fix: Corrected analyzeCombineStats import
import { analyzeCombineStats } from '../services/geminiService';
import { UserPlusIcon, SearchIcon, FilterIcon, CheckCircleIcon, XIcon, ClockIcon, ClipboardIcon, SparklesIcon, TrashIcon, LockIcon } from '../components/icons/UiIcons';
import Modal from '../components/Modal';
import { useToast } from '../contexts/ToastContext';
import { UserContext } from '../components/Layout';
import LazyImage from '../components/LazyImage';

const STATUS_COLUMNS = [
    { id: 'NEW', label: 'Inscritos (Novos)', color: 'border-blue-500' },
    { id: 'TRYOUT', label: 'Tryout (Avaliação)', color: 'border-yellow-500' },
    { id: 'SELECTED', label: 'Selecionados', color: 'border-green-500' },
    { id: 'ONBOARDING', label: 'Em Onboarding', color: 'border-purple-500' }
];

const Recruitment: React.FC = () => {
    const { currentRole } = useContext(UserContext);
    const toast = useToast();
    const [candidates, setCandidates] = useState<RecruitmentCandidate[]>([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    const isMaster = currentRole === 'MASTER' || currentRole === 'PLATFORM_OWNER';
    const canManagePipeline = isMaster || currentRole === 'HEAD_COACH' || (currentRole as string) === 'OFFENSIVE_COORD' || (currentRole as string) === 'DEFENSIVE_COORD';

    const [form, setForm] = useState<Partial<RecruitmentCandidate>>({
        status: 'NEW',
        position: 'WR',
        experience: 'Rookie'
    });

    useEffect(() => {
        // Fix: Use correct storageService method
        setCandidates(storageService.getCandidates());
    }, []);

    const handleSaveCandidate = (e: React.FormEvent) => {
        e.preventDefault();
        if (!form.name || !form.email) return;

        const newCandidate: RecruitmentCandidate = {
            id: `cand-${Date.now()}`,
            name: form.name,
            email: form.email,
            phone: form.phone || '',
            position: form.position || 'WR',
            age: Number(form.age) || 18,
            height: form.height || '',
            weight: Number(form.weight) || 0,
            experience: form.experience || 'Rookie',
            status: 'NEW',
            createdAt: new Date(),
            notes: form.notes || '',
            avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(form.name || '')}&background=random&color=fff`
        };

        const updated = [...candidates, newCandidate];
        setCandidates(updated);
        // Fix: Use correct storageService method
        storageService.saveCandidates(updated);
        setIsAddModalOpen(false);
        setForm({ status: 'NEW', position: 'WR', experience: 'Rookie' });
        toast.success("Candidato adicionado!");
    };

    const handleAnalyze = async (candidate: RecruitmentCandidate) => {
        if(!candidate.combineStats) {
            toast.warning("Adicione dados de Combine primeiro.");
            return;
        }
        setIsProcessing(true);
        try {
            const analysis = await analyzeCombineStats(candidate.combineStats, candidate.position);
            const updated = candidates.map(c => c.id === candidate.id ? { 
                ...c, 
                rating: analysis.rating, 
                aiAnalysis: analysis.analysis,
                notes: `${c.notes || ''}\n\n[IA]: ${analysis.comparison} - Potencial: ${analysis.potential}`
            } : c);
            setCandidates(updated);
            // Fix: Use correct storageService method
            storageService.saveCandidates(updated);
            toast.success("Análise de IA concluída!");
        } catch (e) {
            toast.error("Erro na análise.");
        } finally {
            setIsProcessing(false);
        }
    };

    const updateStatus = (id: string, newStatus: any) => {
        const updated = candidates.map(c => c.id === id ? { ...c, status: newStatus } : c);
        setCandidates(updated);
        // Fix: Use correct storageService method
        storageService.saveCandidates(updated);
    };

    const handleDelete = (id: string) => {
        if(!isMaster) return; 
        if(!confirm("Remover candidato?")) return;
        const updated = candidates.filter(c => c.id !== id);
        setCandidates(updated);
        // Fix: Use correct storageService method
        storageService.saveCandidates(updated);
    };

    return (
        <div className="space-y-6 pb-12 animate-fade-in h-[calc(100vh-8rem)]">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-secondary rounded-xl">
                        <UserPlusIcon className="text-highlight w-8 h-8" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold text-text-primary uppercase italic tracking-tighter">Recrutamento</h2>
                        <p className="text-text-secondary text-sm">Pipeline de novos talentos (Tryouts).</p>
                    </div>
                </div>
                {isMaster && (
                    <button onClick={() => setIsAddModalOpen(true)} className="bg-highlight hover:bg-highlight-hover text-white px-6 py-2 rounded-xl font-bold shadow-lg flex items-center gap-2">
                        + Novo Candidato (Admin)
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 h-full pb-4 overflow-x-auto">
                {STATUS_COLUMNS.map(col => (
                    <div key={col.id} className={`bg-secondary/40 rounded-xl p-4 border-t-4 ${col.color} flex flex-col h-full min-w-[280px]`}>
                        <h3 className="font-bold text-white mb-4 flex justify-between items-center">
                            {col.label}
                            <span className="bg-white/10 text-xs px-2 py-1 rounded">{candidates.filter(c => c.status === col.id).length}</span>
                        </h3>
                        <div className="space-y-3 flex-1 overflow-y-auto custom-scrollbar pr-1">
                            {candidates.filter(c => c.status === col.id).map(candidate => (
                                <div key={candidate.id} className="bg-secondary p-4 rounded-lg border border-white/5 hover:border-white/20 transition-all group relative">
                                    <div className="flex justify-between items-start mb-2">
                                        <div className="flex items-center gap-3">
                                            <LazyImage src={candidate.avatarUrl || `https://ui-avatars.com/api/?name=${candidate.name}`} className="w-8 h-8 rounded-full" />
                                            <div>
                                                <h4 className="font-bold text-white text-sm">{candidate.name}</h4>
                                                <p className="text-[10px] text-text-secondary">{candidate.position} • {candidate.age} anos</p>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {canManagePipeline && (
                                        <div className="flex gap-2 mt-2 pt-2 border-t border-white/5">
                                            {col.id === 'NEW' && <button onClick={() => updateStatus(candidate.id, 'TRYOUT')} className="flex-1 text-[10px] bg-yellow-600/20 text-yellow-400 py-1 rounded hover:bg-yellow-600 hover:text-white font-bold">Agendar Tryout</button>}
                                            {col.id === 'TRYOUT' && (
                                                <>
                                                    <button onClick={() => handleAnalyze(candidate)} className="flex-1 text-[10px] bg-purple-600/20 text-purple-400 py-1 rounded hover:bg-purple-600 hover:text-white flex justify-center gap-1 font-bold">
                                                        {isProcessing ? '...' : <><SparklesIcon className="w-3 h-3"/> IA</>}
                                                    </button>
                                                    <button onClick={() => updateStatus(candidate.id, 'SELECTED')} className="flex-1 text-[10px] bg-green-600/20 text-green-400 py-1 rounded hover:bg-green-600 hover:text-white font-bold">Aprovar</button>
                                                </>
                                            )}
                                            {isMaster && (
                                                <button onClick={() => handleDelete(candidate.id)} className="text-text-secondary hover:text-red-400 p-1"><TrashIcon className="w-3 h-3"/></button>
                                            )}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Cadastrar Candidato (Admin)">
                <form onSubmit={handleSaveCandidate} className="space-y-4">
                    <input className="w-full bg-black/20 border border-white/10 rounded p-2 text-white" placeholder="Nome Completo" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
                    <div className="grid grid-cols-2 gap-4">
                        <input className="w-full bg-black/20 border border-white/10 rounded p-2 text-white" placeholder="Email" type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
                        <input className="w-full bg-black/20 border border-white/10 rounded p-2 text-white" placeholder="Telefone" value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
                    </div>
                    <div className="flex justify-end gap-2">
                        <button type="button" onClick={() => setIsAddModalOpen(false)} className="px-4 py-2 text-text-secondary hover:text-white">Cancelar</button>
                        <button type="submit" className="bg-highlight hover:bg-highlight-hover text-white px-6 py-2 rounded-lg font-bold">Salvar</button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Recruitment;
