
import React, { useState, useEffect, useContext } from 'react';
import Card from '../components/Card';
import { Player } from '../types';
import { storageService } from '../services/storageService';
import { authService } from '../services/authService';
import { UserContext } from '../components/Layout';
import { LockIcon, CheckCircleIcon, AlertTriangleIcon, ClockIcon, StarIcon } from '../components/icons/UiIcons';
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
        const me = storageService.getPlayers().find(p => p.name === user?.name) || storageService.getPlayers()[0];
        if (me) {
            setPlayer(me);
            setFormData({ weight: me.weight, height: me.height });
        }
    }, []);

    const handleSave = () => {
        if (!player) return;
        // Auditoria: Se mudou peso/altura, marca como não verificado
        const hasChanged = formData.weight !== player.weight || formData.height !== player.height;
        const updated = { ...player, ...formData, bioVerified: !hasChanged };
        
        storageService.savePlayers(storageService.getPlayers().map(p => p.id === player.id ? updated : p));
        setPlayer(updated);
        setIsEditing(false);
        if (hasChanged) {
            toast.warning("Dados atualizados! Aguarde o Coach validar no próximo treino.");
        } else {
            toast.success("Perfil salvo.");
        }
    };

    if (!player) return null;

    return (
        <div className="space-y-6 animate-fade-in max-w-4xl mx-auto pb-20">
            <div className="bg-gradient-to-r from-secondary to-primary p-8 rounded-3xl border border-white/10 flex flex-col md:flex-row items-center gap-8 shadow-2xl">
                <div className="w-32 h-32 rounded-full p-1 bg-gradient-to-br from-yellow-400 to-highlight">
                    <LazyImage src={player.avatarUrl} className="w-full h-full rounded-full object-cover border-4 border-primary" />
                </div>
                <div className="flex-1 text-center md:text-left">
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
                <Card title="Dados Biométricos (Auditados)">
                    <div className="space-y-4">
                        <div className="relative">
                            <label className="text-[10px] font-black text-text-secondary uppercase">Peso (lbs)</label>
                            <div className="flex items-center gap-3">
                                <input 
                                    type="number" 
                                    disabled={!isEditing} 
                                    value={formData.weight} 
                                    onChange={e => setFormData({...formData, weight: Number(e.target.value)})}
                                    className="bg-black/20 border border-white/10 rounded-lg p-3 text-white w-full font-bold focus:border-highlight outline-none"
                                />
                                {player.bioVerified ? (
                                    <CheckCircleIcon className="w-6 h-6 text-green-500" />
                                ) : (
                                    <ClockIcon className="w-6 h-6 text-yellow-500" />
                                )}
                            </div>
                        </div>
                        <div className="relative">
                            <label className="text-[10px] font-black text-text-secondary uppercase">Altura</label>
                            <input 
                                type="text" 
                                disabled={!isEditing} 
                                value={formData.height} 
                                onChange={e => setFormData({...formData, height: e.target.value})}
                                className="bg-black/20 border border-white/10 rounded-lg p-3 text-white w-full font-bold focus:border-highlight outline-none"
                            />
                        </div>
                        {isEditing && (
                            <button onClick={handleSave} className="w-full bg-highlight text-white py-3 rounded-xl font-black uppercase shadow-lg">Salvar e Notificar Staff</button>
                        )}
                        {!player.bioVerified && !isEditing && (
                            <div className="bg-yellow-900/20 border border-yellow-500/20 p-3 rounded-lg flex items-center gap-2">
                                <AlertTriangleIcon className="w-4 h-4 text-yellow-500" />
                                <span className="text-[9px] text-yellow-200 uppercase font-bold">Validação Pendente: Suba na balança no próximo treino!</span>
                            </div>
                        )}
                    </div>
                </Card>

                <Card title="Badges & Conquistas">
                    <div className="flex flex-wrap gap-2">
                        {player.badges?.map(b => (
                            <div key={b} className="bg-black/20 border border-white/10 px-3 py-2 rounded-xl flex items-center gap-2">
                                <StarIcon className="w-4 h-4 text-yellow-500" />
                                <span className="text-xs font-bold text-white uppercase">{b}</span>
                            </div>
                        ))}
                    </div>
                </Card>
            </div>
        </div>
    );
};

export default MyProfile;