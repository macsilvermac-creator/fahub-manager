import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './shared/components/layouts/Sidebar';
import StickyEventBanner from './shared/components/layouts/StickyEventBanner'; // BANNER NOVO
import Dashboard from './modules/dashboard/Dashboard';
import AthletesList from './modules/athletes/AthletesList';
import PaymentsList from './modules/finance/PaymentsList';
import Settings from './modules/settings/Settings';
import NexusPortal from './modules/nexus/NexusPortal';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/nexus" element={<NexusPortal />} />
        <Route
          path="/*"
          element={
            <div className="flex min-h-screen bg-gray-50">
              <Sidebar />
              <div className="flex-1 flex flex-col ml-64 transition-all duration-300">
                <StickyEventBanner /> {/* BANNER ONIPRESENTE */}
                <main className="flex-1 p-8">
                  <Routes>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/athletes" element={<AthletesList />} />
                    <Route path="/finance" element={<PaymentsList />} />
                    <Route path="/settings" element={<Settings />} />
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