import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import { Player, StaffMember, Game } from '../types';
import { storageService } from '../services/storageService';
import { BusIcon, BedIcon, MapPinIcon, CheckCircleIcon, PrinterIcon, UsersIcon, TrashIcon, CloudIcon } from '../components/icons/UiIcons';
import { useToast } from '../contexts/ToastContext';
import LazyImage from '../components/LazyImage';

interface Room {
    id: string;
    number: string;
    type: 'DOUBLE' | 'TRIPLE' | 'QUAD';
    occupants: string[]; 
}

const WeatherWidget: React.FC<{ location: string, date: Date }> = ({ location, date }) => {
    const isSummer = date.getMonth() >= 11 || date.getMonth() <= 2;
    const isRainy = Math.random() > 0.6;
    const temp = isSummer ? 28 + Math.floor(Math.random() * 5) : 18 + Math.floor(Math.random() * 5);
    
    return (
        <div className="bg-gradient-to-br from-blue-600/20 to-cyan-500/20 p-4 rounded-xl border border-blue-500/30 flex items-center justify-between">
            <div>
                <p className="text-[10px] text-blue-300 font-bold uppercase mb-1">Previsão no Kickoff</p>
                <div className="flex items-center gap-3">
                    <CloudIcon className={`w-8 h-8 ${isRainy ? 'text-gray-400' : 'text-yellow-400'}`} />
                    <div>
                        <p className="text-2xl font-black text-white">{temp}°C</p>
                        <p className="text-xs text-text-secondary">{isRainy ? 'Probabilidade de Chuva' : 'Céu Limpo'}</p>
                    </div>
                </div>
            </div>
            <div className="text-right">
                <p className="text-[10px] text-text-secondary font-bold uppercase mb-1">Intel do Gramado</p>
                <span className={`text-xs font-bold px-2 py-1 rounded ${isRainy ? 'bg-yellow-500/20 text-yellow-400' : 'bg-green-500/20 text-green-400'}`}>
                    {isRainy ? '⚠ Grama Alta' : '✔ Grama Seca'}
                </span>
            </div>
        </div>
    );
};

