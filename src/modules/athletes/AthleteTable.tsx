import type { Athlete } from './types';
import { supabase } from '../../lib/supabase';
import { Trash2, ExternalLink, Calendar, ShieldAlert } from 'lucide-react';

export interface AthleteTableProps {
  athletes: Athlete[];
  onDeleteSuccess: () => void;
  canEdit: boolean;
}

const AthleteTable: React.FC<AthleteTableProps> = ({ athletes, onDeleteSuccess, canEdit }) => {
  const handleDelete = async (id: string, name: string) => {
    if (!canEdit) return;
    if (confirm(`Excluir atleta: ${name}?`)) {
      const { error } = await supabase.from('athletes').delete().eq('id', id);
      if (!error) onDeleteSuccess();
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-200">
            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase">Atleta</th>
            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase">Posição</th>
            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase text-right">Ações</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {athletes.map((athlete) => (
            <tr key={athlete.id} className="hover:bg-slate-50">
              <td className="px-6 py-4 font-bold text-slate-900 uppercase text-sm">
                {athlete.full_name}
              </td>
              <td className="px-6 py-4">
                <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2 py-1 rounded">
                  {athlete.position || 'N/D'}
                </span>
              </td>
              <td className="px-6 py-4 text-right flex justify-end gap-2">
                <button className="p-2 text-slate-400"><ExternalLink size={18} /></button>
                {canEdit ? (
                  <button onClick={() => handleDelete(athlete.id, athlete.full_name)} className="p-2 text-slate-400 hover:text-red-600">
                    <Trash2 size={18} />
                  </button>
                ) : <ShieldAlert size={18} className="text-slate-200" />}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AthleteTable;