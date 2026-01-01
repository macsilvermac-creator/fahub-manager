import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Importações com caminhos validados para o Protocolo FAHUB
import DashboardMaster from './modules/dashboard/DashboardMaster';
import StrategyKanban from './modules/strategy/StrategyKanban';
import FinanceConsolidated from './modules/finance/FinanceConsolidated';
import HumanCapital from './modules/people/HumanCapital';
import TeamSupervision from './modules/operations/TeamSupervision';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Redirecionamento inicial para a visão da Presidência */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        
        {/* Rota do Dashboard Master (A visão de 4 contêineres) */}
        <Route path="/dashboard" element={<DashboardMaster />} />

        {/* Rotas das Subpáginas Operacionais e Estratégicas */}
        <Route path="/estrategia" element={<StrategyKanban />} />
        <Route path="/financeiro" element={<FinanceConsolidated />} />
        <Route path="/patrimonio" element={<HumanCapital />} />
        <Route path="/operacoes" element={<TeamSupervision />} />

        {/* Fallback para evitar erro de página não encontrada */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
};

export default App;