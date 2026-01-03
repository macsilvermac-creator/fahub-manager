import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, Calendar, ClipboardList, Target, 
  Activity, ArrowUpRight, Shield, Zap
} from 'lucide-react';
import JulesAgent from '../../lib/Jules';
import EventTicker from '../../components/EventTicker';

/**
 * DASHBOARD TACTICAL - HEAD COACH VIEW
 * Protocolo Nexus: Command Center para Tomada de Decisão Tática.
 * Fundo: Deep Void (#050510) | Glassmorphism.
 */

const DashboardTactical: React.FC = () => {
  const navigate = useNavigate();
  
  // ANCORA DE DADOS: No futuro, estes valores virão do usePerformanceData() ou Supabase.
  const stats = {
    rosterSize: 55,
    activePlayers: 48,
    injuredPlayers: 4,
    nextEvent: { type: 'TREINO', time: '19:00', confirmed: 42 },
    tryoutCandidates: 12,
    playbookInstall: 65 // % de instalação do plano tático
  };

  const readiness = Math.round((stats.activePlayers / stats.rosterSize) * 100);

  return (
    <div className="flex flex-col gap-6 w-full max-w-7xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* 1. STATUS LINE (Topo Tático) */}
      <div className="flex flex-col md:flex-row justify-between items-end md:items-center gap-4 mb-2">
        <div>
          <h2 className="text-3xl font-black text-white uppercase italic tracking-tighter">
            Command <span className="text-orange-500">Center</span>
          </h2>
          <p className="text-[10px] text-slate-500 font-mono tracking-wider uppercase">
            PERFIL TÁTICO: <span className="text-orange-400 font-bold">HEAD COACH</span> • SEASON 2026
          </p>
        </div>
        
        {/* Hud de Status Rápido de Unidades */}
        <div className="flex gap-3">
            <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl flex flex-col items-center min-w-[80px]">
                <span className="text-[9px] text-slate-500 font-black uppercase">OFFENSE</span>
                <span className="text-lg font-black text-white leading-none">92%</span>
            </div>
            <div className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl flex flex-col items-center min-w-[80px]">
                <span className="text-[9px] text-slate-500 font-black uppercase">DEFENSE</span>
                <span className="text-lg font-black text-white leading-none">88%</span>
            </div>
        </div>
      </div>

      {/* Ticker de Eventos Globais */}
      <EventTicker />

      {/* 2. GRID DE COMANDO (4 Containers) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* C1: ROSTER & HEALTH (Elenco) */}
        <div 
            onClick={() => navigate('/elenco')}
            className="group relative bg-white/5 border border-orange-500/20 hover:border-orange-500/50 rounded-[2.5rem] p-8 min-h-[240px] flex flex-col justify-between cursor-pointer transition-all hover:bg-white/10"
        >
            <div className="flex justify-between items-start">
                <div className="p-3 bg-orange-500/10 rounded-2xl text-orange-500 group-hover:text-orange-400 transition-colors">
                    <Users size={24} />
                </div>
                <ArrowUpRight className="text-slate-600 group-hover:text-white transition-colors" />
            </div>
            
            <div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">Prontidão do Elenco</p>
                <div className="flex items-baseline gap-2">
                    <h3 className="text-5xl font-black text-white italic tracking-tighter">{readiness}%</h3>
                    <span className="text-sm font-bold text-slate-500 uppercase">Apto</span>
                </div>
            </div>

            <div className="flex gap-2 mt-4">
                <span className="px-3 py-1 bg-red-500/10 border border-red-500/20 rounded-lg text-[10px] font-black text-red-400 uppercase flex items-center gap-1">
                    <Activity size={12} /> {stats.injuredPlayers} DM
                </span>
                <span className="px-3 py-1 bg-black/40 border border-white/10 rounded-lg text-[10px] font-bold text-slate-400 uppercase">
                    {stats.activePlayers} Ativos
                </span>
            </div>
        </div>

        {/* C2: NEXT PRACTICE (Agenda) */}
        <div 
            onClick={() => navigate('/agenda')}
            className="group relative bg-white/5 border border-blue-500/20 hover:border-blue-500/50 rounded-[2.5rem] p-8 min-h-[240px] flex flex-col justify-between cursor-pointer transition-all hover:bg-white/10"
        >
            <div className="flex justify-between items-start">
                <div className="p-3 bg-blue-500/10 rounded-2xl text-blue-500 group-hover:text-blue-400 transition-colors">
                    <Calendar size={24} />
                </div>
                <ArrowUpRight className="text-slate-600 group-hover:text-white transition-colors" />
            </div>

            <div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] mb-2">Próxima Sessão</p>
                <h3 className="text-4xl font-black text-white italic tracking-tighter uppercase leading-none mb-1">
                    Treino Tático
                </h3>
                <p className="text-sm font-bold text-blue-400 uppercase tracking-widest">{stats.nextEvent.time} • Campo Principal</p>
            </div>

            <div className="w-full bg-white/5 h-2 rounded-full overflow-hidden mt-4">
                <div className="h-full bg-blue-500 w-[75%] shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
            </div>
            <p className="text-[10px] text-right text-slate-500 font-bold mt-1 uppercase">{stats.nextEvent.confirmed}/55 Confirmados</p>
        </div>

        {/* C3: RECRUITING (Tryout Lab) */}
        <div 
            onClick={() => navigate('/tryout-lab')}
            className="group relative bg-white/5 border border-emerald-500/20 hover:border-emerald-500/50 rounded-[2.5rem] p-8 min-h-[200px] flex flex-col justify-between cursor-pointer transition-all hover:bg-white/10"
        >
            <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-500/10 rounded-xl text-emerald-500">
                        <Target size={20} />
                    </div>
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Recrutamento</span>
                </div>
                <span className="text-2xl font-black text-white">{stats.tryoutCandidates}</span>
            </div>
            
            <div>
                <h4 className="text-xl font-bold text-slate-200 italic uppercase">Novos Talentos</h4>
                <p className="text-xs text-slate-500 mt-1">Candidatos aguardando avaliação física inicial.</p>
            </div>
            <div className="mt-4 px-4 py-2 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-center text-[10px] font-black text-emerald-400 uppercase group-hover:bg-emerald-500 group-hover:text-white transition-all">
                Acessar Lab de Recrutamento
            </div>
        </div>

        {/* C4: PLAYBOOK & SCOUT (Estratégia) */}
        <div 
            onClick={() => navigate('/estrategia')} 
            className="group relative bg-white/5 border border-purple-500/20 hover:border-purple-500/50 rounded-[2.5rem] p-8 min-h-[200px] flex flex-col justify-between cursor-pointer transition-all hover:bg-white/10"
        >
            <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-500/10 rounded-xl text-purple-500">
                        <Shield size={20} />
                    </div>
                    <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Estratégia</span>
                </div>
                <span className="text-2xl font-black text-white">{stats.playbookInstall}%</span>
            </div>
            
            <div>
                <h4 className="text-xl font-bold text-slate-200 italic uppercase">Instalação Tática</h4>
                <p className="text-xs text-slate-500 mt-1">Status do Playbook: Red Zone Offense.</p>
            </div>
             <div className="mt-4 px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-lg text-center text-[10px] font-black text-purple-400 uppercase group-hover:bg-purple-500 group-hover:text-white transition-all">
                Abrir Central de Estratégia
            </div>
        </div>

      </div>

      <JulesAgent context="HC_DASHBOARD" />
    </div>
  );
};

export default DashboardTactical;