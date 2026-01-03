import type { Athlete } from './types';
import { supabase } from '../../lib/supabase';
import { Trash2, ExternalLink, ShieldAlert } from 'lucide-react'; // Calendário removido (TS6133 resolvido)

export interface AthleteTableProps {
  athletes: Athlete[];
  onDeleteSuccess: () => void;
  canEdit: boolean;
}

export default function AthleteTable({ athletes, onDeleteSuccess, canEdit }: AthleteTableProps) {
  const handleDelete = async (id: string, name: string) => {
    if (!canEdit) return;
    if (confirm(`Remover ${name} do sistema?`)) {
      const { error } = await supabase.from('athletes').delete().eq('id', id);
      if (!error) onDeleteSuccess();
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="bg-slate-50 border-b border-slate-200">
            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Atleta</th>
            <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Ações</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 bg-white">
          {athletes.map((athlete) => (
            <tr key={athlete.id} className="hover:bg-slate-50/50 transition-colors">
              <td className="px-6 py-4">
                <div className="text-sm font-bold text-slate-900 uppercase">{athlete.full_name}</div>
                <div className="text-[10px] text-slate-400 font-mono tracking-tighter">POS: {athlete.position || 'N/A'}</div>
              </td>
              <td className="px-6 py-4 text-right flex justify-end gap-2">
                <button className="p-2 text-slate-400 hover:text-indigo-600 transition-colors"><ExternalLink size={18} /></button>
                {canEdit ? (
                  <button onClick={() => handleDelete(athlete.id, athlete.full_name)} className="p-2 text-slate-400 hover:text-red-600 transition-colors">
                    <Trash2 size={18} />
                  </button>
                ) : (
                  <div className="p-2 text-slate-200" title="Acesso Restrito"><ShieldAlert size={18} /></div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}