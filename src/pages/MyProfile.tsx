
import React, { useState, useEffect, useContext, useRef } from 'react';
import Card from '../components/Card';
import { Player, EquipmentLiability } from '../types';
import { storageService } from '../services/storageService';
import { authService } from '../services/authService';
import { UserContext } from '../components/Layout';
import { LockIcon, CheckCircleIcon, ClockIcon, AlertTriangleIcon, UsersIcon, PrinterIcon, ShareIcon, QrcodeIcon, ShieldCheckIcon, ClipboardIcon, FileSignatureIcon, CameraIcon } from '../components/icons/UiIcons';
import LazyImage from '@/components/LazyImage';
import { useToast } from '../contexts/ToastContext';
import Modal from '../components/Modal';

const MyProfile: React.FC = () => {
    const { currentRole } = useContext(UserContext);
    const toast = useToast();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [player, setPlayer] = useState<Player | null>(null);
    const [isEditing, setIsEditing] = useState(false);
    const [showCardModal, setShowCardModal] = useState(false);
    const [activeSection, setActiveSection] = useState<'INFO' | 'HEALTH' | 'EQUIPMENT'>('INFO');
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

    const handleUploadMedical = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0] && player) {
            toast.info("Processando exame médico...");
            setTimeout(() => {
                const nextYear = new Date();
                nextYear.setFullYear(nextYear.getFullYear() + 1);
                const updated = { ...player, medicalExamExpiry: nextYear, medicalExamUrl: 'mock-url' };
                setPlayer(updated);
                storageService.savePlayers(storageService.getPlayers().map(p => p.id === player.id ? updated : p));
                toast.success("Atestado de Aptidão Física validado por 12 meses!");
            }, 1500);
        }
    };

    const signLiability = (itemId: string) => {
        if (!player) return;
        const updatedEquipment = (player.assignedEquipment || []).map(eq => 
            eq.itemId === itemId ? { ...eq, signedAt: new Date(), status: 'SIGNED' as const } : eq
        );
        const updated = { ...player, assignedEquipment: updatedEquipment };
        setPlayer(updated);
        storageService.savePlayers(storageService.getPlayers().map(p => p.id === player.id ? updated : p));
        toast.success("Termo assinado digitalmente com sucesso!");
    };

    if (!player) return null;

    const qrData = `FAHUB-PLAYER-${player.id}-${player.cpf}`;
    const isMedicalExpired = player.medicalExamExpiry ? new Date(player.medicalExamExpiry) < new Date() : true;

    return (
        <div className="space-y-6 animate-fade-in max-w-4xl mx-auto pb-20">
            {/* Header / ID Card */}
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
                <div className="z-10 text-center bg-black/30 p-4 rounded-2xl border border-white/10 min-w-[120px]">
                    <p className="text-[10px] text-text-secondary uppercase font-bold mb-1">Rating Geral</p>
                    <p className="text-4xl font-black text-white">{player.rating}</p>
                </div>
            </div>

            {/* Content Tabs */}
            <div className="flex bg-secondary p-1 rounded-2xl border border-white/5 overflow-x-auto no-scrollbar">
                <button onClick={() => setActiveSection('INFO')} className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition-all ${activeSection === 'INFO' ? 'bg-highlight text-white' : 'text-text-secondary hover:text-white'}`}>Ficha Técnica</button>
                <button onClick={() => setActiveSection('HEALTH')} className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${activeSection === 'HEALTH' ? 'bg-red-600 text-white' : 'text-text-secondary hover:text-white'}`}>
                    <ShieldCheckIcon className="w-4 h-4"/> Saúde
                </button>
                <button onClick={() => setActiveSection('EQUIPMENT')} className={`flex-1 py-3 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${activeSection === 'EQUIPMENT' ? 'bg-blue-600 text-white' : 'text-text-secondary hover:text-white'}`}>
                    <ClipboardIcon className="w-4 h-4"/> Inventário
                </button>
            </div>

            {/* TAB: INFO */}
            {activeSection === 'INFO' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-slide-in">
                    <Card title="Dados Físicos & Combine">
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

                    <Card title="Métricas Específicas (Flag Football)">
                         <div className="grid grid-cols-2 gap-4">
                            <div className="bg-secondary p-4 rounded-xl border border-white/5 text-center">
                                <p className="text-[10px] text-text-secondary uppercase font-bold mb-1">Flag Pulls</p>
                                <p className="text-2xl font-black text-white">{player.flagStats?.flagPulls || 0}</p>
                            </div>
                            <div className="bg-secondary p-4 rounded-xl border border-white/5 text-center">
                                <p className="text-[10px] text-text-secondary uppercase font-bold mb-1">Drop Rate</p>
                                <p className="text-2xl font-black text-red-500">{player.flagStats?.drops || 0}%</p>
                            </div>
                            <div className="bg-secondary p-4 rounded-xl border border-white/5 text-center col-span-2">
                                <p className="text-[10px] text-text-secondary uppercase font-bold mb-1">Eficiência de Recepção</p>
                                <div className="h-2 w-full bg-black/30 rounded-full mt-2">
                                    <div className="h-full bg-highlight rounded-full" style={{width: '85%'}}></div>
                                </div>
                            </div>
                         </div>
                    </Card>
                </div>
            )}

            {/* TAB: HEALTH (Health Passport) */}
            {activeSection === 'HEALTH' && (
                <div className="space-y-6 animate-slide-in">
                    <div className={`p-6 rounded-2xl border-l-8 flex flex-col md:flex-row items-center justify-between gap-6 ${isMedicalExpired ? 'bg-red-900/20 border-red-600' : 'bg-green-900/20 border-green-600'}`}>
                        <div className="flex items-center gap-4">
                            <div className={`p-4 rounded-full ${isMedicalExpired ? 'bg-red-600' : 'bg-green-600'}`}>
                                <ShieldCheckIcon className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-white uppercase">Atestado Médico Anual</h3>
                                <p className={`text-sm ${isMedicalExpired ? 'text-red-400' : 'text-green-400'}`}>
                                    {isMedicalExpired ? '🔴 Vencido ou Não Enviado - Bloqueado para Jogos' : `🟢 Válido até: ${new Date(player.medicalExamExpiry!).toLocaleDateString()}`}
                                </p>
                            </div>
                        </div>
                        <input type="file" className="hidden" ref={fileInputRef} onChange={handleUploadMedical} />
                        <button onClick={() => fileInputRef.current?.click()} className="bg-white text-black px-6 py-3 rounded-xl font-bold uppercase text-xs flex items-center gap-2 shadow-lg">
                            <CameraIcon className="w-4 h-4"/> Atualizar Atestado
                        </button>
                    </div>

                    <Card title="Histórico de Saúde & Prontuário">
                         <div className="space-y-4">
                             <div className="bg-secondary p-4 rounded-xl border border-white/5 flex justify-between items-center">
                                <div>
                                    <p className="text-white font-bold">Avaliação Física Semestral</p>
                                    <p className="text-xs text-text-secondary">Realizada em: 10/01/2025</p>
                                </div>
                                <CheckCircleIcon className="text-green-500 w-6 h-6"/>
                             </div>
                             <div className="bg-secondary p-4 rounded-xl border border-white/5 flex justify-between items-center opacity-50">
                                <div>
                                    <p className="text-white font-bold">Triagem Psicológica (Mindset)</p>
                                    <p className="text-xs text-text-secondary">Pendente para temporada 2025</p>
                                </div>
                                <ClockIcon className="text-yellow-500 w-6 h-6"/>
                             </div>
                         </div>
                    </Card>
                </div>
            )}

            {/* TAB: EQUIPMENT (Inventory Liability) */}
            {activeSection === 'EQUIPMENT' && (
                <div className="space-y-6 animate-slide-in">
                    <Card title="Equipamento sob minha Responsabilidade">
                        <div className="space-y-3">
                            {player.assignedEquipment && player.assignedEquipment.length > 0 ? (
                                player.assignedEquipment.map(item => (
                                    <div key={item.itemId} className="bg-secondary p-4 rounded-xl border border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
                                        <div className="flex items-center gap-3">
                                            <div className="p-2 bg-black/20 rounded-lg">
                                                <ClipboardIcon className="w-6 h-6 text-blue-400" />
                                            </div>
                                            <div>
                                                <p className="text-white font-bold uppercase">{item.itemName}</p>
                                                <p className="text-[10px] text-text-secondary font-mono">ID: {item.itemId}</p>
                                            </div>
                                        </div>
                                        
                                        {item.status === 'SIGNED' ? (
                                            <div className="flex items-center gap-2 text-green-400 text-xs font-bold bg-green-500/10 px-3 py-1 rounded-full border border-green-500/30">
                                                <ShieldCheckIcon className="w-4 h-4"/> Assinado em {new Date(item.signedAt!).toLocaleDateString()}
                                            </div>
                                        ) : (
                                            <button onClick={() => signLiability(item.itemId)} className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2">
                                                <FileSignatureIcon className="w-4 h-4" /> Assinar Digitalmente
                                            </button>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <p className="text-center text-text-secondary py-8 italic bg-black/10 rounded-xl">Nenhum equipamento corporativo vinculado.</p>
                            )}
                        </div>
                    </Card>

                    {/* Tackle Safety Check */}
                    {player.helmetExpiryDate && (
                         <div className={`p-4 rounded-xl border flex items-center gap-4 ${new Date(player.helmetExpiryDate) < new Date() ? 'bg-red-900/30 border-red-500' : 'bg-black/30 border-white/10'}`}>
                             <AlertTriangleIcon className={new Date(player.helmetExpiryDate) < new Date() ? 'text-red-500' : 'text-yellow-500'} />
                             <div>
                                 <p className="text-white font-bold text-sm uppercase">Recertificação do Capacete</p>
                                 <p className="text-xs text-text-secondary">Validade NOCSAE: {new Date(player.helmetExpiryDate).toLocaleDateString()}</p>
                             </div>
                         </div>
                    )}
                </div>
            )}

            {/* Modal ID Card (Same as before but with added Health status) */}
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
                    
                    <div className="flex justify-center mb-4">
                         <span className={`text-[10px] font-bold px-3 py-1 rounded-full ${isMedicalExpired ? 'bg-red-600 text-white' : 'bg-green-600 text-white'}`}>
                             SAÚDE: {isMedicalExpired ? 'RESTRITO' : 'LIBERADO'}
                         </span>
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