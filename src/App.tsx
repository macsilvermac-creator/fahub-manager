import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

/** 
 * PROTOCOLO NEXUS - INFRAESTRUTURA DE ALTA DISPONIBILIDADE
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

// 4. Módulo de Recrutamento
import TryoutLab from './modules/tryout/TryoutLab';

// 5. Configurações
import EntitySettings from './modules/settings/EntitySettings';

// 6. Módulos de Marketing
import CreativeLab from './modules/marketing/CreativeLab';
import MarketingProjectsGoals from './modules/marketing/MarketingProjectsGoals';

// 7. Módulos Comerciais (CCO)
import SponsorLab from './modules/commercial/SponsorLab'; // <--- NOVO IMPORT

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<NexusPortal />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/financeiro" element={<FinanceConsolidated />} />
        <Route path="/agenda" element={<CalendarMaster />} />
        <Route path="/human-capital" element={<HumanCapital />} />
        <Route path="/perfil-membro" element={<MemberProfile360 />} />
        <Route path="/elenco" element={<AthletesList />} />
        <Route path="/tryout-lab" element={<TryoutLab />} />
        <Route path="/creative-lab" element={<CreativeLab />} />
        <Route path="/marketing/projetos-metas" element={<MarketingProjectsGoals />} />
        
        {/* ROTA COMERCIAL */}
        <Route path="/sponsor-lab" element={<SponsorLab />} /> {/* <--- ROTA ATIVADA */}
        
        <Route path="/configuracoes" element={<EntitySettings />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;