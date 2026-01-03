import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase'; // Importando do seu arquivo de lib
import { Plus, Users, Search, RefreshCw } from 'lucide-react';
import AthleteForm from './AthleteForm';
import AthleteTable from './AthleteTable';
import { Athlete } from './types';

export default function AthletesList() {
  const [athletes, setAthletes] = useState<Athlete[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // 1. Função para buscar atletas (Refresh)
  const fetchAthletes = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('athletes')
      .select('*')
      .order('full_name', { ascending: true });

    if (error) {
      console.error('Erro ao buscar atletas:', error.message);
    } else {
      setAthletes(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAthletes();
  }, []);

  // 2. Filtragem em tempo real
  const filteredAthletes = athletes.filter(athlete =>
    athlete.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    athlete.position?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-6 bg-white rounded-lg shadow-sm">
      {/* Header do Módulo */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Users className="text-blue-600" size={28} /> 
            Gestão de Atletas
          </h1>
          <p className="text-sm text-gray-500">Nexus Portal - Controle de elenco e registros</p>
        </div>

        <div className="flex gap-2 w-full md:w-auto">
          <button 
            onClick={fetchAthletes}
            className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            title="Atualizar lista"
          >
            <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
          </button>
          <button 
            onClick={() => setIsFormOpen(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-all shadow-sm"
          >
            <Plus size={20} /> Novo Atleta
          </button>
        </div>
      </div>

      {/* Barra de Busca */}
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
        <input 
          type="text"
          placeholder="Buscar por nome ou posição..."
          className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Tabela de Dados */}
      {loading ? (
        <div className="py-20 text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent"></div>
          <p className="mt-2 text-gray-500 font-medium">Carregando atletas do Nexus...</p>
        </div>
      ) : (
        <AthleteTable 
          athletes={filteredAthletes} 
          onDeleteSuccess={fetchAthletes} 
        />
      )}

      {/* Modal do Formulário (Aparece apenas quando isFormOpen é true) */}
      {isFormOpen && (
        <AthleteForm 
          onClose={() => setIsFormOpen(false)} 
          onSuccess={() => {
            setIsFormOpen(false);
            fetchAthletes();
          }} 
        />
      )}
    </div>
  );
}