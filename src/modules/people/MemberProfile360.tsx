import React, { useState } from 'react';
import { 
  ArrowLeft, Activity, ShieldAlert, TrendingUp, 
  Award, Calendar, FileText, CheckCircle2 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/**
 * Ficha 360º Operacional - Protocolo FAHUB
 * Consolidação de KPIs de Caráter e Habilidade (Gladiators Fit).
 */
const MemberProfile360: React.FC = () => {
  const navigate = useNavigate();
  
  // Estado para controle de abas operacionais
  const [activeTab, setActiveTab] = useState<'stats' | 'health' | 'docs'>('stats');

  // Dados do Atleta - Integração com o Blueprint College 
  const memberData = {
    name: "Gabriel Silva",
    position: "Linebacker",
    number: "52",
    stats: { physical: "92%", tactical: "85%", character: "95%" },
    healthStatus: "Apto para Contato",
    lastUpdate: "01/01/2026"
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
        {/* Coluna de Status e Saúde  */}
        <div className="space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-6 flex items-center gap-2">
              <ShieldAlert size={14} className="text-emerald-500" /> Status de Disponibilidade
            </h3>
            <div className="flex items-center gap-4 p-4 bg-emerald-50 rounded-2xl border border-emerald-100">
              <CheckCircle2 className="text-emerald-600" size={24} />
              <span className="text-sm font-black text-emerald-900 uppercase italic">{memberData.healthStatus}</span>
            </div>
          </div>

          <div className="bg-[#0F172A] p-8 rounded-[2.5rem] shadow-2xl text-white relative overflow-hidden">
             <TrendingUp size={120} className="absolute -right-10 -bottom-10 text-white/5" />
             <h3 className="text-[10px] font-black uppercase tracking-widest text-blue-400 mb-6 italic">Métricas Pro-Style</h3>
             <div className="space-y-6 relative z-10">
                <div>
                  <div className="flex justify-between text-[10px] font-black uppercase mb-2">
                    <span>Força e Condição</span>
                    <span>{memberData.stats.physical}</span>
                  </div>
                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500 rounded-full" style={{ width: memberData.stats.physical }} />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-[10px] font-black uppercase mb-2">
                    <span>QI Tático (Playbook)</span>
                    <span>{memberData.stats.tactical}</span>
                  </div>
                  <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full" style={{ width: memberData.stats.tactical }} />
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
                className={`flex-1 py-6 text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'stats' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/20' : 'text-slate-400'}`}
              >
                Histórico de Performance
              </button>
              <button 
                onClick={() => setActiveTab('docs')}
                className={`flex-1 py-6 text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === 'docs' ? 'text-blue-600 border-b-2 border-blue-600 bg-blue-50/20' : 'text-slate-400'}`}
              >
                Contratos e Docs
              </button>
            </div>

            <div className="p-8">
              {activeTab === 'stats' ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-center justify-between p-6 bg-slate-50 rounded-3xl border border-slate-100 hover:border-blue-200 transition-all cursor-pointer">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center shadow-sm">
                          <Award className="text-blue-600" size={18} />
                        </div>
                        <div>
                          <p className="text-xs font-black uppercase italic text-slate-800">Avaliação Técnica - Semana {i}</p>
                          <p className="text-[9px] font-bold text-slate-400 uppercase mt-1">Responsável: HC Jules</p>
                        </div>
                      </div>
                      <span className="text-sm font-black text-blue-600 italic">Grade: A-</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-6 border-2 border-dashed border-slate-200 rounded-3xl flex flex-col items-center justify-center text-slate-400 hover:bg-slate-50 cursor-pointer transition-all">
                    <FileText size={24} className="mb-2" />
                    <span className="text-[9px] font-black uppercase italic">Termo de Atleta</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Banner de Engajamento 360º  */}
          <div className="bg-blue-600 rounded-[2.5rem] p-8 text-white flex items-center justify-between shadow-xl shadow-blue-200 relative overflow-hidden">
            <div className="relative z-10">
              <h4 className="text-xs font-black uppercase tracking-[0.2em] mb-2 italic">Ação Recomendada</h4>
              <p className="text-sm font-bold italic opacity-90">O atleta atingiu o ápice físico. Iniciar transição para o Time Especial?</p>
            </div>
            <button className="bg-white text-blue-600 px-8 py-3 rounded-xl text-[10px] font-black uppercase shadow-lg hover:scale-105 active:scale-95 transition-all outline-none">
              Aprovar Transição
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default MemberProfile360;