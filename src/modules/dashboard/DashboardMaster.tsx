import React, { useState, useEffect } from 'react';
import DashboardSidebar from './components/DashboardSidebar';
import DashboardMarketing from './DashboardMarketing'; // <--- NOVA INTEGRAÇÃO
import JulesAgent from '../../lib/Jules';
import EventTicker from '../../components/EventTicker';

const DashboardMaster: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [persona, setPersona] = useState<string>('VISITANTE');
  const [modality, setModality] = useState<string>('TODOS');

  // Carrega a Persona ao iniciar
  useEffect(() => {
    const savedPersona = localStorage.getItem('nexus_persona');
    if (savedPersona) {
      setPersona(savedPersona);
    }
  }, []);

  // Lógica de Renderização Baseada em Persona (Skin)
  const isExecutiveView = ['PRESIDENTE', 'VICE_PRES', 'CFO', 'MASTER'].includes(persona);
  const isSportsView = ['DIRETOR', 'HC', 'COORD_ATQ', 'COORD_DEF', 'COORD_ST', 'AUX_CT'].includes(persona);
  const isMarketingView = ['CMO', 'CCO'].includes(persona); // <--- NOVA PERSONA

  return (
    <div className="flex flex-col h-screen bg-[#020617] overflow-hidden text-white font-sans">
      
      {/* 0. BARRA DE COMANDO (TOPO ABSOLUTO - EVENT TICKER) */}
      <EventTicker />

      {/* CONTAINER PRINCIPAL */}
      <div className="flex flex-1 overflow-hidden">
        
        {/* 1. NAVEGAÇÃO LATERAL */}
        <DashboardSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        {/* 2. ÁREA DE CONTEÚDO PRINCIPAL */}
        <div className="flex-1 flex flex-col overflow-y-auto relative">
          
          {/* HEADER GERAL (Só aparece se NÃO for Marketing, pois Marketing tem header próprio no módulo, ou mantemos para consistência do menu mobile) */}
          <header className="p-4 md:p-6 border-b border-slate-800 bg-[#0f172a]/50 backdrop-blur sticky top-0 z-30 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <button onClick={() => setSidebarOpen(true)} className="md:hidden p-2 text-gray-300 hover:text-white bg-slate-800 rounded-lg">☰</button>
              <div>
                <h1 className="text-xl font-bold text-white leading-tight">
                  {isMarketingView ? 'Central de Expansão' : isExecutiveView ? 'Olá, Presidente' : 'Painel Tático'}
                </h1>
                <p className="text-xs text-slate-400 font-mono tracking-wider">
                  OPERADOR: <span className="text-indigo-400">{persona}</span> • 
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

          <main className="p-4 md:p-8 max-w-7xl mx-auto w-full mb-24 flex-1">
            
            {/* --- 1. VISÃO MARKETING (CMO / CCO) --- */}
            {isMarketingView && (
              <DashboardMarketing />
            )}

            {/* --- 2. VISÃO EXECUTIVA (PRESIDENTE / CFO) --- */}
            {isExecutiveView && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 h-full">
                {/* Q1: FINANCEIRO */}
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

                {/* Q2: CAPITAL HUMANO */}
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

                {/* Q3: RADAR OPERACIONAL */}
                <DashboardCard title="Radar Operacional" color="border-orange-500/30">
                  <div className="space-y-3 overflow-y-auto max-h-[150px] pr-2 custom-scrollbar">
                    <FeedItem title="Treino Defesa (Flag)" time="Hoje, 19:00" user="Coach Mike" status="Agendado"/>
                    <FeedItem title="Reunião Pais Sub-15" time="Ontem" user="Coord. Base" status="Concluído"/>
                    <FeedItem title="Análise de Vídeo" time="Ontem" user="HC Tackle" status="Pendente"/>
                  </div>
                </DashboardCard>

                {/* Q4: ESTRATÉGIA */}
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
            )}

            {/* --- 3. VISÃO DIRETORIA ESPORTIVA / TÁTICA (DIRETOR / HC) --- */}
            {isSportsView && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 h-full">
                
                {/* Q1: PRONTIDÃO DO PLANTEL (Readiness) */}
                <DashboardCard title="Status do Plantel" color="border-emerald-500/30">
                    <div className="flex items-center justify-between h-full">
                       <div className="relative h-24 w-24 flex items-center justify-center">
                          <svg className="h-full w-full transform -rotate-90" viewBox="0 0 36 36">
                             <path className="text-slate-700" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                             <path className="text-emerald-500" strokeDasharray="85, 100" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                          </svg>
                          <span className="absolute text-xl font-bold text-white">85%</span>
                       </div>
                       <div className="flex flex-col gap-2 text-xs">
                         <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> <span className="text-slate-300">Aptos (48)</span></div>
                         <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-red-500"></span> <span className="text-slate-300">DM / Lesão (5)</span></div>
                         <div className="flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-yellow-500"></span> <span className="text-slate-300">Pendência Adm (3)</span></div>
                       </div>
                    </div>
                </DashboardCard>

                {/* Q2: PERFORMANCE E RESULTADOS */}
                <DashboardCard title="Performance da Temporada" color="border-indigo-500/30">
                  <div className="flex flex-col h-full justify-between">
                      <div className="flex justify-between items-end border-b border-slate-700/50 pb-2">
                        <div>
                           <p className="text-[10px] text-slate-400 uppercase">Campanha Atual</p>
                           <h3 className="text-3xl font-black text-white italic">4V - 1D</h3>
                        </div>
                        <span className="bg-indigo-600 px-2 py-1 rounded text-[10px] font-bold">2º LUGAR</span>
                      </div>
                      <div className="mt-2">
                         <p className="text-[10px] text-slate-400 uppercase mb-1">Próximo Desafio (5 dias)</p>
                         <div className="flex items-center justify-between bg-slate-800/50 p-2 rounded border border-slate-700">
                            <span className="font-bold text-white">GLADIATORS</span>
                            <span className="text-xs text-slate-500">vs</span>
                            <span className="font-bold text-red-400">STEAMROLLERS</span>
                         </div>
                      </div>
                  </div>
                </DashboardCard>

                {/* Q3: LOGÍSTICA DE JOGO (Game Day Ops) */}
                <DashboardCard title="Logística: Game Day" color="border-cyan-500/30">
                    <div className="space-y-2">
                       <LogisticsItem label="Reserva de Ônibus" status="DONE" />
                       <LogisticsItem label="Água e Gelo" status="DONE" />
                       <LogisticsItem label="Pagamento Arbitragem" status="PENDING" />
                       <LogisticsItem label="Solicitação Ambulância" status="WARNING" />
                    </div>
                </DashboardCard>

                {/* Q4: DEMANDAS TÉCNICAS (Staff) */}
                <DashboardCard title="Solicitações do Staff" color="border-pink-500/30">
                    <div className="space-y-2">
                       <div className="p-2 bg-slate-800/30 rounded border border-slate-700 flex justify-between items-center">
                          <div>
                             <p className="text-xs font-bold text-white">Compra de Bolas (Flag)</p>
                             <p className="text-[9px] text-slate-400">Req: Coord. Ataque</p>
                          </div>
                          <button className="px-2 py-1 bg-pink-600/20 text-pink-400 text-[9px] font-bold rounded hover:bg-pink-600 hover:text-white transition">APROVAR</button>
                       </div>
                       <div className="p-2 bg-slate-800/30 rounded border border-slate-700 flex justify-between items-center">
                          <div>
                             <p className="text-xs font-bold text-white">Sala de Vídeo (Terça)</p>
                             <p className="text-[9px] text-slate-400">Req: HC Tackle</p>
                          </div>
                          <button className="px-2 py-1 bg-pink-600/20 text-pink-400 text-[9px] font-bold rounded hover:bg-pink-600 hover:text-white transition">APROVAR</button>
                       </div>
                    </div>
                </DashboardCard>

              </div>
            )}
            
            {/* Fallback caso a persona não se encaixe (Visitante) */}
            {!isExecutiveView && !isSportsView && !isMarketingView && (
               <div className="text-center p-10 text-slate-500">
                  Selecione uma Persona no Menu Principal para visualizar os dados.
               </div>
            )}

          </main>

          {/* 4. JULES AGENT (GLOBAL) */}
          <JulesAgent context="DASHBOARD" />

        </div>
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

const LogisticsItem: React.FC<{label: string, status: 'DONE' | 'PENDING' | 'WARNING'}> = ({label, status}) => {
   let icon = '';
   let colorClass = '';
   
   if(status === 'DONE') { icon = '✅'; colorClass = 'text-slate-500 line-through'; }
   if(status === 'PENDING') { icon = '⏳'; colorClass = 'text-white font-bold'; }
   if(status === 'WARNING') { icon = '⚠️'; colorClass = 'text-red-400 font-bold'; }

   return (
      <div className="flex items-center justify-between p-2 border-b border-slate-800/50 last:border-0">
         <span className={`text-xs ${colorClass}`}>{label}</span>
         <span className="text-[10px]">{icon}</span>
      </div>
   )
}

export default DashboardMaster;