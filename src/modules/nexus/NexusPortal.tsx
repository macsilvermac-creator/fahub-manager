import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Shield, Landmark, Users, 
  Zap, Target, LayoutDashboard 
} from 'lucide-react';

const NexusPortal: React.FC = () => {
  const navigate = useNavigate();

  const perspectives = [
    { id: 'presidency', title: 'Presidência', icon: Shield, path: '/dashboard', color: 'from-slate-800 to-slate-900' },
    { id: 'finance', title: 'Dir. Financeira', icon: Landmark, path: '/financeiro', color: 'from-emerald-900/40 to-slate-900' },
    { id: 'commercial', title: 'Dir. Comercial', icon: Target, path: '/comercial', color: 'from-blue-900/40 to-slate-900' }, // VALIDAÇÃO AQUI
    { id: 'human-capital', title: 'Cap. Humano', icon: Users, path: '/human-capital', color: 'from-indigo-900/40 to-slate-900' },
    { id: 'marketing', title: 'Creative Lab', icon: Zap, path: '/creative-lab', color: 'from-purple-900/40 to-slate-900' },
    { id: 'operations', title: 'Operações', icon: LayoutDashboard, path: '/dashboard', color: 'from-slate-800 to-slate-900' },
  ];

  return (
    <div className="flex h-screen bg-[#020617] text-white font-sans overflow-hidden items-center justify-center p-12">
      <div className="max-w-6xl w-full">
        <header className="text-center mb-16">
          <h1 className="text-5xl font-black italic uppercase tracking-tighter mb-4">
            FA<span className="text-blue-500">HUB</span> NEXUS
          </h1>
          <p className="text-xs font-black uppercase tracking-[0.5em] text-slate-500 italic">Selecione sua Perspectiva de Comando</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {perspectives.map((p) => (
            <div 
              key={p.id}
              onClick={() => navigate(p.path)}
              className={`group relative bg-gradient-to-br ${p.color} border border-white/5 p-8 rounded-[2.5rem] cursor-pointer hover:scale-[1.02] transition-all overflow-hidden shadow-2xl`}
            >
              <div className="relative z-10">
                <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest mb-1 italic">Acessar Dashboard</p>
                <h2 className="text-2xl font-black italic uppercase text-white mb-6 tracking-tight group-hover:text-blue-400 transition-colors">{p.title}</h2>
                <div className="p-4 bg-white/5 rounded-2xl w-fit border border-white/10 group-hover:border-blue-500/50 transition-colors">
                  <p.icon size={32} className="text-white group-hover:text-blue-400" />
                </div>
              </div>
              <div className="absolute -right-4 -bottom-4 opacity-5 group-hover:opacity-10 transition-opacity">
                <p.icon size={160} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NexusPortal;