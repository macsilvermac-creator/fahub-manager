import React from 'react';
import { Athlete, AthleteStatus } from './types';

interface AthleteTableProps {
  data: Athlete[];
}

const getStatusStyles = (status: AthleteStatus): string => {
  switch (status) {
    case 'Active':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'Injured':
      return 'bg-red-100 text-red-800 border-red-200';
    case 'Suspended':
      return 'bg-orange-100 text-orange-800 border-orange-200';
    case 'Inactive':
      return 'bg-gray-100 text-gray-800 border-gray-200';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

export const AthleteTable: React.FC<AthleteTableProps> = ({ data }) => {
  return (
    <div className="w-full overflow-hidden rounded-lg border border-gray-200 shadow-sm bg-white">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr>
              <th className="p-4 border-b border-gray-200 bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Nome do Atleta
              </th>
              <th className="p-4 border-b border-gray-200 bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Posição
              </th>
              <th className="p-4 border-b border-gray-200 bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">
                Status
              </th>
              <th className="p-4 border-b border-gray-200 bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">
                Altura
              </th>
              <th className="p-4 border-b border-gray-200 bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">
                Peso
              </th>
              <th className="p-4 border-b border-gray-200 bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider text-center">
                Ações
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {data.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-8 text-center text-gray-500">
                  Nenhum atleta encontrado.
                </td>
              </tr>
            ) : (
              data.map((athlete) => (
                <tr key={athlete.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 text-sm font-medium text-gray-900">
                    {athlete.name}
                  </td>
                  <td className="p-4 text-sm text-gray-600">
                    {athlete.position}
                  </td>
                  <td className="p-4 text-center">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusStyles(
                        athlete.status
                      )}`}
                    >
                      {athlete.status === 'Active' ? 'Ativo' : 
                       athlete.status === 'Injured' ? 'Lesionado' :
                       athlete.status === 'Suspended' ? 'Suspenso' : 'Inativo'}
                    </span>
                  </td>
                  <td className="p-4 text-sm text-gray-600 text-right">
                    {(athlete.height / 100).toFixed(2)} m
                  </td>
                  <td className="p-4 text-sm text-gray-600 text-right">
                    {athlete.weight} kg
                  </td>
                  <td className="p-4 text-center">
                    <button className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors">
                      Editar
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};