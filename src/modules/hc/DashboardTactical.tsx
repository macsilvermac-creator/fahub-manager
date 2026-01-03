import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Calendar, 
  Target, 
  Activity, 
  ArrowUpRight, 
  Shield 
} from 'lucide-react';
import JulesAgent from '../../lib/Jules';
import EventTicker from '../../components/EventTicker';

/**
 * DASHBOARD TACTICAL - HEAD COACH VIEW
 * FOCO: Interface Limpa com Sidebar Única (Provida pelo DashboardLayout).
 * CONFORMIDADE: Playbook Lab atribuído ao HC | Tryout Lab visual apenas.
 */

const DashboardTactical: React.FC = () => {
  const navigate = useNavigate();
  
  // MOCK TÁTICO ATUALIZADO
  const stats = {
    rosterSize: 55,
    activePlayers: 48,
    injuredPlayers: 4,
    nextEvent: { type: 'TREINO', time: '19:00', confirmed: 42 },
    tryoutCandidates: 12,
    playbookInstall: 65 
  };

  const readiness = Math.round((stats.activePlayers / stats.rosterSize) * 100);

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto p-4 animate-in fade-in duration-500">
      
      {/* 1. STATUS LINE (Topo Tático) - Sem Sidebar Interna */}
      <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4 mb-2">
        <div>
          <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter">
            Command <span className="text-orange-500">Center</span>
          </h2>
          <p className="text-[10px] text-slate-500 font-mono tracking-wider uppercase">
            HC CONSOLE • OPERAÇÃO TÁTICA • 2026
          </p>
        </div>
        
        <div className="flex gap-3">
            <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl flex flex-col items-center min-w-[80px]">
                <span className="text-[9px] text-slate-500 font-black uppercase tracking-widest">OFFENSE</span>
                <span className="text-lg font-black text-white leading-none">92%</span>
            </div>
            <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl flex flex-col items-center min-w-[80px]">
                <span className="text-[9px] text-slate-500 font-black uppercase tracking-widest">DEFENSE</span>
                <span className="text-lg font-black text-white leading-none">88%</span>
            </div>
        </div>
      </div>

      <EventTicker />

      {/* 2. GRID DE COMANDO (4 Containers) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* C1: ROSTER & HEALTH - Link direto para Elenco */}
        <div 
            onClick={() => navigate('/elenco')}
            className="group bg-white/5 border border-orange-500/20 hover:border-orange-500/50 rounded-[2.5rem] p-8 flex flex-col justify-between cursor-pointer transition-all"
        >
            <div className="flex justify-between">
                <div className="p-3 bg-orange-500/10 rounded-2xl text-orange-500"><Users size={24} /></div>
                <ArrowUpRight className="text-slate-600 group-hover:text-white transition-colors" />
            </div>
            <div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Prontidão</p>
                <h3 className="text-5xl font-black text-white italic tracking-tighter">{readiness}%</h3>
            </div>
            <div className="flex gap-2 mt-4">
                <span className="px-3 py-1 bg-red-500/10 border border-red-500/20 rounded-lg text-[10px] font-black text-red-400 uppercase">
                    {stats.injuredPlayers} DM
                </span>
            </div>
        </div>

        {/* C2: NEXT PRACTICE - Link para Agenda */}
        <div 
            onClick={() => navigate('/agenda')}
            className="group bg-white/5 border border-blue-500/20 hover:border-blue-500/50 rounded-[2.5rem] p-8 flex flex-col justify-between cursor-pointer transition-all"
        >
            <div className="flex justify-between">
                <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-500"><Calendar size={24} /></div>
                <ArrowUpRight className="text-slate-600 group-hover:text-white transition-colors" />
            </div>
            <div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2">Próxima Sessão</p>
                <h3 className="text-4xl font-black text-white italic uppercase">{stats.nextEvent.time}</h3>
            </div>
            <div className="w-full bg-white/5 h-1.5 rounded-full mt-4">
                <div className="h-full bg-blue-500 w-[75%]" />
            </div>
        </div>

        {/* C3: TRYOUT VISUAL - Somente visualização para o HC */}
        <div className="bg-white/5 border border-white/5 rounded-[2.5rem] p-8 flex flex-col justify-between opacity-80">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-500/10 rounded-xl text-emerald-500"><Target size={20} /></div>
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Recrutamento</span>
            </div>
            <div>
                <h4 className="text-xl font-bold text-slate-200 italic uppercase">Novos Talentos</h4>
                <p className="text-[10px] text-slate-500 uppercase mt-1">Gestão: Diretor de Esportes</p>
            </div>
            <div className="mt-4 text-[10px] font-black text-emerald-400 uppercase">
                {stats.tryoutCandidates} Candidatos na Fila
            </div>
        </div>

        {/* C4: PLAYBOOK LAB - Exclusivo HC */}
        <div 
            onClick={() => navigate('/creative-lab')} 
            className="group bg-white/5 border border-purple-500/20 hover:border-purple-500/50 rounded-[2.5rem] p-8 flex flex-col justify-between cursor-pointer transition-all"
        >
            <div className="flex justify-between">
                <div className="p-3 bg-purple-500/10 rounded-2xl text-purple-500"><Shield size={24} /></div>
                <ArrowUpRight className="text-slate-600 group-hover:text-white transition-colors" />
            </div>
            <div>
                <h4 className="text-xl font-bold text-slate-200 italic uppercase">Playbook Lab</h4>
                <p className="text-[10px] text-slate-500 uppercase mt-1">Instalação Tática: {stats.playbookInstall}%</p>
            </div>
            <div className="mt-4 px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-lg text-center text-[10px] font-black text-purple-400 uppercase group-hover:bg-purple-500 group-hover:text-white transition-all">
                Abrir Estratégia
            </div>
        </div>

      </div>

      <JulesAgent context="DASHBOARD" />
    </div>
  );
};

export default DashboardTactical;