import React, { useState } from 'react';
import { Share2, Users, DollarSign, X, Upload, Camera, BarChart2, ExternalLink, Zap } from 'lucide-react';
import JulesAgent from '../../lib/Jules';

// --- DEFINIÇÕES DE TIPOS (PROTOCOLO NEXUS) ---
interface Campaign {
  id: string;
  name: string;
  status: 'ACTIVE' | 'DRAFT' | 'PAUSED';
  link?: string;
  deadline: string;
  conversion: number;
}

interface Sponsor {
  id: string;
  name: string;
  logo: string;
  nextDeliverable: string;
  status: 'PENDING' | 'DONE';
}

const DashboardMarketing: React.FC = () => {
  const [expandedCard, setExpandedCard] = useState<'CAMPAIGNS' | 'SPONSORS' | 'FANBASE' | 'MEDIA' | null>(null);

  // MOCK DATA - SINCRONIZADO COM SCHEMA SUPABASE
  const activeCampaign: Campaign = {
    id: '1',
    name: 'SELETIVA 2026 (TRYOUT)',
    status: 'ACTIVE',
    link: 'https://forms.google.com/nexus-tryout',
    deadline: '05 DIAS RESTANTES',
    conversion: 142
  };

  const sponsors: Sponsor[] = [
    { id: '1', name: 'RED ZONE ENERGY', logo: '⚡', nextDeliverable: 'POST STORY (RECEBIDOS)', status: 'PENDING' },
    { id: '2', name: 'TOUCHDOWN BURGER', logo: '🍔', nextDeliverable: 'BANNER SITE', status: 'DONE' },
  ];

  return (
    <div className="h-full flex flex-col relative animate-in fade-in duration-500">
      
      {/* CABEÇALHO DO MÓDULO - SKIN NEXUS */}
      <div className="mb-8 flex flex-col md:flex-row justify-between items-start md:items-end gap-4 bg-[#0f172a]/40 p-6 rounded-3xl border border-white/5">
        <div>
           <h1 className="text-3xl font-black italic text-white tracking-tighter uppercase">
             CMO <span className="text-indigo-500">Hub</span>
           </h1>
           <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.3em] mt-1">
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
            <p className="text-[10px] text-slate-500 font-mono mt-2 uppercase tracking-widest">Active Link: Cloud Protocol</p>
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
          className="bg-[#1e293b]/20 border border-emerald-500/20 hover:border-emerald-500/50 hover:bg-[#1e293b]/40 rounded-[2rem] p-8 cursor-pointer transition-all duration-500 group relative overflow-hidden flex flex-col justify-between backdrop-blur-sm"
        >
          <DollarSign size={80} className="absolute -top-4 -right-4 text-emerald-500/10 group-hover:text-emerald-500/20 transition-all duration-700 -rotate-12" />
          <div>
            <h3 className="text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
               <span className="w-2 h-2 rounded-full bg-emerald-500" /> Sponsor Deck
            </h3>
            <div className="flex -space-x-3">
               {sponsors.map(s => (
                 <div key={s.id} className="w-12 h-12 rounded-2xl bg-slate-900 border border-white/10 flex items-center justify-center text-2xl shadow-xl transition-transform hover:scale-110" title={s.name}>{s.logo}</div>
               ))}
            </div>
          </div>
          <div className="mt-6 bg-red-500/5 border border-red-500/20 p-4 rounded-2xl">
            <p className="text-[9px] text-red-500 font-black uppercase tracking-[0.2em] mb-1 italic">● Critical Pending</p>
            <p className="text-xs text-white font-bold uppercase">{sponsors[0].nextDeliverable}</p>
          </div>
        </div>

        {/* SOCIAL RADAR */}
        <div 
          onClick={() => setExpandedCard('FANBASE')}
          className="bg-[#1e293b]/20 border border-pink-500/20 hover:border-pink-500/50 hover:bg-[#1e293b]/40 rounded-[2rem] p-8 cursor-pointer transition-all duration-500 group relative overflow-hidden flex flex-col justify-between backdrop-blur-sm"
        >
          <Users size={80} className="absolute -top-4 -right-4 text-pink-500/10 group-hover:text-pink-500/20 transition-all duration-700" />
          <div>
             <h3 className="text-pink-400 text-[10px] font-black uppercase tracking-[0.2em] mb-4 italic">Social Analytics</h3>
             <h2 className="text-5xl font-black text-white tracking-tighter italic">12.5k</h2>
             <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.2em] mt-2">Audiência Consolidada</p>
          </div>
          <div className="flex items-center gap-3 mt-4">
             <span className="text-emerald-400 font-black text-lg italic tracking-tighter">↑ 12%</span>
             <span className="text-[9px] text-slate-600 font-bold uppercase tracking-widest">Growth Weekly</span>
          </div>
        </div>

        {/* MEDIA COVERAGE */}
        <div 
          onClick={() => setExpandedCard('MEDIA')}
          className="bg-[#1e293b]/20 border border-orange-500/20 hover:border-orange-500/50 hover:bg-[#1e293b]/40 rounded-[2rem] p-8 cursor-pointer transition-all duration-500 group relative overflow-hidden flex flex-col justify-between backdrop-blur-sm"
        >
          <Camera size={80} className="absolute -top-4 -right-4 text-orange-500/10 group-hover:text-orange-500/20 transition-all duration-700" />
          <div>
             <h3 className="text-orange-400 text-[10px] font-black uppercase tracking-[0.2em] mb-4 italic">Media Coverage</h3>
             <p className="text-[9px] text-slate-500 font-black uppercase mb-1">Próxima Missão</p>
             <h2 className="text-2xl font-black text-white italic tracking-tighter uppercase">DOMINGO • 14:00</h2>
             <p className="text-[10px] text-orange-200/60 font-bold uppercase tracking-widest">Estádio Municipal vs Steamrollers</p>
          </div>
          <div className="flex gap-2 mt-6">
            <span className="px-3 py-1.5 bg-white/5 rounded-lg text-[9px] font-black text-slate-300 border border-white/5 uppercase tracking-widest">📸 PHOTO</span>
            <span className="px-3 py-1.5 bg-white/5 rounded-lg text-[9px] font-black text-slate-300 border border-white/5 uppercase tracking-widest">📹 DRONE</span>
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
                    {expandedCard === 'CAMPAIGNS' && <><Share2 className="text-indigo-500" /> War Room Status</>}
                    {expandedCard === 'SPONSORS' && <><DollarSign className="text-emerald-500" /> Sponsor Logistics</>}
                    {expandedCard === 'FANBASE' && <><Users className="text-pink-500" /> Social Intelligence</>}
                    {expandedCard === 'MEDIA' && <><Camera className="text-orange-500" /> Operational Media</>}
                 </h2>
                 <button onClick={() => setExpandedCard(