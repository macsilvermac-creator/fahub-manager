import React, { Suspense, lazy } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import LoadingScreen from './components/LoadingScreen';
import ErrorBoundary from './components/ErrorBoundary';
import { ToastProvider } from './contexts/ToastContext';
import ProtectedRoute from './components/ProtectedRoute';

// Importações Lazy das Páginas
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Roster = lazy(() => import('./pages/Roster'));
const Recruitment = lazy(() => import('./pages/Recruitment'));
const Finance = lazy(() => import('./pages/Finance'));
const TrainingHub = lazy(() => import('./pages/TrainingHub'));
const PracticeExecution = lazy(() => import('./pages/PracticeExecution'));
const HelpCenter = lazy(() => import('./pages/HelpCenter'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const Onboarding = lazy(() => import('./pages/Onboarding'));
const Marketplace = lazy(() => import('./pages/Marketplace'));
const VideoAnalysis = lazy(() => import('./pages/VideoAnalysis'));
const TacticalLab = lazy(() => import('./pages/TacticalLab'));
const Schedule = lazy(() => import('./pages/Schedule'));
const AdminPanel = lazy(() => import('./pages/AdminPanel'));

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <HashRouter>
          <Suspense fallback={<LoadingScreen />}>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/*" element={
                <Layout>
                  <Suspense fallback={<LoadingScreen />}>
                    <Routes>
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/onboarding" element={<Onboarding />} />
                      <Route path="/training-day" element={<TrainingHub />} />
                      <Route path="/practice-execution/:id" element={<PracticeExecution />} />
                      <Route path="/recruitment" element={<Recruitment />} />
                      <Route path="/roster" element={<Roster />} />
                      <Route path="/finance" element={<Finance />} />
                      <Route path="/marketplace" element={<Marketplace />} />
                      <Route path="/intel" element={<VideoAnalysis />} />
                      <Route path="/tactical-lab" element={<TacticalLab />} />
                      <Route path="/schedule" element={<Schedule />} />
                      <Route path="/help" element={<HelpCenter />} />
                      <Route path="/admin" element={<AdminPanel />} />
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