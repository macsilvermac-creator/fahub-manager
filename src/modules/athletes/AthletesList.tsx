import React, { useState } from 'react';
import { Plus, Search, Filter } from 'lucide-react';
// CORREÇÃO: Adicionado 'type' para importar a interface
import type { Athlete } from './types';
import { AthleteTable } from './AthleteTable';
import { AthleteForm } from './AthleteForm';
import { useAthletes } from './useAthletes';

export default function AthletesList() {
  const { athletes, isLoading, createAthlete, updateAthlete, deleteAthlete } = useAthletes();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAthlete, setEditingAthlete] = useState<Athlete | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const handleEdit = (athlete: Athlete) => {
    setEditingAthlete(athlete);
    setIsModalOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este atleta?')) {
      await deleteAthlete(id);
    }
  };

  const handleSave = async (data: Omit<Athlete, 'id' | 'createdAt' | 'updatedAt'>) => {
    if (editingAthlete) {
      await updateAthlete(editingAthlete.id, data);
    } else {
      await createAthlete(data);
    }
    setIsModalOpen(false);
    setEditingAthlete(null);
  };

  const filteredAthletes = athletes.filter(athlete => 
    athlete.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    athlete.position.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Atletas</h1>
          <p className="text-sm text-gray-500">Gerencie o elenco do seu time</p>
        </div>
        <button
          onClick={() => {
            setEditingAthlete(null);
            setIsModalOpen(true);
          }}
          className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
        >
          <Plus size={20} />
          Novo Atleta
        </button>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar por nome ou posição..."
            className="w-full rounded-lg border border-gray-300 pl-10 px-4 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="inline-flex items-center gap-2 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
          <Filter size={20} />
          Filtros
        </button>
      </div>

      <div className="rounded-lg border border-gray-200 bg-white shadow-sm">
        <AthleteTable
          athletes={filteredAthletes}
          isLoading={isLoading}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl rounded-lg bg-white p-6 shadow-xl">
            <h2 className="mb-4 text-xl font-bold text-gray-900">
              {editingAthlete ? 'Editar Atleta' : 'Novo Atleta'}
            </h2>
            <AthleteForm
              initialData={editingAthlete || undefined}
              onSubmit={handleSave}
              onCancel={() => {
                setIsModalOpen(false);
                setEditingAthlete(null);
              }}
              isLoading={isLoading}
            />
          </div>
        </div>
      )}
    </div>
  );
}