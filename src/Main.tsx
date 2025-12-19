
import React, { Suspense, lazy } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoadingScreen from './components/LoadingScreen';
import ErrorBoundary from './components/ErrorBoundary';
import { ToastProvider } from './contexts/ToastContext';

// Entidades Base da Pirâmide - Carregamento Preguiçoso (Lazy)
const AthleteDashboard = lazy(() => import('./pages/entities/AthleteDashboard'));
const CoachPracticeControl = lazy(() => import('./pages/entities/CoachPracticeControl'));
const TeamManagement = lazy(() => import('./pages/entities/TeamManagement'));
const Login = lazy(() => import('./pages/Login'));

const Main: React.FC = () => {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <HashRouter>
          <Suspense fallback={<LoadingScreen />}>
            <Routes>
              <Route path="/login" element={<Login />} />
              
              {/* Entidade Atleta */}
              <Route path="/athlete/*" element={<AthleteDashboard />} />
              
              {/* Entidade Coach */}
              <Route path="/coach/*" element={<CoachPracticeControl />} />
              
              {/* Entidade Equipe */}
              <Route path="/team/*" element={<TeamManagement />} />

              <Route path="/" element={<Navigate to="/login" replace />} />
            </Routes>
          </Suspense>
        </HashRouter>
      </ToastProvider>
    </ErrorBoundary>
  );
};

export default Main;