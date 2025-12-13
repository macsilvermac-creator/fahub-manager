
import React, { Suspense, useMemo } from 'react';
// @ts-ignore
import { HashRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import Layout from './components/Layout';
import LoadingScreen from './components/LoadingScreen';
import ErrorBoundary from './components/ErrorBoundary';
import GlobalSearch from './components/GlobalSearch';
import ProtectedRoute from './components/ProtectedRoute'; 
import { ToastProvider } from './contexts/ToastContext';
import { UserRole } from './types';
import { authService } from './services/authService';
import { storageService } from './services/storageService';

// FAHUB MANAGER v3.0
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
const PublicTeam = React.lazy(() => import('./pages/PublicTeam')); 
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
const Logistics = React.lazy(() => import('./pages/Logistics'));
const Recruitment = React.lazy(() => import('./pages/Recruitment'));
const Goals = React.lazy(() => import('./pages/Goals'));

const ROLES = {
  MASTER: ['MASTER'] as UserRole[],
  FINANCE: ['MASTER', 'FINANCIAL_MANAGER'] as UserRole[],
  COACHING: ['MASTER', 'HEAD_COACH', 'OFFENSIVE_COORD', 'DEFENSIVE_COORD'] as UserRole[],
  STAFF: ['MASTER', 'HEAD_COACH', 'OFFENSIVE_COORD', 'DEFENSIVE_COORD', 'FINANCIAL_MANAGER', 'MARKETING_MANAGER', 'COMMERCIAL_MANAGER', 'SPORTS_DIRECTOR'] as UserRole[],
  PLAYER_VIEW: ['MASTER', 'HEAD_COACH', 'PLAYER', 'OFFENSIVE_COORD', 'DEFENSIVE_COORD'] as UserRole[],
  COMMERCIAL: ['MASTER', 'COMMERCIAL_MANAGER'] as UserRole[],
  MARKETING: ['MASTER', 'MARKETING_MANAGER'] as UserRole[]
};

// Componente OTIMIZADO para Checagem de Perfil
const OnboardingCheck: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const location = useLocation();
    
    // Memoize the check result to prevent re-calculations on every render
    const shouldRedirect = useMemo(() => {
        const user = authService.getCurrentUser();
        if (user && user.status === 'APPROVED' && user.role === 'PLAYER' && location.pathname !== '/onboarding') {
            const players = storageService.getPlayers();
            // Fast check: Assume player exists if CPF matches
            const playerProfile = players.find(p => p.cpf === user.cpf);
            if (!playerProfile) {
                return true;
            }
        }
        return false;
    }, [location.pathname]); // Only re-run if location changes

    if (shouldRedirect) {
        return <Navigate to="/onboarding" replace />;
    }
    
    return <>{children}</>;
};

