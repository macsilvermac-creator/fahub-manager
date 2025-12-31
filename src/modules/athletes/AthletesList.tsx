import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useAthletes } from './useAthletes';
import AthleteTable from './AthleteTable';
import AthleteForm from './AthleteForm';
import type { Athlete } from './types';

const AthletesList = () => {
  // Pegamos a lista E a função de adicionar
  const { athletes, addAthlete } = useAthletes();
  const [showForm, setShowForm] = useState(false);

  // Essa função roda quando você clica em "Salvar" no formulário
  const handleSave = (newData: Omit<Athlete, 'id'>) => {
    addAthlete(newData); // Adiciona na lista
    setShowForm(false);  // Fecha o formulário
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Elenco (Roster)</h2>
          <p className="text-gray-500 text-sm">Gerencie os atletas e posições</p>
        </div>
        
        <button 
          onClick={() => setShowForm(!showForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Plus size={20} />
          {showForm ? 'Fechar' : 'Novo Atleta'}
        </button>
      </div>

      {/* Se showForm for verdadeiro, mostra o formulário */}
      {showForm && (
        <AthleteForm 
          onSubmit={handleSave} 
          onCancel={() => setShowForm(false)} 
        />
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <AthleteTable athletes={athletes} />
      </div>
    </div>
  );
};

export default AthletesList;