import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Importações dos Módulos Master e Nexus
import NexusPortal from './modules/nexus/NexusPortal';
import DashboardMaster from './modules/dashboard/DashboardMaster';
import StrategyKanban from './modules/strategy/StrategyKanban';
import FinanceConsolidated from './modules/finance/FinanceConsolidated';
import HumanCapital from './modules/people/HumanCapital';
import TeamSupervision from './modules/operations/TeamSupervision';
import MemberProfile360 from './modules/people/MemberProfile360';

/**
 * App.tsx - Arquitetura Nexus
 * O Portal Nexus é a visão exclusiva do Gestor para simulação e validação.
 */
const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Ponto de partida exclusivo do Gestor: Visão Nexus */}
        <Route path="/" element={<NexusPortal />} />
        
        {/* Rotas Reais para Validação de Telas e Funcionalidades */}
        <Route path="/dashboard" element={<DashboardMaster />} />
        <Route path="/estrategia" element={<StrategyKanban />} />
        <Route path="/financeiro" element={<FinanceConsolidated />} />
        <Route path="/patrimonio" element={<HumanCapital />} />
        <Route path="/operacoes" element={<TeamSupervision />} />
        <Route path="/perfil-membro" element={<MemberProfile360 />} />

        {/* Fallback de Segurança para o Nexus */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;