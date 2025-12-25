
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

// CIATORS
const CiatorsHub = lazy(() => import('./pages/CiatorsHub'));
const CiatorsPresentation = lazy(() => import('./pages/CiatorsPresentation'));

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
                      <Route path="/training-day" element={<TrainingHub />} />
                      <Route path="/roster" element={<Roster />} />
                      <Route path="/finance" element={<Finance />} />
                      <Route path="/tactical-lab" element={<TacticalLab />} />
                      <Route path="/sideline-hub" element={<SidelineHub />} />
                      <Route path="/schedule" element={<Schedule />} />
                      
                      {/* CIATORS ROUTES */}
                      <Route path="/ciators" element={<CiatorsHub />} />
                      <Route path="/ciators/presentation/:id" element={<CiatorsPresentation />} />

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
