import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

/** * PROTOCOLO NEXUS - INFRAESTRUTURA MASTER
 * Ponto de entrada central para validação de fluxos, personas e stress visual.
 */

// Importações Mandatárias das Páginas de Controle
import NexusPortal from './pages/NexusPortal';
import Dashboard from './pages/Dashboard';

// Módulos Operacionais de Perspectiva
import FinanceConsolidated from './modules/finance/FinanceConsolidated';
import CalendarMaster from './modules/calendar/CalendarMaster';
import HumanCapital from './modules/people/HumanCapital';
import MemberProfile360 from './modules/people/MemberProfile360';
import EntitySettings from './modules/settings/EntitySettings';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Rota Raiz: Portal Nexus para troca de Skin e Persona */}
        <Route path="/" element={<NexusPortal />} />
        
        {/* Perspectivas Reais de Gestão para Análise e Teste */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/financeiro" element={<FinanceConsolidated />} />
        <Route path="/agenda" element={<CalendarMaster />} />
        <Route path="/human-capital" element={<HumanCapital />} />
        <Route path="/perfil-membro" element={<MemberProfile360 />} />
        <Route path="/configuracoes" element={<EntitySettings />} />
        
        {/* Fallback de Segurança: Retorno ao Ponto de Simulação Master */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;