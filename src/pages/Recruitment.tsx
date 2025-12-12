
import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import { RecruitmentCandidate, CombineStats } from '../types';
import { storageService } from '../services/storageService';
import { analyzeCombineStats } from '../services/geminiService';
import { UserPlusIcon, CheckCircleIcon, TrashIcon, UsersIcon, SparklesIcon, DumbbellIcon, ClipboardIcon, PenIcon } from '../components/icons/UiIcons';
import Modal from '../components/Modal';
import { useToast } from '../contexts/ToastContext';
import LazyImage from '@/components/LazyImage';
import { authService } from '../services/authService';

const Recruitment: React.FC = () => {
    const toast = useToast();
    const [candidates, setCandidates] = useState<RecruitmentCandidate[]>([]);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    
    const [selectedCandidate, setSelectedCandidate] = useState<RecruitmentCandidate | null>(null);
    const [isCombineOpen, setIsCombineOpen] = useState(false);
    const [combineStats, setCombineStats] = useState<CombineStats>({});
    
    const [scoutAnalysis, setScoutAnalysis] = useState<{ rating: number, potential: string, analysis: string } | null>(null);
    const [editedRating, setEditedRating] = useState<number>(0);
    const [editedAnalysis, setEditedAnalysis] = useState<string>('');
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [isEditingAnalysis, setIsEditingAnalysis] = useState(false);

    const [newName, setNewName] = useState('');
    const [newPhone, setNewPhone] = useState('');
    const [newPosition, setNewPosition] = useState('ATH');

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
        toast.success("Candidato adicionado manualmente!");
    };

    const handleCheckIn = (id: string) => {
        const updated = candidates.map(c => c.id === id ? { ...c, status: 'TRYOUT' as const } : c);
        setCandidates(updated);
        storageService.saveCandidates(updated);
        toast.info("Check-in realizado!");
    };

    const moveCandidate = (id: string, newStatus: RecruitmentCandidate['status']) => {
        const updated = candidates.map(c => c.id === id ? { ...c, status: newStatus } : c);
        setCandidates(updated);
        storageService.saveCandidates(updated);
    };

    // CORREÇÃO CRÍTICA: Player Object Completo
    const promoteToRoster = (candidate: RecruitmentCandidate) => {
        try {
            const user = authService.getCurrentUser();
            
            storageService.registerAthlete({
                id: Date.now(),
                name: candidate.name,
                position: candidate.position,
                jerseyNumber: 0,
                height: candidate.height || '',
                weight: candidate.weight || 0,
                class: 'Rookie',
                avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(candidate.name)}`,
                level: 1,
                xp: 0,
                rating: candidate.rating || 65,
                status: 'ACTIVE',
                rosterCategory: 'PRACTICE_SQUAD', 
                depthChartOrder: 4,
                combineStats: combineStats,
                hcNotes: `Promovido via Combine. Análise: ${candidate.aiAnalysis} (Validado por: ${candidate.verifiedBy || user?.name})`,
                wellnessHistory: [],
                gameLogs: [],
                savedWorkouts: [],
                medicalReports: []
            } as any);
            
            moveCandidate(candidate.id, 'CONVERTED');
            toast.success(`${candidate.name} promovido ao Elenco Oficial!`);
            setIsCombineOpen(false);
        } catch (e: any) {
            toast.error("Erro ao promover: " + e.message);
        }
    };

    const openCombine = (c: RecruitmentCandidate) => {
        setSelectedCandidate(c);
        setCombineStats({});
        setScoutAnalysis(null);
        setIsCombineOpen(true);
        setIsEditingAnalysis(false);
    };

    const runAiScout = async () => {
        if(!selectedCandidate) return;
        setIsAnalyzing(true);
        const result = await analyzeCombineStats(combineStats, selectedCandidate.position);
        
        setScoutAnalysis(result);
        setEditedRating(result.rating);
        setEditedAnalysis(result.analysis);
        setIsEditingAnalysis(true); 
        
        setIsAnalyzing(false);
    };

    const saveAnalysisAndApprove = () => {
        if (!selectedCandidate) return;
        const user = authService.getCurrentUser();

        const updated = candidates.map(c => c.id === selectedCandidate.id ? { 
            ...c, 
            status: 'SELECTED' as const,
            rating: editedRating,
            aiAnalysis: editedAnalysis,
            verifiedBy: user?.name || 'Coach'
        } : c);
        
        setCandidates(updated);
        storageService.saveCandidates(updated);
        setIsCombineOpen(false);
        toast.success("Candidato Aprovado e Avaliação Salva!");
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
                                    <button onClick={() => { if(confirm('Remover candidato?')) moveCandidate(c.id, 'REJECTED')}} className="text-xs text-red-400 hover:text-white p-1"><TrashIcon className="w-4 h-4"/></button>
                                </div>
                            </div>
                            
                            {status === 'NEW' && (
                                <button 
                                    onClick={() => handleCheckIn(c.id)}
                                    className="w-full mt-3 bg-white/10 hover:bg-white/20 text-white py-1.5 rounded text-xs font-bold border border-white/10 flex items-center justify-center gap-2"
                                >
                                    <ClipboardIcon className="w-3 h-3" /> Fazer Check-in (Chegou)
                                </button>
                            )}

                            {status === 'TRYOUT' && (
                                <button 
                                    onClick={() => openCombine(c)}
                                    className="w-full mt-3 bg-blue-600/20 hover:bg-blue-600/40 text-blue-300 py-1.5 rounded text-xs font-bold flex items-center justify-center gap-2 border border-blue-500/30"
                                >
                                    <DumbbellIcon className="w-3 h-3" /> Testar (Combine)
                                </button>
                            )}

                            {status === 'SELECTED' && (
                                <>
                                    <div className="mt-2 text-xs text-green-400 bg-green-900/20 px-2 py-1 rounded">
                                        Nota: {c.rating} (Validado por {c.verifiedBy})
                                    </div>
                                    <button 
                                        onClick={() => moveCandidate(c.id, 'ONBOARDING')}
                                        className="w-full mt-2 bg-yellow-600/20 hover:bg-yellow-600/40 text-yellow-300 py-1.5 rounded text-xs font-bold border border-yellow-500/30"
                                    >
                                        Iniciar Matrícula
                                    </button>
                                </>
                            )}

                            {status === 'ONBOARDING' && (
                                <button 
                                    onClick={() => promoteToRoster(c)}
                                    className="w-full mt-3 bg-green-600 hover:bg-green-500 text-white py-1.5 rounded text-xs font-bold flex items-center justify-center gap-2"
                                >
                                    <CheckCircleIcon className="w-3 h-3" /> Finalizar & Promover
                                </button>
                            )}
                        </div>
                    ))}
                    {list.length === 0 && <div className="text-center py-8 text-text-secondary italic text-xs border-2 border-dashed border-white/5 rounded">Vazio</div>}
                </div>
            </div>
        );
    };

    return (
        <div className="space-y-6 pb-12 animate-fade-in h-[calc(100vh-8rem)]">
            <div className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-secondary rounded-xl">
                        <UsersIcon className="h-8 w-8 text-highlight" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold text-text-primary">Combine & Seletiva</h2>
                        <p className="text-text-secondary">Operação Técnica de Campo.</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button onClick={() => setIsAddModalOpen(true)} className="bg-secondary hover:bg-white/10 text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 border border-white/10 text-sm">
                        <UserPlusIcon className="w-4 h-4" /> Add Manual (Walk-in)
                    </button>
                </div>
            </div>

            <div className="flex gap-4 overflow-x-auto pb-4 h-full">
                {renderColumn('NEW', 'Pré-Inscritos (Check-in)', 'text-text-secondary')}
                {renderColumn('TRYOUT', 'Em Teste (Combine)', 'text-blue-400')}
                {renderColumn('SELECTED', 'Aprovados (Técnico)', 'text-yellow-400')}
                {renderColumn('ONBOARDING', 'Matrícula (Admin)', 'text-purple-400')}
                {renderColumn('CONVERTED', 'Elenco Oficial', 'text-green-400')}
            </div>

            <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Adicionar Candidato (Balcão)">
                <form onSubmit={handleAddCandidate} className="space-y-4">
                    <input className="w-full bg-black/20 border border-white/10 rounded p-2 text-white" required value={newName} onChange={e => setNewName(e.target.value)} placeholder="Nome Completo" />
                    <input className="w-full bg-black/20 border border-white/10 rounded p-2 text-white" value={newPhone} onChange={e => setNewPhone(e.target.value)} placeholder="WhatsApp" />
                    <select className="w-full bg-black/20 border border-white/10 rounded p-2 text-white" value={newPosition} onChange={e => setNewPosition(e.target.value)}>
                        <option value="ATH">Atleta (Geral)</option>
                        <option value="QB">Quarterback</option>
                        <option value="WR">Receiver</option>
                        <option value="LINEMAN">Linha</option>
                        <option value="DEFENSE">Defensor</option>
                    </select>
                    <button type="submit" className="w-full bg-highlight text-white font-bold py-2 rounded mt-4">Inscrever & Check-in</button>
                </form>
            </Modal>

            <Modal isOpen={isCombineOpen} onClose={() => setIsCombineOpen(false)} title={`Avaliação Física: ${selectedCandidate?.name}`} maxWidth="max-w-2xl">
                <div className="space-y-6">
                    <div className="bg-blue-900/20 p-4 rounded-lg border border-blue-500/20 text-center mb-4">
                        <p className="text-xs text-blue-300 font-bold uppercase">Posição Declarada</p>
                        <p className="text-2xl font-black text-white">{selectedCandidate?.position}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs text-text-secondary uppercase block mb-1">40 Jardas (s)</label>
                            <input type="number" className="w-full bg-black/20 border border-white/10 rounded p-2 text-white" value={combineStats.fortyYards || ''} onChange={e => setCombineStats({...combineStats, fortyYards: Number(e.target.value)})} placeholder="4.50" />
                        </div>
                        <div>
                            <label className="text-xs text-text-secondary uppercase block mb-1">Supino (Reps)</label>
                            <input type="number" className="w-full bg-black/20 border border-white/10 rounded p-2 text-white" value={combineStats.benchPress || ''} onChange={e => setCombineStats({...combineStats, benchPress: Number(e.target.value)})} placeholder="15" />
                        </div>
                        <div>
                            <label className="text-xs text-text-secondary uppercase block mb-1">Salto Vertical (in)</label>
                            <input type="number" className="w-full bg-black/20 border border-white/10 rounded p-2 text-white" value={combineStats.verticalJump || ''} onChange={e => setCombineStats({...combineStats, verticalJump: Number(e.target.value)})} placeholder="30" />
                        </div>
                        <div>
                            <label className="text-xs text-text-secondary uppercase block mb-1">Shuttle (s)</label>
                            <input type="number" className="w-full bg-black/20 border border-white/10 rounded p-2 text-white" value={combineStats.shuttle || ''} onChange={e => setCombineStats({...combineStats, shuttle: Number(e.target.value)})} placeholder="4.20" />
                        </div>
                    </div>

                    <div className="pt-4 border-t border-white/10">
                        <button onClick={runAiScout} disabled={isAnalyzing} className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-bold flex justify-center items-center gap-2">
                            {isAnalyzing ? 'Analisando...' : <><SparklesIcon className="w-4 h-4"/> Gerar Relatório de Scout (IA)</>}
                        </button>
                    </div>

                    {scoutAnalysis && (
                        <div className="bg-black/30 p-4 rounded-xl border border-white/10 animate-fade-in">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-sm font-bold text-white uppercase flex items-center gap-2">
                                    <SparklesIcon className="w-4 h-4 text-purple-400"/> Análise Preliminar
                                </span>
                                <button onClick={() => setIsEditingAnalysis(!isEditingAnalysis)} className="text-xs text-blue-400 hover:underline flex items-center gap-1">
                                    <PenIcon className="w-3 h-3"/> {isEditingAnalysis ? 'Visualizar' : 'Editar'}
                                </button>
                            </div>

                            {isEditingAnalysis ? (
                                <div className="space-y-3">
                                    <div>
                                        <label className="text-xs text-text-secondary uppercase block mb-1">Nota (0-100)</label>
                                        <input 
                                            type="number" 
                                            className="w-20 bg-black/40 border border-white/20 rounded p-1 text-white font-bold"
                                            value={editedRating}
                                            onChange={(e) => setEditedRating(Number(e.target.value))}
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs text-text-secondary uppercase block mb-1">Análise Técnica (Edite se necessário)</label>
                                        <textarea 
                                            className="w-full h-24 bg-black/40 border border-white/20 rounded p-2 text-white text-sm"
                                            value={editedAnalysis}
                                            onChange={(e) => setEditedAnalysis(e.target.value)}
                                        />
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="flex justify-between items-end mb-2">
                                        <p className="text-sm text-white"><strong className="text-blue-400">Potencial:</strong> {scoutAnalysis.potential}</p>
                                        <span className="text-2xl font-black text-highlight">{editedRating}</span>
                                    </div>
                                    <p className="text-xs text-text-secondary italic">"{editedAnalysis}"</p>
                                </>
                            )}
                            
                            <div className="mt-4 flex gap-2 pt-4 border-t border-white/10">
                                <button onClick={saveAnalysisAndApprove} className="flex-1 bg-green-600 hover:bg-green-500 text-white py-2 rounded font-bold text-sm flex items-center justify-center gap-2">
                                    <CheckCircleIcon className="w-4 h-4"/> Validar & Aprovar
                                </button>
                                <button onClick={() => { moveCandidate(selectedCandidate!.id, 'REJECTED'); setIsCombineOpen(false); }} className="flex-1 bg-red-600 text-white py-2 rounded font-bold text-sm">
                                    Dispensar
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </Modal>
        </div>
    );
};

export default Recruitment;
export default Recruitment;