import React from 'react';
import { 
  ArrowLeft, Search, Filter, UserPlus, 
  ChevronRight, ShieldCheck, Activity 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/**
 * Módulo de Patrimônio Humano - Persona Master
 * Listagem estratégica de membros com acesso à Ficha 360º.
 */
const HumanCapital: React.FC = () => {
  const navigate = useNavigate();

  // Dados simulados para validação visual e técnica do Gestor
  const members = [
    { id: 1, name: "Gabriel Silva", role: "Linebacker", status: "Apto", perf: "88%" },
    { id: 2, name: "Lucas Oliveira", role: "Quarterback", status: "DM", perf: "92%" },
    { id: 3, name: "Matheus Costa", role: "Wide Receiver", status: "Apto", perf: "75%" }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header HUD */}
      <nav className="bg-slate-900 text-white p-4 sticky top-0 z-50 border-b border-slate-800 shadow-xl">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <button 
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-slate-400 font-black text-[10px] uppercase tracking-[0.2em] hover:text-blue-400 transition-all"
          >
            <ArrowLeft size={16} /> Dashboard
          </button>
          <div className="flex items-center gap-2">
            <ShieldCheck size={14} className="text-blue-500" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] italic text-slate-300">Gestão de Patrimônio</span>
          </div>
          <button className="bg-blue-600 p-2 rounded-xl hover:scale-105 transition-all">
            <UserPlus size={18} />
          </button>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto p-4 md:p-10 space-y-8">
        {/* Barra de Busca e Filtros HUD */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 bg-slate-50 border border-slate-100 rounded-[1.5rem] flex items-center px-6 gap-3 focus-within:border-blue-500/50 transition-all">
            <Search size={18} className="text-slate-400" />
            <input 
              type="text" 
              placeholder="Buscar por nome, posição ou status..." 
              className="bg-transparent w-full py-4 text-sm font-bold text-slate-700 outline-none"
            />
          </div>
          <button className="bg-slate-50 border border-slate-100 p-4 rounded-[1.5rem] text-slate-500 hover:bg-slate-100 transition-all">
            <Filter size={20} />
          </button>
        </div>

        {/* Grid de Membros - Foco em Solidez e Acesso 360º */}
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-2xl shadow-slate-200/50 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <th className="px-8 py-6">Membro</th>
                  <th className="px-8 py-6">Status / Saúde</th>
                  <th className="px-8 py-6">Performance</th>
                  <th className="px-8 py-6 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {members.map((member) => (
                  <tr 
                    key={member.id} 
                    onClick={() => navigate('/perfil-membro')}
                    className="group hover:bg-blue-50/30 transition-all cursor-pointer"
                  >
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center text-white font-black italic text-xs">
                          {member.name.substring(0,2).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-black text-slate-800 tracking-tight italic uppercase">{member.name}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{member.role}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-2">
                        <div className={`w-2 h-2 rounded-full ${member.status === 'Apto' ? 'bg-emerald-500' : 'bg-orange-500'} animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.3)]`} />
                        <span className="text-[10px] font-black uppercase text-slate-600">{member.status}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <Activity size={14} className="text-blue-500" />
                        <span className="text-sm font-black text-slate-800">{member.perf}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-2 text-slate-300 group-hover:text-blue-600 transition-all">
                        <span className="text-[9px] font-black uppercase tracking-widest">Ver 360º</span>
                        <ChevronRight size={18} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Insight do Agente Jules */}
        <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white flex items-center gap-6 shadow-2xl border border-slate-800 relative overflow-hidden group">
          <Activity size={100} className="absolute -right-5 -bottom-5 text-white/5 group-hover:scale-110 transition-transform duration-700" />
           <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center font-black italic text-xl shadow-lg shadow-blue-500/20 relative z-10">J</div>
           <div className="flex-1 relative z-10">
             <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest mb-1 italic">Jules / Inteligência Patrimonial</p>
             <p className="text-sm font-medium leading-tight italic text-slate-300">
               "Você tem <span className="text-white font-bold underline">126 atletas na Base</span>. Clique em qualquer linha para auditar os dados de performance individual no Modo 360º."
             </p>
           </div>
        </div>
      </main>
    </div>
  );
};

export default HumanCapital;