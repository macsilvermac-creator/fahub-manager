import React, { useState } from 'react';
import type { Athlete } from './types';

interface AthleteFormProps {
  onSubmit: (data: Omit<Athlete, 'id'>) => void;
  onCancel: () => void;
}

const AthleteForm: React.FC<AthleteFormProps> = ({ onSubmit, onCancel }) => {
  // Estados para guardar o que o usuário digita
  const [name, setName] = useState('');
  const [position, setPosition] = useState('QB');
  const [number, setNumber] = useState(0);
  const [status, setStatus] = useState<Athlete['status']>('ACTIVE');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); // Impede a página de recarregar
    
    // Envia os dados para quem chamou (AthletesList)
    onSubmit({
      name,
      position,
      number: Number(number),
      status,
      height,
      weight
    });
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200 mb-6">
      <h3 className="text-lg font-bold text-gray-900 mb-4">Novo Atleta</h3>
      
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Nome */}
        <div className="md:col-span-2">
           <label className="block text-sm font-medium text-gray-700">Nome Completo</label>
           <input 
             required
             type="text" 
             value={name}
             onChange={(e) => setName(e.target.value)}
             className="mt-1 block w-full rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:ring-blue-500" 
           />
        </div>

        {/* Posição */}
        <div>
           <label className="block text-sm font-medium text-gray-700">Posição</label>
           <select 
             value={position}
             onChange={(e) => setPosition(e.target.value)}
             className="mt-1 block w-full rounded-md border border-gray-300 p-2"
           >
             <option value="QB">Quarterback (QB)</option>
             <option value="WR">Wide Receiver (WR)</option>
             <option value="RB">Running Back (RB)</option>
             <option value="LB">Linebacker (LB)</option>
             <option value="OL">Offensive Line (OL)</option>
             <option value="DL">Defensive Line (DL)</option>
           </select>
        </div>

        {/* Número */}
        <div>
           <label className="block text-sm font-medium text-gray-700">Número (#)</label>
           <input 
             required
             type="number" 
             value={number}
             onChange={(e) => setNumber(Number(e.target.value))}
             className="mt-1 block w-full rounded-md border border-gray-300 p-2" 
           />
        </div>

        {/* Status */}
        <div>
           <label className="block text-sm font-medium text-gray-700">Status</label>
           <select 
             value={status}
             onChange={(e) => setStatus(e.target.value as any)}
             className="mt-1 block w-full rounded-md border border-gray-300 p-2"
           >
             <option value="ACTIVE">Ativo</option>
             <option value="INJURED">Lesionado</option>
             <option value="SUSPENDED">Suspenso</option>
           </select>
        </div>

        {/* Altura e Peso (Opcionais) */}
        <div className="flex gap-2">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700">Altura</label>
            <input 
              type="text" 
              placeholder="1.80m"
              value={height}
              onChange={(e) => setHeight(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2" 
            />
          </div>
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700">Peso</label>
            <input 
              type="text" 
              placeholder="90kg"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-300 p-2" 
            />
          </div>
        </div>
        
        {/* Botões */}
        <div className="md:col-span-2 flex justify-end gap-3 mt-4 pt-4 border-t">
          <button 
            type="button" 
            onClick={onCancel} 
            className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Cancelar
          </button>
          <button 
            type="submit" 
            className="px-4 py-2 border border-transparent rounded-md text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            Salvar Atleta
          </button>
        </div>
      </form>
    </div>
  );
};

export default AthleteForm;