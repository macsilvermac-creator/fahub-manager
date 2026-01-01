import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

/** * PROTOCOLO NEXUS - CENTRAL DE COMANDO
 * Este arquivo conecta o Portal de Simulação aos módulos reais.
 */

// Importações dos Pontos de Controle (Ajuste os caminhos se necessário)
import NexusPortal from './pages/NexusPortal'; 
import Dashboard from './pages/Dashboard';

// Módulos Operacionais de Perspectiva
import FinanceConsolidated from './modules/finance/FinanceConsolidated';
import CalendarMaster from './modules/calendar/CalendarMaster';
import HumanCapital from './modules/people/HumanCapital';
import MemberProfile360 from './modules/people/MemberProfile360';
import EntitySettings from './modules/settings/EntitySettings';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Ponto de Partida: Portal Nexus para troca de Skin e Persona */}
        <Route path="/" element={<NexusPortal />} />
        
        {/* Perspectivas Operacionais Reais para Teste de Stress */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/financeiro" element={<FinanceConsolidated />} />
        <Route path="/agenda" element={<CalendarMaster />} />
        <Route path="/human-capital" element={<HumanCapital />} />
        <Route path="/perfil-membro" element={<MemberProfile360 />} />
        <Route path="/configuracoes" element={<EntitySettings />} />
        
        {/* Proteção de Rota: Sempre retorna ao Nexus em caso de erro */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;