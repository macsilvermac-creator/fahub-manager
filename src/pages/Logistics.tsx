import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import { Player, StaffMember, Game } from '../types';
import { storageService } from '../services/storageService';
import { BusIcon, BedIcon, MapPinIcon, CheckCircleIcon, PrinterIcon, UsersIcon, TrashIcon, CloudIcon, SparklesIcon } from '../components/icons/UiIcons';
import { useToast } from '../contexts/ToastContext';
import LazyImage from '../components/LazyImage';

interface Room {
    id: string;
    number: string;
    type: 'DOUBLE' | 'TRIPLE' | 'QUAD';
    occupants: string[]; // Names
}

const WeatherWidget: React.FC<{ location: string, date: Date }> = ({ location, date }) => {
    // Simulação Inteligente de Previsão baseada em dados reais aproximados para demonstração
    // Em produção, isso chamaria uma API Real (OpenWeather) ou usaria o Gemini para "estimar" baseado na estação.
    
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
                    {isRainy ? '⚠ Grama Alta / Escorregadia' : '✔ Grama Seca / Rápida'}
                </span>
                <p className="text-[9px] text-text-secondary mt-1 max-w-[120px]">Sugestão: Trava {isRainy ? 'Mista/Alta' : 'Baixa'}</p>
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

    // State for adding occupant without prompt
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
        toast.success("Ocupante adicionado ao quarto.");
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
                        <h2 className="text-3xl font-bold text-text-primary">Logística de Viagem</h2>
                        <p className="text-text-secondary text-sm">Gestão de transporte e hospedagem para jogos fora.</p>
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
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-slide-in">
                            <div className="lg:col-span-2">
                                <Card title="Seleção de Passageiros">
                                    <div className="mb-4 flex gap-4 text-sm text-text-secondary bg-black/20 p-2 rounded-lg">
                                        <span>Total Selecionado: <strong className="text-white">{manifest.length}</strong></span>
                                        <span>Capacidade Ônibus: <strong className="text-white">46</strong></span>
                                        <span className={manifest.length > 46 ? 'text-red-400 font-bold' : 'text-green-400 font-bold'}>
                                            {manifest.length > 46 ? '⚠ Excedido' : '✓ Dentro do Limite'}
                                        </span>
                                    </div>
                                    <div className="h-[500px] overflow-y-auto pr-2 custom-scrollbar space-y-2">
                                        <h4 className="text-xs font-bold text-text-secondary uppercase sticky top-0 bg-secondary py-2 z-10">Staff & Coaches</h4>
                                        {staff.map(s => (
                                            <div key={s.id} onClick={() => togglePassenger(s.id)} className={`flex items-center justify-between p-3 rounded border cursor-pointer transition-colors ${manifest.includes(s.id) ? 'bg-highlight/20 border-highlight' : 'bg-black/20 border-white/5 hover:bg-white/5'}`}>
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${manifest.includes(s.id) ? 'bg-highlight border-highlight' : 'border-white/30'}`}>
                                                        {manifest.includes(s.id) && <CheckCircleIcon className="w-3 h-3 text-white" />}
                                                    </div>
                                                    <span className="text-white font-bold">{s.name}</span>
                                                </div>
                                                <span className="text-xs text-text-secondary">{s.role}</span>
                                            </div>
                                        ))}

                                        <h4 className="text-xs font-bold text-text-secondary uppercase sticky top-0 bg-secondary py-2 mt-4 z-10">Atletas</h4>
                                        {players.map(p => (
                                            <div key={p.id} onClick={() => togglePassenger(String(p.id))} className={`flex items-center justify-between p-3 rounded border cursor-pointer transition-colors ${manifest.includes(String(p.id)) ? 'bg-highlight/20 border-highlight' : 'bg-black/20 border-white/5 hover:bg-white/5'}`}>
                                                <div className="flex items-center gap-3">
                                                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center ${manifest.includes(String(p.id)) ? 'bg-highlight border-highlight' : 'border-white/30'}`}>
                                                        {manifest.includes(String(p.id)) && <CheckCircleIcon className="w-3 h-3 text-white" />}
                                                    </div>
                                                    <LazyImage src={p.avatarUrl} className="w-8 h-8 rounded-full" />
                                                    <div>
                                                        <p className="text-white font-bold text-sm">{p.name}</p>
                                                        <p className="text-xs text-text-secondary">{p.position}</p>
                                                    </div>
                                                </div>
                                                <span className="text-xs text-text-secondary font-mono bg-black/20 px-2 rounded">RG: {p.cpf || 'PENDENTE'}</span>
                                            </div>
                                        ))}
                                    </div>
                                </Card>
                            </div>
                            <div className="space-y-6">
                                <Card title="Resumo da Viagem">
                                    <div className="space-y-4">
                                        <div className="bg-black/20 p-4 rounded-lg text-center border border-white/5">
                                            <p className="text-sm text-text-secondary">Custo Estimado (Ônibus)</p>
                                            <p className="text-2xl font-bold text-white">R$ 4.500,00</p>
                                            <p className="text-xs text-text-secondary mt-1">Baseado em km e diárias</p>
                                        </div>
                                        <button onClick={() => window.print()} className="w-full bg-secondary border border-white/10 hover:bg-white/5 text-white py-3 rounded-lg font-bold flex items-center justify-center gap-2 transition-colors">
                                            <PrinterIcon className="w-4 h-4" /> Imprimir Manifesto (ANTT)
                                        </button>
                                    </div>
                                </Card>
                            </div>
                        </div>
                    )}

                    {activeTab === 'ROOMING' && (
                        <div className="space-y-6 animate-slide-in">
                            <div className="flex gap-4 overflow-x-auto pb-4 custom-scrollbar">
                                {rooms.map(room => (
                                    <div key={room.id} className="min-w-[280px] bg-secondary border border-white/10 rounded-xl p-4 flex flex-col h-full">
                                        <div className="flex justify-between items-center mb-3 pb-2 border-b border-white/5">
                                            <h4 className="font-bold text-white flex items-center gap-2">
                                                <BedIcon className="w-4 h-4 text-blue-400"/> Quarto {room.number}
                                            </h4>
                                            <span className={`text-[10px] px-2 py-0.5 rounded text-black font-bold uppercase ${room.occupants.length >= (room.type === 'DOUBLE' ? 2 : room.type === 'TRIPLE' ? 3 : 4) ? 'bg-red-400' : 'bg-green-400'}`}>
                                                {room.type} ({room.occupants.length})
                                            </span>
                                        </div>
                                        
                                        <div className="space-y-2 flex-1 bg-black/20 rounded p-2 mb-3 min-h-[120px]">
                                            {room.occupants.map((occ, idx) => (
                                                <div key={idx} className="flex justify-between items-center text-sm bg-white/5 p-2 rounded text-white group">
                                                    <span className="flex items-center gap-2"><UsersIcon className="w-3 h-3 text-text-secondary"/> {occ}</span>
                                                    <button onClick={() => removeFromRoom(room.id, occ)} className="text-text-secondary hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <TrashIcon className="w-3 h-3"/>
                                                    </button>
                                                </div>
                                            ))}
                                            {room.occupants.length === 0 && <span className="text-xs text-text-secondary italic flex items-center justify-center h-full">Quarto Vazio</span>}
                                        </div>

                                        {addingToRoomId === room.id ? (
                                            <div className="flex gap-1">
                                                <input 
                                                    autoFocus
                                                    className="w-full bg-black/40 border border-white/20 rounded px-2 py-1 text-xs text-white"
                                                    placeholder="Nome..."
                                                    value={newOccupantName}
                                                    onChange={e => setNewOccupantName(e.target.value)}
                                                    onKeyDown={e => e.key === 'Enter' && handleAddOccupant(room.id)}
                                                />
                                                <button onClick={() => handleAddOccupant(room.id)} className="bg-green-600 text-white px-2 rounded font-bold text-xs">OK</button>
                                            </div>
                                        ) : (
                                            <button 
                                                onClick={() => setAddingToRoomId(room.id)}
                                                disabled={room.occupants.length >= (room.type === 'DOUBLE' ? 2 : room.type === 'TRIPLE' ? 3 : 4)}
                                                className="w-full text-xs bg-highlight/10 text-highlight hover:bg-highlight hover:text-white py-2 rounded font-bold border border-highlight/20 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                            >
                                                + Adicionar Ocupante
                                            </button>
                                        )}
                                    </div>
                                ))}
                                
                                <button 
                                    onClick={() => setRooms([...rooms, { id: `r${Date.now()}`, number: `${100 + rooms.length + 1}`, type: 'DOUBLE', occupants: [] }])}
                                    className="min-w-[100px] border-2 border-dashed border-white/10 rounded-xl flex flex-col items-center justify-center text-text-secondary hover:text-white hover:border-white/30 transition-colors"
                                >
                                    <span className="text-2xl mb-1">+</span>
                                    <span className="text-xs font-bold">Novo Quarto</span>
                                </button>
                            </div>
                        </div>
                    )}

                    {activeTab === 'ITINERARY' && (
                        <Card title="Cronograma da Viagem">
                            <div className="space-y-6 relative pl-4 border-l-2 border-white/10 ml-2">
                                {[
                                    { time: '07:00', title: 'Apresentação', desc: 'Arena Principal - Café da Manhã' },
                                    { time: '08:00', title: 'Saída do Ônibus', desc: 'Pontualmente. Quem atrasar fica.' },
                                    { time: '12:00', title: 'Parada Almoço', desc: 'Graal - Rodovia' },
                                    { time: '15:00', title: 'Chegada no Hotel', desc: 'Check-in e Descanso' },
                                    { time: '18:00', title: 'Jantar', desc: 'Restaurante do Hotel' },
                                    { time: '20:00', title: 'Meeting', desc: 'Sala de Conferência 2' }
                                ].map((item, idx) => (
                                    <div key={idx} className="relative">
                                        <div className="absolute -left-[21px] top-0 w-4 h-4 rounded-full bg-secondary border-2 border-highlight"></div>
                                        <p className="text-highlight font-mono font-bold text-lg leading-none">{item.time}</p>
                                        <h4 className="text-white font-bold text-sm mt-1">{item.title}</h4>
                                        <p className="text-text-secondary text-xs">{item.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    )}
                </>
            )}
        </div>
    );
};

export default Logistics;