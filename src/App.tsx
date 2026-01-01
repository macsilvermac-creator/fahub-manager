import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

/** 
 * PROTOCOLO NEXUS - INFRAESTRUTURA DE ALTA DISPONIBILIDADE
 * Estrutura mapeada conforme árvore de arquivos (modules/...)
 */

// 1. Módulos Core (Nexus e Dashboard)
import NexusPortal from './modules/nexus/NexusPortal';
import Dashboard from './modules/dashboard/Dashboard'; 
// Obs: Vi que existe um 'DashboardMaster.tsx'. Se 'Dashboard.tsx' for apenas um componente interno,
// troque a linha acima por: import Dashboard from './modules/dashboard/DashboardMaster';

// 2. Módulos Operacionais - Financeiro & Agenda
import FinanceConsolidated from './modules/finance/FinanceConsolidated';
import CalendarMaster from './modules/calendar/CalendarMaster';

// 3. Módulos de Pessoas (Capital Humano)
import HumanCapital from './modules/people/HumanCapital';
import MemberProfile360 from './modules/people/MemberProfile360';

// 4. Configurações
import EntitySettings from './modules/settings/EntitySettings';

// Nota: Vi nos prints módulos extras como 'operations', 'strategy' e 'athletes'.
// Não os incluí nas rotas ainda para não quebrar o que já existia, mas podemos adicionar depois.

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* COMANDO CENTRAL */}
        <Route path="/" element={<NexusPortal />} />
        
        {/* ROTAS OPERACIONAIS */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/financeiro" element={<FinanceConsolidated />} />
        <Route path="/agenda" element={<CalendarMaster />} />
        
        {/* GESTÃO DE PESSOAS */}
        <Route path="/human-capital" element={<HumanCapital />} />
        <Route path="/perfil-membro" element={<MemberProfile360 />} />
        
        {/* SISTEMA */}
        <Route path="/configuracoes" element={<EntitySettings />} />
        
        {/* CINTURÃO DE SEGURANÇA (Redireciona erros 404 para a Home) */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;