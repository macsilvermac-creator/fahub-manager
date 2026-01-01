import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import NexusPortal from './modules/nexus/NexusPortal'; // O Portal que acabamos de restaurar
import DashboardMaster from './modules/dashboard/DashboardMaster';
import StrategyKanban from './modules/strategy/StrategyKanban';
import FinanceConsolidated from './modules/finance/FinanceConsolidated';
import HumanCapital from './modules/people/HumanCapital';
import TeamSupervision from './modules/operations/TeamSupervision';
import MemberProfile360 from './modules/people/MemberProfile360';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* A Raiz agora é o Nexus Portal, conforme a imagem solicitada */}
        <Route path="/" element={<NexusPortal />} />
        
        {/* Dashboard da Presidência */}
        <Route path="/dashboard" element={<DashboardMaster />} />

        {/* Subpáginas Master */}
        <Route path="/estrategia" element={<StrategyKanban />} />
        <Route path="/financeiro" element={<FinanceConsolidated />} />
        <Route path="/patrimonio" element={<HumanCapital />} />
        <Route path="/operacoes" element={<TeamSupervision />} />
        <Route path="/perfil-membro" element={<MemberProfile360 />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;