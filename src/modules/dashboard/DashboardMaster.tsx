import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import DashboardSidebar from './components/DashboardSidebar';
import DashboardMarketing from './DashboardMarketing';
import DashboardCommercial from '../commercial/DashboardCommercial'; 
import JulesAgent from '../../lib/Jules';
import EventTicker from '../../components/EventTicker';
import { TrendingUp, Users, Target, Activity, ArrowUpRight } from 'lucide-react';

const DashboardMaster: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [persona, setPersona] = useState<string>('VISITANTE');
  const [modality, setModality] = useState<string>('TODOS');
  
  // Estados para dados reais do Supabase
  const [stats, setStats] = useState({
    totalAthletes: 0,
    maleAthletes: 0,
    femaleAthletes: 0,
    financialBalance: 0,
    activeEvents: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedPersona = localStorage.getItem('nexus_persona');
    if (savedPersona) setPersona(savedPersona);
    fetchNexusData();
  }, []);

  // Busca de dados reais para os containers do Presidente
  const fetchNexusData = async () => {
    setLoading(true);
    try {
      // 1. Total de Atletas e Segmentação
      const { data: athletes } = await supabase.from('athletes').select('status');
      const total = athletes?.length || 0;

      // 2. Saúde Financeira (Exemplo de soma de transações)
      const { data: finance } = await supabase.from('finance_transactions').select('amount');
      const balance = finance?.reduce((acc, curr) => acc + curr.amount, 0) || 0;

      // 3. Radar Operacional (Eventos Ativos)
      const { data: events } = await supabase.from('events').select('id');

      setStats({
        totalAthletes: total,
        maleAthletes: Math.floor(total * 0.58), // Mock de segmentação até ter coluna de gênero
        femaleAthletes: Math.ceil(total * 0.42),
        financialBalance: balance,
        activeEvents: events?.length || 0
      });
    } catch (error) {
      console.error('[NEXUS ERROR]: Falha na sincronização de dados', error);
    } finally {
      setLoading(false);
    }
  };

  const isExecutiveView = ['PRESIDENTE', 'VICE_PRES', 'CFO', 'MASTER'].includes(persona);
  const isMarketingView = persona === 'CMO';
  const isCommercialView = persona === 'CCO';

  return (
    <div className="flex flex-col h-screen bg-[#020617] overflow-hidden text-white font-sans selection:bg-indigo-500/30">
      <EventTicker />
      
      <div className="flex flex-1 overflow-hidden">
        <DashboardSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        <div className="flex-1 flex flex-col overflow-y-auto relative bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-slate-900 via-[#020617] to-[#020617]">
          
          <header className="p-4 md:p-6 border-b border-white/5 bg-[#0f172a]/50 backdrop-blur-xl sticky top-0 z-30 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <button onClick={() => setSidebarOpen(true)} className="md:hidden p-2 text-gray-300 bg-slate-800 rounded-lg">☰</button>
              <div>
                <h1 className="text-xl font-black text-white leading-tight uppercase italic tracking-tighter">
                  {isCommercialView ? 'CCO Command' : isMarketingView ? 'Marketing Hub' : 'Nexus Command'}
                </h1>
                <p className="text-[10px] text-slate-400 font-mono tracking-wider uppercase">
                  OPERADOR: <span className="text-indigo-400 font-bold">{persona}</span>
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
               <div className="hidden lg:flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" />
                  <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Enlace Operacional</span>
               </div>
               <select 
                value={modality}
                onChange={(e) => setModality(e.target.value)}
                className="bg-slate-900 border border-white/10 text-[10px] font-black uppercase rounded-lg px-3 py-2 outline-none focus:ring-1 focus:ring-indigo-500 transition-all"
               >
                <option value="TODOS">Visão Consolidada</option>
                <option value="FLAG">🏈 Flag Football</option>
                <option value="TACKLE">🛡️ Full Pads</option>
               </select>
            </div>
          </header>

          <main className="p-4 md:p-8 max-w-7xl mx-auto w-full mb-24 flex-1">
            {isCommercialView && <DashboardCommercial />}
            {isMarketingView && <DashboardMarketing />}

            {isExecutiveView && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full animate-in fade-in slide-in-from-bottom-4 duration-700">
                
                {/* 1. SAÚDE FINANCEIRA - LIGADO AO MÓDULO FINANCEIRO */}
                <DashboardCard 
                  title="Saúde Financeira" 
                  color="border-emerald-500/20" 
                  icon={<TrendingUp size={16} className="text-emerald-500" />}
                  onAction={() => window.location.href = '/financeiro'}
                >
                  <div className="mt-1">
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">Liquidez Imediata</p>
                    <h3 className="text-4xl font-black text-emerald-400 tracking-tighter italic">
                      {loading ? '---' : `R$ ${stats.financialBalance.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`}
                    </h3>
                    <p className="text-[9px] text-emerald-500/50 mt-2 font-mono uppercase">+12.5% em relação ao ciclo anterior</p>
                  </div>
                </DashboardCard>

                {/* 2. CAPITAL HUMANO - LIGADO AO MÓDULO ELENCO */}
                <DashboardCard 
                  title="Capital Humano" 
                  color="border-blue-500/20" 
                  icon={<Users size={16} className="text-blue-500" />}
                  onAction={() => window.location.href = '/elenco'}
                >
                  <div className="mt-1">
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1">Corpo de Atletas</p>
                    <h3 className="text-4xl font-black text-white tracking-tighter italic">
                      {loading ? '--' : stats.totalAthletes} <span className="text-indigo-500 text-lg">Membros</span>
                    </h3>
                    <div className="flex gap-2 mt-3">
                      <span className="text-[9px] bg-slate-800/50 border border-white/5 text-slate-400 px-2 py-1 rounded-md uppercase font-bold">{stats.maleAthletes} Masculino</span>
                      <span className="text-[9px] bg-slate-800/50 border border-white/5 text-slate-400 px-2 py-1 rounded-md uppercase font-bold">{stats.femaleAthletes} Feminino</span>
                    </div>
                  </div>
                </DashboardCard>

                {/* 3. RADAR OPERACIONAL - LIGADO À AGENDA */}
                <DashboardCard 
                  title="Radar Operacional" 
                  color="border-orange-500/20" 
                  icon={<Activity size={16} className="text-orange-500" />}
                  onAction={() => window.location.href = '/agenda'}
                >
                  <div className="space-y-3 mt-1">
                    <div className="flex justify-between items-center border-b border-white/5 pb-2">
                      <span className="text-[10px] font-bold text-slate-500 uppercase">Próximo Treino</span>
                      <span className="text-[10px] text-orange-400 font-black italic uppercase">Hoje 20:00</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-bold text-slate-500 uppercase">Eventos Ativos</span>
                      <span className="text-[10px] text-white font-black italic uppercase">{stats.activeEvents.toString().padStart(2, '0')} Campanhas</span>
                    </div>
                  </div>
                </DashboardCard>

                {/* 4. DIRETRIZES & OKRS - LIGADO À ESTRATÉGIA */}
                <DashboardCard 
                  title="Diretrizes & OKRs" 
                  color="border-purple-500/20" 
                  icon={<Target size={16} className="text-purple-500" />}
                >
                  <div className="flex flex-col gap-3 mt-1">
                    <div className="bg-indigo-500/5 border border-indigo-500/10 p-3 rounded-xl">
                      <p className="text-[9px] font-black text-indigo-400 uppercase mb-1 italic">Prioridade Alpha</p>
                      <p className="text-xs text-white font-bold leading-tight uppercase">Lançamento de Campanha de Sócios 2026</p>
                    </div>
                    <div className="w-full bg-slate-900 h-1 rounded-full overflow-hidden">
                      <div className="bg-indigo-500 h-full w-[65%] shadow-[0_0_10px_rgba(99,102,241,0.5)]" />
                    </div>
                  </div>
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

// Componente de Card Refinado conforme o Padrão Visual das Imagens
const DashboardCard: React.FC<{
  title: string, 
  color: string, 
  icon: React.ReactNode, 
  children: React.ReactNode,
  onAction?: () => void
}> = ({ title, color, icon, children, onAction }) => (
  <div className={`bg-[#1e293b]/20 backdrop-blur-md border ${color} rounded-[2rem] p-6 flex flex-col shadow-2xl hover:bg-[#1e293b]/40 transition-all duration-500 group relative`}>
    {onAction && (
      <button 
        onClick={onAction}
        className="absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity p-2 bg-white/5 rounded-xl text-slate-400 hover:text-white"
      >
        <ArrowUpRight size={18} />
      </button>
    )}
    <h3 className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] mb-6 flex items-center gap-2 border-b border-white/5 pb-4">
      {icon} {title}
    </h3>
    <div className="flex-1">{children}</div>
  </div>
);

export default DashboardMaster;