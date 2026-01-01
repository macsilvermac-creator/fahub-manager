import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './shared/components/layouts/Sidebar';
import StickyEventBanner from './shared/components/layouts/StickyEventBanner';
import Dashboard from './modules/dashboard/Dashboard';
import AthletesList from './modules/athletes/AthletesList';
import PaymentsList from './modules/finance/PaymentsList';
import Settings from './modules/settings/Settings';
import NexusPortal from './modules/nexus/NexusPortal';
import Agenda from './modules/calendar/Agenda';

function App() {
  return (
    <Router>
      <Routes>
        {/* Rota do Portal Nexus - Independente */}
        <Route path="/nexus" element={<NexusPortal />} />

        {/* Rotas Protegidas/Internas com Layout Padrão */}
        <Route
          path="/*"
          element={
            <div className="flex min-h-screen bg-gray-50">
              {/* Sidebar Lateral fixa */}
              <Sidebar />

              <div className="flex-1 flex flex-col ml-64 transition-all duration-300">
                {/* Banner de Evento Onipresente no Topo */}
                <StickyEventBanner />

                {/* Conteúdo da Página */}
                <main className="flex-1 p-8">
                  <Routes>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/athletes" element={<AthletesList />} />
                    <Route path="/finance" element={<PaymentsList />} />
                    <Route path="/agenda" element={<Agenda />} />
                    <Route path="/settings" element={<Settings />} />

                    {/* Fallback para o Nexus */}
                    <Route path="/" element={<Navigate to="/nexus" replace />} />
                    <Route path="*" element={<Navigate to="/nexus" replace />} />
                  </Routes>
                </main>
              </div>
            </div>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;