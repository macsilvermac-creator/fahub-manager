import React from 'react';
import { 
  Trophy, Landmark, 
  Shield, Briefcase, 
  Activity, Users, GraduationCap 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

/**
 * Portal Nexus - Protocolo de Simulação Master
 * Ponto central de troca de personas da entidade.
 */
const NexusPortal: React.FC = () => {
  const navigate = useNavigate();

  const sections = [
    {
      title: "1. ENTIDADES",
      items: [
        { label: "Confederação", icon: Trophy, path: "/dashboard" },
        { label: "Ligas", icon: Trophy, path: "/dashboard" },
        { label: "Equipe / Clubes", icon: Landmark, path: "/dashboard" }
      ]
    },
    {
      title: "2. CONSELHO ADMINISTRATIVO",
      items: [
        { label: "Presidente", icon: Shield, path: "/dashboard" },
        { label: "Vice-presidente", icon: Shield, path: "/dashboard" },
        { label: "Diretora Financeira", icon: Briefcase, path: "/dashboard" },
        { label: "Diretor de Marketing", icon: Briefcase, path: "/dashboard" },
        { label: "Diretor Comercial", icon: Briefcase, path: "/dashboard" }
      ]
    },
    {
      title: "3. OPERACIONAL",
      items: [
        { label: "HC", icon: Activity, path: "/dashboard" },
        { label: "Cord. Ataque", icon: Activity, path: "/dashboard" },
        { label: "Cord. Defesa", icon: Activity, path: "/dashboard" },
        { label: "Auxiliares de CT", icon: Activity, path: "/dashboard" },
        { label: "Funcionários", icon: Activity, path: "/dashboard" }
      ]
    },
    {
      title: "4. USUÁRIOS",
      items: [
        { label: "Atletas", icon: Users, path: "/dashboard" },
        { label: "Alunos", icon: GraduationCap, path: "/dashboard" }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-[#050a18] text-white p-8 font-sans">
      <header className="text-center mb-16">
        <h1 className="text-4xl font-black italic tracking-tighter mb-2">
          FAHUB <span className="text-blue-500">NEXUS</span>
        </h1>
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-[0.4em]">
          Protocolo de Simulação Master Developer
        </p>
      </header>

      <main className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {sections.map((section, idx) => (
          <div key={idx} className="space-y-4">
            <h2 className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-6">
              {section.title}
            </h2>
            <div className="space-y-3">
              {section.items.map((item, i) => (
                <button
                  key={i}
                  onClick={() => navigate(item.path)}
                  className="w-full bg-[#111827] border border-white/5 p-4 rounded-2xl flex items-center justify-between group hover:bg-blue-600/10 hover:border-blue-500/50 transition-all text-left"
                >
                  <span className="text-xs font-bold text-slate-300 group-hover:text-white transition-colors">
                    {item.label}
                  </span>
                  <item.icon size={16} className="text-slate-600 group-hover:text-blue-500 transition-colors" />
                </button>
              ))}
            </div>
          </div>
        ))}
      </main>
    </div>
  );
};

export default NexusPortal;