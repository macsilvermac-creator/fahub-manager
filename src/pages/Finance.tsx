
import React, { useState, useEffect, useContext, useRef, useMemo } from 'react';
import Card from '../components/Card';
import { Invoice, Player, Transaction, EquipmentItem, TransactionCategory, Subscription, Budget, Bill } from '../types';
import { storageService, LEGAL_DOCUMENTS } from '../services/storageService';
import { FinanceIcon } from '../components/icons/NavIcons';
import { WalletIcon, AlertCircleIcon, SparklesIcon, AlertTriangleIcon, ScanIcon, CheckCircleIcon, RefreshIcon, HandshakeIcon, PieChartIcon, BuildingIcon, ClockIcon } from '../components/icons/UiIcons';
import { UserContext, UserContextType } from '../components/Layout';
import Modal from '../components/Modal';
import { authService } from '../services/authService';
import { useToast } from '../contexts/ToastContext';
import { scanFinancialDocument } from '../services/geminiService';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

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

    // Subscription Modal
    const [isSubModalOpen, setIsSubModalOpen] = useState(false);
    const [subTitle, setSubTitle] = useState('');
    const [subAmount, setSubAmount] = useState(0);

    const isPlayer = currentRole === 'PLAYER';

    useEffect(() => {
        if (!isPlayer) {
            // Load data asynchronously to avoid blocking render
            setTimeout(() => {
                setTransactions(storageService.getTransactions());
                setInvoices(storageService.getInvoices());
                setPlayers(storageService.getPlayers());
                setSubscriptions(storageService.getSubscriptions());
                setBudgets(storageService.getBudgets());
                setBills(storageService.getBills());
            }, 0);
        }
    }, [isPlayer]);

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
                        setIsAiFilled(true);
                        toast.success("Dados extraídos! Por favor, REVISE antes de salvar.");
                    } catch (aiError) {
                        toast.error("IA não conseguiu ler o documento.");
                    }
                    setIsScanning(false);
                };
            } catch (err) {
                toast.error("Erro ao processar arquivo.");
                setIsScanning(false);
            }
        }
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
        
        // Update Budget Spent if Expense
        if (txType === 'EXPENSE') {
            const budget = budgets.find(b => b.category === txCategory);
            if (budget) {
                const updatedBudgets = budgets.map(b => b.category === txCategory ? { ...b, spent: b.spent + Number(txAmount) } : b);
                setBudgets(updatedBudgets);
                storageService.saveBudgets(updatedBudgets);
            }
        }

        setIsTxModalOpen(false);
        setIsAiFilled(false);
        toast.success("Transação registrada.");
        setTxTitle(''); setTxAmount(''); setTxDesc('');
    };

    const handleCreateSubscription = (e: React.FormEvent) => {
        e.preventDefault();
        const newSub: Subscription = {
            id: `sub-${Date.now()}`,
            title: subTitle,
            amount: subAmount,
            frequency: 'MONTHLY',
            active: true,
            nextBillingDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
            assignedTo: players.map(p => p.id) // Default all active
        };
        const updated = [...subscriptions, newSub];
        setSubscriptions(updated);
        storageService.saveSubscriptions(updated);
        setIsSubModalOpen(false);
        toast.success("Plano recorrente criado!");
        
        // Trigger initial invoices
        storageService.generateMonthlyInvoices();
    };

    // CALCULATIONS (Memoized for Performance)
    const { totalIncome, totalExpense, balance, projectedRevenue, delinquencyTotal, pendingBills } = useMemo(() => {
        const inc = transactions.filter(t => t.type === 'INCOME').reduce((acc, t) => acc + t.amount, 0);
        const exp = transactions.filter(t => t.type === 'EXPENSE').reduce((acc, t) => acc + t.amount, 0);
        const proj = subscriptions.filter(s => s.active).reduce((acc, s) => acc + (s.amount * s.assignedTo.length), 0);
        const delinq = invoices.filter(i => i.status === 'OVERDUE').reduce((a,b)=>a+b.amount,0);
        const billsTotal = bills.filter(b => b.status === 'PENDING').reduce((a,b)=>a+b.amount,0);

        return {
            totalIncome: inc,
            totalExpense: exp,
            balance: inc - exp,
            projectedRevenue: proj,
            delinquencyTotal: delinq,
            pendingBills: billsTotal
        };
    }, [transactions, subscriptions, invoices, bills]);

    const budgetData = useMemo(() => {
        return budgets.map(b => ({
            name: b.category,
            spent: b.spent,
            limit: b.limit,
            percentage: Math.min(100, (b.spent / b.limit) * 100)
        }));
    }, [budgets]);

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
                        <p className="text-text-secondary">ERP: Caixa, Assinaturas e Orçamentos.</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <button onClick={() => setIsTxModalOpen(true)} className="bg-highlight hover:bg-highlight-hover text-white px-6 py-2.5 rounded-xl font-bold shadow-lg flex items-center gap-2">
                        <span>+</span> Lançar Transação
                    </button>
                </div>
            </div>

            {/* KPI CARDS */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="bg-gradient-to-br from-blue-900/40 to-secondary border-l-4 border-l-blue-500">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-500/20 rounded-lg text-blue-400"><SparklesIcon className="h-6 w-6" /></div>
                        <div><p className="text-xs text-text-secondary font-bold uppercase">Saldo Atual</p><p className={`text-xl font-bold ${balance >= 0 ? 'text-white' : 'text-red-500'}`}>R$ {balance.toFixed(2)}</p></div>
                    </div>
                </Card>
                <Card className="bg-gradient-to-br from-green-900/40 to-secondary border-l-4 border-l-green-500">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-500/20 rounded-lg text-green-400"><RefreshIcon className="h-6 w-6" /></div>
                        <div><p className="text-xs text-text-secondary font-bold uppercase">Recorrência (ARR)</p><p className="text-xl font-bold text-green-400">R$ {projectedRevenue.toFixed(2)}</p></div>
                    </div>
                </Card>
                <Card className="bg-gradient-to-br from-red-900/40 to-secondary border-l-4 border-l-red-500">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-red-500/20 rounded-lg text-red-400"><AlertCircleIcon className="h-6 w-6" /></div>
                        <div><p className="text-xs text-text-secondary font-bold uppercase">A Pagar (Bills)</p><p className="text-xl font-bold text-red-400">R$ {pendingBills.toFixed(2)}</p></div>
                    </div>
                </Card>
                <Card className="bg-gradient-to-br from-yellow-900/40 to-secondary border-l-4 border-l-yellow-500">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-yellow-500/20 rounded-lg text-yellow-400"><AlertTriangleIcon className="h-6 w-6" /></div>
                        <div><p className="text-xs text-text-secondary font-bold uppercase">Inadimplência</p><p className="text-xl font-bold text-yellow-400">R$ {delinquencyTotal.toFixed(2)}</p></div>
                    </div>
                </Card>
            </div>

            {/* NAVIGATION TABS */}
            <div className="flex border-b border-white/10 overflow-x-auto">
                <button onClick={() => setViewMode('OVERVIEW')} className={`px-6 py-3 text-sm font-bold border-b-2 transition-colors whitespace-nowrap flex items-center gap-2 ${viewMode === 'OVERVIEW' ? 'border-highlight text-highlight' : 'border-transparent text-text-secondary'}`}>
                    <WalletIcon className="w-4 h-4"/> Fluxo de Caixa
                </button>
                <button onClick={() => setViewMode('SUBSCRIPTIONS')} className={`px-6 py-3 text-sm font-bold border-b-2 transition-colors whitespace-nowrap flex items-center gap-2 ${viewMode === 'SUBSCRIPTIONS' ? 'border-green-500 text-green-400' : 'border-transparent text-text-secondary'}`}>
                    <RefreshIcon className="w-4 h-4"/> Assinaturas
                </button>
                <button onClick={() => setViewMode('BUDGET')} className={`px-6 py-3 text-sm font-bold border-b-2 transition-colors whitespace-nowrap flex items-center gap-2 ${viewMode === 'BUDGET' ? 'border-blue-500 text-blue-400' : 'border-transparent text-text-secondary'}`}>
                    <PieChartIcon className="w-4 h-4"/> Orçamento
                </button>
                <button onClick={() => setViewMode('BILLS')} className={`px-6 py-3 text-sm font-bold border-b-2 transition-colors whitespace-nowrap flex items-center gap-2 ${viewMode === 'BILLS' ? 'border-red-500 text-red-400' : 'border-transparent text-text-secondary'}`}>
                    <BuildingIcon className="w-4 h-4"/> Contas a Pagar
                </button>
                <button onClick={() => setViewMode('RECOVERY')} className={`px-6 py-3 text-sm font-bold border-b-2 transition-colors whitespace-nowrap flex items-center gap-2 ${viewMode === 'RECOVERY' ? 'border-yellow-500 text-yellow-400' : 'border-transparent text-text-secondary'}`}>
                    <HandshakeIcon className="w-4 h-4"/> Acordos
                </button>
            </div>

            {/* VIEW: OVERVIEW */}
            {viewMode === 'OVERVIEW' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-slide-in">
                    <Card title="Últimas Transações">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left text-text-secondary">
                                <thead className="bg-black/20 text-xs font-bold uppercase">
                                    <tr>
                                        <th className="px-4 py-2">Data</th>
                                        <th className="px-4 py-2">Descrição</th>
                                        <th className="px-4 py-2 text-right">Valor</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {transactions.slice(0, 8).map(tx => (
                                        <tr key={tx.id} className="border-b border-white/5 hover:bg-white/5">
                                            <td className="px-4 py-2">{new Date(tx.date).toLocaleDateString()}</td>
                                            <td className="px-4 py-2 text-white">{tx.title}</td>
                                            <td className={`px-4 py-2 text-right font-mono font-bold ${tx.type === 'INCOME' ? 'text-green-400' : 'text-red-400'}`}>
                                                {tx.type === 'INCOME' ? '+' : '-'} R$ {tx.amount.toFixed(2)}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                    <div className="space-y-6">
                        <div className="bg-secondary p-6 rounded-xl border border-white/5 text-center">
                            <h3 className="text-white font-bold text-lg mb-2">Acesso Rápido</h3>
                            <div className="grid grid-cols-2 gap-4">
                                <button className="bg-white/5 hover:bg-white/10 p-4 rounded-lg text-sm text-text-secondary hover:text-white transition-colors">
                                    Relatório DRE
                                </button>
                                <button className="bg-white/5 hover:bg-white/10 p-4 rounded-lg text-sm text-text-secondary hover:text-white transition-colors">
                                    Extrato Bancário
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* VIEW: SUBSCRIPTIONS */}
            {viewMode === 'SUBSCRIPTIONS' && (
                <div className="space-y-6 animate-slide-in">
                    <div className="flex justify-between items-center">
                        <h3 className="text-xl font-bold text-white">Planos de Receita Recorrente</h3>
                        <button onClick={() => setIsSubModalOpen(true)} className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-lg text-xs font-bold">
                            + Novo Plano
                        </button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {subscriptions.map(sub => (
                            <div key={sub.id} className="bg-secondary p-6 rounded-xl border border-white/5 relative overflow-hidden group hover:border-green-500/50 transition-all">
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <RefreshIcon className="w-16 h-16 text-green-500" />
                                </div>
                                <h4 className="text-lg font-bold text-white mb-1">{sub.title}</h4>
                                <p className="text-3xl font-black text-green-400 mb-4">R$ {sub.amount.toFixed(2)}<span className="text-sm text-text-secondary font-normal">/mês</span></p>
                                <div className="space-y-2 text-xs text-text-secondary">
                                    <p>Assinantes: <strong className="text-white">{sub.assignedTo.length}</strong></p>
                                    <p>Próxima Cobrança: <strong className="text-white">{new Date(sub.nextBillingDate).toLocaleDateString()}</strong></p>
                                    <p>Status: <span className="text-green-400 font-bold">ATIVO</span></p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* VIEW: BUDGETS */}
            {viewMode === 'BUDGET' && (
                <div className="space-y-6 animate-slide-in">
                    <Card title="Controle Orçamentário (Real vs Orçado)">
                        <div className="space-y-6">
                            {budgetData.length === 0 && <p className="text-text-secondary italic">Nenhum orçamento definido.</p>}
                            {budgetData.map((b, idx) => (
                                <div key={idx} className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-white font-bold uppercase">{b.name}</span>
                                        <span className="text-text-secondary">R$ {b.spent.toFixed(2)} / <span className="text-white">R$ {b.limit.toFixed(2)}</span></span>
                                    </div>
                                    <div className="w-full bg-black/40 h-4 rounded-full overflow-hidden border border-white/5">
                                        <div 
                                            className={`h-full transition-all duration-1000 ${b.percentage > 100 ? 'bg-red-500' : b.percentage > 80 ? 'bg-yellow-500' : 'bg-blue-500'}`} 
                                            style={{width: `${Math.min(100, b.percentage)}%`}}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
            )}

            {/* TRANSACTION MODAL */}
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
                        </div>
                    </div>

                    <input className="w-full bg-black/20 border border-white/10 rounded p-2 text-white" placeholder="Título" value={txTitle} onChange={e => setTxTitle(e.target.value)} required />
                    <input type="number" className="w-full bg-black/20 border border-white/10 rounded p-2 text-white" placeholder="Valor" value={txAmount} onChange={e => setTxAmount(e.target.value)} required />
                    
                    <button type="submit" className="w-full bg-highlight hover:bg-highlight-hover text-white py-2 rounded font-bold">Salvar</button>
                </form>
            </Modal>
            
            {/* SUBSCRIPTION MODAL */}
            <Modal isOpen={isSubModalOpen} onClose={() => setIsSubModalOpen(false)} title="Novo Plano Recorrente">
                <form onSubmit={handleCreateSubscription} className="space-y-4">
                    <input className="w-full bg-black/20 border border-white/10 rounded p-2 text-white" placeholder="Nome (Ex: Mensalidade 2025)" value={subTitle} onChange={e => setSubTitle(e.target.value)} required />
                    <input type="number" className="w-full bg-black/20 border border-white/10 rounded p-2 text-white" placeholder="Valor Mensal (R$)" value={subAmount} onChange={e => setSubAmount(Number(e.target.value))} required />
                    <p className="text-xs text-text-secondary">Será cobrado mensalmente de todos os atletas ativos.</p>
                    <button type="submit" className="w-full bg-green-600 text-white py-2 rounded font-bold">Criar Assinatura</button>
                </form>
            </Modal>
        </div>
    );
};

export default Finance;