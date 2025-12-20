
import React, { Suspense, lazy } from 'react';
// @ts-ignore
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import LoadingScreen from './components/LoadingScreen';
import ErrorBoundary from './components/ErrorBoundary';
import { ToastProvider } from './contexts/ToastContext';
import { authService } from './services/authService';

// Lazy Loading para performance extrema em mobile
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Roster = lazy(() => import('./pages/Roster'));
const Recruitment = lazy(() => import('./pages/Recruitment'));
const Login = lazy(() => import('./pages/Login'));
const AdminPanel = lazy(() => import('./pages/AdminPanel'));

const Main: React.FC = () => {
  return (
    <ErrorBoundary>
        <ToastProvider>
            <HashRouter>
                <Suspense fallback={<div className="h-screen w-screen flex items-center justify-center bg-primary"><LoadingScreen /></div>}>
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/*" element={
                            <Layout>
                                <Suspense fallback={<div className="h-full w-full flex items-center justify-center"><LoadingScreen /></div>}>
                                    <Routes>
                                        <Route path="/dashboard" element={<Dashboard />} />
                                        <Route path="/roster" element={<Roster />} />
                                        <Route path="/recruitment" element={<Recruitment />} />
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

export default Main;
