import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

/** * PROTOCOLO NEXUS - INFRAESTRUTURA DE ALTA DISPONIBILIDADE
 * Arquivo Mestre de Roteamento e Injeção de Módulos
 */

// 1. Módulos Core (Sistemas Centrais)
import NexusPortal from './modules/nexus/NexusPortal';
import Dashboard from './modules/dashboard/Dashboard'; 

// 2. Módulos Operacionais (Logística e Fluxo)
import FinanceConsolidated from './modules/finance/FinanceConsolidated';
import CalendarMaster from './modules/calendar/CalendarMaster';

// 3. Módulos de Pessoas (Capital Humano)
import HumanCapital from './modules/people/HumanCapital';
import MemberProfile360 from './modules/people/MemberProfile360';
import AthletesList from './modules/athletes/AthletesList';

// 4. Módulo de Recrutamento (Ingresso e Seleção)
import TryoutLab from './modules/tryout/TryoutLab';

// 5. Módulos de Marketing (Expansão e Marca)
import CreativeLab from './modules/marketing/CreativeLab';
import MarketingProjectsGoals from './modules/marketing/MarketingProjectsGoals';

// 6. Módulos Comerciais (CCO - Revenue Tracking)
import SponsorLab from './modules/commercial/SponsorLab';

// 7. Infraestrutura e Configurações
import EntitySettings from './modules/settings/EntitySettings';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* ENTRADA MASTER: SELEÇÃO DE PERSONAS */}
        <Route path="/" element={<NexusPortal />} />
        
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
        
        {/* LABORATÓRIOS DE DESENVOLVIMENTO (LABS) */}
        <Route path="/tryout-lab" element={<TryoutLab />} />
        <Route path="/creative-lab" element={<CreativeLab />} />
        <Route path="/sponsor-lab" element={<SponsorLab />} />
        <Route path="/marketing/projetos-metas" element={<MarketingProjectsGoals />} />
        
        {/* PROTOCOLO DE REDIRECIONAMENTO DE SEGURANÇA */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;