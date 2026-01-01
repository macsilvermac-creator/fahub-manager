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
        {/* Rota do Portal Nexus - Independente e sem Sidebar ou Banner */}
        <Route path="/nexus" element={<NexusPortal />} />

        {/* Rotas Internas com Layout de Gestão Master */}
        <Route
          path="/*"
          element={
            <div className="flex min-h-screen bg-gray-50 font-sans">
              {/* Sidebar Lateral Fixa */}
              <Sidebar />

              <div className="flex-1 flex flex-col ml-64 transition-all duration-300">
                {/* Banner de Próximo Evento (Agenda Nexus) no topo de todas as páginas */}
                <StickyEventBanner />

                {/* Conteúdo Principal da Skin selecionada */}
                <main className="flex-1 p-8">
                  <Routes>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/agenda" element={<Agenda />} />
                    <Route path="/athletes" element={<AthletesList />} />
                    <Route path="/finance" element={<PaymentsList />} />
                    <Route path="/settings" element={<Settings />} />

                    {/* Redirecionamento padrão para o Nexus se a rota não existir */}
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