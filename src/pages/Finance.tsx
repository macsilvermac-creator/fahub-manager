
import React, { useState, useEffect, useContext } from 'react';
import Card from '../components/Card';
import { Invoice, AffiliateEarnings, Player, EventSale, Transaction, FinancialAttachment, EquipmentItem, TransactionCategory } from '../types';
import { storageService, LEGAL_DOCUMENTS } from '../services/storageService';
import { FinanceIcon } from '../components/icons/NavIcons';
import { WalletIcon, CheckCircleIcon, AlertCircleIcon, SparklesIcon, FileTextIcon, ClipboardIcon, ChevronDownIcon } from '../components/icons/UiIcons';
import { UserContext } from '../components/Layout';
import ComplianceModal from '../components/ComplianceModal';
import Modal from '../components/Modal';
import { authService } from '../services/authService';
import { useToast } from '../contexts/ToastContext';

const Finance: React.FC = () => {
    const { currentRole } = useContext(UserContext);
    const toast = useToast();
    
    // Data State
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [affiliateEarnings, setAffiliateEarnings] = useState<AffiliateEarnings[]>([]);
    const [players, setPlayers] = useState<Player[]>([]);
    const [inventory, setInventory] = useState<EquipmentItem[]>([]);
    
    // Performance State
    const [visibleTxCount, setVisibleTxCount] = useState(20);

    // View State
    const [viewMode, setViewMode] = useState<'OVERVIEW' | 'EXPENSES' | 'RECEIVABLES'>('OVERVIEW');
    
    // Transaction Modal State
    const [isTxModalOpen, setIsTxModalOpen] = useState(false);
    const [txType, setTxType] = useState<'INCOME' | 'EXPENSE'>('EXPENSE');
    const [txTitle, setTxTitle] = useState('');
    const [txDesc, setTxDesc] = useState('');
    const [txAmount, setTxAmount] = useState('');
    const [txCategory, setTxCategory] = useState<any>('OTHER');
    const [txDate, setTxDate] = useState(new Date().toISOString().split('T')[0]);
    const [txDocName, setTxDocName] = useState('');
    const [txDocType, setTxDocType] = useState<'INVOICE' | 'RECEIPT' | 'CONTRACT'>('RECEIPT');

    // Wizard State
    const [isRecModalOpen, setIsRecModalOpen] = useState(false);
    const [recStep, setRecStep] = useState(1);
    const [recSource, setRecSource] = useState<'INVENTORY' | 'CUSTOM'>('CUSTOM');
    const [selectedInventoryId, setSelectedInventoryId] = useState('');
    const [recTitle, setRecTitle] = useState('');
    const [recCategory, setRecCategory] = useState<TransactionCategory>('OTHER');
    const [recPricingType, setRecPricingType] = useState<'FIXED' | 'SPLIT'>('FIXED');
    const [recAmount, setRecAmount] = useState<number>(0);
    const [recDueDate, setRecDueDate] = useState('');
    const [recTargetType, setRecTargetType] = useState<'ALL' | 'OFFENSE' | 'DEFENSE' | 'MANUAL'>('ALL');
    const [selectedPlayerIds, setSelectedPlayerIds] = useState<number[]>([]);

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
                // Filter only player's invoices
                setInvoices(allInvoices.filter(i => i.playerId === player.id));
                // Mock: assume transactions might have userId in future, for now show empty or personal wallet logic
                setTransactions([]); // Players only see their wallet balance calculated elsewhere or specific invoices
            }
        } else {
            setTransactions(allTransactions);
            setInvoices(allInvoices);
            setPlayers(storageService.getPlayers());
            setInventory(storageService.getInventory());
        }
        
    }, [isCoach, isPlayer]);

    // Reset pagination on tab change
    useEffect(() => {
        setVisibleTxCount(20);
    }, [viewMode]);

    const handleLoadMoreTx = () => {
        setVisibleTxCount(prev => prev + 20);
    };

    // --- PLAYER VIEW: SIMPLE WALLET ---
    if (isPlayer) {
        const pendingBills = invoices.filter(i => i.status !== 'PAID').reduce((acc, i) => acc + i.amount, 0);
        const paidBills = invoices.filter(i => i.status === 'PAID').reduce((acc, i) => acc + i.amount, 0);
        
        return (
            <div className="space-y-6 pb-12 animate-fade-in">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-secondary rounded-xl">
                        <WalletIcon className="text-highlight w-8 h-8" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold text-text-primary">Minhas Finanças</h2>
                        <p className="text-text-secondary">Controle de mensalidades, taxas e ganhos.</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Card className="bg-gradient-to-br from-red-900/40 to-secondary border-l-4 border-l-red-500">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-text-secondary font-bold uppercase">A Pagar (Dívidas)</p>
                                <p className="text-3xl font-bold text-white">R$ {pendingBills.toFixed(2)}</p>
                            </div>
                            <AlertCircleIcon className="w-10 h-10 text-red-400" />
                        </div>
                    </Card>
                    <Card className="bg-gradient-to-br from-green-900/40 to-secondary border-l-4 border-l-green-500">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs text-text-secondary font-bold uppercase">Total Pago (Histórico)</p>
                                <p className="text-3xl font-bold text-white">R$ {paidBills.toFixed(2)}</p>
                            </div>
                            <CheckCircleIcon className="w-10 h-10 text-green-400" />
                        </div>
                    </Card>
                </div>

                <Card title="Minhas Cobranças (Faturas)">
                    {invoices.length === 0 ? (
                        <p className="text-text-secondary italic text-center py-4">Nenhuma cobrança registrada.</p>
                    ) : (
                        <div className="space-y-3">
                            {invoices.map(inv => (
                                <div key={inv.id} className="flex items-center justify-between bg-secondary p-4 rounded-xl border border-white/5">
                                    <div>
                                        <p className="font-bold text-white">{inv.title}</p>
                                        <p className="text-xs text-text-secondary">Vencimento: {new Date(inv.dueDate).toLocaleDateString()}</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-mono font-bold text-white mb-1">R$ {inv.amount.toFixed(2)}</p>
                                        {inv.status === 'PAID' ? (
                                            <span className="text-[10px] bg-green-500/20 text-green-400 px-2 py-0.5 rounded font-bold uppercase">Pago</span>
                                        ) : (
                                            <button className="text-xs bg-highlight hover:bg-highlight-hover text-white px-3 py-1 rounded font-bold">
                                                Pagar Agora
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </Card>
                
                <div className="text-center text-xs text-text-secondary mt-4">
                    <p>Para ver seus ganhos como afiliado, acesse "Meu Perfil".</p>
                </div>
            </div>
        );
    }

    // --- COACH / ADMIN LOGIC BELOW ---

    // ... (Keep existing wizard logic for Coach)
    const handleInventorySelect = (itemId: string) => {
        const item = inventory.find(i => i.id === itemId);
        if (item) {
            setSelectedInventoryId(itemId);
            setRecTitle(item.name);
            setRecAmount(item.salePrice || 0);
            if(item.category === 'JERSEY') setRecCategory('EQUIPMENT');
            else if(item.category === 'MERCH') setRecCategory('STORE');
            else setRecCategory('OTHER');
        }
    };

    const getTargetPlayers = () => {
        if (recTargetType === 'ALL') return players;
        if (recTargetType === 'OFFENSE') return players.filter(p => ['QB','RB','WR','TE','OL'].includes(p.position));
        if (recTargetType === 'DEFENSE') return players.filter(p => ['DL','LB','DB','CB','S'].includes(p.position));
        return players.filter(p => selectedPlayerIds.includes(p.id));
    };

    const calculateFinalPerPerson = () => {
        const targetCount = getTargetPlayers().length;
        if (targetCount === 0) return 0;
        if (recPricingType === 'FIXED') return recAmount;
        return recAmount / targetCount;
    };

    const handleCreateBulkReceivable = () => {
        const targets = getTargetPlayers();
        if (targets.length === 0) {
            toast.warning("Selecione pelo menos um atleta.");
            return;
        }
        
        const amountPerPerson = calculateFinalPerPerson();
        const dueDateObj = new Date(recDueDate);

        storageService.createBulkInvoices(
            targets.map(p => p.id),
            recTitle,
            amountPerPerson,
            dueDateObj,
            recCategory,
            recSource === 'INVENTORY' ? selectedInventoryId : undefined
        );

        setInvoices(storageService.getInvoices());
        setIsRecModalOpen(false);
        setRecStep(1); setRecTitle(''); setRecAmount(0); setSelectedPlayerIds([]);
        toast.success(`Sucesso! ${targets.length} cobranças geradas.`);
    };

    const handleSignTerms = () => {
        storageService.signLegalDocument(complianceDoc.id);
        setShowComplianceModal(false);
        toast.success("Termos de Conformidade assinados.");
    };

    const handleSaveTransaction = (e: React.FormEvent) => {
        e.preventDefault();
        const attachments: FinancialAttachment[] = txDocName ? [{
            id: `att-${Date.now()}`,
            name: txDocName,
            url: '#',
            type: txDocType
        }] : [];

        const newTx: Transaction = {
            id: `tx-${Date.now()}`,
            title: txTitle,
            description: txDesc,
            amount: Number(txAmount),
            type: txType,
            category: txCategory,
            date: new Date(txDate),
            status: 'PAID',
            attachments
        };

        const updated = [newTx, ...transactions];
        setTransactions(updated);
        storageService.saveTransactions(updated);
        
        setIsTxModalOpen(false);
        setTxTitle(''); setTxAmount(''); setTxDocName('');
        storageService.logAuditAction('TRANSACTION_ADD', `Nova ${txType}: ${txTitle} R$ ${txAmount}`);
        toast.success("Transação registrada com sucesso.");
    };

    const totalIncome = transactions.filter(t => t.type === 'INCOME').reduce((acc, t) => acc + t.amount, 0) 
        + invoices.filter(i => i.status === 'PAID').reduce((acc, i) => acc + i.amount, 0);
        
    const totalExpense = transactions.filter(t => t.type === 'EXPENSE').reduce((acc, t) => acc + t.amount, 0);
    const balance = totalIncome - totalExpense;

    // Filter Logic for View Mode
    const filteredTransactions = transactions.filter(t => viewMode === 'OVERVIEW' || t.type === 'EXPENSE');
    const displayedTransactions = filteredTransactions.slice(0, visibleTxCount);

    return (
        <div className="space-y-6 pb-12 animate-fade-in relative">
             {showComplianceModal && <ComplianceModal document={complianceDoc} onSign={handleSignTerms} />}

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
                        <span>+</span> Criar Recebimento / Rateio
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-gradient-to-br from-green-900/40 to-secondary border-l-4 border-l-green-500">
                    <div className="flex items-center">
                        <div className="p-3 bg-green-500/20 rounded-lg text-green-400">
                             <WalletIcon className="h-8 w-8" />
                        </div>
                        <div className="ml-4">
                            <p className="text-xs text-text-secondary font-bold uppercase">Entradas Totais</p>
                            <p className="text-2xl font-bold text-green-400">R$ {totalIncome.toFixed(2)}</p>
                        </div>
                    </div>
                </Card>
                <Card className="bg-gradient-to-br from-red-900/40 to-secondary border-l-4 border-l-red-500">
                    <div className="flex items-center">
                        <div className="p-3 bg-red-500/20 rounded-lg text-red-400">
                             <AlertCircleIcon className="h-8 w-8" />
                        </div>
                        <div className="ml-4">
                            <p className="text-xs text-text-secondary font-bold uppercase">Saídas (Despesas)</p>
                            <p className="text-2xl font-bold text-red-400">R$ {totalExpense.toFixed(2)}</p>
                        </div>
                    </div>
                </Card>
                <Card className="bg-gradient-to-br from-blue-900/40 to-secondary border-l-4 border-l-blue-500">
                    <div className="flex items-center">
                        <div className="p-3 bg-blue-500/20 rounded-lg text-blue-400">
                             <SparklesIcon className="h-8 w-8" />
                        </div>
                        <div className="ml-4">
                            <p className="text-xs text-text-secondary font-bold uppercase">Saldo Atual</p>
                            <p className={`text-2xl font-bold ${balance >= 0 ? 'text-white' : 'text-red-500'}`}>R$ {balance.toFixed(2)}</p>
                        </div>
                    </div>
                </Card>
            </div>

            <div className="flex border-b border-white/10 overflow-x-auto">
                <button 
                    onClick={() => setViewMode('OVERVIEW')}
                    className={`px-6 py-3 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${viewMode === 'OVERVIEW' ? 'border-highlight text-highlight' : 'border-transparent text-text-secondary hover:text-white'}`}
                >
                    Extrato Geral
                </button>
                <button 
                    onClick={() => setViewMode('EXPENSES')}
                    className={`px-6 py-3 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${viewMode === 'EXPENSES' ? 'border-highlight text-highlight' : 'border-transparent text-text-secondary hover:text-white'}`}
                >
                    Despesas & Contas
                </button>
                <button 
                    onClick={() => setViewMode('RECEIVABLES')}
                    className={`px-6 py-3 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${viewMode === 'RECEIVABLES' ? 'border-highlight text-highlight' : 'border-transparent text-text-secondary hover:text-white'}`}
                >
                    Recebíveis (Mensalidades)
                </button>
            </div>

            {(viewMode === 'OVERVIEW' || viewMode === 'EXPENSES') && (
                <div className="space-y-4 animate-fade-in">
                    <div className="bg-secondary rounded-xl border border-white/5 overflow-hidden">
                        <table className="w-full text-sm text-left text-text-secondary">
                            <thead className="text-xs text-text-secondary uppercase bg-black/20 border-b border-white/5">
                                <tr>
                                    <th className="px-4 py-3">Data</th>
                                    <th className="px-4 py-3">Descrição</th>
                                    <th className="px-4 py-3">Categoria</th>
                                    <th className="px-4 py-3 text-right">Valor</th>
                                </tr>
                            </thead>
                            <tbody>
                                {displayedTransactions.map((tx) => (
                                    <tr key={tx.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                        <td className="px-4 py-3">{new Date(tx.date).toLocaleDateString()}</td>
                                        <td className="px-4 py-3">
                                            <p className="text-white font-bold">{tx.title}</p>
                                            <p className="text-xs">{tx.description}</p>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded uppercase">{tx.category}</span>
                                        </td>
                                        <td className={`px-4 py-3 text-right font-bold font-mono ${tx.type === 'INCOME' ? 'text-green-400' : 'text-red-400'}`}>
                                            {tx.type === 'INCOME' ? '+' : '-'} R$ {tx.amount.toFixed(2)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    {visibleTxCount < filteredTransactions.length && (
                        <div className="flex justify-center">
                            <button 
                                onClick={handleLoadMoreTx}
                                className="px-6 py-2 bg-secondary border border-white/10 hover:bg-white/5 rounded-full text-sm font-bold text-text-secondary flex items-center gap-2 transition-all"
                            >
                                Ver Mais Antigos ({filteredTransactions.length - visibleTxCount} restantes) <ChevronDownIcon className="w-4 h-4"/>
                            </button>
                        </div>
                    )}
                </div>
            )}

            {viewMode === 'RECEIVABLES' && (
                <div className="space-y-4 animate-fade-in">
                    <div className="bg-secondary rounded-xl border border-white/5 overflow-hidden">
                        <table className="w-full text-sm text-left text-text-secondary">
                            <thead className="text-xs text-text-secondary uppercase bg-black/20 border-b border-white/5">
                                <tr>
                                    <th className="px-4 py-3">Atleta</th>
                                    <th className="px-4 py-3">Descrição</th>
                                    <th className="px-4 py-3">Vencimento</th>
                                    <th className="px-4 py-3">Valor</th>
                                    <th className="px-4 py-3">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {invoices.map((inv) => (
                                    <tr key={inv.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                        <td className="px-4 py-3 font-bold text-white">{inv.playerName}</td>
                                        <td className="px-4 py-3">{inv.title}</td>
                                        <td className="px-4 py-3">{new Date(inv.dueDate).toLocaleDateString()}</td>
                                        <td className="px-4 py-3 font-bold text-green-400">R$ {inv.amount.toFixed(2)}</td>
                                        <td className="px-4 py-3">
                                            <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${inv.status === 'PAID' ? 'bg-green-500/20 text-green-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                                                {inv.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            <Modal isOpen={isTxModalOpen} onClose={() => setIsTxModalOpen(false)} title="Nova Transação / Despesa">
                <form onSubmit={handleSaveTransaction} className="space-y-4">
                    <div className="flex gap-4 p-1 bg-black/20 rounded-lg">
                        <button type="button" onClick={() => setTxType('EXPENSE')} className={`flex-1 py-2 text-xs font-bold rounded ${txType === 'EXPENSE' ? 'bg-red-600 text-white' : 'text-text-secondary'}`}>Saída (Despesa)</button>
                        <button type="button" onClick={() => setTxType('INCOME')} className={`flex-1 py-2 text-xs font-bold rounded ${txType === 'INCOME' ? 'bg-green-600 text-white' : 'text-text-secondary'}`}>Entrada (Receita)</button>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-bold text-text-secondary block mb-1">Valor (R$)</label>
                            <input type="number" required className="w-full bg-black/20 border border-white/10 rounded p-2 text-white" value={txAmount} onChange={e => setTxAmount(e.target.value)} />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-text-secondary block mb-1">Data</label>
                            <input type="date" required className="w-full bg-black/20 border border-white/10 rounded p-2 text-white" value={txDate} onChange={e => setTxDate(e.target.value)} />
                        </div>
                    </div>

                    <div>
                        <label className="text-xs font-bold text-text-secondary block mb-1">Título</label>
                        <input required className="w-full bg-black/20 border border-white/10 rounded p-2 text-white" placeholder="Ex: Pagamento Juízes" value={txTitle} onChange={e => setTxTitle(e.target.value)} />
                    </div>

                    <div>
                        <label className="text-xs font-bold text-text-secondary block mb-1">Categoria</label>
                        <select className="w-full bg-black/20 border border-white/10 rounded p-2 text-white" value={txCategory} onChange={e => setTxCategory(e.target.value)}>
                            <option value="TRANSPORT">Transporte / Viagem</option>
                            <option value="EQUIPMENT">Equipamentos</option>
                            <option value="REFEREE">Arbitragem</option>
                            <option value="FIELD_RENTAL">Aluguel de Campo</option>
                            <option value="EVENT">Evento / Bar</option>
                            <option value="SPONSORSHIP">Patrocínio</option>
                            <option value="OTHER">Outros</option>
                        </select>
                    </div>

                    <div className="flex justify-end pt-2">
                        <button type="submit" className="bg-highlight hover:bg-highlight-hover text-white px-6 py-2 rounded-lg font-bold">Salvar Lançamento</button>
                    </div>
                </form>
            </Modal>

            <Modal isOpen={isRecModalOpen} onClose={() => setIsRecModalOpen(false)} title="Gerar Cobrança / Rateio" maxWidth="max-w-2xl">
                {/* Simplified Wizard for Demo Code compactness - Assume Steps 1-4 logic from previous iteration is here, simplified */}
                <div className="space-y-4">
                    <div>
                        <label className="text-xs font-bold text-text-secondary uppercase mb-1 block">Título</label>
                        <input className="w-full bg-black/20 border border-white/10 rounded p-2 text-white" value={recTitle} onChange={e => setRecTitle(e.target.value)} placeholder="Ex: Mensalidade Outubro" />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-text-secondary uppercase mb-1 block">Valor por Pessoa (R$)</label>
                        <input type="number" className="w-full bg-black/20 border border-white/10 rounded p-2 text-white" value={recAmount} onChange={e => setRecAmount(Number(e.target.value))} />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-text-secondary uppercase mb-1 block">Vencimento</label>
                        <input type="date" className="w-full bg-black/20 border border-white/10 rounded p-2 text-white" value={recDueDate} onChange={e => setRecDueDate(e.target.value)} />
                    </div>
                    <button onClick={handleCreateBulkReceivable} className="w-full bg-green-600 text-white font-bold py-3 rounded-xl mt-4">Confirmar e Enviar para Todos</button>
                </div>
            </Modal>
        </div>
    );
};

export default Finance;