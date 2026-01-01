import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Importação dos Módulos Operacionais que consolidamos e validamos
import FinanceConsolidated from './modules/finance/FinanceConsolidated';
import CalendarMaster from './modules/calendar/CalendarMaster';
import StrategyKanban from './modules/strategy/StrategyKanban';
import HumanCapital from './modules/people/HumanCapital';
import MemberProfile360 from './modules/people/MemberProfile360';
import EntitySettings from './modules/settings/EntitySettings';

/**
 * App Roteamento Master - Protocolo FAHUB
 * Centralização de rotas operacionais com verificação de caminhos.
 */
const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Rota Raiz Temporária para evitar erro TS2307 */}
        <Route path="/" element={<Navigate to="/financeiro" replace />} />
        
        {/* Rotas da Persona Master - Ligação Operacional Concluída */}
        <Route path="/financeiro" element={<FinanceConsolidated />} />
        <Route path="/agenda" element={<CalendarMaster />} />
        <Route path="/estrategia" element={<StrategyKanban />} />
        <Route path="/human-capital" element={<HumanCapital />} />
        <Route path="/perfil-membro" element={<MemberProfile360 />} />
        <Route path="/configuracoes" element={<EntitySettings />} />
        
        {/* Fallback de Segurança */}
        <Route path="*" element={<Navigate to="/financeiro" replace />} />
      </Routes>
    </Router>
  );
};

export default App;