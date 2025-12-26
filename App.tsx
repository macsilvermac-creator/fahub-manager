import React, { Suspense, lazy } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import LoadingScreen from '@/components/LoadingScreen';
import ErrorBoundary from '@/components/ErrorBoundary';
import { ToastProvider } from '@/contexts/ToastContext';

// Novas Páginas de Módulos de Elite
const Login = lazy(() => import('@/pages/Login'));
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const Agenda = lazy(() => import('@/pages/Agenda'));
const BrainLab = lazy(() => import('@/pages/BrainLab'));
const IronLab = lazy(() => import('@/pages/IronLab'));
const PlaybookLab = lazy(() => import('@/pages/PlaybookLab'));
const Finance = lazy(() => import('@/pages/Finance'));
const MyProfile = lazy(() => import('@/pages/MyProfile'));
const Roster = lazy(() => import('@/pages/Roster'));
const SidelineHub = lazy(() => import('@/pages/SidelineHub'));
const TrainingHub = lazy(() => import('@/pages/TrainingHub'));
const PracticeExecution = lazy(() => import('@/pages/PracticeExecution'));

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
                      <Route path="/agenda" element={<Agenda />} />
                      <Route path="/brain-lab" element={<BrainLab />} />
                      <Route path="/iron-lab" element={<IronLab />} />
                      <Route path="/playbook-lab" element={<PlaybookLab />} />
                      <Route path="/finance" element={<Finance />} />
                      <Route path="/profile" element={<MyProfile />} />
                      <Route path="/roster" element={<Roster />} />
                      <Route path="/sideline" element={<SidelineHub />} />
                      <Route path="/training-day" element={<TrainingHub />} />
                      <Route path="/practice-execution/:id" element={<PracticeExecution />} />
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