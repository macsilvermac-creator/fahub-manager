import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Search, 
  UserCheck, 
  FileWarning, 
  Stethoscope, 
  ChevronRight,
  ShieldCheck,
  Filter
} from 'lucide-react';

/**
 * Interface para garantir a integridade dos dados do atleta
 */
interface AthleteCenso {
  id: string;
  name: string;
  category: 'Professional' | 'Base' | 'Escolhinha';
  position: string;
  docStatus: 'complete' | 'pending' | 'expired';
  healthStatus: 'fit' | 'warning' | 'injured';
  contractType: 'Scholarship' | 'Full' | 'Prospect';
}

const HumanCapital: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Simulação de base consolidada de todas as entidades
  const [athletes] = useState<AthleteCenso[]>([
    { id: '1', name: 'Carlos Henrique', category: 'Professional', position: 'QB', docStatus: 'complete', healthStatus: 'fit', contractType: 'Full' },
    { id: '2', name: 'Mateus Lima', category: 'Base', position: 'WR', docStatus: 'pending', healthStatus: 'warning', contractType: 'Scholarship' },
    { id: '3', name: 'Roberto Souza', category: 'Escolhinha', position: 'RB', docStatus: 'expired', healthStatus: 'fit', contractType: 'Prospect' },
  ]);

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8 space-y-6">
      {/* Header de Navegação e Busca */}
      <nav className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button className="p-3 bg-white rounded-2xl border border-slate-200 text-slate-400 hover:text-blue-600 shadow-sm transition-all">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="text-2xl font-black text-slate-800 tracking-tighter italic leading-none">
              PATRIMÔNIO <span className="text-blue-600">HUMANO</span>
            </h2>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1">
              Censo Inteligente de Atletas
            </p>
          </div>
        </div>

        <div className="flex gap-2 w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Buscar atleta..." 
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-xs font-medium focus:ring-2 focus:ring-blue-500 outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="p-2.5 bg-white border border-slate-200 rounded-xl text-slate-600">
            <Filter size={20} />
          </button>
        </div>
      </nav>

      {/* Grid de Métricas de Elenco (Visão Master) */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Atletas', value: '126', icon: UserCheck, color: 'text-blue-600' },
          { label: 'Docs Pendentes', value: '14', icon: FileWarning, color: 'text-amber-600' },
          { label: 'Departamento Médico', value: '06', icon: Stethoscope, color: 'text-red-600' },
          { label: 'Seguros Ativos', value: '100%', icon: ShieldCheck, color: 'text-emerald-600' }
        ].map((stat, i) => (
          <div key={i} className="bg-white p-5 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4">
            <div className={`p-3 rounded-2xl bg-slate-50 ${stat.color}`}>
              <stat.icon size={24} />
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase leading-none mb-1">{stat.label}</p>
              <p className="text-xl font-black text-slate-800 tracking-tight">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Lista de Atletas - Mobile Ready */}
      <section className="space-y-3">
        {athletes.map((athlete) => (
          <div key={athlete.id} className="bg-white p-4 rounded-3xl border border-slate-100 shadow-md hover:shadow-xl transition-all group cursor-pointer">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-900 rounded-2xl flex items-center justify-center text-white font-black text-xs">
                  {athlete.position}
                </div>
                <div>
                  <h4 className="font-bold text-slate-800 tracking-tight">{athlete.name}</h4>
                  <div className="flex gap-2 mt-1">
                    <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded bg-slate-100 text-slate-500">
                      {athlete.category}
                    </span>
                    <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded border ${
                      athlete.docStatus === 'complete' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-amber-50 text-amber-600 border-amber-100'
                    }`}>
                      DOC: {athlete.docStatus}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <div className="hidden md:block text-right">
                  <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Saúde (MedicAI)</p>
                  <span className={`text-[9px] font-bold px-3 py-1 rounded-full ${
                    athlete.healthStatus === 'fit' ? 'bg-emerald-100 text-emerald-700' : 
                    athlete.healthStatus === 'warning' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'
                  }`}>
                    {athlete.healthStatus.toUpperCase()}
                  </span>
                </div>
                <ChevronRight className="text-slate-200 group-hover:text-blue-500 group-hover:translate-x-1 transition-all" />
              </div>
            </div>
          </div>
        ))}
      </section>

      {/* Assistente MedicAI / Jules */}
      <div className="bg-slate-900 rounded-[2.5rem] p-6 text-white border border-slate-800 shadow-2xl relative overflow-hidden group">
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-6">
          <div className="p-4 bg-red-500/20 text-red-400 rounded-3xl border border-red-500/30 animate-pulse">
            <Stethoscope size={32} />
          </div>
          <div className="flex-1 text-center md:text-left">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-red-400 mb-1">Alerta MedicAI / Jules</p>
            <p className="text-base font-medium leading-relaxed text-slate-300">
              "Detectei que 3 atletas da <span className="text-white font-bold underline">Escolhinha de Base</span> estão com o atestado médico vencendo em 48h. Deseja que eu notifique os responsáveis via WhatsApp?"
            </p>
          </div>
          <div className="flex gap-3">
             <button className="bg-white/5 hover:bg-white/10 text-slate-400 px-6 py-3 rounded-2xl text-[10px] font-black transition-all">IGNORAR</button>
             <button className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-2xl text-[10px] font-black shadow-lg shadow-blue-900/40 transition-all">AUTORIZAR NOTIFICAÇÃO</button>
          </div>
        </div>
        {/* Decorativo de Fundo */}
        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform">
           <ShieldCheck size={120} />
        </div>
      </div>
    </div>
  );
};

export default HumanCapital;