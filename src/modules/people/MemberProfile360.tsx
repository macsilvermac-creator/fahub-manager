import React, { useState } from 'react';
import { 
  ArrowLeft, ShieldAlert, TrendingUp, 
  Award, FileText, CheckCircle2 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/**
 * Ficha 360º Operacional - Protocolo FAHUB
 * Build corrigido (TS6133) com manutenção integral do visual master.
 */
const MemberProfile360: React.FC = () => {
  const navigate = useNavigate();
  
  // Estado para controle de abas operacionais
  const [activeTab, setActiveTab] = useState<'stats' | 'docs'>('stats');

  // Dados do Atleta - Gladiators Fit
  const memberData = {
    name: "Gabriel Silva",
    position: "Linebacker",
    number: "52",
    stats: { physical: "92%", tactical: "85%", character: "95%" },
    healthStatus: "Apto para Contato",
  };

  return (
    <div className="min-h-screen bg-[#F1F5F9] pb-20">
      {/* Header Profile HUD */}
      <div className="bg-slate-900 h-64 relative">
        <nav className="p-6 flex items-center justify-between relative z-10">
          <button 
            onClick={() => navigate('/human-capital')}
            className="w-12 h-12 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/20 transition-all outline-none"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="bg-emerald-500 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase italic shadow-lg">
            Gladiators Fit: Elite
          </div>
        </nav>

        {/* Avatar e Infos Centrais */}
        <div className="absolute -bottom-16 left-10 flex items-end gap-8">
          <div className="w-40 h-40 rounded-[2.5rem] bg-slate-800 border-8 border-[#F1F5F9] shadow-2xl flex items-center justify-center overflow-hidden">
             <span className="text-4xl font-black text-white italic">GS</span>
          </div>
          <div className="pb-4">
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter uppercase italic leading-none">
              {memberData.name} <span className="text-blue-600">#{memberData.number}</span>
            </h1>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-[0.3em] mt-2 italic">{memberData.position}</p>
          </div>
        </div>
      </div>

      <main className="max-w-[1400px] mx-auto px-10 pt-24 grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Coluna de Status e Saúde */}
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2 italic">
              <ShieldAlert size={14} className="text-emerald-500" /> Status de Disponibilidade
            </h3>
            <div className="flex items-center gap-4 p-5 bg-emerald-50 rounded-3xl border border-emerald-100">
              <CheckCircle2 className="text-emerald-600" size={24} />
              <span className="text-sm font-black text-emerald-900 uppercase italic tracking-tight">{memberData.healthStatus}</span>
            </div>
          </div>

          <div className="bg-[#0F172A] p-8 rounded-[2.5rem] shadow-2xl text-white relative overflow-hidden group">
             <TrendingUp size={150} className="absolute -right-10 -bottom-10 text-white/5 group-hover:scale-110 transition-transform duration-1000" />
             <h3 className="text-[10px] font-black uppercase tracking-widest text-blue-400 mb-8 italic">Métricas Pro-Style</h3>
             <div className="space-y-8 relative z-10">
                <div className="space-y-2">
                  <div className="flex justify-between text-[9px] font-black uppercase tracking-widest">
                    <span className="text-slate-400 italic">Força e Condição</span>
                    <span className="text-blue-400">{memberData.stats.physical}</span>
                  </div>
                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]" style={{ width: memberData.stats.physical }} />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-[9px] font-black uppercase tracking-widest">
                    <span className="text-slate-400 italic">QI Tático (Playbook)</span>
                    <span className="text-emerald-400">{memberData.stats.tactical}</span>
                  </div>
                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full shadow-[0_0_10px_rgba(16,185,129,0.5)]" style={{ width: memberData.stats.tactical }} />
                  </div>
                </div>
             </div>
          </div>
        </div>

        {/* Painel Central Operacional */}
        <div className="lg:col-span-2 space-y-8"></div>