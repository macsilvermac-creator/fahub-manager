
import React, { useState, useEffect, useContext } from 'react';
import Card from '../components/Card';
import { Player, EquipmentLiability } from '../types';
import { storageService } from '../services/storageService';
import { authService } from '../services/authService';
import { UserContext } from '../components/Layout';
import { ShieldCheckIcon, AlertTriangleIcon, CheckCircleIcon, ClockIcon, ActivityIcon, KeyIcon } from '../components/icons/UiIcons';
import LazyImage from '@/components/LazyImage';
import { useToast } from '../contexts/ToastContext';

const MyProfile: React.FC = () => {
    const { currentRole } = useContext(UserContext);
    const toast = useToast();
    const [player, setPlayer] = useState<Player | null>(null);
    const [viewMode, setViewMode] = useState<'FLAG' | 'TACKLE'>('TACKLE');

    useEffect(() => {
        const user = authService.getCurrentUser();
        const players = storageService.getPlayers();
        const me = players.find(p => p.name === user?.name) || players[0];
        
        // Mock data para equipamentos se não houver
        if (me && !me.inventoryLiability) {
            me.inventoryLiability = [
                { itemId: 'H-001', itemName: 'Capacete Riddell Speed', category: 'HELMET', conditionOnDelivery: 'Novo', expiryDate: new Date('2026-12-31') },
                { itemId: 'S-042', itemName: 'Shoulder Pad Schutt XV', category: 'PADS', conditionOnDelivery: 'Usado/Bom', expiryDate: new Date('2028-06-15') }
            ];
        }
        
        if (me) setPlayer(me);
    }, []);

    const handleAcceptEquipment = (itemId: string) => {
        if (!player) return;
        const updatedInventory = player.inventoryLiability?.map(item => 
            item.itemId === itemId ? { ...item, acceptedAt: new Date() } : item
        );
        const updatedPlayer = { ...player, inventoryLiability: updatedInventory };
        setPlayer(updatedPlayer);
        // Em um sistema real, aqui persistiríamos a assinatura digital/timestamp
        toast.success("Responsabilidade do equipamento aceita com sucesso!");
    };

    if (!player) return null;

    return (
        <div className="space-y-6 animate-fade-in pb-20 max-w-5xl mx-auto">
            {/* Header com Status de Saúde */}
            <div className="bg-gradient-to-br from-slate-900 to-black p-8 rounded-3xl border border-white/10 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
                <div className="w-32 h-32 rounded-full p-1 bg-gradient-to-br from-highlight to-blue-500">
                    <LazyImage src={player.avatarUrl} className="w-full h-full rounded-full object-cover border-4 border-primary" />
                </div>
                <div className="flex-1 text-center md:text-left z-10">
                    <h1 className="text-4xl font-black text-white italic uppercase tracking-tighter">{player.name}</h1>
                    <div className="flex flex-wrap gap-4 mt-4 justify-center md:justify-start">
                        <div className="bg-white/5 px-4 py-2 rounded-xl border border-white/10">
                            <p className="text-[10px] text-text-secondary uppercase font-bold">Atestado Médico</p>
                            <p className="text-sm font-bold text-green-400 flex items-center gap-2">
                                <CheckCircleIcon className="w-4 h-4"/> VÁLIDO
                            </p>
                        </div>
                        <div className="bg-white/5 px-4 py-2 rounded-xl border border-white/10">
                            <p className="text-[10px] text-text-secondary uppercase font-bold">Risco Bio-Mecânico</p>
                            <p className="text-sm font-bold text-yellow-400 flex items-center gap-2">
                                <ActivityIcon className="w-4 h-4"/> MONITORADO
                            </p>
                        </div>
                    </div>
                </div>
                <div className="text-right">
                    <span className="text-[10px] font-black text-highlight bg-highlight/10 px-3 py-1 rounded-full border border-highlight/30 uppercase">
                        {player.rosterCategory} ROSTER
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* NOCSAE & Equipment Liability */}
                <div className="lg:col-span-2 space-y-6">
                    <Card title="Patrimônio & Responsabilidade Civil">
                        <div className="space-y-4">
                            {player.inventoryLiability?.map(item => {
                                const isExpired = new Date(item.expiryDate) < new Date();
                                return (
                                    <div key={item.itemId} className="bg-black/20 p-4 rounded-2xl border border-white/5 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                        <div className="flex items-center gap-4">
                                            <div className={`p-3 rounded-xl ${isExpired ? 'bg-red-500/20 text-red-500' : 'bg-highlight/20 text-highlight'}`}>
                                                <ShieldCheckIcon className="w-6 h-6" />
                                            </div>
                                            <div>
                                                <h4 className="font-bold text-white text-sm">{item.itemName}</h4>
                                                <p className="text-[10px] text-text-secondary uppercase">ID: {item.itemId} • NOCSAE: {item.expiryDate.toLocaleDateString()}</p>
                                                {isExpired && <p className="text-[10px] text-red-500 font-bold mt-1">⚠ RE-CERTIFICAÇÃO NECESSÁRIA</p>}
                                            </div>
                                        </div>
                                        {item.acceptedAt ? (
                                            <div className="text-right">
                                                <span className="text-[10px] font-bold text-green-400 flex items-center gap-1">
                                                    <CheckCircleIcon className="w-3 h-3"/> ACEITE EM {new Date(item.acceptedAt).toLocaleDateString()}
                                                </span>
                                            </div>
                                        ) : (
                                            <button 
                                                onClick={() => handleAcceptEquipment(item.itemId)}
                                                className="bg-highlight hover:bg-highlight-hover text-white px-4 py-2 rounded-lg text-xs font-bold uppercase transition-all"
                                            >
                                                Confirmar Recebimento
                                            </button>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </Card>

                    <Card title="Plano de Desenvolvimento (PDI)">
                        <div className="bg-blue-900/10 border-l-4 border-blue-500 p-6 rounded-r-2xl">
                             <div className="flex justify-between items-start mb-4">
                                <h4 className="font-bold text-white uppercase italic">Ciclo de Agilidade Q1</h4>
                                <span className="bg-blue-600 text-white text-[10px] font-black px-2 py-0.5 rounded">EM FOCO</span>
                             </div>
                             <p className="text-sm text-text-secondary leading-relaxed">
                                Seu tempo de reação caiu 15ms desde o último combine. Foco em exercícios de "Mirror Drill" e 
                                "Cone Reaction" nos próximos 3 treinos. A IA sugere reduzir a carga de perna na sexta-feira 
                                para manter o frescor lateral no jogo de domingo.
                             </p>
                             <button className="mt-4 text-xs font-bold text-highlight hover:underline flex items-center gap-2">
                                <KeyIcon className="w-4 h-4"/> Ver Trilhas Sugeridas no Academy
                             </button>
                        </div>
                    </Card>
                </div>

                {/* Skill Radar Chart Placeholder & Health Stats */}
                <div className="space-y-6">
                    <Card title="Skill Matrix 5v5">
                        <div className="aspect-square bg-black/40 rounded-full border-4 border-white/5 flex items-center justify-center relative">
                            {/* Gráfico de teia simulado em CSS/SVG */}
                            <svg viewBox="0 0 100 100" className="w-full h-full p-4">
                                <circle cx="50" cy="50" r="45" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5"/>
                                <circle cx="50" cy="50" r="30" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5"/>
                                <circle cx="50" cy="50" r="15" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5"/>
                                <polygon points="50,10 85,35 75,80 25,80 15,35" fill="rgba(5, 150, 105, 0.3)" stroke="#059669" strokeWidth="1"/>
                            </svg>
                            <div className="absolute top-2 left-1/2 -translate-x-1/2 text-[8px] font-bold text-white uppercase">Reaction</div>
                            <div className="absolute top-1/3 right-2 text-[8px] font-bold text-white uppercase">Hands</div>
                            <div className="absolute bottom-4 right-8 text-[8px] font-bold text-white uppercase">Lateral</div>
                            <div className="absolute bottom-4 left-8 text-[8px] font-bold text-white uppercase">Strength</div>
                            <div className="absolute top-1/3 left-2 text-[8px] font-bold text-white uppercase">IQ</div>
                        </div>
                    </Card>

                    <Card title="Passaporte de Saúde">
                        <div className="space-y-4">
                            <div className="flex justify-between items-center border-b border-white/5 pb-2">
                                <span className="text-xs text-text-secondary">Última Pesagem</span>
                                <span className="text-xs font-bold text-white">{player.weight} lbs</span>
                            </div>
                            <div className="flex justify-between items-center border-b border-white/5 pb-2">
                                <span className="text-xs text-text-secondary">Pressão Arterial (Med)</span>
                                <span className="text-xs font-bold text-white">12/8</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-xs text-text-secondary">ECG / Cardiologia</span>
                                <span className="text-[10px] bg-green-500/20 text-green-400 font-bold px-2 py-0.5 rounded">NORMAL</span>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default MyProfile;