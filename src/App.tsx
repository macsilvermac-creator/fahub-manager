import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Importações dos Módulos do Protocolo FAHUB
import DashboardMaster from './modules/dashboard/DashboardMaster';
import StrategyKanban from './modules/strategy/StrategyKanban';
import FinanceConsolidated from './modules/finance/FinanceConsolidated';
import HumanCapital from './modules/people/HumanCapital';
import TeamSupervision from './modules/operations/TeamSupervision';
import MemberProfile360 from './modules/people/MemberProfile360';

/**
 * App.tsx - Controlador Central de Rotas
 * Define a hierarquia de navegação da Persona Master (Presidência)
 */
const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Redirecionamento Inicial: Garante que o usuário caia no Dashboard Master */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        
        {/* Rota Principal: Dashboard Master (Cockpit de 4 Contêineres) */}
        <Route path="/dashboard" element={<DashboardMaster />} />

        {/* Módulo de Evolução Estratégica (Kanban de Metas) */}
        <Route path="/estrategia" element={<StrategyKanban />} />

        {/* Módulo Financeiro Consolidado (Saúde Financeira) */}
        <Route path="/financeiro" element={<FinanceConsolidated />} />

        {/* Módulo de Patrimônio Humano (Censo de Atletas) */}
        <Route path="/patrimonio" element={<HumanCapital />} />

        {/* Módulo de Supervisão Operacional (Relatórios dos HCs) */}
        <Route path="/operacoes" element={<TeamSupervision />} />

        {/* Ficha Individual 360º (Detalhe Profundo de Membro/Atleta) */}
        <Route path="/perfil-membro" element={<MemberProfile360 />} />

        {/* Rota de Fallback: Se a URL não existir, volta para o Dashboard */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
};

export default App;