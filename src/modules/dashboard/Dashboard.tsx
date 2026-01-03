import React from 'react';
import DashboardMaster from './DashboardMaster';
import DashboardTactical from '../hc/DashboardTactical';

/**
 * PONTO DE ENTRADA DO DASHBOARD - PROTOCOLO NEXUS
 * Este arquivo funciona como um "Seletor de Contexto" (Orquestrador).
 * Ele decide qual interface renderizar com base na Persona injetada.
 */

const Dashboard: React.FC = () => {
  // Recuperação de Persona via Protocolo Nexus
  const persona = localStorage.getItem('nexus_persona');

  /**
   * LÓGICA DE SELEÇÃO HIERÁRQUICA:
   * 1. HC (Head Coach): Direcionado para a Visão Tática/Comando.
   * 2. CÚPULA ADMINISTRATIVA: Mantida na Visão Estratégica/Financeira.
   */
  if (persona === 'HC') {
    return <DashboardTactical />;
  }

  // Fallback Inviolável: MASTER, PRESIDENTE, VICE_PRES, DIR_ESPORTES e CFO
  return (
    <DashboardMaster />
  );
};

export default Dashboard;