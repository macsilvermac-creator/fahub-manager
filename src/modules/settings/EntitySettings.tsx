import React, { useState } from 'react';
import { 
  ArrowLeft, Settings, Shield, Globe, 
  RefreshCw, Edit3, ChevronRight, Save
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/**
 * Gestão de Entidades Operacional - Protocolo FAHUB
 * Interface para controle de CNPJs e Unidades sem alteração visual.
 */
const EntitySettings: React.FC = () => {
  const navigate = useNavigate();
  const [isSyncing, setIsSyncing] = useState(false);

  // Simulação de Sincronização de Dados
  const handleSync = () => {
    setIsSyncing(true);
    setTimeout(() => setIsSyncing(false), 2000);
  };

  const entities = [
    { id: 1, name: "Tackle Pro", type: "Unidade Esportiva", status: "Ativo", color: "text-blue-500" },
    { id: 2, name: "Flag Football", type: "Unidade Esportiva", status: "Ativo", color: "text-orange-500" },
    { id: 3, name: "Associação Gladiators", type: "Administrativo", status: "Regular", color: "text-emerald-500" }
  ];

  return (
    <div className="min-h-screen bg-[#F1F5F9] pb-20">
      {/* Header HUD */}
      <nav className="bg-white p-6 flex items-center justify-between shadow-sm mb-8 border-b border-slate-100">
        <div className="flex items-center gap-6">
          <button 
            onClick={() => navigate('/dashboard')}
            className="w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 hover:bg-slate-50 transition-all outline-none"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tighter uppercase italic leading-none">
              Configurações de <span className="text-blue-600">Entidade</span>
            </h1>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2 italic">Parâmetros do Ecossistema</p>
          </div>
        </div>
        <button 
          onClick={handleSync}
          disabled={isSyncing}
          className="bg-slate-900 text-white px-8 py-3 rounded-xl text-[10px] font-black uppercase flex items-center gap-3 shadow-lg hover:bg-slate-800 transition-all disabled:opacity-50"
        >
          <RefreshCw size={16} className={isSyncing ? "animate-spin" : ""} />
          {isSyncing ? "Sincronizando..." : "Sincronizar Cloud"}
        </button>
      </nav>

      <main className="max-w-[1400px] mx-auto px-6 space-y-8">
        {/* Grid de Entidades */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {entities.map((entity) => (
            <div key={entity.id} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 group hover:shadow-xl transition-all">
              <div className="flex justify-between items-start mb-6">
                <div className={`w-14 h-14 rounded-2xl bg-slate-50 flex items-center justify-center ${entity.color}`}>
                  <Shield size={28} />
                </div>
                <button className="text-slate-300 hover:text-blue-600 transition-colors">
                  <Edit3 size={18} />
                </button>
              </div>
              <h3 className="text-xl font-black text-slate-800 uppercase italic tracking-tighter">{entity.name}</h3>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-2 mb-6">{entity.type}</p>
              <div className="pt-6 border-t border-slate-50 flex items-center justify-between">
                <span className="text-[9px] font-black bg-emerald-50 text-emerald-600 px-3 py-1 rounded-lg uppercase tracking-widest">
                  {entity.status}
                </span>
                <ChevronRight size={18} className="text-slate-300" />
              </div>
            </div>
          ))}
        </div>

        {/* Painel de Integração Master */}
        <div className="bg-slate-900 rounded-[2.5rem] p-10 text-white relative overflow-hidden group shadow-2xl">
          <Globe size={200} className="absolute -right-10 -bottom-10 opacity-[0.03] text-white group-hover:scale-110 transition-transform duration-1000" />
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h3 className="text-xs font-black uppercase tracking-[0.3em] text-blue-400 mb-4 italic">Conexão API Supabase</h3>
              <p className="text-lg font-bold italic leading-tight text-slate-300 mb-8">
                O seu ecossistema está <span className="text-white underline">integrado em tempo real</span>. Todas as alterações em Unidades Esportivas refletem no Consolidado Financeiro.
              </p>
              <div className="flex gap-4">
                <button className="bg-blue-600 text-white px-8 py-4 rounded-2xl text-[10px] font-black uppercase shadow-lg hover:bg-blue-500 transition-all outline-none flex items-center gap-2">
                  <Save size={16} /> Salvar Parâmetros
                </button>
              </div>
            </div>
            <div className="bg-white/5 rounded-[2rem] border border-white/10 p-8 flex items-center justify-center">
               <div className="text-center">
                 <Settings size={40} className="text-blue-500 mx-auto mb-4 opacity-50" />
                 <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 italic">Logs de Sistema Ativos</p>
               </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EntitySettings;