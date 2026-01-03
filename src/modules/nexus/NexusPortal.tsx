import React from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * NEXUS PORTAL - CORE SYSTEM
 * Protocolo de Injeção de Persona e Seleção de Skins (DIR_ESPORTES Update)
 */
const NexusPortal: React.FC = () => {
  const navigate = useNavigate();

  // Função Master de Injeção de Contexto
  const selectPersona = (role: string, path: string) => {
    console.log(`[NEXUS PROTOCOL] Injetando Persona: ${role}`);
    localStorage.setItem('nexus_persona', role);
    navigate(path);
  };

  return (
    <div className="min-h-screen bg-[#050510] text-white font-sans flex flex-col items-center justify-center p-8 selection:bg-indigo-500/30">
      
      {/* HEADER DO PORTAL NEXUS */}
      <div className="text-center mb-16 animate-in fade-in slide-in-from-top-4 duration-1000">
        <h1 className="text-6xl font-black italic tracking-tighter mb-4 uppercase">
          FAHUB <span className="text-[#4338ca]">NEXUS</span>
        </h1>
        <p className="text-[#64748b] tracking-[0.4em] text-[10px] font-black uppercase">
          Protocolo de Simulação Master Developer • v7.2
        </p>
      </div>

      {/* GRID DE PERSONAS (4 COLUNAS OPERACIONAIS) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 w-full max-w-7xl">
        
        {/* COLUNA 1: ENTIDADES */}
        <div className="flex flex-col gap-4">
          <h2 className="text-[#64748b] text-[10px] font-black uppercase tracking-[0.3em] mb-2 pl-1 italic">
            01. Entidades
          </h2>
          <div className="p-6 rounded-[2rem] border border-white/5 bg-[#0f172a]/50 backdrop-blur-sm flex flex-col gap-3">
            <NexusButton label="Confederação" onClick={() => selectPersona('CONFEDERACAO', '/dashboard')} />
            <NexusButton label="† (Master)" onClick={() => selectPersona('MASTER', '/configuracoes')} special />
            <NexusButton label="Ligas" onClick={() => selectPersona('LIGA', '/dashboard')} />
            <NexusButton label="Equipe / Clubes" onClick={() => selectPersona('CLUBE', '/dashboard')} />
          </div>
        </div>

        {/* COLUNA 2: CONSELHO ADMINISTRATIVO (DIRETOR DE ESPORTES INJETADO) */}
        <div className="flex flex-col gap-4">
          <h2 className="text-[#475569] text-[10px] font-black uppercase tracking-[0.3em] mb-2 pl-1 italic font-bold">
            02. Conselho Adm
          </h2>
          <div className="p-6 rounded-[2rem] border border-white/5 bg-[#0f172a]/50 backdrop-blur-sm flex flex-col gap-3">
            <NexusButton label="Presidente" onClick={() => selectPersona('PRESIDENTE', '/dashboard')} />
            <NexusButton label="Vice-presidente" onClick={() => selectPersona('VICE_PRES', '/dashboard')} />
            
            {/* ATUALIZAÇÃO DA PERSONA: DIRETOR DE ESPORTES */}
            <NexusButton 
              label="Dir. de Esportes" 
              onClick={() => selectPersona('DIR_ESPORTES', '/dashboard')} 
              highlight="sports"
              active
            />
            
            <NexusButton label="Diretor de Marketing" onClick={() => selectPersona('CMO', '/dashboard')} />
            <NexusButton label="Diretor Comercial" onClick={() => selectPersona('CCO', '/dashboard')} />
          </div>
        </div>

        {/* COLUNA 3: OPERACIONAL */}
        <div className="flex flex-col gap-4">
          <h2 className="text-[#ea580c] text-[10px] font-black uppercase tracking-[0.3em] mb-2 pl-1 italic font-bold">
            03. Operacional
          </h2>
          <div className="p-6 rounded-[2rem] border border-white/5 bg-[#0f172a]/50 backdrop-blur-sm flex flex-col gap-3">
            <NexusButton label="HC (Head Coach)" onClick={() => selectPersona('HC', '/human-capital')} />
            <NexusButton label="Coord. Ataque" onClick={() => selectPersona('COORD_ATQ', '/agenda')} />
            <NexusButton label="Coord. Defesa" onClick={() => selectPersona('COORD_DEF', '/agenda')} />
            <NexusButton label="Coord. ST" onClick={() => selectPersona('COORD_ST', '/agenda')} />
            <NexusButton label="Auxiliares de CT" onClick={() => selectPersona('AUX_CT', '/agenda')} />
          </div>
        </div>

        {/* COLUNA 4: USUÁRIOS */}
        <div className="flex flex-col gap-4">
          <h2 className="text-[#22c55e] text-[10px] font-black uppercase tracking-[0.3em] mb-2 pl-1 italic font-bold">
            04. Usuários
          </h2>
          <div className="p-6 rounded-[2rem] border border-white/5 bg-[#0f172a]/50 backdrop-blur-sm flex flex-col gap-3">
            <NexusButton label="Atletas" onClick={() => selectPersona('ATHLETE', '/perfil-membro')} />
            <NexusButton label="Alunos" onClick={() => selectPersona('STUDENT', '/perfil-membro')} />
          </div>
        </div>

      </div>
    </div>
  );
};

// --- COMPONENTE AUXILIAR PADRONIZADO (SKIN CYBERPUNK) ---

interface NexusButtonProps {
  label: string;
  onClick: () => void;
  active?: boolean; 
  special?: boolean;
  highlight?: 'sports' | 'finance' | string;
}

const NexusButton: React.FC<NexusButtonProps> = ({ label, onClick, active, special, highlight }) => {
  let baseClass = "w-full py-4 px-6 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-300 transform hover:scale-[1.02] active:scale-95 shadow-lg border ";
  
  if (active || highlight === 'sports') {
    // Estilo Indigo Neon (Novo Padrão Diretor de Esportes)
    baseClass += "bg-[#4338ca] text-white border-indigo-400/50 shadow-indigo-500/20 hover:bg-[#3730a3]";
  } else if (special) {
    // Estilo Master Admin
    baseClass += "bg-[#0f172a] border-white/20 text-slate-400 hover:text-white hover:border-white shadow-none";
  } else {
    // Estilo Dark Padrão
    baseClass += "bg-[#1e293b] border-white/5 text-slate-400 hover:bg-[#334155] hover:text-white shadow-black/20";
  }

  return (
    <button onClick={onClick} className={baseClass}>
      {label}
    </button>
  );
};

export default NexusPortal;