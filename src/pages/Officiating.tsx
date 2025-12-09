
import React, { useState, useEffect, useContext } from 'react';
import Card from '../components/Card';
import { FlagIcon, BriefcaseIcon, WhistleIcon } from '../components/icons/NavIcons';
import { CheckCircleIcon, ClockIcon, WalletIcon, GavelIcon, AlertTriangleIcon, UsersIcon, PlayCircleIcon, StopIcon, MicIcon, MapIcon, FileTextIcon, StarIcon } from '../components/icons/UiIcons';
import { Game, OfficialAssignment, GameReport, FoulRecord, FoulType, Player, CrewExpense, GameInfrastructureChecklist, TeamSettings, RefereeProfile, AssociationFinance, UserRole, CrewLogistics } from '../types';
import { storageService } from '../services/storageService';
import { askRefereeBot, generateJudicialReport } from '../services/geminiService';
import { voiceService } from '../services/voiceService';
import { UserContext } from '../components/Layout';
import Modal from '../components/Modal';
import { useToast } from '../contexts/ToastContext'; // UX Padronizada
import LazyImage from '@/components/LazyImage'; // Performance Mobile

// Regras 2025: 100L de agua, Ambulancia 30min antes
const REGULATION_AMBULANCE_TOLERANCE_MIN = 30; 
const FOUL_TYPES: { type: FoulType; label: string; yards: number; code: string }[] = [
    { type: 'HOLDING', label: 'Holding', yards: 10, code: 'OH' },
    { type: 'FALSE_START', label: 'False Start', yards: 5, code: 'FST' },
    { type: 'OFFSIDES', label: 'Offsides', yards: 5, code: 'OFF' },
    { type: 'PASS_INTERFERENCE', label: 'Pass Interf.', yards: 15, code: 'DPI' },
    { type: 'UNSPORTSMANLIKE', label: 'Unsportsmanlike', yards: 15, code: 'UNS' },
    { type: 'PERSONAL_FOUL', label: 'Personal Foul', yards: 15, code: 'PF' },
    { type: 'DELAY_OF_GAME', label: 'Delay Game', yards: 5, code: 'DOG' },
    { type: 'BLOCK_IN_BACK', label: 'Block in Back', yards: 10, code: 'IBB' },
];

const INITIAL_INFRASTRUCTURE: GameInfrastructureChecklist = {
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
};

