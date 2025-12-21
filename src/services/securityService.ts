
import { UserRole } from '../types';

export type Permission = 
    | 'ACCESS_WAR_ROOM'      // Presidente/Vice
    | 'MANAGE_FINANCES'      // Financeiro
    | 'MANAGE_COMMERCIAL'    // Comercial
    | 'MANAGE_MARKETING'     // Marketing
    | 'MANAGE_SPORTS'        // Diretor de Esportes
    | 'OPERATE_FIELD'        // Coaches
    | 'VIEW_HEALTH'          // Medicina/Coach
    | 'EDIT_PLAYBOOK'        // Coordenadores/HC
    | 'BUY_IN_STORE'         // Atleta/Fã
    | 'ADMIN_SYSTEM';        // Master

const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
    'MASTER': ['ACCESS_WAR_ROOM', 'MANAGE_FINANCES', 'MANAGE_COMMERCIAL', 'MANAGE_MARKETING', 'MANAGE_SPORTS', 'OPERATE_FIELD', 'VIEW_HEALTH', 'EDIT_PLAYBOOK', 'ADMIN_SYSTEM'],
    'PRESIDENT': ['ACCESS_WAR_ROOM', 'MANAGE_FINANCES', 'MANAGE_COMMERCIAL', 'MANAGE_MARKETING', 'MANAGE_SPORTS', 'OPERATE_FIELD', 'VIEW_HEALTH', 'EDIT_PLAYBOOK'],
    'VICE_PRESIDENT': ['ACCESS_WAR_ROOM', 'MANAGE_FINANCES', 'MANAGE_COMMERCIAL', 'MANAGE_MARKETING', 'MANAGE_SPORTS', 'OPERATE_FIELD', 'VIEW_HEALTH', 'EDIT_PLAYBOOK'],
    'FINANCIAL_DIRECTOR': ['MANAGE_FINANCES', 'VIEW_HEALTH'],
    'COMMERCIAL_DIRECTOR': ['MANAGE_COMMERCIAL'],
    'MARKETING_DIRECTOR': ['MANAGE_MARKETING'],
    'SPORTS_DIRECTOR': ['MANAGE_SPORTS', 'VIEW_HEALTH', 'OPERATE_FIELD'],
    'HEAD_COACH': ['OPERATE_FIELD', 'VIEW_HEALTH', 'EDIT_PLAYBOOK'],
    'OFFENSIVE_COORD': ['OPERATE_FIELD', 'EDIT_PLAYBOOK'],
    'DEFENSIVE_COORD': ['OPERATE_FIELD', 'EDIT_PLAYBOOK'],
    'POSITION_COACH': ['OPERATE_FIELD'],
    'PHYSICAL_TRAINER': ['OPERATE_FIELD', 'VIEW_HEALTH'],
    'MEDICAL_STAFF': ['VIEW_HEALTH'],
    'PLAYER': ['BUY_IN_STORE'],
    'STUDENT': ['BUY_IN_STORE'],
    'FAN': ['BUY_IN_STORE'],
    'STAFF': ['OPERATE_FIELD'],
    'SYSTEM': ['ADMIN_SYSTEM']
};

export const securityService = {
    hasPermission: (role: UserRole, permission: Permission): boolean => {
        return ROLE_PERMISSIONS[role]?.includes(permission) || false;
    }
};
