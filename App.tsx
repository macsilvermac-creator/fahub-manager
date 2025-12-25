
import * as React from 'react';
import { Suspense, lazy } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';

// Componentes Críticos
import Layout from './components/Layout';
import LoadingScreen from './components/LoadingScreen';
import ErrorBoundary from './components/ErrorBoundary';
import { ToastProvider } from './contexts/ToastContext';

// Lazy Loading
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Roster = lazy(() => import('./pages/Roster'));
const Finance = lazy(() => import('./pages/Finance'));
const TrainingHub = lazy(() => import('./pages/TrainingHub'));
const TacticalLab = lazy(() => import('./pages/TacticalLab'));
const SidelineHub = lazy(() => import('./pages/SidelineHub'));
const Schedule = lazy(() => import('./pages/Schedule'));
const Login = lazy(() => import('./pages/Login'));

// CIATORS & OUTROS
const CiatorsHub = lazy(() => import('./pages/CiatorsHub'));
const CiatorsPresentation = lazy(() => import('./pages/CiatorsPresentation'));
const TeamSettingsPage = lazy(() => import('./pages/TeamSettings'));

// NOVAS DIRETORIAS (Stubs para expansão futura)
const CommercialCRM = () => (
    <div className="p-8 text-center bg-secondary/20 rounded-3xl border border-dashed border-white/10 animate-pulse">
        <p className="opacity-30 italic uppercase font-black text-xl">Módulo de Patrocínios (CRM) em Desenvolvimento</p>
    </div>
);
const MarketingAI = () => (
    <div className="p-8 text-center bg-secondary/20 rounded-3xl border border-dashed border-white/10 animate-pulse">
        <p className="opacity-30 italic uppercase font-black text-xl">Módulo de Hype IA em Desenvolvimento</p>
    </div>
);
const FanPortal = () => (
    <div className="p-8 text-center bg-secondary/20 rounded-3xl border border-dashed border-white/10 animate-pulse">
        <p className="opacity-30 italic uppercase font-black text-xl">Módulo Portal do Fã em Desenvolvimento</p>
    </div>
);

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <HashRouter>
          <Suspense fallback={<LoadingScreen />}>
            <Routes>
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route path="/login" element={<Login />} />
              
              <Route path="/*" element={
                <Layout>
                  <Suspense fallback={<LoadingScreen />}>
                    <Routes>
                      <Route path="/dashboard" element={<Dashboard />} />
                      
                      {/* DIRETORIA ESPORTES */}
                      <Route path="/roster" element={<Roster />} />
                      <Route path="/training-day" element={<TrainingHub />} />
                      <Route path="/tactical-lab" element={<TacticalLab />} />
                      <Route path="/ciators" element={<CiatorsHub />} />
                      <Route path="/ciators/presentation/:id" element={<CiatorsPresentation />} />
                      <Route path="/sideline-hub" element={<SidelineHub />} />
                      <Route path="/schedule" element={<Schedule />} />

                      {/* DIRETORIA COMERCIAL */}
                      <Route path="/finance" element={<Finance />} />
                      <Route path="/commercial/crm" element={<CommercialCRM />} />

                      {/* DIRETORIA MARKETING */}
                      <Route path="/marketing/ai" element={<MarketingAI />} />
                      <Route path="/marketing/fan-portal" element={<FanPortal />} />

                      {/* CONFIGURAÇÕES / MASTER */}
                      <Route path="/settings" element={<TeamSettingsPage />} />

                      <Route path="*" element={<Navigate to="/dashboard" replace />} />
                    </Routes>
                  </Suspense>
                </Layout>
              } />
            </Routes>
          </Suspense>
        </HashRouter>
      </ToastProvider>
    </ErrorBoundary>
  );
};

export default App;