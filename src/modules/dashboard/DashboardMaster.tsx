import React, { useState, useEffect } from 'react';
import DashboardSidebar from './components/DashboardSidebar';
import { useNavigate } from 'react-router-dom';

const DashboardMaster: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [persona, setPersona] = useState<string>('VISITANTE');
  const [modality, setModality] = useState<string>('TODOS'); // Filtro de Contexto

  // Carrega a Persona ao iniciar
  useEffect(() => {
    const savedPersona = localStorage.getItem('nexus_persona');
    if (savedPersona) {
      setPersona(savedPersona);
    }
  }, []);

  return (
    <div className="flex h-screen bg-[#020617] overflow-hidden text-white font-sans">
      
      {/* 1. NAVEGAÇÃO LATERAL (Sidebar) */}
      <DashboardSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* 2. ÁREA DE CONTEÚDO PRINCIPAL */}
      <div className="flex-1 flex flex-col overflow-y-auto relative">
        
        {/* HEADER MOBILE & DESKTOP */}
        <header className="p-4 md:p-6 border-b border-slate-800 bg-[#0f172a]/50 backdrop-blur sticky top-0 z-30 flex justify-between items-center">
          <div className="flex items-center gap-4">
            {/* Botão Menu Hambúrguer (Mobile Only) */}
            <button 
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2 text-gray-300 hover:text-white bg-slate-800 rounded-lg"
            >
              ☰
            </button>
            
            <div>
              <h1 className="text-xl font-bold text-white leading-tight">Olá, Presidente</h1>
              <p className="text-xs text-slate-400 font-mono tracking-wider">
                VIEW: {persona} • 
                <span className="text-emerald-500 ml-1">ONLINE</span>
              </p>
            </div>
          </div>

          {/* SELETOR DE MODALIDADE (O "Context Switcher") */}
          <div className="flex items-center">
            <select 
              value={modality}
              onChange={(e) => setModality(e.target.value)}
              className="bg-slate-900 border border-slate-700 text-xs md:text-sm rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              <option value="TODOS">Visão Consolidada</option>
              <option value="FLAG">🏈 Flag Football</option>
              <option value="TACKLE">🛡️ Full Pads</option>
              <option value="BASE">🎓 Categorias de Base</option>
            </select>
          </div>
        </header>

        {/* 3. PROTOCOLO FAHUB: O GRID 2x2 */}
        <main className="p-4 md:p-8 max-w-7xl mx-auto w-full">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 h-full">
            
            {/* QUADRANTE 1: FINANCEIRO (O Oxigênio) */}
            <DashboardCard title="Saúde Financeira" color="border-emerald-500/30">
              <div className="flex flex-col h-full justify-between">
                <div>
                  <p className="text-slate-400 text-sm">Saldo em Caixa (Estimado)</p>
                  <h3 className="text-3xl font-bold text-emerald-400 mt-1">R$ 42.500,00</h3>
                </div>
                <div className="mt-4 bg-emerald-500/10 p-3 rounded-lg border border-emerald-500/20">
                  <p className="text-xs text-emerald-200">Fluxo da Semana: <span className="font-bold">+ R$ 1.200</span></p>
                </div>
              </div>
            </DashboardCard>

            {/* QUADRANTE 2: CAPITAL HUMANO (Força) */}
            <DashboardCard title="Capital Humano" color="border-blue-500/30">
              <div className="flex flex-col h-full justify-between">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-slate-400 text-xs">Atletas Ativos</p>
                    <h3 className="text-2xl font-bold text-white">142</h3>
                  </div>
                  <div>
                    <p className="text-slate-400 text-xs">Novos (Mês)</p>
                    <h3 className="text-2xl font-bold text-indigo-400">+8</h3>
                  </div>
                </div>
                <div className="mt-4">
                   <div className="w-full bg-slate-700 h-2 rounded-full overflow-hidden">
                     <div className="bg-blue-500 h-full w-[75%]"></div>
                   </div>
                   <p className="text-[10px] text-right text-slate-400 mt-1">Meta Anual: 75%</p>
                </div>
              </div>
            </DashboardCard>

            {/* QUADRANTE 3: RADAR OPERACIONAL (Atividade Coaches) */}
            <DashboardCard title="Radar Operacional" color="border-orange-500/30">
              <div className="space-y-3 overflow-y-auto max-h-[150px] pr-2 custom-scrollbar">
                {/* Item de Feed Simulado */}
                <FeedItem 
                  title="Treino Defesa (Flag)" 
                  time="Hoje, 19:00" 
                  user="Coach Mike" 
                  status="Agendado"
                />
                <FeedItem 
                  title="Reunião Pais Sub-15" 
                  time="Ontem" 
                  user="Coord. Base" 
                  status="Concluído"
                />
                 <FeedItem 
                  title="Análise de Vídeo" 
                  time="Ontem" 
                  user="HC Tackle" 
                  status="Pendente"
                />
              </div>
            </DashboardCard>

            {/* QUADRANTE 4: ESTRATÉGIA & GOVERNANÇA (Direção) */}
            <DashboardCard title="Diretrizes & OKRs" color="border-purple-500/30">
              <div className="flex flex-col gap-3">
                 <div className="flex justify-between items-center bg-slate-800/50 p-3 rounded-lg border border-slate-700 cursor-pointer hover:border-purple-500 transition">
                    <span className="text-sm font-bold">Campanha de Sócios</span>
                    <span className="text-xs bg-yellow-500/20 text-yellow-400 px-2 py-1 rounded">Em Andamento</span>
                 </div>
                 <div className="flex justify-between items-center bg-slate-800/50 p-3 rounded-lg border border-slate-700 cursor-pointer hover:border-purple-500 transition">
                    <span className="text-sm font-bold">Renovação Alvará</span>
                    <span className="text-xs bg-red-500/20 text-red-400 px-2 py-1 rounded">Crítico</span>
                 </div>
                 <button className="text-xs text-center w-full py-2 bg-purple-600/20 hover:bg-purple-600/40 text-purple-300 rounded border border-purple-500/30 transition">
                    + Criar Nova Diretriz
                 </button>
              </div>
            </DashboardCard>

          </div>
        </main>
      </div>
    </div>
  );
};

// --- SUB-COMPONENTES PARA ORGANIZAÇÃO VISUAL ---

const DashboardCard: React.FC<{title: string, color: string, children: React.ReactNode}> = ({ title, color, children }) => (
  <div className={`bg-[#1e293b]/60 backdrop-blur border ${color} rounded-2xl p-5 hover:bg-[#1e293b] transition duration-300 flex flex-col shadow-lg`}>
    <h3 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-4 border-b border-slate-700/50 pb-2">
      {title}
    </h3>
    <div className="flex-1">
      {children}
    </div>
  </div>
);

const FeedItem: React.FC<{title: string, time: string, user: string, status: string}> = ({title, time, user, status}) => (
  <div className="flex items-start justify-between p-2 rounded hover:bg-white/5 transition border-l-2 border-slate-600 pl-3">
    <div>
      <p className="text-sm font-bold text-slate-200">{title}</p>
      <p className="text-[10px] text-slate-500 uppercase">{user} • {time}</p>
    </div>
    <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded text-slate-400 border border-slate-700">
      {status}
    </span>
  </div>
);

export default DashboardMaster;