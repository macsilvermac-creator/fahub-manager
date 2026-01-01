import { Shield, Users, Trophy, Briefcase, Activity, Landmark } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const NexusPortal = () => {
  const navigate = useNavigate();

  // Função para "encarnar" a persona e ir para o Dashboard real
  const enterSkin = (role: string, path: string) => {
    console.log(`Injetando contexto de: ${role}`);
    // No futuro, aqui salvaremos o role no sessionStorage/localStorage
    navigate(path);
  };

  const sections = [
    {
      title: "1. ENTIDADES",
      items: [
        { label: "Confederação", path: "/dashboard", icon: Trophy },
        { label: "Ligas", path: "/dashboard", icon: Trophy },
        { label: "Equipe / Clubes", path: "/dashboard", icon: Landmark },
      ]
    },
    {
      title: "2. CONSELHO ADMINISTRATIVO",
      items: [
        { label: "Presidente", path: "/dashboard", icon: Shield },
        { label: "Vice-presidente", path: "/dashboard", icon: Shield },
        { label: "Diretora Financeira", path: "/finance", icon: Briefcase },
        { label: "Diretor de Marketing", path: "/dashboard", icon: Briefcase },
        { label: "Diretor Comercial", path: "/dashboard", icon: Briefcase },
      ]
    },
    {
      title: "3. OPERACIONAL",
      items: [
        { label: "HC", path: "/dashboard", icon: Activity },
        { label: "Cord. Ataque", path: "/dashboard", icon: Activity },
        { label: "Cord. Defesa", path: "/dashboard", icon: Activity },
        { label: "Auxiliares de CT", path: "/dashboard", icon: Activity },
        { label: "Funcionários", path: "/dashboard", icon: Activity },
      ]
    },
    {
      title: "4. USUÁRIOS",
      items: [
        { label: "Atletas", path: "/athletes", icon: Users },
        { label: "Alunos", path: "/athletes", icon: Users },
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-[#050a18] text-white p-8 font-sans">
      <div className="max-w-7xl mx-auto">
        <header className="text-center mb-12">
          <h1 className="text-4xl font-black tracking-tighter italic">
            FAHUB <span className="text-blue-500">NEXUS</span>
          </h1>
          <p className="text-slate-400 text-sm tracking-widest uppercase mt-2">
            PROTOCOLO DE SIMULAÇÃO MASTER DEVELOPER
          </p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {sections.map((section, idx) => (
            <div key={idx} className="bg-[#0a1229] rounded-3xl p-6 border border-slate-800/50 shadow-2xl">
              <h2 className="text-blue-400 text-xs font-bold mb-6 tracking-widest uppercase">
                {section.title}
              </h2>
              <div className="space-y-3">
                {section.items.map((item, i) => (
                  <button
                    key={i}
                    onClick={() => enterSkin(item.label, item.path)}
                    className="w-full bg-[#131c3a] hover:bg-blue-600/20 hover:border-blue-500/50 border border-transparent p-4 rounded-2xl text-left transition-all duration-200 group flex items-center justify-between"
                  >
                    <span className="text-slate-300 group-hover:text-white font-medium">
                      {item.label}
                    </span>
                    <item.icon size={16} className="text-slate-500 group-hover:text-blue-400" />
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default NexusPortal;