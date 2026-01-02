import React, { useState, useEffect } from 'react';
import DashboardSidebar from './components/DashboardSidebar';
import DashboardMarketing from './DashboardMarketing';
import DashboardCommercial from '../commercial/DashboardCommercial'; 
import JulesAgent from '../../lib/Jules';
import EventTicker from '../../components/EventTicker';

const DashboardMaster: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [persona, setPersona] = useState<string>('VISITANTE');
  const [modality, setModality] = useState<string>('TODOS');

  useEffect(() => {
    const savedPersona = localStorage.getItem('nexus_persona');
    if (savedPersona) setPersona(savedPersona);
  }, []);

  const isExecutiveView = ['PRESIDENTE', 'VICE_PRES', 'CFO', 'MASTER'].includes(persona);
  const isSportsView = ['DIRETOR', 'HC', 'COORD_ATQ', 'COORD_DEF', 'COORD_ST', 'AUX_CT'].includes(persona);
  const isMarketingView = persona === 'CMO';
  const isCommercialView = persona === 'CCO';

  return (
    <div className="flex flex-col h-screen bg-[#020617] overflow-hidden text-white font-sans">
      <EventTicker />
      <div className="flex flex-1 overflow-hidden">
        <DashboardSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        <div className="flex-1 flex flex-col overflow-y-auto relative">
          
          <header className="p-4 md:p-6 border-b border-slate-800 bg-[#0f172a]/50 backdrop-blur sticky top-0 z-30 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <button onClick={() => setSidebarOpen(true)} className="md:hidden p-2 text-gray-300 bg-slate-800 rounded-lg">☰</button>
              <div>
                <h1 className="text-xl font-bold text-white leading-tight uppercase italic">
                  {isCommercialView ? 'CCO Command' : isMarketingView ? 'Marketing Hub' : 'Nexus Command'}
                </h1>
                <p className="text-[10px] text-slate-400 font-mono tracking-wider">
                  OPERADOR: <span className="text-indigo-400">{persona}</span>
                </p>
              </div>
            </div>
            <select 
              value={modality}
              onChange={(e) => setModality(e.target.value)}
              className="bg-slate-900 border border-slate-700 text-xs rounded-lg px-3 py-2 outline-none"
            >
              <option value="TODOS">Visão Consolidada</option>
              <option value="FLAG">🏈 Flag Football</option>
              <option value="TACKLE">🛡️ Full Pads</option>
            </select>
          </header>

          <main className="p-4 md:p-8 max-w-7xl mx-auto w-full mb-24 flex-1">
            {isCommercialView && <DashboardCommercial />}
            {isMarketingView && <DashboardMarketing />}

            {isExecutiveView && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
                <DashboardCard title="Saúde Financeira" color="border-emerald-500/30">
                  <h3 className="text-3xl font-bold text-emerald-400 mt-1">R$ 42.500,00</h3>
                </DashboardCard>
                <DashboardCard title="Capital Humano" color="border-blue-500/30">
                  <h3 className="text-2xl font-bold text-white">142 Atletas</h3>
                </DashboardCard>
                <DashboardCard title="Radar Operacional" color="border-orange-500/30">
                  <p className="text-xs text-slate-400">Monitorando atividades...</p>
                </DashboardCard>
                <DashboardCard title="Diretrizes & OKRs" color="border-purple-500/30">
                  <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded">Campanha Sócios</span>
                </DashboardCard>
              </div>
            )}

            {isSportsView && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
                <DashboardCard title="Status do Plantel" color="border-emerald-500/30">
                  <span className="text-2xl font-bold">85% Prontidão</span>
                </DashboardCard>
                <DashboardCard title="Performance" color="border-indigo-500/30">
                  <h3 className="text-3xl font-black italic">4V - 1D</h3>
                </DashboardCard>
              </div>
            )}
          </main>
          <JulesAgent context="DASHBOARD" />
        </div>
      </div>
    </div>
  );
};

const DashboardCard: React.FC<{title: string, color: string, children: React.ReactNode}> = ({ title, color, children }) => (
  <div className={`bg-[#1e293b]/60 backdrop-blur border ${color} rounded-2xl p-5 flex flex-col shadow-lg`}>
    <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-4 border-b border-slate-700/50 pb-2">{title}</h3>
    <div className="flex-1">{children}</div>
  </div>
);

export default DashboardMaster;