
import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
// Fix: Corrected types for EquipmentItem
import { EquipmentItem, Player } from '../types';
import { storageService } from '../services/storageService';
import { ClipboardIcon, AlertTriangleIcon, CheckCircleIcon, TrashIcon, QrcodeIcon, PrinterIcon, SmartphoneIcon, BarcodeIcon } from '../components/icons/UiIcons';
import Modal from '../components/Modal';
import { useToast } from '../contexts/ToastContext';

const Inventory: React.FC = () => {
    const toast = useToast();
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

    // Print State
    const [printMode, setPrintMode] = useState(false);

    useEffect(() => {
        // Fix: getInventory exists in storageService
        setItems(storageService.getInventory());
        setPlayers(storageService.getPlayers());
    }, []);

    const filteredItems = items.filter(i => filter === 'ASSETS' ? !i.forSale : i.forSale);

    const handleAssign = () => {
        if (!selectedItem || !selectedPlayerId) return;
        
        const updatedItems = items.map(i => 
            i.id === selectedItem.id 
            ? { ...i, assignedToPlayerId: selectedPlayerId, quantity: i.quantity - 1 } 
            : i
        );
        
        setItems(updatedItems);
        // Fix: saveInventory exists in storageService
        storageService.saveInventory(updatedItems);
        setIsAssignModalOpen(false);
        setSelectedItem(null);
        setSelectedPlayerId('');
        toast.success("Equipamento atribuído com sucesso!");
    };

    const handleReturn = (itemId: string) => {
        const updatedItems = items.map(i => 
            i.id === itemId 
            ? { ...i, assignedToPlayerId: undefined, quantity: i.quantity + 1 } 
            : i
        );
        setItems(updatedItems);
        // Fix: saveInventory exists in storageService
        storageService.saveInventory(updatedItems);
        toast.info("Item devolvido ao estoque.");
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
            acquisitionDate: new Date(),
            expiryDate: newItem.expiryDate ? new Date(newItem.expiryDate) : undefined,
            qrCodeUrl: `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=ASSET:${Date.now()}`
        };
        const updated = [...items, item];
        setItems(updated);
        // Fix: saveInventory exists in storageService
        storageService.saveInventory(updated);
        setIsAddModalOpen(false);
        setNewItem({ category: 'HELMET', condition: 'NEW', quantity: 1, forSale: false });
        toast.success("Item cadastrado!");
    };

    const handleCopyReport = () => {
        const report = `📦 *RELATÓRIO DE INVENTÁRIO - FAHUB STARS*
📅 Data: ${new Date().toLocaleDateString()}

🚨 *ITENS VENCIDOS:*
${items.filter(i => i.expiryDate && new Date(i.expiryDate) < new Date()).map(i => `- ${i.name} (Venc: ${new Date(i.expiryDate!).toLocaleDateString()})`).join('\n') || 'Nenhum'}

📊 *RESUMO GERAL:*
- Total Ativos: ${items.filter(i => !i.forSale).length}
- Valor Patrimonial: R$ ${totalAssetValue.toFixed(2)}
- Emprestados: ${items.filter(i => i.assignedToPlayerId).length}

Assinado: Gestão de Patrimônio`;

        navigator.clipboard.writeText(report);
        toast.success("Relatório copiado! Cole no WhatsApp da Diretoria.");
    };

    const totalAssetValue = items.filter(i => !i.forSale).reduce((acc, i) => acc + ((i.cost || 0) * i.quantity), 0);
    const expiredItems = items.filter(i => i.expiryDate && new Date(i.expiryDate) < new Date()).length;

    return (
        <div className="space-y-6 pb-12 animate-fade-in relative">
            <style>{`
                @media print {
                    body * { visibility: hidden; }
                    #thermal-labels, #thermal-labels * { visibility: visible; }
                    #thermal-labels {
                        position: absolute;
                        left: 0;
                        top: 0;
                        width: 100%;
                    }
                    .label-item {
                        width: 50mm;
                        height: 30mm;
                        border: 1px dashed black;
                        padding: 2mm;
                        page-break-after: always;
                        display: flex;
                        align-items: center;
                        justify-content: space-between;
                        font-family: Arial, sans-serif;
                    }
                    .no-print { display: none !important; }
                }
            `}</style>

            <div id="thermal-labels" className="hidden print:block">
                {items.filter(i => !i.forSale).map(item => (
                    <div key={item.id} className="label-item">
                        <div style={{width: '60%'}}>
                            <div style={{fontSize: '10px', fontWeight: 'bold'}}>{item.category}</div>
                            <div style={{fontSize: '12px', overflow: 'hidden', whiteSpace: 'nowrap'}}>{item.name}</div>
                            <div style={{fontSize: '8px'}}>ID: {item.id}</div>
                            <div style={{fontSize: '8px'}}>Venc: {item.expiryDate ? new Date(item.expiryDate).toLocaleDateString() : 'N/A'}</div>
                        </div>
                        <img src={`https://api.qrserver.com/v1/create-qr-code/?size=80x80&data=${item.id}`} style={{width: '20mm', height: '20mm'}} />
                    </div>
                ))}
            </div>

            <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4 no-print">
                <div>
                    <h2 className="text-3xl font-bold text-text-primary">Gestão de Inventário 2.0</h2>
                    <p className="text-text-secondary mt-1 flex items-center gap-2">
                        <ClipboardIcon className="w-4 h-4" />
                        Almoxarifado Inteligente & Ciclo de Vida.
                    </p>
                </div>
                <div className="flex gap-2">
                    <button onClick={handleCopyReport} className="bg-green-600 hover:bg-green-500 text-white px-4 py-2 rounded-xl font-bold shadow-lg flex items-center gap-2 text-sm">
                        <SmartphoneIcon className="w-4 h-4" /> Relatório WhatsApp
                    </button>
                    <button onClick={() => window.print()} className="bg-secondary border border-white/10 hover:bg-white/5 text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 text-sm">
                        <BarcodeIcon className="w-4 h-4" /> Imprimir Etiquetas (50x30mm)
                    </button>
                    <button onClick={() => setIsAddModalOpen(true)} className="bg-highlight hover:bg-highlight-hover text-white px-4 py-2 rounded-xl font-bold shadow-lg text-sm">
                        + Novo Item
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 no-print">
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
                            <p className="text-2xl font-bold text-white">{expiredItems} <span className="text-sm font-normal text-text-secondary">Risco Legal</span></p>
                        </div>
                    </div>
                </Card>
            </div>

            <div className="flex border-b border-white/10 no-print">
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

            <Card className="no-print">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-text-secondary">
                        <thead className="text-xs text-text-secondary uppercase bg-black/20 border-b border-white/5">
                            <tr>
                                <th className="px-4 py-3">Item</th>
                                <th className="px-4 py-3">Categoria</th>
                                <th className="px-4 py-3">Qtd</th>
                                <th className="px-4 py-3">Validade</th>
                                {filter === 'ASSETS' && <th className="px-4 py-3">Responsável</th>}
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
                                        <td className="px-4 py-3 flex items-center gap-3">
                                            {item.qrCodeUrl && <QrcodeIcon className="w-4 h-4 text-text-secondary" />}
                                            <div>
                                                <p className="font-bold text-white">{item.name}</p>
                                                <p className="text-xs">{item.brand} • {item.size}</p>
                                            </div>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded uppercase">{item.category}</span>
                                        </td>
                                        <td className="px-4 py-3 font-bold text-white">{item.quantity}</td>
                                        <td className="px-4 py-3">
                                            {isExpired ? (
                                                <span className="text-red-400 font-bold flex items-center gap-1 text-xs bg-red-900/20 px-2 py-1 rounded"><AlertTriangleIcon className="w-3 h-3"/> Vencido</span>
                                            ) : (
                                                <span className="text-green-400 text-xs">{item.expiryDate ? new Date(item.expiryDate).toLocaleDateString() : 'Indefinido'}</span>
                                            )}
                                        </td>
                                        
                                        {filter === 'ASSETS' && (
                                            <td className="px-4 py-3">
                                                {assignee ? (
                                                    <span className="text-highlight font-bold flex items-center gap-1 text-xs">
                                                        <div className="w-2 h-2 rounded-full bg-highlight"></div>
                                                        {assignee.name}
                                                    </span>
                                                ) : (
                                                    <span className="opacity-50 text-xs">Em Estoque</span>
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
                    
                    <div className="grid grid-cols-2 gap-4 bg-white/5 p-3 rounded-lg border border-white/10">
                        <div>
                            <label className="text-xs font-bold text-text-secondary">Data Fabricação (Opcional)</label>
                            <input type="date" className="w-full bg-black/20 border border-white/10 rounded p-2 text-white text-xs" />
                        </div>
                        <div>
                            <label className="text-xs font-bold text-text-secondary">Data Validade</label>
                            <input type="date" className="w-full bg-black/20 border border-white/10 rounded p-2 text-white text-xs" onChange={e => setNewItem({...newItem, expiryDate: e.target.value as any})} />
                        </div>
                        <p className="col-span-2 text-[10px] text-text-secondary">Essencial para Capacetes (Validade 5-10 anos) para evitar processos.</p>
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
