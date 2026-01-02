import React from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * NEXUS PORTAL - CORE SYSTEM
 * Interface de Injeção de Contexto e Seleção de Personas (Skins).
 * 
 * Funcionalidade:
 * 1. Define a variável de sessão 'nexus_persona'.
 * 2. Redireciona para o módulo operacional correspondente.
 * 3. Permite validação vertical (End-to-End) de cada role.
 */
const NexusPortal: React.FC = () => {
  const navigate = useNavigate();

  // Função de "Login Simulado" - Injeta a Persona e Navega
  const selectPersona = (role: string, path: string) => {
    console.log(`[NEXUS PROTOCOL] Injetando Persona: ${role}`);
    // Salva quem estamos "fingindo" ser para validação das próximas telas
    localStorage.setItem('nexus_persona', role);
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-[#050510] text-white font-sans flex flex-col items-center justify-center p-8">
      
      {/* HEADER DO PORTAL */}
      <div className="text-center mb-16 animate-fade-in-down">
        <h1 className="text-6xl font-black italic tracking-tighter mb-4">
          FAHUB <span className="text-[#4338ca]">NEXUS</span>
        </h1>
        <p className="text-[#64748b] tracking-[0.4em] text-xs font-bold uppercase">
          Protocolo de Simulação Master Developer
        </p>
      </div>

      {/* GRID DE PERSONAS (4 COLUNAS) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 w-full max-w-7xl">
        
        {/* COLUNA 1: ENTIDADES */}
        <div className="flex flex-col gap-4">
          <h2 className="text-[#64748b] text-xs font-bold uppercase tracking-widest mb-2 pl-1">
            1. Entidades
          </h2>
          <div className="p-6 rounded-3xl border border-[#1e293b] bg-[#0f172a]/50 flex flex-col gap-3">
            <NexusButton label="Confederação" onClick={() => selectPersona('CONFEDERACAO', '/dashboard')} />
            <NexusButton label="† (Master)" onClick={() => selectPersona('MASTER', '/configuracoes')} special />
            <NexusButton label="Ligas" onClick={() => selectPersona('LIGA', '/dashboard')} />
            <NexusButton label="Equipe / Clubes" onClick={() => selectPersona('CLUBE', '/dashboard')} />
          </div>
        </div>

        {/* COLUNA 2: CONSELHO */}
        <div className="flex flex-col gap-4">
          <h2 className="text-[#475569] text-xs font-bold uppercase tracking-widest mb-2 pl-1">
            2. Conselho Administrativo
          </h2>
          <div className="p-6 rounded-3xl border border-[#1e293b] bg-[#0f172a]/50 flex flex-col gap-3">
            <NexusButton label="Presidente" onClick={() => selectPersona('PRESIDENTE', '/dashboard')} />
            <NexusButton label="Vice-presidente" onClick={() => selectPersona('VICE_PRES', '/dashboard')} />
            <NexusButton label="Diretor Executivo" onClick={() => selectPersona('DIRETOR', '/dashboard')} />
            <NexusButton label="Diretora Financeira" onClick={() => selectPersona('CFO', '/financeiro')} highlight="finance" />
            <NexusButton label="Diretor de Marketing" onClick={() => selectPersona('CMO', '/dashboard')} />
            <NexusButton label="Diretor Comercial" onClick={() => selectPersona('CCO', '/dashboard')} />
          </div>
        </div>

        {/* COLUNA 3: OPERACIONAL */}
        <div className="flex flex-col gap-4">
          <h2 className="text-[#ea580c] text-xs font-bold uppercase tracking-widest mb-2 pl-1">
            3. Operacional
          </h2>
          <div className="p-6 rounded-3xl border border-[#1e293b] bg-[#0f172a]/50 flex flex-col gap-3">
            <NexusButton label="HC (Head Coach)" onClick={() => selectPersona('HC', '/human-capital')} active />
            <NexusButton label="Cord. Ataque" onClick={() => selectPersona('COORD_ATQ', '/agenda')} />
            <NexusButton label="Cord. Defesa" onClick={() => selectPersona('COORD_DEF', '/agenda')} />
            <NexusButton label="Cord. ST" onClick={() => selectPersona('COORD_ST', '/agenda')} />
            <NexusButton label="Auxiliares de CT" onClick={() => selectPersona('AUX_CT', '/agenda')} />
            <NexusButton label="Funcionários" onClick={() => selectPersona('STAFF', '/dashboard')} />
          </div>
        </div>

        {/* COLUNA 4: USUÁRIOS */}
        <div className="flex flex-col gap-4">
          <h2 className="text-[#22c55e] text-xs font-bold uppercase tracking-widest mb-2 pl-1">
            4. Usuários
          </h2>
          <div className="p-6 rounded-3xl border border-[#1e293b] bg-[#0f172a]/50 flex flex-col gap-3">
            <NexusButton label="Atletas" onClick={() => selectPersona('ATHLETE', '/perfil-membro')} />
            <NexusButton label="Alunos" onClick={() => selectPersona('STUDENT', '/perfil-membro')} />
          </div>
        </div>

      </div>
    </div>
  );
};

// --- COMPONENTE AUXILIAR PARA OS BOTÕES (SKIN CYBERPUNK) ---

interface NexusButtonProps {
  label: string;
  onClick: () => void;
  active?: boolean;   // Se estiver true, mostra destacado
  special?: boolean;  // Para botões de sistema (como o †)
  highlight?: string; // Para cores especificas
}

const NexusButton: React.FC<NexusButtonProps> = ({ label, onClick, active, special, highlight }) => {
  // Estilo Base
  let baseClass = "w-full py-4 px-6 rounded-2xl text-sm font-bold tracking-wide transition-all duration-300 transform hover:scale-[1.02] active:scale-95 shadow-lg ";
  
  // Lógica de Cores (Styles)
  if (active) {
    // Estilo Roxo Neon (Destaque Ativo)
    baseClass += "bg-[#6366f1] text-white shadow-indigo-500/30 hover:bg-[#4f46e5]";
  } else if (special) {
    // Estilo Especial (Master/Admin)
    baseClass += "bg-[#0f172a] border border-[#334155] text-gray-400 hover:text-white hover:border-white";
  } else if (highlight === 'finance') {
     // Estilo sutil para financeiro
    baseClass += "bg-[#1e293b] text-gray-300 border border-transparent hover:border-emerald-500/50 hover:text-emerald-400 hover:bg-[#0f172a]";
  } else {
    // Estilo Padrão (Dark Button)
    baseClass += "bg-[#1e293b] text-gray-300 hover:bg-[#334155] hover:text-white hover:shadow-cyan-500/10";
  }

  return (
    <button onClick={onClick} className={baseClass}>
      {label}
    </button>
  );
};

export default NexusPortal;