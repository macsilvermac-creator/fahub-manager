import React, { useState, useEffect } from 'react';
import { Save, X, UserPlus, Fingerprint, Activity } from 'lucide-react';
import type { Athlete } from './types';

interface AthleteFormProps {
  initialData?: Athlete | null;
  onSubmit: (data: Omit<Athlete, 'id'>) => void;
  onCancel: () => void;
}

/**
 * COMPONENTE: WORKSHOP DE CADASTRO (FORMULÁRIO)
 * Padrão: Nexus Bio-Data Entry
 */
const AthleteForm: React.FC<AthleteFormProps> = ({ initialData, onSubmit, onCancel }) => {
  const [name, setName] = useState('');
  const [position, setPosition] = useState('QB');
  const [number, setNumber] = useState(0);
  const [status, setStatus] = useState<Athlete['status']>('ACTIVE');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');

  // Efeito de Carregamento para Edição
  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
      setPosition(initialData.position);
      setNumber(initialData.number);
      setStatus(initialData.status);
      setHeight(initialData.height || '');
      setWeight(initialData.weight || '');
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ name, position, number: Number(number), status, height, weight });
  };

  const inputClass = "mt-1 block w-full bg-[#020617] border border-slate-700 rounded-xl p-3 text-sm text-white placeholder-slate-600 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 outline-none transition-all";
  const labelClass = "text-[10px] font-bold text-slate-500 uppercase tracking-widest ml-1";

  return (
    <div className="p-6 md:p-8">
      <div className="flex items-center gap-3 mb-8 border-b border-slate-800 pb-4">
        <div className="p-2 bg-indigo-500/10 rounded-lg text-indigo-400">
          {initialData ? <Fingerprint size={24} /> : <UserPlus size={24} />}
        </div>
        <div>
          <h3 className="text-xl font-black italic text-white uppercase tracking-tight">
            {initialData ? 'Atualizar Perfil' : 'Ingressar Novo Atleta'}
          </h3>
          <p className="text-[10px] text-slate-500 uppercase font-mono">Registro de Ativo em Tempo Real</p>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* NOME COMPLETO */}
          <div className="md:col-span-2">
            <label className={labelClass}>Nome Completo / Nickname</label>
            <input 
              required 
              type="text" 
              placeholder="Ex: Gabriel 'Tank' Silva"
              value={name} 
              onChange={(e) => setName(e.target.value)} 
              className={inputClass} 
            />
          </div>

          {/* NÚMERO DA JERSEY */}
          <div>
            <label className={labelClass}>Número (#)</label>
            <input 
              required 
              type="number" 
              placeholder="00"
              value={number} 
              onChange={(e) => setNumber(Number(e.target.value))} 
              className={inputClass} 
            />
          </div>

          {/* POSIÇÃO TÁTICA */}
          <div>
            <label className={labelClass}>Posição Principal</label>
            <select 
              value={position} 
              onChange={(e) => setPosition(e.target.value)} 
              className={inputClass}
            >
              <option value="QB">QUARTERBACK (QB)</option>
              <option value="WR">WIDE RECEIVER (WR)</option>
              <option value="RB">RUNNING BACK (RB)</option>
              <option value="TE">TIGHT END (TE)</option>
              <option value="OL">OFFENSIVE LINE (OL)</option>
              <option value="DL">DEFENSIVE LINE (DL)</option>
              <option value="LB">LINEBACKER (LB)</option>
              <option value="DB">DEFENSIVE BACK (DB)</option>
              <option value="K">KICKER (K)</option>
            </select>
          </div>

          {/* STATUS OPERACIONAL */}
          <div>
            <label className={labelClass}>Status de Prontidão</label>
            <select 
              value={status} 
              onChange={(e) => setStatus(e.target.value as any)} 
              className={inputClass}
            >
              <option value="ACTIVE">● ATIVO (DISPONÍVEL)</option>
              <option value="INJURED">● D.M (LESIONADO)</option>
              <option value="SUSPENDED">● SUSPENSO</option>
              <option value="INACTIVE">● INATIVO</option>
            </select>
          </div>

          {/* BIO-MÉTRICAS */}
          <div className="flex gap-3">
            <div className="flex-1">
              <label className={labelClass}>Altura</label>
              <input 
                type="text" 
                placeholder="1.85m" 
                value={height} 
                onChange={(e) => setHeight(e.target.value)} 
                className={inputClass} 
              />
            </div>
            <div className="flex-1">
              <label className={labelClass}>Peso</label>
              <input 
                type="text" 
                placeholder="105kg" 
                value={weight} 
                onChange={(e) => setWeight(e.target.value)} 
                className={inputClass} 
              />
            </div>
          </div>

        </div>

        {/* BARRA DE AÇÕES */}
        <div className="flex flex-col md:flex-row justify-end gap-4 mt-8 pt-6 border-t border-slate-800">
          <button 
            type="button" 
            onClick={onCancel} 
            className="px-6 py-3 rounded-xl border border-slate-700 text-slate-400 font-bold text-xs hover:bg-slate-800 hover:text-white transition-all flex items-center justify-center gap-2"
          >
            <X size={16} /> CANCELAR
          </button>
          <button 
            type="submit" 
            className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white rounded-xl font-bold text-xs transition-all shadow-lg shadow-indigo-500/20 flex items-center justify-center gap-2 transform active:scale-95"
          >
            <Save size={16} /> 
            {initialData ? 'CONFIRMAR ALTERAÇÕES' : 'EFETIVAR CADASTRO'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AthleteForm;