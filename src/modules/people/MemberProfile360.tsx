import React from 'react';
import { 
  ArrowLeft, Shield, Activity, FileText, 
  TrendingUp, AlertCircle, CheckCircle2, Clock 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const MemberProfile360: React.FC = () => {
  const navigate = useNavigate();

  // Mock de dados para garantir a visualização imediata da solidez
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
    <div className="min-h-screen bg-slate-50 pb-20">
      {/* Header de Navegação */}
      <nav className="bg-white border-b border-slate-200 p-4 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <button 
            onClick={() => navigate('/patrimonio')}
            className="flex items-center gap-2 text-slate-500 font-black text-[10px] uppercase tracking-widest hover:text-blue-600 transition-all"
          >
            <ArrowLeft size={16} /> Voltar ao Patrimônio
          </button>
          <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Perfil 360º / Protocolo FAHUB</span>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto p-4 md:p-8 space-y-8">
        
        {/* 1. Card de Identidade e Status Crítico */}
        <section className="bg-slate-900 rounded-[3rem] p-8 text-white shadow-2xl flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full -mr-32 -mt-32 blur-3xl" />
          
          <div className="w-32 h-32 rounded-[2.5rem] bg-blue-600 flex items-center justify-center text-4xl font-black italic shadow-inner">
            GS
          </div>
          
          <div className="flex-1 text-center md:text-left">
            <h1 className="text-3xl font-black tracking-tighter italic uppercase">{member.name}</h1>
            <p className="text-blue-400 font-bold text-sm uppercase tracking-widest mt-1">{member.position}</p>
            <div className="flex flex-wrap justify-center md:justify-start gap-3 mt-4">
              <span className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-3 py-1 rounded-full text-[10px] font-black uppercase italic">Sócio Ativo</span>
              <span className="bg-white/10 text-white/70 border border-white/10 px-3 py-1 rounded-full text-[10px] font-black uppercase italic italic">Contrato: Out/2026</span>
            </div>
          </div>

          <div className="bg-white/5 p-6 rounded-[2rem] border border-white/10 backdrop-blur-md">
            <div className="flex items-center gap-3 mb-2">
              <Activity className="text-orange-500" size={20} />
              <span className="text-[10px] font-black uppercase tracking-widest">Status de Saúde</span>
            </div>
            <p className="text-xl font-black italic text-orange-500 uppercase">{member.healthStatus}</p>
          </div>
        </section>

        {/* 2. Grid de Análise Técnica e Departamental */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Coluna de Performance (Técnico) */}
          <div className="md:col-span-2 space-y-8">
            <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl shadow-slate-200/50">
              <h3 className="text-lg font-black text-slate-800 mb-6 flex items-center gap-3 italic uppercase">
                <TrendingUp className="text-blue-600" /> Indicadores de Performance
              </h3>
              <div className="space-y-6">
                {member.stats.map((stat, idx) => (
                  <div key={idx} className="space-y-2">
                    <div className="flex justify-between text-[10px] font-black text-slate-500 uppercase tracking-widest">
                      <span>{stat.label}</span>
                      <span className="text-slate-900">{stat.value}%</span>
                    </div>
                    <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                      <div className={`${stat.color} h-full transition-all duration-1000`} style={{ width: `${stat.value}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Histórico Operacional (Operações) */}
            <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl shadow-slate-200/50">
              <h3 className="text-lg font-black text-slate-800 mb-6 italic uppercase flex items-center gap-3">
                <Clock className="text-purple-600" /> Registro de Atividades
              </h3>
              <div className="space-y-4">
                {[1, 2].map((_, i) => (
                  <div key={i} className="flex items-start gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-100">
                    <div className="bg-white p-2 rounded-lg shadow-sm">
                      <CheckCircle2 className="text-emerald-500" size={16} />
                    </div>
                    <div>
                      <p className="text-xs font-black text-slate-800">Treino Tático - Unidade Central</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Realizado em: 30/12/2025</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Coluna Burocrática e Financeira (Financeiro/Jurídico) */}
          <div className="space-y-8">
            <div className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-xl shadow-slate-200/50">
              <h3 className="text-sm font-black text-slate-800 mb-6 italic uppercase tracking-tighter">Documentação</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-xl bg-emerald-50 border border-emerald-100 text-emerald-700">
                  <div className="flex items-center gap-2">
                    <FileText size={14} />
                    <span className="text-[10px] font-black uppercase">Termo Uso Imagem</span>
                  </div>
                  <CheckCircle2 size={14} />
                </div>
                <div className="flex items-center justify-between p-3 rounded-xl bg-orange-50 border border-orange-100 text-orange-700">
                  <div className="flex items-center gap-2">
                    <Shield size={14} />
                    <span className="text-[10px] font-black uppercase">Seguro Atleta</span>
                  </div>
                  <AlertCircle size={14} />
                </div>
              </div>
            </div>

            {/* Jules Insight */}
            <div className="bg-blue-600 rounded-[2.5rem] p-6 text-white shadow-lg shadow-blue-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-black text-[10px]">J</div>
                <p className="text-[10px] font-black uppercase tracking-widest italic">Análise Jules</p>
              </div>
              <p className="text-xs font-medium leading-relaxed italic">
                "Gabriel mantém alta performance, mas o seguro atleta vence em 15 dias. <span className="font-black underline">Recomendo renovação imediata</span> para evitar bloqueio operacional."
              </p>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default MemberProfile360;