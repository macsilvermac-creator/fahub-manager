import React from 'react';
import DashboardMaster from './DashboardMaster';

/**
 * PONTO DE ENTRADA DO DASHBOARD
 * Este arquivo funciona apenas como uma "Ponte" (Wrapper).
 * Ele garante que o App.tsx consiga carregar a nova interface do DashboardMaster.
 */

const Dashboard: React.FC = () => {
  return (
    <DashboardMaster />
  );
};

export default Dashboard;