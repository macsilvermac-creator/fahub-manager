import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './shared/components/layouts/DashboardLayout';
// CORREÇÃO AQUI: Apontando para a nova pasta 'modules'
import Dashboard from './modules/dashboard/Dashboard';
import AthletesList from './modules/athletes/AthletesList';

const AppRoutes = () => {
  return (
    <DashboardLayout pageTitle="FAHUB Manager">
      <Routes>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/athletes" element={<AthletesList />} />
      </Routes>
    </DashboardLayout>
  );
};

export default AppRoutes;