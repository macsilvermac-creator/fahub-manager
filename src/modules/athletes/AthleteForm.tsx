import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { X, Save } from 'lucide-react';

export interface AthleteFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function AthleteForm({ onClose, onSuccess }: AthleteFormProps) {
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.from('athletes').insert([{ full_name: name, status: 'active', birth_date: new Date().toISOString() }]);
    if (!error) onSuccess();
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold text-xl">Novo Atleta</h2>
          <button onClick={onClose}><X /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input 
            className="w-full border p-2 rounded" 
            placeholder="Nome Completo" 
            value={name} 
            onChange={e => setName(e.target.value)} 
          />
          <button type="submit" disabled={loading} className="w-full bg-blue-600 text-white p-2 rounded font-bold">
            {loading ? 'Salvando...' : 'Salvar Atleta'}
          </button>
        </form>
      </div>
    </div>
  );
}