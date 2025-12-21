
import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import { Player, Game } from '../types';
import { storageService } from '../services/storageService';
import { BusIcon, BedIcon, CheckCircleIcon, PrinterIcon, CloudIcon } from '../components/icons/UiIcons';
import { useToast } from '../contexts/ToastContext';
import LazyImage from '../components/LazyImage';

const Logistics: React.FC = () => {
    const toast = useToast();
    const [activeTab, setActiveTab] = useState<'MANIFEST' | 'ROOMING'>('MANIFEST');
    const [players, setPlayers] = useState<Player[]>([]);
    const [games, setGames] = useState<Game[]>([]);
    const [selectedGameId, setSelectedGameId] = useState('');
    const [manifest, setManifest] = useState<string[]>([]); 

    useEffect(() => {
        setPlayers(storageService.getPlayers().filter(p => p.status === 'ACTIVE'));
        setGames(storageService.getGames().filter(g => g.location === 'Away'));
    }, []);

    const togglePassenger = (id: string) => {
        setManifest(prev => prev.includes(id) ? prev.filter(mid => mid !== id) : [...prev, id]);
    };

    const activeGame = games.find(g => String(g.id) === selectedGameId);

    return (
        <div className="space-y-6 pb-12 animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-secondary rounded-xl"><BusIcon className="text-highlight w-8 h-8" /></div>
                    <div>
                        <h2 className="text-3xl font-bold text-text-primary uppercase italic tracking-tighter">Logística de Viagem</h2>
                        <p className="text-text-secondary text-sm">Operação, Transporte e Hospedagem.</p>
                    </div>
                </div>
                <select 
                    className="bg-secondary border border-white/10 rounded-xl p-3 text-white focus:border-highlight outline-none"
                    value={selectedGameId}
                    onChange={(e) => setSelectedGameId(e.target.value)}
                >
                    <option value="">Selecione o Jogo Fora de Casa...</option>
                    {games.map(g => (
                        <option key={g.id} value={g.id}>vs {g.opponent} ({new Date(g.date).toLocaleDateString()})</option>
                    ))}
                </select>
            </div>

            {selectedGameId ? (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                         <div className="bg-gradient-to-br from-blue-900/20 to-secondary p-6 rounded-2xl border border-blue-500/20 flex justify-between items-center shadow-lg">
                            <div>
                                <h4 className="font-black text-white text-xl uppercase italic">Missão: {activeGame?.opponent}</h4>
                                <p className="text-sm text-blue-400 font-bold mt-1">Status: Convocação em Aberto</p>
                                <p className="text-xs text-text-secondary mt-4 uppercase font-bold tracking-widest">Assentos Confirmados: {manifest.length}</p>
                            </div>
                            <button onClick={() => window.print()} className="p-4 bg-white/5 hover:bg-white/10 rounded-2xl border border-white/10 transition-all shadow-glow">
                                <PrinterIcon className="w-6 h-6 text-white"/>
                            </button>
                        </div>
                        
                        <div className="bg-gradient-to-br from-cyan-900/20 to-secondary p-6 rounded-2xl border border-cyan-500/20 flex items-center justify-between">
                            <div>
                                <p className="text-[10px] text-cyan-300 font-black uppercase mb-1 tracking-widest">Previsão no Kickoff</p>
                                <div className="flex items-center gap-3">
                                    <CloudIcon className="w-10 h-10 text-yellow-400" />
                                    <div>
                                        <p className="text-3xl font-black text-white">24°C</p>
                                        <p className="text-xs text-text-secondary">Céu Limpo em {activeGame?.opponent}</p>
                                    </div>
                                </div>
                            </div>
                            <span className="bg-green-500/20 text-green-400 text-[10px] font-black px-3 py-1 rounded-full border border-green-500/30">✔ GRAMA SECA</span>
                        </div>
                    </div>

                    <div className="flex border-b border-white/10 mb-6 overflow-x-auto no-scrollbar">
                        <button onClick={() => setActiveTab('MANIFEST')} className={`px-8 py-4 font-bold text-sm border-b-2 transition-all ${activeTab === 'MANIFEST' ? 'border-highlight text-highlight' : 'border-transparent text-text-secondary'}`}>MANIFESTO DE PASSAGEIROS</button>
                        <button onClick={() => setActiveTab('ROOMING')} className={`px-8 py-4 font-bold text-sm border-b-2 transition-all ${activeTab === 'ROOMING' ? 'border-highlight text-highlight' : 'border-transparent text-text-secondary'}`}>MAPA DE QUARTOS (HOTEL)</button>
                    </div>

                    {activeTab === 'MANIFEST' && (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-slide-in">
                            {players.map(p => (
                                <div 
                                    key={p.id} 
                                    onClick={() => togglePassenger(String(p.id))} 
                                    className={`flex items-center gap-3 p-4 rounded-2xl border cursor-pointer transition-all ${manifest.includes(String(p.id)) ? 'bg-highlight/10 border-highlight shadow-glow' : 'bg-secondary border-white/5 opacity-60'}`}
                                >
                                    <LazyImage src={p.avatarUrl} className="w-10 h-10 rounded-full border-2 border-secondary" />
                                    <div className="flex-1">
                                        <p className="text-sm font-black text-white leading-none uppercase">{p.name.split(' ')[0]}</p>
                                        <p className="text-[10px] text-text-secondary font-bold mt-1">#{p.jerseyNumber} • {p.position}</p>
                                    </div>
                                    {manifest.includes(String(p.id)) && <CheckCircleIcon className="w-5 h-5 text-highlight" />}
                                </div>
                            ))}
                        </div>
                    )}

                    {activeTab === 'ROOMING' && (
                         <div className="text-center py-20 text-text-secondary bg-secondary/20 rounded-3xl border-2 border-dashed border-white/10 opacity-50">
                             <BedIcon className="w-12 h-12 mx-auto mb-4" />
                             <p className="font-bold">Gerador de Rooming List Automático (Breve)</p>
                         </div>
                    )}
                </>
            ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center opacity-30 border-2 border-dashed border-white/10 rounded-3xl">
                    <BusIcon className="w-20 h-20 mb-4" />
                    <p className="text-xl font-bold uppercase tracking-widest">Nenhuma Operação de Viagem Selecionada</p>
                </div>
            )}
        </div>
    );
};

export default Logistics;