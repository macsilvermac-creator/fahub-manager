import React, { useState } from 'react';
import { 
  ArrowLeft, ShieldAlert, TrendingUp, 
  Award, FileText, CheckCircle2 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/**
 * Ficha 360º Operacional - Protocolo FAHUB
 * Revisão Total de Estrutura JSX para Build de Produção.
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
            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2 italic text-center">
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
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
            <div className="flex border-b border-slate-50">
              <button 
                onClick={() => setActiveTab('stats')}
                className={`flex-1 py-6 text-[10px] font-black uppercase tracking-widest transition-all italic outline-none ${activeTab === 'stats' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/20' : 'text-slate-400 hover:bg-slate-50'}`}
              >
                Histórico de Performance
              </button>
              <button 
                onClick={() => setActiveTab('docs')}
                className={`flex-1 py-6 text-[10px] font-black uppercase tracking-widest transition-all italic outline-none ${activeTab === 'docs' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/20' : 'text-slate-400 hover:bg-slate-50'}`}
              >
                Contratos e Docs
              </button>
            </div>

            <div className="p-8">
              {activeTab === 'stats' ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center justify-between p-6 bg-slate-50 rounded-[2rem] border border-slate-100 hover:border-blue-200 transition-all cursor-pointer group">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-all">
                          <Award size={20} />
                        </div>
                        <div>
                          <p className="text-xs font-black uppercase italic text-slate-800">Avaliação Técnica - Semana {i}</p>
                          <p className="text-[9px] font-bold text-slate-400 uppercase mt-1 italic tracking-widest">Responsável: HC Jules</p>
                        </div>
                      </div>
                      <span className="text-sm font-black text-blue-600 italic group-hover:scale-110 transition-transform">Grade: A-</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-8 border-2 border-dashed border-slate-200 rounded-[2rem] flex flex-col items-center justify-center text-slate-400 hover:bg-slate-50 hover:border-blue-400 cursor-pointer transition-all group">
                    <FileText size={32} className="mb-3 group-hover:text-blue-600 transition-colors" />
                    <span className="text-[10px] font-black uppercase italic tracking-widest">Termo de Atleta.pdf</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Banner Master Operacional */}
          <div className="bg-blue-600 rounded-[2.5rem] p-10 text-white flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl shadow-blue-200 relative overflow-hidden">
            <div className="relative z-10">
              <h4 className="text-[10px] font-black uppercase tracking-[0.3em] mb-2 italic text-blue-100 opacity-80">Ação Master Recomendada</h4>
              <p className="text-lg font-bold italic leading-tight max-w-lg">O atleta atingiu o ápice físico. Iniciar transição para o Time Especial?</p>
            </div>
            <button 
              onClick={() => alert("Transição aprovada.")}
              className="bg-white text-blue-600 px-10 py-5 rounded-2xl text-[10px] font-black uppercase shadow-lg hover:bg-slate-50 active:scale-95 transition-all outline-none relative z-10"
            >
              Aprovar Transição
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MemberProfile360;