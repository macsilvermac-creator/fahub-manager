import { TrendingUp, Users, Kanban, Activity, ArrowRight } from 'lucide-react';

const DashboardMaster = () => {
  const containers = [
    {
      id: 'finance',
      title: 'Saúde Financeira',
      subtitle: 'Liquidez e Projeção',
      icon: TrendingUp,
      color: 'text-emerald-500',
      bg: 'bg-emerald-500/10',
      content: (
        <div className="space-y-2">
          <div className="flex justify-between items-end">
            <span className="text-2xl font-black text-slate-800 tracking-tighter">R$ 45.200</span>
            <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">+12% este mês</span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
            <div className="bg-emerald-500 h-full w-[70%]" />
          </div>
          <p className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">Meta de Arrecadação: 70%</p>
        </div>
      )
    },
    {
      id: 'patrimony',
      title: 'Patrimônio Humano',
      subtitle: 'Censo Tackle & Flag',
      icon: Users,
      color: 'text-blue-500',
      bg: 'bg-blue-500/10',
      content: (
        <div className="grid grid-cols-2 gap-2 mt-1">
          <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
            <p className="text-[9px] font-black text-slate-400 uppercase">Tackle</p>
            <p className="text-lg font-bold text-slate-700 tracking-tight">84 <span className="text-[10px] font-normal text-slate-400">Ativos</span></p>
          </div>
          <div className="bg-slate-50 p-2 rounded-xl border border-slate-100">
            <p className="text-[9px] font-black text-slate-400 uppercase">Flag</p>
            <p className="text-lg font-bold text-slate-700 tracking-tight">42 <span className="text-[10px] font-normal text-slate-400">Ativos</span></p>
          </div>
        </div>
      )
    },
    {
      id: 'goals',
      title: 'Evolução Estratégica',
      subtitle: 'Kanban de Metas OKR',
      icon: Kanban,
      color: 'text-orange-500',
      bg: 'bg-orange-500/10',
      content: (
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 flex items-center justify-center">
              <svg className="w-full h-full rotate-[-90deg]">
                <circle cx="20" cy="20" r="18" fill="none" stroke="#f1f5f9" strokeWidth="4" />
                <circle cx="20" cy="20" r="18" fill="none" stroke="#f97316" strokeWidth="4" strokeDasharray="113" strokeDashoffset="45" />
              </svg>
              <span className="absolute text-[10px] font-black">60%</span>
            </div>
            <div>
              <p className="text-[11px] font-bold text-slate-700 leading-tight">Expansão da Base Sub-17</p>
              <p className="text-[9px] text-orange-600 font-black uppercase">Status: Em Progresso</p>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'operations',
      title: 'Status Operacional',
      subtitle: 'Monitoramento de Equipes',
      icon: Activity,
      color: 'text-purple-500',
      bg: 'bg-purple-500/10',
      content: (
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between bg-purple-50 px-3 py-2 rounded-xl border border-purple-100">
            <span className="text-[11px] font-bold text-purple-700">Tackle Masculino</span>
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          </div>
          <p className="text-[9px] text-slate-400 italic font-medium px-1">IA: "3 treinos realizados esta semana. HC reportou progresso em Redzone."</p>
        </div>
      )
    }
  ];

  return (
    <div className="p-4 md:p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header com Persona Master */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800 tracking-tighter italic">
            DASHBOARD <span className="text-blue-600">MASTER</span>
          </h2>
          <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest mt-1 bg-slate-100 w-fit px-2 py-0.5 rounded">
            Associação: Joinville Gladiators
          </p>
        </div>
        <div className="flex items-center gap-2 bg-white p-2 rounded-2xl border border-slate-100 shadow-sm">
          <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-black">JG</div>
          <div className="pr-2">
            <p className="text-[10px] font-black text-slate-800 leading-none">Diretoria Executiva</p>
            <p className="text-[9px] text-slate-400 font-bold uppercase">Nexus Portal</p>
          </div>
        </div>
      </header>

      {/* Grid de 4 Contêineres */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        {containers.map((container) => (
          <div 
            key={container.id}
            className="group bg-white rounded-[2rem] p-6 border border-slate-100 shadow-xl shadow-slate-200/40 hover:shadow-2xl hover:shadow-blue-900/10 transition-all cursor-pointer relative overflow-hidden active:scale-[0.98]"
          >
            {/* Ícone e Títulos */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-4">
                <div className={`${container.bg} ${container.color} p-3 rounded-2xl`}>
                  <container.icon size={24} strokeWidth={2.5} />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-800 tracking-tight leading-none">{container.title}</h3>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{container.subtitle}</p>
                </div>
              </div>
              <ArrowRight className="text-slate-200 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" size={20} />
            </div>

            {/* Conteúdo do Contêiner */}
            <div className="relative z-10">
              {container.content}
            </div>

            {/* Decorativo de Fundo */}
            <div className="absolute -right-4 -bottom-4 opacity-[0.03] text-slate-900 group-hover:scale-110 transition-transform">
              <container.icon size={120} strokeWidth={1} />
            </div>
          </div>
        ))}
      </div>

      {/* Espaço para Insight da IA (O Assistente Jules) */}
      <div className="bg-slate-900 rounded-[2rem] p-5 border border-slate-800 flex items-center gap-4">
        <div className="bg-blue-600 p-3 rounded-2xl animate-pulse">
          <Activity size={20} className="text-white" />
        </div>
        <div className="flex-1">
          <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.2em] mb-1">Assistente Jules / Insight</p>
          <p className="text-sm text-slate-300 font-medium italic leading-relaxed">
            "Olá Gestor. Analisei as seletivas de hoje: 12 atletas aprovados pelo HC da Base. Deseja que eu prepare os contratos para sua revisão?"
          </p