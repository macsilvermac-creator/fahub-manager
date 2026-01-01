import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

/** * PROTOCOLO NEXUS - PLACA-MÃE RESTAURADA
 * Este arquivo restabelece o Portal Nexus como o seletor de personas e skins.
 */

// Ponto de Controle Master (O que foi retirado indevidamente)
import NexusPortal from './pages/NexusPortal';

// Módulos de Perspectiva e Operação
import Dashboard from './pages/Dashboard';
import FinanceConsolidated from './modules/finance/FinanceConsolidated';
import CalendarMaster from './modules/calendar/CalendarMaster';
import HumanCapital from './modules/people/HumanCapital';
import MemberProfile360 from './modules/people/MemberProfile360';
import EntitySettings from './modules/settings/EntitySettings';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Rota Raiz: O Portal Nexus agora volta a ser a sua Central de Comando */}
        <Route path="/" element={<NexusPortal />} />
        
        {/* Rotas de Destino para Teste de Stress e Fluxo */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/financeiro" element={<FinanceConsolidated />} />
        <Route path="/agenda" element={<CalendarMaster />} />
        <Route path="/human-capital" element={<HumanCapital />} />
        <Route path="/perfil-membro" element={<MemberProfile360 />} />
        <Route path="/configuracoes" element={<EntitySettings />} />
        
        {/* Fallback de Segurança: Retorna sempre ao Nexus para garantir o controle */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;