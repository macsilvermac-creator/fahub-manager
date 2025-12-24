
import React, { useState, useContext, useEffect } from 'react';
import Modal from './Modal';
import { Player, DevelopmentPlan } from '../types';
import { UserContext } from './Layout';
// Fix: Correct exported member name from geminiService
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
  const [activeTab, setActiveTab] = useState<'OVERVIEW' | 'AI_PERFORMANCE'>('OVERVIEW');
  const [aiAnalysis, setAiAnalysis] = useState<string>('');
  const [isLoadingAi, setIsLoadingAi] = useState(false);
  
  const isStaff = currentRole !== 'PLAYER';

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
        const analysis = await generatePlayerAnalysis(player, `Rating ${player.rating}`);
        setAiAnalysis(analysis);
      } catch (e) {
        console.error("Erro na análise IA", e);
      } finally {
        setIsLoadingAi(false);
      }
  };

  const handleSavePlan = () => {
      if (!aiAnalysis) return;
      const newPlan: DevelopmentPlan = {
          id: Date.now().toString(),
          playerId: player.id,
          title: `PDI - ${new Date().toLocaleDateString()}`,
          generatedContent: aiAnalysis,
          createdAt: new Date(),
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
      onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Dossiê do Atleta" maxWidth="max-w-4xl">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-1/3 space-y-4">
          <div className="bg-secondary p-4 rounded-xl border border-white/5 flex flex-col items-center">
             <LazyImage src={player.avatarUrl} className="w-32 h-32 rounded-full object-cover border-4 border-primary mb-4" fallbackText={player.name} />
             <h3 className="text-xl font-black text-white uppercase italic">{player.name}</h3>
             <p className="text-highlight font-black">#{player.jerseyNumber} • {player.position}</p>
          </div>
          <div className="grid grid-cols-2 gap-2 text-center">
             <div className="bg-black/20 p-2 rounded-lg border border-white/5">
                 <span className="text-[8px] text-text-secondary uppercase font-bold">Rating</span>
                 <p className="text-xl font-black text-white">{player.rating}</p>
             </div>
             <div className="bg-black/20 p-2 rounded-lg border border-white/5">
                 <span className="text-[8px] text-text-secondary uppercase font-bold">Nível</span>
                 <p className="text-xl font-black text-white">{player.level}</p>
             </div>
          </div>
        </div>

        <div className="flex-1">
            <div className="flex gap-4 border-b border-white/10 mb-4 overflow-x-auto no-scrollbar">
                <button onClick={() => setActiveTab('OVERVIEW')} className={`pb-3 text-xs font-bold uppercase tracking-widest ${activeTab === 'OVERVIEW' ? 'border-b-2 border-highlight text-highlight' : 'text-text-secondary'}`}>Métricas</button>
                <button onClick={() => setActiveTab('AI_PERFORMANCE')} className={`pb-3 text-xs font-bold uppercase tracking-widest flex items-center gap-2 ${activeTab === 'AI_PERFORMANCE' ? 'border-b-2 border-cyan-400 text-cyan-400' : 'text-text-secondary'}`}><SparklesIcon className="w-3 h-3"/> IA Review</button>
            </div>

            {activeTab === 'OVERVIEW' && (
                <div className="space-y-4 animate-fade-in">
                    <div className="bg-black/20 p-4 rounded-xl border border-white/5">
                        <h4 className="text-xs font-bold text-white uppercase mb-4 tracking-widest">Biometria</h4>
                        <div className="grid grid-cols-2 gap-6 text-sm">
                            <p className="text-text-secondary">Altura: <span className="text-white font-bold">{player.height}</span></p>
                            <p className="text-text-secondary">Peso: <span className="text-white font-bold">{player.weight} lbs</span></p>
                            <p className="text-text-secondary">Status: <span className="text-green-400 font-bold">{player.status}</span></p>
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'AI_PERFORMANCE' && (
                <div className="space-y-4 animate-fade-in">
                    {!aiAnalysis ? (
                        <div className="text-center py-12">
                             <SparklesIcon className="w-12 h-12 text-cyan-400 mx-auto mb-4 opacity-30" />
                             <button 
                                onClick={handleGenerateAnalysis} 
                                disabled={isLoadingAi}
                                className="bg-cyan-600 hover:bg-cyan-500 text-white px-6 py-2 rounded-xl font-black text-xs uppercase shadow-glow"
                             >
                                {isLoadingAi ? 'Sincronizando...' : 'Gerar Relatório de Evolução'}
                             </button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="bg-primary p-5 rounded-xl border border-cyan-500/30 text-xs text-text-secondary leading-relaxed whitespace-pre-wrap font-medium">
                                {aiAnalysis}
                            </div>
                            {isStaff && (
                                <button onClick={handleSavePlan} className="w-full bg-green-600 hover:bg-green-500 text-white py-3 rounded-xl font-black uppercase text-xs">
                                    Ativar Plano de Ação
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
