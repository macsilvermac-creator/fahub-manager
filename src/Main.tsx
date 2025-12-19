
import React, { Suspense, lazy } from 'react';
import { HashRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Layout from './components/Layout';
import LoadingScreen from './components/LoadingScreen';
import ErrorBoundary from './components/ErrorBoundary';
import ProtectedRoute from './components/ProtectedRoute'; 
import { ToastProvider } from './contexts/ToastContext';
import { UserRole } from './types';
import { authService } from './services/authService';

// LAZY LOADING AGRESSIVO - Otimiza o bundle inicial e remove lentidão
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Roster = lazy(() => import('./pages/Roster'));
const Finance = lazy(() => import('./pages/Finance'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const PracticePlan = lazy(() => import('./pages/PracticePlan'));
const Schedule = lazy(() => import('./pages/Schedule'));
const Staff = lazy(() => import('./pages/Staff'));
const Inventory = lazy(() => import('./pages/Inventory'));
const TeamTasks = lazy(() => import('./pages/TeamTasks'));
const Communications = lazy(() => import('./pages/Communications'));
const Resources = lazy(() => import('./pages/Resources'));
const TeamSettingsPage = lazy(() => import('./pages/TeamSettings'));
const AdminPanel = lazy(() => import('./pages/AdminPanel'));
const MyProfile = lazy(() => import('./pages/MyProfile'));
const Officiating = lazy(() => import('./pages/Officiating'));
const LeagueManager = lazy(() => import('./pages/LeagueManager'));
const Confederation = lazy(() => import('./pages/Confederation'));
const PublicLeague = lazy(() => import('./pages/PublicLeague'));
const PublicTeam = lazy(() => import('./pages/PublicTeam')); 
const GeminiPlaybook = lazy(() => import('./pages/GeminiPlaybook'));
const TacticalLab = lazy(() => import('./pages/TacticalLab'));
const VideoAnalysis = lazy(() => import('./pages/VideoAnalysis'));
const Academy = lazy(() => import('./pages/Academy'));
const Marketplace = lazy(() => import('./pages/Marketplace'));
const Commercial = lazy(() => import('./pages/Commercial'));
const Marketing = lazy(() => import('./pages/Marketing'));
const LockerRoom = lazy(() => import('./pages/LockerRoom'));
const YouthProgram = lazy(() => import('./pages/YouthProgram'));
const EventDesk = lazy(() => import('./pages/EventDesk'));
const HelpCenter = lazy(() => import('./pages/HelpCenter'));
const Roadmap = lazy(() => import('./pages/Roadmap'));
const Onboarding = lazy(() => import('./pages/Onboarding'));
const BroadcastOverlay = lazy(() => import('./pages/BroadcastOverlay'));
const Recruitment = lazy(() => import('./pages/Recruitment'));
const Goals = lazy(() => import('./pages/Goals'));
const DigitalStore = lazy(() => import('./pages/DigitalStore'));
const PlatformHQ = lazy(() => import('./pages/PlatformHQ'));
const CoachGameDay = lazy(() => import('./pages/CoachGameDay'));

const ROLES = {
  MASTER: ['MASTER'] as UserRole[],
  FINANCE: ['MASTER', 'FINANCIAL_MANAGER'] as UserRole[],
  COACHING: ['MASTER', 'HEAD_COACH', 'OFFENSIVE_COORD', 'DEFENSIVE_COORD'] as UserRole[],
};

const SystemGuard: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const location = useLocation();
    const user = authService.getCurrentUser();

    if (location.pathname.startsWith('/public') || location.pathname === '/login' || location.pathname === '/register' || location.pathname.startsWith('/broadcast')) {
        return <>{children}</>;
    }
    if (!user) return <Navigate to="/login" replace />;
    if (user.status === 'APPROVED' && !user.isProfileComplete && location.pathname !== '/onboarding') {
        return <Navigate to="/onboarding" replace />;
    }
    return <>{children}</>;
};

const Main: React.FC = () => {
  return (
    <ErrorBoundary>
        <ToastProvider>
            <HashRouter>
            <Suspense fallback={<div className="h-screen w-screen flex items-center justify-center bg-[#0B1120] text-white"><LoadingScreen /></div>}>
                <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/public/league" element={<PublicLeague />} />
                <Route path="/public/team" element={<PublicTeam />} /> 
                <Route path="/broadcast/:gameId" element={<BroadcastOverlay />} />
                
                <Route path="/*" element={
                    <SystemGuard>
                        <Layout>
                        <ErrorBoundary>
                            <Suspense fallback={<div className="h-full w-full flex items-center justify-center"><LoadingScreen /></div>}>
                                <Routes>
                                <Route path="/onboarding" element={<Onboarding />} />
                                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                                <Route path="/dashboard" element={<Dashboard />} />
                                <Route path="/profile" element={<MyProfile />} />
                                <Route path="/schedule" element={<Schedule />} />
                                <Route path="/locker-room" element={<LockerRoom />} />
                                <Route path="/academy" element={<Academy />} />
                                <Route path="/marketplace" element={<Marketplace />} />
                                <Route path="/digital-store" element={<DigitalStore />} />
                                <Route path="/communications" element={<Communications />} />
                                <Route path="/help" element={<HelpCenter />} />
                                <Route path="/resources" element={<Resources />} />
                                <Route path="/roster" element={<ProtectedRoute allowedRoles={ROLES.COACHING}><Roster /></ProtectedRoute>} />
                                <Route path="/practice" element={<ProtectedRoute allowedRoles={ROLES.COACHING}><PracticePlan /></ProtectedRoute>} />
                                <Route path="/gemini-playbook" element={<ProtectedRoute allowedRoles={ROLES.COACHING}><GeminiPlaybook /></ProtectedRoute>} />
                                <Route path="/video" element={<VideoAnalysis />} />
                                <Route path="/tactical-lab" element={<ProtectedRoute allowedRoles={ROLES.COACHING}><TacticalLab /></ProtectedRoute>} />
                                <Route path="/coach-gameday" element={<ProtectedRoute allowedRoles={ROLES.COACHING}><CoachGameDay /></ProtectedRoute>} />
                                <Route path="/recruitment" element={<ProtectedRoute allowedRoles={ROLES.COACHING}><Recruitment /></ProtectedRoute>} />
                                <Route path="/finance" element={<ProtectedRoute allowedRoles={ROLES.FINANCE}><Finance /></ProtectedRoute>} />
                                <Route path="/marketing" element={<Marketing />} />
                                <Route path="/commercial" element={<Commercial />} />
                                <Route path="/inventory" element={<Inventory />} />
                                <Route path="/staff" element={<Staff />} />
                                <Route path="/tasks" element={<TeamTasks />} />
                                <Route path="/goals" element={<Goals />} />
                                <Route path="/officiating" element={<Officiating />} />
                                <Route path="/settings" element={<ProtectedRoute allowedRoles={ROLES.MASTER}><TeamSettingsPage /></ProtectedRoute>} />
                                <Route path="/admin" element={<ProtectedRoute allowedRoles={ROLES.MASTER}><AdminPanel /></ProtectedRoute>} />
                                <Route path="*" element={<Navigate to="/dashboard" replace />} />
                                </Routes>
                            </Suspense>
                        </ErrorBoundary>
                        </Layout>
                    </SystemGuard>
                } />
                </Routes>
            </Suspense>
            </HashRouter>
        </ToastProvider>
    </ErrorBoundary>
  );
};

export default Main;
