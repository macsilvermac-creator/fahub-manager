import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

/** * PROTOCOLO NEXUS - INTEGRAÇÃO MASTER
 * Restauração da Placa-Mãe do Sistema. 
 * Todos os módulos operacionais conectados ao HUD da Presidência.
 */

// Módulos de Gestão de Ativos
import FinanceConsolidated from './modules/finance/FinanceConsolidated';
import CalendarMaster from './modules/calendar/CalendarMaster';
import StrategyKanban from './modules/strategy/StrategyKanban';
import HumanCapital from './modules/people/HumanCapital';
import MemberProfile360 from './modules/people/MemberProfile360';
import EntitySettings from './modules/settings/EntitySettings';

// Dashboard Central (Nexus Hub)
import Dashboard from './pages/Dashboard';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Ponto de Entrada Nexus */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        
        {/* Pilares Operacionais Ligados */}
        <Route path="/financeiro" element={<FinanceConsolidated />} />
        <Route path="/agenda" element={<CalendarMaster />} />
        <Route path="/estrategia" element={<StrategyKanban />} />
        
        {/* Gestão de Patrimônio Humano e Ficha 360 */}
        <Route path="/human-capital" element={<HumanCapital />} />
        <Route path="/perfil-membro" element={<MemberProfile360 />} />
        
        {/* Parâmetros e Unidades */}
        <Route path="/configuracoes" element={<EntitySettings />} />
        
        {/* Redirecionamento de Segurança Protocolo Nexus */}
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
};

export default App;