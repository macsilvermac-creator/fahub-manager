import { useState } from 'react';
import { Plus } from 'lucide-react';
import { useAthletes } from './useAthletes';
import AthleteTable from './AthleteTable';
import AthleteForm from './AthleteForm';
import type { Athlete } from './types';

const AthletesList = () => {
  const { athletes, addAthlete, updateAthlete, deleteAthlete } = useAthletes();
  
  // Estado para controlar se o formulário está visível
  const [showForm, setShowForm] = useState(false);
  // Estado para saber QUEM estamos editando (se for null, é criação)
  const [editingAthlete, setEditingAthlete] = useState<Athlete | null>(null);

  // Função chamada ao clicar em "Salvar" no formulário
  const handleSave = (data: Omit<Athlete, 'id'>) => {
    if (editingAthlete) {
      // Se tinha alguém sendo editado, atualiza
      updateAthlete(editingAthlete.id, data);
    } else {
      // Senão, cria um novo
      addAthlete(data);
    }
    handleCloseForm();
  };

  // Prepara o formulário para criar
  const handleNew = () => {
    setEditingAthlete(null);
    setShowForm(true);
  };

  // Prepara o formulário para editar (vem da tabela)
  const handleEdit = (athlete: Athlete) => {
    setEditingAthlete(athlete);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingAthlete(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Elenco (Roster)</h2>
          <p className="text-gray-500 text-sm">Gerencie os atletas e posições</p>
        </div>
        
        {!showForm && (
          <button 
            onClick={handleNew}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <Plus size={20} />
            Novo Atleta
          </button>
        )}
      </div>

      {showForm && (
        <AthleteForm 
          initialData={editingAthlete}
          onSubmit={handleSave} 
          onCancel={handleCloseForm} 
        />
      )}

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <AthleteTable 
          athletes={athletes} 
          onEdit={handleEdit}
          onDelete={deleteAthlete}
        />
      </div>
    </div>
  );
};

export default AthletesList;