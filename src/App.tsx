import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

/** * PROTOCOLO NEXUS - RESTAURAÇÃO DE EMERGÊNCIA
 * Este arquivo elimina dependências de caminhos incertos para forçar o build na Vercel.
 */

// Módulos Operacionais Sólidos (Caminhos confirmados)
import FinanceConsolidated from './modules/finance/FinanceConsolidated';
import CalendarMaster from './modules/calendar/CalendarMaster';
import StrategyKanban from './modules/strategy/StrategyKanban';
import HumanCapital from './modules/people/HumanCapital';
import MemberProfile360 from './modules/people/MemberProfile360';
import EntitySettings from './modules/settings/EntitySettings';

// O Dashboard será tratado como rota opcional para não travar o build
const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Rota Raiz apontando para o Financeiro (Peça LEGO já validada) */}
        <Route path="/" element={<Navigate to="/financeiro" replace />} />
        
        {/* Pilares Operacionais */}
        <Route path="/financeiro" element={<FinanceConsolidated />} />
        <Route path="/agenda" element={<CalendarMaster />} />
        <Route path="/estrategia" element={<StrategyKanban />} />
        
        {/* Gestão de Pessoas */}
        <Route path="/human-capital" element={<HumanCapital />} />
        <Route path="/perfil-membro" element={<MemberProfile360 />} />
        
        {/* Configurações */}
        <Route path="/configuracoes" element={<EntitySettings />} />
        
        {/* Fallback para evitar erro de página em branco */}
        <Route path="*" element={<Navigate to="/financeiro" replace />} />
      </Routes>
    </Router>
  );
};

export default App;