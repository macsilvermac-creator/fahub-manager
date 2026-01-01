import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// Importação dos Módulos Operacionais que consolidamos
import FinanceConsolidated from './modules/finance/FinanceConsolidated';
import CalendarMaster from './modules/calendar/CalendarMaster';
import StrategyKanban from './modules/strategy/StrategyKanban';
import HumanCapital from './modules/people/HumanCapital';
import MemberProfile360 from './modules/people/MemberProfile360';
import EntitySettings from './modules/settings/EntitySettings';
import Dashboard from './pages/Dashboard'; // Sua página principal

const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        {/* Rota Raiz */}
        <Route path="/dashboard" element={<Dashboard />} />
        
        {/* Rotas da Persona Master - Ligação Operacional */}
        <Route path="/financeiro" element={<FinanceConsolidated />} />
        <Route path="/agenda" element={<CalendarMaster />} />
        <Route path="/estrategia" element={<StrategyKanban />} />
        <Route path="/human-capital" element={<HumanCapital />} />
        <Route path="/perfil-membro" element={<MemberProfile360 />} />
        <Route path="/configuracoes" element={<EntitySettings />} />
        
        {/* Redirecionamento de segurança */}
        <Route path="*" element={<Dashboard />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;