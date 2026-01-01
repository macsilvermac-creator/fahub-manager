import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

/** * PROTOCOLO NEXUS - PLACA-MÃE DO SISTEMA
 * Ponto de entrada para simulação de personas e validação de skins.
 */

// Importação dos componentes de página conforme a estrutura de diretórios definida
import NexusPortal from './pages/NexusPortal';
import Dashboard from './pages/Dashboard';

// Módulos operacionais integrados ao Portal Nexus
import FinanceConsolidated from './modules/finance/FinanceConsolidated';
import CalendarMaster from './modules/calendar/CalendarMaster';
import HumanCapital from './modules/people/HumanCapital';
import MemberProfile360 from './modules/people/MemberProfile360';
import EntitySettings from './modules/settings/EntitySettings';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Ponto Central de Simulação Master */}
        <Route path="/" element={<NexusPortal />} />
        
        {/* Ambientes Reais para Teste de Stress e Fluxo */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/financeiro" element={<FinanceConsolidated />} />
        <Route path="/agenda" element={<CalendarMaster />} />
        <Route path="/human-capital" element={<HumanCapital />} />
        <Route path="/perfil-membro" element={<MemberProfile360 />} />
        <Route path="/configuracoes" element={<EntitySettings />} />
        
        {/* Fallback de Segurança: Retorno obrigatório ao Nexus */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;