const Logistics: React.FC = () => {
    const toast = useToast();
    const [activeTab, setActiveTab] = useState<'MANIFEST' | 'ROOMING' | 'ITINERARY'>('MANIFEST');
    const [players, setPlayers] = useState<Player[]>([]);
    const [staff, setStaff] = useState<StaffMember[]>([]);
    const [games, setGames] = useState<Game[]>([]);
    
    const [selectedGameId, setSelectedGameId] = useState('');
    const [manifest, setManifest] = useState<string[]>([]); 
    const [rooms, setRooms] = useState<Room[]>([
        { id: 'r1', number: '101', type: 'DOUBLE', occupants: [] },
        { id: 'r2', number: '102', type: 'DOUBLE', occupants: [] },
        { id: 'r3', number: '103', type: 'QUAD', occupants: [] },
    ]);

    const [addingToRoomId, setAddingToRoomId] = useState<string | null>(null);
    const [newOccupantName, setNewOccupantName] = useState('');

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

    const handleAddOccupant = (roomId: string) => {
        if (!newOccupantName.trim()) return;
        
        setRooms(prev => prev.map(r => {
            if (r.id === roomId && r.occupants.length < (r.type === 'DOUBLE' ? 2 : r.type === 'TRIPLE' ? 3 : 4)) {
                return { ...r, occupants: [...r.occupants, newOccupantName] };
            }
            return r;
        }));
        
        setNewOccupantName('');
        setAddingToRoomId(null);
        toast.success("Ocupante adicionado.");
    };

    const removeFromRoom = (roomId: string, name: string) => {
        setRooms(prev => prev.map(r => r.id === roomId ? { ...r, occupants: r.occupants.filter(o => o !== name) } : r));
        toast.info("Ocupante removido.");
    };

    const activeGame = games.find(g => g.id === Number(selectedGameId));

    return (
        <div className="space-y-6 pb-12 animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-secondary rounded-xl">
                        <BusIcon className="text-highlight w-8 h-8" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold text-text-primary">Logística</h2>
                        <p className="text-text-secondary text-sm">Transporte e hospedagem.</p>
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
                    Selecione um jogo para iniciar.
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                         <div className="bg-blue-900/20 p-4 rounded-xl border border-blue-500/20 flex justify-between items-center">
                            <div>
                                <h4 className="font-bold text-white text-lg">Operação: {activeGame?.opponent}</h4>
                                <p className="text-sm text-blue-300">Data: {activeGame && new Date(activeGame.date).toLocaleDateString()}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-xs text-text-secondary uppercase font-bold">Passageiros</p>
                                <p className="text-2xl font-black text-white">{manifest.length}</p>
                            </div>
                        </div>
                        {activeGame && <WeatherWidget location={activeGame.opponent} date={new Date(activeGame.date)} />}
                    </div>

                    <div className="flex border-b border-white/10 overflow-x-auto mb-6">
                        <button onClick={() => setActiveTab('MANIFEST')} className={`px-6 py-3 font-bold text-sm border-b-2 transition-colors ${activeTab === 'MANIFEST' ? 'border-highlight text-highlight' : 'border-transparent text-text-secondary'}`}>Passageiros</button>
                        <button onClick={() => setActiveTab('ROOMING')} className={`px-6 py-3 font-bold text-sm border-b-2 transition-colors ${activeTab === 'ROOMING' ? 'border-highlight text-highlight' : 'border-transparent text-text-secondary'}`}>Quartos</button>
                    </div>

                    {activeTab === 'MANIFEST' && (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-slide-in">
                            <div className="lg:col-span-2">
                                <Card title="Manifesto de Viagem">
                                    <div className="h-[500px] overflow-y-auto pr-2 custom-scrollbar space-y-2">
                                        {staff.map(s => (
                                            <div key={s.id} onClick={() => togglePassenger(s.id)} className={`flex items-center justify-between p-3 rounded border cursor-pointer transition-colors ${manifest.includes(s.id) ? 'bg-highlight/20 border-highlight' : 'bg-black/20 border-white/5'}`}>
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${manifest.includes(s.id) ? 'bg-highlight border-highlight' : 'border-white/30'}`}>
                                                        {manifest.includes(s.id) && <CheckCircleIcon className="w-3 h-3 text-white" />}
                                                    </div>
                                                    <span className="text-white font-bold">{s.name}</span>
                                                </div>
                                                <span className="text-xs text-text-secondary uppercase">{s.role}</span>
                                            </div>
                                        ))}
                                        <div className="border-t border-white/10 my-4 pt-4"></div>
                                        {players.map(p => (
                                            <div key={p.id} onClick={() => togglePassenger(String(p.id))} className={`flex items-center justify-between p-3 rounded border cursor-pointer transition-colors ${manifest.includes(String(p.id)) ? 'bg-highlight/20 border-highlight' : 'bg-black/20 border-white/5'}`}>
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${manifest.includes(String(p.id)) ? 'bg-highlight border-highlight' : 'border-white/30'}`}>
                                                        {manifest.includes(String(p.id)) && <CheckCircleIcon className="w-3 h-3 text-white" />}
                                                    </div>
                                                    <span className="text-white font-bold">{p.name}</span>
                                                </div>
                                                <span className="text-xs text-text-secondary">{p.position}</span>
                                            </div>
                                        ))}
                                    </div>
                                </Card>
                            </div>
                            <div className="space-y-6">
                                <Card title="Ações">
                                    <button onClick={() => window.print()} className="w-full bg-secondary border border-white/10 text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2">
                                        <PrinterIcon className="w-4 h-4" /> Imprimir Manifesto
                                    </button>
                                </Card>
                            </div>
                        </div>
                    )}

                    {activeTab === 'ROOMING' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 animate-slide-in">
                            {rooms.map(room => (
                                <div key={room.id} className="bg-secondary border border-white/10 rounded-xl p-4 flex flex-col">
                                    <div className="flex justify-between items-center mb-3 pb-2 border-b border-white/5">
                                        <h4 className="font-bold text-white">Quarto {room.number}</h4>
                                        <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded text-text-secondary uppercase">{room.type}</span>
                                    </div>
                                    <div className="space-y-2 mb-4 flex-1">
                                        {room.occupants.map((occ, idx) => (
                                            <div key={idx} className="flex justify-between items-center text-sm bg-black/20 p-2 rounded text-white">
                                                <span>{occ}</span>
                                                <button onClick={() => removeFromRoom(room.id, occ)} className="text-text-secondary hover:text-red-400 transition-colors">
                                                    <TrashIcon className="w-3 h-3"/>
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                    {addingToRoomId === room.id ? (
                                        <div className="flex gap-1">
                                            <input className="w-full bg-black/40 border border-white/20 rounded px-2 py-1 text-xs text-white" value={newOccupantName} onChange={e => setNewOccupantName(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleAddOccupant(room.id)} />
                                            <button onClick={() => handleAddOccupant(room.id)} className="bg-green-600 text-white px-2 rounded font-bold text-xs">OK</button>
                                        </div>
                                    ) : (
                                        <button onClick={() => setAddingToRoomId(room.id)} className="w-full text-xs bg-white/5 hover:bg-white/10 text-white py-2 rounded font-bold border border-white/10 transition-colors">
                                            + Ocupante
                                        </button>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default Logistics;