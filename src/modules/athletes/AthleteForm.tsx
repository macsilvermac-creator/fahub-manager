import React, { useState } from 'react';
import { 
  User, Mail, Phone, Calendar, Shield, 
  MapPin, Hash, Save, X 
} from 'lucide-react';

/** * FORMULÁRIO DE ATLETA - PROTOCOLO NEXUS
 * Interface de cadastro e edição preservando a estética HUD Dark.
 */

interface AthleteFormProps {
  initialData?: any;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

const AthleteForm: React.FC<AthleteFormProps> = ({ initialData, onSubmit, onCancel }) => {
  const [formData, setFormData] = useState(initialData || {
    name: '',
    email: '',
    phone: '',
    birthDate: '',
    position: '',
    number: '',
    category: 'TACKLE',
    status: 'ACTIVE'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-[#0f172a] p-8 rounded-[2.5rem] border border-white/5 shadow-2xl">
      <div className="flex justify-between items-center mb-8 border-b border-white/5 pb-4">
        <h3 className="text-xl font-black italic text-white flex items-center gap-2 uppercase tracking-tighter">
          <User className="text-blue-500" size={24} /> 
          {initialData ? 'Editar Registro' : 'Novo Atleta'}
        </h3>
        <button type="button" onClick={onCancel} className="text-slate-500 hover:text-white transition-colors">
          <X size={24} />
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Informações Pessoais */}
        <div className="space-y-4">
          <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest pl-2">Dados Cadastrais</label>
          
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
            <input 
              required
              placeholder="Nome Completo"
              value={formData.name}
              onChange={e => setFormData({...formData, name: e.target.value})}
              className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 pl-12 text-sm font-bold text-white outline-none focus:border-blue-500 transition-all"
            />
          </div>

          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
            <input 
              required
              type="email"
              placeholder="E-mail"
              value={formData.email}
              onChange={e => setFormData({...formData, email: e.target.value})}
              className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 pl-12 text-sm font-bold text-white outline-none focus:border-blue-500 transition-all"
            />
          </div>

          <div className="relative">
            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
            <input 
              placeholder="Telefone/WhatsApp"
              value={formData.phone}
              onChange={e => setFormData({...formData, phone: e.target.value})}
              className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 pl-12 text-sm font-bold text-white outline-none focus:border-blue-500 transition-all"
            />
          </div>
        </div>

        {/* Informações Técnicas */}
        <div className="space-y-4">
          <label className="text-[10px] font-black uppercase text-slate-500 tracking-widest pl-2">Dados de Campo</label>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="relative">
              <Shield className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
              <input 
                placeholder="Posição (Ex: QB)"
                value={formData.position}
                onChange={e => setFormData({...formData, position: e.target.value})}
                className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 pl-12 text-sm font-bold text-white outline-none focus:border-blue-500 transition-all"
              />
            </div>
            <div className="relative">
              <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
              <input 
                placeholder="Nº Camisa"
                value={formData.number}
                onChange={e => setFormData({...formData, number: e.target.value})}
                className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 pl-12 text-sm font-bold text-white outline-none focus:border-blue-500 transition-all"
              />
            </div>
          </div>

          <div className="relative">
            <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
            <input 
              type="date"
              value={formData.birthDate}
              onChange={e => setFormData({...formData, birthDate: e.target.value})}
              className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 pl-12 text-sm font-bold text-white outline-none focus:border-blue-500 transition-all"
            />
          </div>

          <div className="relative">
            <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
            <select 
              value={formData.category}
              onChange={e => setFormData({...formData, category: e.target.value})}
              className="w-full bg-black/40 border border-white/10 rounded-2xl p-4 pl-12 text-sm font-bold text-white outline-none focus:border-blue-500 transition-all appearance-none"
            >
              <option value="TACKLE">Equipe Tackle</option>
              <option value="FLAG">Equipe Flag</option>
              <option value="DEVELOPMENT">Escola / Base</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex gap-4 pt-6 border-t border-white/5">
        <button 
          type="button" 
          onClick={onCancel}
          className="flex-1 py-4 rounded-2xl bg-white/5 text-slate-400 font-black uppercase italic tracking-widest hover:bg-white/10 transition-all"
        >
          Cancelar
        </button>
        <button 
          type="submit"
          className="flex-1 py-4 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black uppercase italic tracking-widest hover:scale-[1.02] transition-all shadow-lg shadow-blue-500/20"
        >
          <div className="flex items-center justify-center gap-2">
            <Save size={18} /> Confirmar Cadastro
          </div>
        </button>
      </div>
    </form>
  );
};

export default AthleteForm;