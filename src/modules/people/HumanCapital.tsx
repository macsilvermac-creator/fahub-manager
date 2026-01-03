import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { 
  Users, 
  Search, 
  MoreHorizontal, 
  UserPlus, 
  ArrowLeft,
  Send,
  ShieldCheck,
  Stethoscope,
  GraduationCap
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/**
 * HUMAN CAPITAL - PROTOCOLO NEXUS
 * Subpágina do Container 01 (Diretor de Esportes)
 * CORREÇÃO: Tipagem estrita e remoção de variáveis não utilizadas (TS6133, TS2345).
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
      // RESOLVIDO TS2345: Mapeamento com asserção de tipos literais
      const mapped: Member[] = data.map((m: any) => ({
        id: m.id,
        full_name: m.full_name,
        role: 'ATLETA' as const, // Força o tipo literal exigido pela interface
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
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans">
      <header className="bg-white border-b border-slate-200 px-8 py-4 flex justify-between items-center sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/dashboard')} className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-all">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-xl font-black text-slate-900 uppercase tracking-tighter">Material Humano</h1>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest italic">Nexus Operational Module</p>
          </div>
        </div>
        <button className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-widest transition-all">
          <UserPlus size={16} /> Injetar Membro
        </button>
      </header>

      <main className="p-8 max-w-7xl mx-auto w-full">
        <div className="flex flex-col md:flex-row gap-4 mb-8 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Pesquisar por nome na rede..." 
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none text-sm focus:ring-2 focus:ring-indigo-500/20"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
            {['ALL', 'ATLETA', 'ALUNO', 'CT', 'STAFF'].map((cat) => (
              <button 
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all whitespace-nowrap ${
                  filter === cat ? 'bg-slate-900 text-white shadow-lg shadow-slate-900/20' : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20"><div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" /></div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMembers.map((member) => (
              <div key={member.id} className="bg-white border border-slate-200 rounded-3xl p-6 hover:shadow-xl hover:border-indigo-500/20 transition-all group">
                <div className="flex justify-between items-start mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400">
                    <Users size={24} />
                  </div>
                  <button onClick={() => setSelectedMember(member)} className="p-2 text-slate-400 hover:bg-slate-50 rounded-lg transition-all">
                    <MoreHorizontal size={20} />
                  </button>
                </div>
                <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight italic">{member.full_name}</h3>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest mt-1">POS: {member.position || 'N/A'}</p>
                
                <div className="flex items-center gap-2 mt-4">
                  <span className={`px-2 py-1 rounded text-[9px] font-black uppercase tracking-widest ${
                    member.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-600' : 'bg-amber-100 text-amber-600'
                  }`}>
                    {member.status}
                  </span>
                  <span className="text-[9px] text-slate-400 font-bold uppercase tracking-widest">• {member.category}</span>
                </div>

                <button 
                  onClick={() => setSelectedMember(member)}
                  className="w-full mt-6 py-3 bg-slate-50 group-hover:bg-indigo-600 group-hover:text-white text-slate-600 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2"
                >
                  <Send size={14} /> Gerenciar & Recomendar
                </button>
              </div>
            ))}
          </div>
        )}
      </main>

      {selectedMember && (
        <div className="fixed inset-0 z-[100] flex justify-end bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="w-full max-w-md bg-white h-full shadow-2xl animate-in slide-in-from-right duration-500 flex flex-col font-sans">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-white">
              <h2 className="text-xl font-black text-slate-900 uppercase tracking-tighter italic">Comando de Ação</h2>
              <button onClick={() => setSelectedMember(null)} className="text-slate-400 hover:text-slate-600 font-bold text-xl">×</button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-8 space-y-8">
              <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1 italic">Membro Selecionado</p>
                <h4 className="text-lg font-black text-slate-900 uppercase italic leading-none">{selectedMember.full_name}</h4>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] text-slate-500 font-black uppercase tracking-widest flex items-center gap-2">
                  <ShieldCheck size={14} className="text-indigo-600" /> Alvo da Recomendação
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
                        target === t.id ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'bg-white border-slate-200 text-slate-500 hover:border-indigo-300'
                      }`}
                    >
                      {t.icon} {t.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <label className="text-[10px] text-slate-500 font-black uppercase tracking-widest">Ação Recomendada pelo Diretor</label>
                <textarea 
                  className="w-full h-40 bg-slate-50 border border-slate-200 rounded-3xl p-5 text-sm outline-none focus:ring-2 focus:ring-indigo-500/20 resize-none font-medium text-slate-700"
                  placeholder="Instruções para o alvo da ação..."
                  value={recommendation}
                  onChange={(e) => setRecommendation(e.target.value)}
                />
              </div>
            </div>

            <div className="p-8 border-t border-slate-100 bg-white">
              <button 
                onClick={handleEmitAction}
                disabled={!recommendation}
                className="w-full py-5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-2xl font-black text-xs uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-3 shadow-xl shadow-indigo-900/20"
              >
                <Send size={18} /> Emitir Ordem de Ação
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}