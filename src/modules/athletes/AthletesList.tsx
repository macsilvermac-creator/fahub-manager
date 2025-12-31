import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useAthletes } from './useAthletes';
import AthleteTable from './AthleteTable';
import AthleteForm from './AthleteForm';

const AthletesList = () => {
  const { athletes } = useAthletes();
  const [showForm, setShowForm] = useState(false);

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
          {showForm ? 'Fechar Formulário' : 'Novo Atleta'}
        </button>
      </div>

      {showForm && (
        <AthleteForm 
          onSubmit={() => setShowForm(false)} 
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