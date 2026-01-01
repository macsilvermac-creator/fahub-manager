import React from 'react';
import { 
  ArrowLeft, Shield, Activity, FileText, 
  TrendingUp, AlertCircle, CheckCircle2, Clock, User
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/**
 * Ficha Individual 360º - Protocolo FAHUB Nexus
 * Visão profunda para Gestão Master com estética HUD e KPIs integrados.
 */
const MemberProfile360: React.FC = () => {
  const navigate = useNavigate();

  const member = {
    name: "Gabriel 'Gladiador' Silva",
    position: "Linebacker / Capitão",
    status: "Ativo",
    healthStatus: "Apto com restrições",
    lastUpdate: "01/01/2026",
    stats: [
      { label: "Performance Técnica", value: 88, color: "bg-blue-600" },
      { label: "Presença em Treinos", value: 95, color: "bg-emerald-500" },
      { label: "Engajamento Tático", value: 72, color: "bg-orange-500" }
    ]
  };

  return (
    <div className="min-h-screen bg-white pb-20">
      {/* Barra de Navegação HUD */}
      <nav className="bg-slate-900 text-white p-4 sticky top-0 z-50 border-b border-slate-800 shadow-2xl">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-4">
          <button 
            onClick={() => navigate('/patrimonio')}
            className="flex items-center gap-2 text-slate-400 font-black text-[10px] uppercase tracking-[0.2em] hover:text-blue-400 transition-all"
          >
            <ArrowLeft size={16} /> Voltar ao Patrimônio
          </button>
          <div className="flex items-center gap-2">
            <Shield size={14} className="text-blue-500" />
            <span className="text-[10px] font-black uppercase tracking-[0.3em] italic text-slate-300">Perfil Nexus 360º</span>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto p-4 md:p-10 space-y-10">
        
        {/* HUD de Identidade - Master Persona */}
        <section className="bg-slate-900 rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden group">
          <User size={300} strokeWidth={1} className="absolute -right-20 -bottom-20 opacity-[0.03] text-white group-hover:scale-110 transition-transform duration-1000" />
          
          <div className="flex flex-col md:flex-row items-center gap-10 relative z-10">
            <div className="w-40 h-40 rounded-[3rem] bg-blue-600 flex items-center justify-center text-5xl font-black italic shadow-2xl shadow-blue-500/20 border-4 border-white/10">
              GS
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-4xl font-black tracking-tighter italic uppercase leading-none">{member.name}</h1>
              <p className="text-blue-400 font-bold text-base uppercase tracking-[0.3em] mt-3">{member.position}</p>
              <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-6">
                <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-4 py-1.5 rounded-2xl text-[10px] font-black uppercase italic">Sócio Ativo</span>
                <span className="bg-white/5 text-slate-400 border border-white/10 px-4 py-1.5 rounded-2xl text-[10px] font-black uppercase italic">Vencimento: Out/2026</span>
              </div>
            </div>

            {/* KPI de Saúde HUD */}
            <div className="bg-white/5 p-8 rounded-[2.5rem] border border-white/10 backdrop-blur-xl min-w-[250px]">
              <div className="flex items-center gap-3 mb-3">
                <Activity className="text-orange-500 animate-pulse" size={20} />
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Health KPI</span>
              </div>
              <p className="text-2xl font-black italic text-orange-500 uppercase leading-none">{member.healthStatus}</p>
            </div>
          </div>
        </section>

        {/* Visão 360º de Performance e Burocracia */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Módulo de Performance HUD */}
          <div className="lg:col-span-2 space-y-10">
            <div className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-2xl shadow-slate-200/50 relative overflow-hidden group">
              <TrendingUp size={200} className="absolute -right-10 -bottom-10 opacity-[0.02] text-slate-900 group-hover:rotate-12 transition-transform duration-700" />
              <h3 className="text-xl font-black text-slate-900 mb-8 flex items-center gap-4 italic uppercase tracking-tighter">
                <TrendingUp className="text-blue-600" size={24} /> Performance Estratégica
              </h3>
              <div className="space-y-8">
                {member.stats.map((stat, idx) => (
                  <div key={idx} className="space-y-3">
                    <div className="flex justify-between text-[11px] font-black text-slate-500 uppercase tracking-widest">
                      <span>{stat.label}</span>
                      <span className="text-slate-900">{stat.value}%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden shadow-inner">
                      <div className={`${stat.color} h-full transition-all duration-1000 shadow-lg`} style={{ width: `${stat.value}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Relatório Jules Integrado */}
            <div className="bg-slate-950 rounded-[3rem] p-8 text-white shadow-2xl border border-slate-800 flex items-center gap-8">
              <div className="w-14 h-14 bg-blue-600 rounded-[1.5rem] flex items-center justify-center font-black italic shadow-lg shadow-blue-500/20">J</div>
              <div className="flex-1">
                <p className="text-[10px] font-black text-blue-400 uppercase tracking-[0.4em] mb-2 italic">Análise de IA / Patrimônio</p>
                <p className="text-lg font-medium leading-tight italic text-slate-300">
                  "Gabriel apresenta um declínio de 12% no engajamento tático. Sugiro reunião com o <span className="text-white font-bold underline">HC de Defesa</span> para alinhar expectativas."
                </p>
              </div>
            </div>
          </div>

          {/* Módulo Burocrático HUD */}
          <div className="space-y-10">
            <div className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-2xl shadow-slate-200/50">
              <h3 className="text-sm font-black text-slate-400 mb-8 italic uppercase tracking-[0.3em]">Compliance Jurídico</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-5 rounded-[2rem] bg-emerald-50 border border-emerald-100 text-emerald-700">
                  <div className="flex items-center gap-3">
                    <FileText size={18} />
                    <span className="text-[10px] font-black uppercase italic tracking-widest">Termo Imagem</span>
                  </div>
                  <CheckCircle2 size={18} />
                </div>
                <div className="flex items-center justify-between p-5 rounded-[2rem] bg-orange-50 border border-orange-100 text-orange-700">
                  <div className="flex items-center gap-3">
                    <AlertCircle size={18} />
                    <span className="text-[10px] font-black uppercase italic tracking-widest">Seguro Atleta</span>
                  </div>
                  <span className="text-[9px] font-black uppercase">Expirando</span>
                </div>
              </div>
            </div>

            <div className="bg-slate-50 rounded-[3rem] p-8 border border-slate-100 text-center">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4 italic">Última Sincronização</p>
              <p className="text-xs font-bold text-slate-800 flex items-center justify-center gap-2 italic">
                <Clock size={14} className="text-blue-500" /> {member.lastUpdate} - 13:13
              </p>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default MemberProfile360;