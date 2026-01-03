import React, { useState, useEffect } from 'react';
import DashboardSidebar from './components/DashboardSidebar';
import DashboardMarketing from './DashboardMarketing';
import DashboardCommercial from '../commercial/DashboardCommercial'; 
import JulesAgent from '../../lib/Jules';
import EventTicker from '../../components/EventTicker';

// Interface para o componente de Cards (Garante que o TypeScript não barre o build)
interface DashboardCardProps {
  title: string;
  color: string;
  children: React.ReactNode;
}

const DashboardMaster: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [persona, setPersona] = useState<string>('VISITANTE');
  const [modality, setModality] = useState<string>('TODOS');

  useEffect(() => {
    // Protocolo de Injeção de Contexto Nexus
    const savedPersona = localStorage.getItem('nexus_persona');
    if (savedPersona) {
      setPersona(savedPersona);
    }
  }, []);

  // Lógica de Segmentação por Persona
  const isExecutiveView = ['PRESIDENTE', 'VICE_PRES', 'CFO', 'MASTER'].includes(persona);
  const isSportsView = ['DIRETOR', 'HC', 'COORD_ATQ', 'COORD_DEF', 'COORD_ST', 'AUX_CT'].includes(persona);
  const isMarketingView = persona === 'CMO';
  const isCommercialView = persona === 'CCO';

  return (
    <div className="flex flex-col h-screen bg-[#020617] overflow-hidden text-white font-sans selection:bg-indigo-500/30">
      {/* Ticker de Eventos em Tempo Real */}
      <EventTicker />

      <div className="flex flex-1 overflow-hidden">
        {/* Navegação Lateral */}
        <DashboardSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <div className="flex-1 flex flex-col overflow-y-auto relative bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-slate-900 via-[#020617] to-[#020617]">
          
          {/* Header de Comando Nexus */}
          <header className="p-4 md:p-6 border-b border-white/5 bg-[#0f172a]/40 backdrop-blur-xl sticky top-0 z-30 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <button 
                onClick={() => setSidebarOpen(true)} 
                className="md:hidden p-2 text-gray-300 bg-slate-800/50 hover:bg-slate-700 rounded-lg transition-colors"
              >
                ☰
              </button>
              <div>
                <h1 className="text-xl font-black text-white leading-tight uppercase italic tracking-tighter">
                  {isCommercialView ? 'CCO Command' : isMarketingView ? 'Marketing Hub' : 'Nexus Command'}
                </h1>
                <p className="text-[9px] text-slate-500 font-mono tracking-[0.2em] uppercase">
                  AUTH_ROLE: <span className="text-indigo-400 font-bold">{persona}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="hidden md:block text-right mr-4">
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Status da Rede</p>
                <p className="text-[10px] text-emerald-500 font-black animate-pulse uppercase">● Enlace Operacional</p>
              </div>
              <select 
                value={modality}
                onChange={(e) => setModality(e.target.value)}
                className="bg-slate-900/80 border border-white/10 text-[10px] font-black uppercase tracking-widest rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-500 transition-all cursor-pointer"
              >
                <option value="TODOS">Visão Consolidada</option>
                <option value="FLAG">🏈 Flag Football</option>
                <option value="TACKLE">🛡️ Full Pads</option>
              </select>
            </div>
          </header>

          {/* Área Principal de Renderização */}
          <main className="p-4 md:p-8 max-w-7xl mx-auto w-full mb-24 flex-1 animate-in fade-in slide-in-from-bottom-4 duration-700">
            
            {/* Vistas Condicionais (Subpáginas) */}
            {isCommercialView && <DashboardCommercial />}
            {isMarketingView && <DashboardMarketing />}

            {isExecutiveView && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 h-full">
                <DashboardCard title="Saúde Financeira" color="border-emerald-500/20">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-slate-500 font-bold uppercase mb-1">Liquidez Imediata</span>
                    <h3 className="text-4xl font-black text-emerald-400 tracking-tighter italic">R$ 42.500,00</h3>
                    <p className="text-[10px] text-emerald-500/50 mt-2 font-mono">+12.5% em relação ao ciclo anterior</p>
                  </div>
                </DashboardCard>

                <DashboardCard title="Capital Humano" color="border-indigo-500/20">
                  <div className="flex flex-col">
                    <span className="text-[10px] text-slate-500 font-bold uppercase mb-1">Corpo de Atletas</span>
                    <h3 className="text-4xl font-black text-white tracking-tighter italic">142 <span className="text-indigo-500 text-lg">Membros</span></h3>
                    <div className="flex gap-2 mt-2">
                      <span className="text-[9px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded">82 Masculino</span>
                      <span className="text-[9px] bg-slate-800 text-slate-400 px-2 py-0.5 rounded">60 Feminino</span>
                    </div>
                  </div>
                </DashboardCard>

                <DashboardCard title="Radar Operacional" color="border-orange-500/20">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center border-b border-white/5 pb-2">
                      <span className="text-[10px] font-bold text-slate-400">Próximo Treino</span>
                      <span className="text-[10px] text-orange-400 font-black">HOJE 20:00</span>
                    </div>
                    <div className="flex justify-between items-center border-b border-white/5 pb-2">
                      <span className="text-[10px] font-bold text-slate-400">Eventos Ativos</span>
                      <span className="text-[10px] text-white font-black">02 CAMPANHAS</span>
                    </div>
                  </div>
                </DashboardCard>

                <DashboardCard title="Diretrizes & OKRs" color="border-purple-500/20">
                  <div className="flex flex-col gap-3">
                    <div className="bg-indigo-500/10 border border-indigo-500/20 p-3 rounded-xl">
                      <p className="text-[10px] font-black text-indigo-400 uppercase mb-1 italic">Prioridade Alpha</p>
                      <p className="text-xs text-white font-bold leading-tight">Lançamento de Campanha de Sócios 2026</p>
                    </div>
                    <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-indigo-500 h-full w-[65%] shadow-[0_0_10px_#6366f1]" />
                    </div>
                  </div>
                </DashboardCard>
              </div>
            )}

            {isSportsView && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
                <DashboardCard title="Status do Plantel" color="border-emerald-500/20">
                  <div className="flex items-end gap-2">
                    <span className="text-5xl font-black text-emerald-500 tracking-tighter">85%</span>
                    <span className="text-[10px] text-slate-500 font-bold uppercase mb-2">Prontidão Técnica</span>
                  </div>
                </DashboardCard>
                <DashboardCard title="Performance de Temporada" color="border-indigo-500/20">
                  <div className="flex items-center gap-4 mt-2">
                    <div className="text-center">
                      <h3 className="text-4xl font-black italic text-white tracking-tighter">4V - 1D</h3>
                      <p className="text-[9px] text-slate-500 font-bold uppercase mt-1">Recorde Atual</p>
                    </div>
                    <div className="h-10 w-[1px] bg-white/10" />
                    <div className="text-emerald-500 font-black italic text-xl">#1 LIGA</div>
                  </div>
                </DashboardCard>
              </div>
            )}
          </main>

          {/* Agente de Inteligência Contextual */}
          <JulesAgent context="DASHBOARD" />
          
        </div>
      </div>
    </div>
  );
};

// Componente de Card Reutilizável (Sub-módulo interno)
const DashboardCard: React.FC<DashboardCardProps> = ({ title, color, children }) => (
  <div className={`bg-[#1e293b]/30 backdrop-blur-md border ${color} rounded-3xl p-6 flex flex-col shadow-2xl hover:bg-[#1e293b]/50 transition-all duration-300 group`}>
    <h3 className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] mb-6 border-b border-white/5 pb-3 flex justify-between items-center group-hover:text-slate-300 transition-colors">
      {title}
      <span className="w-1.5 h-1.5 rounded-full bg-slate-800 group-hover:bg-indigo-500 transition-colors" />
    </h3>
    <div className="flex-1">
      {children}
    </div>
  </div>
);

export default DashboardMaster;