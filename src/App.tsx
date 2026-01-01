import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// IMPORTANTE: Garanta que esta importação aponte exatamente para o arquivo que criamos
import DashboardMaster from './modules/dashboard/DashboardMaster';
import StrategyKanban from './modules/strategy/StrategyKanban';
import FinanceConsolidated from './modules/finance/FinanceConsolidated';
import HumanCapital from './modules/people/HumanCapital';
import TeamSupervision from './modules/operations/TeamSupervision';

/**
 * Este é o controlador central. 
 * Ele garante que a URL "/dashboard" chame a nossa nova visão sólida de 4 contêineres.
 */
const AppRoutes: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Redireciona a raiz para o novo Dashboard Master */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        
        {/* A Rota Principal da Persona Master (Presidente) */}
        <Route path="/dashboard" element={<DashboardMaster />} />

        {/* Rotas das Subpáginas que compõem os 90% da Persona */}
        <Route path="/dashboard/financeiro" element={<FinanceConsolidated />} />
        <Route path="/dashboard/patrimonio" element={<HumanCapital />} />
        <Route path="/dashboard/estrategia" element={<StrategyKanban />} />
        <Route path="/dashboard/operacoes" element={<TeamSupervision />} />

        {/* Rota de segurança para evitar páginas brancas */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;