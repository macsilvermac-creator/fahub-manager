import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// imports Core
import NexusPortal from './modules/nexus/NexusPortal';
import Dashboard from './modules/dashboard/Dashboard'; 

// imports Financeiro (Dashboard + 4 Subpáginas Reais)
import FinanceConsolidated from './modules/finance/FinanceConsolidated';
import FinancePayables from './modules/finance/FinancePayables';
import FinanceReceivables from './modules/finance/FinanceReceivables';
import FinanceCashFlow from './modules/finance/FinanceCashFlow'; // Adicionado
import FinancePatrimony from './modules/finance/FinancePatrimony'; // Adicionado

// ... Outros imports preservados conforme Protocolo Nexus

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<NexusPortal />} />
        <Route path="/dashboard" element={<Dashboard />} />
        
        {/* FINANCEIRO OPERACIONAL COMPLETO */}
        <Route path="/financeiro" element={<FinanceConsolidated />} />
        <Route path="/financeiro/fluxo" element={<FinanceCashFlow />} />
        <Route path="/financeiro/receber" element={<FinanceReceivables />} />
        <Route path="/financeiro/pagar" element={<FinancePayables />} />
        <Route path="/financeiro/patrimonio" element={<FinancePatrimony />} />

        {/* Rotas de Pessoas, Marketing e Tryout preservadas... */}
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
};

export default App;