
import React, { useState, useContext, useEffect } from 'react';
import Modal from './Modal';
import { Player, DevelopmentPlan } from '../types';
import { UserContext } from './Layout';
import { generatePlayerAnalysis } from '../services/geminiService';
import { SparklesIcon } from './icons/UiIcons';
import { storageService } from '../services/storageService';
import LazyImage from './LazyImage';

interface PlayerDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  player: Player | null;
}

const PlayerDetailsModal: React.FC<PlayerDetailsModalProps> = ({ isOpen, onClose, player }) => {
  const { currentRole } = useContext(UserContext);
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'SCOUTING' | 'MEDICAL' | 'AI_PERFORMANCE'>('OVERVIEW');
  const [aiAnalysis, setAiAnalysis] = useState<string>('');
  const [isLoadingAi, setIsLoadingAi] = useState(false);
  
  const isStaff = currentRole !== 'PLAYER';
  const isMedicalOrHC = (currentRole as string) === 'MEDICAL_STAFF' || currentRole === 'HEAD_COACH' || currentRole === 'MASTER';

  useEffect(() => {
    if (isOpen) {
      setAiAnalysis('');
      setActiveTab('OVERVIEW');
    }
  }, [isOpen, player]);

  if (!player) return null;

  const handleGenerateAnalysis = async () => {
      setIsLoadingAi(true);
      try {
        const games = storageService.getGames();
        const performanceContext = `Atleta com nota OVR ${player.rating}. Jogos recentes: ${games.length} registrados.`;
        const analysis = await generatePlayerAnalysis(player, performanceContext);
        setAiAnalysis(analysis);
      } catch (e) {
        console.error("Erro na análise IA", e);
      } finally {
        setIsLoadingAi(false);
      }
  };

  const handleSavePlan = () => {
      if (!aiAnalysis) return;
      const deadline = new Date();
      deadline.setDate(deadline.getDate() + 30);

      const newPlan: DevelopmentPlan = {
          id: Date.now().toString(),
          playerId: player.id,
          title: `PDI - ${new Date().toLocaleDateString()}`,
          generatedContent: aiAnalysis,
          createdAt: new Date(),
          deadline: deadline,
          status: 'ACTIVE'
      };

      const allPlayers = storageService.getPlayers();
      const updatedPlayers = allPlayers.map(p => {
          if (p.id === player.id) {
              return { ...p, developmentPlans: [newPlan, ...(p.developmentPlans || [])] };
          }
          return p;
      });
      storageService.savePlayers(updatedPlayers);
      setAiAnalysis('');
      onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Prontuário & Performance" maxWidth="max-w-5xl">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-1/3 space-y-4">
          <div className="bg-secondary p-4 rounded-xl border border-white/5 flex flex-col items-center">
             <LazyImage src={player.avatarUrl} className="w-32 h-32 rounded-full object-cover border-4 border-primary mb-4" fallbackText={player.name} />
             <h3 className="text-xl font-bold text-white uppercase">{player.name}</h3>
             <p className="text-highlight font-black">#{player.jerseyNumber} • {player.position}</p>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-black/20 p-3 rounded-lg text-center">
               <span className="text-[10px] text-text-secondary uppercase">Rating</span>
               <p className="text-xl font-black text-white">{player.rating}</p>
            </div>
            <div className="bg-black/20 p-3 rounded-lg text-center">
               <span className="text-[10px] text-text-secondary uppercase">Level</span>
               <p className="text-xl font-black text-white">{player.level}</p>
            </div>
          </div>
        </div>

        <div className="flex-1">
            <div className="flex border-b border-white/10 mb-4 overflow-x-auto">
                <button onClick={() => setActiveTab('OVERVIEW')} className={`px-4 py-2 text-xs font-bold whitespace-nowrap ${activeTab === 'OVERVIEW' ? 'border-b-2 border-highlight text-highlight' : 'text-text-secondary'}`}>Overview</button>
                <button onClick={() => setActiveTab('AI_PERFORMANCE')} className={`px-4 py-2 text-xs font-bold whitespace-nowrap flex items-center gap-2 ${activeTab === 'AI_PERFORMANCE' ? 'border-b-2 border-cyan-400 text-cyan-400' : 'text-text-secondary'}`}><SparklesIcon className="w-3 h-3"/> PDI (IA)</button>
                {isMedicalOrHC && <button onClick={() => setActiveTab('MEDICAL')} className={`px-4 py-2 text-xs font-bold whitespace-nowrap ${activeTab === 'MEDICAL' ? 'border-b-2 border-red-400 text-red-400' : 'text-text-secondary'}`}>Saúde</button>}
            </div>

            {activeTab === 'OVERVIEW' && (
                <div className="space-y-4 animate-fade-in">
                    <p className="text-sm text-text-secondary">Dados físicos e métricas de temporada...</p>
                    <div className="bg-black/20 p-4 rounded-xl border border-white/5">
                        <h4 className="text-xs font-bold text-white uppercase mb-2">Medidas Oficiais</h4>
                        <div className="grid grid-cols-2 gap-4">
                            <p className="text-sm">Altura: <span className="text-white font-bold">{player.height}</span></p>
                            <p className="text-sm">Peso: <span className="text-white font-bold">{player.weight} lbs</span></p>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'AI_PERFORMANCE' && (
                <div className="space-y-4 animate-fade-in">
                    {!aiAnalysis ? (
                        <div className="text-center py-8">
                             <SparklesIcon className="w-12 h-12 text-cyan-400 mx-auto mb-4 opacity-50" />
                             <h4 className="text-white font-bold">Plano de Desenvolvimento Individual</h4>
                             <p className="text-xs text-text-secondary mb-6">Gere uma análise técnica e física baseada nos dados do atleta.</p>
                             <button 
                                onClick={handleGenerateAnalysis} 
                                disabled={isLoadingAi}
                                className="bg-cyan-600 hover:bg-cyan-500 text-white px-6 py-2 rounded-lg font-bold text-sm disabled:opacity-50"
                             >
                                {isLoadingAi ? 'Consultando Coach Virtual...' : 'Gerar PDI com IA'}
                             </button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="bg-primary p-4 rounded-xl border border-cyan-500/30 text-sm text-text-secondary leading-relaxed whitespace-pre-wrap">
                                {aiAnalysis}
                            </div>
                            {isStaff && (
                                <button onClick={handleSavePlan} className="w-full bg-green-600 hover:bg-green-500 text-white py-2 rounded-lg font-bold">
                                    Aprovar e Ativar Plano
                                </button>
                            )}
                        </div>
                    )}
                </div>
            )}
        </div>
      </div>
    </Modal>
  );
};

export default PlayerDetailsModal;