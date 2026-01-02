import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DashboardSidebar from '../dashboard/components/DashboardSidebar';
import JulesAgent from '../shared/components/JulesAgent';

const HumanCapital: React.FC = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Dados Mockados
  const members = [
    { id: 1, name: 'Gabriel Silva', role: 'Linebacker', status: 'APTO', health: 100, perf: 88, initials: 'GS' },
    { id: 2, name: 'Lucas Oliveira', role: 'Quarterback', status: 'DM', health: 45, perf: 92, initials: 'LO' },
    { id: 3, name: 'Matheus Costa', role: 'Wide Receiver', status: 'APTO', health: 95, perf: 75, initials: 'MC' },
    { id: 4, name: 'André Santos', role: 'Safety', status: 'SUSPENSO', health: 100, perf: 60, initials: 'AS' },
    { id: 5, name: 'Felipe Rocha', role: 'Offensive Line', status: 'APTO', health: 88, perf: 82, initials: 'FR' },
    { id: 6, name: 'Bruno Lima', role: 'Running Back', status: 'APTO', health: 92, perf: 89, initials: 'BL' },
  ];

  const filteredMembers = members.filter(m => 
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
              <h1 className="text-lg font-bold text-white flex items-center gap-2"><span className="text-blue-500">🛡️</span> PATRIMÔNIO HUMANO</h1>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest">Gestão de Ativos e Talentos</p>
            </div>
          </div>
          <button className="px-4 py-2 text-xs font-bold bg-blue-600 text-white rounded hover:bg-blue-500 transition shadow-lg shadow-blue-500/20">+ Novo Membro</button>
        </header>

        <main className="p-4 max-w-7xl mx-auto w-full pb-24">
          
          {/* BARRA DE BUSCA */}
          <div className="flex gap-3 mb-6">
            <div className="flex-1 relative">
              <input 
                type="text" 
                placeholder="Buscar por nome, posição ou status..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#1e293b]/50 border border-slate-700 text-sm text-white rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:border-blue-500 transition"
              />
              <span className="absolute left-3 top-3.5 text-slate-500">🔍</span>
            </div>
            <button className="px-4 py-2 bg-[#1e293b] border border-slate-700 rounded-xl text-slate-300 hover:text-white hover:border-blue-500 transition"><span className="text-lg">⚡</span></button>
          </div>

          {/* LISTA */}
          <div className="bg-[#1e293b]/30 border border-slate-800 rounded-xl overflow-hidden">
            <div className="grid grid-cols-12 gap-4 p-3 border-b border-slate-800 bg-[#0f172a]/50 text-[10px] uppercase font-bold text-slate-500 tracking-wider">
              <div className="col-span-5 md:col-span-4 pl-2">Membro / Posição</div>
              <div className="col-span-3 md:col-span-3 text-center">Status / Saúde</div>
              <div className="col-span-2 md:col-span-3 text-center">Performance</div>
              <div className="col-span-2 md:col-span-2 text-right pr-2">Ação</div>
            </div>
            <div className="divide-y divide-slate-800/50">
              {filteredMembers.map((member) => (
                <div key={member.id} className="grid grid-cols-12 gap-4 p-3 items-center hover:bg-white/5 transition duration-200 group">
                  <div className="col-span-5 md:col-span-4 flex items-center gap-3 pl-2">
                    <div className="h-10 w-10 rounded-full bg-[#0f172a] border border-slate-700 flex items-center justify-center text-xs font-bold text-blue-400 group-hover:border-blue-500 transition">{member.initials}</div>
                    <div>
                      <h3 className="text-sm font-bold text-slate-200 group-hover:text-white">{member.name}</h3>
                      <p className="text-[10px] text-slate-500 uppercase font-mono">{member.role}</p>
                    </div>
                  </div>
                  <div className="col-span-3 md:col-span-3 flex flex-col items-center justify-center">
                    <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase border mb-1
                      ${member.status === 'APTO' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : ''}
                      ${member.status === 'DM' ? 'bg-orange-500/10 text-orange-400 border-orange-500/20' : ''}
                      ${member.status === 'SUSPENSO' ? 'bg-red-500/10 text-red-400 border-red-500/20' : ''}
                    `}>{member.status === 'APTO' ? '● APTO' : member.status}</span>
                    <div className="w-16 h-1 bg-slate-700 rounded-full overflow-hidden">
                      <div className={`h-full ${member.health > 80 ? 'bg-emerald-500' : 'bg-orange-500'}`} style={{ width: `${member.health}%` }}/>
                    </div>
                  </div>
                  <div className="col-span-2 md:col-span-3 flex items-center justify-center gap-2">
                    <span className="text-xs font-mono font-bold text-indigo-400">⚡ {member.perf}%</span>
                  </div>
                  <div className="col-span-2 md:col-span-2 flex justify-end pr-2">
                    <button onClick={() => navigate('/perfil-membro')} className="text-[10px] font-bold text-slate-400 hover:text-white border border-slate-700 hover:border-blue-500 rounded px-3 py-1.5 transition flex items-center gap-1 bg-[#0f172a]">
                      VER 360° <span className="text-blue-500">›</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
            {filteredMembers.length === 0 && <div className="p-8 text-center text-slate-500 text-sm">Nenhum membro encontrado.</div>}
          </div>
        </main>

        {/* JULES AGENT */}
        <JulesAgent context="PEOPLE" />

      </div>
    </div>
  );
};

export default HumanCapital;