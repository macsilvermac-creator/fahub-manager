import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import DashboardSidebar from './components/DashboardSidebar';
import DashboardMarketing from './DashboardMarketing';
import DashboardCommercial from '../commercial/DashboardCommercial'; 
import JulesAgent from '../../lib/Jules';
import EventTicker from '../../components/EventTicker';
import { 
  Users, 
  Activity, 
  Target, 
  ArrowUpRight,
  ClipboardCheck,
  Shield
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/**
 * DASHBOARD MASTER - PROTOCOLO NEXUS
 * Interface adaptativa: Diretor de Esportes (Foco em Material Humano).
 */

interface DashboardCardProps {
  title: string;
  color: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  onAction: () => void;
}

const DashboardMaster: React.FC = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [persona, setPersona] = useState<string>('VISITANTE');
  const [loading, setLoading] = useState(true);
  
  // Estado para Censo de Material Humano
  const [stats, setStats] = useState({
    totalMembers: 0,
    activeAthletes: 0,
    technicalReady: 85, 
    pendingTryouts: 0
  });

  useEffect(() => {
    // Injeção de Contexto via LocalStorage
    const savedPersona = localStorage.getItem('nexus_persona');
    if (savedPersona) setPersona(savedPersona);
    
    fetchSportsIntelligence();
  }, []);

  const fetchSportsIntelligence = async () => {
    setLoading(true);
    try {
      // Busca de Atletas e Membros (Tabela athletes como base de material humano)
      const { data: members, error } = await supabase.from('athletes').select('id, status');
      if (error) throw error;

      // Busca de Seletivas Ativas (TryoutLab integration)
      const { count: tryouts } = await supabase.from('athletes').select('id', { count: 'exact', head: true }).eq('status', 'inactive');

      setStats(prev => ({
        ...prev,
        totalMembers: members?.length || 0,
        activeAthletes: members?.filter(m => m.status === 'active').length || 0,
        pendingTryouts: tryouts || 0
      }));
    } catch (error) {
      console.error('[NEXUS ERROR]: Falha na sincronização de material humano', error);
    } finally {
      setLoading(false);
    }
  };

  // Identificação de Visão Operacional
  const isSportsDirector = persona === 'DIR_ESPORTES';
  const isMarketingView = persona === 'CMO';
  const isCommercialView = persona === 'CCO';

  return (
    <div className="flex flex-col h-screen bg-[#020617] overflow-hidden text-white font-sans selection:bg-indigo-500/30">
      <EventTicker />
      
      <div className="flex flex-1 overflow-hidden">
        <DashboardSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
        
        <div className="flex-1 flex flex-col overflow-y-auto relative bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-slate-900 via-[#020617] to-[#020617]">
          
          <header className="p-4 md:p-6 border-b border-white/5 bg-[#0f172a]/40 backdrop-blur-xl sticky top-0 z-30 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <button onClick={() => setSidebarOpen(true)} className="md:hidden p-2 text-gray-300 bg-slate-800 rounded-lg transition-colors">☰</button>
              <div>
                <h1 className="text-xl font-black text-white leading-tight uppercase italic tracking-tighter">
                  {isSportsDirector ? 'Sports Command' : 'Nexus Command'}
                </h1>
                <p className="text-[10px] text-slate-500 font-mono tracking-wider uppercase">
                  AUTH_ROLE: <span className="text-indigo-400 font-bold">{persona}</span>
                </p>
              </div>
            </div>
            
            <div className="hidden lg:flex items-center gap-2 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full">
               <div className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse" />
               <span className="text-[9px] font-black text-indigo-500 uppercase tracking-widest italic">Enlace Técnico Ativo</span>
            </div>
          </header>

          <main className="p-4 md:p-8 max-w-7xl mx-auto w-full mb-24 flex-1">
            
            {/* VISTAS ESPECÍFICAS DE SUBPÁGINAS */}
            {isCommercialView && <DashboardCommercial />}
            {isMarketingView && <DashboardMarketing />}

            {/* DASHBOARD 4 CONTAINERS: DIRETOR DE ESPORTES */}
            {isSportsDirector && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full animate-in fade-in slide-in-from-bottom-4 duration-700">
                
                {/* CONTAINER 01: MATRIZ DE CAPITAL HUMANO */}
                <DashboardCard 
                  title="Capital Humano" 
                  color="border-indigo-500/20" 
                  icon={<Users size={16} className="text-indigo-500" />}
                  onAction={() => navigate('/human-capital')}
                >
                  <div className="mt-1">
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1 italic">Censo da Entidade</p>
                    <h3 className="text-4xl font-black text-white tracking-tighter italic uppercase">
                      {loading ? '---' : stats.totalMembers} <span className="text-indigo-500 text-lg tracking-normal">Membros</span>
                    </h3>
                    <p className="text-[9px] text-slate-600 mt-2 font-mono uppercase font-bold tracking-widest italic">Clique para Gerenciar Perfis</p>
                  </div>
                </DashboardCard>

                {/* CONTAINER 02: RADAR DE PERFORMANCE & BASE */}
                <DashboardCard 
                  title="Performance & Base" 
                  color="border-emerald-500/20" 
                  icon={<Activity size={16} className="text-emerald-500" />}
                  onAction={() => navigate('/elenco')}
                >
                  <div className="mt-1">
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1 italic">Prontidão do Elenco</p>
                    <h3 className="text-4xl font-black text-emerald-400 tracking-tighter italic">
                      {stats.technicalReady}% <span className="text-white text-lg uppercase font-bold tracking-normal">Ready</span>
                    </h3>
                    <div className="w-full bg-slate-900 h-1 rounded-full mt-3 overflow-hidden shadow-inner">
                      <div className="bg-emerald-500 h-full w-[85%] shadow-[0_0_10px_rgba(16,185,129,0.5)] transition-all duration-1000" />
                    </div>
                  </div>
                </DashboardCard>

                {/* CONTAINER 03: OPERAÇÃO TÉCNICA (AGENDA) */}
                <DashboardCard 
                  title="Operação Técnica" 
                  color="border-orange-500/20" 
                  icon={<ClipboardCheck size={16} className="text-orange-500" />}
                  onAction={() => navigate('/agenda')}
                >
                  <div className="space-y-3 mt-1 font-bold">
                    <div className="flex justify-between items-center border-b border-white/5 pb-2">
                      <span className="text-[10px] text-slate-500 uppercase tracking-widest">Atividade CT</span>
                      <span className="text-[10px] text-orange-400 italic uppercase">Sincronizada</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] text-slate-500 uppercase tracking-widest">Sessões Elite</span>
                      <span className="text-[10px] text-white italic uppercase underline decoration-orange-500/30 underline-offset-4">Ver Cronograma</span>
                    </div>
                  </div>
                </DashboardCard>

                {/* CONTAINER 04: LAB DE RECRUTAMENTO */}
                <DashboardCard 
                  title="Recrutamento & Tryout" 
                  color="border-purple-500/20" 
                  icon={<Target size={16} className="text-purple-500" />}
                  onAction={() => navigate('/tryout-lab')}
                >
                  <div className="flex flex-col gap-3 mt-1">
                    <div className="bg-indigo-500/5 border border-indigo-500/10 p-4 rounded-2xl">
                      <p className="text-[9px] font-black text-indigo-400 uppercase mb-1 italic">Novos Ingressos</p>
                      <h4 className="text-xs text-white font-bold uppercase leading-tight">
                        {loading ? '--' : stats.pendingTryouts.toString().padStart(2, '0')} Candidatos em Avaliação
                      </h4>
                    </div>
                    <span className="text-[9px] text-slate-600 font-black uppercase tracking-[0.2em] italic">Acesse para Aprovação</span>
                  </div>
                </DashboardCard>
              </div>
            )}

            {/* FALLBACK: VISUALIZAÇÃO PADRÃO (OUTRAS PERSONAS) */}
            {!isSportsDirector && !isMarketingView && !isCommercialView && (
              <div className="flex flex-col items-center justify-center h-[50vh] text-center">
                <Shield className="text-slate-800 mb-6" size={64} />
                <h3 className="text-slate-500 font-black uppercase tracking-[0.3em] italic text-sm">
                  Aguardando Injeção de Contexto Nexus
                </h3>
              </div>
            )}
          </main>
          
          <JulesAgent context="DASHBOARD" />
        </div>
      </div>
    </div>
  );
};

const DashboardCard: React.FC<DashboardCardProps> = ({ title, color, icon, children, onAction }) => (
  <div 
    onClick={onAction}
    className={`bg-[#1e293b]/20 backdrop-blur-md border ${color} rounded-[2.5rem] p-8 flex flex-col shadow-2xl hover:bg-[#1e293b]/40 transition-all duration-500 group relative cursor-pointer`}
  >
    <div className="absolute top-8 right-8 opacity-0 group-hover:opacity-100 transition-all p-2 bg-white/5 rounded-xl text-slate-400 hover:text-white">
      <ArrowUpRight size={18} />
    </div>
    <h3 className="text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] mb-8 flex items-center gap-2 border-b border-white/5 pb-4">
      {icon} {title}
    </h3>
    <div className="flex-1">
      {children}
    </div>
  </div>
);

export default DashboardMaster;