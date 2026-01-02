import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

/** * PROTOCOLO NEXUS - INFRAESTRUTURA DE ALTA DISPONIBILIDADE
 * Estrutura mapeada conforme árvore de arquivos consolidada.
 */

// 1. Módulos Core (Nexus e Dashboard)
import NexusPortal from './modules/nexus/NexusPortal';
import Dashboard from './modules/dashboard/Dashboard'; 

// 2. Módulos Operacionais - Financeiro & Agenda
import FinanceConsolidated from './modules/finance/FinanceConsolidated';
import CalendarMaster from './modules/calendar/CalendarMaster';

// 3. Módulos de Pessoas (Capital Humano)
import HumanCapital from './modules/people/HumanCapital';
import MemberProfile360 from './modules/people/MemberProfile360';
import AthletesList from './modules/athletes/AthletesList'; 

// 4. Módulo de Recrutamento (Tryout Lab)
import TryoutLab from './modules/tryout/TryoutLab';

// 5. Configurações
import EntitySettings from './modules/settings/EntitySettings';

// 6. Módulos de Marketing
import CreativeLab from './modules/marketing/CreativeLab'; 
import MarketingProjectsGoals from './modules/marketing/MarketingProjectsGoals';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* COMANDO CENTRAL: Seletor de Personas e Skins */}
        <Route path="/" element={<NexusPortal />} />
        
        {/* ROTAS OPERACIONAIS */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/financeiro" element={<FinanceConsolidated />} />
        <Route path="/agenda" element={<CalendarMaster />} />
        
        {/* GESTÃO DE PESSOAS */}
        <Route path="/human-capital" element={<HumanCapital />} />
        <Route path="/perfil-membro" element={<MemberProfile360 />} />
        <Route path="/elenco" element={<AthletesList />} />
        
        {/* RECRUTAMENTO E SELEÇÃO */}
        <Route path="/tryout-lab" element={<TryoutLab />} />
        
        {/* MARKETING: Hub Criativo e Gestão de Metas */}
        <Route path="/creative-lab" element={<CreativeLab />} />
        <Route path="/marketing/projetos-metas" element={<MarketingProjectsGoals />} />
        
        {/* SISTEMA */}
        <Route path="/configuracoes" element={<EntitySettings />} />
        
        {/* CINTURÃO DE SEGURANÇA: Redireciona falhas para o Nexus */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;