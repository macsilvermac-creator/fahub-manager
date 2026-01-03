import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Users, RefreshCw, UserPlus, ArrowLeft, Search, Database } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Athlete } from './types';

import AthleteForm from './AthleteForm';
import AthleteTable from './AthleteTable';

export default function AthletesList() {
  const navigate = useNavigate();
  const [athletes, setAthletes] = useState<Athlete[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const persona = localStorage.getItem('nexus_persona');
  const canEdit = ['MASTER', 'DIRETOR', 'HC', 'STAFF'].includes(persona || '');

  const loadAthletes = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('athletes')
      .select('*')
      .order('full_name', { ascending: true });
    if (!error) setAthletes(data || []);
    setLoading(false);
  };

  useEffect(() => { loadAthletes(); }, []);

  const filtered = athletes.filter(a => 
    a.full_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#0a0a15] text-slate-300 font-sans">
      {/* NAVEGAÇÃO SUPERIOR - DARK NEXUS STYLE */}
      <nav className="border-b border-white/5 bg-[#050510] px-6 py-3 flex justify-between items-center backdrop-blur-md sticky top-0 z-50">
        <button 
          onClick={() => navigate('/')} 
          className="group flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 hover:text-indigo-400 transition-all"
        >
          <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> 
          System Exit
        </button>
        <div className="flex items-center gap-4">
          <div className="h-4 w-[1px] bg-white/10" />
          <span className="text-[10px] font-black italic text-indigo-500 tracking-tighter">
            PROTOCOL: {persona || 'GUEST_USER'}
          </span>
        </div>
      </nav>

      <main className="p-4 md:p-8 max-w-7xl mx-auto animate-in fade-in duration-700">
        {/* HEADER DO MÓDULO - OPERACIONAL CLEAN/DARK MIX */}
        <header className="flex flex-col md:flex-row justify-between gap-6 mb-10 bg-[#0f172a]/40 p-8 rounded-[2rem] border border-white/5 backdrop-blur-sm">
          <div className="flex items-center gap-6">
            <div className="bg-indigo-600/20 p-4 rounded-2xl border border-indigo-500/30 shadow-[0_0_20px_rgba(79,70,229,0.15)]">
              <Users className="text-indigo-400" size={32} />
            </div>
            <div>
              <h1 className="text-3xl font-black text-white tracking-tighter italic uppercase">Elenco <span className="text-indigo-500">Nexus</span></h1>
              <p className="text-slate-500 text-xs font-bold tracking-[0.2em] uppercase mt-1">Human Capital Management</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button 
              onClick={loadAthletes} 
              className="p-3 bg-white/5 hover:bg-white/10 text-slate-400 rounded-xl border border-white/5 transition-all"
            >
              <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
            </button>
            {canEdit && (
              <button 
                onClick={() => setIsFormOpen(true)} 
                className="flex items-center gap-3 bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-[0_10px_20px_rgba(79,70,229,0.2)]"
              >
                <UserPlus size={18} /> Injetar Atleta
              </button>
            )}
          </div>
        </header>

        {/* ÁREA DE TABELA E FILTROS */}
        <section className="bg-[#0f172a]/20 rounded-[2rem] border border-white/5 overflow-hidden backdrop-blur-sm">
          <div className="p-6 border-b border-white/5 bg-white/[0.02] flex items-center gap-4">
            <Search className="text-slate-600" size={18} />
            <input 
              type="text" 
              placeholder="PESQUISAR REGISTRO NA REDE..." 
              className="bg-transparent w-full text-sm font-bold tracking-wider outline-none text-white placeholder:text-slate-700"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="flex items-center gap-2 text-[10px] font-bold text-slate-600 ml-auto">
              <Database size={12} />
              {athletes.length} REGISTERED
            </div>
          </div>

          <AthleteTable 
            athletes={filtered} 
            onDeleteSuccess={loadAthletes} 
            canEdit={canEdit} 
          />
        </section>
      </main>

      {isFormOpen && (
        <AthleteForm 
          onClose={() => setIsFormOpen(false)} 
          onSuccess={() => { setIsFormOpen(false); loadAthletes(); }} 
        />
      )}
    </div>
  );
}