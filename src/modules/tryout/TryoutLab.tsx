import React, { useState } from 'react';
import DashboardSidebar from '../dashboard/components/DashboardSidebar';
import JulesAgent from '../../lib/Jules';

const TryoutLab: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // ESTADO DO FLUXO DE MARKETING (Link do Forms)
  const [formLink, setFormLink] = useState('');
  const [isLinkActive, setIsLinkActive] = useState(false);

  // Estado Mockado da Integração Google (Planilha de Respostas)
  const googleStatus = { connected: true, spreadsheet: 'Inscritos_Seletiva_2026_v1' };

  // Dados Mockados dos Inscritos
  const candidates = [
    { id: 101, name: 'Marcos Vinicius', age: 19, height: '1.92m', weight: '125kg', exp: 'Nenhuma', status: 'NEW', score: 8.5 },
    { id: 102, name: 'João Pedro', age: 24, height: '1.80m', weight: '85kg', exp: 'Flag 2 anos', status: 'NEW', score: 7.2 },
    { id: 103, name: 'Carlos Edu', age: 21, height: '1.75m', weight: '70kg', exp: 'Nenhuma', status: 'NEW', score: 5.0 },
    { id: 104, name: 'Rafael Souza', age: 26, height: '1.88m', weight: '110kg', exp: 'Full Pads 3 anos', status: 'EVALUATED', score: 9.1 },
  ];

  // Função para simular o envio ao Marketing
  const handleActivateLink = () => {
    if (!formLink) return;
    setIsLinkActive(true);
    // Aqui no futuro haveria uma chamada ao Supabase para salvar esse link na tabela 'campaigns'
    console.log("Link enviado para o Módulo de Marketing:", formLink);
  };

  return (
    <div className="flex flex-col h-screen bg-[#020617] overflow-hidden text-white font-sans">
      
      <div className="flex flex-1 overflow-hidden">
        <DashboardSidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <div className="flex-1 flex flex-col overflow-y-auto relative">
          
          {/* HEADER CIENTÍFICO */}
          <header className="p-4 border-b border-cyan-900/30 bg-[#0f172a]/50 backdrop-blur flex justify-between items-center sticky top-0 z-20">
            <div className="flex items-center gap-4">
              <button onClick={() => setSidebarOpen(true)} className="md:hidden p-2 text-gray-300 bg-slate-800 rounded-lg">☰</button>
              <div>
                <h1 className="text-lg font-bold text-white flex items-center gap-2">
                  <span className="text-cyan-400">🧬</span> TRYOUT LAB
                </h1>
                <p className="text-[10px] text-cyan-600 uppercase tracking-widest font-mono">
                  Recrutamento & Análise de Talentos
                </p>
              </div>
            </div>
            
            {/* Status da Conexão Google */}
            <div className="flex items-center gap-3 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-700">
               <span className="text-xl">📊</span>
               <div className="flex flex-col">
                 <span className="text-[9px] text-slate-400 uppercase font-bold">Google Forms Sync</span>
                 <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                   <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                   Online • {googleStatus.spreadsheet}
                 </span>
               </div>
            </div>
          </header>

          <main className="p-4 md:p-8 max-w-7xl mx-auto w-full pb-24">

            {/* PAINEL DE COMANDO (KPIs) */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
               <div className="bg-cyan-950/20 border border-cyan-900/50 p-4 rounded-xl">
                  <p className="text-[10px] text-cyan-500 uppercase tracking-widest mb-1">Total Inscritos</p>
                  <p className="text-3xl font-black text-white">142</p>
               </div>
               <div className="bg-cyan-950/20 border border-cyan-900/50 p-4 rounded-xl">
                  <p className="text-[10px] text-cyan-500 uppercase tracking-widest mb-1">Novos Hoje</p>
                  <p className="text-3xl font-black text-emerald-400">+15</p>
               </div>
               <div className="bg-cyan-950/20 border border-cyan-900/50 p-4 rounded-xl">
                  <p className="text-[10px] text-cyan-500 uppercase tracking-widest mb-1">Potencial Elite</p>
                  <p className="text-3xl font-black text-yellow-400">4</p>
               </div>
               
               {/* --- FLUXO DE MARKETING (ALTERADO) --- */}
               <div className={`border p-4 rounded-xl flex flex-col justify-center gap-2 transition-all duration-500 ${isLinkActive ? 'bg-indigo-900/20 border-indigo-500/50' : 'bg-slate-800/50 border-slate-700'}`}>
                  
                  {!isLinkActive ? (
                    <>
                      <p className="text-[10px] text-slate-400 uppercase font-bold">Campanha: Inscrições</p>
                      
                      {/* Passo 1: Ir ao Google */}
                      <button 
                        onClick={() => window.open('https://docs.google.com/forms', '_blank')}
                        className="w-full py-1.5 bg-white text-slate-900 hover:bg-slate-200 text-[10px] font-bold rounded transition flex items-center justify-center gap-1"
                      >
                         1. Criar no Google Forms ↗
                      </button>

                      {/* Passo 2: Colar Link */}
                      <input 
                        type="text" 
                        placeholder="2. Cole o link gerado aqui..." 
                        value={formLink}
                        onChange={(e) => setFormLink(e.target.value)}
                        className="w-full bg-black/30 border border-slate-600 rounded px-2 py-1 text-[10px] text-white focus:border-indigo-500 outline-none"
                      />

                      {/* Passo 3: Enviar */}
                      <button 
                        onClick={handleActivateLink}
                        disabled={!formLink}
                        className={`w-full py-1.5 text-[10px] font-bold rounded transition flex items-center justify-center gap-1
                          ${formLink ? 'bg-indigo-600 text-white hover:bg-indigo-500 shadow-lg shadow-indigo-500/20' : 'bg-slate-700 text-slate-500 cursor-not-allowed'}
                        `}
                      >
                         3. Ativar & Enviar p/ MKT
                      </button>
                    </>
                  ) : (
                    <>
                      {/* Estado: Link Ativo e Enviado */}
                      <div className="flex justify-between items-center">
                        <p className="text-[10px] text-indigo-400 uppercase font-bold animate-pulse">● Link Ativo</p>
                        <button onClick={() => setIsLinkActive(false)} className="text-[9px] text-slate-500 underline hover:text-white">Editar</button>
                      </div>
                      
                      <div className="bg-black/30 p-2 rounded border border-indigo-500/30 truncate text-[10px] text-slate-300 font-mono select-all">
                        {formLink}
                      </div>

                      <button 
                        onClick={() => navigator.clipboard.writeText(formLink)}
                        className="w-full py-2 bg-indigo-600/20 border border-indigo-500/50 text-indigo-300 hover:bg-indigo-600 hover:text-white text-xs font-bold rounded transition"
                      >
                        COPIAR LINK
                      </button>
                    </>
                  )}
               </div>
            </div>

            {/* ÁREA DE ANÁLISE (Candidatos) */}
            <div className="flex flex-col lg:flex-row gap-6">
              
              {/* TABELA DE CANDIDATOS (Esquerda) */}
              <div className="flex-1 bg-[#1e293b]/30 border border-slate-800 rounded-xl overflow-hidden">
                <div className="p-4 border-b border-slate-800 bg-[#0f172a]/50 flex justify-between items-center">
                  <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Inscritos (Live Feed)</h3>
                  <span className="text-[10px] text-slate-500 font-mono">Last sync: 2 min ago</span>
                </div>
                
                <table className="w-full text-left">
                  <thead className="text-[10px] uppercase text-slate-500 bg-[#0f172a]/30">
                    <tr>
                      <th className="p-3">Nome</th>
                      <th className="p-3">Físico</th>
                      <th className="p-3">Experiência</th>
                      <th className="p-3 text-center">Score IA</th>
                      <th className="p-3 text-right">Ação</th>
                    </tr>
                  </thead>
                  <tbody className="text-xs text-slate-300">
                    {candidates.map(c => (
                      <tr key={c.id} className="border-b border-slate-800/50 hover:bg-white/5 transition">
                        <td className="p-3 font-bold text-white">{c.name} <div className="text-[10px] text-slate-500 font-normal">{c.age} anos</div></td>
                        <td className="p-3 font-mono text-cyan-300">{c.height} • {c.weight}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] border ${c.exp === 'Nenhuma' ? 'border-slate-700 text-slate-500' : 'border-indigo-500/50 text-indigo-300'}`}>
                            {c.exp}
                          </span>
                        </td>
                        <td className="p-3 text-center">
                          <span className={`font-bold ${c.score > 8 ? 'text-emerald-400' : 'text-slate-500'}`}>{c.score}</span>
                        </td>
                        <td className="p-3 text-right">
                          <button className="text-[10px] bg-cyan-900/30 text-cyan-400 px-2 py-1 rounded hover:bg-cyan-600 hover:text-white transition">
                            AVALIAR
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* SALA DE ESPERA (Direita) */}
              <div className="w-full lg:w-80 bg-[#1e293b]/30 border border-slate-800 rounded-xl flex flex-col">
                <div className="p-4 border-b border-slate-800 bg-[#0f172a]/50">
                  <h3 className="text-xs font-bold text-orange-400 uppercase tracking-wider flex items-center gap-2">
                    <span>⏳</span> Sala de Espera
                  </h3>
                  <p className="text-[10px] text-slate-500 mt-1">
                    Candidatos aprovados aguardando cadastro e liberação do HC.
                  </p>
                </div>

                <div className="p-4 flex-1 space-y-3 overflow-y-auto max-h-[400px]">
                  {/* Card Rookie 1 */}
                  <div className="bg-black/20 p-3 rounded-lg border border-orange-500/20 flex gap-3 opacity-70 hover:opacity-100 transition">
                    <div className="h-8 w-8 rounded bg-orange-900/20 text-orange-500 flex items-center justify-center font-bold text-xs">RS</div>
                    <div>
                      <p className="text-xs font-bold text-white">Rafael Souza</p>
                      <p className="text-[10px] text-slate-500">Aprovado: 2h atrás</p>
                      <span className="text-[9px] text-orange-400 bg-orange-900/10 px-1 rounded">Pendente: Cadastro</span>
                    </div>
                  </div>

                  {/* Empty State */}
                  <div className="border border-dashed border-slate-800 rounded p-4 text-center">
                    <p className="text-[10px] text-slate-600">Arraste aprovados para cá</p>
                  </div>
                </div>
              </div>

            </div>

          </main>

          {/* JULES AGENT (Contexto Tryout) */}
          <JulesAgent context="SETTINGS" /> 

        </div>
      </div>
    </div>
  );
};

export default TryoutLab;