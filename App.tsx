
import * as React from 'react';
import { Suspense, lazy } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';

// Componentes Críticos (Bundle Inicial Mínimo)
import Layout from './components/Layout';
import LoadingScreen from './components/LoadingScreen';
import ErrorBoundary from './components/ErrorBoundary';
import { ToastProvider } from './contexts/ToastContext';

// Lazy Loading de todas as rotas para economia de RAM (Modo PWA/Mobile-First)
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Roster = lazy(() => import('./pages/Roster'));
const Recruitment = lazy(() => import('./pages/Recruitment'));
const Finance = lazy(() => import('./pages/Finance'));
const TrainingHub = lazy(() => import('./pages/TrainingHub'));
const PracticeExecution = lazy(() => import('./pages/PracticeExecution'));
const PracticeDetail = lazy(() => import('./pages/PracticeDetail'));
const TacticalLab = lazy(() => import('./pages/TacticalLab'));
const Inventory = lazy(() => import('./pages/Inventory'));
const Staff = lazy(() => import('./pages/Staff'));
const YouthProgram = lazy(() => import('./pages/YouthProgram'));
const LeagueManager = lazy(() => import('./pages/LeagueManager'));
const Marketplace = lazy(() => import('./pages/Marketplace'));
const LockerRoom = lazy(() => import('./pages/LockerRoom'));
const AdminPanel = lazy(() => import('./pages/AdminPanel'));
const Goals = lazy(() => import('./pages/Goals'));
const Academy = lazy(() => import('./pages/Academy'));
const Logistics = lazy(() => import('./pages/Logistics'));
const Confederation = lazy(() => import('./pages/Confederation'));
const DigitalStore = lazy(() => import('./pages/DigitalStore'));
const BroadcastBooth = lazy(() => import('./pages/BroadcastBooth'));
const MyProfile = lazy(() => import('./pages/MyProfile'));
const PlatformHQ = lazy(() => import('./pages/PlatformHQ'));
const HelpCenter = lazy(() => import('./pages/HelpCenter'));
const VideoAnalysis = lazy(() => import('./pages/VideoAnalysis'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const PublicTeam = lazy(() => import('./pages/PublicTeam'));
const PublicLeague = lazy(() => import('./pages/PublicLeague'));

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <HashRouter>
          <Suspense fallback={<LoadingScreen />}>
            <Routes>
              <Route path="/" element={<Navigate to="/login" replace />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/public/team" element={<PublicTeam />} />
              <Route path="/public/league" element={<PublicLeague />} />
              
              <Route path="/*" element={
                <Layout>
                  <Suspense fallback={<LoadingScreen />}>
                    <Routes>
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/training-day" element={<TrainingHub />} />
                      <Route path="/practice-execution/:id" element={<PracticeExecution />} />
                      <Route path="/practice-detail/:id" element={<PracticeDetail />} />
                      <Route path="/roster" element={<Roster />} />
                      <Route path="/recruitment" element={<Recruitment />} />
                      <Route path="/finance" element={<Finance />} />
                      <Route path="/tactical-lab" element={<TacticalLab />} />
                      <Route path="/inventory" element={<Inventory />} />
                      <Route path="/staff" element={<Staff />} />
                      <Route path="/youth" element={<YouthProgram />} />
                      <Route path="/league" element={<LeagueManager />} />
                      <Route path="/marketplace" element={<Marketplace />} />
                      <Route path="/locker-room" element={<LockerRoom />} />
                      <Route path="/admin" element={<AdminPanel />} />
                      <Route path="/hq" element={<PlatformHQ />} />
                      <Route path="/goals" element={<Goals />} />
                      <Route path="/academy" element={<Academy />} />
                      <Route path="/logistics" element={<Logistics />} />
                      <Route path="/confederation" element={<Confederation />} />
                      <Route path="/digital-store" element={<DigitalStore />} />
                      <Route path="/broadcast-booth" element={<BroadcastBooth />} />
                      <Route path="/profile" element={<MyProfile />} />
                      <Route path="/help" element={<HelpCenter />} />
                      <Route path="/intel" element={<VideoAnalysis />} />
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