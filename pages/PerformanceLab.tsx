
import React, { useState, useEffect, useContext } from 'react';
import Card from '../components/Card';
import { Player, WellnessEntry } from '../types';
import { storageService } from '../services/storageService';
import { HeartPulseIcon } from '../components/icons/NavIcons';
import { ActivityIcon, AlertTriangleIcon, CheckCircleIcon, UsersIcon } from '../components/icons/UiIcons';
import { UserContext } from '../components/Layout';
import { authService } from '../services/authService';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Legend } from 'recharts';

const PerformanceLab: React.FC = () => {
    const { currentRole } = useContext(UserContext);
    const [players, setPlayers] = useState<Player[]>([]);
    const [myPlayer, setMyPlayer] = useState<Player | null>(null);
    const [viewMode, setViewMode] = useState<'DASHBOARD' | 'CHECKIN'>('DASHBOARD');
    
    // Check-in State
    const [wellnessData, setWellnessData] = useState({
        sleep: 3,
        fatigue: 3,
        soreness: 3,
        stress: 3,
        rpe: 5
    });

    const isPlayer = currentRole === 'PLAYER';
    const isStaff = !isPlayer;

    useEffect(() => {
        setPlayers(storageService.getPlayers());
        
        if (isPlayer) {
            const user = authService.getCurrentUser();
            const playerProfile = storageService.getPlayers().find(p => p.name === user?.name);
            setMyPlayer(playerProfile || null);
            setViewMode('CHECKIN');
        }
    }, [isPlayer]);

    const handleSubmitCheckin = () => {
        if (!myPlayer) return;
        
        const entry: WellnessEntry = {
            date: new Date().toISOString().split('T')[0],
            sleepQuality: wellnessData.sleep,
            fatigue: wellnessData.fatigue,
            soreness: wellnessData.soreness,
            stress: wellnessData.stress,
            rpe: wellnessData.rpe
        };

        // In a real app, update via API. Here we mock update local state & storage
        const updatedPlayer = { 
            ...myPlayer, 
            wellnessHistory: [...(myPlayer.wellnessHistory || []), entry] 
        };
        
        // Update full player list
        const updatedAllPlayers = players.map(p => p.id === myPlayer.id ? updatedPlayer : p);
        storageService.savePlayers(updatedAllPlayers);
        setPlayers(updatedAllPlayers);
        setMyPlayer(updatedPlayer);
        
        alert("Check-in realizado! A IA usará esses dados para ajustar seu treino.");
        setViewMode('DASHBOARD'); // Show charts after checkin
    };

    // --- ANALYTICS HELPERS ---
    const getRiskStatus = (p: Player) => {
        const lastEntry = p.wellnessHistory?.[p.wellnessHistory.length - 1];
        if (!lastEntry) return 'UNKNOWN';
        
        // Simple Algorithm: High Fatigue + Low Sleep = Risk
        if (lastEntry.fatigue >= 4 && lastEntry.sleepQuality <= 2) return 'HIGH_RISK';
        if (lastEntry.soreness >= 4) return 'WARNING';
        return 'OPTIMAL';
    };

    const getRiskColor = (status: string) => {
        if (status === 'HIGH_RISK') return 'bg-red-500';
        if (status === 'WARNING') return 'bg-yellow-500';
        if (status === 'OPTIMAL') return 'bg-green-500';
        return 'bg-gray-500';
    };

    const getAverageSleep = (history: WellnessEntry[] = []) => {
        if (history.length === 0) return 0;
        const sum = history.reduce((acc, curr) => acc + curr.sleepQuality, 0);
        return (sum / history.length).toFixed(1);
    };

    return (
        <div className="space-y-6 pb-12 animate-fade-in">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-secondary rounded-xl border border-red-500/20">
                        <HeartPulseIcon className="text-red-400 w-8 h-8" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold text-text-primary">Performance Lab</h2>
                        <p className="text-text-secondary">Ciência do Esporte & Bem-Estar (High Performance).</p>
                    </div>
                </div>
                {isPlayer && viewMode === 'DASHBOARD' && (
                    <button 
                        onClick={() => setViewMode('CHECKIN')}
                        className="bg-red-600 hover:bg-red-500 text-white px-6 py-2 rounded-xl font-bold shadow-lg flex items-center gap-2"
                    >
                        <ActivityIcon className="w-5 h-5" /> Novo Check-in
                    </button>
                )}
            </div>

            {/* PLAYER VIEW: CHECK-IN FORM */}
            {isPlayer && viewMode === 'CHECKIN' && (
                <div className="max-w-2xl mx-auto">
                    <Card title="Check-in Diário de Wellness">
                        <div className="space-y-8 p-4">
                            <div>
                                <label className="flex justify-between font-bold text-white mb-2">
                                    <span>Qualidade do Sono (1=Péssimo, 5=Ótimo)</span>
                                    <span className="text-highlight text-xl">{wellnessData.sleep}</span>
                                </label>
                                <input type="range" min="1" max="5" value={wellnessData.sleep} onChange={e => setWellnessData({...wellnessData, sleep: Number(e.target.value)})} className="w-full accent-highlight h-2 bg-white/10 rounded-lg appearance-none cursor-pointer" />
                            </div>

                            <div>
                                <label className="flex justify-between font-bold text-white mb-2">
                                    <span>Nível de Fadiga (1=Fresco, 5=Exausto)</span>
                                    <span className="text-red-400 text-xl">{wellnessData.fatigue}</span>
                                </label>
                                <input type="range" min="1" max="5" value={wellnessData.fatigue} onChange={e => setWellnessData({...wellnessData, fatigue: Number(e.target.value)})} className="w-full accent-red-500 h-2 bg-white/10 rounded-lg appearance-none cursor-pointer" />
                            </div>

                            <div>
                                <label className="flex justify-between font-bold text-white mb-2">
                                    <span>Dor Muscular / Soreness (1=Sem dor, 5=Muita dor)</span>
                                    <span className="text-orange-400 text-xl">{wellnessData.soreness}</span>
                                </label>
                                <input type="range" min="1" max="5" value={wellnessData.soreness} onChange={e => setWellnessData({...wellnessData, soreness: Number(e.target.value)})} className="w-full accent-orange-500 h-2 bg-white/10 rounded-lg appearance-none cursor-pointer" />
                            </div>

                            <div>
                                <label className="flex justify-between font-bold text-white mb-2">
                                    <span>Nível de Stress (1=Calmo, 5=Estressado)</span>
                                    <span className="text-yellow-400 text-xl">{wellnessData.stress}</span>
                                </label>
                                <input type="range" min="1" max="5" value={wellnessData.stress} onChange={e => setWellnessData({...wellnessData, stress: Number(e.target.value)})} className="w-full accent-yellow-500 h-2 bg-white/10 rounded-lg appearance-none cursor-pointer" />
                            </div>

                            <div className="pt-4 border-t border-white/10">
                                <label className="flex justify-between font-bold text-white mb-2">
                                    <span>RPE do Último Treino (0-10)</span>
                                    <span className="text-blue-400 text-xl">{wellnessData.rpe}</span>
                                </label>
                                <input type="range" min="0" max="10" value={wellnessData.rpe} onChange={e => setWellnessData({...wellnessData, rpe: Number(e.target.value)})} className="w-full accent-blue-500 h-2 bg-white/10 rounded-lg appearance-none cursor-pointer" />
                                <p className="text-xs text-text-secondary mt-1">Quão difícil foi o treino de ontem?</p>
                            </div>

                            <button onClick={handleSubmitCheckin} className="w-full bg-green-600 hover:bg-green-500 text-white font-bold py-3 rounded-xl shadow-lg mt-4">
                                Enviar Check-in
                            </button>
                        </div>
                    </Card>
                </div>
            )}

            {/* DASHBOARD VIEW (Player Analytics or Staff Roster View) */}
            {viewMode === 'DASHBOARD' && (
                <div className="space-y-6">
                    {/* STAFF VIEW: ROSTER RISK MATRIX */}
                    {isStaff && (
                        <Card title="Matriz de Risco do Elenco">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                {players.map(p => {
                                    const risk = getRiskStatus(p);
                                    const lastEntry = p.wellnessHistory?.[p.wellnessHistory.length - 1];
                                    
                                    return (
                                        <div key={p.id} className="bg-secondary p-4 rounded-xl border border-white/5 relative overflow-hidden group hover:border-white/20 transition-all">
                                            <div className={`absolute top-0 right-0 w-16 h-16 transform translate-x-8 -translate-y-8 rotate-45 ${getRiskColor(risk)} opacity-20`}></div>
                                            
                                            <div className="flex items-center gap-3 mb-3">
                                                <div className="relative">
                                                    <img src={p.avatarUrl} className="w-10 h-10 rounded-full" />
                                                    <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-secondary ${getRiskColor(risk)}`}></div>
                                                </div>
                                                <div>
                                                    <h4 className="font-bold text-white text-sm">{p.name}</h4>
                                                    <p className="text-xs text-text-secondary">{p.position}</p>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-3 gap-1 text-center text-xs">
                                                <div className="bg-black/20 p-1 rounded">
                                                    <span className="text-text-secondary block text-[9px] uppercase">Sono</span>
                                                    <span className="font-bold text-white">{lastEntry?.sleepQuality || '-'}</span>
                                                </div>
                                                <div className="bg-black/20 p-1 rounded">
                                                    <span className="text-text-secondary block text-[9px] uppercase">Fadiga</span>
                                                    <span className="font-bold text-white">{lastEntry?.fatigue || '-'}</span>
                                                </div>
                                                <div className="bg-black/20 p-1 rounded">
                                                    <span className="text-text-secondary block text-[9px] uppercase">Dor</span>
                                                    <span className="font-bold text-white">{lastEntry?.soreness || '-'}</span>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </Card>
                    )}

                    {/* CHARTS (Visible to Staff for Team Avgs, or Player for Personal) */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card title="Evolução de Carga (RPE)">
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={isStaff ? players[0]?.wellnessHistory || [] : myPlayer?.wellnessHistory || []}>
                                        <defs>
                                            <linearGradient id="colorRpe" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                                                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                                        <XAxis dataKey="date" stroke="#94a3b8" tickFormatter={(v) => new Date(v).toLocaleDateString(undefined, {day:'2-digit', month:'2-digit'})} />
                                        <YAxis stroke="#94a3b8" />
                                        <Tooltip contentStyle={{ backgroundColor: '#1e293b' }} />
                                        <Area type="monotone" dataKey="rpe" stroke="#3b82f6" fillOpacity={1} fill="url(#colorRpe)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                            </div>
                        </Card>

                        <Card title="Qualidade do Sono vs Fadiga">
                            <div className="h-64">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={isStaff ? players[0]?.wellnessHistory || [] : myPlayer?.wellnessHistory || []}>
                                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                                        <XAxis dataKey="date" stroke="#94a3b8" tickFormatter={(v) => new Date(v).toLocaleDateString(undefined, {day:'2-digit', month:'2-digit'})} />
                                        <YAxis stroke="#94a3b8" />
                                        <Tooltip contentStyle={{ backgroundColor: '#1e293b' }} />
                                        <Legend />
                                        <Bar dataKey="sleepQuality" name="Sono" fill="#10b981" />
                                        <Bar dataKey="fatigue" name="Fadiga" fill="#ef4444" />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </Card>
                    </div>
                </div>
            )}
        </div>
    );
};

export default PerformanceLab;
