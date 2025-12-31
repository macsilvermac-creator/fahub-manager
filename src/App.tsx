import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './shared/components/layouts/Sidebar';
import Dashboard from './modules/dashboard/Dashboard';
import AthletesList from './modules/athletes/AthletesList';
import PaymentsList from './modules/finance/PaymentsList'; // <--- Importou Financeiro
import Settings from './modules/settings/Settings';       // <--- Importou Configurações

function App() {
  return (
    <Router>
      <div className="flex min-h-screen bg-gray-50">
        <Sidebar />
        <main className="flex-1 p-8 ml-64 transition-all duration-300">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/athletes" element={<AthletesList />} />
            <Route path="/finance" element={<PaymentsList />} /> {/* Rota Financeiro */}
            <Route path="/settings" element={<Settings />} />    {/* Rota Configurações */}
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;