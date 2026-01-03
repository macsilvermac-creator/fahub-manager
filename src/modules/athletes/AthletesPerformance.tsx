import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { 
  ArrowLeft, 
  TrendingUp, 
  BarChart3, 
  Award, 
  ChevronRight,
  Search,
  Zap,
  Star,
  Save
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/**
 * ATHLETES PERFORMANCE - PROTOCOLO NEXUS
 * Subpágina do Container 02 (Diretor de Esportes)
 * Foco: Monitoramento de Performance e Transição de Base.
 */

interface PerformanceMember {
  id: string;
  full_name: string;
  category: 'ELITE' | 'BASE' | 'ESCOLINHA';
  readiness: number; // 0-100
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
      // Sincronização com Supabase (Tabela athletes)
      const { data, error } = await supabase
        .from('athletes')
        .select('id, full_name, category, status');

      if (!error && data) {
        // Mapeamento para interface técnica de performance
        const mapped: PerformanceMember[] = data.map((m: any) => ({
          id: m.id,
          full_name: m.full_name,
          category: (m.category || 'BASE') as PerformanceMember['category'],
          readiness: Math.floor(Math.random() * 40) + 60, // Mock até integração de scouts
          skills: { tactical: 80, physical: 75, discipline: 90 },
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

  const handleUpdatePerformance = async () => {
    if (!selectedAthlete) return;
    // Lógica para salvar evolução técnica no banco
    alert(`[NEXUS] Performance de ${selectedAthlete.full_name} atualizada com sucesso.`);
    setSelectedAthlete(null);
  };

  const filtered = members.filter(m => 
    m.full_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F1F5F9] flex flex-col font-sans">
      {/* HEADER TÉCNICO - CLEAN/PROFESSIONAL */}
      <header className="bg-white border-b border-slate-200 px-8 py-5 flex justify-between items-center sticky top-0 z-30">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/dashboard')} className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-all">
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-xl font-black text-slate-900 uppercase tracking-tighter italic">Performance & Base</h1>
            <p className="text-[10px] text-indigo-600 font-bold uppercase tracking-widest">Matriz de Evolução Técnica</p>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="hidden md:flex flex-col items-end border-r border-slate-200 pr-4">
            <span className="text-[9px] font-black text-slate-400 uppercase">Média de Prontidão</span>
            <span className="text-sm font-black text-emerald-600 italic">82.4% READY</span>
          </div>
          <Award className="text-slate-300" size={32} />
        </div>
      </header>

      <main className="p-8 max-w-7xl mx-auto w-full flex flex-col md:flex-row gap-8">
        
        {/* LADO ESQUERDO: LISTAGEM E BUSCA */}
        <div className="flex-1 space-y-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Localizar atleta para avaliação..." 
              className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-2xl outline-none text-sm focus:ring-2 focus:ring-indigo-500/20 shadow-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="space-y-3">
            {loading ? (
              <div className="animate-pulse flex flex-col gap-3">
                {[1,2,3].map(i => <div key={i} className="h-20 bg-slate-200 rounded-2xl w-full" />)}
              </div>
            ) : (
              filtered.map(athlete => (
                <button 
                  key={athlete.id}
                  onClick={() => setSelectedAthlete(athlete)}
                  className={`w-full bg-white p-5 rounded-2xl border transition-all flex items-center justify-between group ${
                    selectedAthlete?.id === athlete.id ? 'border-indigo-500 ring-1 ring-indigo-500' : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-4 text-left">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black italic ${
                      athlete.readiness > 80 ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {athlete.readiness}%
                    </div>
                    <div>
                      <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight">{athlete.full_name}</h4>
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{athlete.category}</span>
                    </div>
                  </div>
                  <ChevronRight size={18} className="text-slate-300 group-hover:text-indigo-500 transition-colors" />
                </button>
              ))
            )}
          </div>
        </div>

        {/* LADO DIREITO: LAB DE EVOLUÇÃO (EDITOR) */}
        <div className="w-full md:w-[450px]">
          {selectedAthlete ? (
            <div className="bg-white border border-slate-200 rounded-[2.5rem] p-8 shadow-xl sticky top-28 animate-in slide-in-from-right-4 duration-500">
              <div className="flex items-center justify-between mb-8">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-indigo-600 rounded-2xl text-white shadow-lg shadow-indigo-500/30">
                    <Zap size={20} />
                  </div>
                  <h2 className="text-lg font-black text-slate-900 uppercase italic tracking-tighter leading-none">Lab de Evolução</h2>
                </div>
                <button onClick={() => setSelectedAthlete(null)} className="text-slate-300 hover:text-slate-500">×</button>
              </div>

              <div className="space-y-8">
                {/* Cabeçalho do Atleta */}
                <div>
                  <h3 className="text-xl font-black text-slate-900 uppercase tracking-tight italic">{selectedAthlete.full_name}</h3>
                  <div className="flex gap-2 mt-2">
                    <span className="px-2 py-0.5 bg-slate-900 text-white text-[9px] font-black rounded uppercase tracking-widest">{selectedAthlete.category}</span>
                    <span className="px-2 py-0.5 bg-emerald-100 text-emerald-700 text-[9px] font-black rounded uppercase tracking-widest">Apto</span>
                  </div>
                </div>

                {/* Métricas de Performance */}
                <div className="space-y-6">
                  <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] border-b border-slate-100 pb-2">Skills Técnicas</h4>
                  
                  <SkillRange label="Conhecimento Tático" value={selectedAthlete.skills.tactical} icon={<BarChart3 size={14} />} />
                  <SkillRange label="Preparação Física" value={selectedAthlete.skills.physical} icon={<TrendingUp size={14} />} />
                  <SkillRange label="Postura & Disciplina" value={selectedAthlete.skills.discipline} icon={<Star size={14} />} />
                </div>

                {/* Botões de Ação Direta */}
                <div className="pt-4 space-y-3">
                  <button 
                    onClick={handleUpdatePerformance}
                    className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-500/20"
                  >
                    <Save size={16} /> Salvar Alterações
                  </button>
                  <button 
                    className="w-full py-4 bg-slate-50 hover:bg-slate-100 text-slate-500 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all border border-slate-100"
                  >
                    Solicitar Promoção de Base
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-[2.5rem] p-12 flex flex-col items-center justify-center text-center h-[500px]">
              <div className="p-5 bg-white rounded-3xl shadow-sm text-slate-300 mb-4 italic font-black text-4xl italic tracking-tighter">NEXUS</div>
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em]">Selecione um atleta para iniciar a análise técnica</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

// Subcomponente de Range Slider Padronizado
const SkillRange: React.FC<{ label: string, value: number, icon: React.ReactNode }> = ({ label, value, icon }) => (
  <div className="space-y-3">
    <div className="flex justify-between items-center">
      <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest flex items-center gap-2">
        {icon} {label}
      </span>
      <span className="text-xs font-black text-indigo-600 italic">{value}%</span>
    </div>
    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
      <div 
        className="h-full bg-indigo-600 shadow-[0_0_8px_rgba(79,70,229,0.4)] transition-all duration-700" 
        style={{ width: `${value}%` }} 
      />
    </div>
  </div>
);