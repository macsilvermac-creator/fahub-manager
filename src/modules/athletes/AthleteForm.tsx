import { useState, useEffect } from 'react';
import { Athlete, AthleteStatus } from '../../types/athlete';

interface AthleteFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Omit<Athlete, 'id'>) => void;
  initialData?: Athlete | null;
}

export default function AthleteForm({ isOpen, onClose, onSubmit, initialData }: AthleteFormProps) {
  const [formData, setFormData] = useState<Omit<Athlete, 'id'>>({
    name: '',
    email: '',
    phone: '',
    category: '',
    status: 'Active',
    position: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    } else {
      setFormData({
        name: '',
        email: '',
        phone: '',
        category: '',
        status: 'Active',
        position: ''
      });
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold mb-4">
          {initialData ? 'Editar Atleta' : 'Novo Atleta'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Nome</label>
            <input
              type="text"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Categoria</label>
            <input
              type="text"
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            />
          </div>
          <div>
             <label className="block text-sm font-medium text-gray-700">Status</label>
             <select 
               className="mt-1 block w-full rounded-md border-gray-300 shadow-sm border p-2"
               value={formData.status}
               onChange={(e) => setFormData({...formData, status: e.target.value as AthleteStatus})}
             >
               <option value="Active">Ativo</option>
               <option value="Inactive">Inativo</option>
               <option value="Injured">Lesionado</option>
               <option value="Suspended">Suspenso</option>
             </select>
          </div>
          <div className="flex justify-end gap-2 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}