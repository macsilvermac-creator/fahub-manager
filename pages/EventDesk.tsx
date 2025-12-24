
import React, { useState, useEffect, useContext } from 'react';
import Card from '../components/Card';
import { TicketIcon, ShopIcon } from '../components/icons/NavIcons';
import { TrashIcon, CheckCircleIcon, CreditCardIcon, QrcodeIcon, WalletIcon, PrinterIcon } from '../components/icons/UiIcons';
import PaymentModal from '../components/PaymentModal';
import { storageService } from '../services/storageService';
// Fix: Added missing EventSale type
import { EventSale } from '../types';
import { UserContext } from '../components/Layout';
import Modal from '../components/Modal';
import { useToast } from '../contexts/ToastContext';

const TICKET_ITEMS = [
    { id: 't1', name: 'Ingresso Inteira', price: 20.00, icon: '🎟️' },
    { id: 't2', name: 'Ingresso Meia/Social', price: 10.00, icon: '🎫' },
    { id: 't3', name: 'Área VIP', price: 50.00, icon: '🌟' },
    { id: 't4', name: 'Estacionamento', price: 15.00, icon: '🚗' },
];

const BAR_ITEMS = [
    { id: 'b1', name: 'Água Mineral', price: 5.00, icon: '💧' },
    { id: 'b2', name: 'Cerveja Lata', price: 8.00, icon: '🍺' },
    { id: 'b3', name: 'Refrigerante', price: 6.00, icon: '🥤' },
    { id: 'b4', name: 'Espetinho', price: 12.00, icon: '🍢' },
    { id: 'b5', name: 'Hambúrguer', price: 25.00, icon: '🍔' },
    { id: 'b6', name: 'Combo (Burger+Refri)', price: 30.00, icon: '🍱' },
];

interface CartItem {
    id: string;
    productId: string;
    name: string;
    price: number;
}

