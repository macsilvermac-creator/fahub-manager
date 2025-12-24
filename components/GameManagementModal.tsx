
import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { Game, Player, GameScoutingReport, PlayerPerformance, CallSheetSection, TacticalPlay } from '../types';
import { storageService } from '../services/storageService';
import { analyzeOpponentTendencies } from '../services/geminiService';
import Card from './Card';
import { PrinterIcon, SparklesIcon, UsersIcon, CheckCircleIcon, XIcon, ShieldCheckIcon } from './icons/UiIcons';
import { BookIcon } from './icons/NavIcons';
import LazyImage from './LazyImage';
import { useToast } from '../contexts/ToastContext';

interface GameManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  game: Game | null;
  onSave: (updatedGame: Game) => void;
}

const GameManagementModal: React.FC<GameManagementModalProps> = ({ isOpen, onClose, game, onSave }) => {
  const toast = useToast();
  const [activeTab, setActiveTab] = useState<'ROSTER' | 'SCOUTING' | 'CALL_SHEET' | 'GRADING'>('ROSTER');
  const [scoutData, setScoutData] = useState<GameScoutingReport>({
    offenseAnalysis: '',
    defenseAnalysis: '',
    keyPlayersToWatch: '',
    lastUpdate: new Date()
  });
  
  const [playerGrades, setPlayerGrades] = useState<PlayerPerformance[]>([]);
  const [callSheet, setCallSheet] = useState<CallSheetSection[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [gameRoster, setGameRoster] = useState<string[]>([]); 
  
  // Playbook Picker State
  const [tacticalPlays, setTacticalPlays] = useState<TacticalPlay[]>([]);
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [pickerTarget, setPickerTarget] = useState<{sectionIdx: number, playIdx: number} | null>(null);

  // AI State
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    if (isOpen && game) {
        const allPlayers = storageService.getPlayers();
        setPlayers(allPlayers);
        // Fix: getTacticalPlays now exists in storageService.ts
        setTacticalPlays(storageService.getTacticalPlays());

        const initialRoster = (game as any)['gameRoster'] || allPlayers.filter(p => p.status === 'ACTIVE').map(p => String(p.id));
        setGameRoster(initialRoster);

        // Fix: Properties now valid in updated Game type
        if (game.scoutingReport) setScoutData(game.scoutingReport);
        if (game.playerGrades) setPlayerGrades(game.playerGrades);
        
        if (game.callSheet && game.callSheet.length > 0) {
            setCallSheet(game.callSheet);
        } else {
            setCallSheet([
                { title: 'Openers (1st Drive)', plays: ['', '', '', ''] },
                { title: '3rd & Short (< 2yds)', plays: ['', '', ''] },
                { title: '3rd & Long (> 7yds)', plays: ['', '', ''] },
                { title: 'Red Zone / Goal Line', plays: ['', '', ''] },
                { title: 'Two Minute Drill', plays: ['', '', ''] }
            ]);
        }

        if (game.result) setActiveTab('GRADING');
        else setActiveTab('ROSTER');
    }
  }, [isOpen, game]);

  const handleSaveAll = () => {
      if(!game) return;
      const updatedGame: Game = {
          ...game,
          // Fix: scoutingReport, playerGrades, callSheet now valid in Game type
          scoutingReport: scoutData,
          playerGrades: playerGrades,
          callSheet: callSheet,
          // @ts-ignore
          gameRoster: gameRoster 
      };
      onSave(updatedGame);
      toast.success("Dados do jogo salvos com sucesso!");
  };

  const handleAiScout = async () => {
      if (!game) return;
      setIsAnalyzing(true);
      try {
          const context = `Time adversário: ${game.opponent}. Jogo em ${game.location}.`;
          const analysis = await analyzeOpponentTendencies(context);
          
          setScoutData({
              offenseAnalysis: analysis.summary || "Ataque balanceado com foco em corridas externas.",
              defenseAnalysis: "Defesa agressiva em descidas longas (Blitz freqüente).",
              keyPlayersToWatch: analysis.keysToVictory ? analysis.keysToVictory.join('\n') : "QB #12, LB #55",
              lastUpdate: new Date()
          });
          toast.success("Relatório preliminar gerado pela IA.");
      } catch (e) {
          toast.error("Erro ao gerar scout.");
      } finally {
          setIsAnalyzing(false);
      }
  };

  const togglePlayerInGame = (playerId: string) => {
      if (gameRoster.includes(playerId)) {
          setGameRoster(prev => prev.filter(id => id !== playerId));
      } else {
          setGameRoster(prev => [...prev, playerId]);
      }
  };

  const getUnitCount = (unit: string) => {
      return players
        .filter(p => gameRoster.includes(String(p.id)))
        .filter(p => {
             if (unit === 'OFF') return ['QB','RB','WR','TE','OL','LT','RT','C','LG','RG'].includes(p.position);
             if (unit === 'DEF') return ['DL','DE','DT','LB','CB','S','FS','SS'].includes(p.position);
             return ['K','P','LS'].includes(p.position);
        }).length;
  };

  const openPlayPicker = (sectionIdx: number, playIdx: number) => {
      setPickerTarget({ sectionIdx, playIdx });
      setIsPickerOpen(true);
  };

  const selectPlay = (playName: string) => {
      if (pickerTarget) {
          updateCallSheetPlay(pickerTarget.sectionIdx, pickerTarget.playIdx, playName);
          setIsPickerOpen(false);
          setPickerTarget(null);
      }
  };

  const updateCallSheetPlay = (sectionIdx: number, playIdx: number, val: string) => {
      const newSheet = [...callSheet];
      newSheet[sectionIdx].plays[playIdx] = val;
      setCallSheet(newSheet);
  };

  const addPlayToSection = (sectionIdx: number) => {
      const newSheet = [...callSheet];
      newSheet[sectionIdx].plays.push('');
      setCallSheet(newSheet);
  };

  const exportWristband = () => {
      const opponent = game?.opponent || 'OPPONENT';
      let tableRows = '';
      callSheet.forEach(section => {
          tableRows += `<tr class="section-header"><td colspan="2">${section.title}</td></tr>`;
          section.plays.forEach((play, i) => {
              if(play) {
                  tableRows += `<tr><td class="play-idx">${i+1}</td><td class="play-name">${play}</td></tr>`;
              }
          });
      });

      const htmlContent = `
        <html>
        <head>
            <title>Wristband - VS ${opponent}</title>
            <style>
                body { font-family: 'Arial', sans-serif; padding: 10px; font-size: 10px; }
                table { width: 100%; border-collapse: collapse; }
                th, td { border: 1px solid #000; padding: 2px 4px; }
                .section-header { background-color: #000; color: #fff; font-weight: bold; text-align: center; }
                .play-idx { width: 20px; text-align: center; font-weight: bold; background: #eee; }
                .play-name { font-weight: bold; }
                .header { text-align: center; font-weight: bold; margin-bottom: 5px; text-transform: uppercase; border-bottom: 2px solid black;}
            </style>
        </head>
        <body>
            <div style="width: 300px; border: 2px solid black;">
                <div class="header">VS ${opponent}</div>
                <table>${tableRows}</table>
            </div>
            <script>window.onload = function() { window.print(); }</script>
        </body>
        </html>
      `;
      const blob = new Blob([htmlContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const win = window.open(url, '_blank');
      win?.focus();
  };

  const handleGradeChange = (playerId: string | number, field: 'grade' | 'notes', value: any) => {
      setPlayerGrades(prev => {
          const existing = prev.find(p => String(p.playerId) === String(playerId));
          if (existing) {
              return prev.map(p => String(p.playerId) === String(playerId) ? { ...p, [field]: value } : p);
          } else {
              return [...prev, { playerId, grade: field === 'grade' ? value : 0, notes: field === 'notes' ? value : '' }];
          }
      });
  };

  const getGradeColor = (grade: number) => {
      if (grade >= 90) return 'text-green-400';
      if (grade >= 80) return 'text-blue-400';
      if (grade >= 70) return 'text-yellow-400';
      return 'text-red-400';
  };

  if (!game) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Game Prep: ${game.opponent.toUpperCase()}`} maxWidth="max-w-6xl">
        <div className="flex border-b border-white/10 mb-6 overflow-x-auto">
            <button onClick={() => setActiveTab('ROSTER')} className={`flex-1 min-w-[120px] py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'ROSTER' ? 'border-highlight text-highlight' : 'border-transparent text-text-secondary hover:text-white'}`}>
                1. Escalação (Roster)
            </button>
            <button onClick={() => setActiveTab('SCOUTING')} className={`flex-1 min-w-[120px] py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'SCOUTING' ? 'border-blue-500 text-blue-400' : 'border-transparent text-text-secondary hover:text-white'}`}>
                2. Scout & Análise
            </button>
            <button onClick={() => setActiveTab('CALL_SHEET')} className={`flex-1 min-w-[120px] py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'CALL_SHEET' ? 'border-yellow-500 text-yellow-400' : 'border-transparent text-text-secondary hover:text-white'}`}>
                3. Call Sheet
            </button>
            <button onClick={() => setActiveTab('GRADING')} className={`flex-1 min-w-[120px] py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'GRADING' ? 'border-green-500 text-green-400' : 'border-transparent text-text-secondary hover:text-white'}`}>
                4. Pós-Jogo (Notas)
            </button>
        </div>

        <div className="min-h-[400px] max-h-[60vh] overflow-y-auto custom-scrollbar pr-2 relative">
            
            {/* TAB: ROSTER */}
            {activeTab === 'ROSTER' && (
                <div className="space-y-4 animate-fade-in">
                    <div className="flex justify-between items-center bg-black/20 p-3 rounded-xl border border-white/10">
                        <div className="flex gap-4">
                            <div className="text-center">
                                <span className="text-xs text-text-secondary uppercase font-bold">Total</span>
                                <p className="text-xl font-bold text-white">{gameRoster.length}</p>
                            </div>
                            <div className="w-px bg-white/10"></div>
                            <div className="text-center">
                                <span className="text-xs text-text-secondary uppercase font-bold">Ataque</span>
                                <p className="text-xl font-bold text-blue-400">{getUnitCount('OFF')}</p>
                            </div>
                            <div className="text-center">
                                <span className="text-xs text-text-secondary uppercase font-bold">Defesa</span>
                                <p className="text-xl font-bold text-red-400">{getUnitCount('DEF')}</p>
                            </div>
                        </div>
                        <button onClick={() => setGameRoster(players.filter(p => p.status === 'ACTIVE').map(p => String(p.id)))} className="text-xs text-highlight hover:underline">
                            Selecionar Todos Ativos
                        </button>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {players.map(player => {
                            const isSelected = gameRoster.includes(String(player.id));
                            return (
                                <div 
                                    key={player.id} 
                                    onClick={() => togglePlayerInGame(String(player.id))}
                                    className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all select-none ${isSelected ? 'bg-green-900/20 border-green-500' : 'bg-secondary border-white/5 opacity-60'}`}
                                >
                                    <div className="relative">
                                        <LazyImage src={player.avatarUrl} className={`w-10 h-10 rounded-full ${isSelected ? '' : 'grayscale'}`} />
                                        {isSelected && <div className="absolute -bottom-1 -right-1 bg-green-500 text-black rounded-full p-0.5"><CheckCircleIcon className="w-3 h-3"/></div>}
                                    </div>
                                    <div>
                                        <p className={`font-bold text-sm ${isSelected ? 'text-white' : 'text-text-secondary'}`}>{player.name}</p>
                                        <p className="text-xs text-text-secondary">{player.position}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* TAB: SCOUTING */}
            {activeTab === 'SCOUTING' && (
                <div className="space-y-6 animate-fade-in">
                    <div className="flex justify-between items-center">
                        <h4 className="text-white font-bold flex items-center gap-2"><ShieldCheckIcon className="w-5 h-5"/> Relatório de Inteligência</h4>
                        <button 
                            onClick={handleAiScout} 
                            disabled={isAnalyzing}
                            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 shadow-lg disabled:opacity-50"
                        >
                            {isAnalyzing ? <span className="animate-spin">⚙️</span> : <SparklesIcon className="w-4 h-4" />}
                            {isAnalyzing ? 'Analisando...' : 'Gerar Scout com IA'}
                        </button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-xs font-bold text-blue-300 mb-2 uppercase">Análise do Ataque Adversário</label>
                            <textarea 
                                className="w-full h-40 bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:border-blue-500 focus:outline-none"
                                value={scoutData.offenseAnalysis}
                                onChange={(e) => setScoutData({...scoutData, offenseAnalysis: e.target.value})}
                                placeholder="Tendências, formações preferidas, playcalling..."
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-red-300 mb-2 uppercase">Análise da Defesa Adversária</label>
                            <textarea 
                                className="w-full h-40 bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:border-red-500 focus:outline-none"
                                value={scoutData.defenseAnalysis}
                                onChange={(e) => setScoutData({...scoutData, defenseAnalysis: e.target.value})}
                                placeholder="Fraquezas, blitz, coberturas..."
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-xs font-bold text-yellow-300 mb-2 uppercase">Jogadores Chave (Ameaças)</label>
                        <textarea 
                            className="w-full h-20 bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:border-yellow-500 focus:outline-none"
                            value={scoutData.keyPlayersToWatch}
                            onChange={(e) => setScoutData({...scoutData, keyPlayersToWatch: e.target.value})}
                        />
                    </div>
                </div>
            )}

            {/* TAB: CALL SHEET */}
            {activeTab === 'CALL_SHEET' && (
                <div className="space-y-6 animate-fade-in relative">
                    <div className="flex justify-between items-center bg-secondary p-3 rounded-lg border border-white/5 mb-4">
                        <p className="text-sm text-text-secondary">Preencha as jogadas prioritárias para cada situação.</p>
                        <button onClick={exportWristband} className="flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded text-xs font-bold transition-colors">
                            <PrinterIcon className="w-4 h-4" /> Imprimir Pulseira (QB)
                        </button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {callSheet.map((section, sIdx) => (
                            <Card key={sIdx} title={section.title} className="h-full">
                                <div className="space-y-2">
                                    {section.plays.map((play, pIdx) => (
                                        <div key={pIdx} className="flex gap-2">
                                            <div className="relative flex-1">
                                                <input 
                                                    className="w-full bg-black/20 border border-white/10 rounded px-2 py-1.5 text-sm text-white focus:border-highlight focus:outline-none pr-8"
                                                    placeholder={`Jogada ${pIdx + 1}`}
                                                    value={play}
                                                    onChange={(e) => updateCallSheetPlay(sIdx, pIdx, e.target.value)}
                                                />
                                                <button 
                                                    onClick={() => openPlayPicker(sIdx, pIdx)}
                                                    className="absolute right-1 top-1.5 text-text-secondary hover:text-highlight"
                                                    title="Selecionar do Playbook"
                                                >
                                                    <BookIcon className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                    <button onClick={() => addPlayToSection(sIdx)} className="text-xs text-highlight hover:text-white font-bold w-full text-left pt-1">
                                        + Linha
                                    </button>
                                </div>
                            </Card>
                        ))}
                    </div>

                    {/* PLAY PICKER OVERLAY */}
                    {isPickerOpen && (
                        <div className="absolute inset-0 bg-black/90 z-20 rounded-xl p-6 flex flex-col animate-fade-in">
                            <div className="flex justify-between items-center mb-4 border-b border-white/10 pb-2">
                                <h3 className="font-bold text-white flex items-center gap-2"><BookIcon className="w-5 h-5 text-highlight"/> Biblioteca Tática</h3>
                                <button onClick={() => setIsPickerOpen(false)}><XIcon className="w-6 h-6 text-white hover:text-red-500" /></button>
                            </div>
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 overflow-y-auto custom-scrollbar flex-1">
                                {tacticalPlays.length === 0 && <p className="col-span-full text-center text-text-secondary">Nenhuma jogada salva no Tactical Lab.</p>}
                                {tacticalPlays.map(play => (
                                    <button 
                                        key={play.id} 
                                        onClick={() => selectPlay(play.name)}
                                        className="bg-secondary p-3 rounded-lg border border-white/10 hover:border-highlight hover:bg-highlight/10 text-left transition-all group"
                                    >
                                        <p className="font-bold text-white group-hover:text-highlight text-sm truncate">{play.name}</p>
                                        <p className="text-[10px] text-text-secondary mt-1">{play.program || 'Geral'}</p>
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* TAB: GRADING */}
            {activeTab === 'GRADING' && (
                <div className="space-y-6 animate-fade-in">
                     <div className="flex justify-between items-center bg-secondary/30 p-4 rounded-xl border border-white/5">
                        <div>
                            <p className="text-sm text-text-secondary">Jogadores Avaliados</p>
                            <p className="text-2xl font-bold text-white">{playerGrades.length} <span className="text-sm font-normal text-text-secondary">/ {players.length}</span></p>
                        </div>
                        <div>
                            <p className="text-sm text-text-secondary">Média da Equipe</p>
                            <p className={`text-2xl font-bold ${playerGrades.length > 0 ? getGradeColor(playerGrades.reduce((a,b)=>a+b.grade,0)/playerGrades.length) : 'text-white'}`}>
                                {playerGrades.length > 0 ? (playerGrades.reduce((a,b)=>a+b.grade,0)/playerGrades.length).toFixed(1) : '--'}
                            </p>
                        </div>
                    </div>
                    <div className="space-y-3">
                         {gameRoster.map(id => {
                            const player = players.find(p => String(p.id) === id);
                            if(!player) return null;
                            const gradeData = playerGrades.find(g => String(g.playerId) === String(player.id));
                            return (
                                <div key={player.id} className="flex items-center gap-4 bg-secondary/20 p-2 rounded-lg border border-white/5">
                                    <div className="w-8 h-8 rounded-full bg-black/40 overflow-hidden shrink-0">
                                        <LazyImage src={player.avatarUrl} className="w-full h-full object-cover" />
                                    </div>
                                    <div className="w-32">
                                        <p className="text-xs font-bold text-white truncate">{player.name}</p>
                                        <p className="text-[10px] text-text-secondary">{player.position}</p>
                                    </div>
                                    <div className="flex gap-2 flex-1">
                                        <input 
                                            type="number" min="0" max="100" 
                                            placeholder="Nota"
                                            value={gradeData?.grade || ''}
                                            onChange={(e) => handleGradeChange(player.id, 'grade', Number(e.target.value))}
                                            className={`w-16 bg-black/30 border border-white/10 rounded p-1 text-center font-bold text-sm focus:outline-none ${getGradeColor(gradeData?.grade || 0)}`}
                                        />
                                        <input 
                                            type="text" 
                                            placeholder="Comentário..."
                                            value={gradeData?.notes || ''}
                                            onChange={(e) => handleGradeChange(player.id, 'notes', e.target.value)}
                                            className="flex-1 bg-black/30 border border-white/10 rounded p-1 text-sm text-white focus:border-highlight focus:outline-none"
                                        />
                                    </div>
                                </div>
                            );
                         })}
                    </div>
                </div>
            )}

        </div>

        <div className="flex justify-end pt-4 border-t border-white/10 mt-4">
            <button onClick={onClose} className="px-4 py-2 text-text-secondary hover:text-white mr-2">Cancelar</button>
            <button onClick={handleSaveAll} className="bg-highlight hover:bg-highlight-hover text-white px-8 py-2 rounded-lg font-bold shadow-lg">
                Salvar Tudo
            </button>
        </div>
    </Modal>
  );
};

export default GameManagementModal;