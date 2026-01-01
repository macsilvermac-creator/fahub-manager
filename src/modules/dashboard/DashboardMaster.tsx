import React from 'react';
import { TrendingUp, Users, Kanban, Activity, ArrowRight } from 'lucide-react';

/**
 * Interface para os 4 Pilares de Decisão da Presidência
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
            <span className="text-3xl font-black text-slate-800 tracking-tighter">R$ 45.200</span>
            <span className="text-[10px] font-black text-emerald-600 bg-emerald-50 px-2 py-1 rounded-lg">SUPERÁVIT</span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
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
        <div className="grid grid-cols-2 gap-4 mt-1">
          <div className="bg-slate-50 p-4 rounded-3xl border border-slate-100">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Profissional</p>
            <p className="text-2xl font-black text-slate-800">84</p>
          </div>
          <div className="bg-slate-50 p-4 rounded-3xl border border-slate-100">
            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Base/Escola</p>
            <p className="text-2xl font-black text-slate-800">126</p>
          </div>
        </div>
      )
    },
    {
      id: 'strategy',
      title: 'Evolução Estratégica',
      subtitle: 'Kanban de Metas OKR',
      icon: Kanban,
      color: 'text-orange-500',
      bg: 'bg-orange-500/10',
      content: (
        <div className="flex items-center gap-4">
          <div className="relative w-14 h-14 flex items-center justify-center">
            <svg className="w-full h-full rotate-[-90deg]">
              <circle cx="28" cy="28" r="24" fill="none" stroke="#f1f5f9" strokeWidth="6" />
              <circle cx="28" cy="28" r="24" fill="none" stroke="#f97316" strokeWidth="6" strokeDasharray="150" strokeDashoffset="60" />
            </svg>
            <span className="absolute text-[11px] font-black text-slate-800">60%</span>
          </div>
          <div className="flex-1">
            <p className="text-xs font-bold text-slate-700 leading-tight">Expansão de Unidades</p>
            <p className="text-[9px] text-orange-600 font-black uppercase italic mt-1">Status: Crítico</p>
          </div>
        </div>
      )
    },
    {
      id: 'ops',
      title: 'Monitoramento Operacional',
      subtitle: 'Status em Tempo Real',
      icon: Activity,
      color: 'text-purple-500',
      bg: 'bg-purple-500/10',
      content: (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-purple-50 px-4 py-3 rounded-2xl border border-purple-100">
            <span className="text-[11px] font-black text-purple-700">Tackle em Treino</span>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-ping" />
          </div>
          <p className="text-[10px] text-slate-500 font-medium italic">IA: "Carga física elevada detectada hoje."</p>
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* 1. Sticky Banner (Unica Informação Temporal do Dash) */}
      <div className="bg-slate-900 text-white p-3 sticky top-0 z-50 flex items-center justify-between px-6 border-b border-slate-800 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em] italic">Agenda: Treino de Campo - 19:30</span>
        </div>
        <button className="text-[9px] font-black bg-white/10 px-4 py-1.5 rounded-lg uppercase hover:bg-white/20 transition-all">Ver Detalhes</button>
      </div>

      <div className="p-4 md:p-10 space-y-10 max-w-7xl mx-auto">
        {/* 2. Título de Autoridade */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-10 border-b border-slate-100">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter italic leading-none uppercase">
              Dashboard <span className="text-blue-600">Presidência</span>
            </h1>
            <p className="text-slate-400 text-[11px] font-bold uppercase tracking-[0.4em] mt-4 flex items-center gap-3">
              <span className="w-8 h-[1px] bg-slate-300" /> Joinville Gladiators / Nexus Portal
            </p>
          </div>
          <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-[2rem] border border-slate-100">
            <div className="text-right">
              <p className="text-xs font-black text-slate-800 leading-none">Gestão Master</p>
              <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Presidente</p>
            </div>
            <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white font-black text-xl shadow-xl shadow-blue-200">JG</div>
          </div>
        </header>

        {/* 3. Os 4 Contêineres Master (Eliminados os Cards Pequenos) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
          {pillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <div 
                key={pillar.id}
                className="group relative bg-white rounded-[3rem] p-10 border border-slate-100 shadow-2xl shadow-slate-200/40 hover:shadow-blue-900/10 transition-all cursor-pointer overflow-hidden active:scale-[0.98]"
              >
                <div className="flex items-start justify-between mb-8 relative z-10">
                  <div className="flex items-center gap-6">
                    <div className={`${pillar.bg} ${pillar.color} p-5 rounded-[2rem]`}>
                      <Icon size={36} strokeWidth={2.5} />
                    </div>
                    <div>
                      <h3 className="text-2xl font-black text-slate-800 tracking-tight">{pillar.title}</h3>
                      <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest mt-1 opacity-80">{pillar.subtitle}</p>
                    </div>
                  </div>
                  <ArrowRight className="text-slate-200 group-hover:text-blue-500 group-hover:translate-x-3 transition-all" size={28} />
                </div>

                <div className="relative z-10">
                  {pillar.content}
                </div>

                {/* Marca D'água Estilizada para Profundidade */}
                <Icon size={250} strokeWidth={1} className="absolute -right-12 -bottom-12 opacity-[0.03] text-slate-900 group-hover:scale-110 transition-transform duration-1000" />
              </div>
            );
          })}
        </div>

        {/* 4. Assistente Jules (Insight Estratégico) */}
        <div className="bg-slate-950 rounded-[3rem] p-8 text-white border border-slate-800 flex flex-col md:flex-row items-center gap-8 shadow-2xl relative overflow-hidden group">
          <div className="p-5 bg-blue-600 rounded-[2rem] shadow-lg shadow-blue-500/20">
            <Activity size={36} className="animate-pulse" />
          </div>
          <div className="flex-1 text-center md:text-left relative z-10">
            <p className="text-[10px] font-black uppercase tracking-[0.5em] text-blue-400 mb-3">Jules / Insight de Governança</p>
            <p className="text-xl font-medium leading-tight italic text-slate-300">
              "Presidente, identifiquei um excedente de caixa no <span className="text-white font-bold underline">Flag Feminino</span>. Sugiro reinvestir na meta de equipamentos. <span className="text-white font-black">Autoriza a transação?</span>"
            </p>
          </div>
          <button className="w-full md:w-auto bg-white text-slate-900 px-12 py-5 rounded-[2rem] font-black text-sm hover:bg-blue-50 transition-all shadow-2xl active:scale-95 z-10 whitespace-nowrap">
            AUTORIZAR AGORA
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardMaster;