
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
      // Timeout safety for Firebase connection issues
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error("Tempo limite de conexão excedido. Verifique sua internet.")), 8000)
      );

      await Promise.race([authService.login(email, password), timeoutPromise]);
      
      navigate('/dashboard');
      window.location.reload();
    } catch (err: any) {
      console.error(err);
      if (err.message.includes('invalid-credential')) {
        setError("Senha incorreta ou usuário não encontrado.");
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
      if(!window.confirm("Isso irá enviar todos os dados de exemplo para o seu Firebase. Use isso apenas se for a primeira vez.")) return;
      setSeedStatus('Iniciando migração...');
      try {
          await storageService.seedDatabaseToCloud();
          setSeedStatus('✅ Concluído!');
          alert('Dados enviados! Agora crie sua conta ou faça login.');
      } catch (e: any) {
          setSeedStatus('❌ Erro: ' + e.message);
      }
  };

  const handleForgotPassword = async () => {
      if(!email) {
          setError("Digite seu e-mail primeiro para recuperar a senha.");
          return;
      }
      try {
          // In real firebase this would call sendPasswordResetEmail
          alert(`Email de recuperação enviado para ${email} (Simulado)`);
      } catch(e) {
          setError("Erro ao enviar email.");
      }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary relative overflow-hidden p-4">
      {/* Animated Background */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-highlight/10 rounded-full blur-[120px] animate-pulse-slow"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-600/10 rounded-full blur-[120px] animate-pulse-slow" style={{animationDelay: '1s'}}></div>
      </div>

      <div className="bg-secondary/40 backdrop-blur-xl p-8 rounded-3xl shadow-2xl border border-white/10 w-full max-w-md relative z-10 animate-fade-in">
        <div className="text-center mb-8">
            <div className="flex justify-center mb-6">
                <div className="w-20 h-20 bg-highlight rounded-2xl transform -skew-x-6 flex items-center justify-center shadow-glow relative group transition-transform hover:scale-105 duration-300">
                    <div className="absolute inset-0 bg-white/20 rounded-2xl animate-pulse"></div>
                    <span className="text-white font-black text-4xl transform skew-x-6 tracking-tighter relative z-10">FH</span>
                </div>
            </div>
            <h2 className="text-3xl font-black text-white tracking-tight mb-2">FAHUB MANAGER</h2>
            <p className="text-text-secondary text-sm font-medium">A Plataforma Definitiva do Futebol Americano</p>
        </div>

        {error && (
            <div className="bg-red-500/10 border border-red-500/30 text-red-200 p-4 rounded-xl mb-6 text-sm text-center font-medium flex items-center justify-center gap-3 animate-slide-down">
                <AlertTriangleIcon className="w-5 h-5 shrink-0" />
                {error}
            </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
            <Input 
                label="Email Profissional"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
                autoComplete="email"
            />
            
            <div>
                <Input 
                    label="Senha de Acesso"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    icon={<LockIcon className="w-5 h-5" />}
                    required
                />
                <div className="flex justify-end mt-2">
                    <button type="button" onClick={handleForgotPassword} className="text-xs text-text-secondary hover:text-highlight transition-colors">
                        Esqueceu a senha?
                    </button>
                </div>
            </div>

            <Button type="submit" isLoading={loading} fullWidth size="lg" className="mt-4">
                ACESSAR PLATAFORMA
            </Button>
        </form>

        <div className="mt-8 pt-6 border-t border-white/10 text-center space-y-4">
            <div className="bg-black/20 p-4 rounded-xl border border-white/5">
                <p className="text-text-secondary text-xs mb-3">Ainda não tem acesso?</p>
                <Link to="/register">
                    <Button variant="secondary" fullWidth size="sm">
                        CRIAR CONTA GRATUITA
                    </Button>
                </Link>
            </div>
            
            {/* Dev Tools - Only visible in dev environments usually, keeping for testing */}
            <div className="flex flex-col gap-2 pt-2 opacity-60 hover:opacity-100 transition-opacity">
                <button onClick={handleEmergencyLogin} className="text-[10px] text-red-400 hover:text-red-300 font-mono uppercase tracking-wider">
                    [DEV] Login de Emergência (Bypass)
                </button>
                
                <button onClick={handleSeedDatabase} className="text-[10px] text-highlight hover:text-white font-mono uppercase tracking-wider flex items-center justify-center gap-1">
                    <SparklesIcon className="w-3 h-3" /> Popular Banco (Seed)
                </button>
                {seedStatus && <p className="text-[10px] text-green-400">{seedStatus}</p>}
            </div>
        </div>
      </div>
      
      <p className="absolute bottom-4 text-center w-full text-[10px] text-text-secondary opacity-40">
          v0.9.2 Beta • FAHUB Inc. © 2025
      </p>
    </div>
  );
};

export default Login;