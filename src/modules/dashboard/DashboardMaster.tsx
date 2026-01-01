import React from 'react';
import { TrendingUp, Users, Kanban, Activity, ArrowRight } from 'lucide-react';

/**
 * Interface rigorosa para os 4 Pilares de Decisão da Presidência
 */
interface MasterPillar {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ElementType;
  color: string;
  bg: string;
  content: React.ReactNode;
}

const DashboardMaster: React.FC = () => {
  // Valor fixo temporário para o build passar sem erro de variáveis não lidas
  const goalPercent = 60; 

  const pillars: MasterPillar[] = [
    {
      id: 'finance',
      title: 'Saúde Financeira',
      subtitle: 'Consolidado da Entidade',
      icon: TrendingUp,
      color: 'text-emerald-500',
      bg: 'bg-emerald-500/10',
      content: (
        <div className="space-y-3">
          <div className="flex justify-between items-end">
            <span className="text-3xl font-black text-slate-800 tracking-tighter italic">R$ 45.200</span>
            <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg italic">SUPERÁVIT</span>
          </div>
          <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
            <div className="bg-emerald-500 h-full w-[72%]" />
          </div>
          <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.1em]">Atingimento de Meta: 72%</p>
        </div>
      )
    },
    {
      id: 'patrimony',
      title: 'Patrimônio Humano',
      subtitle: 'Atletas & Membros Ativos',
      icon: Users,
      color: 'text-blue-500',
      bg: 'bg-blue-500/10',
      content: (
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-50 p-4 rounded-[1.5rem] border border-slate-100">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Profissional</p>
            <p className="text-2xl font-black text-slate-800 italic">84</p>
          </div>
          <div className="bg-slate-50 p-4 rounded-[1.5rem] border border-slate-100">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Base/Escola</p>
            <p className="text-2xl font-black text-slate-800 italic">126</p>
          </div>
        </div>
      )
    },
    {
      id: 'strategy',
      title: 'Evolução Estratégica',
      subtitle: 'Metas & OKRs Ativos',
      icon: Kanban,
      color: 'text-orange-500',
      bg: 'bg-orange-500/10',
      content: (
        <div className="flex items-center gap-4">
          <div className="relative w-16 h-16 flex items-center justify-center">
            <svg className="w-full h-full rotate-[-90deg]">
              <circle cx="32" cy="32" r="28" fill="none" stroke="#f1f5f9" strokeWidth="6" />
              <circle 
                cx="32" cy="32" r="28" 
                fill="none" 
                stroke="#f97316" 
                strokeWidth="6" 
                strokeDasharray="175.9" 
                strokeDashoffset={175.9 - (175.9 * goalPercent) / 100} 
              />
            </svg>
            <span className="absolute text-xs font-black text-slate-800">{goalPercent}%</span>
          </div>
          <div className="flex-1">
            <p className="text-xs font-bold text-slate-700 leading-tight">Expansão de Unidades</p>
            <p className="text-[9px] text-orange-600 font-black uppercase italic mt-1">Status: Em Andamento</p>
          </div>
        </div>
      )
    },
    {
      id: 'ops',
      title: 'Status Operacional',
      subtitle: 'Monitoramento de Equipes',
      icon: Activity,
      color: 'text-purple-500',
      bg: 'bg-purple-500/10',
      content: (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-purple-50 px-4 py-3 rounded-2xl border border-purple-100">
            <span className="text-[11px] font-black text-purple-700 uppercase italic">Tackle Masculino</span>
            <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-ping" />
          </div>
          <p className="text-[10px] text-slate-500 font-bold italic leading-tight">Jules: "3 treinos realizados hoje."</p>
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* 1. Sticky Banner (Protocolo FAHUB) */}
      <div className="bg-slate-900 text-white p-3 sticky top-0 z-50 flex items-center justify-between px-6 border-b border-slate-800 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] italic">Agenda: Treino de Campo - 19:30</span>
        </div>
        <button className="text-[9px] font-black bg-white/10 px-4 py-1.5 rounded-lg uppercase hover:bg-white/20 transition-all border border-white/5">Detalhes</button>
      </div>

      <div className="p-4 md:p-10 space-y-10 max-w-7xl mx-auto">
        {/* 2. Título de Autoridade */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-10 border-b border-slate-100">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter italic leading-none uppercase">
              Dashboard <span className="text-blue-600">Presidência</span>
            </h1>
            <p className="text-slate-400 text-[11px] font-bold uppercase tracking-[0.4em] mt-4 flex items-center gap-3 italic">
              <span className="w-8 h-[1px] bg-slate-300" /> Joinville Gladiators / Portal Nexus
            </p>
          </div>
          
          <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-[2rem] border border-slate-100 shadow-sm">
            <div className="text-right">
              <p className="text-xs font-black text-slate-800 leading-none">Gestão Master</p>
              <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Presidente</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white font-black text-xl shadow-lg shadow-blue-200">JG</div>
          </div>
        </header>

        {/* 3. Grid de Pilares Master (Adeus cards pequenos) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {pillars.map((pillar) => {
            const IconComponent = pillar.icon;
            return (
              <div 
                key={pillar.id}
                className="group relative bg-white rounded-[3rem] p-10 border border-slate-100 shadow-2xl shadow-slate-200/40 hover:shadow-blue-900/10 transition-all cursor-pointer overflow-hidden active:scale-[0.98]"
              >
                <div className="flex items-start justify-between mb-8 relative z-10">
                  <div className="flex items-center gap-6">
                    <div className={`${pillar.bg} ${pillar.color} p-5 rounded-[1.8rem]`}>
                      <IconComponent size={36} strokeWidth={2.5} />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-slate-800 tracking-tight italic">{pillar.title}</h3>
                      <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mt-1 opacity-70">{pillar.subtitle}</p>
                    </div>
                  </div>
                  <ArrowRight className="text-slate-200 group-hover:text-blue-500 group-hover:translate-x-3 transition-all" size={28} />
                </div>

                <div className="relative z-10">
                  {pillar.content}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DashboardMaster;