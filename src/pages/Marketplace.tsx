
import React, { useState, useEffect } from 'react';
import { storageService } from '../services/storageService';
import { MarketplaceItem } from '../types';
import Card from '../components/Card';
import { QrcodeIcon, CheckCircleIcon, ShoppingBagIcon } from '../components/icons/UiIcons';
import Modal from '../components/Modal';
import { useToast } from '../contexts/ToastContext';

const Marketplace: React.FC = () => {
    const toast = useToast();
    const [items, setItems] = useState<MarketplaceItem[]>([]);
    const [selectedItem, setSelectedItem] = useState<MarketplaceItem | null>(null);
    const [showQrModal, setShowQrModal] = useState(false);

    useEffect(() => {
        setItems(storageService.getMarketplaceItems());
    }, []);

    const handleBuy = (item: MarketplaceItem) => {
        // Simula geração de QR Code de entrega para o vendedor
        const qrData = `DELIVERY-${item.id}-${Date.now()}`;
        const updatedItem = { ...item, qrCodeDelivery: qrData };
        setSelectedItem(updatedItem);
        setShowQrModal(true);
    };

    const confirmDelivery = () => {
        if (!selectedItem) return;
        const updated = items.map(i => i.id === selectedItem.id ? { ...i, isSold: true, qrCodeDelivery: undefined } : i);
        setItems(updated);
        storageService.saveMarketplaceItems(updated);
        setShowQrModal(false);
        toast.success("Transação concluída! O item foi marcado como vendido.");
    };

    return (
        <div className="space-y-6 pb-20 animate-fade-in">
            <h2 className="text-3xl font-black text-white italic uppercase tracking-tighter">Marketplace do Time</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {items.filter(i => !i.isSold).map(item => (
                    <div key={item.id} className="bg-secondary rounded-2xl overflow-hidden border border-white/10 group hover:border-highlight transition-all">
                        <div className="h-48 bg-black">
                            <img src={item.imageUrl} className="w-full h-full object-cover" />
                        </div>
                        <div className="p-4">
                            <h4 className="text-white font-bold mb-1">{item.title}</h4>
                            <p className="text-[10px] text-text-secondary uppercase mb-3">Vendido por: {item.sellerName}</p>
                            <div className="flex justify-between items-center">
                                <span className="text-lg font-black text-highlight">R$ {item.price.toFixed(2)}</span>
                                <button onClick={() => handleBuy(item)} className="bg-highlight hover:bg-highlight-hover text-white px-4 py-1.5 rounded-lg text-xs font-bold uppercase transition-all">Comprar</button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <Modal isOpen={showQrModal} onClose={() => setShowQrModal(false)} title="Checkout de Segurança">
                <div className="space-y-6 text-center">
                    <p className="text-sm text-text-secondary">Apresente este QR Code ao vendedor no ato da entrega física para liberar a transação.</p>
                    <div className="bg-white p-4 rounded-2xl inline-block mx-auto">
                        <img src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${selectedItem?.qrCodeDelivery}`} className="w-48 h-48" />
                    </div>
                    <div className="bg-black/20 p-4 rounded-xl text-left border border-white/10">
                        <p className="text-xs text-white font-bold uppercase mb-1">Dica de Segurança:</p>
                        <p className="text-[10px] text-text-secondary">Nunca confirme o recebimento antes de conferir o estado do equipamento (ex: trincas no capacete).</p>
                    </div>
                    {/* Botão de simulação para o teste */}
                    <button onClick={confirmDelivery} className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-3 rounded-xl uppercase text-xs">Simular Escaneamento</button>
                </div>
            </Modal>
        </div>
    );
};

export default Marketplace;