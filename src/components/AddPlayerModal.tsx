
import React, { useState, useEffect } from 'react';
import Modal from './Modal';
import { Player, CombineStats } from '../types';
import { validators } from '../utils/validators';

interface AddPlayerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (player: Omit<Player, 'id' | 'level' | 'xp' | 'badges' | 'rating' | 'status'>) => void;
}

const POSITIONS = ['QB', 'RB', 'WR', 'TE', 'OL', 'DL', 'LB', 'CB', 'S', 'K', 'P'];
const CLASSES = ['Calouro', 'Segundanista', 'Júnior', 'Sênior', 'Veterano'];
const NATIONALITIES = [
    { code: 'BRA', label: 'Brasileiro 🇧🇷' },
    { code: 'USA', label: 'Americano 🇺🇸' },
    { code: 'MEX', label: 'Mexicano 🇲🇽' },
    { code: 'EUR', label: 'Europeu 🇪🇺' },
    { code: 'JPN', label: 'Japonês 🇯🇵' },
    { code: 'OTHER', label: 'Outro 🏳️' }
];

const AddPlayerModal: React.FC<AddPlayerModalProps> = ({ isOpen, onClose, onAdd }) => {
  const [activeTab, setActiveTab] = useState<'INFO' | 'COMBINE'>('INFO');
  
  const [formData, setFormData] = useState({
    name: '',
    cpf: '',
    birthDate: '',
    nationality: 'BRA',
    position: 'QB',
    jerseyNumber: '',
    height: '',
    weight: '',
    class: 'Calouro',
    avatarUrl: ''
  });

  const [combineData, setCombineData] = useState<CombineStats>({
    date: new Date(),
    fortyYards: undefined,
    benchPress: undefined,
    verticalJump: undefined,
    broadJump: undefined,
    shuttle: undefined
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen) {
        setFormData({
            name: '',
            cpf: '',
            birthDate: '',
            nationality: 'BRA',
            position: 'QB',
            jerseyNumber: '',
            height: '',
            weight: '',
            class: 'Calouro',
            avatarUrl: ''
        });
        setCombineData({ date: new Date() });
        setErrors({});
        setActiveTab('INFO');
    }
  }, [isOpen]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    // Apply Mask for CPF
    let finalValue = value;
    if (name === 'cpf') {
        finalValue = validators.formatCPF(value);
    }

    setFormData(prev => ({ ...prev, [name]: finalValue }));
    
    // Clear error on change
    if (errors[name]) {
      setErrors(prev => {
          const newErrors = { ...prev };
          delete newErrors[name];
          return newErrors;
      });
    }
  };

  const handleCombineChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCombineData(prev => ({ ...prev, [name]: value ? Number(value) : undefined }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = 'Nome é obrigatório';
    if (!formData.cpf.trim()) newErrors.cpf = 'CPF é obrigatório';
    else if (!validators.isValidCPF(formData.cpf)) newErrors.cpf = 'CPF Inválido (Verificação RFB)';
    
    if (!formData.birthDate) newErrors.birthDate = 'Data de Nascimento obrigatória';
    if (!formData.jerseyNumber) newErrors.jerseyNumber = 'Número é obrigatório';
    else if (isNaN(Number(formData.jerseyNumber))) newErrors.jerseyNumber = 'Deve ser um número';
    
    if (!formData.height.trim()) newErrors.height = 'Altura é obrigatória';
    
    if (!formData.weight) newErrors.weight = 'Peso é obrigatório';
    else if (isNaN(Number(formData.weight))) newErrors.weight = 'Deve ser um número';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setActiveTab('INFO'); 
      return;
    }

    onAdd({
      name: formData.name,
      cpf: formData.cpf,
      birthDate: new Date(formData.birthDate),
      nationality: formData.nationality,
      position: formData.position,
      jerseyNumber: Number(formData.jerseyNumber),
      height: formData.height,
      weight: Number(formData.weight),
      class: formData.class,
      avatarUrl: formData.avatarUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name)}&background=random`,
      depthChartOrder: 3, 
      combineStats: combineData,
      rosterHistory: [],
      /* Fix: Added required attendanceRate property */
      attendanceRate: 100 
    });
  };

  const inputClass = "w-full bg-secondary border border-tertiary rounded-lg p-3 text-text-primary focus:ring-2 focus:ring-highlight focus:border-transparent focus:outline-none transition-all placeholder-gray-500";
  const labelClass = "block text-sm font-semibold text-text-secondary mb-1.5 ml-1";

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Recrutar Novo Atleta">
        {/* Tabs */}
        <div className="flex border-b border-white/10 mb-6">
            <button 
                onClick={() => setActiveTab('INFO')}
                className={`flex-1 py-3 text-sm font-bold text-center border-b-2 transition-colors ${activeTab === 'INFO' ? 'border-highlight text-highlight' : 'border-transparent text-text-secondary hover:text-white'}`}
            >
                Dados Cadastrais
            </button>
            <button 
                onClick={() => setActiveTab('COMBINE')}
                className={`flex-1 py-3 text-sm font-bold text-center border-b-2 transition-colors ${activeTab === 'COMBINE' ? 'border-highlight text-highlight' : 'border-transparent text-text-secondary hover:text-white'}`}
            >
                Físico & Combine
            </button>
        </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        
        {activeTab === 'INFO' && (
            <div className="space-y-5 animate-fade-in">
                <div className="bg-black/20 p-4 rounded-lg border border-white/5">
                    <h4 className="text-xs font-bold text-highlight uppercase mb-3">Identidade & Governo</h4>
                    <div className="space-y-4">
                        <div>
                            <label className={labelClass}>Nome Completo (Civil)</label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className={`${inputClass} ${errors.name ? 'border-red-500' : ''}`}
                                placeholder="Conforme documento"
                            />
                            {errors.name && <p className="text-red-500 text-xs mt-1 ml-1">{errors.name}</p>}
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className={labelClass}>CPF</label>
                                <input
                                    type="text"
                                    name="cpf"
                                    value={formData.cpf}
                                    onChange={handleChange}
                                    className={`${inputClass} ${errors.cpf ? 'border-red-500' : ''}`}
                                    placeholder="000.000.000-00"
                                    maxLength={14}
                                />
                                {errors.cpf && <p className="text-red-500 text-xs mt-1 ml-1">{errors.cpf}</p>}
                            </div>
                            <div>
                                <label className={labelClass}>Nascimento</label>
                                <input
                                    type="date"
                                    name="birthDate"
                                    value={formData.birthDate}
                                    onChange={handleChange}
                                    className={`${inputClass} ${errors.birthDate ? 'border-red-500' : ''}`}
                                />
                                {errors.birthDate && <p className="text-red-500 text-xs mt-1 ml-1">{errors.birthDate}</p>}
                            </div>
                        </div>
                        <div>
                            <label className={labelClass}>Nacionalidade</label>
                            <select
                                name="nationality"
                                value={formData.nationality}
                                onChange={handleChange}
                                className={inputClass}
                            >
                                {NATIONALITIES.map(n => <option key={n.code} value={n.code}>{n.label}</option>)}
                            </select>
                            <p className="text-[10px] text-text-secondary mt-1 ml-1">Importante para regra de limite de estrangeiros.</p>
                        </div>
                    </div>
                </div>

                <div className="bg-black/20 p-4 rounded-lg border border-white/5">
                    <h4 className="text-xs font-bold text-blue-400 uppercase mb-3">Dados Esportivos</h4>
                    <div className="grid grid-cols-2 gap-5">
                        <div>
                            <label className={labelClass}>Posição</label>
                            <select
                            name="position"
                            value={formData.position}
                            onChange={handleChange}
                            className={inputClass}
                            >
                            {POSITIONS.map(pos => <option key={pos} value={pos}>{pos}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className={labelClass}>Número (#)</label>
                            <input
                            type="number"
                            name="jerseyNumber"
                            value={formData.jerseyNumber}
                            onChange={handleChange}
                            className={`${inputClass} ${errors.jerseyNumber ? 'border-red-500' : ''}`}
                            placeholder="0-99"
                            />
                            {errors.jerseyNumber && <p className="text-red-500 text-xs mt-1 ml-1">{errors.jerseyNumber}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-5 mt-4">
                        <div>
                            <label className={labelClass}>Altura</label>
                            <input
                            type="text"
                            name="height"
                            value={formData.height}
                            onChange={handleChange}
                            className={`${inputClass} ${errors.height ? 'border-red-500' : ''}`}
                            placeholder="ex: 6'2&quot; ou 1.88m"
                            />
                            {errors.height && <p className="text-red-500 text-xs mt-1 ml-1">{errors.height}</p>}
                        </div>
                        <div>
                            <label className={labelClass}>Peso (lbs)</label>
                            <input
                            type="number"
                            name="weight"
                            value={formData.weight}
                            onChange={handleChange}
                            className={`${inputClass} ${errors.weight ? 'border-red-500' : ''}`}
                            placeholder="ex: 220"
                            />
                            {errors.weight && <p className="text-red-500 text-xs mt-1 ml-1">{errors.weight}</p>}
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-5 mt-4">
                        <div>
                            <label className={labelClass}>Experiência</label>
                            <select
                            name="class"
                            value={formData.class}
                            onChange={handleChange}
                            className={inputClass}
                            >
                            {CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className={labelClass}>Foto URL</label>
                            <input
                            type="text"
                            name="avatarUrl"
                            value={formData.avatarUrl}
                            onChange={handleChange}
                            className={inputClass}
                            placeholder="https://..."
                            />
                        </div>
                    </div>
                </div>
            </div>
        )}

        {activeTab === 'COMBINE' && (
            <div className="grid grid-cols-2 gap-5 animate-fade-in">
                <div className="col-span-2 text-center text-text-secondary text-sm mb-2">
                    Dados opcionais. Podem ser preenchidos após testes físicos.
                </div>
                <div>
                    <label className={labelClass}>40 Yard Dash (s)</label>
                    <input
                        type="number"
                        step="0.01"
                        name="fortyYards"
                        value={combineData.fortyYards || ''}
                        onChange={handleCombineChange}
                        className={inputClass}
                        placeholder="ex: 4.50"
                    />
                </div>
                <div>
                    <label className={labelClass}>Supino (Reps 225lbs)</label>
                    <input
                        type="number"
                        name="benchPress"
                        value={combineData.benchPress || ''}
                        onChange={handleCombineChange}
                        className={inputClass}
                        placeholder="ex: 15"
                    />
                </div>
                <div>
                    <label className={labelClass}>Salto Vertical (in)</label>
                    <input
                        type="number"
                        step="0.1"
                        name="verticalJump"
                        value={combineData.verticalJump || ''}
                        onChange={handleCombineChange}
                        className={inputClass}
                        placeholder="ex: 32"
                    />
                </div>
                <div>
                    <label className={labelClass}>Salto Horizontal (in)</label>
                    <input
                        type="number"
                        name="broadJump"
                        value={combineData.broadJump || ''}
                        onChange={handleCombineChange}
                        className={inputClass}
                        placeholder="ex: 110"
                    />
                </div>
                <div>
                    <label className={labelClass}>Shuttle Run (s)</label>
                    <input
                        type="number"
                        step="0.01"
                        name="shuttle"
                        value={combineData.shuttle || ''}
                        onChange={handleCombineChange}
                        className={inputClass}
                        placeholder="ex: 4.20"
                    />
                </div>
            </div>
        )}

        <div className="flex justify-end space-x-3 mt-8 pt-5 border-t border-white/10">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 text-text-secondary hover:text-white transition-colors rounded-lg hover:bg-white/5"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-6 py-2.5 bg-gradient-to-r from-highlight to-highlight-hover text-white rounded-lg font-bold shadow-lg hover:shadow-glow transition-all transform hover:-translate-y-0.5"
          >
            Confirmar Cadastro
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default AddPlayerModal;
