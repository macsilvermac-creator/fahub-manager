import React from 'react';
import { Edit2, Trash2, User } from 'lucide-react';
import type { Athlete } from './types';

interface AthleteTableProps {
  athletes: Athlete[];
  onEdit: (athlete: Athlete) => void;
  onDelete: (id: string) => void;
}

/**
 * COMPONENTE: TABELA DE ATLETAS
 * Padrão: Nexus Tactical Grid
 */
const AthleteTable: React.FC<AthleteTableProps> = ({ athletes, onEdit, onDelete }) => {
  
  // Lógica de Cores para Status HUD (Neon)
  const getStatusStyle = (status: string) => {
    switch (status.toUpperCase()) {
      case 'ACTIVE':
      case 'ATIVO':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      case 'INJURED':
      case 'DM':
        return 'bg-orange-500/10 text-orange-400 border-orange-500/20';
      case 'SUSPENDED':
      case 'SUSPENSO':
        return 'bg-red-500/10 text-red-400 border-red-500/20';
      default:
        return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    }
  };

  return (
    <div className="overflow-x-auto custom-scrollbar">
      <table className="min-w-full divide-y divide-slate-800/50">
        <thead className="bg-[#0f172a]/30">
          <tr>
            <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Atleta / ID</th>
            <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Posição</th>
            <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Status</th>
            <th className="px-6 py-4 text-right text-[10px] font-bold text-slate-500 uppercase tracking-[0.2em]">Ações</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/30">
          {athletes.map((athlete) => (
            <tr key={athlete.id} className="hover:bg-white/5 transition-colors group">
              {/* COLUNA: IDENTIDADE */}
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="h-10 w-10 bg-[#020617] rounded-full flex items-center justify-center border border-slate-700 shadow-inner group-hover:border-indigo-500/50 transition-all">
                    {athlete.photo_url ? (
                      <img src={athlete.photo_url} alt={athlete.name} className="h-full w-full rounded-full object-cover" />
                    ) : (
                      <span className="text-sm font-black italic text-indigo-400">
                        {athlete.number || '00'}
                      </span>
                    )}
                  </div>
                  <div className="ml-4">
                    <div className="text-sm font-bold text-slate-200 group-hover:text-white transition-colors">
                      {athlete.name}
                    </div>
                    <div className="text-[10px] text-slate-500 font-mono uppercase">
                      {athlete.category || 'Geral'} • ID: {athlete.id.substring(0, 5)}
                    </div>
                  </div>
                </div>
              </td>

              {/* COLUNA: POSIÇÃO */}
              <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-slate-400 group-hover:text-indigo-300">
                {athlete.position || 'N/A'}
              </td>

              {/* COLUNA: STATUS */}
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2 py-1 inline-flex text-[9px] leading-4 font-black rounded border ${getStatusStyle(athlete.status)}`}>
                  ● {athlete.status.toUpperCase()}
                </span>
              </td>

              {/* COLUNA: AÇÕES */}
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex justify-end gap-2 opacity-40 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={() => onEdit(athlete)} 
                    className="text-slate-400 hover:text-indigo-400 p-2 hover:bg-indigo-500/10 rounded-lg border border-transparent hover:border-indigo-500/20 transition-all"
                    title="Editar Registro"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button 
                    onClick={() => onDelete(athlete.id)} 
                    className="text-slate-400 hover:text-red-400 p-2 hover:bg-red-500/10 rounded-lg border border-transparent hover:border-red-500/20 transition-all"
                    title="Excluir Registro"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {athletes.length === 0 && (
        <div className="p-12 text-center">
          <User className="mx-auto text-slate-700 mb-4" size={48} />
          <p className="text-slate-500 text-sm italic">Nenhum atleta encontrado na base de dados.</p>
        </div>
      )}
    </div>
  );
};

export default AthleteTable;