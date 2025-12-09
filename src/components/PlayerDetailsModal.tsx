
import React, { useState, useContext } from 'react';
import Modal from './Modal';
import { Player, DevelopmentPlan } from '../types';
import { UserContext } from './Layout';
import { generatePlayerAnalysis } from '../services/geminiService';
import { SparklesIcon } from './icons/UiIcons';
import { storageService } from '../services/storageService';
import LazyImage from '@/components/LazyImage';

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
  const [planFeedback, setPlanFeedback] = useState('');
  
  const isStaff = currentRole !== 'PLAYER';
  const isMedicalOrHC = currentRole === 'MEDICAL_STAFF' || currentRole === 'HEAD_COACH';

  if (!player) return null;

  const getMockSeasonStats = (player: Player) => {
    const seed = player.id;
    if (['QB'].includes(player.position)) {
      return [
        { label: 'Jardas', value: 1800 + (seed * 50) },
        { label: 'TDs', value: 15 + (seed % 5) },
        { label: 'INTs', value: 3 + (seed % 3) },
        { label: 'QBR', value: 92.4 + (seed % 10) },
      ];
    } else if (['RB', 'WR', 'TE'].includes(player.position)) {
        return [
        { label: 'Jardas', value: 700 + (seed * 30) },
        { label: 'TDs', value: 6 + (seed % 4) },
        { label: 'Recepções', value: 40 + (seed * 2) },
        { label: 'YAC', value: 200 + (seed * 10) },
      ];
    } else {
       return [
        { label: 'Tackles', value: 40 + seed },
        { label: 'Sacks', value: seed % 5 },
        { label: 'Ints', value: seed % 2 },
        { label: 'FF', value: seed % 3 },
      ];
    }
  };

  const stats = getMockSeasonStats(player);

  const getStatusColor = (status: string) => {
      switch(status) {
          case 'ACTIVE': return 'bg-green-500';
          case 'QUESTIONABLE': return 'bg-yellow-500';
          case 'DOUBTFUL': return 'bg-orange-500';
          case 'IR': return 'bg-red-500';
          case 'SUSPENDED': return 'bg-gray-500';
          default: return 'bg-gray-500';
      }
  };

  const getStatusLabel = (status: string) => {
      switch(status) {
          case 'ACTIVE': return 'Ativo';
          case 'QUESTIONABLE': return 'Questionável';
          case 'DOUBTFUL': return 'Duvidoso';
          case 'IR': return 'Lesionado (IR)';
          case 'SUSPENDED': return 'Suspenso';
          default: return status;
      }
  };

  const handleGenerateAnalysis = async () => {
      setIsLoadingAi(true);

      const games = storageService.getGames();
      const playerGames = games.filter(g => g.playerGrades?.some(pg => pg.playerId === player.id));
      
      const performanceContext = playerGames.length > 0 
        ? playerGames.map(g => {
            const grade = g.playerGrades?.find(pg => pg.playerId === player.id);
            return `- vs ${g.opponent}: Nota ${grade?.grade} (${grade?.notes})`;
          }).join('\n')
        : 'Sem registros de jogos recentes.';

      const analysis = await generatePlayerAnalysis(player, performanceContext);
      setAiAnalysis(analysis);
      setIsLoadingAi(false);
  };

  const handleSavePlan = () => {
      if (!aiAnalysis) return;
      
      const deadline = new Date();
      deadline.setDate(deadline.getDate() + 28); 

      const newPlan: DevelopmentPlan = {
          id: Date.now().toString(),
          playerId: player.id,
          title: `PDI - Ciclo ${new Date().toLocaleDateString('pt-BR', {month: 'short'})}`,
          generatedContent: aiAnalysis,
          createdAt: new Date(),
          deadline: deadline,
          status: 'ACTIVE'
      };

      const allPlayers = storageService.getPlayers();
      const updatedPlayers = allPlayers.map(p => {
          if (p.id === player.id) {
              const currentPlans = p.developmentPlans || [];
              return { ...p, developmentPlans: [newPlan, ...currentPlans] };
          }
          return p;
      });
      storageService.savePlayers(updatedPlayers);
      
      player.developmentPlans = [newPlan, ...(player.developmentPlans || [])];
      setAiAnalysis(''); 
  };

  const handleCompletePlan = (planId: string) => {
      const allPlayers = storageService.getPlayers();
      const updatedPlayers = allPlayers.map(p => {
          if (p.id === player.id) {
              const currentPlans = p.developmentPlans || [];
              const updatedPlans = currentPlans.map(plan => 
                  plan.id === planId ? { ...plan, status: 'COMPLETED' as const, coachFeedback: planFeedback } : plan
              );
              return { ...p, developmentPlans: updatedPlans };
          }
          return p;
      });
      storageService.savePlayers(updatedPlayers);
      
       if(player.developmentPlans) {
           player.developmentPlans = player.developmentPlans.map(plan => 
             plan.id === planId ? { ...plan, status: 'COMPLETED', coachFeedback: planFeedback } : plan
           );
       }
       setPlanFeedback('');
  };

  const formattedAnalysis = (content: string) => content.replace(/(\*\*|###|##|#)(.*?)\1/g, (match, p1, p2) => {
    if (p1 === '**') return `<strong class="text-highlight">${p2}</strong>`;
    if (p1 === '###' || p1 === '##') return `<h3 class="text-lg font-semibold mt-4 mb-2 text-white">${p2}</h3>`;
    return match;
  }).replace(/\* (.*?)\n/g, '<li class="ml-5 list-disc text-text-secondary">$1</li>');


  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Prontuário & Performance" maxWidth="max-w-6xl">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/4 flex flex-col">
          <div className="bg-secondary/40 rounded-xl p-6 border border-white/5 flex flex-col items-center relative overflow-hidden">
             <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-bold text-white uppercase tracking-wider flex items-center gap-2 ${getStatusColor(player.status)} shadow-lg`}>
                <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
                {getStatusLabel(player.status)}
             </div>

             <div className="relative group mt-4">
                 <div className="absolute inset-0 bg-gradient-to-br from-highlight to-purple-500 rounded-full blur opacity-40 group-hover:opacity-60 transition-opacity"></div>
                 <LazyImage 
                    src={player.avatarUrl} 
                    alt={player.name} 
                    className="w-40 h-40 rounded-full object-cover border-4 border-secondary relative z-10 shadow-2xl" 
                 />
                 <div className="absolute -bottom-4 -right-4 bg-secondary text-white font-black text-3xl px-3 py-1 rounded-xl border border-white/10 shadow-xl z-20">
                     #{player.jerseyNumber}
                 </div>
             </div>
             
             <div className="mt-8 text-center w-full">
                <h2 className="text-xl font-bold text-text-primary">{player.name}</h2>
                <p className="text-highlight font-medium text-sm">{player.position} • {player.class}</p>
                
                <div className="flex justify-center gap-4 mt-4 text-xs text-text-secondary">
                    <div>
                        <span className="block font-bold text-white">{player.height}</span>
                        <span>Altura</span>
                    </div>
                    <div className="w-px bg-white/10"></div>
                    <div>
                        <span className="block font-bold text-white">{player.weight} lbs</span>
                        <span>Peso</span>
                    </div>
                    <div className="w-px bg-white/10"></div>
                    <div>
                        <span className="block font-bold text-white">{player.rating}</span>
                        <span>OVR</span>
                    </div>
                </div>
             </div>
          </div>
          
          <div className="mt-4 bg-secondary/20 p-4 rounded-xl border border-white/5">
              <h4 className="text-xs text-text-secondary uppercase font-bold mb-2">Hierarquia</h4>
              <div className="flex justify-between items-center">
                  <span className="text-sm text-white">Depth Chart</span>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded ${player.depthChartOrder === 1 ? 'bg-highlight/20 text-highlight' : 'bg-white/10 text-text-secondary'}`}>
                      {player.depthChartOrder === 1 ? '1st Team' : player.depthChartOrder === 2 ? '2nd Team' : '3rd Team'}
                  </span>
              </div>
          </div>
        </div>

        <div className="md:w-3/4 flex flex-col">
            <div className="flex border-b border-white/10 mb-6 overflow-x-auto">
                <button 
                    onClick={() => setActiveTab('OVERVIEW')}
                    className={`px-4 py-3 text-xs md:text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${activeTab === 'OVERVIEW' ? 'border-highlight text-highlight' : 'border-transparent text-text-secondary hover:text-white'}`}
                >
                    Visão Geral
                </button>
                <button 
                    onClick={() => setActiveTab('SCOUTING')}
                    className={`px-4 py-3 text-xs md:text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${activeTab === 'SCOUTING' ? 'border-highlight text-highlight' : 'border-transparent text-text-secondary hover:text-white'}`}
                >
                    Scout & Físico
                </button>
                {isMedicalOrHC && (
                    <button 
                        onClick={() => setActiveTab('MEDICAL')}
                        className={`px-4 py-3 text-xs md:text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${activeTab === 'MEDICAL' ? 'border-red-500 text-red-400' : 'border-transparent text-text-secondary hover:text-white'}`}
                    >
                        Saúde & Mente
                    </button>
                )}
                
                <button 
                    onClick={() => setActiveTab('AI_PERFORMANCE')}
                    className={`flex items-center gap-2 px-4 py-3 text-xs md:text-sm font-bold border-b-2 transition-colors whitespace-nowrap ${activeTab === 'AI_PERFORMANCE' ? 'border-cyan-500 text-cyan-400' : 'border-transparent text-text-secondary hover:text-white'}`}
                >
                    <SparklesIcon className="w-4 h-4" />
                    IA Performance
                </button>
            </div>

            {activeTab === 'OVERVIEW' && (
                <div className="space-y-6 animate-fade-in">
                    <div>
                        <h4 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-3">Estatísticas da Temporada</h4>
                        <div className="grid grid-cols-4 gap-4">
                            {stats.map((stat, idx) => (
                                <div key={idx} className="bg-secondary/40 p-3 rounded-lg border border-white/5 text-center">
                                    <p className="text-xs text-text-secondary uppercase mb-1">{stat.label}</p>
                                    <p className="text-xl font-bold text-white">{stat.value}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-secondary/30 p-5 rounded-xl border border-white/5">
                        <div className="flex justify-between items-center mb-4">
                            <h4 className="text-sm font-semibold text-text-secondary uppercase tracking-wider">Progresso do Jogador</h4>
                            <span className="text-xs font-bold text-highlight">Nível {player.level}</span>
                        </div>
                        <div className="h-3 w-full bg-black/40 rounded-full overflow-hidden border border-white/5 mb-2">
                            <div className="h-full bg-gradient-to-r from-highlight to-green-400" style={{ width: `${player.xp}%` }}></div>
                        </div>
                        <div className="flex flex-wrap gap-2 mt-4">
                            {player.badges && player.badges.map((badge, idx) => (
                                <span key={idx} className="text-xs px-2 py-1 bg-white/5 border border-white/10 rounded-full text-text-secondary">
                                    {badge}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'SCOUTING' && (
                <div className="space-y-6 animate-fade-in">
                     <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        <div className="bg-secondary/40 p-4 rounded-xl border border-white/5 flex flex-col items-center justify-center hover:bg-secondary/60 transition-colors">
                            <span className="text-3xl font-black text-white">{player.combineStats?.fortyYards?.toFixed(2) || '--'}</span>
                            <span className="text-xs text-text-secondary font-bold uppercase mt-1">40 Jardas (s)</span>
                        </div>
                        
                        <div className="bg-secondary/40 p-4 rounded-xl border border-white/5 flex flex-col items-center justify-center hover:bg-secondary/60 transition-colors">
                            <span className="text-3xl font-black text-white">{player.combineStats?.benchPress || '--'}</span>
                            <span className="text-xs text-text-secondary font-bold uppercase mt-1">Supino (Reps)</span>
                        </div>

                        <div className="bg-secondary/40 p-4 rounded-xl border border-white/5 flex flex-col items-center justify-center hover:bg-secondary/60 transition-colors">
                            <span className="text-3xl font-black text-white">{player.combineStats?.verticalJump || '--'}</span>
                            <span className="text-xs text-text-secondary font-bold uppercase mt-1">Vertical (in)</span>
                        </div>

                         <div className="bg-secondary/40 p-4 rounded-xl border border-white/5 flex flex-col items-center justify-center hover:bg-secondary/60 transition-colors">
                            <span className="text-3xl font-black text-white">{player.combineStats?.broadJump || '--'}</span>
                            <span className="text-xs text-text-secondary font-bold uppercase mt-1">Broad Jump (in)</span>
                        </div>

                        <div className="bg-secondary/40 p-4 rounded-xl border border-white/5 flex flex-col items-center justify-center hover:bg-secondary/60 transition-colors">
                            <span className="text-3xl font-black text-white">{player.combineStats?.shuttle?.toFixed(2) || '--'}</span>
                            <span className="text-xs text-text-secondary font-bold uppercase mt-1">Shuttle (s)</span>
                        </div>
                     </div>

                     <div className="bg-blue-900/20 p-4 rounded-xl border border-blue-500/20">
                         <h5 className="text-sm font-bold text-highlight mb-2">Análise do Scout</h5>
                         <p className="text-sm text-text-secondary leading-relaxed">
                             Este atleta demonstra métricas físicas {player.rating > 85 ? 'de elite' : 'sólidas'} para a posição de {player.position}. 
                             {player.combineStats?.fortyYards && player.combineStats.fortyYards < 4.5 ? ' Sua velocidade é um diferencial competitivo claro.' : ''}
                             {player.combineStats?.benchPress && player.combineStats.benchPress > 20 ? ' Possui força superior para ganhar disputas na linha de scrimmage.' : ''}
                         </p>
                     </div>
                </div>
            )}

            {activeTab === 'MEDICAL' && (
                <div className="space-y-6 animate-fade-in">
                    <div className="bg-red-900/10 border border-red-500/20 rounded-lg p-4 mb-4">
                        <p className="text-xs text-red-400 font-bold uppercase flex items-center gap-2">
                             🔒 Área Confidencial - Acesso Restrito a Staff Médico
                        </p>
                    </div>

                    <div className="flex justify-between items-center">
                        <h4 className="font-bold text-white">Histórico Clínico e Psicológico</h4>
                        <button className="text-xs bg-secondary hover:bg-white/10 px-3 py-1.5 rounded border border-white/10 transition-colors">
                            + Novo Registro
                        </button>
                    </div>

                    <div className="space-y-4">
                        {player.medicalReports && player.medicalReports.length > 0 ? (
                            player.medicalReports.map(report => (
                                <div key={report.id} className={`p-4 rounded-xl border-l-4 ${report.type === 'PSYCHOLOGICAL' ? 'bg-indigo-900/20 border-l-indigo-500' : 'bg-secondary border-l-red-500'}`}>
                                    <div className="flex justify-between items-start mb-2">
                                        <div>
                                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase mr-2 ${report.type === 'PSYCHOLOGICAL' ? 'bg-indigo-500 text-white' : 'bg-red-500 text-white'}`}>
                                                {report.type === 'PSYCHOLOGICAL' ? 'Psicológico' : 'Médico/Físico'}
                                            </span>
                                            <span className="text-sm font-bold text-white">{report.title}</span>
                                        </div>
                                        <span className="text-xs text-text-secondary">{new Date(report.date).toLocaleDateString()}</span>
                                    </div>
                                    <p className="text-sm text-text-secondary leading-relaxed">{report.content}</p>
                                    <div className="mt-2 text-[10px] text-text-secondary opacity-60">
                                        Assinado por: {report.author}
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-text-secondary text-center py-8 italic bg-secondary/20 rounded-xl">
                                Nenhum registro médico ou psicológico encontrado.
                            </p>
                        )}
                    </div>
                </div>
            )}

            {activeTab === 'AI_PERFORMANCE' && (
                <div className="space-y-6 animate-fade-in h-full flex flex-col">
                    
                    {isStaff && !aiAnalysis && (
                        <div className="bg-gradient-to-br from-cyan-900/20 to-secondary p-6 rounded-xl border border-cyan-500/20">
                            <div className="flex justify-between items-center mb-4">
                                <div>
                                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                        <SparklesIcon className="w-5 h-5 text-cyan-400" />
                                        Plano de Desenvolvimento Individual (PDI)
                                    </h3>
                                    <p className="text-xs text-text-secondary mt-1">
                                        Gere um plano de 4 semanas baseado em dados físicos, psicológicos e performance recente em jogos.
                                    </p>
                                </div>
                                <button 
                                    onClick={handleGenerateAnalysis}
                                    disabled={isLoadingAi}
                                    className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-lg shadow-lg hover:shadow-cyan-500/50 transition-all text-sm flex items-center gap-2 disabled:opacity-50"
                                >
                                    {isLoadingAi ? 'Analisando Jogos...' : 'Gerar Novo PDI'}
                                </button>
                            </div>
                        </div>
                    )}
                    
                    {!isStaff && !player.developmentPlans?.length && (
                         <div className="text-center py-8 text-text-secondary italic">
                             Seu técnico ainda não criou um Plano de Desenvolvimento para você.
                         </div>
                    )}

                    {aiAnalysis && isStaff && (
                        <div className="bg-secondary/30 rounded-xl p-6 border border-cyan-500/20 animate-fade-in relative">
                             <div className="flex justify-between items-center mb-6 border-b border-white/5 pb-4">
                                <h3 className="text-lg font-bold text-cyan-400 flex items-center gap-2">
                                    <SparklesIcon className="w-5 h-5" />
                                    Novo Plano Gerado
                                </h3>
                                <div className="flex gap-2">
                                    <button onClick={() => setAiAnalysis('')} className="px-3 py-1 text-xs text-text-secondary hover:text-white border border-white/10 rounded">
                                        Cancelar
                                    </button>
                                    <button onClick={handleSavePlan} className="px-3 py-1 text-xs bg-green-600 text-white font-bold rounded hover:bg-green-500 transition-colors">
                                        Aprovar & Iniciar Plano
                                    </button>
                                </div>
                             </div>
                             
                             <div className="prose prose-invert max-w-none prose-p:text-sm prose-p:leading-relaxed prose-strong:text-cyan-300">
                                 <div dangerouslySetInnerHTML={{ __html: formattedAnalysis(aiAnalysis) }} />
                             </div>
                        </div>
                    )}

                    {player.developmentPlans && player.developmentPlans.length > 0 && (
                        <div className="mt-4">
                             <h4 className="text-sm font-bold text-text-secondary uppercase mb-3">Planos de Ação (Ativos e Histórico)</h4>
                             <div className="space-y-4">
                                 {player.developmentPlans.map(plan => (
                                     <div key={plan.id} className={`rounded-xl p-4 border border-white/5 ${plan.status === 'ACTIVE' ? 'bg-secondary border-l-4 border-l-cyan-500' : 'bg-secondary/30 opacity-75'}`}>
                                         <div className="flex justify-between items-start mb-2">
                                             <div>
                                                 <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase mr-2 ${plan.status === 'ACTIVE' ? 'bg-cyan-500 text-white' : 'bg-green-500 text-white'}`}>
                                                     {plan.status === 'ACTIVE' ? 'Em Progresso' : 'Concluído'}
                                                 </span>
                                                 <span className="text-sm font-bold text-white">{plan.title}</span>
                                             </div>
                                             <span className="text-xs text-text-secondary">Prazo: {new Date(plan.deadline!).toLocaleDateString()}</span>
                                         </div>
                                         
                                          <div className="prose prose-invert max-w-none prose-p:text-xs prose-li:text-xs text-text-secondary mb-4 max-h-40 overflow-y-auto custom-scrollbar">
                                              <div dangerouslySetInnerHTML={{ __html: formattedAnalysis(plan.generatedContent) }} />
                                         </div>

                                         {plan.status === 'ACTIVE' && isStaff && (
                                             <div className="mt-3 pt-3 border-t border-white/10 flex gap-2 items-center">
                                                 <input 
                                                    className="flex-1 bg-black/20 border border-white/10 rounded px-2 py-1 text-xs text-white"
                                                    placeholder="Feedback de Evolução (Ex: Atleta melhorou carga em 10%)..."
                                                    value={planFeedback}
                                                    onChange={(e) => setPlanFeedback(e.target.value)}
                                                 />
                                                 <button 
                                                    onClick={() => handleCompletePlan(plan.id)}
                                                    className="bg-green-600 hover:bg-green-500 text-white text-xs px-3 py-1.5 rounded font-bold"
                                                >
                                                     Concluir
                                                 </button>
                                             </div>
                                         )}
                                          {plan.status === 'COMPLETED' && plan.coachFeedback && (
                                             <div className="mt-2 bg-green-900/20 p-2 rounded text-xs text-green-300">
                                                 <strong>Feedback Final:</strong> {plan.coachFeedback}
                                             </div>
                                         )}
                                     </div>
                                 ))}
                             </div>
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