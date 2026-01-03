import type { Athlete } from './types';
import { supabase } from '../../lib/supabase';
import { Trash2, ExternalLink, ShieldAlert, Zap } from 'lucide-react';

export interface AthleteTableProps {
  athletes: Athlete[];
  onDeleteSuccess: () => void;
  canEdit: boolean;
}

export default function AthleteTable({ athletes, onDeleteSuccess, canEdit }: AthleteTableProps) {
  const handleDelete = async (id: string, name: string) => {
    if (!canEdit) return;
    if (confirm(`[SECURITY] Deseja deletar permanentemente o registro de ${name}?`)) {
      const { error } = await supabase.from('athletes').delete().eq('id', id);
      if (!error) onDeleteSuccess();
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-separate border-spacing-0">
        <thead>
          <tr className="text-[10px] font-black text-slate-600 uppercase tracking-[0.3em]">
            <th className="px-8 py-5 border-b border-white/5">Atleta</th>
            <th className="px-8 py-5 border-b border-white/5">Posição Técnica</th>
            <th className="px-8 py-5 border-b border-white/5">Status</th>
            <th className="px-8 py-5 border-b border-white/5 text-right">Comandos</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/5">
          {athletes.map((athlete) => (
            <tr key={athlete.id} className="group hover:bg-white/[0.02] transition-colors">
              <td className="px-8 py-6">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 font-black text-xs">
                    {athlete.full_name.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="text-sm font-black text-white uppercase tracking-tight">{athlete.full_name}</div>
                    <div className="text-[9px] text-slate-600 font-mono">UID: {athlete.id.split('-')[0]}</div>
                  </div>
                </div>
              </td>
              <td className="px-8 py-6">
                <span className="text-[10px] font-black text-indigo-400 bg-indigo-500/5 px-3 py-1.5 rounded-md border border-indigo-500/10 tracking-[0.1em] uppercase italic">
                  {athlete.position || 'UNASSIGNED'}
                </span>
              </td>
              <td className="px-8 py-6">
                <div className={`inline-flex items-center gap-2 text-[10px] font-black tracking-widest uppercase ${
                  athlete.status === 'active' ? 'text-emerald-500' : 'text-slate-600'
                }`}>
                  <Zap size={10} className={athlete.status === 'active' ? 'animate-pulse' : ''} />
                  {athlete.status === 'active' ? 'Operational' : 'Offline'}
                </div>
              </td>
              <td className="px-8 py-6 text-right">
                <div className="flex justify-end gap-3 opacity-30 group-hover:opacity-100 transition-opacity">
                  <button className="p-2 text-slate-500 hover:text-white transition-colors" title="Deep Profile">
                    <ExternalLink size={16} />
                  </button>
                  {canEdit ? (
                    <button 
                      onClick={() => handleDelete(athlete.id, athlete.full_name)} 
                      className="p-2 text-slate-500 hover:text-red-500 transition-colors"
                      title="Terminate Record"
                    >
                      <Trash2 size={16} />
                    </button>
                  ) : (
                    <ShieldAlert size={16} className="text-slate-800 m-2" />
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}