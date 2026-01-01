import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Calendar, 
  Trophy, 
  Timer, 
  MessageSquareText, 
  Gauge,
  Zap,
  ChevronRight
} from 'lucide-react';

/**
 * Interface para representar o status operacional de cada modalidade
 */
interface TeamStatus {
  id: string;
  name: string;
  category: 'Tackle' | 'Flag' | 'Base';
  currentPhase: 'Pre-Season' | 'In-Season' | 'Off-Season';
  lastTrainingDate: string;
  trainingIntensity: 'Low' | 'Medium' | 'High';
  hcReport: string;
}

const TeamSupervision: React.FC = () => {
  // Simulação de dados vindo dos relatórios dos HCs (Módulo 3)
  const [teams] = useState<TeamStatus[]>([
    { 
      id: 't1', 
      name: 'Gladiators Tackle', 
      category: 'Tackle', 
      currentPhase: 'In-Season', 
      lastTrainingDate: '2026-01-01', 
      trainingIntensity: 'High',
      hcReport: 'Foco total em drills de Redzone e Special Teams. Atletas apresentaram alto engajamento físico.'
    },
    { 
      id: 'f1', 
      name: 'Gladiators Flag', 
      category: 'Flag', 
      currentPhase: 'Pre-Season', 
      lastTrainingDate: '2026-01-01', 
      trainingIntensity: 'Medium',
      hcReport: 'Instalação de novas jogadas de ataque. Ajustes de rotas pendentes para o próximo treino.'
    }
  ]);

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 space-y-6">
      {/* Header de Navegação */}
      <nav className="flex items-center gap-4">
        <button className="p-3 bg-white rounded-2xl border border-slate-200 text-slate-400 hover:text-blue-600 shadow-sm transition-all">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tighter italic leading-none">
            OPERAÇÃO <span className="text-purple-600">DE EQUIPES</span>
          </h2>
          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">
            Supervisão de Modalidades e Categorias
          </p>
        </div>
      </nav>

      {/* Grid de Phases (Status Global) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-50 text-purple-600 rounded-lg"><Trophy size={20} /></div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Modalidades Ativas</span>
          </div>
          <span className="text-xl font-black text-slate-800 italic">02</span>
        </div>
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg"><Timer size={20} /></div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Treinos Hoje</span>
          </div>
          <span className="text-xl font-black text-slate-800 italic">02</span>
        </div>
        <div className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-orange-50 text-orange-600 rounded-lg"><Zap size={20} /></div>
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Status Geral</span>
          </div>
          <span className="text-[10px] font-black bg-emerald-100 text-emerald-600 px-3 py-1 rounded-full uppercase">Estável</span>
        </div>
      </div>

      {/* Lista de Relatórios Operacionais */}
      <section className="space-y-4">
        {teams.map((team) => (
          <div key={team.id} className="bg-white rounded-[2rem] border border-slate-100 shadow-lg overflow-hidden group">
            <div className="p-6 space-y-4">
              {/* Topo do Card da Equipe */}
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white">
                    <Gauge size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-slate-800 tracking-tight leading-none">{team.name}</h3>
                    <div className="flex gap-2 mt-1">
                      <span className="text-[9px] font-black uppercase text-purple-600 bg-purple-50 px-2 py-0.5 rounded italic">
                        {team.currentPhase}
                      </span>
                      <span className="text-[9px] font-black uppercase text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                        {team.category}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-slate-400">
                  <Calendar size={14} />
                  <span className="text-[10px] font-bold uppercase">{team.lastTrainingDate}</span>
                </div>
              </div>

              {/* Resumo do Relatório do HC */}
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 relative">
                <MessageSquareText size={16} className="absolute right-4 top-4 text-slate-200" />
                <p className="text-[10px] font-black text-slate-400 uppercase mb-2 tracking-widest">Resumo do Head Coach</p>
                <p className="text-sm text-slate-600 leading-relaxed font-medium italic">
                  "{team.hcReport}"
                </p>
              </div>

              {/* Footer de Ação Rápida */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-50">
                <div className="flex items-center gap-3">
                   <div className="flex flex-col">
                      <span className="text-[8px] font-black text-slate-400 uppercase">Intensidade</span>
                      <span className={`text-[10px] font-black ${team.trainingIntensity === 'High' ? 'text-red-500' : 'text-blue-500'}`}>
                        {team.trainingIntensity.toUpperCase()}
                      </span>
                   </div>
                </div>
                <button className="flex items-center gap-2 text-[10px] font-black text-blue-600 uppercase group-hover:gap-3 transition-all">
                  Ver Estatísticas Completas <ChevronRight size={14} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Assistente Jules / Análise Operacional */}
      <div className="bg-slate-900 rounded-[2.5rem] p-6 text-white border border-slate-800 shadow-2xl">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="p-4 bg-purple-500/20 text-purple-400 rounded-3xl border border-purple-500/30">
            <Zap size={32} />
          </div>
          <div className="flex-1 text-center md:text-left">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-purple-400 mb-1">Jules / Análise de Performance</p>
            <p className="text-base font-medium leading-relaxed text-slate-300">
              "Notei que o HC do <span className="text-white font-bold">Tackle Masculino</span> manteve intensidade alta por 3 treinos seguidos. Deseja que eu sugira um treino de recuperação (Low Intensity) para amanhã para evitar lesões?"
            </p>
          </div>
          <div className="flex gap-2 w-full md:w-auto">
             <button className="flex-1 md:flex-none bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-2xl text-[10px] font-black shadow-lg transition-all">
               SUGERIR AO HC
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeamSupervision;