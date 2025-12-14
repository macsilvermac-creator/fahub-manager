
import React, { useState, useEffect, useContext } from 'react';
import Card from '../components/Card';
import { FlagIcon, BriefcaseIcon, WhistleIcon } from '../components/icons/NavIcons';
import { CheckCircleIcon, PlayCircleIcon, MicIcon, MapIcon, StarIcon, AlertTriangleIcon } from '../components/icons/UiIcons';
import { Game, GameReport, FoulRecord, FoulType, Player, GameInfrastructureChecklist, TeamSettings, RefereeProfile, AssociationFinance, CrewLogistics } from '../types';
import { storageService } from '../services/storageService';
import { voiceService } from '../services/voiceService';
import { liveGameService } from '../services/liveGameService';
import { UserContext } from '../components/Layout';
import { useToast } from '../contexts/ToastContext'; 
import LazyImage from '../components/LazyImage'; 

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
    
    const [myProfile, setMyProfile] = useState<RefereeProfile | null>(null);
    const [crewLogistics, setCrewLogistics] = useState<CrewLogistics | null>(null);

    const [refereeRoster, setRefereeRoster] = useState<RefereeProfile[]>([]);
    const [associationFinance, setAssociationFinance] = useState<AssociationFinance | null>(null);

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
    
    const [homeScore, setHomeScore] = useState(0);
    const [awayScore, setAwayScore] = useState(0);
    const [gameClock, setGameClock] = useState('12:00');

    const [checkedPlayers, setCheckedPlayers] = useState<Record<number, boolean>>({});

    const [ambulanceTimer, setAmbulanceTimer] = useState(REGULATION_AMBULANCE_TOLERANCE_MIN * 60); 
    const [isAmbulanceTimerRunning, setIsAmbulanceTimerRunning] = useState(false);

    const [isListening, setIsListening] = useState(false);

    const isMaster = currentRole === 'MASTER';

    useEffect(() => {
        setGames(storageService.getGames());
        setPlayers(storageService.getPlayers());
        setTeamSettings(storageService.getTeamSettings());
        setRefereeRoster(storageService.getReferees());
        setAssociationFinance(storageService.getAssociationFinancials());
        
        const profile = storageService.getRefereeProfile('ref1');
        setMyProfile(profile);
        
        const nextGame = storageService.getGames().find(g => g.status === 'SCHEDULED');
        if(nextGame) {
            setCrewLogistics(storageService.getCrewLogistics(nextGame.id));
        }
    }, []);

    const syncLiveState = (updates: Partial<Game>, type: 'SCORE' | 'CLOCK' | 'STATUS') => {
        if(!selectedGame) return;
        const updatedGame = { ...selectedGame, ...updates, officialReport: gameReport };
        
        storageService.updateLiveGame(selectedGame.id, updatedGame);
        setSelectedGame(updatedGame as Game); 

        // Broadcast Change
        liveGameService.broadcastUpdate(selectedGame.id, type, updates);
    };

    const updateScore = (team: 'HOME' | 'AWAY', delta: number) => {
        const newHome = team === 'HOME' ? Math.max(0, homeScore + delta) : homeScore;
        const newAway = team === 'AWAY' ? Math.max(0, awayScore + delta) : awayScore;
        setHomeScore(newHome);
        setAwayScore(newAway);
        syncLiveState({ score: `${newHome}-${newAway}` }, 'SCORE');
    };

    const updateQuarter = (q: number) => {
        setPendingFoul({...pendingFoul, quarter: q});
        syncLiveState({ currentQuarter: q }, 'STATUS');
        toast.info(`Quarto alterado para Q${q}`);
    };

    const handleGameStart = () => {
        if(confirm("Iniciar cronômetro oficial e marcar jogo como EM ANDAMENTO?")) {
            syncLiveState({ status: 'IN_PROGRESS' }, 'STATUS');
            toast.success("Jogo iniciado! Bom trabalho, equipe.");
        }
    };

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
        if (isListening) {
            setIsListening(false);
            return;
        }
        
        setIsListening(true);
        toast.info("Zebra Bot ouvindo...");

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
                liveGameService.broadcastUpdate(selectedGame.id, 'STATUS', { status: 'FINAL', result: winner === 'HOME' ? 'W' : 'L', score: `${homeScore}-${awayScore}` });
                
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

            {viewMode === 'FIELD' && selectedGame && (
                 <div className="space-y-6 animate-slide-in">
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
                     <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className="lg:col-span-2">
                            <Card title="Painel de Faltas">
                                <div className="flex gap-4 justify-center py-4">
                                     <button onClick={startVoiceCommand} className={`px-6 py-4 rounded-xl font-bold flex items-center gap-2 ${isListening ? 'bg-red-500 animate-pulse text-white' : 'bg-blue-600 text-white hover:bg-blue-500'}`}>
                                        <MicIcon className="w-6 h-6" /> Comando de Voz
                                    </button>
                                </div>
                            </Card>
                        </div>
                        <div>
                             <Card title="Feed do Jogo">
                                <button onClick={handleFinalizeGame} className="w-full mt-4 bg-green-600 text-white py-2 rounded font-bold">Finalizar Jogo</button>
                             </Card>
                        </div>
                     </div>
                 </div>
            )}
            
             {viewMode === 'FIELD' && !selectedGame && (
                  <Card title="Selecione o Jogo para Apitar">
                      <div className="space-y-4">
                        {games.filter(g => !g.officialReport?.isFinalized).map(game => (
                             <div key={game.id} className="flex items-center justify-between bg-secondary p-4 rounded-xl border border-white/5 hover:border-highlight cursor-pointer" onClick={() => setSelectedGame(game)}>
                                 <div className="flex items-center gap-4">
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
                      </div>
                  </Card>
             )}
        </div>
    );
};

export default Officiating;