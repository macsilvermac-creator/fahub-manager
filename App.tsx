import React, { Suspense, lazy } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import LoadingScreen from './components/LoadingScreen';
import ErrorBoundary from './components/ErrorBoundary';
import { ToastProvider } from './contexts/ToastContext';

// --- MODO LAZY ATIVADO (CODE SPLITTING) ---

// Eixo Autenticação
const Login = lazy(() => import('./pages/Login'));

// Eixo Principal & Dashboard
const Dashboard = lazy(() => import('./pages/Dashboard'));
const MyProfile = lazy(() => import('./pages/MyProfile'));

// Eixo Técnico & Campo
const Roster = lazy(() => import('./pages/Roster'));
const TacticalLab = lazy(() => import('./pages/TacticalLab'));
const TrainingHub = lazy(() => import('./pages/TrainingHub'));
const PracticeExecution = lazy(() => import('./pages/PracticeExecution'));
const SidelineHub = lazy(() => import('./pages/SidelineHub'));
const VisionLab = lazy(() => import('./pages/VisionLab'));
const VideoAnalysis = lazy(() => import('./pages/VideoAnalysis'));
const GeminiPlaybook = lazy(() => import('./pages/GeminiPlaybook'));

// Eixo Executivo & Gestão
const Finance = lazy(() => import('./pages/Finance'));
const Commercial = lazy(() => import('./pages/Commercial'));
const Marketing = lazy(() => import('./pages/Marketing'));
const Inventory = lazy(() => import('./pages/Inventory'));
const Staff = lazy(() => import('./pages/Staff'));
const Logistics = lazy(() => import('./pages/Logistics'));

// Eixo Performance & Atleta
const Academy = lazy(() => import('./pages/Academy'));
const Recruitment = lazy(() => import('./pages/Recruitment'));
const LockerRoom = lazy(() => import('./pages/LockerRoom'));
const RookiePortal = lazy(() => import('./pages/RookiePortal'));

// Eixo Governança & Admin
const AdminPanel = lazy(() => import('./pages/AdminPanel'));
const Roadmap = lazy(() => import('./pages/Roadmap'));
const PlatformHQ = lazy(() => import('./pages/PlatformHQ'));
const LeagueManager = lazy(() => import('./pages/LeagueManager'));
const Confederation = lazy(() => import('./pages/Confederation'));

// Eixo Mídia & Público
const PublicTeam = lazy(() => import('./pages/PublicTeam'));
const PublicLeague = lazy(() => import('./pages/PublicLeague'));
const BroadcastOverlay = lazy(() => import('./pages/BroadcastOverlay'));
const BroadcastBooth = lazy(() => import('./pages/BroadcastBooth'));

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <HashRouter>
          <Suspense fallback={<LoadingScreen />}>
            <Routes>
              {/* Rotas Públicas */}
              <Route path="/login" element={<Login />} />
              <Route path="/public/team" element={<PublicTeam />} />
              <Route path="/public/league" element={<PublicLeague />} />
              <Route path="/broadcast/:gameId" element={<BroadcastOverlay />} />
              
              {/* Core System (Protegido por Layout) */}
              <Route path="/*" element={
                <Layout>
                  <Suspense fallback={<LoadingScreen />}>
                    <Routes>
                      {/* Dashboard Adaptativo */}
                      <Route path="/dashboard" element={<Dashboard />} />
                      
                      {/* Módulos Técnicos */}
                      <Route path="/roster" element={<Roster />} />
                      <Route path="/tactical-lab" element={<TacticalLab />} />
                      <Route path="/training-day" element={<TrainingHub />} />
                      <Route path="/practice-execution/:id" element={<PracticeExecution />} />
                      <Route path="/sideline" element={<SidelineHub />} />
                      <Route path="/vision-lab" element={<VisionLab />} />
                      <Route path="/video-analysis" element={<VideoAnalysis />} />
                      <Route path="/gemini-playbook" element={<GeminiPlaybook />} />
                      <Route path="/broadcast-booth" element={<BroadcastBooth />} />
                      
                      {/* Módulos Executivos */}
                      <Route path="/finance" element={<Finance />} />
                      <Route path="/commercial" element={<Commercial />} />
                      <Route path="/marketing" element={<Marketing />} />
                      <Route path="/inventory" element={<Inventory />} />
                      <Route path="/staff" element={<Staff />} />
                      <Route path="/logistics" element={<Logistics />} />
                      
                      {/* Módulos Atleta & Comunidade */}
                      <Route path="/academy" element={<Academy />} />
                      <Route path="/recruitment" element={<Recruitment />} />
                      <Route path="/locker-room" element={<LockerRoom />} />
                      <Route path="/rookie-portal" element={<RookiePortal />} />
                      <Route path="/profile" element={<MyProfile />} />
                      
                      {/* Governança */}
                      <Route path="/admin" element={<AdminPanel />} />
                      <Route path="/roadmap" element={<Roadmap />} />
                      <Route path="/league" element={<LeagueManager />} />
                      <Route path="/confederation" element={<Confederation />} />
                      <Route path="/hq" element={<PlatformHQ />} />

                      {/* Fallback para Dashboard */}
                      <Route path="*" element={<Navigate to="/dashboard" replace />} />
                    </Routes>
                  </Suspense>
                </Layout>
              } />
              
              {/* Default Redirect */}
              <Route path="/" element={<Navigate to="/login" replace />} />
            </Routes>
          </Suspense>
        </HashRouter>
      </ToastProvider>
    </ErrorBoundary>
  );
};

export default App;