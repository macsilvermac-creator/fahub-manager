
import React, { useState, useEffect, useContext } from 'react';
import Card from '../components/Card';
import { FlagIcon, WhistleIcon } from '../components/icons/NavIcons';
// Added missing types and component imports
import { CheckCircleIcon, PlayCircleIcon, MicIcon, StarIcon, AlertTriangleIcon, ScanIcon, CameraIcon, LockIcon } from '../components/icons/UiIcons';
import { Game, GameReport, Player, TeamSettings } from '../types';
import { storageService } from '../services/storageService';
import { realtimeService } from '../services/realtimeService';
import { UserContext } from '../components/Layout';
import { useToast } from '../contexts/ToastContext'; 
import LazyImage from '../components/LazyImage'; 
import Modal from '../components/Modal';

const Officiating: React.FC = () => {
    const { currentRole } = useContext(UserContext) as any;
    const toast = useToast();
    const [viewMode, setViewMode] = useState<'CAREER' | 'FIELD'>('CAREER');
    const [games, setGames] = useState<Game[]>([]);
    const [players, setPlayers] = useState<Player[]>([]);
    const [teamSettings, setTeamSettings] = useState<TeamSettings | null>(null);
    const [activeTab, setActiveTab] = useState<'SUMULA_PRE' | 'LIVE' | 'ROSTER'>('SUMULA_PRE');
    
    const [isScannerOpen, setIsScannerOpen] = useState(false);
    const [isScanning, setIsScanning] = useState(false);
    const [selectedGame, setSelectedGame] = useState<Game | null>(null);
    
    // Casting ID to string to ensure Record compatibility
    const [checkedPlayers, setCheckedPlayers] = useState<Record<string, boolean>>({});

    useEffect(() => {
        setGames(storageService.getGames());
        setPlayers(storageService.getPlayers());
        setTeamSettings(storageService.getTeamSettings());
    }, []);

    const startScanner = () => {
        setIsScannerOpen(true);
        setIsScanning(true);
        setTimeout(() => handleScanSuccess(), 2000);
    };

    const handleScanSuccess = () => {
        setIsScanning(false);
        const randomPlayer = players[Math.floor(Math.random() * players.length)];
        
        if (randomPlayer) {
            // Correctly used medicalExamExpiry property on Player
            const isMedicalExpired = randomPlayer.medicalExamExpiry ? new Date(randomPlayer.medicalExamExpiry) < new Date() : true;
            
            if (isMedicalExpired) {
                toast.error(`BLOQUEADO: Atleta ${randomPlayer.name} com Atestado Médico vencido!`);
                setCheckedPlayers(prev => ({ ...prev, [String(randomPlayer.id)]: false }));
            } else {
                setCheckedPlayers(prev => ({ ...prev, [String(randomPlayer.id)]: true }));
                toast.success(`Atleta Validado: ${randomPlayer.name} #${randomPlayer.jerseyNumber}`);
            }
        }
        setIsScannerOpen(false);
    };

    const syncLiveState = (updates: Partial<Game>, type: 'SCORE' | 'CLOCK' | 'STATUS') => {
        if(!selectedGame) return;
        const updatedGame = { ...selectedGame, ...updates };
        storageService.updateLiveGame(selectedGame.id, updatedGame);
        setSelectedGame(updatedGame as Game); 
        realtimeService.broadcastUpdate(selectedGame.id, type, updates);
    };

    return (
        <div className="space-y-6 pb-12 animate-fade-in no-scrollbar">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-secondary rounded-xl"><FlagIcon className="text-highlight w-8 h-8" /></div>
                    <div>
                        <h2 className="text-3xl font-bold text-text-primary">Officiating Hub</h2>
                        <p className="text-text-secondary text-sm">Controle de Identidade e Súmula Digital</p>
                    </div>
                </div>
                <div className="flex bg-secondary p-1 rounded-xl border border-white/10">
                    <button onClick={() => setViewMode('CAREER')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${viewMode === 'CAREER' ? 'bg-highlight text-white' : 'text-text-secondary hover:text-white'}`}>Carreira</button>
                    <button onClick={() => setViewMode('FIELD')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${viewMode === 'FIELD' ? 'bg-red-600 text-white' : 'text-text-secondary hover:text-white'}`}><WhistleIcon className="w-4 h-4" /> Game Day</button>
                </div>
            </div>

            {viewMode === 'FIELD' && selectedGame && (
                <div className="space-y-6 animate-slide-in">
                    <div className="bg-black rounded-2xl p-6 border-b-4 border-highlight flex justify-between items-center shadow-2xl relative overflow-hidden">
                         <div className="text-center">
                            <h3 className="text-xl font-black text-white">{teamSettings?.teamName?.toUpperCase()}</h3>
                            <span className="text-4xl font-mono font-bold text-highlight">{selectedGame.score?.split('-')[0] || 0}</span>
                         </div>
                         <div className="text-center">
                            <p className="text-xs font-bold text-text-secondary uppercase">Quarto</p>
                            <p className="text-2xl font-black text-white">Q{selectedGame.currentQuarter || 1}</p>
                            <button onClick={() => setSelectedGame(null)} className="text-[10px] text-text-secondary hover:text-white mt-2 block mx-auto underline">Sair do Jogo</button>
                         </div>
                         <div className="text-center">
                            <h3 className="text-xl font-black text-white">{selectedGame.opponent.toUpperCase()}</h3>
                            <span className="text-4xl font-mono font-bold text-highlight">{selectedGame.score?.split('-')[1] || 0}</span>
                         </div>
                    </div>

                    <div className="flex border-b border-white/10 overflow-x-auto">
                        {['SUMULA_PRE', 'ROSTER', 'LIVE'].map(t => (
                            <button key={t} onClick={() => setActiveTab(t as any)} className={`px-6 py-3 font-bold text-sm border-b-2 transition-all ${activeTab === t ? 'border-highlight text-highlight' : 'border-transparent text-text-secondary'}`}>
                                {t === 'SUMULA_PRE' ? 'Checklist' : t === 'ROSTER' ? 'Check-in' : 'Ocorrências'}
                            </button>
                        ))}
                    </div>

                    {activeTab === 'ROSTER' && (
                        <div className="space-y-4">
                            <button onClick={startScanner} className="w-full bg-highlight text-white py-4 rounded-xl font-black flex items-center justify-center gap-2 shadow-glow animate-pulse">
                                <ScanIcon className="w-5 h-5" /> ABRIR SCANNER DE IDENTIDADE
                            </button>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                {players.map(p => (
                                    <div key={p.id} className={`flex items-center gap-3 p-3 rounded-xl border ${checkedPlayers[String(p.id)] ? 'bg-green-600/20 border-green-500' : 'bg-secondary border-white/5 opacity-60'}`}>
                                        <LazyImage src={p.avatarUrl} className="w-10 h-10 rounded-full" />
                                        <div className="flex-1">
                                            <p className="text-sm font-bold text-white leading-none">{p.name}</p>
                                            <p className="text-[10px] text-text-secondary mt-1">#{p.jerseyNumber} • {p.position}</p>
                                        </div>
                                        {checkedPlayers[String(p.id)] && <CheckCircleIcon className="w-5 h-5 text-green-500" />}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {viewMode === 'FIELD' && !selectedGame && (
                <Card title="Escalação de Partidas">
                    <div className="space-y-3">
                        {games.map(game => (
                            <div key={game.id} onClick={() => setSelectedGame(game)} className="bg-secondary p-4 rounded-xl border border-white/5 hover:border-highlight cursor-pointer flex justify-between items-center transition-all group">
                                <div>
                                    <p className="font-bold text-white uppercase italic">{teamSettings?.teamName} vs {game.opponent}</p>
                                    <p className="text-xs text-text-secondary">{new Date(game.date).toLocaleString()}</p>
                                </div>
                                <PlayCircleIcon className="text-highlight group-hover:scale-110 transition-transform" />
                            </div>
                        ))}
                        {games.length === 0 && <p className="text-center py-10 text-text-secondary italic">Nenhuma partida escalada.</p>}
                    </div>
                </Card>
            )}

            <Modal isOpen={isScannerOpen} onClose={() => setIsScannerOpen(false)} title="Zebra Scan - Validação BID">
                <div className="flex flex-col items-center py-8">
                    <div className="w-64 h-64 border-4 border-highlight rounded-3xl relative overflow-hidden bg-black flex items-center justify-center">
                        {isScanning ? (
                            <>
                                <div className="absolute top-0 left-0 w-full h-1 bg-highlight animate-scan-line"></div>
                                <CameraIcon className="w-12 h-12 text-white/20" />
                            </>
                        ) : (
                            <CheckCircleIcon className="w-16 h-16 text-green-500 animate-bounce" />
                        )}
                    </div>
                    <p className="text-sm text-text-secondary mt-6 text-center px-6">
                        {isScanning ? 'Aponte a câmera para o QR Code da carteirinha do atleta.' : 'Identidade verificada com sucesso no BID.'}
                    </p>
                </div>
            </Modal>
            
            <style>{`
                @keyframes scanLine {
                    0% { top: 0; }
                    100% { top: 100%; }
                }
                .animate-scan-line {
                    position: absolute;
                    animation: scanLine 2s linear infinite;
                    box-shadow: 0 0 15px rgba(5, 150, 105, 1);
                }
            `}</style>
        </div>
    );
};

export default Officiating;