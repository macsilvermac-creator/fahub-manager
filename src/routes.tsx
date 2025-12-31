import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './shared/components/layouts/DashboardLayout';
import Dashboard from './pages/Dashboard/Dashboard';
import AthletesList from './modules/athletes/AthletesList';

const AppRoutes = () => {
  return (
    <DashboardLayout pageTitle="FAHUB Manager">
      <Routes>
        {/* 1. Se entrar na raiz "/", redireciona para "/dashboard" */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        
        {/* 2. A rota oficial do Dashboard agora é esta */}
        <Route path="/dashboard" element={<Dashboard />} />
        
        {/* 3. A rota de Atletas continua igual */}
        <Route path="/athletes" element={<AthletesList />} />
      </Routes>
    </DashboardLayout>
  );
};

export default AppRoutes;