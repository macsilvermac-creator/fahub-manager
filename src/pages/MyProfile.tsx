
import React, { useState, useEffect, useContext } from 'react';
import Card from '../components/Card';
import { Player } from '../types';
import { storageService } from '../services/storageService';
import { authService } from '../services/authService';
import { UserContext } from '../components/Layout';
import { LockIcon, CheckCircleIcon, ClockIcon, AlertTriangleIcon, UsersIcon, PrinterIcon, ShareIcon, QrcodeIcon } from '../components/icons/UiIcons';
import LazyImage from '@/components/LazyImage';
import { useToast } from '../contexts/ToastContext';
import Modal from '../components/Modal';

const MyProfile: React.FC = () => {
    const { currentRole } = useContext(UserContext);
    const toast = useToast();
    const [player, setPlayer] = useState<Player | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [showCardModal, setShowCardModal] = useState(false);
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
        if (hasBiometricChanged) toast.warning("Dados biométricos atualizados! Pendente de validação física.");
        else toast.success("Perfil atualizado.");
    };

    if (!player) return null;

    const qrData = `FAHUB-PLAYER-${player.id}-${player.cpf}`;

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
                        <button onClick={() => setShowCardModal(true)} className="bg-yellow-600 hover:bg-yellow-500 text-white px-6 py-2 rounded-xl text-xs font-bold uppercase shadow-lg transition-all flex items-center gap-2">
                             <QrcodeIcon className="w-4 h-4" /> ID Digital
                        </button>
                        <button onClick={() => setIsEditing(!isEditing)} className="bg-white/10 hover:bg-white/20 text-white px-4 py-2 rounded-xl text-xs font-bold uppercase transition-all">
                            {isEditing ? 'Cancelar' : 'Editar'}
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
                                <input type="number" disabled={!isEditing} value={formData.weight} onChange={e => setFormData({...formData, weight: Number(e.target.value)})} className="bg-black/40 border border-white/10 rounded-lg p-3 text-white w-full font-black text-xl outline-none focus:border-highlight" />
                                {player.bioVerified ? <CheckCircleIcon className="w-6 h-6 text-green-500" /> : <ClockIcon className="w-6 h-6 text-yellow-500" />}
                            </div>
                        </div>
                        <div className="bg-black/20 p-4 rounded-xl border border-white/5">
                            <label className="text-[10px] font-black text-text-secondary uppercase block mb-2">Altura</label>
                            <input type="text" disabled={!isEditing} value={formData.height} onChange={e => setFormData({...formData, height: e.target.value})} className="bg-black/40 border border-white/10 rounded-lg p-3 text-white w-full font-black text-xl outline-none focus:border-highlight" />
                        </div>
                        {isEditing && <button onClick={handleSave} className="w-full bg-highlight text-white py-3 rounded-xl font-black uppercase shadow-lg">Salvar Biometria</button>}
                    </div>
                </Card>

                <Card title="Status de Federação">
                     <div className="flex flex-col items-center justify-center h-full space-y-4 py-4">
                        <div className="bg-white p-3 rounded-2xl">
                             <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${qrData}`} className="w-32 h-32" alt="QR Code ID" />
                        </div>
                        <div className="text-center">
                            <p className="text-xs text-text-secondary uppercase font-black">Escaneie no Check-in de Campo</p>
                            <span className="bg-green-500/20 text-green-400 px-3 py-1 rounded-full text-[10px] font-bold mt-2 inline-block">REGULAR (BID 2025)</span>
                        </div>
                     </div>
                </Card>
            </div>

            <Modal isOpen={showCardModal} onClose={() => setShowCardModal(false)} title="Identidade Digital Atleta" maxWidth="max-w-sm">
                <div id="official-card-area" className="bg-gradient-to-br from-slate-900 to-black p-6 rounded-2xl border-2 border-highlight shadow-glow text-center">
                    <div className="flex justify-between items-start mb-6">
                        <img src={storageService.getTeamSettings().logoUrl} className="w-12 h-12 object-contain" />
                        <div className="text-right">
                            <p className="text-white font-black text-lg leading-tight">BID 2025</p>
                            <p className="text-highlight text-[10px] font-bold uppercase tracking-widest">Atleta Federado</p>
                        </div>
                    </div>
                    <LazyImage src={player.avatarUrl} className="w-32 h-32 rounded-full mx-auto border-4 border-highlight mb-4 object-cover" />
                    <h2 className="text-2xl font-black text-white uppercase italic">{player.name}</h2>
                    <p className="text-highlight font-bold text-sm mb-6">{player.position} #{player.jerseyNumber}</p>
                    
                    <div className="bg-white p-4 rounded-xl inline-block mb-4 shadow-inner">
                         <img src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${qrData}`} className="w-32 h-32" />
                    </div>
                    
                    <div className="flex gap-2">
                         <button onClick={() => window.print()} className="flex-1 bg-white/5 text-white py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2 border border-white/10 hover:bg-white/10">
                            <PrinterIcon className="w-4 h-4" /> PDF
                         </button>
                         <button className="flex-1 bg-highlight text-white py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2">
                            <ShareIcon className="w-4 h-4" /> Enviar
                         </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default MyProfile;