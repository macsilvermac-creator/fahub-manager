import React from 'react';
import type { Athlete } from './types';

interface AthleteFormProps {
  onSubmit: (data: Partial<Athlete>) => void;
  onCancel: () => void;
}

const AthleteForm: React.FC<AthleteFormProps> = ({ onSubmit, onCancel }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Novo Atleta</h3>
      <div className="grid grid-cols-1 gap-6">
        {/* Placeholder simples para o formulário passar no build */}
        <div>
           <label className="block text-sm font-medium text-gray-700">Nome Completo</label>
           <input type="text" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2" />
        </div>
        
        <div className="flex justify-end gap-3 mt-4">
          <button onClick={onCancel} className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50">
            Cancelar
          </button>
          <button onClick={() => onSubmit({})} className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700">
            Salvar
          </button>
        </div>
      </div>
    </div>
  );
};

export default AthleteForm;