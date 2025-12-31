import { PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import { Athlete, AthleteStatus } from '../../types/athlete';

interface AthleteTableProps {
  athletes: Athlete[];
  onEdit: (athlete: Athlete) => void;
  onDelete: (id: string) => void;
}

const statusMap: Record<AthleteStatus, string> = {
  Active: 'Ativo',
  Inactive: 'Inativo',
  Injured: 'Lesionado',
  Suspended: 'Suspenso',
};

const statusStyles: Record<AthleteStatus, string> = {
  Active: 'bg-green-100 text-green-800',
  Inactive: 'bg-gray-100 text-gray-800',
  Injured: 'bg-red-100 text-red-800',
  Suspended: 'bg-yellow-100 text-yellow-800',
};

export default function AthleteTable({ athletes, onEdit, onDelete }: AthleteTableProps) {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Nome
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Categoria
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Status
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Ações
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {athletes.map((athlete) => (
            <tr key={athlete.id}>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="h-10 w-10 flex-shrink-0">
                    <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 font-bold">
                      {athlete.name.charAt(0)}
                    </div>
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">{athlete.name}</div>
                    <div className="text-sm text-gray-500">{athlete.email}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{athlete.category}</div>
                <div className="text-sm text-gray-500">{athlete.position || '-'}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${statusStyles[athlete.status]}`}>
                  {statusMap[athlete.status]}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  onClick={() => onEdit(athlete)}
                  className="text-indigo-600 hover:text-indigo-900 mr-4"
                >
                  <PencilIcon className="h-5 w-5" />
                </button>
                <button
                  onClick={() => onDelete(athlete.id)}
                  className="text-red-600 hover:text-red-900"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}