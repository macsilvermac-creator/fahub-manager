
import React, { useState, useEffect, useContext, useRef, useMemo } from 'react';
import Card from '../components/Card';
import { Player, Transaction, Subscription, Budget, Bill, TransactionCategory, Invoice } from '../types';
import { storageService } from '../services/storageService';
import { FinanceIcon } from '../components/icons/NavIcons';
import { 
    WalletIcon, PieChartIcon, ClockIcon, RefreshIcon, 
    CheckCircleIcon, ScanIcon, QrcodeIcon, CreditCardIcon, 
    TrophyIcon, BookIcon, AlertCircleIcon, XIcon, ShoppingBagIcon 
} from '../components/icons/UiIcons';
import { UserContext, UserContextType } from '../components/Layout';
import Modal from '../components/Modal';
import { authService } from '../services/authService';
import { useToast } from '../contexts/ToastContext';
import { scanFinancialDocument } from '../services/geminiService';

const Finance: React.FC = () => {
    const { currentRole } = useContext(UserContext) as any;
    const toast = useToast();
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [players, setPlayers] = useState<Player[]>([]);
    const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
    const [budgets, setBudgets] = useState<Budget[]>([]);
    const [bills, setBills] = useState<Bill[]>([]);
    const [viewMode, setViewMode] = useState<'OVERVIEW' | 'SUBSCRIPTIONS' | 'BILLS' | 'BUDGET' | 'RECOVERY'>('OVERVIEW');
    
    // UI States para Atleta
    const [selectedInvoiceForPix, setSelectedInvoiceForPix] = useState<Invoice | null>(null);

    const [isTxModalOpen, setIsTxModalOpen] = useState(false);
    const [txType, setTxType] = useState<'INCOME' | 'EXPENSE'>('EXPENSE');
    const [txTitle, setTxTitle] = useState('');
    const [txAmount, setTxAmount] = useState('');
    const [txCategory, setTxCategory] = useState<TransactionCategory>('OTHER');
    const [txDate, setTxDate] = useState(new Date().toISOString().split('T')[0]);
    const [isScanning, setIsScanning] = useState(false);
    const [isAiFilled, setIsAiFilled] = useState(false);

    const isPlayer = currentRole === 'PLAYER';

    useEffect(() => {
        const loadData = () => {
            const currentInvoices = storageService.getInvoices();
            setInvoices(currentInvoices);
            
            if (!isPlayer) {
                setTransactions(storageService.getTransactions());
                setPlayers(storageService.getPlayers());
                setSubscriptions(storageService.getSubscriptions());
                setBudgets(storageService.getBudgets());
                setBills(storageService.getBills());
            }
        };
        loadData();
        return storageService.subscribe('storage_update', loadData);
    }, [isPlayer]);

    const handleScanClick = () => fileInputRef.current?.click();

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
        setIsTxModalOpen(false);
        toast.success("Transação registrada.");
    };

    const { balance, projectedRevenue, delinquencyTotal, pendingBills } = useMemo(() => {
        const inc = transactions.filter(t => t.type === 'INCOME').reduce((acc, t) => acc + t.amount, 0);
        const exp = transactions.filter(t => t.type === 'EXPENSE').reduce((acc, t) => acc + t.amount, 0);
        const proj = subscriptions.filter(s => s.active).reduce((acc, s) => acc + (s.amount * s.assignedTo.length), 0);
        const delinq = invoices.filter(i => i.status === 'OVERDUE').reduce((a,b)=>a+b.amount,0);
        const billsTotal = bills.filter(b => b.status === 'PENDING').reduce((a,b)=>a+b.amount,0);
        return { balance: inc - exp, projectedRevenue: proj, delinquencyTotal: delinq, pendingBills: billsTotal };
    }, [transactions, subscriptions, invoices, bills]);

    const renderAthleteView = () => {
        // Mock de faturas para o atleta Lucas Thor se estiver vazio
        const myInvoices = invoices.length > 0 ? invoices : [
            { id: 'inv-1', title: 'Mensalidade Jan/25', amount: 150, dueDate: new Date('2025-01-10'), status: 'PENDING', category: 'TUITION', playerName: 'Lucas Thor' },
            { id: 'inv-2', title: 'Uniforme de Treino', amount: 85, dueDate: new Date('2025-01-05'), status: 'OVERDUE', category: 'EQUIPMENT', playerName: 'Lucas Thor' },
            { id: 'inv-3', title: 'Taxa Federação 2025', amount: 200, dueDate: new Date('2025-02-15'), status: 'PENDING', category: 'EVENT', playerName: 'Lucas Thor' },
            { id: 'inv-4', title: 'Curso: QB Mechanics', amount: 45, dueDate: new Date('2025-01-20'), status: 'PAID', category: 'STORE', playerName: 'Lucas Thor' }
        ];

        const getCategoryIcon = (cat: string) => {
            switch(cat) {
                case 'TUITION': return <WalletIcon className="w-10 h-10 text-highlight" />;
                case 'EQUIPMENT': return <ShoppingBagIcon className="w-10 h-10 text-orange-400" />;
                case 'EVENT': return <TrophyIcon className="w-10 h-10 text-blue-400" />;
                case 'STORE': return <BookIcon className="w-10 h-10 text-purple-400" />;
                default: return <FinanceIcon className="w-10 h-10 text-gray-400" />;
            }
        };

        const getStatusStyles = (status: string) => {
            if (status === 'PAID') return 'bg-green-500/20 text-green-400 border-green-500/30';
            if (status === 'OVERDUE') return 'bg-red-500/20 text-red-400 border-red-500/30';
            return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
        };

        return (
            <div className="space-y-10 animate-fade-in max-w-6xl mx-auto">
                {/* Header Atleta */}
                <div className="bg-gradient-to-r from-[#1e293b] to-black p-8 rounded-[2.5rem] border border-white/10 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-10 opacity-5">
                        <WalletIcon className="w-64 h-64 text-white" />
                    </div>
                    <div className="relative z-10">
                        <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter">Financeiro do Atleta</h2>
                        <p className="text-text-secondary text-sm mt-2 max-w-2xl leading-relaxed">
                            Mantenha suas obrigações em dia para garantir elegibilidade nos jogos oficiais e acesso aos treinos de campo. 
                            Clique em "Efetuar Pagamento" para ser redirecionado ao checkout seguro do seu banco.
                        </p>
                    </div>
                </div>

                {/* Grid de Cards 3x2 */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {myInvoices.map((inv: any) => (
                        <div 
                            key={inv.id} 
                            className="group relative bg-secondary rounded-[2.5rem] border border-white/5 p-8 shadow-xl transition-all duration-500 hover:scale-[1.03] hover:shadow-glow hover:border-highlight/30"
                        >
                            <div className="flex justify-between items-start mb-6">
                                <div className="p-4 bg-black/40 rounded-3xl border border-white/5 group-hover:border-highlight/40 transition-colors">
                                    {getCategoryIcon(inv.category)}
                                </div>
                                <span className={`text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest border ${getStatusStyles(inv.status)}`}>
                                    {inv.status === 'PENDING' ? 'Pendente' : inv.status === 'PAID' ? 'Pago' : 'Atrasado'}
                                </span>
                            </div>

                            <div className="mb-8">
                                <h3 className="text-white font-black text-xl uppercase italic leading-tight mb-2 truncate">{inv.title}</h3>
                                <p className="text-text-secondary text-xs uppercase font-bold tracking-widest mb-6">Vencimento: {new Date(inv.dueDate).toLocaleDateString()}</p>
                                <p className="text-4xl font-black text-white italic">R$ {inv.amount.toFixed(2)}</p>
                            </div>

                            <div className="flex gap-2">
                                <a 
                                    href="https://www.asaas.com" // Link mockado para banco externo
                                    target="_blank"
                                    rel="noreferrer"
                                    className="flex-1 bg-highlight hover:bg-highlight-hover text-white font-black py-4 rounded-2xl uppercase text-[10px] shadow-lg flex items-center justify-center gap-2 transition-all active:scale-95"
                                >
                                    Efetuar Pagamento
                                </a>
                                <button 
                                    onClick={() => setSelectedInvoiceForPix(inv)}
                                    className="p-4 bg-white/5 hover:bg-white/10 text-white rounded-2xl border border-white/10 transition-all active:scale-90"
                                    title="Pagar via Pix (QR Code)"
                                >
                                    <QrcodeIcon className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    ))}
                    {myInvoices.length === 0 && (
                        <div className="col-span-full py-40 text-center border-2 border-dashed border-white/5 rounded-[3rem] bg-secondary/10">
                            <CheckCircleIcon className="w-20 h-20 text-highlight mx-auto mb-4 opacity-30" />
                            <p className="text-white font-black uppercase tracking-widest italic">Tudo em dia! Nenhuma pendência financeira.</p>
                        </div>
                    )}
                </div>

                {/* Modal Pix QR Code */}
                <Modal 
                    isOpen={!!selectedInvoiceForPix} 
                    onClose={() => setSelectedInvoiceForPix(null)} 
                    title="Pagamento via Pix"
                >
                    <div className="flex flex-col items-center p-4">
                        <div className="bg-white p-6 rounded-3xl mb-6 shadow-2xl">
                             <img 
                                src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=PIX-PAYMENT-MOCK-${selectedInvoiceForPix?.id}`} 
                                alt="QR Code Pix"
                                className="w-48 h-48"
                             />
                        </div>
                        <div className="text-center mb-8">
                             <p className="text-white font-black text-xl mb-1 uppercase italic">{selectedInvoiceForPix?.title}</p>
                             <p className="text-highlight font-black text-2xl">R$ {selectedInvoiceForPix?.amount.toFixed(2)}</p>
                        </div>
                        <div className="w-full bg-black/40 p-4 rounded-2xl border border-white/10 mb-6">
                            <p className="text-[10px] text-text-secondary uppercase font-black tracking-widest mb-2 text-center">Pix Copia e Cola</p>
                            <div className="flex gap-2">
                                <input 
                                    readOnly 
                                    value={`00020126580014BR.GOV.BCB.PIX0136MOCK-${selectedInvoiceForPix?.id}`}
                                    className="flex-1 bg-transparent text-[10px] text-white/50 border-none outline-none overflow-hidden text-ellipsis"
                                />
                                <button 
                                    onClick={() => {
                                        navigator.clipboard.writeText(`00020126580014BR.GOV.BCB.PIX0136MOCK-${selectedInvoiceForPix?.id}`);
                                        toast.success("Código copiado!");
                                    }}
                                    className="text-highlight text-[10px] font-black uppercase"
                                >
                                    Copiar
                                </button>
                            </div>
                        </div>
                        <p className="text-[10px] text-text-secondary text-center leading-relaxed">
                            Após o pagamento, o sistema pode levar até 10 minutos para sincronizar com o banco e atualizar seu status para "Pago".
                        </p>
                    </div>
                </Modal>
            </div>
        );
    };

    if (isPlayer) return renderAthleteView();

    return (
        <div className="space-y-6 pb-12 animate-fade-in relative">
             <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-secondary rounded-xl"><FinanceIcon className="text-highlight w-8 h-8" /></div>
                    <div>
                        <h2 className="text-3xl font-bold text-text-primary">Financeiro Master</h2>
                        <p className="text-text-secondary">Controle de Fluxo e Gestão de Mensalidades do Clube.</p>
                    </div>
                </div>
                <button onClick={() => setIsTxModalOpen(true)} className="bg-highlight hover:bg-highlight-hover text-white px-6 py-2.5 rounded-xl font-bold">
                    + Lançar Transação
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="border-l-4 border-l-blue-500">
                    <p className="text-xs text-text-secondary font-bold uppercase">Saldo em Caixa</p>
                    <p className="text-xl font-bold text-white">R$ {balance.toFixed(2)}</p>
                </Card>
                <Card className="border-l-4 border-l-green-500">
                    <p className="text-xs text-text-secondary font-bold uppercase">Recorrência Estimada</p>
                    <p className="text-xl font-bold text-green-400">R$ {projectedRevenue.toFixed(2)}</p>
                </Card>
                <Card className="border-l-4 border-l-red-500">
                    <p className="text-xs text-text-secondary font-bold uppercase">Contas A Pagar</p>
                    <p className="text-xl font-bold text-red-400">R$ {pendingBills.toFixed(2)}</p>
                </Card>
                <Card className="border-l-4 border-l-yellow-500">
                    <p className="text-xs text-text-secondary font-bold uppercase">Inadimplência Global</p>
                    <p className="text-xl font-bold text-yellow-400">R$ {delinquencyTotal.toFixed(2)}</p>
                </Card>
            </div>

            <div className="flex border-b border-white/10 overflow-x-auto">
                <button onClick={() => setViewMode('OVERVIEW')} className={`px-6 py-3 text-sm font-bold border-b-2 transition-colors ${viewMode === 'OVERVIEW' ? 'border-highlight text-highlight' : 'border-transparent text-text-secondary'}`}>Fluxo</button>
                <button onClick={() => setViewMode('SUBSCRIPTIONS')} className={`px-6 py-3 text-sm font-bold border-b-2 transition-colors ${viewMode === 'SUBSCRIPTIONS' ? 'border-green-500 text-green-400' : 'border-transparent text-text-secondary'}`}>Assinaturas</button>
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
                        <p className="text-xs font-bold text-white">{isScanning ? 'Lendo...' : 'Escanear Recibo (IA)'}</p>
                    </div>
                    <input className="w-full bg-black/20 border border-white/10 rounded p-2 text-white" placeholder="Título" value={txTitle} onChange={e => setTxTitle(e.target.value)} required />
                    <input type="number" className="w-full bg-black/20 border border-white/10 rounded p-2 text-white" placeholder="Valor" value={txAmount} onChange={e => setTxAmount(e.target.value)} required />
                    <button type="submit" className="w-full bg-highlight text-white py-2 rounded font-bold">Salvar</button>
                </form>
            </Modal>
        </div>
    );
};

export default Finance;