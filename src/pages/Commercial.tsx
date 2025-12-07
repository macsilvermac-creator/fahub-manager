
import React, { useState, useEffect } from 'react';
import { storageService } from '../services/storageService';
import { generateSponsorshipProposal } from '../services/geminiService';
import { SponsorDeal } from '../types';
import { BriefcaseIcon } from '../components/icons/NavIcons';
import Card from '../components/Card';

const Commercial: React.FC = () => {
    const [deals, setDeals] = useState<SponsorDeal[]>([]);
    const [companyName, setCompanyName] = useState('');
    const [askValue, setAskValue] = useState(1000);
    const [isGenerating, setIsGenerating] = useState(false);
    const [proposal, setProposal] = useState('');

    useEffect(() => {
        setDeals(storageService.getSponsors());
    }, []);

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

    return (
        <div className="space-y-6 pb-12 animate-fade-in">
             <div className="flex items-center gap-3">
                <div className="p-3 bg-secondary rounded-xl">
                    <svg className="h-8 w-8 text-highlight" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>
                </div>
                <div>
                    <h2 className="text-3xl font-bold text-text-primary">Diretoria Comercial</h2>
                    <p className="text-text-secondary">CRM de Patrocínios e Geração de Propostas.</p>
                </div>
            </div>

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
                        <button onClick={handleGenerate} disabled={isGenerating || !companyName} className="w-full bg-gradient-to-r from-highlight to-cyan-500 text-white font-bold py-2 rounded flex justify-center items-center gap-2">
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

            <h3 className="font-bold text-xl text-white mt-8">Pipeline de Patrocínios (CRM)</h3>
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
                        {deals.map(deal => (
                            <tr key={deal.id} className="border-b border-white/5 hover:bg-white/5">
                                <td className="px-6 py-4 font-bold text-white">{deal.companyName}</td>
                                <td className={`px-6 py-4 font-bold text-xs ${getStatusColor(deal.status)}`}>{deal.status}</td>
                                <td className="px-6 py-4 text-white">R$ {deal.value.toFixed(2)}</td>
                                <td className="px-6 py-4 text-xs">{new Date(deal.lastInteraction).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
export default Commercial;
