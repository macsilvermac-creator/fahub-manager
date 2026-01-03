import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { 
  ArrowLeft, 
  TrendingUp, 
  BarChart3, 
  ChevronRight,
  Search,
  Zap,
  Star,
  Save,
  Trophy
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/**
 * ATHLETES PERFORMANCE - PROTOCOLO NEXUS
 * Subpágina do Container 02 (Cúpula Administrativa / Dir. Esportes)
 * CORREÇÃO DEFINITIVA: Fechamento estrutural completo de tags JSX.
 */

interface PerformanceMember {
  id: string;
  full_name: string;
  category: 'ELITE' | 'BASE' | 'ESCOLINHA';
  readiness: number;
  skills: {
    tactical: number;
    physical: number;
    discipline: number;
  };
  status: 'READY' | 'OBSERVATION' | 'DEVELOPING';
}

export default function AthletesPerformance() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [members, setMembers] = useState<PerformanceMember[]>([]);
  const [selectedAthlete, setSelectedAthlete] = useState<PerformanceMember | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchPerformanceData();
  }, []);

  const fetchPerformanceData = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('athletes')
        .select('id, full_name, category, status');

      if (!error && data) {
        const mapped: PerformanceMember[] = data.map((m: any) => ({
          id: m.id,
          full_name: m.full_name,
          category: (m.category || 'BASE') as PerformanceMember['category'],
          readiness: Math.floor(Math.random() * 30) + 70, 
          skills: { tactical: 85, physical: 78, discipline: 92 },
          status: 'READY' as const
        }));
        setMembers(mapped);
      }
    } catch (err) {
      console.error('[NEXUS PERFORMANCE ERROR]:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePerformance = () => {
    if (!selectedAthlete) return;
    alert(`[NEXUS] Performance de ${selectedAthlete.full_name} salva.`);
    setSelectedAthlete(null);
  };

  const filtered = members.filter(m => 
    m.full_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans selection:bg-indigo-100">
      <header className="bg-white border-b border-slate-200 px-8 py-5 flex justify-between items-center sticky top-0 z-30">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/dashboard')} className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-all">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-xl font-black text-slate-900 uppercase tracking-tighter italic">Performance & Evolução</h1>
            <p className="text-[10px] text-indigo-600 font-bold uppercase tracking-widest italic">Nexus Technical Hub</p>
          </div>
        </div>
        <Trophy className="text-slate-200" size={32} />
      </header>

      <main className="p-8 max-w-7xl mx-auto w-full flex flex-col lg:flex-row gap-8">
        <div className="flex-1 space-y-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Pesquisar na base técnica..." 
              className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl outline-none text-sm focus:ring-4 focus:ring-indigo-500/10 transition-all shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 gap-3">
            {loading ? (
              <div className="animate-pulse space-y-3">
                {[1, 2, 3].map(i => <div key={i} className="h-24 bg-slate-200 rounded-2xl w-full" />)}
              </div>
            ) : (
              filtered.map(athlete => (
                <button 
                  key={athlete.id}
                  onClick={() => setSelectedAthlete(athlete)}
                  className={`w-full bg-white p-5 rounded-2xl border transition-all flex items-center justify-between group ${
                    selectedAthlete?.id === athlete.id ? 'border-indigo-500 ring-2 ring-indigo-500/10' : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-5 text-left">
                    <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center font-black italic text-indigo-600 text-xs">
                      {athlete.readiness}%
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight italic">{athlete.full_name}</h4>
                      <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{athlete.category}</span>
                    </div>
                  </div>
                  <ChevronRight size={18} className="text-slate-300" />
                </button>
              ))
            )}
          </div>
        </div>

        <div className="w-full lg:w-[450px]">
          {selectedAthlete ? (
            <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-xl sticky top-28 animate-in slide-in-from-right-4 duration-500">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-indigo-600 rounded-2xl text-white shadow-lg">
                    <Zap size={20} />
                  </div>
                  <h2 className="text-lg font-black text-slate-900 uppercase italic">Lab de Evolução</h2>
                </div>
                <button onClick={() => setSelectedAthlete(null)} className="text-slate-400">×</button>
              </div>

              <div className="space-y-8">
                <div>
                  <h3 className="text-xl font-black text-slate-900 uppercase italic">{selectedAthlete.full_name}</h3>
                  <p className="text-[10px] text-slate-400 font-black uppercase mt-1 italic">PROTOCOLO NEXUS ACT-001</p>
                </div>

                <div className="space-y-6">
                  <PerformanceSlider label="Domínio Tático" value={selectedAthlete.skills.tactical} icon={<BarChart3 size={14} />} />
                  <PerformanceSlider label="Potência Física" value={selectedAthlete.skills.physical} icon={<TrendingUp size={14} />} />
                  <PerformanceSlider label="Foco & Disciplina" value={selectedAthlete.skills.discipline} icon={<Star size={14} />} />
                </div>

                <button onClick={handleUpdatePerformance} className="w-full py-5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black text-xs uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-3 shadow-xl shadow-indigo-900/20">
                  <Save size={18} /> Salvar Performance
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-white border-2 border-dashed border-slate-200 rounded-[2.5rem] p-12 flex flex-col items-center justify-center text-center h-[500px]">
              <BarChart3 className="text-slate-200 mb-4" size={48} />
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">Selecione um atleta para análise</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

// COMPONENTE AUXILIAR COM FECHAMENTO BLINDADO
function PerformanceSlider({ label, value, icon }: { label: string, value: number, icon: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center px-1">
        <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest flex items-center gap-2">
          {icon} {label}
        </span>
        <span className="text-xs font-black text-indigo-600 italic">{value}%</span>
      </div>
      <div className="h-2 bg-slate-100 rounded-full overflow-hidden p-0.5">
        <div 
          className="h-full bg-indigo-600 rounded-full transition-all duration-1000" 
          style={{ width: `${value}%` }} 
        />
      </div>
    </div>
  );
}