import React, { useState, useEffect, useContext } from 'react';
import Card from '../components/Card';
import { RecruitmentCandidate, CombineStats } from '../types';
import { storageService } from '../services/storageService';
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

    // Permissões Estritas
    const isMaster = currentRole === 'MASTER';
    // Coaches podem apenas gerenciar o status dos cards existentes
    const canManagePipeline = isMaster || currentRole === 'HEAD_COACH' || currentRole === 'OFFENSIVE_COORD' || currentRole === 'DEFENSIVE_COORD';

    // Form State
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
            // Generate a random avatar for demo purposes
            // @ts-ignore
            avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(form.name)}&background=random&color=fff`
        };

        const updated = [...candidates, newCandidate];
        setCandidates(updated);
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
        storageService.saveCandidates(updated);
    };

    const handleDelete = (id: string) => {
        if(!isMaster) return; 
        if(!confirm("Remover candidato?")) return;
        const updated = candidates.filter(c => c.id !== id);
        setCandidates(updated);
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
                        <h2 className="text-3xl font-bold text-text-primary">Recrutamento & Scouting</h2>
                        <p className="text-text-secondary">Pipeline de novos talentos (Tryouts).</p>
                    </div>
                </div>
                {/* APENAS MASTER CRIA NOVOS CANDIDATOS MANUALMENTE */}
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
                                            {/* @ts-ignore - avatarUrl is dynamically added on save */}
                                            <LazyImage src={candidate.avatarUrl || `https://ui-avatars.com/api/?name=${candidate.name}`} className="w-8 h-8 rounded-full" />
                                            <div>
                                                <h4 className="font-bold text-white text-sm">{candidate.name}</h4>
                                                <p className="text-[10px] text-text-secondary">{candidate.position} • {candidate.age} anos</p>
                                            </div>
                                        </div>
                                        {candidate.rating && (
                                            <span className={`text-[10px] font-bold px-2 py-1 rounded ${candidate.rating >= 80 ? 'bg-green-500 text-black' : 'bg-white/10 text-white'}`}>
                                                {candidate.rating}
                                            </span>
                                        )}
                                    </div>
                                    
                                    {candidate.combineStats && (
                                        <div className="grid grid-cols-2 gap-2 text-[10px] text-text-secondary mb-3 bg-black/20 p-2 rounded">
                                            <span>40y: <b className="text-white">{candidate.combineStats.fortyYards || '-'}</b></span>
                                            <span>Bench: <b className="text-white">{candidate.combineStats.benchPress || '-'}</b></span>
                                        </div>
                                    )}

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
                                            {/* Delete: Only Master */}
                                            {isMaster ? (
                                                <button onClick={() => handleDelete(candidate.id)} className="text-text-secondary hover:text-red-400 p-1"><TrashIcon className="w-3 h-3"/></button>
                                            ) : (
                                                <LockIcon className="w-3 h-3 text-white/20 ml-auto" />
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
                    <div className="grid grid-cols-3 gap-4">
                        <input className="w-full bg-black/20 border border-white/10 rounded p-2 text-white" placeholder="Idade" type="number" value={form.age} onChange={e => setForm({...form, age: Number(e.target.value)})} />
                        <input className="w-full bg-black/20 border border-white/10 rounded p-2 text-white" placeholder="Altura (m)" value={form.height} onChange={e => setForm({...form, height: e.target.value})} />
                        <input className="w-full bg-black/20 border border-white/10 rounded p-2 text-white" placeholder="Peso (kg)" type="number" value={form.weight} onChange={e => setForm({...form, weight: Number(e.target.value)})} />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <select className="w-full bg-black/20 border border-white/10 rounded p-2 text-white" value={form.position} onChange={e => setForm({...form, position: e.target.value})}>
                            <option value="QB">Quarterback</option>
                            <option value="WR">Wide Receiver</option>
                            <option value="RB">Running Back</option>
                            <option value="OL">Offensive Line</option>
                            <option value="DL">Defensive Line</option>
                            <option value="LB">Linebacker</option>
                            <option value="DB">Defensive Back</option>
                        </select>
                        <select className="w-full bg-black/20 border border-white/10 rounded p-2 text-white" value={form.experience} onChange={e => setForm({...form, experience: e.target.value})}>
                            <option value="Rookie">Novato (Sem xp)</option>
                            <option value="HighSchool">Ex-High School</option>
                            <option value="College">Ex-College</option>
                            <option value="Pro">Veterano / Pro</option>
                        </select>
                    </div>
                    <textarea className="w-full bg-black/20 border border-white/10 rounded p-2 text-white h-20" placeholder="Observações..." value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} />
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