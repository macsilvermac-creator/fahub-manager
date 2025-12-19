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
  
  const [tacticalPlays, setTacticalPlays] = useState<TacticalPlay[]>([]);
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [pickerTarget, setPickerTarget] = useState<{sectionIdx: number, playIdx: number} | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  useEffect(() => {
    if (isOpen && game) {
        const allPlayers = storageService.getPlayers();
        setPlayers(allPlayers);
        setTacticalPlays(storageService.getTacticalPlays());
        const initialRoster = (game as any)['gameRoster'] || allPlayers.filter(p => p.status === 'ACTIVE').map(p => String(p.id));
        setGameRoster(initialRoster);

        if (game.scoutingReport) setScoutData(game.scoutingReport);
        if (game.playerGrades) setPlayerGrades(game.playerGrades);
        
        if (game.callSheet && game.callSheet.length > 0) {
            setCallSheet(game.callSheet);
        } else {
            setCallSheet([
                { title: 'Openers', plays: ['', '', '', ''] },
                { title: '3rd Down', plays: ['', '', ''] },
                { title: 'Red Zone', plays: ['', '', ''] }
            ]);
        }
    }
  }, [isOpen, game]);

  const handleSaveAll = () => {
      if(!game) return;
      const updatedGame = {
          ...game,
          scoutingReport: scoutData,
          callSheet: callSheet,
          playerGrades: playerGrades,
          gameRoster: gameRoster 
      };
      onSave(updatedGame as Game);
      toast.success("Salvo!");
  };

  const togglePlayerInGame = (playerId: string) => {
      setGameRoster(prev => prev.includes(playerId) ? prev.filter(id => id !== playerId) : [...prev, playerId]);
  };

  if (!game) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Game Prep: ${game.opponent}`} maxWidth="max-w-6xl">
        <div className="flex border-b border-white/10 mb-6 overflow-x-auto">
            <button onClick={() => setActiveTab('ROSTER')} className={`flex-1 py-3 text-sm font-bold border-b-2 ${activeTab === 'ROSTER' ? 'border-highlight text-highlight' : 'border-transparent text-text-secondary'}`}>Escalação</button>
            <button onClick={() => setActiveTab('SCOUTING')} className={`flex-1 py-3 text-sm font-bold border-b-2 ${activeTab === 'SCOUTING' ? 'border-highlight text-highlight' : 'border-transparent text-text-secondary'}`}>Scout</button>
            <button onClick={() => setActiveTab('CALL_SHEET')} className={`flex-1 py-3 text-sm font-bold border-b-2 ${activeTab === 'CALL_SHEET' ? 'border-highlight text-highlight' : 'border-transparent text-text-secondary'}`}>Call Sheet</button>
        </div>

        <div className="max-h-[60vh] overflow-y-auto custom-scrollbar p-2">
            {activeTab === 'ROSTER' && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 animate-fade-in">
                    {players.map(player => (
                        <div key={player.id} onClick={() => togglePlayerInGame(String(player.id))} className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer ${gameRoster.includes(String(player.id)) ? 'bg-green-900/20 border-green-500' : 'bg-secondary border-white/5 opacity-60'}`}>
                            <LazyImage src={player.avatarUrl} className="w-10 h-10 rounded-full" />
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-bold text-white truncate">{player.name}</p>
                                <p className="text-[10px] text-text-secondary">{player.position}</p>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {activeTab === 'SCOUTING' && (
                <div className="space-y-4 animate-fade-in">
                    <textarea className="w-full bg-black/20 border border-white/10 rounded p-2 text-white h-32" value={scoutData.offenseAnalysis} onChange={e => setScoutData({...scoutData, offenseAnalysis: e.target.value})} placeholder="Análise de Ataque..." />
                    <textarea className="w-full bg-black/20 border border-white/10 rounded p-2 text-white h-32" value={scoutData.defenseAnalysis} onChange={e => setScoutData({...scoutData, defenseAnalysis: e.target.value})} placeholder="Análise de Defesa..." />
                </div>
            )}
        </div>

        <div className="flex justify-end pt-4 border-t border-white/10 mt-4">
            <button onClick={handleSaveAll} className="bg-highlight px-8 py-2 rounded-lg font-bold text-white shadow-lg">Salvar Prep</button>
        </div>
    </Modal>
  );
};

export default GameManagementModal;