const EventDesk: React.FC = () => {
    const { currentRole } = useContext(UserContext);
    const toast = useToast();
    const [mode, setMode] = useState<'TICKETS' | 'BAR'>('TICKETS');
    const [cart, setCart] = useState<CartItem[]>([]);
    const [recentSales, setRecentSales] = useState<EventSale[]>([]);
    const [isPaymentOpen, setIsPaymentOpen] = useState(false);
    const [lastOrder, setLastOrder] = useState<{ id: string, items: CartItem[], total: number, date: Date } | null>(null);
    const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
    const [quickName, setQuickName] = useState('');
    const [quickPrice, setQuickPrice] = useState('');
    const [mobileView, setMobileView] = useState<'CATALOG' | 'CART'>('CATALOG');

    useEffect(() => {
        // Fix: getEventSales exists in storageService
        const sales = storageService.getEventSales();
        const today = new Date().toDateString();
        setRecentSales(sales.filter(s => new Date(s.timestamp).toDateString() === today));
    }, []);

    const addToCart = (item: { id: string, name: string, price: number }) => {
        const newItem: CartItem = {
            id: Date.now().toString() + Math.random(),
            productId: item.id,
            name: item.name,
            price: item.price
        };
        setCart([...cart, newItem]);
        toast.info(`${item.name} adicionado.`);
    };

    const removeFromCart = (instanceId: string) => {
        setCart(cart.filter(i => i.id !== instanceId));
    };

    const clearCart = () => setCart([]);

    const cartTotal = cart.reduce((sum, item) => sum + item.price, 0);

    const handleCheckout = () => {
        if (cart.length === 0) return;
        setIsPaymentOpen(true);
    };

    const onPaymentSuccess = () => {
        const saleId = `ord-${Date.now()}`;
        const newSales: EventSale[] = cart.map(item => ({
            id: `sale-${Date.now()}-${Math.random()}`,
            type: mode === 'TICKETS' ? 'TICKET' : 'BAR',
            itemName: item.name,
            quantity: 1,
            totalAmount: item.price,
            timestamp: new Date()
        }));

        // Fix: getEventSales and saveEventSales exist in storageService
        const allSales = storageService.getEventSales();
        const updatedAllSales = [...allSales, ...newSales];
        storageService.saveEventSales(updatedAllSales);

        setRecentSales([...recentSales, ...newSales]);
        
        setLastOrder({
            id: saleId,
            items: [...cart],
            total: cartTotal,
            date: new Date()
        });

        setIsPaymentOpen(false);
        clearCart();
        setMobileView('CATALOG');
        toast.success("Venda realizada com sucesso!");
        
        setTimeout(() => {
            if(window.confirm("Deseja imprimir o comprovante?")) {
                window.print();
            }
        }, 500);
    };

    const handleQuickAddSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!quickName || !quickPrice) return;
        
        const newItem = { 
            id: `quick-${Date.now()}`, 
            name: quickName, 
            price: Number(quickPrice)
        };
        
        addToCart(newItem);
        setQuickName('');
        setQuickPrice('');
        setIsQuickAddOpen(false);
    };

    const totalRevenue = recentSales.reduce((sum, s) => sum + s.totalAmount, 0);
    const ticketsSold = recentSales.filter(s => s.type === 'TICKET').length;

    return (
        <div className="space-y-4 pb-12 animate-fade-in h-[calc(100vh-5rem)] flex flex-col overflow-hidden">
            <style>{`
                @media print {
                    body * { visibility: hidden; }
                    #receipt-area, #receipt-area * { visibility: visible; }
                    #receipt-area {
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 80mm;
                        background: white;
                        color: black;
                        font-family: 'Courier New', Courier, monospace;
                        padding: 10px;
                    }
                    .no-print { display: none !important; }
                }
            `}</style>

            <div id="receipt-area" className="hidden print:block">
                <div className="text-center mb-4">
                    <h2 className="font-bold text-xl uppercase">FAHUB MANAGER</h2>
                    <p className="text-xs">Comprovante de Venda</p>
                    <p className="text-xs">{lastOrder?.date.toLocaleString()}</p>
                    <p className="text-xs">Pedido: #{lastOrder?.id.slice(-6)}</p>
                </div>
                <hr className="border-black border-dashed mb-2"/>
                <div className="space-y-1 mb-2">
                    {lastOrder?.items.map((item, i) => (
                        <div key={i} className="flex justify-between text-xs">
                            <span>{item.name}</span>
                            <span>R$ {item.price.toFixed(2)}</span>
                        </div>
                    ))}
                </div>
                <hr className="border-black border-dashed mb-2"/>
                <div className="flex justify-between font-bold text-sm">
                    <span>TOTAL</span>
                    <span>R$ {lastOrder?.total.toFixed(2)}</span>
                </div>
                <div className="text-center mt-4 text-[10px]">
                    <p>Obrigado pelo apoio!</p>
                    <p>www.fahub.com.br</p>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 px-1 no-print">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-secondary rounded-xl">
                        <TicketIcon className="h-6 w-6 text-highlight" />
                    </div>
                    <div>
                        <h2 className="text-xl sm:text-2xl font-bold text-text-primary leading-none">Game Day POS</h2>
                        <p className="text-text-secondary text-xs">Ponto de Venda: Bar & Estacionamento</p>
                    </div>
                </div>
                
                <div className="flex gap-3 text-xs w-full sm:w-auto bg-black/20 p-2 rounded-lg border border-white/5 justify-between sm:justify-end">
                    <div className="text-right">
                        <p className="text-text-secondary uppercase font-bold text-[10px]">Caixa Hoje</p>
                        <p className="text-sm font-bold text-green-400">R$ {totalRevenue.toFixed(2)}</p>
                    </div>
                    <div className="w-px bg-white/10 mx-2"></div>
                    <div className="text-right">
                        <p className="text-text-secondary uppercase font-bold text-[10px]">Tickets</p>
                        <p className="text-sm font-bold text-white">{ticketsSold}</p>
                    </div>
                </div>
            </div>

            <div className="flex md:hidden bg-secondary rounded-lg p-1 border border-white/10 shrink-0 no-print">
                <button 
                    onClick={() => setMobileView('CATALOG')}
                    className={`flex-1 py-2 text-xs font-bold rounded flex items-center justify-center gap-2 ${mobileView === 'CATALOG' ? 'bg-highlight text-white shadow-sm' : 'text-text-secondary'}`}
                >
                    <ShopIcon className="w-4 h-4" /> Catálogo
                </button>
                <button 
                    onClick={() => setMobileView('CART')}
                    className={`flex-1 py-2 text-xs font-bold rounded flex items-center justify-center gap-2 ${mobileView === 'CART' ? 'bg-highlight text-white shadow-sm' : 'text-text-secondary'}`}
                >
                    <WalletIcon className="w-4 h-4" /> Carrinho 
                    {cart.length > 0 && <span className="bg-white text-highlight px-1.5 rounded-full text-[10px]">{cart.length}</span>}
                </button>
            </div>

            <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-hidden min-h-0 no-print">
                <div className={`lg:col-span-2 flex-col h-full overflow-hidden ${mobileView === 'CART' ? 'hidden lg:flex' : 'flex'}`}>
                    <div className="flex gap-2 mb-3 shrink-0 overflow-x-auto pb-1">
                        <button 
                            onClick={() => setMode('TICKETS')}
                            className={`flex-1 py-3 rounded-xl font-bold text-sm sm:text-base flex items-center justify-center gap-2 transition-all border ${mode === 'TICKETS' ? 'bg-highlight/10 border-highlight text-highlight' : 'bg-secondary border-white/5 text-text-secondary hover:bg-white/5'}`}
                        >
                            <TicketIcon className="w-5 h-5" /> Bilheteria & Estac.
                        </button>
                        <button 
                            onClick={() => setMode('BAR')}
                            className={`flex-1 py-3 rounded-xl font-bold text-sm sm:text-base flex items-center justify-center gap-2 transition-all border ${mode === 'BAR' ? 'bg-orange-500/10 border-orange-500 text-orange-500' : 'bg-secondary border-white/5 text-text-secondary hover:bg-white/5'}`}
                        >
                            <ShopIcon className="w-5 h-5" /> Bar & Loja
                        </button>
                    </div>

                    <div className="flex-1 bg-secondary/30 rounded-2xl border border-white/5 p-3 overflow-y-auto custom-scrollbar relative">
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                            {(mode === 'TICKETS' ? TICKET_ITEMS : BAR_ITEMS).map(item => (
                                <button
                                    key={item.id}
                                    onClick={() => addToCart(item)}
                                    className="bg-secondary hover:bg-white/10 border border-white/5 hover:border-highlight/50 rounded-xl p-4 flex flex-col items-center justify-center gap-2 transition-all active:scale-95 shadow-sm min-h-[120px]"
                                >
                                    <span className="text-3xl">{item.icon}</span>
                                    <span className="font-bold text-white text-center leading-tight text-xs sm:text-sm line-clamp-2 h-8 flex items-center">{item.name}</span>
                                    <span className="text-highlight font-bold bg-black/20 px-2 py-0.5 rounded-full text-xs">R$ {item.price.toFixed(2)}</span>
                                </button>
                            ))}
                            <button 
                                onClick={() => setIsQuickAddOpen(true)}
                                className="bg-white/5 hover:bg-white/10 border border-dashed border-white/20 rounded-xl p-4 flex flex-col items-center justify-center gap-2 transition-all active:scale-95 min-h-[120px]"
                            >
                                <span className="text-2xl text-text-secondary">+</span>
                                <span className="font-bold text-text-secondary text-xs text-center">Item Rápido</span>
                            </button>
                        </div>
                    </div>
                </div>

                <div className={`lg:col-span-1 bg-secondary rounded-2xl border border-white/5 flex-col h-full overflow-hidden ${mobileView === 'CATALOG' ? 'hidden lg:flex' : 'flex'}`}>
                    <div className="p-4 border-b border-white/10 bg-black/20 shrink-0 flex justify-between items-center">
                        <h3 className="font-bold text-white flex items-center gap-2">
                            <WalletIcon className="w-5 h-5 text-text-secondary" />
                            Pedido Atual
                        </h3>
                        {lastOrder && (
                            <button onClick={() => window.print()} className="text-text-secondary hover:text-white" title="Reimprimir Último">
                                <PrinterIcon className="w-5 h-5" />
                            </button>
                        )}
                    </div>

                    <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar bg-black/10">
                        {cart.length === 0 ? (
                            <div className="h-full flex flex-col items-center justify-center text-text-secondary opacity-50">
                                <ShopIcon className="w-12 h-12 mb-2" />
                                <p>Carrinho vazio</p>
                                <button onClick={() => setMobileView('CATALOG')} className="mt-4 text-xs text-highlight underline md:hidden">Voltar ao Catálogo</button>
                            </div>
                        ) : (
                            cart.map((item, idx) => (
                                <div key={item.id} className="flex justify-between items-center bg-white/5 p-3 rounded-lg animate-slide-in border-l-2 border-highlight">
                                    <div className="flex items-center gap-3">
                                        <span className="text-[10px] bg-black/30 w-5 h-5 flex items-center justify-center rounded-full text-text-secondary">{idx + 1}</span>
                                        <div>
                                            <p className="font-bold text-white text-sm">{item.name}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3">
                                        <span className="font-bold text-white text-sm">R$ {item.price.toFixed(2)}</span>
                                        <button onClick={() => removeFromCart(item.id)} className="text-text-secondary hover:text-red-400 p-1">
                                            <TrashIcon className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    <div className="p-4 bg-black/40 border-t border-white/10 shrink-0">
                        <div className="flex justify-between items-center mb-4">
                            <span className="text-text-secondary text-sm">Total a Pagar</span>
                            <span className="text-2xl font-bold text-white">R$ {cartTotal.toFixed(2)}</span>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <button 
                                onClick={handleCheckout}
                                disabled={cart.length === 0}
                                className="col-span-2 bg-green-600 hover:bg-green-500 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 rounded-xl font-bold text-lg shadow-lg flex items-center justify-center gap-2 active:scale-95 transition-transform"
                            >
                                <CheckCircleIcon className="w-5 h-5" />
                                Cobrar
                            </button>
                            <button 
                                onClick={clearCart}
                                disabled={cart.length === 0}
                                className="col-span-2 bg-white/5 hover:bg-white/10 text-text-secondary py-2 rounded-lg text-xs font-semibold"
                            >
                                Cancelar Pedido
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <PaymentModal 
                isOpen={isPaymentOpen}
                onClose={() => setIsPaymentOpen(false)}
                onSuccess={onPaymentSuccess}
                amount={cartTotal}
                description={`Venda POS (${cart.length} itens)`}
            />

            <Modal isOpen={isQuickAddOpen} onClose={() => setIsQuickAddOpen(false)} title="Adicionar Item Rápido">
                <form onSubmit={handleQuickAddSubmit} className="space-y-4">
                    <div>
                        <label className="text-xs font-bold text-text-secondary">Nome do Produto</label>
                        <input 
                            className="w-full bg-black/20 border border-white/10 rounded p-3 text-white focus:border-highlight focus:outline-none"
                            value={quickName}
                            onChange={e => setQuickName(e.target.value)}
                            placeholder="Ex: Pastel"
                            autoFocus
                        />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-text-secondary">Preço (R$)</label>
                        <input 
                            type="number"
                            className="w-full bg-black/20 border border-white/10 rounded p-3 text-white focus:border-highlight focus:outline-none"
                            value={quickPrice}
                            onChange={e => setQuickPrice(e.target.value)}
                            placeholder="Ex: 10.00"
                        />
                    </div>
                    <button type="submit" disabled={!quickName || !quickPrice} className="w-full bg-highlight hover:bg-highlight-hover text-white font-bold py-3 rounded-lg disabled:opacity-50">
                        Adicionar ao Carrinho
                    </button>
                </form>
            </Modal>
        </div>
    );
};

export default EventDesk;
