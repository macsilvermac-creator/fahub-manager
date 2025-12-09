
import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { Game, Player, GameScoutingReport, PlayerPerformance, CallSheetSection } from '../types';
import { storageService } from '../services/storageService';
import Card from './Card';
import { PrinterIcon } from './icons/UiIcons';
import LazyImage from '@/components/LazyImage';

interface GameManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  game: Game | null;
  onSave: (updatedGame: Game) => void;
}

const GameManagementModal: React.FC<GameManagementModalProps> = ({ isOpen, onClose, game, onSave }) => {
  const [activeTab, setActiveTab] = useState<'SCOUTING' | 'CALL_SHEET' | 'GRADING'>('SCOUTING');
  const [scoutData, setScoutData] = useState<GameScoutingReport>({
    offenseAnalysis: '',
    defenseAnalysis: '',
    keyPlayersToWatch: '',
    lastUpdate: new Date()
  });
  
  const [playerGrades, setPlayerGrades] = useState<PlayerPerformance[]>([]);
  const [callSheet, setCallSheet] = useState<CallSheetSection[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);

  useEffect(() => {
    if (isOpen && game) {
        setPlayers(storageService.getPlayers());
        if (game.scoutingReport) setScoutData(game.scoutingReport);
        if (game.playerGrades) setPlayerGrades(game.playerGrades);
        if (game.callSheet) {
            setCallSheet(game.callSheet);
        } else {
            // Default Template
            setCallSheet([
                { title: 'Openers (1st Drive)', plays: ['', '', ''] },
                { title: '3rd & Short (< 2yds)', plays: ['', ''] },
                { title: '3rd & Long (> 7yds)', plays: ['', ''] },
                { title: 'Red Zone / Goal Line', plays: ['', ''] },
                { title: 'Two Minute Drill', plays: ['', ''] }
            ]);
        }

        if (game.result) setActiveTab('GRADING');
        else setActiveTab('SCOUTING');
    }
  }, [isOpen, game]);

  const handleSaveScout = () => {
      if(!game) return;
      onSave({ ...game, scoutingReport: { ...scoutData, lastUpdate: new Date() } });
  };

  const handleSaveCallSheet = () => {
      if(!game) return;
      onSave({ ...game, callSheet: callSheet });
  };

  const exportWristband = () => {
      const settings = storageService.getTeamSettings();
      const sportMode = settings?.sportType || 'FULLPADS';

      let content = "QB WRISTBAND - " + (game?.opponent || 'OPPONENT') + "\n\n";
      callSheet.forEach(section => {
          content += `--- ${section.title} ---\n`;
          section.plays.forEach((play, i) => {
              if(play) content += `${i+1}. ${play}\n`;
          });
          content += "\n";
      });

      const blob = new Blob([content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Wristband_${sportMode}.txt`;
      a.click();
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

  const handleGradeChange = (playerId: number, field: 'grade' | 'notes', value: any) => {
      setPlayerGrades(prev => {
          const existing = prev.find(p => p.playerId === playerId);
          if (existing) {
              return prev.map(p => p.playerId === playerId ? { ...p, [field]: value } : p);
          } else {
              return [...prev, { playerId, grade: field === 'grade' ? value : 0, notes: field === 'notes' ? value : '' }];
          }
      });
  };

  const handleSaveGrades = () => {
      if(!game) return;
      onSave({ ...game, playerGrades: playerGrades });
  };

  const getGradeColor = (grade: number) => {
      if (grade >= 90) return 'text-green-400';
      if (grade >= 80) return 'text-blue-400';
      if (grade >= 70) return 'text-yellow-400';
      return 'text-red-400';
  };

  if (!game) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Gerenciar: VS ${game.opponent}`} maxWidth="max-w-6xl">
        <div className="flex border-b border-white/10 mb-6 overflow-x-auto">
            <button 
                onClick={() => setActiveTab('SCOUTING')}
                className={`flex-1 min-w-[120px] py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'SCOUTING' ? 'border-highlight text-highlight' : 'border-transparent text-text-secondary hover:text-white'}`}
            >
                Scout & Análise
            </button>
            <button 
                onClick={() => setActiveTab('CALL_SHEET')}
                className={`flex-1 min-w-[120px] py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'CALL_SHEET' ? 'border-highlight text-highlight' : 'border-transparent text-text-secondary hover:text-white'}`}
            >
                Call Sheet (Plano)
            </button>
            <button 
                onClick={() => setActiveTab('GRADING')}
                className={`flex-1 min-w-[120px] py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === 'GRADING' ? 'border-highlight text-highlight' : 'border-transparent text-text-secondary hover:text-white'}`}
            >
                Game Grading
            </button>
        </div>

        {activeTab === 'SCOUTING' && (
            <div className="space-y-6 animate-fade-in">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label className="block text-sm font-semibold text-text-secondary mb-2">Análise do Ataque Adversário</label>
                        <textarea 
                            className="w-full h-32 bg-primary border border-tertiary rounded-lg p-3 focus:border-highlight focus:outline-none"
                            placeholder="Ex: Tendências de passe, formações preferidas..."
                            value={scoutData.offenseAnalysis}
                            onChange={(e) => setScoutData({...scoutData, offenseAnalysis: e.target.value})}
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-text-secondary mb-2">Análise da Defesa Adversária</label>
                        <textarea 
                            className="w-full h-32 bg-primary border border-tertiary rounded-lg p-3 focus:border-highlight focus:outline-none"
                            placeholder="Ex: Fraquezas na secundária, blitz frequentes..."
                            value={scoutData.defenseAnalysis}
                            onChange={(e) => setScoutData({...scoutData, defenseAnalysis: e.target.value})}
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-semibold text-text-secondary mb-2">Jogadores Chave (Ameaças)</label>
                    <textarea 
                        className="w-full h-20 bg-primary border border-tertiary rounded-lg p-3 focus:border-highlight focus:outline-none"
                        placeholder="Ex: #12 QB (Móvel), #55 LB (Capitão)..."
                        value={scoutData.keyPlayersToWatch}
                        onChange={(e) => setScoutData({...scoutData, keyPlayersToWatch: e.target.value})}
                    />
                </div>
                <div className="flex justify-end">
                    <button onClick={handleSaveScout} className="bg-highlight hover:bg-highlight-hover text-white px-6 py-2 rounded-lg font-bold shadow-lg">
                        Salvar Relatório
                    </button>
                </div>
            </div>
        )}

        {activeTab === 'CALL_SHEET' && (
            <div className="space-y-6 animate-fade-in">
                <div className="flex justify-between items-center bg-blue-900/20 p-4 rounded-lg border border-blue-500/20 mb-4">
                    <p className="text-sm text-blue-200">
                        <strong>Estratégia de Jogo:</strong> Preencha as jogadas prioritárias para cada situação.
                    </p>
                    <button onClick={exportWristband} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded text-xs font-bold transition-colors">
                        <PrinterIcon className="w-4 h-4" /> Exportar Wristband
                    </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {callSheet.map((section, sIdx) => (
                        <Card key={sIdx} title={section.title} className="h-full">
                            <div className="space-y-2">
                                {section.plays.map((play, pIdx) => (
                                    <input 
                                        key={pIdx}
                                        className="w-full bg-black/20 border border-white/10 rounded px-2 py-1.5 text-sm text-white focus:border-highlight focus:outline-none"
                                        placeholder={`Jogada ${pIdx + 1}`}
                                        value={play}
                                        onChange={(e) => updateCallSheetPlay(sIdx, pIdx, e.target.value)}
                                    />
                                ))}
                                <button onClick={() => addPlayToSection(sIdx)} className="text-xs text-highlight hover:text-white font-bold w-full text-left pt-1">
                                    + Adicionar Linha
                                </button>
                            </div>
                        </Card>
                    ))}
                </div>
                
                <div className="flex justify-end pt-4 border-t border-white/10">
                     <button onClick={handleSaveCallSheet} className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-bold shadow-lg">
                        Salvar Call Sheet
                    </button>
                </div>
            </div>
        )}

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

                <div className="max-h-[500px] overflow-y-auto pr-2 custom-scrollbar space-y-3">
                    {players.sort((a,b) => a.name.localeCompare(b.name)).map(player => {
                        const gradeData = playerGrades.find(g => g.playerId === player.id);
                        const grade = gradeData?.grade || 0;
                        const notes = gradeData?.notes || '';

                        return (
                            <div key={player.id} className="flex flex-col md:flex-row items-center gap-4 bg-secondary/20 p-3 rounded-lg border border-white/5">
                                <div className="flex items-center gap-3 w-full md:w-1/4">
                                    <LazyImage src={player.avatarUrl} className="w-10 h-10 rounded-full" />
                                    <div>
                                        <p className="font-bold text-white text-sm">{player.name}</p>
                                        <p className="text-xs text-text-secondary">{player.position} #{player.jerseyNumber}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4 w-full md:w-3/4">
                                    <div className="flex flex-col w-24">
                                        <label className="text-[10px] text-text-secondary uppercase">Nota (0-100)</label>
                                        <input 
                                            type="number" min="0" max="100" value={grade}
                                            onChange={(e) => handleGradeChange(player.id, 'grade', Number(e.target.value))}
                                            className={`bg-black/20 border border-white/10 rounded p-1 text-center font-bold focus:outline-none ${getGradeColor(grade)}`}
                                        />
                                    </div>
                                    <div className="flex flex-col flex-1">
                                        <label className="text-[10px] text-text-secondary uppercase">Feedback</label>
                                        <input 
                                            type="text" value={notes}
                                            onChange={(e) => handleGradeChange(player.id, 'notes', e.target.value)}
                                            placeholder="Comentários sobre a performance..."
                                            className="bg-black/20 border border-white/10 rounded p-1 text-sm text-text-primary focus:outline-none focus:border-highlight"
                                        />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
                <div className="flex justify-end pt-4 border-t border-white/10">
                    <button onClick={handleSaveGrades} className="bg-highlight hover:bg-highlight-hover text-white px-6 py-2 rounded-lg font-bold shadow-lg">
                        Salvar Avaliações
                    </button>
                </div>
            </div>
        )}
    </Modal>
  );
};

export default GameManagementModal;
