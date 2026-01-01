import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

/** * PROTOCOLO NEXUS - INFRAESTRUTURA DE ALTA DISPONIBILIDADE
 * Ponto de entrada master para troca de personas e validação de ambiente real.
 */

// Importações Master - Definidas como componentes padrão do diretório pages
import NexusPortal from './pages/NexusPortal';
import Dashboard from './pages/Dashboard';

// Módulos Operacionais - LEGO Funcional
import FinanceConsolidated from './modules/finance/FinanceConsolidated';
import CalendarMaster from './modules/calendar/CalendarMaster';
import HumanCapital from './modules/people/HumanCapital';
import MemberProfile360 from './modules/people/MemberProfile360';
import EntitySettings from './modules/settings/EntitySettings';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* O NexusPortal assume a posição de comando central (/) */}
        <Route path="/" element={<NexusPortal />} />
        
        {/* Rotas de Perspectiva para Testes de Stress e Fluxo */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/financeiro" element={<FinanceConsolidated />} />
        <Route path="/agenda" element={<CalendarMaster />} />
        <Route path="/human-capital" element={<HumanCapital />} />
        <Route path="/perfil-membro" element={<MemberProfile360 />} />
        <Route path="/configuracoes" element={<EntitySettings />} />
        
        {/* Redirecionamento de Segurança Protocolo Nexus */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;