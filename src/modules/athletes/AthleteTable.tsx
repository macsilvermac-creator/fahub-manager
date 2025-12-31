import React from 'react';
import { Edit2, Trash2, Eye } from 'lucide-react';
import type { Athlete } from './types';

interface AthleteTableProps {
  athletes: Athlete[];
  onEdit: (athlete: Athlete) => void;
  onDelete: (id: string) => void;
}

const AthleteTable: React.FC<AthleteTableProps> = ({ athletes, onEdit, onDelete }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ACTIVE': return 'bg-green-100 text-green-800';
      case 'INJURED': return 'bg-red-100 text-red-800';
      case 'SUSPENDED': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Atleta</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Posição</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Ações</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {athletes.map((athlete) => (
            <tr key={athlete.id} className="hover:bg-gray-50">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="h-8 w-8 bg-slate-200 rounded-full flex items-center justify-center font-bold text-xs text-slate-600 mr-3">
                    {athlete.number}
                  </div>
                  <div>
                    <div className="text-sm font-medium text-gray-900">{athlete.name}</div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{athlete.position}</td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(athlete.status)}`}>
                  {athlete.status}
                </span>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex justify-end gap-2">
                <button onClick={() => onEdit(athlete)} className="text-indigo-600 hover:text-indigo-900"><Edit2 size={18} /></button>
                <button onClick={() => onDelete(athlete.id)} className="text-red-600 hover:text-red-900"><Trash2 size={18} /></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AthleteTable;