
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/authService';
import { UserRole } from '../types';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'MASTER' as UserRole });
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      await authService.register(formData.name, formData.email, formData.role, formData.password);
      setSuccess(true);
      // Auto redirect after 2 seconds
      setTimeout(() => navigate('/login'), 2000);
    } catch (err: any) {
      console.error(err);
      setError(err.message);
      setLoading(false);
    }
  };

  if (success) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-primary">
            <div className="bg-secondary/70 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-white/10 w-full max-w-md text-center animate-fade-in">
                <div className="w-16 h-16 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                </div>
                <h2 className="text-2xl font-bold text-white mb-2">Conta Criada!</h2>
                <p className="text-text-secondary mb-6">Seu acesso Master foi configurado. Redirecionando...</p>
                <Link to="/login" className="block w-full bg-white/10 hover:bg-white/20 text-white font-bold py-2 rounded-lg transition-colors">
                    Ir para Login Agora
                </Link>
            </div>
        </div>
      );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary relative overflow-hidden">
      <div className="bg-secondary/70 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-white/10 w-full max-w-md relative z-10 animate-fade-in">
        <div className="text-center mb-6">
             <div className="flex justify-center mb-4">
                <div className="w-12 h-12 bg-highlight rounded-xl transform -skew-x-6 flex items-center justify-center shadow-[0_0_15px_rgba(0,168,107,0.4)]">
                    <span className="text-white font-black text-2xl transform skew-x-6 tracking-tighter">FH</span>
                </div>
            </div>
            <h2 className="text-2xl font-bold text-white">Criar Nova Conta</h2>
            <p className="text-text-secondary mt-1">Configure seu acesso Master</p>
        </div>

        {error && <div className="bg-red-500/20 text-red-300 p-3 rounded-lg mb-4 text-sm text-center font-bold border border-red-500/50">{error}</div>}

        <form onSubmit={handleRegister} className="space-y-4">
            <div>
                <label className="block text-xs font-bold text-text-secondary uppercase mb-1">Nome Completo</label>
                <input 
                    type="text" required 
                    className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:border-highlight focus:outline-none"
                    placeholder="Seu nome"
                    value={formData.name}
                    onChange={e => setFormData({...formData, name: e.target.value})}
                />
            </div>
            <div>
                <label className="block text-xs font-bold text-text-secondary uppercase mb-1">Email (Use um novo se der erro)</label>
                <input 
                    type="email" required 
                    className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:border-highlight focus:outline-none"
                    placeholder="novo@email.com"
                    value={formData.email}
                    onChange={e => setFormData({...formData, email: e.target.value})}
                />
            </div>
            
            {/* CAMPO DE SENHA ADICIONADO */}
            <div>
                <label className="block text-xs font-bold text-text-secondary uppercase mb-1">Senha (Crie sua senha)</label>
                <input 
                    type="password" required 
                    className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:border-highlight focus:outline-none"
                    placeholder="Mínimo 6 caracteres"
                    minLength={6}
                    value={formData.password}
                    onChange={e => setFormData({...formData, password: e.target.value})}
                />
            </div>

            <div>
                <label className="block text-xs font-bold text-text-secondary uppercase mb-1">Cargo Pretendido</label>
                <select 
                    className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-white focus:border-highlight focus:outline-none"
                    value={formData.role}
                    onChange={e => setFormData({...formData, role: e.target.value as UserRole})}
                >
                    <option value="MASTER">Master (Dono/Presidente)</option>
                    <option value="HEAD_COACH">Head Coach</option>
                    <option value="PLAYER">Atleta</option>
                </select>
                <p className="text-[10px] text-text-secondary mt-1">Obs: Selecione MASTER para acesso total.</p>
            </div>

            <button type="submit" disabled={loading} className="w-full bg-highlight hover:bg-highlight-hover text-white font-bold py-3 rounded-lg shadow-lg mt-4 transition-all disabled:opacity-50">
                {loading ? 'Criando...' : 'Cadastrar e Entrar'}
            </button>
        </form>

        <div className="mt-6 text-center text-sm">
            <Link to="/login" className="text-text-secondary hover:text-white transition-colors">Já tem conta? Faça Login</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
