
import React, { useState, useEffect, useContext, useRef, useMemo } from 'react';
import Card from '../components/Card';
import { Invoice, Player, Transaction, EquipmentItem, TransactionCategory, Subscription, Budget, Bill } from '../types';
import { storageService } from '../services/storageService';
import { FinanceIcon } from '../components/icons/NavIcons';
import { WalletIcon, SparklesIcon, ScanIcon, RefreshIcon, PieChartIcon } from '../components/icons/UiIcons';
import { UserContext, UserContextType } from '../components/Layout';
import Modal from '../components/Modal';
import { authService } from '../services/authService';
import { useToast } from '../contexts/ToastContext';
import { scanFinancialDocument } from '../services/geminiService';

const Finance: React.FC = () => {
    const { currentRole } = useContext(UserContext) as UserContextType;
    const toast = useToast();
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    // Data State
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [players, setPlayers] = useState<Player[]>([]);
    const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
    const [budgets, setBudgets] = useState<Budget[]>([]);
    const [bills, setBills] = useState<Bill[]>([]);
    
    // View State
    const [viewMode, setViewMode] = useState<'OVERVIEW' | 'SUBSCRIPTIONS' | 'BILLS' | 'BUDGET' | 'RECOVERY'>('OVERVIEW');
    
    // Transaction Modal State
    const [isTxModalOpen, setIsTxModalOpen] = useState(false);
    const [txType, setTxType] = useState<'INCOME' | 'EXPENSE'>('EXPENSE');
    const [txTitle, setTxTitle] = useState('');
    const [txDesc, setTxDesc] = useState('');
    const [txAmount, setTxAmount] = useState('');
    const [txCategory, setTxCategory] = useState<TransactionCategory>('OTHER');
    const [txDate, setTxDate] = useState(new Date().toISOString().split('T')[0]);
    const [isScanning, setIsScanning] = useState(false);
    const [isAiFilled, setIsAiFilled] = useState(false);

    const isPlayer = currentRole === 'PLAYER';

    useEffect(() => {
        if (!isPlayer) {
            // Fix: Ensured all methods now exist in updated storageService.ts
            const loadData = () => {
                setTransactions(storageService.getTransactions());
                setInvoices(storageService.getInvoices());
                setPlayers(storageService.getPlayers());
                setSubscriptions(storageService.getSubscriptions());
                setBudgets(storageService.getBudgets());
                setBills(storageService.getBills());
            };
            loadData();
        }
    }, [isPlayer]);

    const handleScanClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setIsScanning(true);
            toast.info("IA analisando documento...");
            const reader = new FileReader();
            reader.readAsDataURL(e.target.files[0]);
            reader.onload = async () => {
                const base64 = reader.result as string;
                try {
                    const data = await scanFinancialDocument(base64);
                    setTxTitle(data.title || '');
                    setTxAmount(String(data.amount || ''));
                    setTxDate(data.date || new Date().toISOString().split('T')[0]);
                    if (data.category) setTxCategory(data.category as TransactionCategory);
                    setIsAiFilled(true);
                    toast.success("Dados extraídos!");
                } catch (err) {
                    toast.error("IA falhou na leitura.");
                }
                setIsScanning(false);
            };
        }
    };

    const handleSaveTransaction = (e: React.FormEvent) => {
        e.preventDefault();
        const user = authService.getCurrentUser();
        const newTx: Transaction = {
            id: `tx-${Date.now()}`,
            title: txTitle,
            // Fix: description is now a valid property in Transaction type
            description: txDesc,
            amount: Number(txAmount),
            type: txType,
            category: txCategory,
            date: new Date(txDate),
            status: 'PAID',
            aiGenerated: isAiFilled,
            verifiedBy: user?.name || 'Sistema'
        };
        const updated = [newTx, ...transactions];
        setTransactions(updated);
        storageService.saveTransactions(updated);
        
        if (txType === 'EXPENSE') {
            const updatedBudgets = budgets.map(b => b.category === txCategory ? { ...b, spent: b.spent + Number(txAmount) } : b);
            setBudgets(updatedBudgets);
            // Fix: saveBudgets exists in updated storageService.ts
            storageService.saveBudgets(updatedBudgets);
        }

        setIsTxModalOpen(false);
        toast.success("Transação registrada.");
    };

    const handleCreateSubscription = () => {
        // Mock simple subscription creation
        const newSub: Subscription = {
            id: `sub-${Date.now()}`,
            title: "Mensalidade Atleta",
            amount: 150,
            active: true,
            assignedTo: players.map(p => p.id),
            frequency: 'MONTHLY',
            nextBillingDate: new Date()
        };
        const updated = [...subscriptions, newSub];
        setSubscriptions(updated);
        // Fix: saveSubscriptions and generateMonthlyInvoices exist in updated storageService.ts
        storageService.saveSubscriptions(updated);
        storageService.generateMonthlyInvoices();
        toast.success("Plano mensal ativado!");
    };

    const totals = useMemo(() => {
        const inc = transactions.filter(t => t.type === 'INCOME').reduce((acc, t) => acc + t.amount, 0);
        const exp = transactions.filter(t => t.type === 'EXPENSE').reduce((acc, t) => acc + t.amount, 0);
        const proj = subscriptions.filter(s => s.active).reduce((acc, s) => acc + (s.amount * s.assignedTo.length), 0);
        const delinq = invoices.filter(i => i.status === 'OVERDUE').reduce((a,b)=>a+b.amount,0);
        const billsTotal = bills.filter(b => b.status === 'PENDING').reduce((a,b)=>a+b.amount,0);
        return { balance: inc - exp, projectedRevenue: proj, delinquencyTotal: delinq, pendingBills: billsTotal };
    }, [transactions, subscriptions, invoices, bills]);

    if (isPlayer) return <div className="p-8 text-center text-text-secondary">Diretoria apenas.</div>;

    return (
        <div className="space-y-6 pb-12 animate-fade-in relative">
             <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-secondary rounded-xl"><FinanceIcon className="text-highlight w-8 h-8" /></div>
                    <div>
                        <h2 className="text-3xl font-bold text-text-primary">Financeiro</h2>
                        <p className="text-text-secondary">Controle de Fluxo e Mensalidades.</p>
                    </div>
                </div>
                <button onClick={() => setIsTxModalOpen(true)} className="bg-highlight hover:bg-highlight-hover text-white px-6 py-2.5 rounded-xl font-bold">
                    + Lançar Transação
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="bg-gradient-to-br from-blue-900/40 to-secondary border-l-4 border-l-blue-500">
                    <p className="text-xs text-text-secondary font-bold uppercase">Saldo</p>
                    <p className="text-xl font-bold text-white">R$ {totals.balance.toFixed(2)}</p>
                </Card>
                <Card className="bg-gradient-to-br from-green-900/40 to-secondary border-l-4 border-l-green-500">
                    <p className="text-xs text-text-secondary font-bold uppercase">Recorrência</p>
                    <p className="text-xl font-bold text-green-400">R$ {totals.projectedRevenue.toFixed(2)}</p>
                </Card>
                <Card className="bg-gradient-to-br from-red-900/40 to-secondary border-l-4 border-l-red-500">
                    <p className="text-xs text-text-secondary font-bold uppercase">A Pagar</p>
                    <p className="text-xl font-bold text-red-400">R$ {totals.pendingBills.toFixed(2)}</p>
                </Card>
                <Card className="bg-gradient-to-br from-yellow-900/40 to-secondary border-l-4 border-l-yellow-500">
                    <p className="text-xs text-text-secondary font-bold uppercase">Inadimplência</p>
                    <p className="text-xl font-bold text-yellow-400">R$ {totals.delinquencyTotal.toFixed(2)}</p>
                </Card>
            </div>

            <div className="flex border-b border-white/10 overflow-x-auto">
                <button onClick={() => setViewMode('OVERVIEW')} className={`px-6 py-3 text-sm font-bold border-b-2 transition-colors ${viewMode === 'OVERVIEW' ? 'border-highlight text-highlight' : 'border-transparent text-text-secondary'}`}>Fluxo</button>
                <button onClick={() => setViewMode('SUBSCRIPTIONS')} className={`px-6 py-3 text-sm font-bold border-b-2 transition-colors ${viewMode === 'SUBSCRIPTIONS' ? 'border-green-500 text-green-400' : 'border-transparent text-text-secondary'}`}>Assinaturas</button>
                <button onClick={() => setViewMode('BUDGET')} className={`px-6 py-3 text-sm font-bold border-b-2 transition-colors ${viewMode === 'BUDGET' ? 'border-blue-500 text-blue-400' : 'border-transparent text-text-secondary'}`}>Orçamento</button>
            </div>

            {viewMode === 'OVERVIEW' && (
                <Card title="Últimas Transações">
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="bg-black/20 text-xs font-bold uppercase">
                                <tr><th className="px-4 py-2">Data</th><th className="px-4 py-2">Título</th><th className="px-4 py-2 text-right">Valor</th></tr>
                            </thead>
                            <tbody>
                                {transactions.slice(0, 10).map(tx => (
                                    <tr key={tx.id} className="border-b border-white/5">
                                        <td className="px-4 py-2 text-text-secondary">{new Date(tx.date).toLocaleDateString()}</td>
                                        <td className="px-4 py-2 text-white">{tx.title}</td>
                                        <td className={`px-4 py-2 text-right font-bold ${tx.type === 'INCOME' ? 'text-green-400' : 'text-red-400'}`}>
                                            R$ {tx.amount.toFixed(2)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </Card>
            )}

            <Modal isOpen={isTxModalOpen} onClose={() => setIsTxModalOpen(false)} title="Nova Transação">
                <form onSubmit={handleSaveTransaction} className="space-y-4">
                    <div className="flex gap-2 p-1 bg-black/20 rounded-lg">
                        <button type="button" onClick={() => setTxType('EXPENSE')} className={`flex-1 py-2 text-sm font-bold rounded ${txType === 'EXPENSE' ? 'bg-red-500 text-white' : 'text-text-secondary'}`}>Despesa</button>
                        <button type="button" onClick={() => setTxType('INCOME')} className={`flex-1 py-2 text-sm font-bold rounded ${txType === 'INCOME' ? 'bg-green-500 text-white' : 'text-text-secondary'}`}>Receita</button>
                    </div>
                    <div onClick={handleScanClick} className="bg-secondary/50 border border-dashed border-white/20 p-4 rounded-xl text-center cursor-pointer hover:bg-white/5">
                        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
                        <div className="flex flex-col items-center gap-2">
                            {isScanning ? <div className="animate-spin rounded-full h-5 w-5 border-2 border-highlight border-t-transparent"></div> : <ScanIcon className="text-highlight w-6 h-6" />}
                            <p className="text-xs font-bold text-white">{isScanning ? 'Lendo...' : 'Escanear Recibo (IA)'}</p>
                        </div>
                    </div>
                    <input className="w-full bg-black/20 border border-white/10 rounded p-2 text-white" placeholder="Título" value={txTitle} onChange={e => setTxTitle(e.target.value)} required />
                    <input type="number" className="w-full bg-black/20 border border-white/10 rounded p-2 text-white" placeholder="Valor" value={txAmount} onChange={e => setTxAmount(e.target.value)} required />
                    <textarea className="w-full bg-black/20 border border-white/10 rounded p-2 text-white h-20" placeholder="Observações" value={txDesc} onChange={e => setTxDesc(e.target.value)} />
                    <button type="submit" className="w-full bg-highlight text-white py-2 rounded font-bold">Salvar</button>
                </form>
            </Modal>
        </div>
    );
};

export default Finance;
