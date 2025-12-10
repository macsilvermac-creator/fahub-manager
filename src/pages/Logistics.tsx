
import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import { Player, StaffMember, Game } from '../types';
import { storageService } from '../services/storageService';
import { BusIcon, BedIcon, MapPinIcon, CheckCircleIcon, PrinterIcon } from '../components/icons/UiIcons';
import { useToast } from '../contexts/ToastContext';
import LazyImage from '@/components/LazyImage';

interface Room {
    id: string;
    number: string;
    type: 'DOUBLE' | 'TRIPLE' | 'QUAD';
    occupants: string[]; // Names
}

const Logistics: React.FC = () => {
    const toast = useToast();
    const [activeTab, setActiveTab] = useState<'MANIFEST' | 'ROOMING' | 'ITINERARY'>('MANIFEST');
    const [players, setPlayers] = useState<Player[]>([]);
    const [staff, setStaff] = useState<StaffMember[]>([]);
    const [games, setGames] = useState<Game[]>([]);
    
    const [selectedGameId, setSelectedGameId] = useState('');
    const [manifest, setManifest] = useState<string[]>([]); // List of IDs (Players + Staff)
    const [rooms, setRooms] = useState<Room[]>([
        { id: 'r1', number: '101', type: 'DOUBLE', occupants: [] },
        { id: 'r2', number: '102', type: 'DOUBLE', occupants: [] },
        { id: 'r3', number: '103', type: 'QUAD', occupants: [] },
    ]);

    useEffect(() => {
        setPlayers(storageService.getPlayers().filter(p => p.status === 'ACTIVE'));
        setStaff(storageService.getStaff());
        setGames(storageService.getGames().filter(g => g.location === 'Away' && g.status === 'SCHEDULED'));
    }, []);

    const togglePassenger = (id: string) => {
        if (manifest.includes(id)) {
            setManifest(prev => prev.filter(mid => mid !== id));
        } else {
            setManifest(prev => [...prev, id]);
        }
    };

    const addToRoom = (roomId: string, name: string) => {
        setRooms(prev => prev.map(r => {
            if (r.id === roomId && r.occupants.length < (r.type === 'DOUBLE' ? 2 : r.type === 'TRIPLE' ? 3 : 4)) {
                return { ...r, occupants: [...r.occupants, name] };
            }
            return r;
        }));
    };

    const removeFromRoom = (roomId: string, name: string) => {
        setRooms(prev => prev.map(r => r.id === roomId ? { ...r, occupants: r.occupants.filter(o => o !== name) } : r));
    };

    return (
        <div className="space-y-6 pb-12 animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-secondary rounded-xl">
                        <BusIcon className="text-highlight w-8 h-8" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold text-text-primary">Logística de Viagem</h2>
                        <p className="text-text-secondary">Gestão de transporte e hospedagem para jogos fora.</p>
                    </div>
                </div>
                
                <select 
                    className="bg-secondary border border-white/10 rounded-xl p-3 text-white focus:border-highlight focus:outline-none"
                    value={selectedGameId}
                    onChange={(e) => setSelectedGameId(e.target.value)}
                >
                    <option value="">Selecione o Jogo...</option>
                    {games.map(g => (
                        <option key={g.id} value={g.id}>vs {g.opponent} ({new Date(g.date).toLocaleDateString()})</option>
                    ))}
                </select>
            </div>

            {!selectedGameId ? (
                <div className="text-center py-20 text-text-secondary bg-secondary/20 rounded-xl border border-dashed border-white/10">
                    Selecione um jogo "Fora de Casa" (Away) para iniciar o planejamento.
                </div>
            ) : (
                <>
                    <div className="flex border-b border-white/10 overflow-x-auto">
                        <button onClick={() => setActiveTab('MANIFEST')} className={`px-6 py-3 font-bold text-sm border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${activeTab === 'MANIFEST' ? 'border-highlight text-highlight' : 'border-transparent text-text-secondary'}`}>
                            <BusIcon className="w-4 h-4"/> Manifesto de Ônibus
                        </button>
                        <button onClick={() => setActiveTab('ROOMING')} className={`px-6 py-3 font-bold text-sm border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${activeTab === 'ROOMING' ? 'border-blue-500 text-blue-400' : 'border-transparent text-text-secondary'}`}>
                            <BedIcon className="w-4 h-4"/> Rooming List (Hotel)
                        </button>
                        <button onClick={() => setActiveTab('ITINERARY')} className={`px-6 py-3 font-bold text-sm border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${activeTab === 'ITINERARY' ? 'border-green-500 text-green-400' : 'border-transparent text-text-secondary'}`}>
                            <MapPinIcon className="w-4 h-4"/> Itinerário
                        </button>
                    </div>

                    {activeTab === 'MANIFEST' && (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            <div className="lg:col-span-2">
                                <Card title="Seleção de Passageiros">
                                    <div className="mb-4 flex gap-4 text-sm text-text-secondary">
                                        <span>Total Selecionado: <strong className="text-white">{manifest.length}</strong></span>
                                        <span>Capacidade Ônibus: <strong className="text-white">46</strong></span>
                                        <span className={manifest.length > 46 ? 'text-red-400 font-bold' : 'text-green-400'}>
                                            {manifest.length > 46 ? '⚠ Excedido' : '✓ Dentro do Limite'}
                                        </span>
                                    </div>
                                    <div className="h-[500px] overflow-y-auto pr-2 custom-scrollbar space-y-2">
                                        <h4 className="text-xs font-bold text-text-secondary uppercase sticky top-0 bg-secondary py-2">Staff & Coaches</h4>
                                        {staff.map(s => (
                                            <div key={s.id} onClick={() => togglePassenger(s.id)} className={`flex items-center justify-between p-3 rounded border cursor-pointer ${manifest.includes(s.id) ? 'bg-highlight/20 border-highlight' : 'bg-black/20 border-white/5'}`}>
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${manifest.includes(s.id) ? 'bg-highlight border-highlight' : 'border-white/30'}`}>
                                                        {manifest.includes(s.id) && <CheckCircleIcon className="w-3 h-3 text-white" />}
                                                    </div>
                                                    <span className="text-white font-bold">{s.name}</span>
                                                </div>
                                                <span className="text-xs text-text-secondary">{s.role}</span>
                                            </div>
                                        ))}

                                        <h4 className="text-xs font-bold text-text-secondary uppercase sticky top-0 bg-secondary py-2 mt-4">Atletas</h4>
                                        {players.map(p => (
                                            <div key={p.id} onClick={() => togglePassenger(String(p.id))} className={`flex items-center justify-between p-3 rounded border cursor-pointer ${manifest.includes(String(p.id)) ? 'bg-highlight/20 border-highlight' : 'bg-black/20 border-white/5'}`}>
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${manifest.includes(String(p.id)) ? 'bg-highlight border-highlight' : 'border-white/30'}`}>
                                                        {manifest.includes(String(p.id)) && <CheckCircleIcon className="w-3 h-3 text-white" />}
                                                    </div>
                                                    <LazyImage src={p.avatarUrl} className="w-8 h-8 rounded-full" />
                                                    <div>
                                                        <p className="text-white font-bold text-sm">{p.name}</p>
                                                        <p className="text-xs text-text-secondary">{p.position}</p>
                                                    </div>
                                                </div>
                                                <span className="text-xs text-text-secondary">RG: {p.cpf || 'Pendente'}</span>
                                            </div>
                                        ))}
                                    </div>
                                </Card>
                            </div>
                            <div className="space-y-6">
                                <Card title="Resumo">
                                    <div className="space-y-4">
                                        <div className="bg-black/20 p-4 rounded-lg text-center">
                                            <p className="text-sm text-text-secondary">Custo Estimado (Ônibus)</p>
                                            <p className="text-2xl font-bold text-white">R$ 4.500,00</p>
                                        </div>
                                        <button className="w-full bg-secondary border border-white/10 hover:bg-white/5 text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2">
                                            <PrinterIcon className="w-4 h-4" /> Imprimir Manifesto (ANTT)
                                        </button>
                                    </div>
                                </Card>
                            </div>
                        </div>
                    )}

                    {activeTab === 'ROOMING' && (
                        <div className="space-y-6">
                            <div className="flex gap-4 overflow-x-auto pb-2">
                                {rooms.map(room => (
                                    <div key={room.id} className="min-w-[250px] bg-secondary border border-white/10 rounded-xl p-4">
                                        <div className="flex justify-between items-center mb-3">
                                            <h4 className="font-bold text-white">Quarto {room.number}</h4>
                                            <span className="text-xs bg-white/10 px-2 py-0.5 rounded text-text-secondary">{room.type}</span>
                                        </div>
                                        <div className="space-y-2 min-h-[100px] bg-black/20 rounded p-2 mb-2">
                                            {room.occupants.map((occ, idx) => (
                                                <div key={idx} className="flex justify-between items-center text-xs bg-white/5 p-1.5 rounded text-white">
                                                    <span>{occ}</span>
                                                    <button onClick={() => removeFromRoom(room.id, occ)} className="text-red-400 hover:text-white">×</button>
                                                </div>
                                            ))}
                                            {room.occupants.length === 0 && <span className="text-xs text-text-secondary italic">Vazio</span>}
                                        </div>
                                        <button 
                                            onClick={() => {
                                                const name = prompt("Nome do Ocupante:");
                                                if(name) addToRoom(room.id, name);
                                            }}
                                            className="w-full text-xs bg-highlight/20 text-highlight hover:bg-highlight hover:text-white py-1 rounded font-bold"
                                        >
                                            + Add Ocupante
                                        </button>
                                    </div>
                                ))}
                                <button 
                                    onClick={() => setRooms([...rooms, { id: `r${Date.now()}`, number: `${100 + rooms.length + 1}`, type: 'DOUBLE', occupants: [] }])}
                                    className="min-w-[100px] border-2 border-dashed border-white/10 rounded-xl flex items-center justify-center text-text-secondary hover:text-white hover:border-white/30"
                                >
                                    + Novo Quarto
                                </button>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default Logistics;