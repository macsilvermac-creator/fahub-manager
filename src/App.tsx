import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import DashboardLayout from './shared/components/layouts/DashboardLayout';

/** 
 * PROTOCOLO NEXUS - APP ROUTER V2
 * Integração total com DashboardLayout para consistência visual.
 */

// 1. Módulos Core
import NexusPortal from './modules/nexus/NexusPortal';
import Dashboard from './modules/dashboard/Dashboard'; 

// 2. Módulos Operacionais
import FinanceConsolidated from './modules/finance/FinanceConsolidated';
import CalendarMaster from './modules/calendar/CalendarMaster';

// 3. Módulos de Pessoas
import HumanCapital from './modules/people/HumanCapital';
import MemberProfile360 from './modules/people/MemberProfile360';
import AthletesList from './modules/athletes/AthletesList';

// 4. Laboratórios & Labs
import TryoutLab from './modules/tryout/TryoutLab';
import CreativeLab from './modules/marketing/CreativeLab';
import MarketingProjectsGoals from './modules/marketing/MarketingProjectsGoals';
import SponsorLab from './modules/commercial/SponsorLab';

// 5. Configurações
import EntitySettings from './modules/settings/EntitySettings';

// WRAPPER DE PROTEÇÃO E LAYOUT
// Este componente força o Layout em todas as rotas internas
const NexusLayoutWrapper = () => {
  // Aqui poderíamos verificar se existe 'nexus_persona'
  // Se não existir, redirecionar para Login
  const isAuthenticated = !!localStorage.getItem('nexus_persona');
  
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return (
    <DashboardLayout pageTitle="FAHUB NEXUS">
      <Outlet /> {/* Aqui renderiza a página filha (Dashboard, Financeiro, etc) */}
    </DashboardLayout>
  );
};

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* ROTA PÚBLICA: PORTAL DE SELEÇÃO (LOGIN) */}
        <Route path="/" element={<NexusPortal />} />
        
        {/* ROTAS PROTEGIDAS (DENTRO DO LAYOUT) */}
        <Route element={<NexusLayoutWrapper />}>
            
            {/* NÓDULOS DE COMANDO */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/configuracoes" element={<EntitySettings />} />
            
            {/* NÓDULOS FINANCEIROS E LOGÍSTICOS */}
            <Route path="/financeiro" element={<FinanceConsolidated />} />
            <Route path="/agenda" element={<CalendarMaster />} />
            
            {/* GESTÃO DE CAPITAL HUMANO */}
            <Route path="/human-capital" element={<HumanCapital />} />
            <Route path="/perfil-membro" element={<MemberProfile360 />} />
            <Route path="/elenco" element={<AthletesList />} />
            
            {/* LABORATÓRIOS (LABS) */}
            <Route path="/tryout-lab" element={<TryoutLab />} />
            <Route path="/creative-lab" element={<CreativeLab />} />
            <Route path="/sponsor-lab" element={<SponsorLab />} />
            <Route path="/marketing/projetos-metas" element={<MarketingProjectsGoals />} />

        </Route>

        {/* CATCH-ALL: Redireciona para o Portal se a rota não existir */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;