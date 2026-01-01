import React, { useState } from 'react';
import { 
  ArrowLeft, Search, Filter, UserPlus, 
  ChevronRight, ShieldCheck, Activity 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/**
 * Patrimônio Humano Operacional - Protocolo FAHUB
 * Ativação de busca e navegação para Ficha 360º sem alterar o visual.
 */
const HumanCapital: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");

  // Dados operacionais para teste de fluxo
  const members = [
    { id: 1, name: "Gabriel Silva", role: "Linebacker", status: "Apto", perf: "88%", trend: "up" },
    { id: 2, name: "Lucas Oliveira", role: "Quarterback", status: "DM", perf: "92%", trend: "up" },
    { id: 3, name: "Matheus Costa", role: "Wide Receiver", status: "Apto", perf: "75%", trend: "down" }
  ];

  // Filtro funcional para validar a busca
  const filteredMembers = members.filter(m => 
    m.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    m.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F1F5F9] pb-20">
      {/* Header HUD Operacional */}
      <nav className="bg-slate-900 text-white p-6 sticky top-0 z-50 border-b border-slate-800 flex items-center justify-between shadow-2xl">
        <div className="flex items-center gap-6">
          <button 
            onClick={() => navigate('/dashboard')}
            className="w-12 h-12 rounded-full border border-slate-700 flex items-center justify-center text-slate-400 hover:text-blue-400 transition-all outline-none"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex items-center gap-3">
            <ShieldCheck size={18} className="text-blue-500" />
            <div>
              <h1 className="text-xl font-black uppercase italic leading-none tracking-tighter">Patrimônio <span className="text-blue-500">Humano</span></h1>
              <p className="text-[9px] font-bold text-slate-500 uppercase tracking-widest mt-1">Gestão de Ativos e Talentos</p>
            </div>
          </div>
        </div>
        <button 
          onClick={() => alert("Abrindo formulário de novo membro...")}
          className="bg-blue-600 p-3 rounded-2xl hover:bg-blue-500 transition-all shadow-lg shadow-blue-900/20 active:scale-95 outline-none"
        >
          <UserPlus size={20} />
        </button>
      </nav>

      <main className="max-w-[1400px] mx-auto p-6 md:p-10 space-y-8">
        {/* Barra de Busca Funcional */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 bg-white border border-slate-200 rounded-[1.8rem] flex items-center px-6 gap-3 focus-within:border-blue-500/50 shadow-sm transition-all">
            <Search size={18} className="text-slate-400" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por nome, posição ou status..." 
              className="bg-transparent w-full py-5 text-sm font-bold text-slate-700 outline-none italic"
            />
          </div>
          <button 
            onClick={() => alert("Filtros avançados em desenvolvimento...")}
            className="bg-white border border-slate-200 p-5 rounded-[1.8rem] text-slate-500 hover:bg-slate-50 shadow-sm transition-all outline-none"
          >
            <Filter size={20} />
          </button>
        </div>

        {/* Listagem com Engate para Ficha 360º */}
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  <th className="px-10 py-8">Membro</th>
                  <th className="px-10 py-8">Status / Saúde</th>
                  <th className="px-10 py-8">Performance</th>
                  <th className="px-10 py-8 text-right">Ação</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredMembers.map((member) => (
                  <tr 
                    key={member.id} 
                    onClick={() => navigate('/perfil-membro')}
                    className="group hover:bg-blue-50/30 transition-all cursor-pointer"
                  >
                    <td className="px-10 py-8">
                      <div className="flex items-center gap-5">
                        <div className="w-12 h-12 rounded-[1.2rem] bg-slate-900 flex items-center justify-center text-white font-black italic text-sm shadow-lg">
                          {member.name.substring(0,2).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-black text-slate-800 tracking-tight italic uppercase leading-none">{member.name}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2">{member.role}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-8">
                      <div className="flex items-center gap-3">
                        <div className={`w-2.5 h-2.5 rounded-full ${member.status === 'Apto' ? 'bg-emerald-500' : 'bg-orange-500'} animate-pulse shadow-sm`} />
                        <span className="text-[10px] font-black uppercase text-slate-600 italic">{member.status}</span>
                      </div>
                    </td>
                    <td className="px-10 py-8">
                      <div className="flex items-center gap-3">
                        <Activity size={16} className="text-blue-500" />
                        <span className="text-sm font-black text-slate-800 italic">{member.perf}</span>
                      </div>
                    </td>
                    <td className="px-10 py-8 text-right">
                      <div className="flex items-center justify-end gap-3 text-slate-300 group-hover:text-blue-600 transition-all">
                        <span className="text-[9px] font-black uppercase tracking-widest italic">Ver 360º</span>
                        <ChevronRight size={20} />
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Insight Jules Master */}
        <div className="bg-slate-900 rounded-[2.5rem] p-8 text-white flex items-center gap-8 shadow-2xl relative overflow-hidden group">
           <Activity size={120} className="absolute -right-5 -bottom-5 text-white/5 group-hover:scale-110 transition-transform duration-1000" />
           <div className="w-14 h-14 bg-blue-600 rounded-[1.5rem] flex items-center justify-center font-black italic text-xl shadow-lg shadow-blue-500/20 relative z-10">J</div>
           <div className="relative z-10">
             <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.4em] mb-2 italic">Jules / Inteligência Patrimonial</p>
             <p className="text-sm font-medium leading-tight italic text-slate-300">
               "Você tem <span className="text-white font-bold underline italic">126 atletas na Base</span>. O engajamento médio subiu 15%. Clique em qualquer membro para validar os KPIs individuais."
             </p>
           </div>
        </div>
      </main>
    </div>
  );
};

export default HumanCapital;