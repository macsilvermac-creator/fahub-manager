import React, { useState, useEffect } from 'react';
import DashboardSidebar from './components/DashboardSidebar';

const DashboardMaster: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [persona, setPersona] = useState<string>('VISITANTE');
  const [modality, setModality] = useState<string>('TODOS');
  
  // Estado do Jules (O Insight da IA)
  const [julesInsight, setJulesInsight] = useState<{visible: boolean, type: string, message: string} | null>(null);

  // Carrega a Persona e Simula um Insight do Jules após 2 segundos
  useEffect(() => {
    const savedPersona = localStorage.getItem('nexus_persona');
    if (savedPersona) {
      setPersona(savedPersona);
    }

    // SIMULAÇÃO: Jules detectando algo crítico após o login
    setTimeout(() => {
      setJulesInsight({
        visible: true,
        type: 'FINANCE_ALERT',
        message: 'Detectei um padrão de atraso de 15% nas mensalidades da Base este mês. Deseja disparar lembretes automáticos via WhatsApp?'
      });
    }, 1500);
  }, []);

  const handleJulesAction = (action: 'APPROVE' | 'IGNORE') => {
    console.log(`[JULES] Ação do Humano: ${action}`);
    // Aqui conectaremos com a API (Vertex AI / Edge Function)
    setJulesInsight(null); // Fecha o insight após decisão
  };

  return (
    <div className="flex h-screen bg-[#020617] overflow-hidden text-white font-sans">
      
      {/* 1. NAVEGAÇÃO LATERAL */}
      <DashboardSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* 2. ÁREA DE CONTEÚDO PRINCIPAL */}
      <div className="flex-1 flex flex-col overflow-y-auto relative">
        
        {/* HEADER */}
        <header className="p-4 md:p-6 border-b border-slate-800 bg-[#0f172a]/50 backdrop-blur sticky top-0 z-30 flex justify-between items-center">
          <div className="flex items-center gap-4">
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

        {/* 3. GRID 2x2 DO PROTOCOLO FAHUB */}
        <main className="p-4 md:p-8 max-w-7xl mx-auto w-full mb-24"> {/* mb-24 para dar espaço ao Jules */}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 h-full">
            
            {/* QUADRANTE 1: FINANCEIRO */}
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

            {/* QUADRANTE 2: CAPITAL HUMANO */}
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

            {/* QUADRANTE 3: RADAR OPERACIONAL */}
            <DashboardCard title="Radar Operacional" color="border-orange-500/30">
              <div className="space-y-3 overflow-y-auto max-h-[150px] pr-2 custom-scrollbar">
                <FeedItem title="Treino Defesa (Flag)" time="Hoje, 19:00" user="Coach Mike" status="Agendado"/>
                <FeedItem title="Reunião Pais Sub-15" time="Ontem" user="Coord. Base" status="Concluído"/>
                <FeedItem title="Análise de Vídeo" time="Ontem" user="HC Tackle" status="Pendente"/>
              </div>
            </DashboardCard>

            {/* QUADRANTE 4: ESTRATÉGIA & GOVERNANÇA */}
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

        {/* 4. COMPONENTE JULES (IA AGENT) - RODAPÉ INTELIGENTE */}
        {julesInsight && (
          <div className="absolute bottom-6 left-0 right-0 px-4 flex justify-center z-50 animate-slide-up">
            <div className="bg-[#0f172a]/90 backdrop-blur-xl border border-indigo-500/50 p-1 rounded-2xl shadow-[0_0_30px_rgba(99,102,241,0.3)] max-w-3xl w-full flex flex-col md:flex-row items-center gap-4 pr-2">
              
              {/* Avatar Jules (Animado) */}
              <div className="p-3 bg-indigo-600/20 rounded-xl border border-indigo-500/30 flex-shrink-0 relative group">
                <div className="absolute inset-0 bg-indigo-500 blur-lg opacity-20 group-hover:opacity-40 transition"></div>
                <span className="text-2xl relative z-10">🤖</span>
              </div>

              {/* Texto do Insight */}
              <div className="flex-1 py-2 text-center md:text-left">
                <p className="text-[10px] text-indigo-300 font-bold uppercase tracking-widest mb-1 flex items-center gap-2 justify-center md:justify-start">
                  <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></span>
                  JULES INSIGHT
                </p>
                <p className="text-sm text-white font-medium leading-snug">
                  {julesInsight.message}
                </p>
              </div>

              {/* Botões de Decisão (Human-in-the-Loop) */}
              <div className="flex gap-2 w-full md:w-auto">
                <button 
                  onClick={() => handleJulesAction('IGNORE')}
                  className="flex-1 md:flex-none px-4 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold border border-slate-700 transition"
                >
                  IGNORAR
                </button>
                <button 
                  onClick={() => handleJulesAction('APPROVE')}
                  className="flex-1 md:flex-none px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold border border-indigo-400 shadow-lg shadow-indigo-500/20 transition transform hover:scale-105 flex items-center justify-center gap-2"
                >
                  <span>✓</span> AUTORIZAR
                </button>
              </div>

            </div>
          </div>
        )}

      </div>
    </div>
  );
};

// --- SUB-COMPONENTES VISUAIS ---

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