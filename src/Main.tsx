
import React, { Suspense } from 'react';
// @ts-ignore
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import LoadingScreen from './components/LoadingScreen';
import ErrorBoundary from './components/ErrorBoundary';
import GlobalSearch from './components/GlobalSearch';
import { ToastProvider } from './contexts/ToastContext';

// FAHUB MANAGER v2.2 - Enterprise Grade
// Added Toast Provider for Global Notifications

const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const Roster = React.lazy(() => import('./pages/Roster'));
const Finance = React.lazy(() => import('./pages/Finance'));
const Login = React.lazy(() => import('./pages/Login'));
const Register = React.lazy(() => import('./pages/Register'));
const PracticePlan = React.lazy(() => import('./pages/PracticePlan'));
const Schedule = React.lazy(() => import('./pages/Schedule'));
const Staff = React.lazy(() => import('./pages/Staff'));
const Inventory = React.lazy(() => import('./pages/Inventory'));
const TeamTasks = React.lazy(() => import('./pages/TeamTasks'));
const Communications = React.lazy(() => import('./pages/Communications'));
const Resources = React.lazy(() => import('./pages/Resources'));
const TeamSettingsPage = React.lazy(() => import('./pages/TeamSettings'));
const AdminPanel = React.lazy(() => import('./pages/AdminPanel'));
const MyProfile = React.lazy(() => import('./pages/MyProfile'));
const Officiating = React.lazy(() => import('./pages/Officiating'));
const LeagueManager = React.lazy(() => import('./pages/LeagueManager'));
const Confederation = React.lazy(() => import('./pages/Confederation'));
const PublicLeague = React.lazy(() => import('./pages/PublicLeague'));
const GeminiPlaybook = React.lazy(() => import('./pages/GeminiPlaybook'));
const TacticalLab = React.lazy(() => import('./pages/TacticalLab'));
const VideoAnalysis = React.lazy(() => import('./pages/VideoAnalysis'));
const Academy = React.lazy(() => import('./pages/Academy'));
const Marketplace = React.lazy(() => import('./pages/Marketplace'));
const Commercial = React.lazy(() => import('./pages/Commercial'));
const Marketing = React.lazy(() => import('./pages/Marketing'));
const LockerRoom = React.lazy(() => import('./pages/LockerRoom'));
const YouthProgram = React.lazy(() => import('./pages/YouthProgram'));
const EventDesk = React.lazy(() => import('./pages/EventDesk'));
const HelpCenter = React.lazy(() => import('./pages/HelpCenter'));
const Roadmap = React.lazy(() => import('./pages/Roadmap'));
const Onboarding = React.lazy(() => import('./pages/Onboarding'));
const BroadcastOverlay = React.lazy(() => import('./pages/BroadcastOverlay'));

const Main: React.FC = () => {
  return (
    <ErrorBoundary>
        <ToastProvider>
            <HashRouter>
            <GlobalSearch />
            <Suspense fallback={<div className="h-screen w-screen flex items-center justify-center bg-[#0B1120]"><LoadingScreen /></div>}>
                <Routes>
                {/* Rotas Públicas (Sem Layout) */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/public/league" element={<PublicLeague />} />
                <Route path="/broadcast/:gameId" element={<BroadcastOverlay />} />
                <Route path="/onboarding" element={<Onboarding />} />
                
                {/* Rotas Protegidas (Com Layout/Sidebar) */}
                <Route path="/*" element={
                    <Layout>
                    <ErrorBoundary>
                        <Suspense fallback={<div className="h-full w-full flex items-center justify-center"><LoadingScreen /></div>}>
                            <Routes>
                            <Route path="/" element={<Navigate to="/dashboard" replace />} />
                            <Route path="/dashboard" element={<Dashboard />} />
                            <Route path="/roster" element={<Roster />} />
                            <Route path="/finance" element={<Finance />} />
                            <Route path="/practice" element={<PracticePlan />} />
                            <Route path="/schedule" element={<Schedule />} />
                            <Route path="/staff" element={<Staff />} />
                            <Route path="/inventory" element={<Inventory />} />
                            <Route path="/tasks" element={<TeamTasks />} />
                            <Route path="/communications" element={<Communications />} />
                            <Route path="/resources" element={<Resources />} />
                            <Route path="/settings" element={<TeamSettingsPage />} />
                            <Route path="/admin" element={<AdminPanel />} />
                            <Route path="/profile" element={<MyProfile />} />
                            <Route path="/officiating" element={<Officiating />} />
                            <Route path="/league" element={<LeagueManager />} />
                            <Route path="/confederation" element={<Confederation />} />
                            <Route path="/gemini-playbook" element={<GeminiPlaybook />} />
                            <Route path="/tactical-lab" element={<TacticalLab />} />
                            <Route path="/video" element={<VideoAnalysis />} />
                            <Route path="/academy" element={<Academy />} />
                            <Route path="/marketplace" element={<Marketplace />} />
                            <Route path="/commercial" element={<Commercial />} />
                            <Route path="/marketing" element={<Marketing />} />
                            <Route path="/locker-room" element={<LockerRoom />} />
                            <Route path="/youth" element={<YouthProgram />} />
                            <Route path="/event-desk" element={<EventDesk />} />
                            <Route path="/help" element={<HelpCenter />} />
                            <Route path="/roadmap" element={<Roadmap />} />
                            </Routes>
                        </Suspense>
                    </ErrorBoundary>
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
