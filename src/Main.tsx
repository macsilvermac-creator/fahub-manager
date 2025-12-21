
import React, { Suspense, lazy } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import LoadingScreen from './components/LoadingScreen';
import ErrorBoundary from './components/ErrorBoundary';
import { ToastProvider } from './contexts/ToastContext';

// Lazy Loading para performance extrema em mobile (Protocolo FAHUB)
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Roster = lazy(() => import('./pages/Roster'));
const Recruitment = lazy(() => import('./pages/Recruitment'));
const RookiePortal = lazy(() => import('./pages/RookiePortal'));
const Finance = lazy(() => import('./pages/Finance'));
const TrainingHub = lazy(() => import('./pages/TrainingHub'));
const HelpCenter = lazy(() => import('./pages/HelpCenter'));
const Roadmap = lazy(() => import('./pages/Roadmap'));
const Logistics = lazy(() => import('./pages/Logistics'));
const Marketing = lazy(() => import('./pages/Marketing'));
const BroadcastBooth = lazy(() => import('./pages/BroadcastBooth'));
const PublicTeam = lazy(() => import('./pages/PublicTeam'));

const Main: React.FC = () => {
  return (
    <ErrorBoundary>
        <ToastProvider>
            <HashRouter>
                <Suspense fallback={<div className="h-screen w-screen flex items-center justify-center bg-[#0B1120]"><LoadingScreen /></div>}>
                    <Routes>
                        {/* Rota Pública (Sem Layout de Admin) */}
                        <Route path="/public/team" element={<PublicTeam />} />
                        
                        {/* Rotas Administrativas */}
                        <Route path="/*" element={
                            <Layout>
                                <Suspense fallback={<div className="h-full w-full flex items-center justify-center"><LoadingScreen /></div>}>
                                    <Routes>
                                        <Route path="/dashboard" element={<Dashboard />} />
                                        <Route path="/roadmap" element={<Roadmap />} />
                                        <Route path="/training-day" element={<TrainingHub />} />
                                        <Route path="/recruitment" element={<Recruitment />} />
                                        <Route path="/rookie-portal" element={<RookiePortal />} />
                                        <Route path="/roster" element={<Roster />} />
                                        <Route path="/finance" element={<Finance />} />
                                        <Route path="/marketing" element={<Marketing />} />
                                        <Route path="/logistics" element={<Logistics />} />
                                        <Route path="/broadcast-booth" element={<BroadcastBooth />} />
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