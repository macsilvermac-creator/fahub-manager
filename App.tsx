
import * as React from 'react';
import { Suspense, lazy } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';

// Componentes estáticos críticos para a carga inicial
import Layout from './components/Layout';
import LoadingScreen from './components/LoadingScreen';
import ErrorBoundary from './components/ErrorBoundary';
import { ToastProvider } from './contexts/ToastContext';

// Importações Lazy - Carregam apenas quando o usuário acessa a rota
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Roster = lazy(() => import('./pages/Roster'));
const Finance = lazy(() => import('./pages/Finance'));
const TrainingHub = lazy(() => import('./pages/TrainingHub'));
const TacticalLab = lazy(() => import('./pages/TacticalLab'));
const Schedule = lazy(() => import('./pages/Schedule'));
const Login = lazy(() => import('./pages/Login'));
const AdminPanel = lazy(() => import('./pages/AdminPanel'));
const TeamSettingsPage = lazy(() => import('./pages/TeamSettings'));

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <HashRouter>
          <Suspense fallback={<LoadingScreen />}>
            <Routes>
              <Route path="/login" element={<Login />} />
              
              <Route path="/*" element={
                <Layout>
                  <Suspense fallback={<LoadingScreen />}>
                    <Routes>
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/admin" element={<AdminPanel />} />
                      <Route path="/roster" element={<Roster />} />
                      <Route path="/training-day" element={<TrainingHub />} />
                      <Route path="/tactical-lab" element={<TacticalLab />} />
                      <Route path="/schedule" element={<Schedule />} />
                      <Route path="/finance" element={<Finance />} />
                      <Route path="/settings" element={<TeamSettingsPage />} />
                      <Route path="*" element={<Navigate to="/dashboard" replace />} />
                    </Routes>
                  </Suspense>
                </Layout>
              } />
              <Route path="/" element={<Navigate to="/login" replace />} />
            </Routes>
          </Suspense>
        </HashRouter>
      </ToastProvider>
    </ErrorBoundary>
  );
};

export default App;
