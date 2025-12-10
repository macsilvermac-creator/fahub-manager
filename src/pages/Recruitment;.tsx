
import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import { RecruitmentCandidate } from '../types';
import { storageService } from '../services/storageService';
import { UserPlusIcon, CheckCircleIcon, TrashIcon, UsersIcon } from '../components/icons/UiIcons';
import Modal from '../components/Modal';
import { useToast } from '../contexts/ToastContext';

const Recruitment: React.FC = () => {
    const toast = useToast();
    const [candidates, setCandidates] = useState<RecruitmentCandidate[]>([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    
    // Form State
    const [newName, setNewName] = useState('');
    const [newPhone, setNewPhone] = useState('');
    const [newPosition, setNewPosition] = useState('ATH'); // Athlete (Generic)

    useEffect(() => {
        setCandidates(storageService.getCandidates());
    }, []);

    const handleAddCandidate = (e: React.FormEvent) => {
        e.preventDefault();
        const newCandidate: RecruitmentCandidate = {
            id: `cand-${Date.now()}`,
            name: newName,
            email: '',
            phone: newPhone,
            position: newPosition,
            age: 0,
            height: '',
            weight: 0,
            experience: 'ROOKIE',
            status: 'NEW',
            createdAt: new Date()
        };
        const updated = [...candidates, newCandidate];
        setCandidates(updated);
        storageService.saveCandidates(updated);
        setIsAddModalOpen(false);
        setNewName('');
        setNewPhone('');
        toast.success("Candidato inscrito no funil!");
    };

    const moveCandidate = (id: string, newStatus: RecruitmentCandidate['status']) => {
        const updated = candidates.map(c => c.id === id ? { ...c, status: newStatus } : c);
        setCandidates(updated);
        storageService.saveCandidates(updated);
    };

    const promoteToRoster = (candidate: RecruitmentCandidate) => {
        try {
            storageService.registerAthlete({
                id: Date.now(), // Will be overwritten by logic inside registerAthlete but good to have
                name: candidate.name,
                position: candidate.position,
                jerseyNumber: 0, // TBD
                height: candidate.height || '',
                weight: candidate.weight || 0,
                class: 'Rookie',
                avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(candidate.name)}`,
                level: 1,
                xp: 0,
                rating: 65,
                status: 'ACTIVE',
                rosterCategory: 'ACTIVE',
                depthChartOrder: 3
            } as any); // Cast to partial player to satisfy TS strictness if needed
            
            // Remove from funnel or mark converted
            moveCandidate(candidate.id, 'CONVERTED');
            toast.success(`${candidate.name} promovido ao Elenco Oficial!`);
        } catch (e: any) {
            toast.error("Erro ao promover: " + e.message);
        }
    };

    const renderColumn = (status: string, title: string, color: string) => {
        const list = candidates.filter(c => c.status === status);
        return (
            <div className="bg-secondary/40 rounded-xl p-4 border border-white/5 min-w-[280px] flex-1">
                <h3 className={`font-bold mb-4 uppercase text-sm tracking-wider flex items-center justify-between ${color}`}>
                    {title} <span className="bg-black/20 px-2 py-0.5 rounded text-xs">{list.length}</span>
                </h3>
                <div className="space-y-3">
                    {list.map(c => (
                        <div key={c.id} className="bg-secondary p-4 rounded-lg border border-white/5 hover:border-white/20 transition-all group relative">
                            <div className="flex justify-between items-start">
                                <div>
                                    <p className="font-bold text-white text-sm">{c.name}</p>
                                    <p className="text-xs text-text-secondary">{c.position} • {c.phone}</p>
                                </div>
                                <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                                    {status !== 'NEW' && <button onClick={() => moveCandidate(c.id, getPrevStatus(status))} className="text-xs bg-white/10 px-2 py-1 rounded hover:bg-white/20">←</button>}
                                    {status !== 'ONBOARDING' && <button onClick={() => moveCandidate(c.id, getNextStatus(status))} className="text-xs bg-white/10 px-2 py-1 rounded hover:bg-white/20">→</button>}
                                </div>
                            </div>
                            
                            {status === 'ONBOARDING' && (
                                <button 
                                    onClick={() => promoteToRoster(c)}
                                    className="w-full mt-3 bg-green-600 hover:bg-green-500 text-white py-1.5 rounded text-xs font-bold flex items-center justify-center gap-2"
                                >
                                    <CheckCircleIcon className="w-3 h-3" /> Promover a Atleta
                                </button>
                            )}
                        </div>
                    ))}
                    {list.length === 0 && <div className="text-center py-8 text-text-secondary italic text-xs border-2 border-dashed border-white/5 rounded">Vazio</div>}
                </div>
            </div>
        );
    };

    const getNextStatus = (current: string): any => {
        if (current === 'NEW') return 'TRYOUT';
        if (current === 'TRYOUT') return 'SELECTED';
        if (current === 'SELECTED') return 'ONBOARDING';
        return current;
    };

    const getPrevStatus = (current: string): any => {
        if (current === 'TRYOUT') return 'NEW';
        if (current === 'SELECTED') return 'TRYOUT';
        if (current === 'ONBOARDING') return 'SELECTED';
        return current;
    };

    return (
        <div className="space-y-6 pb-12 animate-fade-in h-[calc(100vh-8rem)]">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-secondary rounded-xl">
                        <UsersIcon className="h-8 w-8 text-highlight" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold text-text-primary">Funil de Recrutamento</h2>
                        <p className="text-text-secondary">CRM de Novos Talentos (Tryouts & Seletivas).</p>
                    </div>
                </div>
                <button onClick={() => setIsAddModalOpen(true)} className="bg-highlight hover:bg-highlight-hover text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2">
                    <UserPlusIcon className="w-5 h-5" /> Novo Candidato
                </button>
            </div>

            <div className="flex gap-4 overflow-x-auto pb-4 h-full">
                {renderColumn('NEW', 'Inscritos', 'text-text-secondary')}
                {renderColumn('TRYOUT', 'Em Avaliação (Tryout)', 'text-yellow-400')}
                {renderColumn('SELECTED', 'Aprovados', 'text-blue-400')}
                {renderColumn('ONBOARDING', 'Matrícula (Docs)', 'text-purple-400')}
                {renderColumn('CONVERTED', 'Convertidos (Sucesso)', 'text-green-400')}
            </div>

            <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Adicionar Candidato">
                <form onSubmit={handleAddCandidate} className="space-y-4">
                    <div>
                        <label className="text-xs font-bold text-text-secondary uppercase">Nome Completo</label>
                        <input className="w-full bg-black/20 border border-white/10 rounded p-2 text-white" required value={newName} onChange={e => setNewName(e.target.value)} />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-text-secondary uppercase">WhatsApp</label>
                        <input className="w-full bg-black/20 border border-white/10 rounded p-2 text-white" value={newPhone} onChange={e => setNewPhone(e.target.value)} />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-text-secondary uppercase">Posição Pretendida</label>
                        <select className="w-full bg-black/20 border border-white/10 rounded p-2 text-white" value={newPosition} onChange={e => setNewPosition(e.target.value)}>
                            <option value="ATH">Atleta (Geral)</option>
                            <option value="QB">Quarterback</option>
                            <option value="WR">Receiver</option>
                            <option value="LINEMAN">Linha</option>
                            <option value="DEFENSE">Defensor</option>
                        </select>
                    </div>
                    <button type="submit" className="w-full bg-green-600 text-white font-bold py-2 rounded mt-4">Inscrever</button>
                </form>
            </Modal>
        </div>
    );
};

export default Recruitment;