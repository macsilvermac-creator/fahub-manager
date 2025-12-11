
import React, { useState, useEffect, useMemo } from 'react';
import { storageService } from '../services/storageService';
import { generateSponsorshipProposal } from '../services/geminiService';
import { SponsorDeal, MarketplaceItem, EventSale } from '../types';
import { BriefcaseIcon, ShopIcon, TicketIcon } from '../components/icons/NavIcons';
import Card from '../components/Card';
import { TrendingUpIcon, WalletIcon, CheckCircleIcon } from '../components/icons/UiIcons';

const Commercial: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'CRM' | 'RETAIL' | 'TICKETS'>('CRM');
    
    // CRM State
    const [deals, setDeals] = useState<SponsorDeal[]>([]);
    const [companyName, setCompanyName] = useState('');
    const [askValue, setAskValue] = useState(1000);
    const [isGenerating, setIsGenerating] = useState(false);
    const [proposal, setProposal] = useState('');

    // Retail & Ticket Data
    const [storeItems, setStoreItems] = useState<MarketplaceItem[]>([]);
    const [eventSales, setEventSales] = useState<EventSale[]>([]);

    useEffect(() => {
        // Load heavy data asynchronously
        setTimeout(() => {
            const loadedDeals = storageService.getSponsors() || [];
            setDeals(loadedDeals);

            const loadedItems = storageService.getMarketplaceItems() || [];
            setStoreItems(loadedItems.filter(i => i && i.sellerType === 'TEAM_STORE'));

            const loadedSales = storageService.getEventSales() || [];
            setEventSales(loadedSales);
        }, 0);
    }, []);

    // --- CRM LOGIC ---
    const handleGenerate = async () => {
        if (!companyName) return;
        setIsGenerating(true);
        const text = await generateSponsorshipProposal(companyName, askValue);
        setProposal(text);
        setIsGenerating(false);
    };

    const handleSaveDeal = () => {
        const newDeal: SponsorDeal = {
            id: Date.now().toString(),
            companyName,
            contactPerson: 'TBD',
            status: 'PROSPECT',
            value: askValue,
            lastInteraction: new Date()
        };
        const updated = [newDeal, ...deals];
        setDeals(updated);
        storageService.saveSponsors(updated);
        setProposal('');
        setCompanyName('');
    };

    const getStatusColor = (s: string) => {
        if (s === 'CLOSED_WON') return 'text-green-400';
        if (s === 'NEGOTIATION') return 'text-yellow-400';
        return 'text-text-secondary';
    };

    // --- CALCULATIONS (MEMOIZED & BLINDADOS) ---
    const { totalSponsorships, totalStoreSales, totalTicketSales, totalRevenue } = useMemo(() => {
        const sponsorships = deals
            .filter(d => d && d.status === 'CLOSED_WON')
            .reduce((acc, d) => acc + (d.value || 0), 0);

        const storeSales = storeItems
            .filter(i => i && i.isSold)
            .reduce((acc, i) => acc + (i.price || 0), 0);

        const ticketSales = eventSales
            .filter(s => s && s.totalAmount)
            .reduce((acc, s) => acc + (s.totalAmount || 0), 0);

        return {
            totalSponsorships: sponsorships,
            totalStoreSales: storeSales,
            totalTicketSales: ticketSales,
            totalRevenue: sponsorships + storeSales + ticketSales
        };
    }, [deals, storeItems, eventSales]);

    return (
        <div className="space-y-6 pb-12 animate-fade-in">
             <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-secondary rounded-xl">
                        <BriefcaseIcon className="h-8 w-8 text-highlight" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold text-text-primary">Diretoria Comercial</h2>
                        <p className="text-text-secondary">Gestão de Receita Integrada (Revenue Hub).</p>
                    </div>
                </div>
                
                <div className="bg-gradient-to-r from-green-900/40 to-secondary border border-green-500/30 px-6 py-3 rounded-xl text-right">
                    <p className="text-xs text-green-300 font-bold uppercase">Receita Total Gerada</p>
                    <p className="text-2xl font-black text-white">R$ {totalRevenue.toFixed(2)}</p>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="flex border-b border-white/10 overflow-x-auto">
                <button onClick={() => setActiveTab('CRM')} className={`px-6 py-3 font-bold text-sm border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${activeTab === 'CRM' ? 'border-blue-500 text-blue-400' : 'border-transparent text-text-secondary hover:text-white'}`}>
                    <BriefcaseIcon className="w-4 h-4"/> Patrocínios (CRM)
                </button>
                <button onClick={() => setActiveTab('RETAIL')} className={`px-6 py-3 font-bold text-sm border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${activeTab === 'RETAIL' ? 'border-yellow-500 text-yellow-400' : 'border-transparent text-text-secondary hover:text-white'}`}>
                    <ShopIcon className="w-4 h-4"/> Loja & Merch
                </button>
                <button onClick={() => setActiveTab('TICKETS')} className={`px-6 py-3 font-bold text-sm border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${activeTab === 'TICKETS' ? 'border-green-500 text-green-400' : 'border-transparent text-text-secondary hover:text-white'}`}>
                    <TicketIcon className="w-4 h-4"/> Bilheteria & Eventos
                </button>
            </div>

            {/* === TAB 1: CRM (SPONSORS) === */}
            {activeTab === 'CRM' && (
                <div className="space-y-6 animate-slide-in">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card title="Assistente de Prospecção (IA)">
                            <div className="space-y-4">
                                <div>
                                    <label className="text-xs font-bold text-text-secondary block mb-1">Empresa Alvo</label>
                                    <input className="w-full bg-black/20 border border-white/10 rounded p-2 text-white" placeholder="Ex: Padaria Central" value={companyName} onChange={e => setCompanyName(e.target.value)} />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-text-secondary block mb-1">Valor Solicitado (R$)</label>
                                    <input type="number" className="w-full bg-black/20 border border-white/10 rounded p-2 text-white" value={askValue} onChange={e => setAskValue(Number(e.target.value))} />
                                </div>
                                <button onClick={handleGenerate} disabled={isGenerating || !companyName} className="w-full bg-gradient-to-r from-highlight to-cyan-500 text-white font-bold py-2 rounded flex justify-center items-center gap-2 disabled:opacity-50">
                                     {isGenerating ? 'Escrevendo...' : 'Gerar Email de Prospecção'}
                                </button>
                            </div>
                        </Card>

                        <Card title="Rascunho do Email">
                             {proposal ? (
                                <div className="space-y-4">
                                    <textarea className="w-full h-40 bg-black/20 border border-white/10 rounded p-3 text-white text-sm whitespace-pre-wrap" value={proposal} onChange={e => setProposal(e.target.value)} />
                                    <button onClick={handleSaveDeal} className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded">
                                        Salvar no Pipeline
                                    </button>
                                </div>
                            ) : (
                                <div className="h-full flex items-center justify-center text-text-secondary opacity-50">
                                    Gere uma proposta para visualizar.
                                </div>
                            )}
                        </Card>
                    </div>

                    <Card title="Pipeline de Patrocínios">
                        <div className="bg-secondary rounded-xl border border-white/5 overflow-hidden">
                            <table className="w-full text-sm text-left text-text-secondary">
                                <thead className="bg-black/20 uppercase text-xs font-bold text-text-secondary">
                                    <tr>
                                        <th className="px-6 py-3">Empresa</th>
                                        <th className="px-6 py-3">Status</th>
                                        <th className="px-6 py-3">Valor</th>
                                        <th className="px-6 py-3">Última Interação</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {deals.filter(d => d && d.id).map(deal => (
                                        <tr key={deal.id} className="border-b border-white/5 hover:bg-white/5">
                                            <td className="px-6 py-4 font-bold text-white">{deal.companyName}</td>
                                            <td className={`px-6 py-4 font-bold text-xs ${getStatusColor(deal.status)}`}>{deal.status}</td>
                                            <td className="px-6 py-4 text-white">R$ {deal.value?.toFixed(2)}</td>
                                            <td className="px-6 py-4 text-xs">{deal.lastInteraction ? new Date(deal.lastInteraction).toLocaleDateString() : '-'}</td>
                                        </tr>
                                    ))}
                                    {deals.filter(d => d && d.id).length === 0 && (
                                        <tr>
                                            <td colSpan={4} className="px-6 py-8 text-center text-text-secondary italic">
                                                Nenhum patrocínio cadastrado.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </div>
            )}

            {/* === TAB 2: RETAIL (STORE) === */}
            {activeTab === 'RETAIL' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-slide-in">
                    <Card title="Performance da Loja Oficial">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="p-4 bg-yellow-500/20 rounded-full">
                                <ShopIcon className="w-8 h-8 text-yellow-400" />
                            </div>
                            <div>
                                <p className="text-sm text-text-secondary">Faturamento Varejo</p>
                                <p className="text-3xl font-black text-white">R$ {totalStoreSales.toFixed(2)}</p>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <div className="flex justify-between text-sm border-b border-white/5 pb-2">
                                <span className="text-text-secondary">Itens Cadastrados</span>
                                <span className="text-white font-bold">{storeItems.length}</span>
                            </div>
                            <div className="flex justify-between text-sm border-b border-white/5 pb-2">
                                <span className="text-text-secondary">Itens Vendidos</span>
                                <span className="text-white font-bold">{storeItems.filter(i => i && i.isSold).length}</span>
                            </div>
                            <div className="flex justify-between text-sm border-b border-white/5 pb-2">
                                <span className="text-text-secondary">Taxa de Conversão</span>
                                <span className="text-green-400 font-bold">{storeItems.length > 0 ? ((storeItems.filter(i => i && i.isSold).length / storeItems.length) * 100).toFixed(1) : 0}%</span>
                            </div>
                        </div>
                    </Card>

                    <Card title="Top Produtos (Estoque)">
                        <div className="space-y-3 max-h-[300px] overflow-y-auto custom-scrollbar">
                            {storeItems.filter(i => i && i.id).slice(0, 5).map(item => (
                                <div key={item.id} className="flex items-center gap-3 bg-secondary/50 p-2 rounded-lg border border-white/5">
                                    <div className="w-10 h-10 bg-black/40 rounded flex items-center justify-center text-xs">
                                        <ShopIcon className="w-5 h-5 text-gray-500"/>
                                    </div>
                                    <div className="flex-1">
                                        <p className="text-sm font-bold text-white line-clamp-1">{item.title}</p>
                                        <p className="text-xs text-text-secondary">{item.isSold ? 'Vendido' : 'Em Estoque'}</p>
                                    </div>
                                    <span className="font-mono text-sm text-white">R$ {item.price}</span>
                                </div>
                            ))}
                            {storeItems.length === 0 && <p className="text-center text-text-secondary italic">Nenhum produto em estoque.</p>}
                        </div>
                        <button className="w-full mt-4 text-xs text-highlight hover:underline" onClick={() => window.location.href='#/marketplace'}>Gerenciar Produtos no Marketplace →</button>
                    </Card>
                </div>
            )}

            {/* === TAB 3: TICKETS (EVENT DESK) === */}
            {activeTab === 'TICKETS' && (
                <div className="grid grid-cols-1 gap-6 animate-slide-in">
                    <div className="bg-gradient-to-r from-green-900/30 to-secondary p-6 rounded-2xl border border-green-500/20">
                        <div className="flex justify-between items-center">
                            <div>
                                <h3 className="text-xl font-bold text-white mb-1">Bilheteria & Game Day</h3>
                                <p className="text-sm text-text-secondary">Vendas realizadas via PDV (Event Desk).</p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-text-secondary">Total Arrecadado</p>
                                <p className="text-4xl font-black text-green-400">R$ {totalTicketSales.toFixed(2)}</p>
                            </div>
                        </div>
                    </div>

                    <Card title="Últimas Vendas Realizadas">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left text-text-secondary">
                                <thead className="bg-black/20 uppercase text-xs font-bold">
                                    <tr>
                                        <th className="px-4 py-2">Data</th>
                                        <th className="px-4 py-2">Item</th>
                                        <th className="px-4 py-2">Tipo</th>
                                        <th className="px-4 py-2 text-right">Valor</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {eventSales.filter(s => s && s.id).slice(0, 10).map(sale => (
                                        <tr key={sale.id} className="border-b border-white/5 hover:bg-white/5">
                                            <td className="px-4 py-2 text-xs">{sale.timestamp ? new Date(sale.timestamp).toLocaleDateString() : '-'}</td>
                                            <td className="px-4 py-2 font-bold text-white">{sale.itemName}</td>
                                            <td className="px-4 py-2">
                                                <span className={`text-[10px] px-2 py-0.5 rounded font-bold ${sale.type === 'TICKET' ? 'bg-blue-500/20 text-blue-400' : 'bg-orange-500/20 text-orange-400'}`}>
                                                    {sale.type}
                                                </span>
                                            </td>
                                            <td className="px-4 py-2 text-right text-green-400 font-mono">+ R$ {sale.totalAmount?.toFixed(2)}</td>
                                        </tr>
                                    ))}
                                    {eventSales.length === 0 && (
                                        <tr><td colSpan={4} className="text-center py-8 text-text-secondary italic">Nenhuma venda registrada.</td></tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </div>
            )}
        </div>
    );
};
export default Commercial;