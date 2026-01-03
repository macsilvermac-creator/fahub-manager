import React, { useState } from 'react';
import { Share2, Users, DollarSign, X, Camera, Zap } from 'lucide-react';
import JulesAgent from '../../lib/Jules';

/** * CMO HUB - PROTOCOLO NEXUS
 * Módulo de Marketing e Expansão de Marca
 */

interface Campaign {
  id: string;
  name: string;
  status: 'ACTIVE' | 'DRAFT' | 'PAUSED';
  link?: string;
  deadline: string;
  conversion: number;
}

const DashboardMarketing: React.FC = () => {
  const [expandedCard, setExpandedCard] = useState<'CAMPAIGNS' | 'SPONSORS' | 'FANBASE' | 'MEDIA' | null>(null);

  // MOCK DATA - SINCRONIZADO COM PROTOCOLO NEXUS
  const activeCampaign: Campaign = {
    id: '1',
    name: 'SELETIVA 2026 (TRYOUT)',
    status: 'ACTIVE',
    link: 'https://forms.google.com/nexus-tryout',
    deadline: '05 DIAS RESTANTES',
    conversion: 142
  };

  return (
    <div className="h-full flex flex-col relative animate-in fade-in duration-500 selection:bg-indigo-500/30">
      
      {/* HEADER DO MÓDULO - SKIN NEXUS */}
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4 bg-[#0f172a]/40 p-6 rounded-3xl border border-white/5 backdrop-blur-sm">
        <div>
           <h1 className="text-3xl font-black italic text-white tracking-tighter uppercase">
             CMO <span className="text-indigo-500">Hub</span>
           </h1>
           <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.3em] mt-1 italic">
             Marketing • Expansão • Gestão de Marca
           </p>
        </div>
        <button className="flex items-center gap-3 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-xs font-black uppercase tracking-widest text-white transition-all shadow-lg shadow-indigo-900/20">
           <Zap size={16} /> Acessar Creative Lab
        </button>
      </div>

      {/* GRID 2x2 - PROTOCOLO DE ALTA DISPONIBILIDADE */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-1 min-h-0">
        
        {/* WAR ROOM: CAMPANHAS */}
        <div 
          onClick={() => setExpandedCard('CAMPAIGNS')}
          className="bg-[#1e293b]/20 border border-indigo-500/20 hover:border-indigo-500/50 hover:bg-[#1e293b]/40 rounded-[2rem] p-8 cursor-pointer transition-all duration-500 group relative overflow-hidden flex flex-col justify-between backdrop-blur-sm"
        >
          <Share2 size={80} className="absolute -top-4 -right-4 text-indigo-500/10 group-hover:text-indigo-500/20 transition-all duration-700 rotate-12" />
          <div>
            <h3 className="text-indigo-400 text-[10px] font-black uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" /> War Room
            </h3>
            <h2 className="text-3xl font-black text-white leading-tight italic uppercase tracking-tighter">{activeCampaign.name}</h2>
            <p className="text-[10px] text-slate-500 font-mono mt-2 uppercase tracking-widest italic text-left">Cloud Protocol Active</p>
          </div>
          <div className="mt-8">
             <div className="flex justify-between text-[10px] font-black uppercase mb-2 tracking-widest">
               <span className="text-slate-500">Conversão de Lead</span>
               <span className="text-white">{activeCampaign.conversion} / 200</span>
             </div>
             <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
               <div className="bg-indigo-500 h-full w-[70%] shadow-[0_0_12px_#6366f1]" />
             </div>
          </div>
        </div>

        {/* SPONSOR DECK */}
        <div 
          onClick={() => setExpandedCard('SPONSORS')}
          className="bg-[#1e293b]/20 border border-emerald-500/20 hover:border-emerald-500/50 rounded-[2rem] p-8 cursor-pointer transition-all duration-500 flex flex-col justify-between backdrop-blur-sm relative overflow-hidden"
        >
          <DollarSign size={80} className="absolute -top-4 -right-4 text-emerald-500/10" />
          <h3 className="text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em] mb-4 flex items-center gap-2 italic">
            <span className="w-2 h-2 rounded-full bg-emerald-500" /> Sponsor Deck
          </h3>
          <p className="text-xs text-white font-bold uppercase italic tracking-tight">Monitorando Parceiros Ativos</p>
        </div>

        {/* SOCIAL RADAR */}
        <div 
          onClick={() => setExpandedCard('FANBASE')}
          className="bg-[#1e293b]/20 border border-pink-500/20 hover:border-pink-500/50 rounded-[2rem] p-8 cursor-pointer transition-all duration-500 flex flex-col justify-between backdrop-blur-sm relative overflow-hidden"
        >
          <Users size={80} className="absolute -top-4 -right-4 text-pink-500/10" />
          <h3 className="text-pink-400 text-[10px] font-black uppercase tracking-[0.2em] mb-4 italic">Social Analytics</h3>
          <h2 className="text-5xl font-black text-white tracking-tighter italic uppercase leading-none">12.5k</h2>
        </div>

        {/* MEDIA COVERAGE */}
        <div 
          onClick={() => setExpandedCard('MEDIA')}
          className="bg-[#1e293b]/20 border border-orange-500/20 hover:border-orange-500/50 rounded-[2rem] p-8 cursor-pointer transition-all duration-500 flex flex-col justify-between backdrop-blur-sm relative overflow-hidden"
        >
          <Camera size={80} className="absolute -top-4 -right-4 text-orange-500/10" />
          <h3 className="text-orange-400 text-[10px] font-black uppercase tracking-[0.2em] mb-4 italic">Media Coverage</h3>
          <h2 className="text-2xl font-black text-white italic tracking-tighter uppercase leading-tight">DOMINGO • 14:00</h2>
        </div>
      </div>

      {/* OVERLAY DE EXPANSÃO */}
      {expandedCard && (
        <div className="fixed inset-0 z-[100] bg-[#020617]/95 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-300">
           <div className="bg-[#0f172a] w-full max-w-5xl h-[85vh] rounded-[2.5rem] border border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.5)] flex flex-col overflow-hidden">
              <div className="px-10 py-8 border-b border-white/5 bg-white/[0.02] flex justify-between items-center">
                 <h2 className="text-2xl font-black text-white flex items-center gap-4 italic uppercase tracking-tighter">
                    {expandedCard === 'CAMPAIGNS' && <Share2 className="text-indigo-500" />}
                    {expandedCard} MODULE OPERATIONAL
                 </h2>
                 <button onClick={() => setExpandedCard(null)} className="p-3 bg-white/5 hover:bg-white/10 rounded-2xl text-slate-400 hover:text-white transition-all">
                    <X size={24} />
                 </button>
              </div>
              <div className="flex-1 overflow-y-auto p-10 flex items-center justify-center bg-gradient-to-b from-transparent to-[#0a0a15]/50">
                 <p className="text-slate-500 font-black uppercase tracking-[0.3em] italic text-sm text-center">
                    Módulo em processamento no Protocolo Nexus
                 </p>
              </div>
           </div>
        </div>
      )}

      {/* RESOLVIDO TS2322: Contexto alterado para "SETTINGS" que é aceito pelo JulesAgent */}
      <JulesAgent context="SETTINGS" />
    </div>
  );
};

export default DashboardMarketing;