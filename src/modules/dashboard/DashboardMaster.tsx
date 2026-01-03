import { useState, useEffect } from 'react';
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
  Shield,
  Wallet
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/**
 * DASHBOARD MASTER - PROTOCOLO NEXUS
 * Interface Unificada e Inviolável para a Cúpula Administrativa.
 * CORREÇÃO: Removida variável 'loading' não utilizada para sanar erro TS6133.
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
  
  // Estado Unificado de Dados (Financeiro + Humano)
  const [stats, setStats] = useState({
    balance: 0,
    totalMembers: 0,
    activeAthletes: 0,
    technicalReady: 85,
    pendingTryouts: 0
  });

  useEffect(() => {
    const savedPersona = localStorage.getItem('nexus_persona');
    if (savedPersona) setPersona(savedPersona);
    fetchCoreData();
  }, []);

  const fetchCoreData = async () => {
    try {
      // Busca de Membros
      const { data: members } = await supabase.from('athletes').select('id, status');
      
      setStats(prev => ({
        ...prev,
        totalMembers: members?.length || 0,
        activeAthletes: members?.filter(m => m.status === 'active').length || 0,
        balance: 145850.00
      }));
    } catch (error) {
      console.error('[NEXUS ERROR]: Falha na sincronização de dados mestre', error);
    }
  };

  // Definição da Cúpula Administrativa (Inviolável)
  const isExecutive = ['MASTER', 'PRESIDENTE', 'VICE_PRES'].includes(persona);
  const isSportsDirector = persona === 'DIR_ESPORTES';
  const isFinanceDirector = persona === 'CFO';
  
  // Condicional de Bloco Administrativo para exibição dos 4 Containers
  const showAdminGrid = isExecutive || isSportsDirector || isFinanceDirector;

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
                  {isSportsDirector ? 'Sports Command' : 'Nexus Command Center'}
                </h1>
                <p className="text-[10px] text-slate-500 font-mono tracking-wider uppercase">
                  ROLE: <span className="text-indigo-400 font-bold">{persona}</span> • STATUS: <span className="text-emerald-500 font-bold">ONLINE</span>
                </p>
              </div>
            </div>
          </header>

          <main className="p-4 md:p-8 max-w-7xl mx-auto w-full mb-24 flex-1">
            
            {/* VISTAS ESPECÍFICAS DE DEPARTAMENTO (MARKETING/COMERCIAL) */}
            {persona === 'CMO' && <DashboardMarketing />}
            {persona === 'CCO' && <DashboardCommercial />}

            {/* GRID DE 4 CONTAINERS UNIFICADO */}
            {showAdminGrid && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full animate-in fade-in slide-in-from-bottom-4 duration-700">
                
                {/* CONTAINER 01: FINANCEIRO (PRES/VICE/CFO) OU CAPITAL HUMANO (ESPORTES) */}
                <DashboardCard 
                  title={isSportsDirector ? "Capital Humano" : "Saúde Financeira"} 
                  color={isSportsDirector ? "border-indigo-500/20" : "border-emerald-500/20"} 
                  icon={isSportsDirector ? <Users size={16} /> : <Wallet size={16} />}
                  onAction={() => navigate(isSportsDirector ? '/human-capital' : '/financeiro')}
                >
                  <div className="mt-1">
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1 italic">
                      {isSportsDirector ? "Censo da Entidade" : "Liquidez Disponível"}
                    </p>
                    <h3 className="text-4xl font-black text-white tracking-tighter italic uppercase">
                      {isSportsDirector 
                        ? `${stats.totalMembers} Membros` 
                        : stats.balance.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </h3>
                  </div>
                </DashboardCard>

                {/* CONTAINER 02: PERFORMANCE & BASE */}
                <DashboardCard 
                  title="Performance & Base" 
                  color="border-indigo-500/20" 
                  icon={<Activity size={16} />}
                  onAction={() => navigate('/human-capital')}
                >
                  <div className="mt-1">
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1 italic">Prontidão do Elenco</p>
                    <h3 className="text-4xl font-black text-indigo-400 tracking-tighter italic">
                      {stats.technicalReady}% <span className="text-white text-lg uppercase font-bold tracking-normal">Ready</span>
                    </h3>
                  </div>
                </DashboardCard>

                {/* CONTAINER 03: OPERAÇÃO TÉCNICA (AGENDA) */}
                <DashboardCard 
                  title="Operação Técnica" 
                  color="border-orange-500/20" 
                  icon={<ClipboardCheck size={16} />}
                  onAction={() => navigate('/agenda')}
                >
                  <div className="space-y-3 mt-1 font-bold">
                    <div className="flex justify-between items-center border-b border-white/5 pb-2">
                      <span className="text-[10px] text-slate-500 uppercase tracking-widest">Cronograma Semanal</span>
                      <span className="text-[10px] text-orange-400 italic uppercase">Ativo</span>
                    </div>
                    <span className="text-[10px] text-white italic uppercase underline decoration-orange-500/30 underline-offset-4">Acessar Agenda Geral</span>
                  </div>
                </DashboardCard>

                {/* CONTAINER 04: ESTRATÉGIA & RECRUTAMENTO */}
                <DashboardCard 
                  title={isSportsDirector ? "Recrutamento & Tryout" : "Diretrizes & OKRs"} 
                  color="border-purple-500/20" 
                  icon={isSportsDirector ? <Target size={16} /> : <Shield size={16} />}
                  onAction={() => navigate(isSportsDirector ? '/tryout-lab' : '/estrategia')}
                >
                  <div className="mt-1">
                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-1 italic">
                      {isSportsDirector ? "Novos Ingressos" : "Metas da Gestão"}
                    </p>
                    <h3 className="text-2xl font-black text-white tracking-tighter italic uppercase">
                      {isSportsDirector ? `${stats.pendingTryouts} Candidatos` : "Status: 82% Concluído"}
                    </h3>
                  </div>
                </DashboardCard>
              </div>
            )}

            {/* FALLBACK DE SEGURANÇA PARA PERSONAS NÃO MAPEADAS */}
            {!showAdminGrid && persona !== 'CMO' && persona !== 'CCO' && (
              <div className="flex flex-col items-center justify-center h-[50vh] text-center">
                <Shield className="text-slate-800 mb-6 animate-pulse" size={64} />
                <h3 className="text-slate-500 font-black uppercase tracking-[0.3em] italic text-sm">
                  Restringindo Acesso Hierárquico...
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
      <span className="text-indigo-500">{icon}</span> {title}
    </h3>
    <div className="flex-1">
      {children}
    </div>
  </div>
);

export default DashboardMaster;