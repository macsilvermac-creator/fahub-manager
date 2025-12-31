import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './shared/components/layouts/Sidebar';
import Dashboard from './modules/dashboard/Dashboard';
import AthletesList from './modules/athletes/AthletesList';
import PaymentsList from './modules/finance/PaymentsList';
import Settings from './modules/settings/Settings';

function App() {
  return (
    <Router>
      <div className="flex min-h-screen bg-gray-50">
        {/* Barra Lateral Fixa */}
        <Sidebar />

        {/* Área Principal de Conteúdo */}
        <main className="flex-1 p-8 ml-64 transition-all duration-300">
          <Routes>
            {/* Redireciona a raiz (/) para o Dashboard */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            
            {/* Rota do Dashboard */}
            <Route path="/dashboard" element={<Dashboard />} />
            
            {/* Rota de Atletas */}
            <Route path="/athletes" element={<AthletesList />} />

            {/* Rota Financeiro (A que estava faltando) */}
            <Route path="/finance" element={<PaymentsList />} />

            {/* Rota Configurações */}
            <Route path="/settings" element={<Settings />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;