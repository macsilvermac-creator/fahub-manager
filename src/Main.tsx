
import React, { Suspense, lazy } from 'react';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import LoadingScreen from './components/LoadingScreen';
import ErrorBoundary from './components/ErrorBoundary';
import { ToastProvider } from './contexts/ToastContext';

// Lazy Loading das páginas para performance extrema
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Roster = lazy(() => import('./pages/Roster'));
const Recruitment = lazy(() => import('./pages/Recruitment'));
const Login = lazy(() => import('./pages/Login'));
const Register = lazy(() => import('./pages/Register'));
const AdminPanel = lazy(() => import('./pages/AdminPanel'));
const Finance = lazy(() => import('./pages/Finance'));
const PracticePlan = lazy(() => import('./pages/PracticePlan'));
const CoachGameDay = lazy(() => import('./pages/CoachGameDay'));
const VideoAnalysis = lazy(() => import('./pages/VideoAnalysis'));
const TacticalLab = lazy(() => import('./pages/TacticalLab'));
const Marketing = lazy(() => import('./pages/Marketing'));
const MyProfile = lazy(() => import('./pages/MyProfile'));
const Academy = lazy(() => import('./pages/Academy'));
const Marketplace = lazy(() => import('./pages/Marketplace'));
const LockerRoom = lazy(() => import('./pages/LockerRoom'));
const Officiating = lazy(() => import('./pages/Officiating'));
const Resources = lazy(() => import('./pages/Resources'));
const Staff = lazy(() => import('./pages/Staff'));
const Inventory = lazy(() => import('./pages/Inventory'));
const Confederation = lazy(() => import('./pages/Confederation'));
const LeagueManager = lazy(() => import('./pages/LeagueManager'));
const Goals = lazy(() => import('./pages/Goals'));
const HelpCenter = lazy(() => import('./pages/HelpCenter'));
const GeminiPlaybook = lazy(() => import('./pages/GeminiPlaybook'));
const Onboarding = lazy(() => import('./pages/Onboarding'));

const Main: React.FC = () => {
  return (
    <ErrorBoundary>
        <ToastProvider>
            <HashRouter>
                <Suspense fallback={<div className="h-screen w-screen flex items-center justify-center bg-[#0B1120]"><LoadingScreen /></div>}>
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/onboarding" element={<Onboarding />} />
                        <Route path="/*" element={
                            <Layout>
                                <Suspense fallback={<div className="h-full w-full flex items-center justify-center"><LoadingScreen /></div>}>
                                    <Routes>
                                        {/* Core */}
                                        <Route path="/dashboard" element={<Dashboard />} />
                                        <Route path="/admin" element={<AdminPanel />} />
                                        
                                        {/* Gestão de Equipe */}
                                        <Route path="/roster" element={<Roster />} />
                                        <Route path="/staff" element={<Staff />} />
                                        <Route path="/inventory" element={<Inventory />} />
                                        <Route path="/goals" element={<Goals />} />
                                        <Route path="/finance" element={<Finance />} />
                                        <Route path="/marketplace" element={<Marketplace />} />
                                        
                                        {/* Técnico & Campo */}
                                        <Route path="/practice" element={<PracticePlan />} />
                                        <Route path="/tactical-lab" element={<TacticalLab />} />
                                        <Route path="/gemini-playbook" element={<GeminiPlaybook />} />
                                        <Route path="/video" element={<VideoAnalysis />} />
                                        <Route path="/sideline" element={<CoachGameDay />} />
                                        <Route path="/recruitment" element={<Recruitment />} />
                                        
                                        {/* Atleta & Social */}
                                        <Route path="/profile" element={<MyProfile />} />
                                        <Route path="/academy" element={<Academy />} />
                                        <Route path="/locker-room" element={<LockerRoom />} />
                                        <Route path="/communications" element={<Marketing />} />
                                        
                                        {/* Governança & Oficiais */}
                                        <Route path="/officiating" element={<Officiating />} />
                                        <Route path="/league" element={<LeagueManager />} />
                                        <Route path="/confederation" element={<Confederation />} />
                                        
                                        {/* Suporte & Arquivos */}
                                        <Route path="/resources" element={<Resources />} />
                                        <Route path="/help" element={<HelpCenter />} />
                                        
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

export default Main;
