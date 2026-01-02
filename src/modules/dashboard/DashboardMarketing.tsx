import React, { useState } from 'react';
import { Share2, Users, Calendar, DollarSign, X, Upload, Camera, BarChart2 } from 'lucide-react';
import JulesAgent from '../../lib/Jules';

// --- TIPOS MOCKADOS PARA O MARKETING ---
interface Campaign {
  id: string;
  name: string;
  status: 'ACTIVE' | 'DRAFT' | 'PAUSED';
  link?: string;
  deadline: string;
  conversion: number;
}

interface Sponsor {
  id: string;
  name: string;
  logo: string; // Emoji por enquanto
  nextDeliverable: string;
  status: 'PENDING' | 'DONE';
}

const DashboardMarketing: React.FC = () => {
  // Estado de Expansão (Qual card está aberto?)
  const [expandedCard, setExpandedCard] = useState<'CAMPAIGNS' | 'SPONSORS' | 'FANBASE' | 'MEDIA' | null>(null);

  // MOCK DATA (Simulando dados vindos do Supabase)
  const activeCampaign: Campaign = {
    id: '1',
    name: 'Seletiva 2026 (Tryout)',
    status: 'ACTIVE',
    link: 'https://forms.google.com/xyz...', // O link que veio do TryoutLab
    deadline: '5 dias restantes',
    conversion: 142 // Inscritos
  };

  const sponsors: Sponsor[] = [
    { id: '1', name: 'Red Zone Energy', logo: '⚡', nextDeliverable: 'Post Story (Recebidos)', status: 'PENDING' },
    { id: '2', name: 'Hamburgueria Touchdown', logo: '🍔', nextDeliverable: 'Banner Site', status: 'DONE' },
  ];

  // --- COMPONENTES VISUAIS (Protocolo 2x2) ---

  // 1. CONTAINER: WAR ROOM (Campanhas)
  const renderCampaignsCard = () => (
    <div 
      onClick={() => setExpandedCard('CAMPAIGNS')}
      className="bg-[#1e293b]/40 border border-indigo-500/30 hover:border-indigo-500 hover:bg-[#1e293b]/60 rounded-2xl p-6 cursor-pointer transition-all duration-300 group relative overflow-hidden h-full flex flex-col justify-between"
    >
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition">
        <Share2 size={64} className="text-indigo-500" />
      </div>
      
      <div>
        <h3 className="text-indigo-400 text-xs font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse"></span> War Room
        </h3>
        <h2 className="text-2xl font-black text-white leading-tight">{activeCampaign.name}</h2>
        <p className="text-xs text-slate-400 mt-1">Link Ativo: Google Forms</p>
      </div>

      <div className="mt-4">
         <div className="flex justify-between text-xs mb-1">
           <span className="text-slate-400">Meta de Inscritos</span>
           <span className="text-white font-bold">{activeCampaign.conversion} / 200</span>
         </div>
         <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
           <div className="bg-indigo-500 h-full w-[70%]"></div>
         </div>
      </div>
    </div>
  );

  // 2. CONTAINER: SPONSOR DECK (Parceiros)
  const renderSponsorsCard = () => (
    <div 
      onClick={() => setExpandedCard('SPONSORS')}
      className="bg-[#1e293b]/40 border border-emerald-500/30 hover:border-emerald-500 hover:bg-[#1e293b]/60 rounded-2xl p-6 cursor-pointer transition-all duration-300 group relative overflow-hidden h-full flex flex-col justify-between"
    >
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition">
        <DollarSign size={64} className="text-emerald-500" />
      </div>

      <div>
        <h3 className="text-emerald-400 text-xs font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
           <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Sponsor Deck
        </h3>
        <div className="flex -space-x-2 mb-2">
           {sponsors.map(s => (
             <div key={s.id} className="w-10 h-10 rounded-full bg-slate-800 border-2 border-[#020617] flex items-center justify-center text-xl" title={s.name}>{s.logo}</div>
           ))}
        </div>
      </div>

      <div className="bg-red-500/10 border border-red-500/30 p-3 rounded-lg">
        <p className="text-[10px] text-red-400 uppercase font-bold mb-1">⚠️ Ação Pendente Hoje</p>
        <p className="text-xs text-white font-medium">{sponsors[0].nextDeliverable}</p>
        <p className="text-[10px] text-slate-400">{sponsors[0].name}</p>
      </div>
    </div>
  );

  // 3. CONTAINER: FANBASE (Radar Social)
  const renderFanbaseCard = () => (
    <div 
      onClick={() => setExpandedCard('FANBASE')}
      className="bg-[#1e293b]/40 border border-pink-500/30 hover:border-pink-500 hover:bg-[#1e293b]/60 rounded-2xl p-6 cursor-pointer transition-all duration-300 group relative overflow-hidden h-full flex flex-col justify-between"
    >
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition">
        <Users size={64} className="text-pink-500" />
      </div>

      <div>
         <h3 className="text-pink-400 text-xs font-bold uppercase tracking-widest mb-2">Social Radar</h3>
         <h2 className="text-4xl font-black text-white">12.5k</h2>
         <p className="text-xs text-slate-400 uppercase tracking-widest mt-1">Seguidores Totais</p>
      </div>

      <div className="flex items-end gap-2 mt-2">
         <span className="text-emerald-400 font-bold text-lg">↑ 12%</span>
         <span className="text-[10px] text-slate-500 mb-1">vs. semana passada</span>
      </div>
    </div>
  );

  // 4. CONTAINER: MEDIA COVERAGE (Agenda)
  const renderMediaCard = () => (
    <div 
      onClick={() => setExpandedCard('MEDIA')}
      className="bg-[#1e293b]/40 border border-orange-500/30 hover:border-orange-500 hover:bg-[#1e293b]/60 rounded-2xl p-6 cursor-pointer transition-all duration-300 group relative overflow-hidden h-full flex flex-col justify-between"
    >
      <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition">
        <Camera size={64} className="text-orange-500" />
      </div>

      <div>
         <h3 className="text-orange-400 text-xs font-bold uppercase tracking-widest mb-2">Media Coverage</h3>
         <p className="text-[10px] text-slate-400 uppercase">Próxima Cobertura</p>
         <h2 className="text-xl font-bold text-white mt-1">Domingo, 14:00</h2>
         <p className="text-sm text-orange-200">vs Steamrollers</p>
      </div>

      <div className="flex gap-2 mt-4">
        <span className="px-2 py-1 bg-slate-800 rounded text-[10px] text-slate-300 border border-slate-700">📸 Foto</span>
        <span className="px-2 py-1 bg-slate-800 rounded text-[10px] text-slate-300 border border-slate-700">📹 Drone</span>
      </div>
    </div>
  );

  // --- RENDERIZAÇÃO PRINCIPAL ---
  return (
    <div className="h-full flex flex-col relative">
      
      {/* CABEÇALHO DO MÓDULO */}
      <div className="mb-6 flex justify-between items-end">
        <div>
           <h1 className="text-2xl font-black italic text-white tracking-tight">CMO DASHBOARD</h1>
           <p className="text-xs text-slate-400 uppercase tracking-widest">Marketing • Expansão • Marca</p>
        </div>
        {/* Quick Link para o Creative Lab */}
        <button className="hidden md:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg text-xs font-bold text-white hover:opacity-90 transition shadow-lg shadow-purple-900/50">
           <span>🎨</span> Acessar Creative Lab
        </button>
      </div>

      {/* PROTOCOLO FAHUB 2x2 */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 flex-1 min-h-0">
         {renderCampaignsCard()}
         {renderSponsorsCard()}
         {renderFanbaseCard()}
         {renderMediaCard()}
      </div>

      {/* --- OVERLAYS DE EXPANSÃO (INJEÇÃO DE FUNCIONALIDADE) --- */}
      {expandedCard && (
        <div className="absolute inset-0 z-50 bg-[#020617]/95 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in">
           <div className="bg-[#0f172a] w-full max-w-4xl h-[80vh] rounded-2xl border border-slate-700 shadow-2xl flex flex-col overflow-hidden relative">
              
              {/* Header do Overlay */}
              <div className="p-6 border-b border-slate-700 bg-[#1e293b] flex justify-between items-center">
                 <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    {expandedCard === 'CAMPAIGNS' && <><Share2 /> WAR ROOM: CAMPANHAS</>}
                    {expandedCard === 'SPONSORS' && <><DollarSign /> SPONSOR DECK</>}
                    {expandedCard === 'FANBASE' && <><Users /> SOCIAL RADAR</>}
                    {expandedCard === 'MEDIA' && <><Camera /> MEDIA COVERAGE</>}
                 </h2>
                 <button onClick={() => setExpandedCard(null)} className="p-2 hover:bg-slate-700 rounded-full text-slate-400 hover:text-white transition">
                    <X size={24} />
                 </button>
              </div>

              {/* Corpo do Overlay (Injeção de Ferramentas) */}
              <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
                 
                 {/* 1. EXPANSÃO: CAMPANHAS */}
                 {expandedCard === 'CAMPAIGNS' && (
                    <div className="space-y-6">
                       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="bg-slate-800 p-6 rounded-xl border border-slate-700 text-center">
                             <div className="bg-white p-4 w-48 h-48 mx-auto rounded-lg mb-4 flex items-center justify-center">
                                <span className="text-black font-mono text-xs">QR CODE SIMULADO</span>
                             </div>
                             <button className="px-4 py-2 bg-indigo-600 text-white rounded font-bold text-sm w-full hover:bg-indigo-500">Baixar QR Code</button>
                          </div>
                          <div className="space-y-4">
                             <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700">
                                <label className="text-xs text-slate-400 font-bold uppercase">Link Ativo</label>
                                <div className="flex gap-2 mt-1">
                                   <input readOnly value={activeCampaign.link} className="flex-1 bg-black/30 border border-slate-600 rounded px-3 py-2 text-sm text-slate-300 font-mono" />
                                   <button className="px-3 bg-slate-700 text-white rounded hover:bg-slate-600">Copiar</button>
                                </div>
                             </div>
                             <div className="p-4 bg-slate-800/50 rounded-xl border border-slate-700">
                                <label className="text-xs text-slate-400 font-bold uppercase">Checklist de Lançamento</label>
                                <div className="mt-2 space-y-2">
                                   <label className="flex items-center gap-2 text-sm text-slate-300"><input type="checkbox" checked className="accent-indigo-500" /> Post no Feed (Instagram)</label>
                                   <label className="flex items-center gap-2 text-sm text-slate-300"><input type="checkbox" className="accent-indigo-500" /> Disparo Grupos WhatsApp</label>
                                   <label className="flex items-center gap-2 text-sm text-slate-300"><input type="checkbox" className="accent-indigo-500" /> Stories com Link</label>
                                </div>
                             </div>
                          </div>
                       </div>
                    </div>
                 )}

                 {/* 2. EXPANSÃO: SPONSORS */}
                 {expandedCard === 'SPONSORS' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                       {sponsors.map(s => (
                          <div key={s.id} className="bg-slate-800/50 border border-slate-700 rounded-xl p-6">
                             <div className="flex justify-between items-start mb-4">
                                <div className="flex items-center gap-3">
                                   <div className="text-3xl bg-slate-700 w-12 h-12 flex items-center justify-center rounded-full">{s.logo}</div>
                                   <div>
                                      <h3 className="font-bold text-white">{s.name}</h3>
                                      <p className="text-xs text-slate-400">Contrato: Ouro (Vence em Dez/26)</p>
                                   </div>
                                </div>
                                <span className={`px-2 py-1 text-[10px] rounded font-bold ${s.status === 'PENDING' ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
                                   {s.status === 'PENDING' ? 'PENDÊNCIA' : 'EM DIA'}
                                </span>
                             </div>
                             
                             <div className="bg-black/20 p-4 rounded-lg border border-slate-700 mb-4">
                                <p className="text-[10px] text-slate-500 uppercase font-bold mb-1">Entregável da Semana</p>
                                <p className="text-sm text-white font-medium flex items-center gap-2">
                                   {s.status === 'PENDING' ? '⚠️' : '✅'} {s.nextDeliverable}
                                </p>
                             </div>

                             <button className="w-full py-3 border border-dashed border-slate-600 rounded-lg text-slate-400 hover:text-white hover:border-slate-400 hover:bg-slate-700/50 transition flex items-center justify-center gap-2 text-xs font-bold">
                                <Upload size={16} /> Fazer Upload de Comprovante (Print)
                             </button>
                          </div>
                       ))}
                    </div>
                 )}

                 {/* 3. EXPANSÃO: FANBASE */}
                 {expandedCard === 'FANBASE' && (
                    <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
                       <BarChart2 size={64} className="text-pink-500 opacity-50" />
                       <h3 className="text-white font-bold text-lg">Módulo Analítico em Construção</h3>
                       <p className="text-slate-400 text-sm max-w-md">
                          Os gráficos de crescimento e engajamento serão conectados à API do Meta/Instagram na próxima sprint.
                       </p>
                    </div>
                 )}

                 {/* 4. EXPANSÃO: MEDIA */}
                 {expandedCard === 'MEDIA' && (
                    <div className="space-y-6">
                       <div className="bg-orange-900/10 border border-orange-500/30 p-4 rounded-xl flex justify-between items-center">
                          <div>
                             <h3 className="font-bold text-white text-lg">Próximo Jogo: vs Steamrollers</h3>
                             <p className="text-sm text-orange-200">Domingo • 14:00 • Estádio Municipal</p>
                          </div>
                          <div className="text-right">
                             <p className="text-3xl font-black text-orange-500">2d</p>
                             <p className="text-[10px] text-slate-400 uppercase">Restantes</p>
                          </div>
                       </div>

                       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="bg-slate-800 p-5 rounded-xl border border-slate-700">
                             <h4 className="text-xs font-bold text-slate-400 uppercase mb-3">Escala de Mídia</h4>
                             <ul className="space-y-3">
                                <li className="flex justify-between text-sm text-slate-300 border-b border-slate-700 pb-2">
                                   <span>📸 Fotografia</span>
                                   <span className="text-white font-bold">João Pedro</span>
                                </li>
                                <li className="flex justify-between text-sm text-slate-300 border-b border-slate-700 pb-2">
                                   <span>📹 Filmmaker</span>
                                   <span className="text-white font-bold">Mariana</span>
                                </li>
                                <li className="flex justify-between text-sm text-slate-300 border-b border-slate-700 pb-2">
                                   <span>📱 Social Media (Stories)</span>
                                   <span className="text-yellow-500 font-bold">Pendente</span>
                                </li>
                             </ul>
                          </div>
                          <div className="bg-slate-800 p-5 rounded-xl border border-slate-700">
                             <h4 className="text-xs font-bold text-slate-400 uppercase mb-3">Briefing (O que captar?)</h4>
                             <textarea 
                               className="w-full h-32 bg-black/30 border border-slate-600 rounded p-3 text-sm text-white resize-none"
                               defaultValue="- Focar na reação da torcida nos touchdowns.&#10;- Pegar takes em slow motion do aquecimento do QB.&#10;- Garantir foto da placa de publicidade da Red Zone."
                             />
                          </div>
                       </div>
                    </div>
                 )}

              </div>
           </div>
        </div>
      )}

      <JulesAgent context="SETTINGS" /> {/* Contexto Marketing ainda não existe no Jules, usando Settings por enquanto */}
    </div>
  );
};

export default DashboardMarketing;