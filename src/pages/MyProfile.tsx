
import React, { useState, useEffect, useContext } from 'react';
import Card from '../components/Card';
import { Player } from '../types';
import { storageService } from '../services/storageService';
import { authService } from '../services/authService';
import { UserContext } from '../components/Layout';
// Fix: Added UsersIcon to imports and removed title from icons
import { LockIcon, CheckCircleIcon, ClockIcon, AlertTriangleIcon, UsersIcon } from '../components/icons/UiIcons';
import LazyImage from '@/components/LazyImage';
import { useToast } from '../contexts/ToastContext';

const MyProfile: React.FC = () => {
    const { currentRole } = useContext(UserContext);
    const toast = useToast();
    const [player, setPlayer] = useState<Player | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({ weight: 0, height: '' });

    useEffect(() => {
        const user = authService.getCurrentUser();
        const players = storageService.getPlayers();
        const me = players.find(p => p.name === user?.name) || players[0];
        if (me) {
            setPlayer(me);
            setFormData({ weight: me.weight, height: me.height });
        }
    }, []);

    const handleSave = () => {
        if (!player) return;
        
        // Regra de Auditoria: Mudança de peso/altura invalida o verificado
        const hasBiometricChanged = formData.weight !== player.weight || formData.height !== player.height;
        
        const updated = { 
            ...player, 
            ...formData, 
            bioVerified: hasBiometricChanged ? false : player.bioVerified,
            lastWeighIn: hasBiometricChanged ? new Date() : player.lastWeighIn
        };
        
        storageService.savePlayers(storageService.getPlayers().map(p => p.id === player.id ? updated : p));
        setPlayer(updated);
        setIsEditing(false);
        
        if (hasBiometricChanged) {
            toast.warning("Dados biométricos atualizados! Pendente de validação física pelo Staff no próximo treino.");
        } else {
            toast.success("Perfil atualizado.");
        }
    };

    if (!player) return null;

    return (
        <div className="space-y-6 animate-fade-in max-w-4xl mx-auto pb-20">
            <div className="bg-gradient-to-r from-secondary to-primary p-8 rounded-3xl border border-white/10 flex flex-col md:flex-row items-center gap-8 shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 right-0 p-10 opacity-5">
                    <UsersIcon className="w-40 h-40" />
                </div>
                <div className="w-32 h-32 rounded-full p-1 bg-gradient-to-br from-yellow-400 to-highlight relative z-10">
                    <LazyImage src={player.avatarUrl} className="w-full h-full rounded-full object-cover border-4 border-primary" />
                </div>
                <div className="flex-1 text-center md:text-left z-10">
                    <h1 className="text-3xl font-black text-white italic uppercase tracking-tighter">{player.name}</h1>
                    <p className="text-text-secondary font-bold">{player.position} • #{player.jerseyNumber} • {player.class}</p>
                    <div className="flex gap-2 mt-4 justify-center md:justify-start">
                        <button onClick={() => setIsEditing(!isEditing)} className="bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded-xl text-xs font-bold uppercase transition-all">
                            {isEditing ? 'Cancelar' : 'Editar Dados'}
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card title="Auditoria Biométrica">
                    <div className="space-y-4">
                        <div className="bg-black/20 p-4 rounded-xl border border-white/5">
                            <label className="text-[10px] font-black text-text-secondary uppercase block mb-2">Peso Corporal (lbs)</label>
                            <div className="flex items-center gap-3">
                                <input 
                                    type="number" 
                                    disabled={!isEditing} 
                                    value={formData.weight} 
                                    onChange={e => setFormData({...formData, weight: Number(e.target.value)})}
                                    className="bg-black/40 border border-white/10 rounded-lg p-3 text-white w-full font-black text-xl focus:border-highlight outline-none"
                                />
                                {player.bioVerified ? (
                                    <CheckCircleIcon className="w-6 h-6 text-green-500" />
                                ) : (
                                    <ClockIcon className="w-6 h-6 text-yellow-500" />
                                )}
                            </div>
                        </div>

                        <div className="bg-black/20 p-4 rounded-xl border border-white/5">
                            <label className="text-[10px] font-black text-text-secondary uppercase block mb-2">Altura</label>
                            <input 
                                type="text" 
                                disabled={!isEditing} 
                                value={formData.height} 
                                onChange={e => setFormData({...formData, height: e.target.value})}
                                className="bg-black/40 border border-white/10 rounded-lg p-3 text-white w-full font-black text-xl focus:border-highlight outline-none"
                                placeholder="ex: 6'2''"
                            />
                        </div>

                        {isEditing && (
                            <button onClick={handleSave} className="w-full bg-highlight text-white py-3 rounded-xl font-black uppercase shadow-lg transform active:scale-95 transition-all">Salvar e Notificar Staff</button>
                        )}
                        
                        {!player.bioVerified && !isEditing && (
                            <div className="bg-yellow-900/20 border border-yellow-500/20 p-4 rounded-xl flex items-start gap-3">
                                <AlertTriangleIcon className="w-5 h-5 text-yellow-500 shrink-0" />
                                <p className="text-[10px] text-yellow-200 uppercase font-bold leading-tight">
                                    Validação Pendente: Suas medidas mudaram. O Staff realizará a conferência física no próximo treino oficial.
                                </p>
                            </div>
                        )}
                    </div>
                </Card>

                <Card title="Stats da Carreira">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-black/20 p-4 rounded-xl text-center">
                            <p className="text-[10px] text-text-secondary uppercase font-bold">Overall</p>
                            <p className="text-3xl font-black text-white">{player.rating}</p>
                        </div>
                        <div className="bg-black/20 p-4 rounded-xl text-center">
                            <p className="text-[10px] text-text-secondary uppercase font-bold">Nível</p>
                            <p className="text-3xl font-black text-highlight">{player.level}</p>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default MyProfile;
