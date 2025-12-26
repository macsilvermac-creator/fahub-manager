
import React, { useState, useEffect, useContext, useRef, useMemo } from 'react';
import Card from '../components/Card';
import { Transaction, Invoice, TransactionCategory, Player } from '../types';
import { storageService } from '../services/storageService';
import { scanFinancialDocument } from '../services/geminiService';
import { 
    WalletIcon, SparklesIcon, ScanIcon, 
    RefreshIcon, BankIcon, AlertTriangleIcon,
    CheckCircleIcon, QrcodeIcon, TrendingUpIcon
} from '../components/icons/UiIcons';
import { UserContext, UserContextType } from '../components/Layout';
import Modal from '../components/Modal';
import { useToast } from '../contexts/ToastContext';

const Finance: React.FC = () => {
    const { currentRole } = useContext(UserContext) as UserContextType;
    const toast = useToast();
    const fileInputRef = useRef<HTMLInputElement>(null);
    
    // Data State
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [players, setPlayers] = useState<Player[]>([]);
    
    // View States
    const [viewMode, setViewMode] = useState<'FLOW' | 'INVOICES' | 'RECOVERY'>('FLOW');
    const [isScanning, setIsScanning] = useState(false);
    const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);

    const isExecutive = ['MASTER', 'FINANCIAL_DIRECTOR', 'FINANCIAL_MANAGER', 'PRESIDENT'].includes(currentRole);

    useEffect(() => {
        const load = () => {
            setTransactions(storageService.getTransactions());
            setInvoices(storageService.getInvoices());
            setPlayers(storageService.getPlayers());
        };
        load();
        return storageService.subscribe('storage_update', load);
    }, []);

    const totals = useMemo(() => {
        const income = transactions.filter(t => t.type === 'INCOME').reduce((a, b) => a + b.amount, 0);
        const expense = transactions.filter(t => t.type === 'EXPENSE').reduce((a, b) => a + b.amount, 0);
        const overdue = invoices.filter(i => i.status === 'OVERDUE').reduce((a, b) => a + b.amount, 0);
        const pending = invoices.filter(i => i.status === 'PENDING').reduce((a, b) => a + b.amount, 0);
        return { balance: income - expense, income, expense, overdue, pending };
    }, [transactions, invoices]);

    const handleScanReceipt = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setIsScanning(true);
            toast.info("Analisando recibo via Vision AI...");
            const reader = new FileReader();
            reader.readAsDataURL(e.target.files[0]);
            reader.onload = async () => {
                try {
                    const data = await scanFinancialDocument(reader.result as string);
                    const newTx: Transaction = {
                        id: `tx-${Date.now()}`,
                        title: data.title || 'Compra Scaneada',
                        amount: data.amount || 0,
                        type: 'EXPENSE',
                        category: (data.category as TransactionCategory) || 'OTHER',
                        date: new Date(),
                        status: 'PAID',
                        aiGenerated: true
                    };
                    storageService.saveTransactions([newTx, ...transactions]);
                    toast.success("Despesa processada e arquivada!");
                } catch (err) {
                    toast.error("Erro na leitura da IA. Tente uma foto mais nítida.");
                } finally {
                    setIsScanning(false);
                }
            };
        }
    };

    if (!isExecutive) {
        return (
            <div className="flex flex-col items-center justify-center py-40 opacity-30 italic font-black uppercase text-sm tracking-widest text-center px-10">
                <BankIcon className="w-16 h-16 mb-4" />
                Acesso restrito à diretoria financeira e administrativa.
            </div>
        );
    }

    return (
        <div className="space-y-8 animate-fade-in pb-20">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                <div>
                    <h2 className="text-4xl font-black text-white italic uppercase tracking-tighter">CFO Dashboard</h2>
                    <p className="text-highlight text-[10px] font-black uppercase tracking-[0.4em] mt-1">Controladoria de Ativos & Receita</p>
                </div>
                <div className="flex gap-3">
                    <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleScanReceipt} />
                    <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="bg-secondary border border-white/10 hover:border-highlight text-white px-6 py-3 rounded-2xl font-black uppercase italic text-xs transition-all flex items-center gap-3 group"
                    >
                        {isScanning ? <RefreshIcon className="w-4 h-4 animate-spin" /> : <ScanIcon className="w-4 h-4 group-hover:scale-110 transition-transform" />}
                        Scan Recibo (IA)
                    </button>
                    <button className="bg-highlight hover:bg-highlight-hover text-white px-8 py-3 rounded-2xl font-black uppercase italic text-xs shadow-glow transition-all active:scale-95">
                        Novo Lançamento
                    </button>
                </div>
            </div>

            {/* Financial KPIs */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-secondary/40 backdrop-blur-xl border border-white/5 p-6 rounded-[2.5rem] shadow-xl">
                    <p className="text-[10px] font-black text-text-secondary uppercase tracking-widest">Saldo em Caixa</p>
                    <h3 className="text-3xl font-black text-white italic mt-1">R$ {totals.balance.toLocaleString()}</h3>
                    <p className="text-[10px] font-bold text-green-400 mt-2 flex items-center gap-1"><TrendingUpIcon className="w-3 h-3"/> +R$ 4.2k vs mês anterior</p>
                </div>
                <div className="bg-secondary/40 backdrop-blur-xl border border-white/5 p-6 rounded-[2.5rem] shadow-xl border-l-4 border-l-red-500">
                    <p className="text-[10px] font-black text-text-secondary uppercase tracking-widest">Inadimplência Real</p>
                    <h3 className="text-3xl font-black text-red-500 italic mt-1">R$ {totals.overdue.toLocaleString()}</h3>
                    <p className="text-[10px] font-bold text-text-secondary mt-2">{invoices.filter(i => i.status === 'OVERDUE').length} faturas em atraso</p>
                </div>
                <div className="bg-secondary/40 backdrop-blur-xl border border-white/5 p-6 rounded-[2.5rem] shadow-xl border-l-4 border-l-blue-500">
                    <p className="text-[10px] font-black text-text-secondary uppercase tracking-widest">Receita Pendente</p>
                    <h3 className="text-3xl font-black text-blue-400 italic mt-1">R$ {totals.pending.toLocaleString()}</h3>
                    <p className="text-[10px] font-bold text-text-secondary mt-2">Mensalidades a vencer</p>
                </div>
                <div className="bg-secondary/40 backdrop-blur-xl border border-white/5 p-6 rounded-[2.5rem] shadow-xl">
                    <p className="text-[10px] font-black text-text-secondary uppercase tracking-widest">Burn Rate (Mensal)</p>
                    <h3 className="text-3xl font-black text-white italic mt-1">R$ {totals.expense.toLocaleString()}</h3>
                    <p className="text-[10px] font-bold text-orange-400 mt-2">Ponto de Equilíbrio: Dia 22</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                {/* Ledger Table */}
                <div className="lg:col-span-8">
                    <Card title="Livro de Registros (Ledger)" titleClassName="italic font-black uppercase text-sm">
                        <div className="overflow-x-auto custom-scrollbar">
                            <table className="w-full text-left">
                                <thead className="bg-black/20 text-[10px] font-black text-text-secondary uppercase tracking-widest">
                                    <tr>
                                        <th className="p-4">Data</th>
                                        <th className="p-4">Descrição</th>
                                        <th className="p-4">Categoria</th>
                                        <th className="p-4 text-right">Valor</th>
                                        <th className="p-4 text-center">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="text-xs font-bold">
                                    {transactions.slice(0, 10).map(tx => (
                                        <tr key={tx.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                            <td className="p-4 text-text-secondary font-mono">{new Date(tx.date).toLocaleDateString()}</td>
                                            <td className="p-4">
                                                <span className="text-white uppercase">{tx.title}</span>
                                                {tx.aiGenerated && <SparklesIcon className="w-3 h-3 text-purple-400 inline ml-2" />}
                                            </td>
                                            <td className="p-4"><span className="bg-white/5 px-2 py-1 rounded text-[9px] uppercase">{tx.category}</span></td>
                                            <td className={`p-4 text-right font-black italic ${tx.type === 'INCOME' ? 'text-green-400' : 'text-red-400'}`}>
                                                {tx.type === 'INCOME' ? '+' : '-'} R$ {tx.amount.toLocaleString()}
                                            </td>
                                            <td className="p-4 text-center">
                                                <CheckCircleIcon className="w-4 h-4 text-highlight mx-auto" />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </div>

                {/* Billing Support Side */}
                <div className="lg:col-span-4 space-y-6">
                    <Card title="Quick Recovery" titleClassName="italic font-black uppercase text-sm border-b-0 pb-0">
                        <p className="text-[10px] text-text-secondary mb-6 px-1">Atletas com maior tempo de inadimplência.</p>
                        <div className="space-y-3">
                            {invoices.filter(i => i.status === 'OVERDUE').slice(0, 5).map(inv => (
                                <div key={inv.id} className="bg-black/40 p-4 rounded-2xl border border-red-500/20 flex justify-between items-center group hover:border-red-500 transition-all">
                                    <div className="flex-1">
                                        <h4 className="text-white font-black uppercase text-[10px]">{inv.playerName}</h4>
                                        <p className="text-[10px] text-red-400 font-black italic">R$ {inv.amount.toLocaleString()}</p>
                                    </div>
                                    <button 
                                        onClick={() => setSelectedInvoice(inv)}
                                        className="bg-white/5 hover:bg-highlight hover:text-white p-2 rounded-lg text-text-secondary transition-all"
                                    >
                                        <QrcodeIcon className="w-5 h-5" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </Card>

                    <div className="bg-highlight/5 p-6 rounded-[2.5rem] border border-highlight/20 text-center shadow-xl">
                        <BankIcon className="w-10 h-10 text-highlight mx-auto mb-4" />
                        <h4 className="text-white font-black uppercase italic text-sm">Asaas Sync Ativo</h4>
                        <p className="text-[10px] text-text-secondary mt-2 leading-relaxed">Mensalidades são geradas automaticamente no dia 05 de cada mês.</p>
                    </div>
                </div>
            </div>

            {/* Modal de Cobrança Rápida (Pix) */}
            <Modal isOpen={!!selectedInvoice} onClose={() => setSelectedInvoice(null)} title="Cobrança Instantânea">
                <div className="flex flex-col items-center gap-6 p-4">
                    <div className="bg-white p-6 rounded-[2rem] shadow-2xl">
                         <img src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=PIX-${selectedInvoice?.id}`} alt="QR Code Pix" className="w-48 h-48" />
                    </div>
                    <div className="text-center">
                        <h3 className="text-xl font-black text-white italic uppercase tracking-tight">{selectedInvoice?.playerName}</h3>
                        <p className="text-2xl font-black text-highlight italic mt-1">R$ {selectedInvoice?.amount.toLocaleString()}</p>
                        <p className="text-xs text-text-secondary mt-2 font-bold uppercase tracking-widest">Vencimento: {selectedInvoice && new Date(selectedInvoice.dueDate).toLocaleDateString()}</p>
                    </div>
                    <button className="w-full bg-highlight hover:bg-highlight-hover text-white font-black py-4 rounded-2xl uppercase italic text-xs shadow-glow transition-all active:scale-95">
                        Copiar Chave Pix
                    </button>
                </div>
            </Modal>
        </div>
    );
};

export default Finance;
