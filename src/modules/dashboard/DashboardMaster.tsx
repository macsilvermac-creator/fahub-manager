import React from 'react';
import { TrendingUp, Users, Kanban, Activity, ArrowRight } from 'lucide-react';

/**
 * Interface rigorosa para os 4 Contêineres Master
 */
interface MasterContainer {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ElementType;
  color: string;
  bg: string;
  content: React.ReactNode;
}

const DashboardMaster: React.FC = () => {
  const containers: MasterContainer[] = [
    {
      id: 'finance',
      title: 'Gestão Financeira',
      subtitle: 'Entidade & Projeção',
      icon: TrendingUp,
      color: 'text-emerald-500',
      bg: 'bg-emerald-500/10',
      content: (
        <div className="space-y-2">
          <div className="flex justify-between items-end">
            <span className="text-3xl font-black text-slate-800 tracking-tighter">R$ 45,2k</span>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">Superávit</span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
            <div className="bg-emerald-500 h-full w-[70%]" />
          </div>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Saúde de Caixa: 70%</p>
        </div>
      )
    },
    {
      id: 'patrimony',
      title: 'Patrimônio Humano',
      subtitle: 'Censo Geral de Atletas',
      icon: Users,
      color: 'text-blue-500',
      bg: 'bg-blue-500/10',
      content: (
        <div className="grid grid-cols-2 gap-3 mt-1">
          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
            <p className="text-[9px] font-black text-slate-400 uppercase">Profissional</p>
            <p className="text-xl font-black text-slate-700">84</p>
          </div>
          <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
            <p className="text-[9px] font-black text-slate-400 uppercase">Base/Escolha</p>
            <p className="text-xl font-black text-slate-700">126</p>
          </div>
        </div>
      )
    },
    {
      id: 'goals',
      title: 'Evolução Estratégica',
      subtitle: 'Metas & OKRs Ativos',
      icon: Kanban,
      color: 'text-orange-500',
      bg: 'bg-orange-500/10',
      content: (
        <div className="flex items-center gap-4">
          <div className="relative w-12 h-12 flex items-center justify-center">
            <svg className="w-full h-full rotate-[-90deg]">
              <circle cx="24" cy="24" r="20" fill="none" stroke="#f1f5f9" strokeWidth="5" />
              <circle cx="24" cy="24" r="20" fill="none" stroke="#f97316" strokeWidth="5" strokeDasharray="125" strokeDashoffset="50" />
            </svg>
            <span className="absolute text-[10px] font-black text-slate-800">60%</span>
          </div>
          <div>
            <p className="text-xs font-bold text-slate-700 leading-tight">Expansão de Unidades</p>
            <p className="text-[9px] text-orange-600 font-black uppercase italic">Jules: "Atenção a prazos"</p>
          </div>
        </div>
      )
    },
    {
      id: 'operations',
      title: 'Status Operacional',
      subtitle: 'Monitoramento Cross-Entity',
      icon: Activity,
      color: 'text-purple-500',
      bg: 'bg-purple-500/10',
      content: (
        <div className="space-y-3">
          <div className="flex items-center justify-between bg-purple-50 px-4 py-2 rounded-xl border border-purple-100">
            <span className="text-[11px] font-black text-purple-700">Tackle em Campo</span>
            <div className="flex gap-1">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
            </div>
          </div>
          <p className="text-[10px] text-slate-500 font-medium italic">Relatório de hoje: "Foco em Drills Técnicos"</p>
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* 1. Sticky Banner (Protocolo FAHUB) */}
      <div className="bg-slate-900 text-white p-3 sticky top-0 z-50 flex items-center justify-between px-6 shadow-lg border-b border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-ping" />
          <span className="text-[10px] font-black uppercase tracking-widest italic">PRÓXIMO EVENTO: Treino de Campo - 19:30</span>
        </div>
        <div className="flex gap-2">
          <button className="text-[9px] font-black bg-white/10 hover:bg-white/20 px-3 py-1 rounded-lg transition-all uppercase">Acessar Agenda</button>
        </div>
      </div>

      <div className="p-4 md:p-8 space-y-8 max-w-7xl mx-auto">
        {/* 2. Título da Tela */}
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-50 pb-8">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter italic leading-none">
              DASHBOARD <span className="text-blue-600">PRESIDÊNCIA</span>
            </h1>
            <p className="text-slate-400 text-[11px] font-bold uppercase tracking-[0.3em] mt-3 flex items-center gap-2">
              <span className="w-6 h-[1px] bg-slate-200" /> Joinville Gladiators / Nexus Portal
            </p>
          </div>
          
          <div className="flex items-center gap-4 bg-slate-50 p-3 rounded-[1.5rem] border border-slate-100">
            <div className="text-right">
              <p className="text-[10px] font-black text-slate-800 leading-none">Gestão Master</p>
              <p className="text-[9px] text-slate-400 font-bold uppercase mt-1">Nível de Acesso 01</p>
            </div>
            <div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center text-white font-black shadow-lg shadow-blue-200">
              JG
            </div>
          </div>
        </header>

        {/* 3. Os 4 Contêineres Master (Lógica 2x2 ou 1x1) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-10">
          {containers.map((item) => {
            const Icon = item.icon;
            return (
              <div 
                key={item.id}
                className="group relative bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl shadow-slate-200/30 hover:shadow-2xl hover:shadow-blue-900/10 transition-all cursor-pointer overflow-hidden active:scale-[0.98]"
              >
                <div className="flex items-start justify-between mb-6 relative z-10">
                  <div className="flex items-center gap-4">
                    <div className={`${item.bg} ${item.color} p-4 rounded-3xl`}>
                      <Icon size={32} strokeWidth={2.5} />
                    </div>
                    <div>
                      <h3 className="text-xl font-black text-slate-800 tracking-tight">{item.title}</h3>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1 opacity-70">{item.subtitle}</p>
                    </div>
                  </div>
                  <ArrowRight className="text-slate-200 group-hover:text-blue-500 group-hover:translate-x-2 transition-all" size={24} />
                </div>

                <div className="relative z-10 mt-2">
                  {item.content}
                </div>

                {/* Marca D'água Estilizada */}
                <div className="absolute -right-8 -bottom-8 opacity-[0.03] text-slate-900 group-hover:scale-125 transition-transform duration-700">
                  <Icon size={200} strokeWidth={1} />
                </div>
              </div>
            );
          })}
        </div>

        {/* 4. Assistente Jules (Human-in-the-loop) */}
        <div className="bg-slate-900 rounded-[2.5rem] p-6 text-white border border-slate-800 flex flex-col md:flex-row items-center gap-6 shadow-2xl relative overflow-hidden group">
          <div className="p-4 bg-blue-600 rounded-3xl animate-pulse shadow-lg shadow-blue-500/20">
            <Activity size={32} />
          </div>
          <div className="flex-1 text-center md:text-left relative z-10">
            <p className="text-[10px] font-black uppercase tracking-[0.4em] text-blue-400 mb-2">Jules / Insight Estratégico</p>
            <p className="text-lg font-medium leading-snug italic text-slate-300">
              "Presidente, o relatório financeiro do mês indica uma folga de caixa. Sugiro alocar R$ 2k para a meta de uniformes da Base. <span className="text-white font-bold underline">Autoriza?</span>"
            </p>
          </div>
          <button className="w-full md:w-auto bg-white text-slate-900 px-10 py-4 rounded-2xl font-black text-sm hover:bg-blue-50 transition-all shadow-xl active:scale-95 whitespace-nowrap z-10">
            AUTORIZAR AGORA
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardMaster;