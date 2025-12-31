import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './shared/components/layouts/Sidebar';
import Dashboard from './modules/dashboard/Dashboard';
import AthletesList from './modules/athletes/AthletesList';
import PaymentsList from './modules/finance/PaymentsList';
import Settings from './modules/settings/Settings'; // Certifique-se que o arquivo é src/modules/settings/Settings.tsx

function App() {
  return (
    <Router>
      <div className="flex min-h-screen bg-gray-50">
        {/* Componente de Navegação Lateral */}
        <Sidebar />

        {/* Conteúdo Principal */}
        <main className="flex-1 p-8 ml-64 transition-all duration-300">
          <Routes>
            {/* Redirecionamento Inicial */}
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            
            {/* Rotas da Aplicação */}
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/athletes" element={<AthletesList />} />
            <Route path="/finance" element={<PaymentsList />} />
            <Route path="/settings" element={<Settings />} />

            {/* Rota de Fallback para 404 (Opcional) */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;