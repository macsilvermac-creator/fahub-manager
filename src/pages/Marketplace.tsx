import React, { useState, useEffect, useContext, useRef } from 'react';
import Card from '../components/Card';
import { MarketplaceItem } from '../types';
import { storageService } from '../services/storageService';
import { UserContext } from '../components/Layout';
import PaymentModal from '../components/PaymentModal';
import Modal from '../components/Modal';
import LazyImage from '@/components/LazyImage';
import { ImageIcon, CheckCircleIcon } from '../components/icons/UiIcons';
import { ShopIcon } from '../components/icons/NavIcons';
import { useToast } from '../contexts/ToastContext';

const Marketplace: React.FC = () => {
    const { currentRole } = useContext(UserContext);
    const toast = useToast();
    const [items, setItems] = useState<MarketplaceItem[]>([]);
    const [viewFilter, setViewFilter] = useState<'ALL' | 'TEAM_STORE' | 'USED'>('ALL');
    
    const [paymentModalOpen, setPaymentModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<MarketplaceItem | null>(null);

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    
    // Form States
    const [newItemTitle, setNewItemTitle] = useState('');
    const [newItemPrice, setNewItemPrice] = useState('');
    const [newItemDesc, setNewItemDesc] = useState('');
    const [newItemCategory, setNewItemCategory] = useState<any>('ACCESSORIES');
    const [newItemType, setNewItemType] = useState<'PLAYER' | 'TEAM_STORE'>('PLAYER');
    
    // Robust Image Handling
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>('');
    const [isProcessing, setIsProcessing] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        setItems(storageService.getMarketplaceItems());
    }, []);

    const filteredItems = items.filter(item => {
        if (item.isSold) return false; 
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
            const updated = items.map(i => i.id === selectedItem.id ? { ...i, isSold: true } : i);
            setItems(updated);
            storageService.saveMarketplaceItems(updated);
            
            setPaymentModalOpen(false);
            setSelectedItem(null);
            toast.success("Compra realizada com sucesso!");
        }
    };

    // ANALISTA DE ARQUIVOS: Conversão Local para Base64 (Garante funcionamento sem backend)
    const convertToBase64 = (file: File): Promise<string> => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = error => reject(error);
        });
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImageFile(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    const handleAddItem = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsProcessing(true);

        try {
            let finalImageUrl = `https://source.unsplash.com/random/400x300/?football,${newItemCategory}`;

            if (imageFile) {
                // Usa o conversor local blindado
                finalImageUrl = await convertToBase64(imageFile);
            }

            const newItem: MarketplaceItem = {
                id: `mkt-${Date.now()}`,
                title: newItemTitle,
                description: newItemDesc,
                price: Number(newItemPrice),
                category: newItemCategory,
                sellerType: newItemType,
                sellerName: newItemType === 'TEAM_STORE' ? 'Loja Oficial' : 'Atleta',
                imageUrl: finalImageUrl,
                isSold: false
            };
            
            const updated = [newItem, ...items];
            setItems(updated);
            storageService.saveMarketplaceItems(updated);
            
            setIsAddModalOpen(false);
            
            // Reset Form
            setNewItemTitle('');
            setNewItemPrice('');
            setNewItemDesc('');
            setImageFile(null);
            setImagePreview('');
            toast.success("Anúncio publicado com sucesso!");

        } catch (error) {
            console.error("Erro ao publicar:", error);
            toast.error("Erro ao processar imagem. Tente uma menor.");
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="space-y-6 pb-12 animate-fade-in">
             <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-text-primary">Marketplace & Loja</h2>
                    <p className="text-text-secondary mt-1">
                        Compre equipamentos ou anuncie seus desapegos.
                    </p>
                </div>
                <div className="flex gap-2">
                    {isCoach && (
                        <button 
                            onClick={() => { setNewItemType('TEAM_STORE'); setIsAddModalOpen(true); }}
                            className="bg-highlight hover:bg-highlight-hover text-white px-4 py-2 rounded-lg font-bold text-sm shadow-lg transition-all"
                        >
                            + Produto Loja
                        </button>
                    )}
                    <button 
                        onClick={() => { setNewItemType('PLAYER'); setIsAddModalOpen(true); }}
                        className="bg-secondary hover:bg-white/10 text-white border border-white/10 px-4 py-2 rounded-lg font-bold text-sm shadow-lg transition-all"
                    >
                        Anunciar Item
                    </button>
                </div>
            </div>

            <div className="flex border-b border-white/10 overflow-x-auto">
                <button onClick={() => setViewFilter('ALL')} className={`px-6 py-3 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${viewFilter === 'ALL' ? 'border-highlight text-highlight' : 'border-transparent text-text-secondary'}`}>Tudo</button>
                <button onClick={() => setViewFilter('TEAM_STORE')} className={`px-6 py-3 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${viewFilter === 'TEAM_STORE' ? 'border-yellow-500 text-yellow-500' : 'border-transparent text-text-secondary'}`}>🌟 Loja Oficial</button>
                <button onClick={() => setViewFilter('USED')} className={`px-6 py-3 text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${viewFilter === 'USED' ? 'border-blue-500 text-blue-400' : 'border-transparent text-text-secondary'}`}>Classificados</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredItems.map(item => (
                    <div key={item.id} className={`group bg-secondary rounded-xl overflow-hidden shadow-lg hover:shadow-glow transition-all hover:-translate-y-1 relative border ${item.sellerType === 'TEAM_STORE' ? 'border-yellow-500/30' : 'border-white/5'}`}>
                        <div className="h-48 overflow-hidden relative bg-black/40">
                             {item.sellerType === 'TEAM_STORE' && (
                                <div className="absolute top-2 right-2 bg-yellow-500 text-black text-[10px] font-black uppercase px-2 py-1 rounded shadow-lg z-10">Oficial</div>
                            )}
                            <LazyImage src={item.imageUrl} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/90 to-transparent">
                                <p className="font-bold text-white text-lg">R$ {item.price.toFixed(2)}</p>
                            </div>
                        </div>

                        <div className="p-4">
                            <p className="text-[10px] text-text-secondary uppercase font-bold mb-1">{item.category}</p>
                            <h3 className="font-bold text-white mb-2 leading-tight line-clamp-1">{item.title}</h3>
                            <p className="text-sm text-text-secondary line-clamp-2 mb-4 h-10">{item.description}</p>
                            
                            <div className="flex items-center justify-between border-t border-white/10 pt-3">
                                <span className="text-xs text-text-secondary truncate max-w-[120px]">
                                    Por: <span className={item.sellerType === 'TEAM_STORE' ? 'text-yellow-500 font-bold' : 'text-white'}>{item.sellerName}</span>
                                </span>
                                <button onClick={() => handleBuy(item)} className="text-xs bg-highlight hover:bg-highlight-hover text-white px-3 py-1.5 rounded font-bold shadow-md transition-all">
                                    Comprar
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {filteredItems.length === 0 && (
                <div className="text-center py-20 bg-secondary/20 rounded-xl border border-dashed border-white/10 flex flex-col items-center">
                    <ShopIcon className="w-16 h-16 text-white/10 mb-4" />
                    <p className="text-text-secondary">Nenhum produto encontrado nesta categoria.</p>
                </div>
            )}

            <PaymentModal 
                isOpen={paymentModalOpen}
                onClose={() => setPaymentModalOpen(false)}
                onSuccess={onPaymentSuccess}
                amount={selectedItem?.price || 0}
                description={selectedItem?.title || 'Produto'}
            />

            <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title={newItemType === 'TEAM_STORE' ? "Novo Produto na Loja" : "Anunciar Desapego"}>
                <form onSubmit={handleAddItem} className="space-y-4">
                    
                    {/* Image Upload Area */}
                    <div 
                        className="bg-black/20 border-2 border-dashed border-white/10 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer hover:bg-white/5 hover:border-highlight/50 transition-all relative overflow-hidden h-40 group"
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <input 
                            type="file" 
                            accept="image/*" 
                            ref={fileInputRef} 
                            className="hidden" 
                            onChange={handleImageChange}
                        />
                        {imagePreview ? (
                            <img src={imagePreview} alt="Preview" className="absolute inset-0 w-full h-full object-cover" />
                        ) : (
                            <div className="flex flex-col items-center gap-2 text-text-secondary group-hover:text-white">
                                <ImageIcon className="w-8 h-8 opacity-50 group-hover:opacity-100 transition-opacity" />
                                <span className="text-xs font-bold uppercase">Clique para adicionar foto</span>
                            </div>
                        )}
                        {imagePreview && (
                            <div className="absolute bottom-2 right-2 bg-green-500 text-white p-1 rounded-full shadow-lg">
                                <CheckCircleIcon className="w-4 h-4" />
                            </div>
                        )}
                    </div>

                    <div>
                        <label className="text-xs font-bold text-text-secondary uppercase">Título</label>
                        <input className="w-full bg-black/20 border border-white/10 rounded p-2 text-white focus:border-highlight focus:outline-none" required value={newItemTitle} onChange={e => setNewItemTitle(e.target.value)} placeholder="Ex: Luva Nike Vapor" />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-bold text-text-secondary uppercase">Preço (R$)</label>
                            <input type="number" className="w-full bg-black/20 border border-white/10 rounded p-2 text-white focus:border-highlight focus:outline-none" required value={newItemPrice} onChange={e => setNewItemPrice(e.target.value)} />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-text-secondary uppercase">Categoria</label>
                            <select className="w-full bg-black/20 border border-white/10 rounded p-2 text-white focus:border-highlight focus:outline-none" value={newItemCategory} onChange={e => setNewItemCategory(e.target.value)}>
                                <option value="HELMET">Capacete</option>
                                <option value="PADS">Shoulder Pad</option>
                                <option value="CLEATS">Chuteiras</option>
                                <option value="ACCESSORIES">Acessórios</option>
                                <option value="MERCH">Merch/Roupas</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="text-xs font-bold text-text-secondary uppercase">Descrição</label>
                        <textarea className="w-full bg-black/20 border border-white/10 rounded p-2 text-white h-24 focus:border-highlight focus:outline-none" value={newItemDesc} onChange={e => setNewItemDesc(e.target.value)} placeholder="Tamanho, estado de conservação, detalhes..." />
                    </div>
                    
                    <div className="flex justify-end pt-2">
                        <button 
                            type="submit" 
                            disabled={isProcessing} 
                            className="bg-highlight hover:bg-highlight-hover text-white px-6 py-2 rounded-lg font-bold flex items-center gap-2 disabled:opacity-50 transition-all shadow-lg"
                        >
                            {isProcessing ? 'Enviando...' : 'Publicar Anúncio'}
                        </button>
                    </div>
                </form>
            </Modal>
        </div>
    );
};

export default Marketplace;