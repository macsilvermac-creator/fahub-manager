
import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import { EquipmentItem, Player } from '../types';
import { storageService } from '../services/storageService';
import { ClipboardIcon, AlertTriangleIcon, CheckCircleIcon, TrashIcon } from '../components/icons/UiIcons';
import Modal from '../components/Modal';

const Inventory: React.FC = () => {
    const [items, setItems] = useState<EquipmentItem[]>([]);
    const [players, setPlayers] = useState<Player[]>([]);
    const [filter, setFilter] = useState<'ASSETS' | 'SALES'>('ASSETS');
    
    // Modal State
    const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState<EquipmentItem | null>(null);
    const [selectedPlayerId, setSelectedPlayerId] = useState<number | string>('');

    // New Item State
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [newItem, setNewItem] = useState<Partial<EquipmentItem>>({ category: 'HELMET', condition: 'NEW', quantity: 1, forSale: false });

    useEffect(() => {
        setItems(storageService.getInventory());
        setPlayers(storageService.getPlayers());
    }, []);

    const filteredItems = items.filter(i => filter === 'ASSETS' ? !i.forSale : i.forSale);

    const handleAssign = () => {
        if (!selectedItem || !selectedPlayerId) return;
        
        const updatedItems = items.map(i => 
            i.id === selectedItem.id 
            ? { ...i, assignedToPlayerId: Number(selectedPlayerId), quantity: i.quantity - 1 } 
            : i
        );
        
        setItems(updatedItems);
        storageService.saveInventory(updatedItems);
        setIsAssignModalOpen(false);
        setSelectedItem(null);
        setSelectedPlayerId('');
        alert("Equipamento atribuído com sucesso. Recibo gerado no sistema.");
    };

    const handleReturn = (itemId: string) => {
        const updatedItems = items.map(i => 
            i.id === itemId 
            ? { ...i, assignedToPlayerId: undefined, quantity: i.quantity + 1 } 
            : i
        );
        setItems(updatedItems);
        storageService.saveInventory(updatedItems);
    };

    const handleAddItem = (e: React.FormEvent) => {
        e.preventDefault();
        const item: EquipmentItem = {
            id: `eq-${Date.now()}`,
            name: newItem.name || 'Item Sem Nome',
            category: newItem.category as any,
            quantity: Number(newItem.quantity),
            condition: newItem.condition as any,
            forSale: filter === 'SALES',
            salePrice: newItem.salePrice ? Number(newItem.salePrice) : undefined,
            brand: newItem.brand,
            acquisitionDate: new Date()
        };
        const updated = [...items, item];
        setItems(updated);
        storageService.saveInventory(updated);
        setIsAddModalOpen(false);
        setNewItem({ category: 'HELMET', condition: 'NEW', quantity: 1, forSale: false });
    };

    const totalAssetValue = items.filter(i => !i.forSale).reduce((acc, i) => acc + ((i.cost || 0) * i.quantity), 0);
    const expiredItems = items.filter(i => i.expiryDate && new Date(i.expiryDate) < new Date()).length;

    return (
        <div className="space-y-6 pb-12 animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-text-primary">Gestão de Inventário</h2>
                    <p className="text-text-secondary mt-1 flex items-center gap-2">
                        <ClipboardIcon className="w-4 h-4" />
                        Almoxarifado, Patrimônio e Estoque de Vendas.
                    </p>
                </div>
                <button 
                    onClick={() => setIsAddModalOpen(true)}
                    className="px-6 py-2 bg-highlight hover:bg-highlight-hover text-white rounded-xl font-semibold shadow-lg"
                >
                    + Novo Item
                </button>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="bg-gradient-to-br from-blue-900/40 to-secondary border-l-4 border-l-blue-500">
                    <div className="flex items-center">
                        <div className="p-3 bg-blue-500/20 rounded-lg text-blue-400">
                             <ClipboardIcon className="h-8 w-8" />
                        </div>
                        <div className="ml-4">
                            <p className="text-xs text-text-secondary font-bold uppercase">Valor Patrimonial</p>
                            <p className="text-2xl font-bold text-white">R$ {totalAssetValue.toFixed(2)}</p>
                        </div>
                    </div>
                </Card>
                <Card className="bg-gradient-to-br from-red-900/40 to-secondary border-l-4 border-l-red-500">
                    <div className="flex items-center">
                        <div className="p-3 bg-red-500/20 rounded-lg text-red-400">
                             <AlertTriangleIcon className="h-8 w-8" />
                        </div>
                        <div className="ml-4">
                            <p className="text-xs text-text-secondary font-bold uppercase">Itens Vencidos</p>
                            <p className="text-2xl font-bold text-white">{expiredItems} <span className="text-sm font-normal text-text-secondary">Alertas</span></p>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-white/10">
                <button 
                    onClick={() => setFilter('ASSETS')}
                    className={`px-6 py-3 text-sm font-bold border-b-2 transition-colors ${filter === 'ASSETS' ? 'border-highlight text-highlight' : 'border-transparent text-text-secondary hover:text-white'}`}
                >
                    Patrimônio (Equipamentos)
                </button>
                <button 
                    onClick={() => setFilter('SALES')}
                    className={`px-6 py-3 text-sm font-bold border-b-2 transition-colors ${filter === 'SALES' ? 'border-green-500 text-green-400' : 'border-transparent text-text-secondary hover:text-white'}`}
                >
                    Estoque Comercial (Bar/Loja)
                </button>
            </div>

            {/* Table */}
            <Card>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-text-secondary">
                        <thead className="text-xs text-text-secondary uppercase bg-black/20 border-b border-white/5">
                            <tr>
                                <th className="px-4 py-3">Item</th>
                                <th className="px-4 py-3">Categoria</th>
                                <th className="px-4 py-3">Qtd</th>
                                <th className="px-4 py-3">Status/Validade</th>
                                {filter === 'ASSETS' && <th className="px-4 py-3">Em Posse De</th>}
                                {filter === 'SALES' && <th className="px-4 py-3">Preço Venda</th>}
                                <th className="px-4 py-3 text-right">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredItems.map(item => {
                                const assignee = players.find(p => p.id === item.assignedToPlayerId);
                                const isExpired = item.expiryDate && new Date(item.expiryDate) < new Date();

                                return (
                                    <tr key={item.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                        <td className="px-4 py-3">
                                            <p className="font-bold text-white">{item.name}</p>
                                            <p className="text-xs">{item.brand} • {item.size}</p>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded uppercase">{item.category}</span>
                                        </td>
                                        <td className="px-4 py-3 font-bold text-white">{item.quantity}</td>
                                        <td className="px-4 py-3">
                                            {isExpired ? (
                                                <span className="text-red-400 font-bold flex items-center gap-1"><AlertTriangleIcon className="w-3 h-3"/> Vencido</span>
                                            ) : (
                                                <span className="text-green-400">OK</span>
                                            )}
                                        </td>
                                        
                                        {filter === 'ASSETS' && (
                                            <td className="px-4 py-3">
                                                {assignee ? (
                                                    <span className="text-highlight font-bold flex items-center gap-1">
                                                        <span className="w-2 h-2 rounded-full bg-highlight"></span>
                                                        {assignee.name}
                                                    </span>
                                                ) : (
                                                    <span className="opacity-50">-</span>
                                                )}
                                            </td>
                                        )}

                                        {filter === 'SALES' && (
                                            <td className="px-4 py-3 text-white">R$ {item.salePrice?.toFixed(2)}</td>
                                        )}

                                        <td className="px-4 py-3 text-right">
                                            {filter === 'ASSETS' && (
                                                <>
                                                    {item.assignedToPlayerId ? (
                                                        <button 
                                                            onClick={() => handleReturn(item.id)}
                                                            className="text-xs bg-white/10 hover:bg-green-600 hover:text-white px-3 py-1.5 rounded transition-colors"
                                                        >
                                                            Devolução
                                                        </button>
                                                    ) : (
                                                        <button 
                                                            onClick={() => { setSelectedItem(item); setIsAssignModalOpen(true); }}
                                                            className="text-xs bg-highlight hover:bg-highlight-hover text-white px-3 py-1.5 rounded transition-colors"
                                                        >
                                                            Emprestar
                                                        </button>
                                                    )}
                                                </>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </Card>

            {/* Assign Modal */}
            <Modal isOpen={isAssignModalOpen} onClose={() => setIsAssignModalOpen(false)} title="Empréstimo de Material">
                <div className="space-y-4">
                    <p className="text-sm text-text-secondary">Selecione o atleta que receberá: <strong>{selectedItem?.name}</strong></p>
                    <select 
                        className="w-full bg-black/20 border border-white/10 rounded p-3 text-white"
                        value={selectedPlayerId}
                        onChange={(e) => setSelectedPlayerId(e.target.value)}
                    >
                        <option value="">Selecione um Atleta...</option>
                        {players.map(p => (
                            <option key={p.id} value={p.id}>{p.name} (#{p.jerseyNumber})</option>
                        ))}
                    </select>
                    <div className="bg-yellow-900/20 p-3 rounded border border-yellow-500/20">
                        <p className="text-xs text-yellow-200">ℹ️ Ao confirmar, um "Termo de Responsabilidade" digital será gerado e vinculado ao perfil do atleta.</p>
                    </div>
                    <div className="flex justify-end pt-2">
                        <button onClick={handleAssign} disabled={!selectedPlayerId} className="bg-highlight hover:bg-highlight-hover text-white px-6 py-2 rounded-lg font-bold disabled:opacity-50">
                            Confirmar Entrega
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Add Item Modal */}
            <Modal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} title="Cadastrar Item">
                <form onSubmit={handleAddItem} className="space-y-4">
                    <div>
                        <label className="text-xs font-bold text-text-secondary">Nome do Item</label>
                        <input className="w-full bg-black/20 border border-white/10 rounded p-2 text-white" value={newItem.name} onChange={e => setNewItem({...newItem, name: e.target.value})} required />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-xs font-bold text-text-secondary">Categoria</label>
                            <select className="w-full bg-black/20 border border-white/10 rounded p-2 text-white" value={newItem.category} onChange={e => setNewItem({...newItem, category: e.target.value as any})}>
                                {filter === 'ASSETS' ? (
                                    <>
                                        <option value="HELMET">Capacete</option>
                                        <option value="PADS">Shoulder Pad</option>
                                        <option value="JERSEY">Uniforme</option>
                                        <option value="BALL">Bola/Treino</option>
                                    </>
                                ) : (
                                    <>
                                        <option value="DRINK">Bebida</option>
                                        <option value="FOOD">Comida</option>
                                        <option value="MERCH">Merch/Loja</option>
                                    </>
                                )}
                            </select>
                        </div>
                        <div>
                            <label className="text-xs font-bold text-text-secondary">Quantidade</label>
                            <input type="number" className="w-full bg-black/20 border border-white/10 rounded p-2 text-white" value={newItem.quantity} onChange={e => setNewItem({...newItem, quantity: Number(e.target.value)})} required />
                        </div>
                    </div>
                    {filter === 'SALES' && (
                        <div>
                            <label className="text-xs font-bold text-text-secondary">Preço de Venda (R$)</label>
                            <input type="number" className="w-full bg-black/20 border border-white/10 rounded p-2 text-white" value={newItem.salePrice} onChange={e => setNewItem({...newItem, salePrice: Number(e.target.value)})} />
                        </div>
                    )}
                    <button type="submit" className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-2 rounded-lg mt-4">Salvar Item</button>
                </form>
            </Modal>
        </div>
    );
};

export default Inventory;
