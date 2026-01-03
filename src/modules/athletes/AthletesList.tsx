import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Users, RefreshCw, UserPlus, ArrowLeft, Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import type { Athlete } from './types'; // Resolvido TS1484

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
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="bg-slate-900 text-white px-6 py-3 flex justify-between items-center">
        <button onClick={() => navigate('/')} className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-white transition-colors">
          <ArrowLeft size={16} /> Voltar ao Portal
        </button>
        <span className="text-[10px] bg-indigo-600 px-2 py-0.5 rounded font-black italic uppercase">
          Persona: {persona || 'Visitante'}
        </span>
      </div>

      <div className="p-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between gap-4 mb-8 bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
          <div className="flex items-center gap-4">
            <div className="bg-blue-600 p-3 rounded-xl shadow-lg shadow-blue-200">
              <Users className="text-white" size={24} />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Gestão de Elenco</h1>
              <p className="text-slate-500 text-sm font-medium">Nexus Protocol v7.1</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button onClick={loadAthletes} className="p-2.5 text-slate-600 hover:bg-slate-100 rounded-xl transition-all">
              <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
            </button>
            {canEdit && (
              <button onClick={() => setIsFormOpen(true)} className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl font-semibold transition-all">
                <UserPlus size={18} /> Novo Atleta
              </button>
            )}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="p-4 border-b border-slate-100 bg-slate-50/50">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Filtrar atletas..." 
                className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl outline-none text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Resolvido TS2741: Injetando canEdit obrigatoriamente */}
          <AthleteTable 
            athletes={filtered} 
            onDeleteSuccess={loadAthletes} 
            canEdit={canEdit} 
          />
        </div>
      </div>

      {isFormOpen && <AthleteForm onClose={() => setIsFormOpen(false)} onSuccess={() => { setIsFormOpen(false); loadAthletes(); }} />}
    </div>
  );
}