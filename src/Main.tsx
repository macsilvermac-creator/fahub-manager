
import React, { Suspense, lazy } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import LoadingScreen from './components/LoadingScreen';
import ErrorBoundary from './components/ErrorBoundary';
import { ToastProvider } from './contexts/ToastContext';

// Protocolo FAHUB LZY Mode
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Roster = lazy(() => import('./pages/Roster'));
const Recruitment = lazy(() => import('./pages/Recruitment'));
const Finance = lazy(() => import('./pages/Finance'));
const TrainingHub = lazy(() => import('./pages/TrainingHub'));
const PracticeExecution = lazy(() => import('./pages/PracticeExecution'));
const HelpCenter = lazy(() => import('./pages/HelpCenter'));

const Main: React.FC = () => {
  return (
    <ErrorBoundary>
        <ToastProvider>
            <HashRouter>
                <Suspense fallback={<div className="h-screen w-screen flex items-center justify-center bg-[#0B1120]"><LoadingScreen /></div>}>
                    <Routes>
                        <Route path="/*" element={
                            <Layout>
                                <Suspense fallback={<div className="h-full w-full flex items-center justify-center"><LoadingScreen /></div>}>
                                    <Routes>
                                        <Route path="/dashboard" element={<Dashboard />} />
                                        <Route path="/training-day" element={<TrainingHub />} />
                                        <Route path="/practice-execution/:id" element={<PracticeExecution />} />
                                        <Route path="/recruitment" element={<Recruitment />} />
                                        <Route path="/roster" element={<Roster />} />
                                        <Route path="/finance" element={<Finance />} />
                                        <Route path="/help" element={<HelpCenter />} />
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

export default Main;
