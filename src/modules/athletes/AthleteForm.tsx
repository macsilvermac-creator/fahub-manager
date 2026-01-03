import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { X, Loader2 } from 'lucide-react'; // Save removido (TS6133 resolvido)

export interface AthleteFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function AthleteForm({ onClose, onSuccess }: AthleteFormProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({ full_name: '', birth_date: '', position: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.from('athletes').insert([
      { ...formData, status: 'active' }
    ]);
    if (!error) onSuccess();
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-2xl border border-slate-200">
        <div className="flex justify-between items-center mb-6 border-b pb-4">
          <h2 className="font-black text-xl text-slate-900 italic tracking-tighter uppercase">Nexus - Novo Atleta</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X /></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input 
            className="w-full border border-slate-200 p-3 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 transition-all" 
            placeholder="Nome Completo" 
            required
            value={formData.full_name} 
            onChange={e => setFormData({...formData, full_name: e.target.value})} 
          />
          <input 
            type="date"
            className="w-full border border-slate-200 p-3 rounded-xl outline-none" 
            required
            value={formData.birth_date} 
            onChange={e => setFormData({...formData, birth_date: e.target.value})} 
          />
          <button type="submit" disabled={loading} className="w-full bg-slate-900 text-white p-4 rounded-xl font-bold hover:bg-slate-800 transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-xs">
            {loading ? <Loader2 className="animate-spin" size={18} /> : 'Registrar no Nexus'}
          </button>
        </form>
      </div>
    </div>
  );
}