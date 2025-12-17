
import React, { useState, useEffect, useContext, useRef } from 'react';
import Card from '../components/Card';
import { FlagIcon, BriefcaseIcon, WhistleIcon } from '../components/icons/NavIcons';
import { CheckCircleIcon, PlayCircleIcon, MicIcon, MapIcon, StarIcon, AlertTriangleIcon, ScanIcon, XIcon, CameraIcon } from '../components/icons/UiIcons';
import { Game, GameReport, FoulRecord, FoulType, Player, GameInfrastructureChecklist, TeamSettings, RefereeProfile, AssociationFinance, CrewLogistics } from '../types';
import { storageService } from '../services/storageService';
import { voiceService } from '../services/voiceService';
import { realtimeService } from '../services/realtimeService';
import { UserContext } from '../components/Layout';
import { useToast } from '../contexts/ToastContext'; 
import LazyImage from '../components/LazyImage'; 
import Modal from '../components/Modal';

const Officiating: React.FC = () => {
    const { currentRole } = useContext(UserContext);
    const toast = useToast();
    const [viewMode, setViewMode] = useState<'CAREER' | 'WORKFLOW' | 'FIELD' | 'ADMIN'>('CAREER');
    const [games, setGames] = useState<Game[]>([]);
    const [players, setPlayers] = useState<Player[]>([]);
    const [teamSettings, setTeamSettings] = useState<TeamSettings | null>(null);
    const [activeTab, setActiveTab] = useState<'SUMULA_PRE' | 'LIVE' | 'ROSTER' | 'EDUCATION'>('SUMULA_PRE');
    
    // Scanner State
    const [isScannerOpen, setIsScannerOpen] = useState(false);
    const [isScanning, setIsScanning] = useState(false);

    const [selectedGame, setSelectedGame] = useState<Game | null>(null);
    const [gameReport, setGameReport] = useState<GameReport>({ 
        infrastructure: {
            ambulancePresent: false,
            ambulanceArrivalTime: '',
            visitorArrivalTime: '',
            lightingAdequate: true,
            fieldDimensionsOk: true,
            goalPostsOk: true,
            fieldMarkingsCorrect: true,
            visitorLockerRoom: { hasHotWater: true, secure: true },
            refereeLockerRoom: { hasHotWater: true, secure: true },
            ballsProvided: true,
            waterProvided: true
        },
        fouls: [], ejections: [], notes: '', crew: [], isFinalized: false 
    });
    
    const [homeScore, setHomeScore] = useState(0);
    const [awayScore, setAwayScore] = useState(0);
    const [checkedPlayers, setCheckedPlayers] = useState<Record<number, boolean>>({});

    useEffect(() => {
        setGames(storageService.getGames());
        setPlayers(storageService.getPlayers());
        setTeamSettings(storageService.getTeamSettings());
    }, []);

    const startScanner = () => {
        setIsScannerOpen(true);
        setIsScanning(true);
        // Simulação de Scanner (Em um ambiente real, aqui integraríamos a lib de câmera)
        setTimeout(() => {
            handleScanSuccess();
        }, 3000);
    };

    const handleScanSuccess = () => {
        setIsScanning(false);
        const randomPlayer = players[Math.floor(Math.random() * players.length)];
        if (randomPlayer) {
            setCheckedPlayers(prev => ({ ...prev, [randomPlayer.id]: true }));
            toast.success(`Atleta Validado: ${randomPlayer.name} #${randomPlayer.jerseyNumber}`);
        }
        setIsScannerOpen(false);
    };

    const syncLiveState = (updates: Partial<Game>, type: 'SCORE' | 'CLOCK' | 'STATUS') => {
        if(!selectedGame) return;
        const updatedGame = { ...selectedGame, ...updates, officialReport: gameReport };
        storageService.updateLiveGame(selectedGame.id, updatedGame);
        setSelectedGame(updatedGame as Game); 
        realtimeService.broadcastUpdate(selectedGame.id, type, updates);
    };

    const updateScore = (team: 'HOME' | 'AWAY', delta: number) => {
        const newHome = team === 'HOME' ? Math.max(0, homeScore + delta) : homeScore;
        const newAway = team === 'AWAY' ? Math.max(0, awayScore + delta) : awayScore;
        setHomeScore(newHome);
        setAwayScore(newAway);
        syncLiveState({ score: `${newHome}-${newAway}` }, 'SCORE');
    };

    return (
        <div className="space-y-6 pb-12 animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-secondary rounded-xl"><FlagIcon className="text-highlight w-8 h-8" /></div>
                    <div>
                        <h2 className="text-3xl font-bold text-text-primary">Officiating Hub</h2>
                        <p className="text-text-secondary text-sm">Controle de Identidade e Súmula Digital</p>
                    </div>
                </div>
                <div className="flex bg-secondary p-1 rounded-xl border border-white/10 overflow-x-auto">
                    <button onClick={() => setViewMode('CAREER')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${viewMode === 'CAREER' ? 'bg-highlight text-white' : 'text-text-secondary hover:text-white'}`}>Carreira</button>
                    <button onClick={() => setViewMode('FIELD')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 ${viewMode === 'FIELD' ? 'bg-red-600 text-white' : 'text-text-secondary hover:text-white'}`}><WhistleIcon className="w-4 h-4" /> Game Day</button>
                </div>
            </div>

            {viewMode === 'FIELD' && selectedGame && (
                <div className="space-y-6 animate-slide-in">
                    <div className="bg-black rounded-2xl p-6 border-b-4 border-highlight relative overflow-hidden shadow-2xl">
                         <button onClick={() => setSelectedGame(null)} className="absolute top-4 right-4 text-xs text-text-secondary hover:text-white underline">Sair</button>
                         <div className="flex justify-between items-center relative z-10">
                            <div className="text-center">
                                <h3 className="text-xl font-black text-white">{teamSettings?.teamName?.toUpperCase()}</h3>
                                <div className="flex items-center gap-4 mt-2">
                                    <button onClick={() => updateScore('HOME', 1)} className="text-3xl font-black text-white">+</button>
                                    <span className="text-5xl font-mono font-bold text-highlight">{homeScore}</span>
                                </div>
                            </div>
                            <div className="text-center">
                                <p className="text-xs font-bold text-text-secondary uppercase">Quarto</p>
                                <p className="text-2xl font-black text-white">Q{selectedGame.currentQuarter || 1}</p>
                            </div>
                            <div className="text-center">
                                <h3 className="text-xl font-black text-white">{selectedGame.opponent.toUpperCase()}</h3>
                                <div className="flex items-center gap-4 mt-2">
                                    <span className="text-5xl font-mono font-bold text-highlight">{awayScore}</span>
                                    <button onClick={() => updateScore('AWAY', 1)} className="text-3xl font-black text-white">+</button>
                                </div>
                            </div>
                         </div>
                    </div>

                    <div className="flex border-b border-white/10">
                        {['SUMULA_PRE', 'ROSTER', 'LIVE'].map(t => (
                            <button key={t} onClick={() => setActiveTab(t as any)} className={`px-6 py-3 font-bold text-sm border-b-2 ${activeTab === t ? 'border-highlight text-highlight' : 'border-transparent text-text-secondary'}`}>
                                {t === 'SUMULA_PRE' ? 'Infra' : t === 'ROSTER' ? 'Check-in' : 'Jogo'}
                            </button>
                        ))}
                    </div>

                    {activeTab === 'ROSTER' && (
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <h3 className="text-white font-bold">Verificação de Atletas</h3>
                                <button onClick={startScanner} className="bg-highlight text-white px-6 py-2 rounded-xl font-bold flex items-center gap-2 shadow-lg">
                                    <ScanIcon className="w-5 h-5" /> Abrir Scanner
                                </button>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                {players.map(p => (
                                    <div key={p.id} className={`flex items-center gap-3 p-3 rounded-xl border ${checkedPlayers[p.id] ? 'bg-green-600/20 border-green-500' : 'bg-secondary border-white/5 opacity-60'}`}>
                                        <LazyImage src={p.avatarUrl} className="w-10 h-10 rounded-full" />
                                        <div className="flex-1">
                                            <p className="text-sm font-bold text-white leading-none">{p.name}</p>
                                            <p className="text-[10px] text-text-secondary mt-1">#{p.jerseyNumber} • {p.position}</p>
                                        </div>
                                        {checkedPlayers[p.id] && <CheckCircleIcon className="w-5 h-5 text-green-500" />}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {viewMode === 'FIELD' && !selectedGame && (
                <Card title="Selecione o Jogo para Súmula">
                    <div className="space-y-3">
                        {games.filter(g => g.status !== 'FINAL').map(game => (
                            <div key={game.id} onClick={() => setSelectedGame(game)} className="bg-secondary p-4 rounded-xl border border-white/5 hover:border-highlight cursor-pointer flex justify-between items-center">
                                <div>
                                    <p className="font-bold text-white">{teamSettings?.teamName} vs {game.opponent}</p>
                                    <p className="text-xs text-text-secondary">{new Date(game.date).toLocaleString()}</p>
                                </div>
                                <PlayCircleIcon className="text-highlight" />
                            </div>
                        ))}
                    </div>
                </Card>
            )}

            <Modal isOpen={isScannerOpen} onClose={() => setIsScannerOpen(false)} title="Scanner BID Digital">
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
                    <p className="text-sm text-text-secondary mt-6 text-center">
                        {isScanning ? 'Posicione o QR Code do Atleta dentro da área marcada.' : 'Atleta Identificado com Sucesso!'}
                    </p>
                    <button onClick={() => setIsScannerOpen(false)} className="mt-8 text-white/50 hover:text-white uppercase text-xs font-bold tracking-widest">Cancelar</button>
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
