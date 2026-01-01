import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import NexusPortal from './modules/nexus/NexusPortal';
import DashboardMaster from './modules/dashboard/DashboardMaster';
import StrategyKanban from './modules/strategy/StrategyKanban';
import FinanceConsolidated from './modules/finance/FinanceConsolidated';
import HumanCapital from './modules/people/HumanCapital';
import TeamSupervision from './modules/operations/TeamSupervision';
import MemberProfile360 from './modules/people/MemberProfile360';
import CalendarMaster from './modules/calendar/CalendarMaster'; // Peça nova encaixada

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<NexusPortal />} />
        <Route path="/dashboard" element={<DashboardMaster />} />
        <Route path="/agenda" element={<CalendarMaster />} /> {/* Rota ativada */}
        <Route path="/estrategia" element={<StrategyKanban />} />
        <Route path="/financeiro" element={<FinanceConsolidated />} />
        <Route path="/patrimonio" element={<HumanCapital />} />
        <Route path="/operacoes" element={<TeamSupervision />} />
        <Route path="/perfil-membro" element={<MemberProfile360 />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;