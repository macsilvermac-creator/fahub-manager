import * as React from 'react';
import { Suspense, lazy } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';

// Importações Estáticas (Síncronas) - Caminhos relativos à raiz
import Layout from './components/Layout.tsx';
import LoadingScreen from './components/LoadingScreen.tsx';
import ErrorBoundary from './components/ErrorBoundary.tsx';
import { ToastProvider } from './contexts/ToastContext.tsx';

// Importações Lazy das páginas - Caminhos explícitos com extensão para o Rollup
const Dashboard = lazy(() => import('./pages/Dashboard.tsx'));
const Roster = lazy(() => import('./pages/Roster.tsx'));
const Recruitment = lazy(() => import('./pages/Recruitment.tsx'));
const Finance = lazy(() => import('./pages/Finance.tsx'));
const TrainingHub = lazy(() => import('./pages/TrainingHub.tsx'));
const PracticeExecution = lazy(() => import('./pages/PracticeExecution.tsx'));
const HelpCenter = lazy(() => import('./pages/HelpCenter.tsx'));
const Login = lazy(() => import('./pages/Login.tsx'));
const Register = lazy(() => import('./pages/Register.tsx'));
const Onboarding = lazy(() => import('./pages/Onboarding.tsx'));
const VideoAnalysis = lazy(() => import('./pages/VideoAnalysis.tsx'));
const TacticalLab = lazy(() => import('./pages/TacticalLab.tsx'));
const Inventory = lazy(() => import('./pages/Inventory.tsx'));
const Staff = lazy(() => import('./pages/Staff.tsx'));
const YouthProgram = lazy(() => import('./pages/YouthProgram.tsx'));
const LeagueManager = lazy(() => import('./pages/LeagueManager.tsx'));
const Marketplace = lazy(() => import('./pages/Marketplace.tsx'));
const LockerRoom = lazy(() => import('./pages/LockerRoom.tsx'));
const PublicLeague = lazy(() => import('./pages/PublicLeague.tsx'));
const AdminPanel = lazy(() => import('./pages/AdminPanel.tsx'));
const Goals = lazy(() => import('./pages/Goals.tsx'));
const Academy = lazy(() => import('./pages/Academy.tsx'));
const Logistics = lazy(() => import('./pages/Logistics.tsx'));
const Confederation = lazy(() => import('./pages/Confederation.tsx'));
const DigitalStore = lazy(() => import('./pages/DigitalStore.tsx'));
const PublicTeam = lazy(() => import('./pages/PublicTeam.tsx'));
const BroadcastBooth = lazy(() => import('./pages/BroadcastBooth.tsx'));
const BroadcastOverlay = lazy(() => import('./pages/BroadcastOverlay.tsx'));
const MyProfile = lazy(() => import('./pages/MyProfile.tsx'));

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <HashRouter>
          <Suspense fallback={<div className="h-screen w-screen flex items-center justify-center bg-[#0B1120]"><LoadingScreen /></div>}>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/public/team" element={<PublicTeam />} />
              <Route path="/public/league" element={<PublicLeague />} />
              <Route path="/broadcast-overlay/:gameId" element={<BroadcastOverlay />} />
              
              <Route path="/*" element={
                <Layout>
                  <Suspense fallback={<div className="h-full w-full flex items-center justify-center"><LoadingScreen /></div>}>
                    <Routes>
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/onboarding" element={<Onboarding />} />
                      <Route path="/training-day" element={<TrainingHub />} />
                      <Route path="/practice-execution/:id" element={<PracticeExecution />} />
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