const Main: React.FC = () => {
  return (
    <ErrorBoundary>
        <ToastProvider>
            <HashRouter>
            <GlobalSearch />
            <Suspense fallback={<div className="h-screen w-screen flex items-center justify-center bg-[#0B1120]"><LoadingScreen /></div>}>
                <Routes>
                {/* Rotas Públicas */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/public/league" element={<PublicLeague />} />
                <Route path="/public/team" element={<PublicTeam />} /> 
                <Route path="/broadcast/:gameId" element={<BroadcastOverlay />} />
                
                {/* Onboarding Isolado */}
                <Route path="/onboarding" element={<Onboarding />} />
                
                {/* Rotas Protegidas (Com Layout/Sidebar) */}
                <Route path="/*" element={
                    <OnboardingCheck>
                        <Layout>
                        <ErrorBoundary>
                            <Suspense fallback={<div className="h-full w-full flex items-center justify-center"><LoadingScreen /></div>}>
                                <Routes>
                                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                                
                                {/* CORE */}
                                <Route path="/dashboard" element={<Dashboard />} />
                                <Route path="/profile" element={<MyProfile />} />
                                <Route path="/schedule" element={<Schedule />} />
                                <Route path="/locker-room" element={<LockerRoom />} />
                                <Route path="/academy" element={<Academy />} />
                                <Route path="/marketplace" element={<Marketplace />} />
                                <Route path="/communications" element={<Communications />} />
                                <Route path="/help" element={<HelpCenter />} />
                                <Route path="/resources" element={<Resources />} />
                                
                                {/* COACHING & OPERAÇÕES */}
                                <Route path="/roster" element={<ProtectedRoute allowedRoles={ROLES.PLAYER_VIEW}><Roster /></ProtectedRoute>} />
                                <Route path="/practice" element={<ProtectedRoute allowedRoles={ROLES.PLAYER_VIEW}><PracticePlan /></ProtectedRoute>} />
                                <Route path="/gemini-playbook" element={<ProtectedRoute allowedRoles={ROLES.PLAYER_VIEW}><GeminiPlaybook /></ProtectedRoute>} />
                                <Route path="/video" element={<ProtectedRoute allowedRoles={ROLES.PLAYER_VIEW}><VideoAnalysis /></ProtectedRoute>} />
                                <Route path="/tactical-lab" element={<ProtectedRoute allowedRoles={ROLES.COACHING}><TacticalLab /></ProtectedRoute>} />
                                <Route path="/recruitment" element={<ProtectedRoute allowedRoles={ROLES.COACHING}><Recruitment /></ProtectedRoute>} />
                                <Route path="/youth" element={<ProtectedRoute allowedRoles={ROLES.STAFF}><YouthProgram /></ProtectedRoute>} />
                                <Route path="/event-desk" element={<ProtectedRoute allowedRoles={ROLES.STAFF}><EventDesk /></ProtectedRoute>} />
                                
                                {/* OFFICE / ADMIN */}
                                <Route path="/finance" element={<ProtectedRoute allowedRoles={ROLES.FINANCE}><Finance /></ProtectedRoute>} />
                                <Route path="/commercial" element={<ProtectedRoute allowedRoles={ROLES.COMMERCIAL}><Commercial /></ProtectedRoute>} />
                                <Route path="/marketing" element={<ProtectedRoute allowedRoles={ROLES.MARKETING}><Marketing /></ProtectedRoute>} />
                                <Route path="/logistics" element={<ProtectedRoute allowedRoles={ROLES.STAFF}><Logistics /></ProtectedRoute>} />
                                <Route path="/inventory" element={<ProtectedRoute allowedRoles={ROLES.STAFF}><Inventory /></ProtectedRoute>} />
                                <Route path="/staff" element={<ProtectedRoute allowedRoles={ROLES.STAFF}><Staff /></ProtectedRoute>} />
                                <Route path="/tasks" element={<ProtectedRoute allowedRoles={ROLES.STAFF}><TeamTasks /></ProtectedRoute>} />
                                <Route path="/goals" element={<ProtectedRoute allowedRoles={ROLES.STAFF}><Goals /></ProtectedRoute>} />
                                <Route path="/settings" element={<ProtectedRoute allowedRoles={ROLES.MASTER}><TeamSettingsPage /></ProtectedRoute>} />
                                <Route path="/admin" element={<ProtectedRoute allowedRoles={ROLES.MASTER}><AdminPanel /></ProtectedRoute>} />
                                
                                {/* EXTERNAL */}
                                <Route path="/officiating" element={<Officiating />} />
                                <Route path="/league" element={<LeagueManager />} />
                                <Route path="/confederation" element={<Confederation />} />
                                <Route path="/roadmap" element={<Roadmap />} />
                                </Routes>
                            </Suspense>
                        </ErrorBoundary>
                        </Layout>
                    </OnboardingCheck>
                } />
                </Routes>
            </Suspense>
            </HashRouter>
        </ToastProvider>
    </ErrorBoundary>
  );
};

export default Main;
