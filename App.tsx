
import * as React from 'react';
import { Suspense, lazy } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';

import Layout from './components/Layout';
import LoadingScreen from './components/LoadingScreen';
import ErrorBoundary from './components/ErrorBoundary';
import { ToastProvider } from './contexts/ToastContext';

// LAZY MODULES (PERFORMANCE PWA)
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Roster = lazy(() => import('./pages/Roster'));
const TacticalLab = lazy(() => import('./pages/TacticalLab'));
const TrainingHub = lazy(() => import('./pages/TrainingHub'));
const Finance = lazy(() => import('./pages/Finance'));
const Commercial = lazy(() => import('./pages/Commercial'));
const Marketing = lazy(() => import('./pages/Marketing'));
const PerformanceLab = lazy(() => import('./pages/PerformanceLab'));
const Logistics = lazy(() => import('./pages/Logistics'));
const AdminPanel = lazy(() => import('./pages/AdminPanel'));
const Roadmap = lazy(() => import('./pages/Roadmap'));
const SidelineHub = lazy(() => import('./pages/SidelineHub'));
const Login = lazy(() => import('./pages/Login'));

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
                      {/* Eixo Principal */}
                      <Route path="/dashboard" element={<Dashboard />} />
                      
                      {/* Eixo Técnico */}
                      <Route path="/roster" element={<Roster />} />
                      <Route path="/tactical-lab" element={<TacticalLab />} />
                      <Route path="/training-day" element={<TrainingHub />} />
                      <Route path="/sideline" element={<SidelineHub />} />
                      
                      {/* Eixo Executivo */}
                      <Route path="/finance" element={<Finance />} />
                      <Route path="/commercial" element={<Commercial />} />
                      <Route path="/marketing" element={<Marketing />} />
                      
                      {/* Eixo Operacional */}
                      <Route path="/performance" element={<PerformanceLab />} />
                      <Route path="/logistics" element={<Logistics />} />
                      
                      {/* Eixo Governança */}
                      <Route path="/admin" element={<AdminPanel />} />
                      <Route path="/roadmap" element={<Roadmap />} />
                      
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