const Officiating: React.FC = () => {
    const { currentRole } = useContext(UserContext);
    const toast = useToast();
    const [viewMode, setViewMode] = useState<'CAREER' | 'WORKFLOW' | 'FIELD' | 'ADMIN'>('CAREER');
    const [games, setGames] = useState<Game[]>([]);
    const [players, setPlayers] = useState<Player[]>([]);
    const [teamSettings, setTeamSettings] = useState<TeamSettings | null>(null);
    const [activeTab, setActiveTab] = useState<'SUMULA_PRE' | 'LIVE' | 'ROSTER' | 'EDUCATION'>('SUMULA_PRE');
    const [adminTab, setAdminTab] = useState<'SCALES' | 'FINANCE_ADMIN' | 'ROSTER_ADMIN'>('SCALES');
    
    // Referee Personal Data
    const [myProfile, setMyProfile] = useState<RefereeProfile | null>(null);
    const [crewLogistics, setCrewLogistics] = useState<CrewLogistics | null>(null);

    // Association State
    const [refereeRoster, setRefereeRoster] = useState<RefereeProfile[]>([]);
    const [associationFinance, setAssociationFinance] = useState<AssociationFinance | null>(null);

    // Live Game State
    const [selectedGame, setSelectedGame] = useState<Game | null>(null);
    const [pendingFoul, setPendingFoul] = useState<Partial<FoulRecord>>({ quarter: 1 });
    const [gameReport, setGameReport] = useState<GameReport>({ 
        infrastructure: INITIAL_INFRASTRUCTURE,
        fouls: [], 
        ejections: [], 
        notes: '', 
        crew: [], 
        isFinalized: false 
    });
    
    // Scoreboard State
    const [homeScore, setHomeScore] = useState(0);
    const [awayScore, setAwayScore] = useState(0);
    const [gameClock, setGameClock] = useState('12:00');

    // Roster Check State
    const [checkedPlayers, setCheckedPlayers] = useState<Record<number, boolean>>({});

    // Ambulance Timer Logic
    const [ambulanceTimer, setAmbulanceTimer] = useState(REGULATION_AMBULANCE_TOLERANCE_MIN * 60); // Seconds
    const [isAmbulanceTimerRunning, setIsAmbulanceTimerRunning] = useState(false);

    // Voice State
    const [isListening, setIsListening] = useState(false);

    const isMaster = currentRole === 'MASTER';

    useEffect(() => {
        setGames(storageService.getGames());
        setPlayers(storageService.getPlayers());
        setTeamSettings(storageService.getTeamSettings());
        setRefereeRoster(storageService.getReferees());
        setAssociationFinance(storageService.getAssociationFinancials());
        
        // Mock Personal Profile Load
        const profile = storageService.getRefereeProfile('ref1');
        setMyProfile(profile);
        
        // Auto-select next game for workflow
        const nextGame = storageService.getGames().find(g => g.status === 'SCHEDULED');
        if(nextGame) {
            setCrewLogistics(storageService.getCrewLogistics(nextGame.id));
        }
    }, []);

    // --- SCOREBOARD HANDLERS ---
    const syncLiveState = (updates: Partial<Game>) => {
        if(!selectedGame) return;
        const updatedGame = { ...selectedGame, ...updates, officialReport: gameReport };
        storageService.updateLiveGame(selectedGame.id, updatedGame);
        setSelectedGame(updatedGame as Game); 
    };

    const updateScore = (team: 'HOME' | 'AWAY', delta: number) => {
        const newHome = team === 'HOME' ? Math.max(0, homeScore + delta) : homeScore;
        const newAway = team === 'AWAY' ? Math.max(0, awayScore + delta) : awayScore;
        setHomeScore(newHome);
        setAwayScore(newAway);
        syncLiveState({ score: `${newHome}-${newAway}` });
    };

    const updateQuarter = (q: number) => {
        setPendingFoul({...pendingFoul, quarter: q});
        syncLiveState({ currentQuarter: q });
        toast.info(`Quarto alterado para Q${q}`);
    };

    const handleGameStart = () => {
        if(confirm("Iniciar cronômetro oficial e marcar jogo como EM ANDAMENTO?")) {
            syncLiveState({ status: 'IN_PROGRESS' });
            toast.success("Jogo iniciado! Bom trabalho, equipe.");
        }
    };

    // --- INFRASTRUCTURE CHECKLIST ---
    const handleInfraCheck = (field: keyof GameInfrastructureChecklist, value: any) => {
        const updated = { ...gameReport.infrastructure, [field]: value };
        if (field === 'ambulancePresent' && value === true) {
            updated.ambulanceArrivalTime = new Date().toLocaleTimeString();
            setIsAmbulanceTimerRunning(false);
            toast.success("Ambulância registrada. Jogo liberado.");
        }
        setGameReport(prev => {
            const newState = { ...prev, infrastructure: updated };
            if(selectedGame) storageService.updateLiveGame(selectedGame.id, { officialReport: newState });
            return newState;
        });
    };

    const startVoiceCommand = () => {
        setIsListening(true);
        voiceService.listenToCommand(
            (text) => {
                setIsListening(false);
                const lowerText = text.toLowerCase();
                const detectedFoul = FOUL_TYPES.find(f => lowerText.includes(f.label.toLowerCase()) || lowerText.includes(f.code.toLowerCase()));
                const numberMatch = text.match(/\d+/);
                const number = numberMatch ? parseInt(numberMatch[0]) : undefined;

                if (detectedFoul) {
                    setPendingFoul(prev => ({
                        ...prev,
                        type: detectedFoul.type,
                        yards: detectedFoul.yards,
                        playerNumber: number,
                        team: 'HOME' 
                    }));
                    toast.success(`Falta Detectada: ${detectedFoul.label}`);
                } else {
                    toast.warning(`Não entendi a falta. Ouvi: "${text}"`);
                }
            },
            (err) => {
                setIsListening(false);
                toast.error("Erro no reconhecimento de voz: " + err);
            }
        );
    };

    const handleFinalizeGame = () => {
        if (!gameReport.infrastructure.ambulancePresent) {
            toast.error("ERRO CRÍTICO: Não é possível finalizar jogo sem registro de ambulância. Use W.O. se necessário.");
            return;
        }
        if (window.confirm("Confirmar resultado final e assinar súmula digital?")) {
            if (selectedGame) {
                const winner = homeScore > awayScore ? 'HOME' : awayScore > homeScore ? 'AWAY' : 'TIE';
                storageService.finalizeGameReport(selectedGame.id, gameReport, `${homeScore}-${awayScore}`, winner);
                toast.success("Súmula enviada com sucesso à Federação.");
                setGameReport({ ...gameReport, isFinalized: true });
                setSelectedGame(null); 
            }
        }
    };

    return (
        <div className="space-y-6 pb-12 animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-secondary rounded-xl">
                        <FlagIcon className="text-highlight w-8 h-8" />
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold text-text-primary">Officiating Hub</h2>
                        <p className="text-text-secondary">Associação de Árbitros e Súmula Digital</p>
                    </div>
                </div>
                
                {/* Enhanced Navigation */}
                <div className="flex bg-secondary p-1 rounded-xl border border-white/10 overflow-x-auto">
                    <button onClick={() => setViewMode('CAREER')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap ${viewMode === 'CAREER' ? 'bg-highlight text-white' : 'text-text-secondary hover:text-white'}`}>
                        <StarIcon className="w-4 h-4" /> Minha Carreira
                    </button>
                    <button onClick={() => setViewMode('WORKFLOW')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap ${viewMode === 'WORKFLOW' ? 'bg-highlight text-white' : 'text-text-secondary hover:text-white'}`}>
                        <MapIcon className="w-4 h-4" /> Logística (Workflow)
                    </button>
                    <button onClick={() => setViewMode('FIELD')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap ${viewMode === 'FIELD' ? 'bg-red-600 text-white' : 'text-text-secondary hover:text-white'}`}>
                        <WhistleIcon className="w-4 h-4" /> Game Day (Live)
                    </button>
                    {(isMaster || currentRole === 'REFEREE') && (
                        <button onClick={() => setViewMode('ADMIN')} className={`px-4 py-2 rounded-lg text-sm font-bold transition-all flex items-center gap-2 whitespace-nowrap ${viewMode === 'ADMIN' ? 'bg-blue-600 text-white' : 'text-text-secondary hover:text-white'}`}>
                            <BriefcaseIcon className="w-4 h-4" /> Associação
                        </button>
                    )}
                </div>
            </div>

            {/* === TAB 1: CAREER (O PROFISSIONAL) === */}
            {viewMode === 'CAREER' && myProfile && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-slide-in">
                    <Card title="Perfil Profissional">
                        <div className="flex items-center gap-6 mb-6">
                            <div className="w-24 h-24 bg-white/10 rounded-full flex items-center justify-center text-4xl">🦓</div>
                            <div>
                                <h3 className="text-2xl font-bold text-white">{myProfile.name}</h3>
                                <div className="flex gap-2 mt-2">
                                    <span className="bg-yellow-500 text-black px-2 py-0.5 rounded font-bold text-xs uppercase">{myProfile.level}</span>
                                    <span className="bg-green-500 text-black px-2 py-0.5 rounded font-bold text-xs uppercase">Apto (Regular)</span>
                                </div>
                            </div>
                        </div>
                        <div className="bg-secondary/50 p-4 rounded-xl border border-white/5 space-y-3">
                            <h4 className="font-bold text-white text-sm uppercase">Certificações Ativas</h4>
                            {myProfile.certifications?.map(cert => (
                                <div key={cert.id} className="flex justify-between items-center bg-black/20 p-2 rounded">
                                    <div className="flex items-center gap-2">
                                        <CheckCircleIcon className="w-4 h-4 text-green-400" />
                                        <span className="text-sm text-text-secondary">{cert.name}</span>
                                    </div>
                                    <span className="text-xs text-text-secondary">Expira: {new Date(cert.expiryDate).toLocaleDateString()}</span>
                                </div>
                            ))}
                            <button className="w-full text-xs text-highlight hover:underline mt-2">Acessar Academy para Reciclagem →</button>
                        </div>
                    </Card>

                    <Card title="Minha Carteira (Financeiro)">
                        <div className="bg-gradient-to-r from-green-900/40 to-emerald-900/40 p-6 rounded-xl border border-green-500/30 text-center mb-6">
                            <p className="text-sm text-green-300 font-bold uppercase mb-1">Saldo a Receber</p>
                            <p className="text-4xl font-black text-white">R$ {myProfile.balance.toFixed(2)}</p>
                            <button className="mt-4 bg-green-600 hover:bg-green-500 text-white px-6 py-2 rounded-full font-bold text-sm">Solicitar Pagamento</button>
                        </div>
                        <div className="space-y-2">
                            <h4 className="text-xs font-bold text-text-secondary uppercase">Histórico Recente</h4>
                            <div className="flex justify-between p-2 hover:bg-white/5 rounded">
                                <span className="text-sm text-white">Jogo: Stars vs Bulls</span>
                                <span className="text-sm font-mono text-green-400">+ R$ 200,00</span>
                            </div>
                            <div className="flex justify-between p-2 hover:bg-white/5 rounded">
                                <span className="text-sm text-white">Ajuda de Custo (Gasolina)</span>
                                <span className="text-sm font-mono text-green-400">+ R$ 50,00</span>
                            </div>
                        </div>
                    </Card>
                </div>
            )}

            {/* === TAB 2: WORKFLOW (LOGÍSTICA) === */}
            {viewMode === 'WORKFLOW' && (
                <div className="space-y-6 animate-slide-in">
                    <Card title="Próximo Jogo & Logística de Crew">
                        {crewLogistics ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <div className="bg-secondary/50 p-4 rounded-xl border border-white/5 mb-4">
                                        <h4 className="font-bold text-white mb-2">Detalhes da Missão</h4>
                                        <p className="text-sm text-text-secondary"><strong className="text-white">Jogo:</strong> Stars vs Bulls</p>
                                        <p className="text-sm text-text-secondary"><strong className="text-white">Data:</strong> Sábado, 14:00</p>
                                        <p className="text-sm text-text-secondary"><strong className="text-white">Local:</strong> Arena Principal</p>
                                        <p className="text-sm text-text-secondary mt-2"><strong className="text-white">Uniforme:</strong> {crewLogistics.uniformColor}</p>
                                    </div>
                                    <div className="bg-yellow-900/20 p-4 rounded-xl border border-yellow-500/20">
                                        <h4 className="font-bold text-yellow-400 mb-2 flex items-center gap-2"><ClockIcon className="w-4 h-4" /> Ponto de Encontro</h4>
                                        <p className="text-white text-lg font-bold">{crewLogistics.meetingTime}</p>
                                        <p className="text-sm text-text-secondary">{crewLogistics.meetingPoint}</p>
                                        <button className="mt-3 text-xs bg-yellow-600 text-black px-3 py-1 rounded font-bold">Check-in no Ponto</button>
                                    </div>
                                </div>
                                <div>
                                    <h4 className="font-bold text-white mb-3">Carona Solidária (Carpool)</h4>
                                    <div className="space-y-3">
                                        {crewLogistics.carPools.map((pool, idx) => (
                                            <div key={idx} className="bg-black/30 p-3 rounded-lg border border-white/10">
                                                <div className="flex justify-between items-center mb-2">
                                                    <span className="text-sm font-bold text-white">Motorista: {pool.driver}</span>
                                                    <span className="text-xs text-text-secondary bg-white/10 px-2 rounded">{pool.vehicle}</span>
                                                </div>
                                                <div className="flex gap-2">
                                                    {pool.passengers.map(p => (
                                                        <span key={p} className="text-xs bg-blue-600/20 text-blue-300 px-2 py-1 rounded">{p}</span>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                    <button className="w-full mt-4 border border-white/10 hover:bg-white/5 text-text-secondary py-2 rounded text-sm">Abrir Chat da Crew</button>
                                </div>
                            </div>
                        ) : (
                            <p className="text-text-secondary italic text-center py-8">Você não está escalado para jogos futuros.</p>
                        )}
                    </Card>
                </div>
            )}

            {/* === TAB 3: FIELD MODE (GAME OPERATIONS) === */}
            {viewMode === 'FIELD' && (
                <>
                    {!selectedGame && (
                        <Card title="Selecione o Jogo para Apitar">
                            <div className="space-y-4">
                                {games.filter(g => !g.officialReport?.isFinalized).map(game => (
                                    <div key={game.id} className="flex items-center justify-between bg-secondary p-4 rounded-xl border border-white/5 hover:border-highlight cursor-pointer" onClick={() => setSelectedGame(game)}>
                                        <div className="flex items-center gap-4">
                                            <div className="text-center">
                                                <p className="text-sm font-bold text-white">{new Date(game.date).toLocaleDateString()}</p>
                                                <p className="text-xs text-text-secondary">{new Date(game.date).toLocaleTimeString()}</p>
                                            </div>
                                            <div className="h-8 w-px bg-white/10"></div>
                                            <div>
                                                <p className="text-lg font-black text-white uppercase">{teamSettings?.teamName || 'MANDANTE'} vs {game.opponent}</p>
                                                <p className="text-xs text-text-secondary">Mandante: {game.location === 'Home' ? (teamSettings?.teamName || 'HOME') : game.opponent}</p>
                                            </div>
                                        </div>
                                        <span className={`text-xs font-bold px-3 py-1 rounded-full ${game.status === 'IN_PROGRESS' ? 'bg-red-500 text-white animate-pulse' : 'bg-highlight/20 text-highlight'}`}>
                                            {game.status === 'IN_PROGRESS' ? '● Em Andamento' : 'Iniciar Súmula'}
                                        </span>
                                    </div>
                                ))}
                                {games.filter(g => !g.officialReport?.isFinalized).length === 0 && (
                                    <p className="text-text-secondary italic text-center">Nenhum jogo escalado pendente.</p>
                                )}
                            </div>
                        </Card>
                    )}

                    {selectedGame && (
                        <div className="space-y-6 animate-slide-in">
                            {/* Scoreboard Header */}
                            <div className="bg-black rounded-2xl p-6 border-b-4 border-highlight relative overflow-hidden shadow-2xl">
                                {selectedGame.status === 'IN_PROGRESS' && (
                                    <div className="absolute top-4 left-4 flex items-center gap-2 bg-red-600 px-2 py-1 rounded text-white text-[10px] font-bold uppercase animate-pulse">
                                        <span className="w-2 h-2 bg-white rounded-full"></span> Ao Vivo
                                    </div>
                                )}
                                <button onClick={() => setSelectedGame(null)} className="absolute top-4 right-4 text-xs text-text-secondary hover:text-white underline">Sair do Jogo</button>
                                
                                <div className="flex justify-between items-center relative z-10 mt-4">
                                    <div className="text-center">
                                        <h3 className="text-2xl font-black text-white">{teamSettings?.teamName?.toUpperCase() || 'MANDANTE'}</h3>
                                        <div className="flex items-center justify-center gap-2 mt-2">
                                            <button onClick={() => updateScore('HOME', -1)} className="text-text-secondary hover:text-white text-2xl">-</button>
                                            <span className="text-5xl font-mono font-bold text-highlight">{homeScore}</span>
                                            <button onClick={() => updateScore('HOME', 1)} className="text-text-secondary hover:text-white text-2xl">+</button>
                                        </div>
                                    </div>
                                    <div className="text-center opacity-70">
                                        {selectedGame.status !== 'IN_PROGRESS' ? (
                                            <button onClick={handleGameStart} className="bg-green-600 text-white px-4 py-2 rounded font-bold text-sm mb-2 flex items-center gap-2 mx-auto">
                                                <PlayCircleIcon className="w-4 h-4"/> Iniciar Jogo
                                            </button>
                                        ) : (
                                            <div className="text-3xl font-mono text-white mb-2">{gameClock}</div>
                                        )}
                                        <div className="text-sm font-bold uppercase tracking-widest text-text-secondary mb-1">Quarto</div>
                                        <div className="flex gap-2 justify-center">
                                            {[1,2,3,4].map(q => (
                                                <button key={q} onClick={() => updateQuarter(q)} className={`w-8 h-8 rounded-full font-bold ${pendingFoul.quarter === q ? 'bg-white text-black' : 'bg-white/20 text-white'}`}>{q}</button>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="text-center">
                                        <h3 className="text-2xl font-black text-white uppercase">{selectedGame.opponent}</h3>
                                        <div className="flex items-center justify-center gap-2 mt-2">
                                            <button onClick={() => updateScore('AWAY', -1)} className="text-text-secondary hover:text-white text-2xl">-</button>
                                            <span className="text-5xl font-mono font-bold text-highlight">{awayScore}</span>
                                            <button onClick={() => updateScore('AWAY', 1)} className="text-text-secondary hover:text-white text-2xl">+</button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Field Tabs */}
                            <div className="flex border-b border-white/10 overflow-x-auto">
                                {['SUMULA_PRE', 'ROSTER', 'LIVE', 'EDUCATION'].map(t => (
                                    <button key={t} onClick={() => setActiveTab(t as any)} className={`px-6 py-3 font-bold text-sm border-b-2 whitespace-nowrap ${activeTab === t ? 'border-highlight text-highlight' : 'border-transparent text-text-secondary'}`}>
                                        {t === 'SUMULA_PRE' ? '1. Pré-Jogo' : t === 'ROSTER' ? '2. Roster Check' : t === 'LIVE' ? '3. Game Day' : '4. Zebra Bot'}
                                    </button>
                                ))}
                            </div>

                            {/* TAB 1: PRE-GAME */}
                            {activeTab === 'SUMULA_PRE' && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <Card title="Protocolo de Infraestrutura">
                                        <div className="space-y-4">
                                            <div className={`p-4 rounded-xl border-l-4 ${gameReport.infrastructure.ambulancePresent ? 'bg-green-900/20 border-l-green-500' : 'bg-red-900/20 border-l-red-500'}`}>
                                                <div className="flex justify-between items-center mb-2">
                                                    <span className="font-bold text-white uppercase flex items-center gap-2"><AlertTriangleIcon className="w-5 h-5"/> Ambulância (UTI Móvel)</span>
                                                    {gameReport.infrastructure.ambulancePresent ? (
                                                        <span className="text-xs text-green-400 font-bold">CHEGOU: {gameReport.infrastructure.ambulanceArrivalTime}</span>
                                                    ) : (
                                                        <button onClick={() => handleInfraCheck('ambulancePresent', true)} className="bg-green-600 px-3 py-1 rounded text-xs text-white font-bold">Marcar Chegada</button>
                                                    )}
                                                </div>
                                            </div>
                                            {/* Checklist Items */}
                                            <div className="space-y-2">
                                                <label className="flex items-center gap-2 p-2 bg-secondary rounded hover:bg-white/5 cursor-pointer">
                                                    <input type="checkbox" checked={gameReport.infrastructure.fieldDimensionsOk} onChange={(e) => handleInfraCheck('fieldDimensionsOk', e.target.checked)} className="accent-highlight w-5 h-5" />
                                                    <span className="text-sm text-white">Campo 91m</span>
                                                </label>
                                                <label className="flex items-center gap-2 p-2 bg-secondary rounded hover:bg-white/5 cursor-pointer">
                                                    <input type="checkbox" checked={gameReport.infrastructure.waterProvided} onChange={(e) => handleInfraCheck('waterProvided', e.target.checked)} className="accent-highlight w-5 h-5" />
                                                    <span className="text-sm text-white">Água Visitante (100L)</span>
                                                </label>
                                            </div>
                                        </div>
                                    </Card>
                                </div>
                            )}

                            {/* TAB 2: ROSTER */}
                            {activeTab === 'ROSTER' && (
                                <Card title="Conferência de Identidade">
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 max-h-[500px] overflow-y-auto p-1 custom-scrollbar">
                                        {players.map(player => (
                                            <div 
                                                key={player.id} 
                                                onClick={() => setCheckedPlayers(prev => ({...prev, [player.id]: !prev[player.id]}))}
                                                className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${checkedPlayers[player.id] ? 'bg-green-600/20 border-green-500' : 'bg-secondary border-white/5 opacity-60'}`}
                                            >
                                                <LazyImage src={player.avatarUrl} className="w-10 h-10 rounded-full bg-black object-cover" />
                                                <div>
                                                    <p className="font-bold text-white text-sm">{player.name}</p>
                                                    <span className="text-text-secondary text-xs">#{player.jerseyNumber}</span>
                                                </div>
                                                {checkedPlayers[player.id] && <CheckCircleIcon className="w-5 h-5 text-green-500 ml-auto" />}
                                            </div>
                                        ))}
                                    </div>
                                </Card>
                            )}

                            {/* TAB 3: LIVE */}
                            {activeTab === 'LIVE' && (
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                    <div className="lg:col-span-2 space-y-4">
                                        <div className="bg-secondary rounded-2xl p-6 border border-white/10 text-center">
                                            <h3 className="text-xl font-bold text-white mb-4">Painel de Faltas</h3>
                                            <div className="flex gap-4 justify-center">
                                                <button onClick={startVoiceCommand} className={`px-6 py-4 rounded-xl font-bold flex items-center gap-2 ${isListening ? 'bg-red-500 animate-pulse text-white' : 'bg-blue-600 text-white hover:bg-blue-500'}`}>
                                                    <MicIcon className="w-6 h-6" /> Comando de Voz
                                                </button>
                                            </div>
                                            <p className="text-xs text-text-secondary mt-2">Diga: "Falta Holding número 55"</p>
                                        </div>
                                    </div>
                                    <div>
                                        <Card title="Feed do Jogo">
                                            <div className="space-y-2 max-h-[300px] overflow-y-auto">
                                                {gameReport.fouls.map((f, i) => (
                                                    <div key={i} className="bg-white/5 p-2 rounded text-xs border-l-2 border-yellow-500">
                                                        <span className="font-bold text-white">{f.type}</span> #{f.playerNumber}
                                                    </div>
                                                ))}
                                            </div>
                                            <button onClick={handleFinalizeGame} className="w-full mt-4 bg-green-600 text-white py-2 rounded font-bold">Finalizar Jogo</button>
                                        </Card>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </>
            )}

            {/* === TAB 4: ADMIN (ASSOCIATION) === */}
            {viewMode === 'ADMIN' && (
                <div className="space-y-6 animate-slide-in">
                    <div className="flex border-b border-white/10 overflow-x-auto">
                        <button onClick={() => setAdminTab('SCALES')} className={`px-6 py-3 font-bold text-sm border-b-2 transition-colors ${adminTab === 'SCALES' ? 'border-blue-500 text-blue-400' : 'border-transparent text-text-secondary'}`}>Escalas de Jogos</button>
                        <button onClick={() => setAdminTab('FINANCE_ADMIN')} className={`px-6 py-3 font-bold text-sm border-b-2 transition-colors ${adminTab === 'FINANCE_ADMIN' ? 'border-green-500 text-green-400' : 'border-transparent text-text-secondary'}`}>Financeiro da Entidade</button>
                        <button onClick={() => setAdminTab('ROSTER_ADMIN')} className={`px-6 py-3 font-bold text-sm border-b-2 transition-colors ${adminTab === 'ROSTER_ADMIN' ? 'border-yellow-500 text-yellow-400' : 'border-transparent text-text-secondary'}`}>Quadro de Árbitros</button>
                    </div>

                    {adminTab === 'SCALES' && (
                        <Card title="Gestão de Escalas da Rodada">
                            <div className="space-y-4">
                                {games.filter(g => g.status === 'SCHEDULED').map(game => (
                                    <div key={game.id} className="bg-secondary p-4 rounded-xl border border-white/5">
                                        <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-2">
                                            <div>
                                                <h4 className="font-bold text-white text-lg">Jogo #{game.id}: {game.opponent} vs {teamSettings?.teamName}</h4>
                                                <p className="text-xs text-text-secondary">{new Date(game.date).toLocaleString()} • {game.location}</p>
                                            </div>
                                            <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded font-bold">Pendente Escala</span>
                                        </div>
                                        {/* Mock assignments */}
                                        <p className="text-xs text-text-secondary italic">Sistema Smart Assign pronto para sugerir equipe baseada em geo-localização.</p>
                                    </div>
                                ))}
                            </div>
                        </Card>
                    )}
                </div>
            )}
        </div>
    );
};

export default Officiating;