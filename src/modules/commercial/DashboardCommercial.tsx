import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  TrendingUp, 
  BarChart3, 
  Wallet, 
  ArrowRight, 
  Zap, 
  ShieldCheck, 
  X 
} from 'lucide-react';
import JulesAgent from '../../lib/Jules';

/** * CCO COMMAND CENTER - PROTOCOLO NEXUS
 * Gestão Comercial de Alta Densidade e Sponsor Lab integration.
 */

interface Lead {
  id: string;
  company: string;
  value: number;
  stage: 'PROSPECCAO' | 'REUNIAO' | 'PROPOSTA' | 'FECHAMENTO';
}

const DashboardCommercial: React.FC = () => {
  const navigate = useNavigate();
  const [expandedCard, setExpandedCard] = useState<'PIPELINE' | 'LAB' | 'INVENTORY' | 'REVENUE' | null>(null);

  const leads: Lead[] = [
    { id: '1', company: 'Tech Solutions Inc', value: 15000, stage: 'PROPOSTA' },
    { id: '2', company: 'Varejo Global', value: 5000, stage: 'REUNIAO' },
    { id: '3', company: 'Academia FitLife', value: 3000, stage: 'PROSPECCAO' },
  ];

  // 1. CONTAINER: SALES PIPELINE
  const renderPipelineCard = () => (
    <div 
      onClick={() => setExpandedCard('PIPELINE')}
      className="bg-[#1e293b]/40 border border-orange-500/30 hover:border-orange-500 hover:bg-[#1e293b]/60 rounded-2xl p-6 cursor-pointer transition-all duration-300 group relative overflow-hidden h-full flex flex-col justify-between"
    >
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition">
        <TrendingUp size={64} className="text-orange-500" />
      </div>
      <div>
        <h3 className="text-orange-400 text-xs font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-orange-500"></span> Sales Pipeline
        </h3>
        <h2 className="text-3xl font-black text-white leading-tight italic">R$ 23.000</h2>
        <p className="text-xs text-slate-400 mt-1 italic italic">Em negociação ativa</p>
      </div>
      <div className="mt-4 flex gap-1">
        {leads.map(l => (
          <div key={l.id} className="h-1 flex-1 bg-orange-500/20 rounded-full overflow-hidden">
            <div className="bg-orange-500 h-full" style={{ width: l.stage === 'PROPOSTA' ? '75%' : '25%' }}></div>
          </div>
        ))}
      </div>
    </div>
  );

  // 2. CONTAINER: SPONSOR LAB
  const renderLabCard = () => (
    <div 
      onClick={() => setExpandedCard('LAB')}
      className="bg-gradient-to-br from-indigo-900/40 to-purple-900/40 border border-indigo-500/30 hover:border-indigo-500 rounded-2xl p-6 cursor-pointer transition-all duration-300 group relative overflow-hidden h-full flex flex-col justify-between shadow-[0_0_20px_rgba(99,102,241,0.1)]"
    >
      <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:scale-110 transition-transform">
        <Zap size={64} className="text-indigo-400" />
      </div>
      <div>
        <h3 className="text-indigo-300 text-xs font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></span> Sponsor Lab
        </h3>
        <h2 className="text-xl font-bold text-white leading-tight max-w-[180px] italic">Configurar Nova Proposta Inteligente</h2>
      </div>
      <div className="flex items-center text-indigo-400 text-xs font-bold gap-2 italic">
        ABRIR MÁQUINA DE PROMPTS <ArrowRight size={14} />
      </div>
    </div>
  );

  // 3. CONTAINER: ASSET INVENTORY
  const renderInventoryCard = () => (
    <div 
      onClick={() => setExpandedCard('INVENTORY')}
      className="bg-[#1e293b]/40 border border-cyan-500/30 hover:border-cyan-500 hover:bg-[#1e293b]/60 rounded-2xl p-6 cursor-pointer transition-all duration-300 group relative overflow-hidden h-full flex flex-col justify-between"
    >
      <div className="absolute top-0 right-0 p-4 opacity-10">
        <BarChart3 size={64} className="text-cyan-500" />
      </div>
      <div>
        <h3 className="text-cyan-400 text-xs font-bold uppercase tracking-widest mb-2">Asset Inventory</h3>
        <h2 className="text-4xl font-black text-white italic">65%</h2>
        <p className="text-xs text-slate-400 uppercase tracking-widest mt-1 italic">Ocupação de Cotas</p>
      </div>
      <div className="text-[10px] text-cyan-300 font-mono bg-cyan-500/10 border border-cyan-500/20 p-2 rounded uppercase font-bold italic">
        DISPONÍVEL: 2 Placas de Campo, 1 Manga de Uniforme
      </div>
    </div>
  );

  // 4. CONTAINER: REVENUE CLOUD
  const renderRevenueCard = () => (
    <div 
      onClick={() => setExpandedCard('REVENUE')}
      className="bg-[#1e293b]/40 border border-emerald-500/30 hover:border-emerald-500 hover:bg-[#1e293b]/60 rounded-2xl p-6 cursor-pointer transition-all duration-300 group relative overflow-hidden h-full flex flex-col justify-between"
    >
      <div className="absolute top-0 right-0 p-4 opacity-10">
        <Wallet size={64} className="text-emerald-500" />
      </div>
      <div>
        <h3 className="text-emerald-400 text-xs font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
            <ShieldCheck size={14} /> Revenue Cloud
        </h3>
        <h2 className="text-2xl font-black text-white italic">R$ 8.400 <span className="text-xs text-slate-500 font-normal italic">/mês</span></h2>
        <p className="text-xs text-slate-400 mt-1 italic">Receita Recorrente Comercial</p>
      </div>
      <div className="flex justify-between items-center mt-4 italic">
          <span className="text-[10px] text-emerald-500 font-bold bg-emerald-500/10 px-2 py-1 rounded">● EM DIA</span>
          <span className="text-[10px] text-slate-500 italic">Próximo venc: 10/02</span>
      </div>
    </div>
  );

  return (
    <div className="h-full flex flex-col relative font-sans italic">
      <div className="mb-6">
        <h1 className="text-2xl font-black text-white tracking-tight uppercase">CCO Command Center</h1>
        <p className="text-xs text-slate-400 uppercase tracking-[0.3em] italic">Joinville Gladiators • Gestão Comercial</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 flex-1 min-h-0">
        {renderPipelineCard()}
        {renderLabCard()}
        {renderInventoryCard()}
        {renderRevenueCard()}
      </div>

      {/* OVERLAY DE EXPANSÃO */}
      {expandedCard && (
        <div className="absolute inset-0 z-50 bg-[#020617]/95 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-[#0f172a] w-full max-w-5xl h-[85vh] rounded-2xl border border-slate-700 shadow-2xl flex flex-col overflow-hidden relative font-sans">
            <div className="p-6 border-b border-slate-700 bg-[#1e293b] flex justify-between items-center italic">
              <h2 className="text-xl font-bold text-white uppercase tracking-widest">
                {expandedCard === 'LAB' ? '🧪 Sponsor Lab: Deep Analysis' : `Módulo: ${expandedCard}`}
              </h2>
              <button onClick={() => setExpandedCard(null)} className="p-2 hover:bg-slate-700 rounded-full text-slate-400 hover:text-white transition">
                <X size={24} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar italic">
               {expandedCard === 'LAB' ? (
                 <div className="text-center py-20">
                    <p className="text-slate-400 mb-4">Redirecionando para o ambiente de Engenharia de Nódulos...</p>
                    <button 
                      onClick={() => navigate('/comercial/sponsor-lab')}
                      className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-black rounded-xl shadow-lg shadow-indigo-500/20 transition transform active:scale-95 uppercase"
                    >
                      INICIAR SPONSOR LAB 🧬
                    </button>
                 </div>
               ) : (
                 <div className="text-center py-20 text-slate-600 uppercase font-bold tracking-widest">
                    Funcionalidade em desenvolvimento no Protocolo Nexus
                 </div>
               )}
            </div>
          </div>
        </div>
      )}

      <JulesAgent context="DASHBOARD" />
    </div>
  );
};

export default DashboardCommercial;