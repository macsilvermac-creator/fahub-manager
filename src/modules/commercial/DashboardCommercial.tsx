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
    { id: '1', company: 'TECH SOLUTIONS INC', value: 15000, stage: 'PROPOSTA' },
    { id: '2', company: 'VAREJO GLOBAL', value: 5000, stage: 'REUNIAO' },
    { id: '3', company: 'ACADEMIA FITLIFE', value: 3000, stage: 'PROSPECCAO' },
  ];

  return (
    <div className="h-full flex flex-col relative animate-in fade-in duration-500 selection:bg-orange-500/30">
      
      {/* HEADER DO MÓDULO - SKIN NEXUS */}
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4 bg-[#0f172a]/40 p-6 rounded-3xl border border-white/5 backdrop-blur-sm">
        <div>
           <h1 className="text-3xl font-black italic text-white tracking-tighter uppercase">
             CCO <span className="text-orange-500">Command</span>
           </h1>
           <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.3em] mt-1 italic">
             Comercial • Sponsor Lab • Revenue Tracking
           </p>
        </div>
        <div className="flex items-center gap-3 bg-white/5 px-4 py-2 rounded-xl border border-white/5">
          <div className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
          <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">Enlace Comercial Ativo</span>
        </div>
      </div>

      {/* GRID 2x2 - PROTOCOLO DE ALTA DISPONIBILIDADE */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1 min-h-0">
        
        {/* SALES PIPELINE */}
        <div 
          onClick={() => setExpandedCard('PIPELINE')}
          className="bg-[#1e293b]/20 border border-orange-500/20 hover:border-orange-500/50 hover:bg-[#1e293b]/40 rounded-[2rem] p-8 cursor-pointer transition-all duration-500 group relative overflow-hidden flex flex-col justify-between backdrop-blur-sm"
        >
          <TrendingUp size={80} className="absolute -top-4 -right-4 text-orange-500/10 group-hover:text-orange-500/20 transition-all duration-700 rotate-12" />
          <div>
            <h3 className="text-orange-400 text-[10px] font-black uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-orange-500 animate-pulse" /> Sales Pipeline
            </h3>
            <h2 className="text-4xl font-black text-white tracking-tighter italic uppercase">R$ 23.000</h2>
            <p className="text-[10px] text-slate-500 font-mono mt-2 uppercase tracking-widest">Negociação de Nódulo Ativa</p>
          </div>
          <div className="mt-8 flex gap-1.5">
            {leads.map(l => (
              <div key={l.id} className="h-1.5 flex-1 bg-white/5 rounded-full overflow-hidden">
                <div 
                  className="bg-orange-500 h-full shadow-[0_0_8px_#f97316]" 
                  style={{ width: l.stage === 'PROPOSTA' ? '75%' : '25%' }} 
                />
              </div>
            ))}
          </div>
        </div>

        {/* SPONSOR LAB (DEEP ANALYSIS) */}
        <div 
          onClick={() => setExpandedCard('LAB')}
          className="bg-gradient-to-br from-indigo-900/20 to-purple-900/20 border border-indigo-500/20 hover:border-indigo-500 rounded-[2rem] p-8 cursor-pointer transition-all duration-500 group relative overflow-hidden flex flex-col justify-between backdrop-blur-sm shadow-[0_0_30px_rgba(99,102,241,0.05)]"
        >
          <Zap size={80} className="absolute -top-4 -right-4 text-indigo-400/10 group-hover:text-indigo-400/20 group-hover:scale-110 transition-all duration-700" />
          <div>
            <h3 className="text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em] mb-4 flex items-center gap-2 italic">
              <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" /> Sponsor Lab
            </h3>
            <h2 className="text-2xl font-black text-white leading-tight italic uppercase tracking-tighter max-w-[200px]">
              Engenharia de Propostas
            </h2>
          </div>
          <div className="flex items-center text-indigo-400 text-[10px] font-black gap-2 italic uppercase tracking-widest group-hover:translate-x-2 transition-transform">
            Abrir Máquina de Prompts <ArrowRight size={14} />
          </div>
        </div>

        {/* ASSET INVENTORY */}
        <div 
          onClick={() => setExpandedCard('INVENTORY')}
          className="bg-[#1e293b]/20 border border-cyan-500/20 hover:border-cyan-500/50 hover:bg-[#1e293b]/40 rounded-[2rem] p-8 cursor-pointer transition-all duration-500 group relative overflow-hidden flex flex-col justify-between backdrop-blur-sm"
        >
          <BarChart3 size={80} className="absolute -top-4 -right-4 text-cyan-500/10 group-hover:text-cyan-500/20 transition-all duration-700" />
          <div>
            <h3 className="text-cyan-400 text-[10px] font-black uppercase tracking-[0.2em] mb-4 italic">Asset Inventory</h3>
            <h2 className="text-5xl font-black text-white tracking-tighter italic">65%</h2>
            <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] mt-2">Taxa de Ocupação de Cotas</p>
          </div>
          <div className="text-[9px] text-cyan-300 font-bold bg-cyan-500/5 border border-cyan-500/10 p-3 rounded-xl uppercase tracking-widest leading-relaxed">
            Disp: 2 Placas de Campo, 1 Manga de Uniforme
          </div>
        </div>

        {/* REVENUE CLOUD */}
        <div 
          onClick={() => setExpandedCard('REVENUE')}
          className="bg-[#1e293b]/20 border border-emerald-500/20 hover:border-emerald-500/50 hover:bg-[#1e293b]/40 rounded-[2rem] p-8 cursor-pointer transition-all duration-500 group relative overflow-hidden flex flex-col justify-between backdrop-blur-sm"
        >
          <Wallet size={80} className="absolute -top-4 -right-4 text-emerald-500/10 group-hover:text-emerald-500/20 transition-all duration-700" />
          <div>
            <h3 className="text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em] mb-4 flex items-center gap-2 italic">
               <ShieldCheck size={14} /> Revenue Cloud
            </h3>
            <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase">
              R$ 8.400 <span className="text-xs text-slate-500 font-bold lowercase tracking-normal">/mês</span>
            </h2>
            <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] mt-2">Receita Recorrente Comercial</p>
          </div>
          <div className="flex justify-between items-center mt-4">
              <span className="text-[9px] text-emerald-500 font-black bg-emerald-500/10 px-3 py-1 rounded-lg border border-emerald-500/20 tracking-widest uppercase">● EM DIA</span>
              <span className="text-[9px] text-slate-600 font-bold italic uppercase tracking-widest">Próximo venc: 10/02</span>
          </div>
        </div>

      </div>

      {/* OVERLAY DE EXPANSÃO - PROTOCOLO DE INTERFACE FULL-SCREEN */}
      {expandedCard && (
        <div className="fixed inset-0 z-[100] bg-[#020617]/95 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300">
           <div className="bg-[#0f172a] w-full max-w-5xl h-[85vh] rounded-[2.5rem] border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden">
              
              {/* Header do Overlay */}
              <div className="px-10 py-8 border-b border-white/5 bg-white/[0.02] flex justify-between items-center">
                 <h2 className="text-2xl font-black text-white flex items-center gap-4 italic uppercase tracking-tighter">
                    {expandedCard === 'LAB' ? <Zap className="text-indigo-500" /> : <TrendingUp className="text-orange-500" />}
                    {expandedCard === 'LAB' ? '🧪 Sponsor Lab: Deep Analysis' : `Módulo: ${expandedCard}`}
                 </h2>
                 <button 
                  onClick={() => setExpandedCard(null)} 
                  className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl text-slate-400 hover:text-white transition-all"
                 >
                    <X size={24}