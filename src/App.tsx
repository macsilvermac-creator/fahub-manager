import React, { Suspense, lazy } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import LoadingScreen from './components/LoadingScreen';
import ErrorBoundary from './components/ErrorBoundary';
import { ToastProvider } from './contexts/ToastContext';

// Lazy loading das páginas principais para performance
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Roster = lazy(() => import('./pages/Roster'));
const Recruitment = lazy(() => import('./pages/Recruitment'));
const Finance = lazy(() => import('./pages/Finance'));
const TrainingHub = lazy(() => import('./pages/TrainingHub'));
const PracticeExecution = lazy(() => import('./pages/PracticeExecution'));
const HelpCenter = lazy(() => import('./pages/HelpCenter'));
const Login = lazy(() => import('./pages/Login'));
const Schedule = lazy(() => import('./pages/Schedule'));
const GeminiPlaybook = lazy(() => import('./pages/GeminiPlaybook'));
const TeamManagement = lazy(() => import('./pages/entities/TeamManagement'));
const MyProfile = lazy(() => import('./pages/MyProfile'));
const TeamTasks = lazy(() => import('./pages/TeamTasks'));
const Marketing = lazy(() => import('./pages/Marketing'));
const Resources = lazy(() => import('./pages/Resources'));
const Officiating = lazy(() => import('./pages/Officiating'));
const Commercial = lazy(() => import('./pages/Commercial'));
const BroadcastBooth = lazy(() => import('./pages/BroadcastBooth'));
const BroadcastOverlay = lazy(() => import('./pages/BroadcastOverlay'));
const PublicTeam = lazy(() => import('./pages/PublicTeam'));
const Register = lazy(() => import('./pages/Register'));
const Onboarding = lazy(() => import('./pages/Onboarding'));
const VideoAnalysis = lazy(() => import('./pages/VideoAnalysis'));
const TacticalLab = lazy(() => import('./pages/TacticalLab'));
const Inventory = lazy(() => import('./pages/Inventory'));
const Staff = lazy(() => import('./pages/Staff'));
const YouthProgram = lazy(() => import('./pages/YouthProgram'));
const LeagueManager = lazy(() => import('./pages/LeagueManager'));
const Marketplace = lazy(() => import('./pages/Marketplace'));
const LockerRoom = lazy(() => import('./pages/LockerRoom'));
const PublicLeague = lazy(() => import('./pages/PublicLeague'));
const AdminPanel = lazy(() => import('./pages/AdminPanel'));
const Goals = lazy(() => import('./pages/Goals'));
const Academy = lazy(() => import('./pages/Academy'));
const Logistics = lazy(() => import('./pages/Logistics'));
const Confederation = lazy(() => import('./pages/Confederation'));
const DigitalStore = lazy(() => import('./pages/DigitalStore'));

const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <ToastProvider>
        <HashRouter>
          <Suspense fallback={<div className="h-screen w-screen flex items-center justify-center bg-[#0B1120]"><LoadingScreen /></div>}>
            <Routes>
              {/* Rotas Públicas */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/public/team" element={<PublicTeam />} />
              <Route path="/public/league" element={<PublicLeague />} />
              <Route path="/broadcast-overlay/:gameId" element={<BroadcastOverlay />} />
              
              {/* Rotas Protegidas (Dentro do Layout) */}
              <Route path="/*" element={
                <Layout>
                  <Suspense fallback={<div className="h-full w-full flex items-center justify-center"><LoadingScreen /></div>}>
                    <Routes>
                      <Route path="/dashboard" element={<Dashboard />} />
                      <Route path="/onboarding" element={<Onboarding />} />
                      
                      {/* Operational */}
                      <Route path="/training-day" element={<TrainingHub />} />
                      <Route path="/practice-execution/:id" element={<PracticeExecution />} />
                      <Route path="/schedule" element={<Schedule />} />
                      <Route path="/logistics" element={<Logistics />} />
                      
                      {/* Strategic */}
                      <Route path="/roster" element={<Roster />} />
                      <Route path="/gemini-playbook" element={<GeminiPlaybook />} />
                      <Route path="/tactical-lab" element={<TacticalLab />} />
                      <Route path="/recruitment" element={<Recruitment />} />
                      <Route path="/video-analysis" element={<VideoAnalysis />} />
                      <Route path="/intel" element={<VideoAnalysis />} /> {/* Alias */}

                      {/* Management */}
                      <Route path="/finance" element={<Finance />} />
                      <Route path="/commercial" element={<Commercial />} />
                      <Route path="/marketing" element={<Marketing />} />
                      <Route path="/inventory" element={<Inventory />} />
                      <Route path="/staff" element={<Staff />} />
                      <Route path="/tasks" element={<TeamTasks />} />
                      <Route path="/goals" element={<Goals />} />
                      
                      {/* Features */}
                      <Route path="/academy" element={<Academy />} />
                      <Route path="/locker-room" element={<LockerRoom />} />
                      <Route path="/marketplace" element={<Marketplace />} />
                      <Route path="/digital-store" element={<DigitalStore />} />
                      <Route path="/broadcast-booth" element={<BroadcastBooth />} />
                      <Route path="/officiating" element={<Officiating />} />
                      <Route path="/league" element={<LeagueManager />} />
                      <Route path="/confederation" element={<Confederation />} />
                      <Route path="/youth" element={<YouthProgram />} />
                      
                      {/* User Specific */}
                      <Route path="/profile" element={<MyProfile />} />
                      <Route path="/help" element={<HelpCenter />} />
                      <Route path="/admin" element={<AdminPanel />} />
                      <Route path="/team-management" element={<TeamManagement />} />

                      {/* Default */}
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