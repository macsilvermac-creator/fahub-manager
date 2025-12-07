
import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import { storageService } from '../services/storageService';
import { TeamSettings } from '../types';
import { SettingsNavIcon } from '../components/icons/NavIcons'; // Assuming this exists or using UiIcons
import { CheckCircleIcon } from '../components/icons/UiIcons';

const TeamSettingsPage: React.FC = () => {
    const [settings, setSettings] = useState<TeamSettings | null>(null);
    const [isSaving, setIsSaving] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        setSettings(storageService.getTeamSettings());
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!settings) return;
        setSettings({ ...settings, [e.target.name]: e.target.value });
    };

    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        if (!settings) return;
        setIsSaving(true);
        
        storageService.saveTeamSettings(settings);
        
        setTimeout(() => {
            setIsSaving(false);
            setSuccessMessage('Configurações salvas com sucesso!');
            setTimeout(() => setSuccessMessage(''), 3000);
        }, 800);
    };

    if (!settings) return null;

    return (
        <div className="space-y-6 pb-12 animate-fade-in">
            <div className="flex items-center gap-3">
                <div className="p-3 bg-secondary rounded-xl">
                    <svg className="w-8 h-8 text-highlight" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                </div>
                <div>
                    <h2 className="text-3xl font-bold text-text-primary">Configurações da Equipe</h2>
                    <p className="text-text-secondary">Identidade visual e dados institucionais para documentos.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <Card title="Dados Institucionais">
                        <form onSubmit={handleSave} className="space-y-4">
                            <div>
                                <label className="text-xs font-bold text-text-secondary block mb-1">Nome Oficial da Equipe</label>
                                <input name="teamName" className="w-full bg-black/20 border border-white/10 rounded p-3 text-white focus:border-highlight focus:outline-none" value={settings.teamName} onChange={handleChange} required />
                            </div>
                            <div>
                                <label className="text-xs font-bold text-text-secondary block mb-1">Endereço Completo</label>
                                <input name="address" className="w-full bg-black/20 border border-white/10 rounded p-3 text-white focus:border-highlight focus:outline-none" value={settings.address} onChange={handleChange} required />
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-bold text-text-secondary block mb-1">Website</label>
                                    <input name="website" className="w-full bg-black/20 border border-white/10 rounded p-3 text-white focus:border-highlight focus:outline-none" value={settings.website} onChange={handleChange} />
                                </div>
                                <div>
                                    <label className="text-xs font-bold text-text-secondary block mb-1">Email de Contato</label>
                                    <input name="contactEmail" className="w-full bg-black/20 border border-white/10 rounded p-3 text-white focus:border-highlight focus:outline-none" value={settings.contactEmail} onChange={handleChange} />
                                </div>
                            </div>
                            
                            <div className="pt-4 border-t border-white/10">
                                <h4 className="text-sm font-bold text-white mb-3">Identidade Visual (Logo)</h4>
                                <div className="flex gap-4 items-start">
                                    <div className="w-24 h-24 bg-white rounded-lg flex items-center justify-center p-2">
                                        <img src={settings.logoUrl} alt="Logo Preview" className="max-w-full max-h-full object-contain" />
                                    </div>
                                    <div className="flex-1">
                                        <label className="text-xs font-bold text-text-secondary block mb-1">URL da Logo (PNG/JPG)</label>
                                        <input name="logoUrl" className="w-full bg-black/20 border border-white/10 rounded p-3 text-white text-sm focus:border-highlight focus:outline-none" value={settings.logoUrl} onChange={handleChange} placeholder="https://..." />
                                        <p className="text-[10px] text-text-secondary mt-1">Recomendamos imagem com fundo transparente.</p>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end pt-4">
                                <button type="submit" disabled={isSaving} className="bg-highlight hover:bg-highlight-hover text-white px-8 py-3 rounded-lg font-bold shadow-lg transition-all flex items-center gap-2">
                                    {isSaving ? 'Salvando...' : 'Salvar Alterações'}
                                    {successMessage && <CheckCircleIcon className="w-5 h-5 text-white" />}
                                </button>
                            </div>
                            {successMessage && <p className="text-green-400 text-sm text-right mt-2 animate-pulse">{successMessage}</p>}
                        </form>
                    </Card>
                </div>

                <div>
                    <Card title="Pré-visualização do Papel Timbrado">
                        <div className="bg-white p-4 rounded-lg h-[400px] relative overflow-hidden flex flex-col items-center border-4 border-gray-300">
                            {/* Simulation of PrintLayout */}
                            <div className="w-full flex items-center border-b border-gray-200 pb-2 mb-4">
                                <img src={settings.logoUrl} className="w-10 h-10 object-contain mr-2" />
                                <div className="text-left">
                                    <h1 className="text-xs font-black text-gray-900 uppercase">{settings.teamName}</h1>
                                    <p className="text-[8px] text-gray-500 leading-tight">{settings.address}</p>
                                </div>
                            </div>
                            
                            {/* Watermark Sim */}
                            <img src={settings.logoUrl} className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 opacity-10 grayscale" />
                            
                            <div className="w-full space-y-2">
                                <div className="h-2 bg-gray-200 w-3/4 rounded"></div>
                                <div className="h-2 bg-gray-200 w-full rounded"></div>
                                <div className="h-2 bg-gray-200 w-full rounded"></div>
                                <div className="h-2 bg-gray-200 w-5/6 rounded"></div>
                            </div>

                            <div className="mt-auto w-full text-center border-t border-gray-200 pt-2">
                                <p className="text-[8px] text-gray-400">Rodapé Automático: Impresso por [Usuario] em [Data]</p>
                            </div>
                        </div>
                        <p className="text-xs text-text-secondary mt-3 text-center">
                            Este layout será aplicado automaticamente ao imprimir Roteiros de Treino, Rosters e Relatórios.
                        </p>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default TeamSettingsPage;
