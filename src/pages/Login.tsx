
import React, { useState } from 'react';
// @ts-ignore
import { useNavigate, Link } from 'react-router-dom';
import { authService } from '../services/authService';
import { storageService } from '../services/storageService';
import { SparklesIcon, AlertTriangleIcon, LockIcon } from '../components/icons/UiIcons';
import Button from '../components/Button';
import Input from '../components/Input';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [seedStatus, setSeedStatus] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error("Tempo limite de conexão excedido.")), 8000)
      );

      await Promise.race([authService.login(email, password), timeoutPromise]);
      
      navigate('/dashboard');
      window.location.reload();
    } catch (err: any) {
      console.error(err);
      if (err.message.includes('invalid-credential')) {
        setError("Senha incorreta.");
      } else {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleEmergencyLogin = () => {
      const mockUser = {
          id: 'dev-master',
          email: 'admin@gridiron.com',
          name: 'Master Dev',
          role: 'MASTER' as const,
          avatarUrl: 'https://ui-avatars.com/api/?name=MD&background=random',
          status: 'APPROVED' as const
      };
      localStorage.setItem('gridiron_current_user', JSON.stringify(mockUser));
      navigate('/dashboard');
      window.location.reload();
  };

  const handleSeedDatabase = async () => {
      if(!window.confirm("Isso irá enviar dados de exemplo para o Firebase.")) return;
      setSeedStatus('Enviando...');
      try {
          await storageService.seedDatabaseToCloud();
          setSeedStatus('✅ Feito!');
          alert('Dados enviados.');
      } catch (e: any) {
          setSeedStatus('❌ Erro');
      }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary p-4 overflow-hidden">
      {/* Container Compacto: max-w-sm e padding reduzido */}
      <div className="bg-secondary p-6 rounded-2xl border border-white/10 w-full max-w-sm shadow-2xl">
        
        <div className="text-center mb-5">
            <div className="flex justify-center mb-3">
                {/* Logo Reduzida */}
                <div className="w-12 h-12 bg-highlight rounded-xl flex items-center justify-center shadow-glow transform -skew-x-6">
                    <span className="text-white font-black text-xl transform skew-x-6 tracking-tighter">FH</span>
                </div>
            </div>
            <h2 className="text-xl font-bold text-white">FAHUB MANAGER</h2>
            <p className="text-text-secondary text-[10px] uppercase tracking-widest">Acesso ao Sistema</p>
        </div>

        {error && (
            <div className="bg-red-900/50 text-red-200 p-2 rounded mb-3 text-xs text-center border border-red-500/20">
                {error}
            </div>
        )}

        <form onSubmit={handleLogin} className="space-y-3">
            <Input 
                label="Email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                className="py-2 text-sm" // Input mais compacto
            />
            
            <div>
                <Input 
                    label="Senha"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    icon={<LockIcon className="w-4 h-4" />}
                    required
                    className="py-2 text-sm"
                />
            </div>

            <Button type="submit" isLoading={loading} fullWidth size="md" className="mt-2 py-2.5 shadow-glow">
                ENTRAR
            </Button>
        </form>

        <div className="mt-4 pt-3 border-t border-white/10 text-center space-y-2">
            <Link to="/register">
                <Button variant="ghost" fullWidth size="sm" className="text-xs text-text-secondary hover:text-white border border-white/5 hover:bg-white/5">
                    CRIAR NOVA CONTA
                </Button>
            </Link>
            
            {/* Opções de Dev compactas */}
            <div className="flex justify-center gap-4 pt-1 opacity-60">
                <button onClick={handleEmergencyLogin} className="text-[10px] text-text-secondary hover:text-highlight transition-colors flex items-center gap-1">
                    <LockIcon className="w-3 h-3" /> Login Rápido
                </button>
                <button onClick={handleSeedDatabase} className="text-[10px] text-text-secondary hover:text-highlight transition-colors flex items-center gap-1">
                    <SparklesIcon className="w-3 h-3" /> Seed Data
                </button>
            </div>
            {seedStatus && <p className="text-[10px] text-green-400">{seedStatus}</p>}
        </div>
      </div>
    </div>
  );
};

export default Login;
