
import React, { useState, useEffect, useContext, useRef } from 'react';
import Card from '../components/Card';
import { Invoice, Player, EventSale, Transaction, EquipmentItem, TransactionCategory, UserRole } from '../types';
import { storageService, LEGAL_DOCUMENTS } from '../services/storageService';
import { FinanceIcon } from '../components/icons/NavIcons';
import { WalletIcon, AlertCircleIcon, SparklesIcon, AlertTriangleIcon, ScanIcon, CheckCircleIcon } from '../components/icons/UiIcons';
import { UserContext, UserContextType } from '../components/Layout';
import ComplianceModal from '../components/ComplianceModal';
import Modal from '../components/Modal';
import { authService } from '../services/authService';
import { useToast } from '../contexts/ToastContext';
import { scanFinancialDocument } from '../services/geminiService';

const Finance: React.FC = () => {
    // TIPAGEM CORRETA DO CONTEXTO
    const { currentRole } = useContext(UserContext) as UserContextType;
    const toast = useToast();
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    // Data State
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [players, setPlayers] = useState<Player[]>([]);
    const [inventory, setInventory] = useState<EquipmentItem[]>([]);
    
    // Performance State
    const [visibleTxCount, setVisibleTxCount] = useState(20);

    // View State
    const [viewMode, setViewMode] = useState<'OVERVIEW' | 'EXPENSES' | 'RECEIVABLES' | 'DELINQUENCY'>('OVERVIEW');
    
    // Transaction Modal State
    const [isTxModalOpen, setIsTxModalOpen] = useState(false);
    const [txType, setTxType] = useState<'INCOME' | 'EXPENSE'>('EXPENSE');
    const [txTitle, setTxTitle] = useState('');
    const [txDesc, setTxDesc] = useState('');
    const [txAmount, setTxAmount] = useState('');
    const [txCategory, setTxCategory] = useState<TransactionCategory>('OTHER');
    const [txDate, setTxDate] = useState(new Date().toISOString().split('T')[0]);
    const [isScanning, setIsScanning] = useState(false);
    const [isAiFilled, setIsAiFilled] = useState(false); // Flag para indicar revisão

    // Wizard State
    const [isRecModalOpen, setIsRecModalOpen] = useState(false);
    const [recTitle, setRecTitle] = useState('');
    const [recCategory, setRecCategory] = useState<TransactionCategory>('OTHER');
    const [recAmount, setRecAmount] = useState<number>(0);
    const [recDueDate, setRecDueDate] = useState('');

    const [showComplianceModal, setShowComplianceModal] = useState(false);

    const isPlayer = currentRole === 'PLAYER';
    const isCoach = !isPlayer;
    const complianceDoc = LEGAL_DOCUMENTS[0]; 

    useEffect(() => {
        if (isCoach) {
            const signed = storageService.checkDocumentSigned(complianceDoc.id);
            if (!signed) setShowComplianceModal(true);
        }

        const allInvoices = storageService.getInvoices();
        const allTransactions = storageService.getTransactions();
        
        if (isPlayer) {
            const user = authService.getCurrentUser();
            const player = storageService.getPlayers().find(p => p.name === user?.name);
            
            if (player) {
                setInvoices(allInvoices.filter(i => i.playerId === player.id));
                setTransactions([]); 
            }
        } else {
            setTransactions(allTransactions);
            setInvoices(allInvoices);
            setPlayers(storageService.getPlayers());
            setInventory(storageService.getInventory());
        }
        
    }, [isCoach, isPlayer]);

    useEffect(() => {
        setVisibleTxCount(20);
    }, [viewMode]);

    // --- SMART SCANNER LOGIC ---
    const handleScanClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setIsScanning(true);
            toast.info("A IA está analisando o documento...");

            try {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                reader.onload = async () => {
                    const base64 = reader.result as string;
                    try {
                        const data = await scanFinancialDocument(base64);
                        setTxTitle(data.title);
                        setTxAmount(String(data.amount));
                        setTxDate(data.date);
                        // @ts-ignore
                        setTxCategory(data.category);
                        setTxDesc(data.description);
                        setIsAiFilled(true); // Ativa modo de revisão
                        toast.success("Dados extraídos! Por favor, REVISE antes de salvar.");
                    } catch (aiError) {
                        toast.error("IA não conseguiu ler o documento com clareza.");
                    }
                    setIsScanning(false);
                };
            } catch (err) {
                toast.error("Erro ao processar arquivo.");
                setIsScanning(false);
            }
        }
    };

    // --- COACH / ADMIN LOGIC BELOW ---

    // Smart Tuition Logic
    const getDelinquentPlayers = () => {
        const today = new Date();
        const overdueInvoices = invoices.filter(inv => inv.status !== 'PAID' && new Date(inv.dueDate) < today);
        
        // Group by Player
        const debtMap = new Map<number, number>();
        overdueInvoices.forEach(inv => {
            if(inv.playerId) {
                const current = debtMap.get(inv.playerId) || 0;
                debtMap.set(inv.playerId, current + inv.amount);
            }
        });

        // Map back to Player Info
        return Array.from(debtMap.entries()).map(([playerId, debt]) => {
            const player = players.find(p => p.id === playerId);
            return {
                id: playerId,
                name: player?.name || 'Desconhecido',
                avatar: player?.avatarUrl,
                totalDebt: debt,
                status: debt > 200 ? 'BLOCKED' : 'WARNING' // Rule: Debt > 200 blocks
            };
        }).sort((a,b) => b.totalDebt - a.totalDebt);
    };

    const delinquentList = getDelinquentPlayers();

    const handleCreateBulkReceivable = () => {
        const targets = players; // Simplify target logic for brevity
        const amountPerPerson = recAmount;
        const dueDateObj = new Date(recDueDate);

        storageService.createBulkInvoices(
            targets.map(p => p.id),
            recTitle,
            amountPerPerson,
            dueDateObj,
            recCategory
        );

        setInvoices(storageService.getInvoices());
        setIsRecModalOpen(false);
        toast.success(`Sucesso! Cobranças geradas.`);
    };

    const handleSaveTransaction = (e: React.FormEvent) => {
        e.preventDefault();
        const user = authService.getCurrentUser();
        
        const newTx: Transaction = {
            id: `tx-${Date.now()}`,
            title: txTitle,
            description: txDesc,
            amount: Number(txAmount),
            type: txType,
            category: txCategory,
            date: new Date(txDate),
            status: 'PAID',
            attachments: [],
            aiGenerated: isAiFilled,
            verifiedBy: user?.name || 'Sistema'
        };

        const updated = [newTx, ...transactions];
        setTransactions(updated);
        storageService.saveTransactions(updated);
        setIsTxModalOpen(false);
        setIsAiFilled(false);
        toast.success("Transação validada e registrada.");
        
        // Clear form
        setTxTitle('');
        setTxAmount('');
        setTxDesc('');
    };

    const totalIncome = transactions.filter(t => t.type === 'INCOME').reduce((acc, t) => acc + t.amount, 0) 
        + invoices.filter(i => i.status === 'PAID').reduce((acc, i) => acc + i.amount, 0);
    const totalExpense = transactions.filter(t => t.type === 'EXPENSE').reduce((acc, t) => acc + t.amount, 0);
    const balance = totalIncome - totalExpense;

    if (isPlayer) return <div>Acesso Restrito</div>;

    return (
        <div className="space-y-6 pb-12 animate-fade-in relative">
             <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-secondary rounded-xl">
                        <FinanceIcon className="text-highlight w-8 h-8" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold text-text-primary">Gestão Financeira (CFO)</h2>
                        <p className="text-text-secondary">Fluxo de Caixa, Despesas e Documentação.</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button onClick={() => setIsTxModalOpen(true)} className="bg-secondary border border-white/10 hover:bg-white/5 text-white px-4 py-2.5 rounded-xl font-bold shadow-lg text-sm">
                        Lançar Despesa
                    </button>
                    <button onClick={() => setIsRecModalOpen(true)} className="bg-highlight hover:bg-highlight-hover text-white px-6 py-2.5 rounded-xl font-bold shadow-lg flex items-center gap-2">
                        <span>+</span> Criar Recebimento
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-gradient-to-br from-green-900/40 to-secondary border-l-4 border-l-green-500">
                    <div className="flex items-center">
                        <div className="p-3 bg-green-500/20 rounded-lg text-green-400"><WalletIcon className="h-8 w-8" /></div>
                        <div className="ml-4"><p className="text-xs text-text-secondary font-bold uppercase">Entradas</p><p className="text-2xl font-bold text-green-400">R$ {totalIncome.toFixed(2)}</p></div>
                    </div>
                </Card>
                <Card className="bg-gradient-to-br from-red-900/40 to-secondary border-l-4 border-l-red-500">
                    <div className="flex items-center">
                        <div className="p-3 bg-red-500/20 rounded-lg text-red-400"><AlertCircleIcon className="h-8 w-8" /></div>
                        <div className="ml-4"><p className="text-xs text-text-secondary font-bold uppercase">Saídas</p><p className="text-2xl font-bold text-red-400">R$ {totalExpense.toFixed(2)}</p></div>
                    </div>
                </Card>
                <Card className="bg-gradient-to-br from-blue-900/40 to-secondary border-l-4 border-l-blue-500">
                    <div className="flex items-center">
                        <div className="p-3 bg-blue-500/20 rounded-lg text-blue-400"><SparklesIcon className="h-8 w-8" /></div>
                        <div className="ml-4"><p className="text-xs text-text-secondary font-bold uppercase">Saldo Atual</p><p className={`text-2xl font-bold ${balance >= 0 ? 'text-white' : 'text-red-500'}`}>R$ {balance.toFixed(2)}</p></div>
                    </div>
                </Card>
            </div>

            <div className="flex border-b border-white/10 overflow-x-auto">
                <button onClick={() => setViewMode('OVERVIEW')} className={`px-6 py-3 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${viewMode === 'OVERVIEW' ? 'border-highlight text-highlight' : 'border-transparent text-text-secondary hover:text-white'}`}>Extrato Geral</button>
                <button onClick={() => setViewMode('RECEIVABLES')} className={`px-6 py-3 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${viewMode === 'RECEIVABLES' ? 'border-highlight text-highlight' : 'border-transparent text-text-secondary hover:text-white'}`}>Recebíveis</button>
                <button onClick={() => setViewMode('DELINQUENCY')} className={`px-6 py-3 text-sm font-bold border-b-2 transition-colors whitespace-nowrap flex items-center gap-2 ${viewMode === 'DELINQUENCY' ? 'border-red-500 text-red-400' : 'border-transparent text-text-secondary hover:text-white'}`}>
                    <AlertTriangleIcon className="w-4 h-4" /> Radar Inadimplência
                </button>
            </div>

            {viewMode === 'DELINQUENCY' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-slide-in">
                    <Card title="Atletas com Pendências (Smart Tuition)">
                        <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                            {delinquentList.length === 0 && <p className="text-center text-text-secondary py-8 italic">Parabéns! Nenhuma inadimplência detectada.</p>}
                            {delinquentList.map(item => (
                                <div key={item.id} className={`flex items-center justify-between p-4 rounded-xl border ${item.status === 'BLOCKED' ? 'bg-red-900/20 border-red-500/50' : 'bg-secondary border-white/5'}`}>
                                    <div className="flex items-center gap-4">
                                        <div className="relative">
                                            <img src={item.avatar} className="w-12 h-12 rounded-full grayscale" />
                                            {item.status === 'BLOCKED' && <div className="absolute -top-1 -right-1 bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow">BLOQUEADO</div>}
                                        </div>
                                        <div>
                                            <p className="font-bold text-white">{item.name}</p>
                                            <p className="text-xs text-text-secondary">Dívida Total</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-xl font-bold text-red-400">R$ {item.totalDebt.toFixed(2)}</p>
                                        <button className="text-xs bg-white/10 hover:bg-white/20 text-white px-3 py-1 rounded mt-1">
                                            Notificar (WhatsApp)
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                    <div className="space-y-6">
                        <div className="bg-blue-900/20 p-6 rounded-xl border border-blue-500/20">
                            <h4 className="font-bold text-blue-300 mb-2">Política de Bloqueio</h4>
                            <p className="text-sm text-text-secondary">O sistema bloqueia automaticamente a presença em treinos e jogos para atletas com dívida superior a R$ 200,00 por mais de 30 dias.</p>
                        </div>
                    </div>
                </div>
            )}

            {(viewMode === 'OVERVIEW' || viewMode === 'EXPENSES') && (
                <div className="bg-secondary rounded-xl border border-white/5 overflow-hidden">
                    <table className="w-full text-sm text-left text-text-secondary">
                        <thead className="text-xs text-text-secondary uppercase bg-black/20 border-b border-white/5">
                            <tr>
                                <th className="px-4 py-3">Data</th>
                                <th className="px-4 py-3">Descrição</th>
                                <th className="px-4 py-3">Categoria</th>
                                <th className="px-4 py-3 text-right">Valor</th>
                                <th className="px-4 py-3 text-right">Validado Por</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.slice(0, 10).map((tx) => (
                                <tr key={tx.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                    <td className="px-4 py-3">{new Date(tx.date).toLocaleDateString()}</td>
                                    <td className="px-4 py-3">
                                        <p className="text-white font-bold">{tx.title}</p>
                                        {tx.aiGenerated && <span className="text-[9px] bg-purple-500/20 text-purple-300 px-1 rounded">IA + {tx.verifiedBy}</span>}
                                    </td>
                                    <td className="px-4 py-3"><span className="text-[10px] bg-white/10 px-2 py-0.5 rounded uppercase">{tx.category}</span></td>
                                    <td className={`px-4 py-3 text-right font-bold font-mono ${tx.type === 'INCOME' ? 'text-green-400' : 'text-red-400'}`}>
                                        {tx.type === 'INCOME' ? '+' : '-'} R$ {tx.amount.toFixed(2)}
                                    </td>
                                    <td className="px-4 py-3 text-right text-xs text-text-secondary">{tx.verifiedBy || 'Sistema'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            <Modal isOpen={isTxModalOpen} onClose={() => setIsTxModalOpen(false)} title="Nova Transação">
                <form onSubmit={handleSaveTransaction} className="space-y-4">
                    <div className="flex gap-2 mb-4 bg-black/20 p-1 rounded-lg">
                        <button type="button" onClick={() => setTxType('EXPENSE')} className={`flex-1 py-2 text-sm font-bold rounded ${txType === 'EXPENSE' ? 'bg-red-500 text-white' : 'text-text-secondary'}`}>Despesa</button>
                        <button type="button" onClick={() => setTxType('INCOME')} className={`flex-1 py-2 text-sm font-bold rounded ${txType === 'INCOME' ? 'bg-green-500 text-white' : 'text-text-secondary'}`}>Receita</button>
                    </div>

                    <div className={`bg-secondary/50 border border-dashed p-4 rounded-xl text-center mb-4 cursor-pointer hover:bg-white/5 transition-colors ${isAiFilled ? 'border-yellow-500/50 bg-yellow-500/5' : 'border-white/20'}`} onClick={handleScanClick}>
                        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
                        <div className="flex flex-col items-center gap-2">
                            {isScanning ? (
                                <div className="animate-spin h-6 w-6 border-2 border-highlight border-t-transparent rounded-full"></div>
                            ) : (
                                <ScanIcon className={`w-6 h-6 ${isAiFilled ? 'text-yellow-400' : 'text-highlight'}`} />
                            )}
                            <span className="text-xs font-bold text-white">
                                {isScanning ? 'Analisando Imagem...' : isAiFilled ? 'Documento Lido! Revise abaixo.' : 'Ler Comprovante (IA)'}
                            </span>
                            <span className="text-[10px] text-text-secondary">Foto de Nota Fiscal ou Recibo</span>
                        </div>
                    </div>

                    {isAiFilled && (
                        <div className="bg-yellow-900/20 p-2 rounded text-xs text-yellow-300 text-center mb-2 font-bold border border-yellow-500/30">
                            ⚠ Atenção: Verifique os valores preenchidos pela IA antes de salvar.
                        </div>
                    )}

                    <input className={`w-full bg-black/20 border rounded p-2 text-white transition-colors ${isAiFilled ? 'border-yellow-500/50 shadow-glow' : 'border-white/10'}`} placeholder="Título" value={txTitle} onChange={e => setTxTitle(e.target.value)} required />
                    <input type="number" className={`w-full bg-black/20 border rounded p-2 text-white transition-colors ${isAiFilled ? 'border-yellow-500/50 shadow-glow' : 'border-white/10'}`} placeholder="Valor" value={txAmount} onChange={e => setTxAmount(e.target.value)} required />
                    <input type="date" className={`w-full bg-black/20 border rounded p-2 text-white transition-colors ${isAiFilled ? 'border-yellow-500/50 shadow-glow' : 'border-white/10'}`} value={txDate} onChange={e => setTxDate(e.target.value)} required />
                    
                    <select className="w-full bg-black/20 border border-white/10 rounded p-2 text-white" value={txCategory} onChange={e => setTxCategory(e.target.value as any)}>
                        <option value="OTHER">Outros</option>
                        <option value="TRANSPORT">Transporte</option>
                        <option value="EQUIPMENT">Equipamento</option>
                        <option value="REFEREE">Arbitragem</option>
                        <option value="FIELD_RENTAL">Aluguel Campo</option>
                    </select>

                    <button type="submit" className="w-full bg-highlight hover:bg-highlight-hover text-white py-2 rounded font-bold flex items-center justify-center gap-2">
                        {isAiFilled && <CheckCircleIcon className="w-4 h-4" />}
                        {isAiFilled ? 'Validar & Salvar' : 'Salvar'}
                    </button>
                </form>
            </Modal>

            <Modal isOpen={isRecModalOpen} onClose={() => setIsRecModalOpen(false)} title="Gerar Cobrança">
                <div className="space-y-4">
                    <input className="w-full bg-black/20 border border-white/10 rounded p-2 text-white" placeholder="Título (ex: Mensalidade)" value={recTitle} onChange={e => setRecTitle(e.target.value)} />
                    <input type="number" className="w-full bg-black/20 border border-white/10 rounded p-2 text-white" placeholder="Valor Unitário" value={recAmount} onChange={e => setRecAmount(Number(e.target.value))} />
                    <input type="date" className="w-full bg-black/20 border border-white/10 rounded p-2 text-white" value={recDueDate} onChange={e => setRecDueDate(e.target.value)} />
                    <button onClick={handleCreateBulkReceivable} className="w-full bg-green-600 text-white py-2 rounded font-bold">Gerar para Todos</button>
                </div>
            </Modal>
        </div>
    );
};

export default Finance;