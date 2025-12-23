import React, { Suspense, lazy } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import LoadingScreen from './components/LoadingScreen';
import ErrorBoundary from './components/ErrorBoundary';
import { ToastProvider } from './contexts/ToastContext';

// Importações Lazy
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Roster = lazy(() => import('./pages/Roster'));
const Recruitment = lazy(() => import('./pages/Recruitment'));
const Finance = lazy(() => import('./pages/Finance'));
const TrainingHub = lazy(() => import('./pages/TrainingHub'));
const PracticeExecution = lazy(() => import('./pages/PracticeExecution'));
const HelpCenter = lazy(() => import('./pages/HelpCenter'));
const Login = lazy(() => import('./pages/Login'));
const BroadcastBooth = lazy(() => import('./pages/BroadcastBooth'));
const PublicTeam = lazy(() => import('./pages/PublicTeam'));
const BroadcastOverlay = lazy(() => import('./pages/BroadcastOverlay'));
const PublicLeague = lazy(() => import('./pages/PublicLeague'));
const TeamManagement = lazy(() => import('./pages/entities/TeamManagement'));
const CoachPracticeControl = lazy(() => import('./pages/entities/CoachPracticeControl'));
const AthleteDashboard = lazy(() => import('./pages/entities/AthleteDashboard'));
const TeamTasks = lazy(() => import('./pages/TeamTasks'));
const Resources = lazy(() => import('./pages/Resources'));
const Marketing = lazy(() => import('./pages/Marketing'));
const Commercial = lazy(() => import('./pages/Commercial'));
const Inventory = lazy(() => import('./pages/Inventory'));
const Staff = lazy(() => import('./pages/Staff'));
const YouthProgram = lazy(() => import('./pages/YouthProgram'));
const Officiating = lazy(() => import('./pages/Officiating'));
const TacticalLab = lazy(() => import('./pages/TacticalLab'));
const Academy = lazy(() => import('./pages/Academy'));
const Roadmap = lazy(() => import('./pages/Roadmap'));
const RookiePortal = lazy(() => import('./pages/RookiePortal'));
const VideoAnalysis = lazy(() => import('./pages/VideoAnalysis'));
const GeminiPlaybook = lazy(() => import('./pages/GeminiPlaybook'));
const MyProfile = lazy(() => import('./pages/MyProfile'));
const AdminPanel = lazy(() => import('./pages/AdminPanel'));
const Onboarding = lazy(() => import('./pages/Onboarding'));
const TeamSettingsPage = lazy(() => import('./pages/TeamSettings'));
const LockerRoom = lazy(() => import('./pages/LockerRoom'));
const DigitalStore = lazy(() => import('./pages/DigitalStore'));
const Register = lazy(() => import('./pages/Register'));
const Schedule = lazy(() => import('./pages/Schedule'));
const LeagueManager = lazy(() => import('./pages/LeagueManager'));
const Confederation = lazy(() => import('./pages/Confederation'));
const CoachGameDay = lazy(() => import('./pages/CoachGameDay'));
const Marketplace = lazy(() => import('./pages/Marketplace'));
const Logistics = lazy(() => import('./pages/Logistics'));
const Goals = lazy(() => import('./pages/Goals'));

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
              <Route path="/broadcast/:gameId" element={<BroadcastOverlay />} />
              
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
                      <Route path="/practice" element={<TrainingHub />} /> {/* Alias */}
                      <Route path="/schedule" element={<Schedule />} />
                      <Route path="/logistics" element={<Logistics />} />
                      <Route path="/sideline" element={<CoachGameDay />} />
                      
                      {/* Management */}
                      <Route path="/roster" element={<Roster />} />
                      <Route path="/recruitment" element={<Recruitment />} />
                      <Route path="/finance" element={<Finance />} />
                      <Route path="/inventory" element={<Inventory />} />
                      <Route path="/staff" element={<Staff />} />
                      <Route path="/tasks" element={<TeamTasks />} />
                      <Route path="/goals" element={<Goals />} />
                      
                      {/* Intelligence */}
                      <Route path="/intel" element={<VideoAnalysis />} />
                      <Route path="/video-analysis" element={<VideoAnalysis />} />
                      <Route path="/tactical-lab" element={<TacticalLab />} />
                      <Route path="/gemini-playbook" element={<GeminiPlaybook />} />
                      
                      {/* Commercial & Marketing */}
                      <Route path="/marketing" element={<Marketing />} />
                      <Route path="/commercial" element={<Commercial />} />
                      <Route path="/marketplace" element={<Marketplace />} />
                      <Route path="/digital-store" element={<DigitalStore />} />
                      
                      {/* Community & Education */}
                      <Route path="/academy" element={<Academy />} />
                      <Route path="/youth-program" element={<YouthProgram />} />
                      <Route path="/locker-room" element={<LockerRoom />} />
                      <Route path="/help" element={<HelpCenter />} />
                      <Route path="/resources" element={<Resources />} />
                      
                      {/* Specialized Roles */}
                      <Route path="/officiating" element={<Officiating />} />
                      <Route path="/league" element={<LeagueManager />} />
                      <Route path="/confederation" element={<Confederation />} />
                      <Route path="/broadcast-booth" element={<BroadcastBooth />} />
                      <Route path="/admin" element={<AdminPanel />} />
                      <Route path="/settings" element={<TeamSettingsPage />} />
                      
                      {/* Player Specific */}
                      <Route path="/profile" element={<MyProfile />} />
                      <Route path="/performance" element={<AthleteDashboard />} />
                      <Route path="/rookie-portal" element={<RookiePortal />} />
                      
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