
import React, { useState, useEffect, useContext } from 'react';
import Card from '../components/Card';
import { MarketplaceItem } from '../types';
import { storageService } from '../services/storageService';
import { UserContext } from '../components/Layout';
import PaymentModal from '../components/PaymentModal';
import Modal from '../components/Modal';
import LazyImage from '../components/LazyImage';

const Marketplace: React.FC = () => {
    const { currentRole } = useContext(UserContext);
    const [items, setItems] = useState<MarketplaceItem[]>([]);
    const [viewFilter, setViewFilter] = useState<'ALL' | 'TEAM_STORE' | 'USED'>('ALL');
    
    // Payment State
    const [paymentModalOpen, setPaymentModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<MarketplaceItem | null>(null);

    // Add Item State
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [newItemTitle, setNewItemTitle] = useState('');
    const [newItemPrice, setNewItemPrice] = useState('');
    const [newItemDesc, setNewItemDesc] = useState('');
    const [newItemCategory, setNewItemCategory] = useState<any>('ACCESSORIES');
    const [newItemType, setNewItemType] = useState<'PLAYER' | 'TEAM_STORE'>('PLAYER');

    useEffect(() => {
        setItems(storageService.getMarketplaceItems());
    }, []);

    const filteredItems = items.filter(item => {
        if (item.isSold) return false; // Hide sold items
        if (viewFilter === 'ALL') return true;
        if (viewFilter === 'TEAM_STORE') return item.sellerType === 'TEAM_STORE';
        if (viewFilter === 'USED') return item.sellerType === 'PLAYER';
        return true;
    });

    const isCoach = currentRole !== 'PLAYER';

    const handleBuy = (item: MarketplaceItem) => {
        setSelectedItem(item);
        setPaymentModalOpen(true);
    };

    const onPaymentSuccess = () => {
        if(selectedItem) {
            // Mark as sold in storage
            const updated = items.map(i => i.id === selectedItem.id ? { ...i, isSold: true } : i);
            setItems(updated);
            storageService.saveMarketplaceItems(updated);
            
            setPaymentModalOpen(false);
            setSelectedItem(null);
            alert("Compra realizada com sucesso! Combine a entrega com o vendedor.");
        }
    };

    const handleAddItem = (e: React.FormEvent) => {
        e.preventDefault();
        const newItem: MarketplaceItem = {
            id: Date.now().toString(),
            title: newItemTitle,
            description: newItemDesc,
            price: Number(newItemPrice),
            category: newItemCategory,
            sellerType: newItemType,
            sellerName: newItemType === 'TEAM_STORE' ? 'Loja Oficial' : 'Atleta', // Mock name
            imageUrl: `https://source.unsplash.com/random/400x300/?football,${newItemCategory}`,
            isSold: false
        };
        const updated = [...items, newItem];
        setItems(updated);
        storageService.saveMarketplaceItems(updated);
        setIsAddModalOpen(false);
        setNewItemTitle('');
        setNewItemPrice('');
        setNewItemDesc('');
    };

    return (
        <div className="space-y-6 pb-12 animate-fade-in">
             <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-text-primary">Marketplace & Loja Oficial</h2>
                    <p className="text-text-secondary mt-1">
                        Compre equipamentos usados ou apoie o time adquirindo produtos oficiais.
                    </p>
                </div>
                <div className="flex gap-2">
                    {isCoach && (
                        <button 
                            onClick={() => { setNewItemType('TEAM_STORE'); setIsAddModalOpen(true); }}
                            className="bg-highlight hover:bg-highlight-hover text-white px-4 py-2 rounded-lg font-bold text-sm shadow-lg transition-all"
                        >
                            + Add Produto na Loja
                        </button>
                    )}
                    <button 
                        onClick={() => { setNewItemType('PLAYER'); setIsAddModalOpen(true); }}
                        className="bg-secondary hover:bg-white/10 text-white border border-white/10 px-4 py-2 rounded-lg font-bold text-sm shadow-lg transition-all"
                    >
                        Anunciar Desapego
                    </button>
                </div>
            </div>

            {/* Filters */}
            <div className="flex border-b border-white/10 overflow-x-auto">
                <button 
                    onClick={() => setViewFilter('ALL')}
                    className={`px-6 py-3 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${viewFilter === 'ALL' ? 'border-highlight text-highlight' : 'border-transparent text-text-secondary hover:text-white'}`}
                >
                    Tudo
                </button>
                <button 
                    onClick={() => setViewFilter('TEAM_STORE')}
                    className={`px-6 py-3 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${viewFilter === 'TEAM_STORE' ? 'border-yellow-500 text-yellow-500' : 'border-transparent text-text-secondary hover:text-white'}`}
                >
                    🌟 Loja Oficial do Time
                </button>
                <button 
                    onClick={() => setViewFilter('USED')}
                    className={`px-6 py-3 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${viewFilter === 'USED' ? 'border-highlight text-highlight' : 'border-transparent text-text-secondary hover:text-white'}`}
                >
                    Classificados (Usados)
                </button>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredItems.map(item => (
                    <div 
                        key={item.id} 
                        className={`group bg-secondary rounded-xl overflow-hidden shadow-lg hover:shadow-glow transition-all hover:-translate-y-1 relative ${item.sellerType === 'TEAM_STORE' ? 'border-2 border-yellow-500/30' : 'border border-white/5'}`}
                    >
                        {/* Image */}
                        <div className="h-48 overflow-hidden relative">
                             {item.sellerType === 'TEAM_STORE' && (
                                <div className="absolute top-2 right-2 bg-yellow-500 text-black text-[10px] font-black uppercase px-2 py-1 rounded shadow-lg z-10">
                                    Oficial
                                </div>
                            )}
                            <LazyImage src={item.imageUrl} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                            <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/90 to-transparent">
                                <p className="font-bold text-white text-lg">R$ {item.price.toFixed(2)}</p>
                            </div>
                        </div>

                        {/* Content */}
                        <div className="p-4">
                            <p className="text-[10px] text-text-secondary uppercase font-bold mb-1">{item.category}</p>
                            <h3 className="font-bold text-white mb-2 leading-tight">{item.title}</h3>
                            <p className="text-sm text-text-secondary line-clamp-2 mb-4 h-10">{item.description}</p>
                            
                            <div className="flex items-center justify-between border-t border-white/10 pt-3">
                                <span className="text-xs text-text-secondary flex items-center gap-1">
                                    Vendedor: <span className={item.sellerType === 'TEAM_STORE' ? 'text-yellow-500 font-bold' : 'text-white'}>{item.sellerName}</span>
                                </span>
                                <button 
                                    onClick={() => handleBuy(item)}
                                    className="text-xs bg-white/10 hover:bg-highlight hover:text-white text-white px-3 py-1.5 rounded transition-colors"
                                >
                                    Comprar
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {filteredItems.length === 0 && (
                <div className="text-center py-12 bg-secondary/20 rounded-xl border border-dashed border-white/10">
                    <p className="text-text-secondary">Nenhum produto encontrado nesta categoria.</p>
                </div>
            )}

            {/* Payment Modal */}
            <PaymentModal 
                isOpen={paymentModalOpen}
                onClose={() => setPaymentModalOpen(false)}
                onSuccess={onPaymentSuccess}
                amount={selectedItem?.price || 0}
                description={selectedItem?.title || 'Produto'}
            />

            {/* Add Item Modal */}
            <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title={newItemType === 'TEAM_STORE' ? "Novo Produto na Loja" : "Anunciar Produto"}>
                <form onSubmit={handleAddItem} className="space-y-4">
                    <div>
                        <label className="text-xs font-bold text-text-secondary uppercase">Título</label>
                        <input className="w-full bg-black/20 border border-white/10 rounded p-2 text-white" required value={newItemTitle} onChange={e => setNewItemTitle(e.target.value)} placeholder="Ex: Capacete Riddell" />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-text-secondary uppercase">Preço (R$)</label>
                        <input type="number" className="w-full bg-black/20 border border-white/10 rounded p-2 text-white" required value={newItemPrice} onChange={e => setNewItemPrice(e.target.value)} />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-text-secondary uppercase">Categoria</label>
                        <select className="w-full bg-black/20 border border-white/10 rounded p-2 text-white" value={newItemCategory} onChange={e => setNewItemCategory(e.target.value)}>
                            <option value="HELMET">Capacete</option>
                            <option value="PADS">Shoulder Pad</option>
                            <option value="CLEATS">Chuteiras</option>
                            <option value="ACCESSORIES">Acessórios (Luvas, etc)</option>
                            <option value="MERCH">Merch (Camisetas, Bonés)</option>
                        </select>
                    </div>
                    <div>
                        <label className="text-xs font-bold text-text-secondary uppercase">Descrição</label>
                        <textarea className="w-full bg-black/20 border border-white/10 rounded p-2 text-white h-24" value={newItemDesc} onChange={e => setNewItemDesc(e.target.value)} />
                    </div>
                    <div className="flex justify-end pt-2">
                        <button type="submit" className="bg-highlight hover:bg-highlight-hover text-white px-6 py-2 rounded-lg font-bold">Publicar Anúncio</button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Marketplace;
