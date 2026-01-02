import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// 1. CORE
import NexusPortal from './modules/nexus/NexusPortal';
import Dashboard from './modules/dashboard/Dashboard'; 

// 2. FINANCEIRO
import FinanceConsolidated from './modules/finance/FinanceConsolidated';
import FinancePayables from './modules/finance/FinancePayables';
import FinanceReceivables from './modules/finance/FinanceReceivables';
import FinanceCashFlow from './modules/finance/FinanceCashFlow';
import FinancePatrimony from './modules/finance/FinancePatrimony';
import BillingFactory from './modules/finance/BillingFactory';

// 3. CAPITAL HUMANO
import HumanCapital from './modules/people/HumanCapital';
import MemberProfile360 from './modules/people/MemberProfile360';
import AthletesList from './modules/athletes/AthletesList'; 

// 4. COMERCIAL (OS NOVOS ARQUIVOS)
import CommercialDashboard from './modules/commercial/CommercialDashboard';
import SponsorLab from './modules/commercial/SponsorLab';

// 5. MARKETING & OUTROS
import CreativeLab from './modules/marketing/CreativeLab'; 
import MarketingProjectsGoals from './modules/marketing/MarketingProjectsGoals';
import TryoutLab from './modules/tryout/TryoutLab';
import EntitySettings from './modules/settings/EntitySettings';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* PORTAL INICIAL */}
        <Route path="/" element={<NexusPortal />} />
        <Route path="/dashboard" element={<Dashboard />} />
        
        {/* ROTAS FINANCEIRAS */}
        <Route path="/financeiro" element={<FinanceConsolidated />} />
        <Route path="/financeiro/fluxo" element={<FinanceCashFlow />} />
        <Route path="/financeiro/receber" element={<FinanceReceivables />} />
        <Route path="/financeiro/pagar" element={<FinancePayables />} />
        <Route path="/financeiro/patrimonio" element={<FinancePatrimony />} />
        <Route path="/financeiro/factory" element={<BillingFactory />} />
        
        {/* ROTAS DE CAPITAL HUMANO */}
        <Route path="/human-capital" element={<HumanCapital />} />
        <Route path="/perfil-membro" element={<MemberProfile360 />} />
        <Route path="/elenco" element={<AthletesList />} />
        
        {/* ROTAS COMERCIAIS (VALIDAÇÃO AQUI) */}
        <Route path="/comercial" element={<CommercialDashboard />} />
        <Route path="/comercial/sponsor-lab" element={<SponsorLab />} />
        
        {/* ROTAS DE MARKETING E CONFIGURAÇÕES */}
        <Route path="/creative-lab" element={<CreativeLab />} />
        <Route path="/marketing/projetos-metas" element={<MarketingProjectsGoals />} />
        <Route path="/tryout-lab" element={<TryoutLab />} />
        <Route path="/configuracoes" element={<EntitySettings />} />

        {/* FALLBACK */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;