import { useState } from 'react';
import { PlusIcon } from '@heroicons/react/24/outline';
import AthleteTable from './AthleteTable';
import AthleteForm from './AthleteForm';
import { useAthletes } from './useAthletes';
import { Athlete } from '../../types/athlete';

export default function AthletesList() {
  const { athletes, deleteAthlete, createAthlete, updateAthlete, isLoading } = useAthletes();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAthlete, setEditingAthlete] = useState<Athlete | null>(null);

  const handleCreate = (data: Omit<Athlete, 'id'>) => {
    createAthlete(data);
  };

  const handleUpdate = (data: Omit<Athlete, 'id'>) => {
    if (editingAthlete) {
      updateAthlete(editingAthlete.id, data);
    }
  };

  const openEditModal = (athlete: Athlete) => {
    setEditingAthlete(athlete);
    setIsModalOpen(true);
  };

  const openCreateModal = () => {
    setEditingAthlete(null);
    setIsModalOpen(true);
  };

  if (isLoading) return <div className="p-8">Carregando...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Gerenciamento de Atletas</h1>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
        >
          <PlusIcon className="w-5 h-5" />
          Novo Atleta
        </button>
      </div>

      <div className="bg-white rounded-lg shadow">
        <AthleteTable 
          athletes={athletes} 
          onEdit={openEditModal} 
          onDelete={deleteAthlete} 
        />
      </div>

      <AthleteForm
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={editingAthlete ? handleUpdate : handleCreate}
        initialData={editingAthlete}
      />
    </div>
  );
}