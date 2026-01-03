import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { 
  Users, 
  Search, 
  MoreHorizontal, 
  UserPlus, 
  Send,
  ShieldCheck,
  Stethoscope,
  GraduationCap
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/**
 * HUMAN CAPITAL - PROTOCOLO NEXUS
 * Módulo Dark Mode Integrado ao DashboardLayout
 */

interface Member {
  id: string;
  full_name: string;
  role: 'ATLETA' | 'ALUNO' | 'CT' | 'STAFF';
  category: 'ELITE' | 'BASE' | 'ESCOLINHA' | 'DIRETORIA';
  status: 'ACTIVE' | 'INJURED' | 'EVALUATION' | 'SUSPENDED';
  position?: string;
}

export default function HumanCapital() {
  const navigate = useNavigate();
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [recommendation, setRecommendation] = useState('');
  const [target, setTarget] = useState('HC');

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('athletes')
      .select('id, full_name, status, position');
    
    if (!error && data) {
      const mapped: Member[] = data.map((m: any) => ({
        id: m.id,
        full_name: m.full_name,
        role: 'ATLETA' as const,
        category: 'ELITE' as const,
        status: (m.status === 'active' ? 'ACTIVE' : 'EVALUATION') as Member['status'],
        position: m.position
      }));
      setMembers(mapped);
    }
    setLoading(false);
  };

  const handleEmitAction = async () => {
    if (!selectedMember || !recommendation) return;
    
    const { error } = await supabase.from('notifications').insert([{
      member_id: selectedMember.id,
      sender_role: 'DIR_ESPORTES',
      target_role: target,
      message: recommendation,
      type: 'ACTION_RECOMMENDATION'
    }]);

    if (!error) {
      alert(`[NEXUS] Ordem de ação emitida para ${target}`);
      setSelectedMember(null);
      setRecommendation('');
    }
  };

  const filteredMembers = members.filter(m => {
    const matchesFilter = filter === 'ALL' || m.role === filter;
    const matchesSearch = m.full_name.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="flex flex-col gap-6 w-full animate-in fade-in duration-500">
      
      {/* HEADER DO MÓDULO (Sem voltar, pois Sidebar já navega) */}
      <div className="flex flex-col md:flex-row justify-between items-end md:items-center p-6 bg-[#0a0f1e]/50 border border-white/5 rounded-[2rem] backdrop-blur-sm">
         <div>
            <h1 className="text-2xl font-black text-white uppercase tracking-tighter italic">
              Material Humano
            </h1>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest italic mt-1">
              Nexus Operational Module
            </p>
         </div>
         <button className="mt-4 md:mt-0 flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-[0_0_15px_rgba(79,70,229,0.3)]">
           <UserPlus size={16} /> Injetar Membro
         </button>
      </div>

      {/* BARRA DE FILTROS & BUSCA */}
      <div className="flex flex-col md:flex-row gap-4 p-4 bg-[#0a0f1e]/40 rounded-2xl border border-white/5">
         <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" size={18} />
            <input 
              type="text" 
              placeholder="Pesquisar por nome na rede..." 
              className="w-full pl-12 pr-4 py-3 bg-[#050510] border border-white/10 rounded-xl outline-none text-sm text-slate-300 focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 transition-all placeholder:text-slate-600"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
         </div>
         <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
            {['ALL', 'ATLETA', 'ALUNO', 'CT', 'STAFF'].map((cat) => (
              <button 
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap border ${
                  filter === cat 
                    ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-900/50' 
                    : 'bg-[#050510] border-white/5 text-slate-500 hover:text-white hover:border-white/20'
                }`}
              >
                {cat}
              </button>
            ))}
         </div>
      </div>

      {/* GRID DE MEMBROS */}
      {loading ? (
        <div className="flex justify-center py-20">
           <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin shadow-[0_0_15px_rgba(79,70,229,0.5)]" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-20">
          {filteredMembers.map((member) => (
            <div key={member.id} className="bg-[#0a0f1e]/60 border border-white/5 rounded-[2rem] p-6 hover:bg-[#0a0f1e] hover:border-indigo-500/30 transition-all group backdrop-blur-md">
              <div className="flex justify-between items-start mb-4">
                <div className="w-12 h-12 rounded-2xl bg-[#050510] border border-white/5 flex items-center justify-center text-slate-500 group-hover:text-indigo-400 transition-colors">
                  <Users size={24} />
                </div>
                <button onClick={() => setSelectedMember(member)} className="p-2 text-slate-600 hover:text-white hover:bg-white/5 rounded-lg transition-all">
                  <MoreHorizontal size={20} />
                </button>
              </div>
              
              <h3 className="text-sm font-black text-white uppercase tracking-tight italic truncate">
                {member.full_name}
              </h3>
              <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">
                POS: <span className="text-slate-400">{member.position || 'N/A'}</span>
              </p>
              
              <div className="flex items-center gap-2 mt-4">
                <span className={`px-2 py-1 rounded text-[9px] font-black uppercase tracking-widest border ${
                  member.status === 'ACTIVE' 
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                    : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                }`}>
                  {member.status}
                </span>
                <span className="text-[9px] text-slate-600 font-bold uppercase tracking-widest">• {member.category}</span>
              </div>

              <button 
                onClick={() => setSelectedMember(member)}
                className="w-full mt-6 py-3 bg-[#050510] border border-white/5 group-hover:bg-indigo-600 group-hover:border-indigo-500 group-hover:text-white text-slate-500 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2"
              >
                <Send size={14} /> Gerenciar
              </button>
            </div>
          ))}
        </div>
      )}

      {/* MODAL DE AÇÃO (DRAWER LATERAL) */}
      {selectedMember && (
        <div className="fixed inset-0 z-[100] flex justify-end bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="w-full max-w-md bg-[#0a0f1e] h-full shadow-2xl border-l border-white/10 animate-in slide-in-from-right duration-500 flex flex-col font-sans">
            
            <div className="p-8 border-b border-white/5 flex justify-between items-center bg-[#050510]">
              <h2 className="text-xl font-black text-white uppercase tracking-tighter italic">Comando de Ação</h2>
              <button onClick={() => setSelectedMember(null)} className="text-slate-500 hover:text-white transition-colors font-bold text-2xl">×</button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-8 space-y-8 custom-scrollbar">
              <div className="bg-[#050510] p-6 rounded-[2rem] border border-white/5">
                <p className="text-[10px] text-slate-500 font-black uppercase tracking-widest mb-1 italic">Membro Selecionado</p>
                <h4 className="text-lg font-black text-white uppercase italic leading-none">{selectedMember.full_name}</h4>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] text-slate-400 font-black uppercase tracking-widest flex items-center gap-2">
                  <ShieldCheck size={14} className="text-indigo-500" /> Alvo da Recomendação
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'HC', label: 'Head Coach', icon: <Users size={12} /> },
                    { id: 'MEDICAL', label: 'Depto Médico', icon: <Stethoscope size={12} /> },
                    { id: 'BASE', label: 'Coord. Base', icon: <GraduationCap size={12} /> },
                    { id: 'FINANCE', label: 'Financeiro', icon: <ShieldCheck size={12} /> }
                  ].map((t) => (
                    <button 
                      key={t.id}
                      onClick={() => setTarget(t.id)}
                      className={`flex items-center gap-2 p-3 rounded-xl border text-[10px] font-black uppercase tracking-widest transition-all ${
                        target === t.id 
                          ? 'bg-indigo-600 border-indigo-500 text-white shadow-[0_0_15px_rgba(79,70,229,0.3)]' 
                          : 'bg-[#050510] border-white/10 text-slate-500 hover:border-white/30 hover:text-white'
                      }`}
                    >
                      {t.icon} {t.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Ação Recomendada pelo Diretor</label>
                <textarea 
                  className="w-full h-40 bg-[#050510] border border-white/10 rounded-3xl p-5 text-sm outline-none focus:border-indigo-500/50 focus:ring-1 focus:ring-indigo-500/50 resize-none font-medium text-slate-300 placeholder:text-slate-700"
                  placeholder="Instruções para o alvo da ação..."
                  value={recommendation}
                  onChange={(e) => setRecommendation(e.target.value)}
                />
              </div>
            </div>

            <div className="p-8 border-t border-white/5 bg-[#050510]">
              <button 
                onClick={handleEmitAction}
                disabled={!recommendation}
                className="w-full py-5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-[#1e293b] disabled:text-slate-600 disabled:cursor-not-allowed text-white rounded-2xl font-black text-xs uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_30px_rgba(79,70,229,0.5)]"
              >
                <Send size={18} /> Emitir Ordem
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}