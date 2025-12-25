
import React, { useState, useEffect, useContext } from 'react';
import Card from '@/components/Card';
import { Transaction, Invoice } from '@/types';
import { storageService } from '@/services/storageService';
import { FinanceIcon } from '@/components/icons/NavIcons';
import { 
    WalletIcon, CheckCircleIcon, QrcodeIcon, 
    TrophyIcon, BookIcon, ShoppingBagIcon 
} from '@/components/icons/UiIcons';
import { UserContext, UserContextType } from '@/components/Layout';
import Modal from '@/components/Modal';
import { useToast } from '../contexts/ToastContext';

const Finance: React.FC = () => {
    const { currentRole } = useContext(UserContext) as UserContextType;
    const toast = useToast();
    
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [selectedInvoiceForPix, setSelectedInvoiceForPix] = useState<Invoice | null>(null);

    const isPlayer = currentRole === 'PLAYER';

    useEffect(() => {
        const loadData = () => {
            setInvoices(storageService.getInvoices() || []);
            if (!isPlayer) {
                setTransactions(storageService.getTransactions() || []);
            }
        };
        loadData();
        return storageService.subscribe('storage_update', loadData);
    }, [isPlayer]);

    const renderAthleteView = () => {
        const myInvoices = invoices.filter(inv => inv.playerName.includes("Lucas Thor") || invoices.length < 5);

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
            <div className="space-y-10 animate-fade-in max-w-6xl mx-auto pb-20">
                <div className="bg-gradient-to-r from-[#1e293b] to-black p-8 rounded-[3rem] border border-white/10 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-10 opacity-5">
                        <WalletIcon className="w-64 h-64 text-white" />
                    </div>
                    <div className="relative z-10">
                        <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter">Season Pass & Elegibilidade</h2>
                        <p className="text-text-secondary text-sm mt-3 max-w-2xl leading-relaxed font-medium">
                            Mantenha o seu passe ativo para garantir sua escalação oficial e acesso total aos treinos.
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {myInvoices.map((inv) => (
                        <div 
                            key={inv.id} 
                            className="group relative bg-secondary/60 backdrop-blur-md rounded-[2.5rem] border border-white/5 p-8 shadow-xl transition-all duration-500 hover:scale-[1.03] hover:shadow-glow hover:border-highlight/30 flex flex-col h-full"
                        >
                            <div className="flex justify-between items-start mb-6">
                                <div className="p-4 bg-black/40 rounded-3xl border border-white/5 group-hover:border-highlight/40 transition-colors">
                                    {getCategoryIcon(inv.category || 'OTHER')}
                                </div>
                                <span className={`text-[9px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest border ${getStatusStyles(inv.status)}`}>
                                    {inv.status === 'PENDING' ? 'Pendente' : inv.status === 'PAID' ? 'Ativo' : 'Atrasado'}
                                </span>
                            </div>

                            <div className="mb-8 flex-1">
                                <h3 className="text-white font-black text-xl uppercase italic leading-tight mb-2 truncate">{inv.title}</h3>
                                <p className="text-text-secondary text-[10px] uppercase font-bold tracking-widest mb-6">Vencimento: {new Date(inv.dueDate).toLocaleDateString()}</p>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-sm font-bold text-highlight">R$</span>
                                    <span className="text-4xl font-black text-white italic">{inv.amount.toFixed(2)}</span>
                                </div>
                            </div>

                            <div className="flex gap-2 shrink-0">
                                <button 
                                    onClick={() => window.open('https://www.asaas.com', '_blank')}
                                    className="flex-1 bg-highlight hover:bg-highlight-hover text-white font-black py-4 rounded-2xl uppercase text-[10px] shadow-lg transition-all active:scale-95"
                                >
                                    Ativar Passe
                                </button>
                                <button 
                                    onClick={() => setSelectedInvoiceForPix(inv)}
                                    className="p-4 bg-white/5 hover:bg-white/10 text-white rounded-2xl border border-white/10 transition-all active:scale-90"
                                    title="Pagar via Pix"
                                >
                                    <QrcodeIcon className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    ))}
                    
                    {myInvoices.length === 0 && (
                        <div className="col-span-full py-40 text-center border-2 border-dashed border-white/5 rounded-[3rem] bg-secondary/10">
                            <CheckCircleIcon className="w-20 h-20 text-highlight mx-auto mb-4 opacity-20" />
                            <p className="text-white font-black uppercase tracking-widest italic opacity-40">Seu Season Pass está em dia.</p>
                        </div>
                    )}
                </div>

                <Modal 
                    isOpen={!!selectedInvoiceForPix} 
                    onClose={() => setSelectedInvoiceForPix(null)} 
                    title="Pagamento Instantâneo Pix"
                >
                    <div className="flex flex-col items-center p-4">
                        <div className="bg-white p-6 rounded-[2rem] mb-6 shadow-2xl border-4 border-highlight/20">
                             <img 
                                src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=PIX-PAYMENT-${selectedInvoiceForPix?.id}`} 
                                alt="QR Code Pix"
                                className="w-48 h-48"
                             />
                        </div>
                        <div className="text-center mb-8">
                             <p className="text-white font-black text-xl mb-1 uppercase italic">{selectedInvoiceForPix?.title}</p>
                             <p className="text-highlight font-black text-2xl tracking-tighter">TOTAL: R$ {selectedInvoiceForPix?.amount.toFixed(2)}</p>
                        </div>
                        <div className="w-full bg-black/40 p-4 rounded-2xl border border-white/10 mb-6">
                            <p className="text-[9px] text-text-secondary uppercase font-black tracking-widest mb-3 text-center">Código Pix Copia e Cola</p>
                            <div className="flex gap-2">
                                <input 
                                    readOnly 
                                    value={`PIX-CODE-${selectedInvoiceForPix?.id}`}
                                    className="flex-1 bg-transparent text-[10px] text-white/40 border-none outline-none overflow-hidden text-ellipsis font-mono"
                                />
                                <button 
                                    onClick={() => {
                                        navigator.clipboard.writeText(`PIX-CODE-${selectedInvoiceForPix?.id}`);
                                        toast.success("Código copiado!");
                                    }}
                                    className="text-highlight text-[10px] font-black uppercase whitespace-nowrap bg-highlight/10 px-3 py-1 rounded-lg"
                                >
                                    Copiar
                                </button>
                            </div>
                        </div>
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
                        <p className="text-text-secondary">Gestão de Receita e Inadimplência.</p>
                    </div>
                </div>
            </div>
            <Card title="Acesso Reservado">
                <div className="p-10 text-center text-text-secondary opacity-30 italic font-black uppercase">
                    Funcionalidades Indisponíveis no Modo Simulação
                </div>
            </Card>
        </div>
    );
};

export default Finance;
