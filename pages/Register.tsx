
import React, { useState } from 'react';
// @ts-ignore
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/authService';
import { UserRole } from '../types';
import { validators } from '../utils/validators';

const Register: React.FC = () => {
  const navigate = useNavigate();
  // Role is always CANDIDATE initially (handled by service)
  const [formData, setFormData] = useState({ name: '', email: '', password: '', cpf: '' });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Validação de CPF no frontend
    if (!validators.isValidCPF(formData.cpf)) {
        setError('CPF Inválido. Verifique os números.');
        return;
    }

    setLoading(true);
    
    try {
      // Fixed: Cast 'CANDIDATE' to UserRole to satisfy type checker
      await authService.register(formData.name, formData.email, 'CANDIDATE' as UserRole, formData.password, formData.cpf);
      setSuccess(true);
    } catch (err: any) {
      console.error(err);
      setError(err.message);
      setLoading(false);
    }
  };

  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const formatted = validators.formatCPF(e.target.value);
      setFormData({ ...formData, cpf: formatted });
  };

  if (success) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-primary p-4">
            <div className="bg-secondary/70 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-white/10 w-full max-w-md text-center animate-fade-in">
                <div className="w-16 h-16 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Cadastro Recebido!</h2>
                <p className="text-text-secondary mb-6 text-sm">
                    Seus dados foram enviados para a diretoria. <br/>
                    Aguarde a aprovação e definição do seu cargo para acessar o sistema.
                </p>
                <Link to="/login" className="block w-full bg-white/10 hover:bg-white/20 text-white font-bold py-3 rounded-lg transition-colors text-sm">
                    Voltar para Login
                </Link>
            </div>
        </div>
      );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary relative overflow-hidden p-4">
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-highlight/20 rounded-full blur-[100px]"></div>
      <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[100px]"></div>

      <div className="bg-secondary/70 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-white/10 w-full max-w-md relative z-10 animate-fade-in">
        <div className="text-center mb-6">
             <div className="flex justify-center mb-4">
                <div className="w-12 h-12 bg-highlight rounded-xl transform -skew-x-6 flex items-center justify-center shadow-[0_0_15px_rgba(0,168,107,0.4)]">
                    <span className="text-white font-black text-2xl transform skew-x-6 tracking-tighter">FH</span>
                </div>
            </div>
            <h2 className="text-2xl font-bold text-white">Solicitar Acesso</h2>
            <p className="text-text-secondary mt-1 text-sm">Preencha seus dados para análise da diretoria.</p>
        </div>

        {error && <div className="bg-red-500/20 text-red-300 p-3 rounded-lg mb-4 text-xs text-center font-bold border border-red-500/50">{error}</div>}

        <form onSubmit={handleRegister} className="space-y-4">
            <div>
                <label className="block text-xs font-bold text-text-secondary uppercase mb-1">Nome Completo</label>
                <input 
                    type="text" required 
                    className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:border-highlight focus:outline-none placeholder-white/20 text-sm"
                    placeholder="Ex: João da Silva"
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                />
            </div>
            
            <div>
                <label className="block text-xs font-bold text-text-secondary uppercase mb-1">CPF (Obrigatório)</label>
                <input 
                    type="text" required 
                    className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:border-highlight focus:outline-none placeholder-white/20 text-sm"
                    placeholder="000.000.000-00"
                    value={formData.cpf}
                    onChange={handleCPFChange}
                    maxLength={14}
                />
            </div>

            <div>
                <label className="block text-xs font-bold text-text-secondary uppercase mb-1">Email</label>
                <input 
                    type="email" required 
                    className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:border-highlight focus:outline-none placeholder-white/20 text-sm"
                    placeholder="seu@email.com"
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                />
            </div>
            
            <div>
                <label className="block text-xs font-bold text-text-secondary uppercase mb-1">Senha</label>
                <input 
                    type="password" required 
                    className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:border-highlight focus:outline-none placeholder-white/20 text-sm"
                    placeholder="Mínimo 6 caracteres"
                    minLength={6}
                    value={formData.password}
                    onChange={e => setFormData({...formData, password: e.target.value})}
                />
            </div>

            <button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-highlight to-green-600 hover:to-green-500 text-white font-bold py-3.5 rounded-lg shadow-lg mt-4 transition-all disabled:opacity-50 transform active:scale-95 text-sm">
                {loading ? 'Enviando...' : 'Enviar Solicitação'}
            </button>
        </form>

        <div className="mt-6 text-center text-sm">
            <Link to="/login" className="text-text-secondary hover:text-white transition-colors text-xs">Já tem cadastro? Acompanhar status</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
