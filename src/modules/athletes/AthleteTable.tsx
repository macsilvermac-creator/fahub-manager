import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';
// CORREÇÃO: Adicionado 'type' para importar as interfaces
import type { Athlete, AthleteStatus } from './types';

interface AthleteTableProps {
  athletes: Athlete[];
  isLoading: boolean;
  onEdit: (athlete: Athlete) => void;
  onDelete: (id: string) => void;
}

const getStatusColor = (status: AthleteStatus) => {
  switch (status) {
    case 'active':
      return 'bg-green-100 text-green-800';
    case 'inactive':
      return 'bg-gray-100 text-gray-800';
    case 'injured':
      return 'bg-red-100 text-red-800';
    case 'suspended':
      return 'bg-yellow-100 text-yellow-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const getStatusLabel = (status: AthleteStatus) => {
  const labels: Record<AthleteStatus, string> = {
    active: 'Ativo',
    inactive: 'Inativo',
    injured: 'Lesionado',
    suspended: 'Suspenso',
  };
  return labels[status] || status;
};

export function AthleteTable({ athletes, isLoading, onEdit, onDelete }: AthleteTableProps) {
  if (isLoading) {
    return (
      <div className="p-8 text-center text-gray-500">
        Carregando atletas...
      </div>
    );
  }

  if (athletes.length === 0) {
    return (
      <div className="p-8 text-center text-gray-500">
        Nenhum atleta encontrado.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm text-gray-600">
        <thead className="bg-gray-50 text-xs uppercase text-gray-500">
          <tr>
            <th className="px-6 py-3">Nome</th>
            <th className="px-6 py-3">Posição</th>
            <th className="px-6 py-3">Categoria</th>
            <th className="px-6 py-3">Status</th>
            <th className="px-6 py-3 text-right">Ações</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {athletes.map((athlete) => (
            <tr key={athlete.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 font-medium text-gray-900">
                {athlete.name}
              </td>
              <td className="px-6 py-4">{athlete.position}</td>
              <td className="px-6 py-4">{athlete.category}</td>
              <td className="px-6 py-4">
                <span
                  className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(
                    athlete.status
                  )}`}
                >
                  {getStatusLabel(athlete.status)}
                </span>
              </td>
              <td className="px-6 py-4 text-right">
                <div className="flex justify-end gap-2">
                  <button
                    onClick={() => onEdit(athlete)}
                    className="rounded p-1 text-blue-600 hover:bg-blue-50"
                    title="Editar"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => onDelete(athlete.id)}
                    className="rounded p-1 text-red-600 hover:bg-red-50"
                    title="Excluir"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
