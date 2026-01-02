import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardSidebar from '../dashboard/components/DashboardSidebar';

const MemberProfile360: React.FC = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'performance' | 'docs'>('performance');

  // Dados Mockados do Atleta
  const athlete = {
    name: 'Gabriel Silva',
    number: '52',
    role: 'Linebacker (LB)',
    status: 'APTO',
    height: '1.88m',
    weight: '102kg',
    category: 'Full Pads',
    badge: 'Elite Squad'
  };

  return (
    <div className="flex h-screen bg-[#020617] overflow-hidden text-white font-sans">
      
      {/* 1. NAVEGAÇÃO LATERAL */}
      <DashboardSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* 2. CONTEÚDO PRINCIPAL */}
      <div className="flex-1 flex flex-col overflow-y-auto relative">
        
        {/* HEADER / CAPA DO PERFIL */}
        <div className="relative h-48 w-full bg-gradient-to-r from-slate-900 via-[#0f172a] to-blue-900/20 border-b border-slate-800">
          
          {/* Botão Voltar (Absoluto) */}
          <button 
            onClick={() => navigate('/human-capital')}
            className="absolute top-4 left-4 z-10 p-2 bg-black/30 hover:bg-black/60 rounded-full text-white backdrop-blur border border-white/10 transition"
          >
            ← Voltar
          </button>

          {/* Badge de Nível (Top Right) */}
          <div className="absolute top-4 right-4 bg-emerald-600/20 border border-emerald-500/50 text-emerald-400 px-3 py-1 rounded text-[10px] font-bold uppercase tracking-widest shadow-[0_0_15px_rgba(16,185,129,0.2)]">
            {athlete.badge}
          </div>

          {/* Container do Avatar e Nome (Sobreposto) */}
          <div className="absolute -bottom-12 left-6 md:left-10 flex items-end gap-6">
            
            {/* Avatar Quadrado com Glow */}
            <div className="h-32 w-32 bg-[#020617] rounded-2xl border-2 border-slate-700 shadow-2xl flex items-center justify-center relative overflow-hidden group">
               <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-transparent"></div>
               <span className="text-4xl font-black italic text-slate-600 group-hover:text-blue-500 transition">GS</span>
            </div>
            
            {/* Texto de Identidade */}
            <div className="mb-2">
              <h1 className="text-3xl md:text-4xl font-black italic text-white leading-none flex items-center gap-2">
                {athlete.name} 
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-500">#{athlete.number}</span>
              </h1>
              <p className="text-xs text-slate-400 uppercase tracking-[0.2em] font-bold mt-1 pl-1">
                {athlete.role} • {athlete.category}
              </p>
            </div>
          </div>
        </div>

        {/* CORPO DO PERFIL (Grid Layout) */}
        <main className="p-4 md:p-8 mt-12 max-w-7xl mx-auto w-full grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* COLUNA ESQUERDA: STATUS & BIO (30%) */}
          <div className="space-y-4">
            
            {/* Card de Disponibilidade */}
            <div className="bg-[#1e293b]/40 border border-emerald-500/30 rounded-xl p-5 shadow-lg relative overflow-hidden">
               <div className="absolute right-0 top-0 p-2 opacity-10">
                 <svg className="w-16 h-16 text-emerald-500" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" /></svg>
               </div>
               <p className="text-[10px] text-emerald-400 font-bold uppercase tracking-widest mb-2">Status Oficial</p>
               <div className="flex items-center gap-2">
                 <span className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse"></span>
                 <h2 className="text-xl font-bold text-white">APTO PARA CONTATO</h2>
               </div>
            </div>

            {/* Card Métricas Físicas (Pro-Style) */}
            <div className="bg-[#1e293b]/40 border border-slate-800 rounded-xl p-5">
              <h3 className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mb-4 border-b border-slate-700 pb-2">
                Métricas Físicas
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#0f172a] p-3 rounded-lg border border-slate-700/50">
                   <p className="text-[10px] text-slate-500">ALTURA</p>
                   <p className="text-lg font-mono font-bold text-blue-300">{athlete.height}</p>
                </div>
                <div className="bg-[#0f172a] p-3 rounded-lg border border-slate-700/50">
                   <p className="text-[10px] text-slate-500">PESO</p>
                   <p className="text-lg font-mono font-bold text-blue-300">{athlete.weight}</p>
                </div>
                <div className="bg-[#0f172a] p-3 rounded-lg border border-slate-700/50">
                   <p className="text-[10px] text-slate-500">40 YARDS</p>
                   <p className="text-lg font-mono font-bold text-white">4.8s</p>
                </div>
                <div className="bg-[#0f172a] p-3 rounded-lg border border-slate-700/50">
                   <p className="text-[10px] text-slate-500">BENCH</p>
                   <p className="text-lg font-mono font-bold text-white">100kg</p>
                </div>
              </div>
            </div>
          </div>

          {/* COLUNA DIREITA: HISTÓRICO & ABAS (70%) */}
          <div className="md:col-span-2">
            
            {/* TABS SWITCHER */}
            <div className="flex border-b border-slate-800 mb-6">
              <button 
                onClick={() => setActiveTab('performance')}
                className={`px-6 py-3 text-xs font-bold uppercase tracking-wider transition-all border-b-2 
                  ${activeTab === 'performance' ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-500 hover:text-slate-300'}
                `}
              >
                Histórico de Performance
              </button>
              <button 
                onClick={() => setActiveTab('docs')}
                className={`px-6 py-3 text-xs font-bold uppercase tracking-wider transition-all border-b-2
                  ${activeTab === 'docs' ? 'border-blue-500 text-blue-400' : 'border-transparent text-slate-500 hover:text-slate-300'}
                `}
              >
                Contratos e Docs
              </button>
            </div>

            {/* CONTEÚDO DAS ABAS */}
            <div className="bg-[#1e293b]/20 rounded-xl min-h-[300px]">
              
              {activeTab === 'performance' && (
                <div className="space-y-3">
                  {/* Item de Histórico 1 */}
                  <div className="p-4 bg-[#1e293b]/40 border border-slate-800 rounded-lg flex justify-between items-center hover:bg-[#1e293b] transition group cursor-pointer">
                     <div className="flex items-start gap-4">
                       <div className="h-10 w-10 rounded-lg bg-indigo-500/10 text-indigo-400 flex items-center justify-center border border-indigo-500/20 group-hover:border-indigo-500 transition">
                         🏆
                       </div>
                       <div>
                         <h4 className="text-sm font-bold text-white">Avaliação Técnica - Semana 1</h4>
                         <p className="text-[10px] text-slate-500 uppercase">Responsável: HC Jules</p>
                       </div>
                     </div>
                     <div className="text-right">
                       <span className="block text-xl font-black text-indigo-400">A-</span>
                       <span className="text-[10px] text-slate-500">Grade</span>
                     </div>
                  </div>

                  {/* Item de Histórico 2 */}
                  <div className="p-4 bg-[#1e293b]/40 border border-slate-800 rounded-lg flex justify-between items-center hover:bg-[#1e293b] transition group cursor-pointer">
                     <div className="flex items-start gap-4">
                       <div className="h-10 w-10 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/20 group-hover:border-blue-500 transition">
                         📹
                       </div>
                       <div>
                         <h4 className="text-sm font-bold text-white">Análise de Vídeo (Game 3)</h4>
                         <p className="text-[10px] text-slate-500 uppercase">Responsável: Coord. Defesa</p>
                       </div>
                     </div>
                     <div className="text-right">
                       <span className="block text-xl font-black text-blue-400">92%</span>
                       <span className="text-[10px] text-slate-500">Grade</span>
                     </div>
                  </div>
                </div>
              )}

              {activeTab === 'docs' && (
                <div className="space-y-3">
                  {/* Item de Documento */}
                  <div className="p-4 bg-[#1e293b]/40 border border-slate-800 rounded-lg flex justify-between items-center hover:bg-[#1e293b] transition">
                     <div className="flex items-center gap-4">
                       <span className="text-2xl">📄</span>
                       <div>
                         <h4 className="text-sm font-bold text-white">Contrato de Imagem 2026.pdf</h4>
                         <p className="text-[10px] text-slate-500 uppercase">Assinado em 10/01/2026</p>
                       </div>
                     </div>
                     <button className="text-xs text-blue-400 font-bold hover:underline">Baixar</button>
                  </div>
                </div>
              )}

            </div>

          </div>

        </main>
      </div>
    </div>
  );
};

export default MemberProfile360;