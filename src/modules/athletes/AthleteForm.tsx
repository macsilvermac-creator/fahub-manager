import React, { useState, useEffect } from 'react';
import type { Athlete } from './types';

interface AthleteFormProps {
  initialData?: Athlete | null; // Se vier dados, é edição. Se null, é criação.
  onSubmit: (data: Omit<Athlete, 'id'>) => void;
  onCancel: () => void;
}

const AthleteForm: React.FC<AthleteFormProps> = ({ initialData, onSubmit, onCancel }) => {
  const [name, setName] = useState('');
  const [position, setPosition] = useState('QB');
  const [number, setNumber] = useState(0);
  const [status, setStatus] = useState<Athlete['status']>('ACTIVE');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');

  // Efeito Mágico: Se receber dados iniciais (Edição), preenche o formulário
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

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-200 mb-6">
      <h3 className="text-lg font-bold text-gray-900 mb-4">
        {initialData ? 'Editar Atleta' : 'Novo Atleta'}
      </h3>
      
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
           <label className="block text-sm font-medium text-gray-700">Nome</label>
           <input required type="text" value={name} onChange={(e) => setName(e.target.value)} className="mt-1 block w-full rounded-md border border-gray-300 p-2" />
        </div>
        <div>
           <label className="block text-sm font-medium text-gray-700">Posição</label>
           <select value={position} onChange={(e) => setPosition(e.target.value)} className="mt-1 block w-full rounded-md border border-gray-300 p-2">
             <option value="QB">QB</option><option value="WR">WR</option><option value="RB">RB</option>
             <option value="LB">LB</option><option value="OL">OL</option><option value="DL">DL</option>
           </select>
        </div>
        <div>
           <label className="block text-sm font-medium text-gray-700">Número</label>
           <input required type="number" value={number} onChange={(e) => setNumber(Number(e.target.value))} className="mt-1 block w-full rounded-md border border-gray-300 p-2" />
        </div>
        <div>
           <label className="block text-sm font-medium text-gray-700">Status</label>
           <select value={status} onChange={(e) => setStatus(e.target.value as any)} className="mt-1 block w-full rounded-md border border-gray-300 p-2">
             <option value="ACTIVE">Ativo</option><option value="INJURED">Lesionado</option><option value="SUSPENDED">Suspenso</option>
           </select>
        </div>
        <div className="flex gap-2">
          <input type="text" placeholder="Altura" value={height} onChange={(e) => setHeight(e.target.value)} className="w-full rounded-md border border-gray-300 p-2" />
          <input type="text" placeholder="Peso" value={weight} onChange={(e) => setWeight(e.target.value)} className="w-full rounded-md border border-gray-300 p-2" />
        </div>
        
        <div className="md:col-span-2 flex justify-end gap-3 mt-4 pt-4 border-t">
          <button type="button" onClick={onCancel} className="px-4 py-2 border rounded-md text-gray-700 hover:bg-gray-50">Cancelar</button>
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">Salvar</button>
        </div>
      </form>
    </div>
  );
};

export default AthleteForm;