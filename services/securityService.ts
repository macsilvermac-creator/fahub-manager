
import { UserRole } from '../types';

export type FeaturePermission = 
  | 'GOVERNANCE_VIEW'    // War Room, Auditoria, Aprovações
  | 'STRATEGIC_KPI'      // Dashboards executivos de alto nível
  | 'FINANCIAL_CONTROL'  // Fluxo de caixa, Folha, Inadimplência
  | 'COMMERCIAL_CRM'     // Patrocínios, CRM, Vendas
  | 'MARKETING_CENTER'   // Social AI, Fan Portal, Academy
  | 'SPORTS_MGMT'        // GM, Roster Geral, Contratos
  | 'COACH_CONSOLE'      // Practice Plan, Tactical Lab, Drills
  | 'FIELD_OPS'          // Sideline Hub, Rotação, Súmula
  | 'HEALTH_LAB'         // Medical Records, Wellness Staff view
  | 'ATHLETE_PORTAL'     // Minha Carreira, Invoices, Playbook study
  | 'LOGISTICS_TRIP';    // Gestão de viagens e alojamento

const ROLE_PERMISSIONS: Record<UserRole, FeaturePermission[]> = {
  'MASTER': ['GOVERNANCE_VIEW', 'STRATEGIC_KPI', 'FINANCIAL_CONTROL', 'COMMERCIAL_CRM', 'MARKETING_CENTER', 'SPORTS_MGMT', 'COACH_CONSOLE', 'FIELD_OPS', 'HEALTH_LAB', 'ATHLETE_PORTAL', 'LOGISTICS_TRIP'],
  'PLATFORM_OWNER': ['GOVERNANCE_VIEW', 'STRATEGIC_KPI', 'FINANCIAL_CONTROL', 'COMMERCIAL_CRM', 'MARKETING_CENTER', 'SPORTS_MGMT', 'COACH_CONSOLE', 'FIELD_OPS', 'HEALTH_LAB', 'ATHLETE_PORTAL', 'LOGISTICS_TRIP'],
  
  'PRESIDENT': ['GOVERNANCE_VIEW', 'STRATEGIC_KPI', 'SPORTS_MGMT', 'LOGISTICS_TRIP'],
  'VICE_PRESIDENT': ['GOVERNANCE_VIEW', 'STRATEGIC_KPI', 'SPORTS_MGMT'],
  
  'FINANCIAL_DIRECTOR': ['FINANCIAL_CONTROL', 'STRATEGIC_KPI'],
  'FINANCIAL_MANAGER': ['FINANCIAL_CONTROL'],
  
  'COMMERCIAL_DIRECTOR': ['COMMERCIAL_CRM', 'STRATEGIC_KPI'],
  'COMMERCIAL_MANAGER': ['COMMERCIAL_CRM'],
  
  'MARKETING_DIRECTOR': ['MARKETING_CENTER', 'STRATEGIC_KPI'],
  'MARKETING_MANAGER': ['MARKETING_CENTER'],
  
  'SPORTS_DIRECTOR': ['SPORTS_MGMT', 'STRATEGIC_KPI', 'LOGISTICS_TRIP'],

  'HEAD_COACH': ['COACH_CONSOLE', 'FIELD_OPS', 'SPORTS_MGMT', 'HEALTH_LAB', 'LOGISTICS_TRIP'],
  'OFFENSIVE_COORD': ['COACH_CONSOLE', 'FIELD_OPS'],
  'DEFENSIVE_COORD': ['COACH_CONSOLE', 'FIELD_OPS'],
  'POSITION_COACH': ['COACH_CONSOLE'],
  
  'MEDICAL_STAFF': ['HEALTH_LAB'],
  'PHYSICAL_TRAINER': ['HEALTH_LAB', 'COACH_CONSOLE'],
  
  'PLAYER': ['ATHLETE_PORTAL'],
  'STUDENT': ['ATHLETE_PORTAL'],
  
  'REFEREE': ['FIELD_OPS'],
  'EQUIPMENT_MANAGER': ['FIELD_OPS', 'LOGISTICS_TRIP'],
  
  'STAFF': ['LOGISTICS_TRIP'],
  'BROADCASTER': ['MARKETING_CENTER'],
  'FAN': ['ATHLETE_PORTAL'],
  'CANDIDATE': [],
  'SYSTEM': ['GOVERNANCE_VIEW'],
  'ADMIN': ['GOVERNANCE_VIEW']
};

export const securityService = {
  hasAccess: (role: UserRole, permission: FeaturePermission): boolean => {
    return ROLE_PERMISSIONS[role]?.includes(permission) || false;
  },

  getRoleLabel: (role: UserRole): string => {
    const labels: Partial<Record<UserRole, string>> = {
      'MASTER': 'Platform Master',
      'PLATFORM_OWNER': 'Proprietário',
      'PRESIDENT': 'Presidente',
      'FINANCIAL_DIRECTOR': 'Dir. Financeiro',
      'COMMERCIAL_DIRECTOR': 'Dir. Comercial',
      'MARKETING_DIRECTOR': 'Dir. Marketing',
      'SPORTS_DIRECTOR': 'General Manager',
      'HEAD_COACH': 'Head Coach',
      'OFFENSIVE_COORD': 'Coord. Ofensivo',
      'DEFENSIVE_COORD': 'Coord. Defensivo',
      'PLAYER': 'Atleta Ativo',
      'MEDICAL_STAFF': 'Saúde & Performance'
    };
    return labels[role] || role.replace('_', ' ');
  }
};
