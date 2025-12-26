import React, { Suspense, lazy } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import LoadingScreen from '@/components/LoadingScreen';
import ErrorBoundary from '@/components/ErrorBoundary';
import { ToastProvider } from '@/contexts/ToastContext';

// --- MODO LAZY ATIVADO ---
const Login = lazy(() => import('@/pages/Login'));
const Dashboard = lazy(() => import('@/pages/Dashboard'));
const MyProfile = lazy(() => import('@/pages/MyProfile'));
const Roster = lazy(() => import('@/pages/Roster'));
const TacticalLab = lazy(() => import('@/pages/TacticalLab'));
const TrainingHub = lazy(() => import('@/pages/TrainingHub'));
const PracticeExecution = lazy(() => import('@/pages/PracticeExecution'));
const SidelineHub = lazy(() => import('@/pages/SidelineHub'));
const Finance = lazy(() => import('@/pages/Finance'));
const Commercial = lazy(() => import('@/pages/Commercial'));
const Marketing = lazy(() => import('@/pages/Marketing'));
const Inventory = lazy(() => import('@/pages/Inventory'));
const Staff = lazy(() => import('@/pages/Staff'));
const Logistics = lazy(() => import('@/pages/Logistics'));
const Academy = lazy(() => import('@/pages/Academy'));
const Recruitment = lazy(() => import('@/pages/Recruitment'));
const LockerRoom = lazy(() => import('@/pages/LockerRoom'));
const RookiePortal = lazy(() => import('@/pages/RookiePortal'));
const AdminPanel = lazy(() => import('@/pages/AdminPanel'));
const Roadmap = lazy(() => import('@/pages/Roadmap'));
const LeagueManager = lazy(() => import('@/pages/LeagueManager'));
const Confederation = lazy(() => import('@/pages/Confederation'));
const PlatformHQ = lazy(() => import('@/pages/PlatformHQ'));
const GeminiPlaybook = lazy(() => import('@/pages/GeminiPlaybook'));
const VisionLab = lazy(() => import('@/pages/VisionLab'));
const VideoAnalysis = lazy(() => import('@/pages/VideoAnalysis'));

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
                      <Route path="/roster" element={<Roster />} />
                      <Route path="/tactical-lab" element={<TacticalLab />} />
                      <Route path="/training-day" element={<TrainingHub />} />
                      <Route path="/practice-execution/:id" element={<PracticeExecution />} />
                      <Route path="/sideline" element={<SidelineHub />} />
                      <Route path="/finance" element={<Finance />} />
                      <Route path="/commercial" element={<Commercial />} />
                      <Route path="/marketing" element={<Marketing />} />
                      <Route path="/inventory" element={<Inventory />} />
                      <Route path="/staff" element={<Staff />} />
                      <Route path="/logistics" element={<Logistics />} />
                      <Route path="/academy" element={<Academy />} />
                      <Route path="/recruitment" element={<Recruitment />} />
                      <Route path="/locker-room" element={<LockerRoom />} />
                      <Route path="/rookie-portal" element={<RookiePortal />} />
                      <Route path="/profile" element={<MyProfile />} />
                      <Route path="/admin" element={<AdminPanel />} />
                      <Route path="/roadmap" element={<Roadmap />} />
                      <Route path="/league" element={<LeagueManager />} />
                      <Route path="/confederation" element={<Confederation />} />
                      <Route path="/hq" element={<PlatformHQ />} />
                      <Route path="/gemini-playbook" element={<GeminiPlaybook />} />
                      <Route path="/vision-lab" element={<VisionLab />} />
                      <Route path="/video-analysis" element={<VideoAnalysis />} />
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