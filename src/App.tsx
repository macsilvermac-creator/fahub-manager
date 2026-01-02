import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// 1. Módulos Core
import NexusPortal from './modules/nexus/NexusPortal';
import Dashboard from './modules/dashboard/Dashboard'; 

// 2. Módulos Financeiros (Dashboard + Operacional)
import FinanceConsolidated from './modules/finance/FinanceConsolidated';
import FinancePayables from './modules/finance/FinancePayables';
import FinanceReceivables from './modules/finance/FinanceReceivables'; // Nova Subpágina

// 3. Outros Módulos Preservados
import HumanCapital from './modules/people/HumanCapital';
import MemberProfile360 from './modules/people/MemberProfile360';
import AthletesList from './modules/athletes/AthletesList'; 
import TryoutLab from './modules/tryout/TryoutLab';
import EntitySettings from './modules/settings/EntitySettings';
import CreativeLab from './modules/marketing/CreativeLab'; 
import MarketingProjectsGoals from './modules/marketing/MarketingProjectsGoals';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<NexusPortal />} />
        <Route path="/dashboard" element={<Dashboard />} />
        
        {/* NAVEGAÇÃO FINANCEIRA ATIVA */}
        <Route path="/financeiro" element={<FinanceConsolidated />} />
        <Route path="/financeiro/pagar" element={<FinancePayables />} />
        <Route path="/financeiro/receber" element={<FinanceReceivables />} />
        
        {/* Redirecionam para o dashboard enquanto as outras 2 subpáginas não são criadas */}
        <Route path="/financeiro/fluxo" element={<FinanceConsolidated />} />
        <Route path="/financeiro/patrimonio" element={<FinanceConsolidated />} />

        <Route path="/human-capital" element={<HumanCapital />} />
        <Route path="/perfil-membro" element={<MemberProfile360 />} />
        <Route path="/elenco" element={<AthletesList />} />
        <Route path="/tryout-lab" element={<TryoutLab />} />
        <Route path="/creative-lab" element={<CreativeLab />} />
        <Route path="/marketing/projetos-metas" element={<MarketingProjectsGoals />} />
        <Route path="/configuracoes" element={<EntitySettings />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;