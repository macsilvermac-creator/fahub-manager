import React, { useState, useEffect, useContext } from 'react';
import Card from '../components/Card';
import { RecruitmentCandidate, CombineStats } from '../types';
import { storageService } from '../services/storageService';
import { analyzeCombineStats } from '../services/geminiService';
import { UserPlusIcon, CheckCircleIcon, XIcon, ClockIcon, ClipboardIcon, SparklesIcon, TrashIcon } from '../components/icons/UiIcons';
import Modal from '../components/Modal';
import { useToast } from '../contexts/ToastContext';
import { UserContext } from '../components/Layout';
import LazyImage from '../components/LazyImage';

const STATUS_COLUMNS = [
    { id: 'NEW', label: 'Inscritos', color: 'border-blue-500' },
    { id: 'TRYOUT', label: 'Tryout', color: 'border-yellow-500' },
    { id: 'SELECTED', label: 'Selecionados', color: 'border-green-500' },
    { id: 'ONBOARDING', label: 'Onboarding', color: 'border-purple-500' }
];

const Recruitment: React.FC = () => {
    const { currentRole } = useContext(UserContext);
    const toast = useToast();
    const [candidates, setCandidates] = useState<RecruitmentCandidate[]>([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);

    const isMaster = currentRole === 'MASTER';

    const [form, setForm] = useState<Partial<RecruitmentCandidate>>({
        status: 'NEW',
        position: 'WR',
        experience: 'Rookie'
    });

    useEffect(() => {
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
        storageService.saveCandidates(updated);
        setIsAddModalOpen(false);
        setForm({ status: 'NEW', position: 'WR', experience: 'Rookie' });
        toast.success("Candidato registrado.");
    };

    const updateStatus = (id: string, newStatus: any) => {
        const updated = candidates.map(c => c.id === id ? { ...c, status: newStatus } : c);
        setCandidates(updated);
        storageService.saveCandidates(updated);
    };

    const handleDelete = (id: string) => {
        if(!confirm("Remover candidato?")) return;
        const updated = candidates.filter(c => c.id !== id);
        setCandidates(updated);
        storageService.saveCandidates(updated);
    };

    return (
        <div className="space-y-6 pb-12 animate-fade-in">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-secondary rounded-xl">
                        <UserPlusIcon className="text-highlight w-8 h-8" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold text-text-primary uppercase italic tracking-tighter">Recrutamento</h2>
                        <p className="text-text-secondary text-sm">Pipeline de novos talentos.</p>
                    </div>
                </div>
                {isMaster && (
                    <button onClick={() => setIsAddModalOpen(true)} className="bg-highlight hover:bg-highlight-hover text-white px-6 py-2 rounded-xl font-bold shadow-lg">
                        + Novo Candidato
                    </button>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 overflow-x-auto pb-4">
                {STATUS_COLUMNS.map(col => (
                    <div key={col.id} className={`bg-secondary/40 rounded-xl p-4 border-t-4 ${col.color} min-w-[280px]`}>
                        <h3 className="font-bold text-white mb-4 flex justify-between items-center text-xs uppercase">
                            {col.label}
                            <span className="bg-white/10 px-2 py-1 rounded">{candidates.filter(c => c.status === col.id).length}</span>
                        </h3>
                        <div className="space-y-3">
                            {candidates.filter(c => c.status === col.id).map(candidate => (
                                <div key={candidate.id} className="bg-secondary p-4 rounded-lg border border-white/5 hover:border-white/20 transition-all">
                                    <div className="flex items-center gap-3 mb-2">
                                        <LazyImage src={candidate.avatarUrl || ''} className="w-8 h-8 rounded-full" />
                                        <div>
                                            <h4 className="font-bold text-white text-sm">{candidate.name}</h4>
                                            <p className="text-[10px] text-text-secondary">{candidate.position}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-1 mt-2">
                                        {col.id === 'NEW' && <button onClick={() => updateStatus(candidate.id, 'TRYOUT')} className="flex-1 text-[10px] bg-yellow-600/20 text-yellow-400 py-1 rounded font-bold">Tryout</button>}
                                        {col.id === 'TRYOUT' && <button onClick={() => updateStatus(candidate.id, 'SELECTED')} className="flex-1 text-[10px] bg-green-600/20 text-green-400 py-1 rounded font-bold">Aprovar</button>}
                                        <button onClick={() => handleDelete(candidate.id)} className="p-1 text-text-secondary hover:text-red-400 transition-colors"><TrashIcon className="w-3 h-3"/></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>

            <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Novo Candidato">
                <form onSubmit={handleSaveCandidate} className="space-y-4">
                    <input className="w-full bg-black/20 border border-white/10 rounded p-2 text-white" placeholder="Nome" value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
                    <input className="w-full bg-black/20 border border-white/10 rounded p-2 text-white" placeholder="Email" type="email" value={form.email} onChange={e => setForm({...form, email: e.target.value})} required />
                    <div className="flex justify-end gap-2">
                        <button type="submit" className="bg-highlight text-white px-6 py-2 rounded-lg font-bold">Salvar</button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Recruitment;