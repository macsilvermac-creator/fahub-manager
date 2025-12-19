
import { UserRole, User } from '../types';

export type Permission = 
    | 'MANAGE_ROSTER'       
    | 'MANAGE_FINANCE'      
    | 'VIEW_FINANCE'        
    | 'MANAGE_TACTICS'      
    | 'MANAGE_STAFF'        
    | 'EDIT_SETTINGS'       
    | 'VIEW_SENSITIVE_DOCS' 
    | 'OFFICIATE_GAME';     

const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
    'PLATFORM_OWNER': ['MANAGE_ROSTER', 'MANAGE_FINANCE', 'VIEW_FINANCE', 'MANAGE_TACTICS', 'MANAGE_STAFF', 'EDIT_SETTINGS', 'VIEW_SENSITIVE_DOCS', 'OFFICIATE_GAME'],
    'MASTER': ['MANAGE_ROSTER', 'MANAGE_FINANCE', 'VIEW_FINANCE', 'MANAGE_TACTICS', 'MANAGE_STAFF', 'EDIT_SETTINGS', 'VIEW_SENSITIVE_DOCS', 'OFFICIATE_GAME'],
    'HEAD_COACH': ['MANAGE_ROSTER', 'MANAGE_TACTICS', 'VIEW_SENSITIVE_DOCS'],
    'OFFENSIVE_COORD': ['MANAGE_TACTICS'],
    'DEFENSIVE_COORD': ['MANAGE_TACTICS'],
    'FINANCIAL_MANAGER': ['MANAGE_FINANCE', 'VIEW_FINANCE', 'VIEW_SENSITIVE_DOCS'],
    'MARKETING_MANAGER': [], 
    'COMMERCIAL_MANAGER': [],
    'MEDICAL_STAFF': ['VIEW_SENSITIVE_DOCS'],
    'SPORTS_DIRECTOR': ['MANAGE_ROSTER', 'MANAGE_STAFF'],
    'EQUIPMENT_MANAGER': [],
    'PLAYER': [], 
    'REFEREE': ['OFFICIATE_GAME'],
    'CANDIDATE': [],
    'BROADCASTER': [],
    'FAN': [],
    // Fix: Added missing ADMIN and STUDENT roles to satisfy type checker
    'ADMIN': ['MANAGE_ROSTER', 'MANAGE_FINANCE', 'VIEW_FINANCE', 'MANAGE_TACTICS', 'MANAGE_STAFF', 'EDIT_SETTINGS', 'VIEW_SENSITIVE_DOCS', 'OFFICIATE_GAME'],
    'STUDENT': [],
    'SYSTEM': ['MANAGE_ROSTER', 'MANAGE_FINANCE', 'MANAGE_TACTICS', 'MANAGE_STAFF']
};

export const securityService = {
    can: (action: Permission): boolean => {
        const stored = localStorage.getItem('gridiron_current_user');
        if (!stored) return false;
        
        try {
            const user: User = JSON.parse(stored);
            const permissions = ROLE_PERMISSIONS[user.role] || [];
            return permissions.includes(action);
        } catch {
            return false;
        }
    },

    enforce: (action: Permission) => {
        if (!securityService.can(action)) {
            console.error(`🚨 SECURITY ALERT: Acesso negado para ação ${action}`);
            throw new Error(`Acesso Negado: Você não tem permissão para [${action}].`);
        }
    }
};
