import React from 'react';
import { Routes, Route } from 'react-router-dom';
import DashboardLayout from './shared/components/layouts/DashboardLayout';
import Dashboard from './pages/Dashboard/Dashboard'; // Certifique-se que o Dashboard.tsx está aqui
import AthletesList from './modules/athletes/AthletesList';

const AppRoutes = () => {
  return (
    <DashboardLayout pageTitle="FAHUB Manager">
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/athletes" element={<AthletesList />} />
        {/* Futuras rotas virão aqui */}
      </Routes>
    </DashboardLayout>
  );
};

export default AppRoutes;