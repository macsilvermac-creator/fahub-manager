import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

/** * PLACA-MÃE NEXUS - PROTOCOLO FAHUB
 * Centralização de Rotas e Perspectivas de Gestão.
 */

// 1. Módulos Core e Dashboard Principal
import NexusPortal from './modules/nexus/NexusPortal';
import Dashboard from './modules/dashboard/Dashboard'; 

// 2. Módulos Financeiros (Dashboard + Operacional + Billing Factory)
import FinanceConsolidated from './modules/finance/FinanceConsolidated';
import FinancePayables from './modules/finance/FinancePayables';
import FinanceReceivables from './modules/finance/FinanceReceivables';
import FinanceCashFlow from './modules/finance/FinanceCashFlow';
import FinancePatrimony from './modules/finance/FinancePatrimony';
import BillingFactory from './modules/finance/BillingFactory'; // Nova funcionalidade

// 3. Módulos de Pessoas e Capital Humano
import HumanCapital from './modules/people/HumanCapital';
import MemberProfile360 from './modules/people/MemberProfile360';
import AthletesList from './modules/athletes/AthletesList'; 

// 4. Módulos de Marketing e Tryout
import CreativeLab from './modules/marketing/CreativeLab'; 
import MarketingProjectsGoals from './modules/marketing/MarketingProjectsGoals';
import TryoutLab from './modules/tryout/TryoutLab';

// 5. Configurações de Entidade
import EntitySettings from './modules/settings/EntitySettings';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* PORTAL DE ENTRADA (Perspectivas) */}
        <Route path="/" element={<NexusPortal />} />
        
        {/* DASHBOARD GERAL */}
        <Route path="/dashboard" element={<Dashboard />} />
        
        {/* ECOSSISTEMA FINANCEIRO (Diretoria Financeira) */}
        <Route path="/financeiro" element={<FinanceConsolidated />} />
        <Route path="/financeiro/fluxo" element={<FinanceCashFlow />} />
        <Route path="/financeiro/receber" element={<FinanceReceivables />} />
        <Route path="/financeiro/pagar" element={<FinancePayables />} />
        <Route path="/financeiro/patrimonio" element={<FinancePatrimony />} />
        <Route path="/financeiro/factory" element={<BillingFactory />} />
        
        {/* ECOSSISTEMA DE PESSOAS E CAPITAL HUMANO */}
        <Route path="/human-capital" element={<HumanCapital />} />
        <Route path="/perfil-membro" element={<MemberProfile360 />} />
        <Route path="/elenco" element={<AthletesList />} />
        
        {/* ECOSSISTEMA DE MARKETING E EVENTOS */}
        <Route path="/creative-lab" element={<CreativeLab />} />
        <Route path="/marketing/projetos-metas" element={<MarketingProjectsGoals />} />
        <Route path="/tryout-lab" element={<TryoutLab />} />
        
        {/* CONFIGURAÇÕES DO CLUBE */}
        <Route path="/configuracoes" element={<EntitySettings />} />

        {/* REDIRECIONAMENTO DE SEGURANÇA */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;