import React, { useState } from 'react';
import DashboardSidebar from '../dashboard/components/DashboardSidebar';
import JulesAgent from '../shared/components/JulesAgent';

const EntitySettings: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Mock das Entidades
  const entities = [
    { id: 1, name: 'TACKLE PRO', type: 'Unidade Esportiva', status: 'ATIVO', color: 'blue', icon: '🛡️' },
    { id: 2, name: 'FLAG FOOTBALL', type: 'Unidade Esportiva', status: 'ATIVO', color: 'orange', icon: '🏈' },
    { id: 3, name: 'ASSOCIAÇÃO GLADIATORS', type: 'Administrativo', status: 'REGULAR', color: 'emerald', icon: '🏛️' }
  ];

  return (
    <div className="flex h-screen bg-[#020617] overflow-hidden text-white font-sans">
      
      {/* 1. NAVEGAÇÃO LATERAL */}
      <DashboardSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* 2. CONTEÚDO PRINCIPAL */}
      <div className="flex-1 flex flex-col overflow-y-auto relative">
        
        {/* HEADER */}
        <header className="p-4 border-b border-slate-800 bg-[#0f172a]/50 backdrop-blur flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="md:hidden p-2 text-gray-300 bg-slate-800 rounded-lg">☰</button>
            <div className="flex flex-col">
              <h1 className="text-lg font-bold text-white flex items-center gap-2"><span className="text-purple-500">⚙️</span> CONFIGURAÇÕES DE ENTIDADE</h1>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest">Parâmetros do Ecossistema</p>
            </div>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 text-xs font-bold bg-[#1e293b] border border-slate-700 hover:border-purple-500 text-white rounded transition shadow-lg">
            <span className="animate-spin text-purple-400">↻</span> SINCRONIZAR CLOUD
          </button>
        </header>

        <main className="p-4 md:p-8 max-w-7xl mx-auto w-full pb-24">

          {/* SECTION 1: ENTIDADES */}
          <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4 pl-1">Unidades Gerenciadas</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {entities.map((ent) => (
              <div key={ent.id} className={`relative bg-[#1e293b]/40 border border-slate-800 rounded-xl p-6 hover:bg-[#1e293b] transition duration-300 group cursor-pointer
                  ${ent.color === 'blue' ? 'hover:border-blue-500/50' : ''}
                  ${ent.color === 'orange' ? 'hover:border-orange-500/50' : ''}
                  ${ent.color === 'emerald' ? 'hover:border-emerald-500/50' : ''}
                `}>
                <div className={`h-12 w-12 rounded-lg flex items-center justify-center text-2xl mb-4 border
                  ${ent.color === 'blue' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' : ''}
                  ${ent.color === 'orange' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' : ''}
                  ${ent.color === 'emerald' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : ''}
                `}>{ent.icon}</div>
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-black italic text-white group-hover:tracking-wide transition-all">{ent.name}</h3>
                    <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mt-1">{ent.type}</p>
                  </div>
                  <span className={`text-[9px] px-2 py-0.5 rounded border uppercase font-bold
                    ${ent.status === 'ATIVO' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-slate-700 text-slate-300 border-slate-600'}
                  `}>{ent.status}</span>
                </div>
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition"><span className="text-slate-400 hover:text-white text-xs">✏️ Editar</span></div>
              </div>
            ))}
          </div>

          {/* SECTION 2: CONSOLE DE SISTEMA */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 bg-[#0f172a] border border-slate-800 rounded-xl p-6 relative overflow-hidden">
               <div className="absolute top-0 right-0 p-4 opacity-5"><svg className="w-32 h-32" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm3.293 1.293a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 01-1.414-1.414L7.586 10 5.293 7.707a1 1 0 010-1.414zM11 12a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd"/></svg></div>
               <h3 className="text-blue-400 font-bold text-sm mb-2 flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-blue-500 animate-pulse"></span> CONEXÃO API SUPABASE</h3>
               <p className="text-slate-400 text-xs mb-4 max-w-lg leading-relaxed">
                 O ecossistema está <span className="text-white font-bold underline decoration-blue-500/50">integrado em tempo real</span>. 
                 <br/><br/>
                 <span className="font-mono text-[10px] bg-slate-800 px-2 py-1 rounded text-slate-300">Latency: 24ms • Region: sa-east-1 • Build: v2.4.0</span>
               </p>
            </div>
            <div className="bg-black/40 border border-slate-800 rounded-xl p-4 font-mono text-[10px]">
              <div className="flex items-center justify-between mb-2 border-b border-slate-800 pb-2"><span className="text-slate-500 font-bold">SYSTEM LOGS</span><span className="text-emerald-500">● LIVE</span></div>
              <div className="space-y-1.5 text-slate-400">
                <p><span className="text-blue-500">[12:01:42]</span> Sync initiated by User_Admin...</p>
                <p><span className="text-emerald-500">[12:01:44]</span> Data fetch success (3 entities).</p>
                <p className="animate-pulse text-slate-600">_</p>
              </div>
            </div>
          </div>
        </main>

        {/* JULES AGENT */}
        <JulesAgent context="SETTINGS" />

      </div>
    </div>
  );
};

export default EntitySettings;