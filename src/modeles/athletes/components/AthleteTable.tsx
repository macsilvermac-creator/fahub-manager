// src/modules/athletes/components/AthleteTable.tsx
import type { FC } from 'react';
import type { Athlete } from '../types';

interface AthleteTableProps {
  athletes: Athlete[];
}

export const AthleteTable: FC<AthleteTableProps> = ({ athletes }) => {
  return (
    <div className="overflow-x-auto bg-white shadow-md rounded-lg p-4">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Nome
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Posição
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Número
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Última Atividade
            </th>
            <th scope="col" className="relative px-6 py-3">
              <span className="sr-only">Ações</span>
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {athletes.map((athlete) => (
            <tr key={athlete.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {athlete.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {athlete.position}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {athlete.jerseyNumber}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full
                  ${athlete.status === 'active' ? 'bg-green-100 text-green-800' : ''}
                  ${athlete.status === 'inactive' ? 'bg-gray-100 text-gray-800' : ''}
                  ${athlete.status === 'injured' ? 'bg-red-100 text-red-800' : ''}
                  ${athlete.status === 'suspended' ? 'bg-yellow-100 text-yellow-800' : ''}
                `}>
                  {athlete.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {athlete.lastActivity}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <a href="#" className="text-indigo-600 hover:text-indigo-900 mr-4">Editar</a>
                <a href="#" className="text-red-600 hover:text-red-900">Remover</a>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};