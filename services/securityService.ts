
import { UserRole } from '../types';

export type PermissionArea = 'WAR_ROOM' | 'COMMERCIAL' | 'MARKETING' | 'SPORTS' | 'SETTINGS';

const ROLE_PERMISSIONS: Record<UserRole, PermissionArea[]> = {
    'MASTER': ['WAR_ROOM', 'COMMERCIAL', 'MARKETING', 'SPORTS', 'SETTINGS'],
    'COMMERCIAL_DIRECTOR': ['COMMERCIAL'],
    'FINANCIAL_MANAGER': ['COMMERCIAL'],
    'MARKETING_DIRECTOR': ['MARKETING'],
    'SPORTS_DIRECTOR': ['SPORTS'],
    'HEAD_COACH': ['SPORTS'],
    'PLAYER': ['SPORTS'],
    'STAFF': ['SPORTS'],
    'CANDIDATE': [],
    'PRESIDENT': ['WAR_ROOM', 'COMMERCIAL', 'MARKETING', 'SPORTS', 'SETTINGS'],
    'VICE_PRESIDENT': ['WAR_ROOM', 'COMMERCIAL', 'MARKETING', 'SPORTS', 'SETTINGS'],
    'FINANCIAL_DIRECTOR': ['COMMERCIAL'],
    'COMMERCIAL_MANAGER': ['COMMERCIAL'],
    'MARKETING_MANAGER': ['MARKETING'],
    'OFFENSIVE_COORD': ['SPORTS'],
    'DEFENSIVE_COORD': ['SPORTS'],
    'POSITION_COACH': ['SPORTS'],
    'PHYSICAL_TRAINER': ['SPORTS'],
    'MEDICAL_STAFF': ['SPORTS'],
    'REFEREE': ['SPORTS'],
    'EQUIPMENT_MANAGER': ['SPORTS'],
    'PLATFORM_OWNER': ['WAR_ROOM', 'COMMERCIAL', 'MARKETING', 'SPORTS', 'SETTINGS'],
    'BROADCASTER': ['MARKETING'],
    'STUDENT': ['SPORTS'],
    'FAN': ['MARKETING'],
    'SYSTEM': ['WAR_ROOM', 'COMMERCIAL', 'MARKETING', 'SPORTS', 'SETTINGS'],
    'ADMIN': ['WAR_ROOM', 'COMMERCIAL', 'MARKETING', 'SPORTS', 'SETTINGS']
};

export const securityService = {
    canAccess: (role: UserRole, area: PermissionArea): boolean => {
        return ROLE_PERMISSIONS[role]?.includes(area) || false;
    },
    
    getDirectorateLabel: (role: UserRole): string => {
        switch(role) {
            case 'MASTER': return 'Presidência';
            case 'COMMERCIAL_DIRECTOR': return 'Diretoria Comercial';
            case 'MARKETING_DIRECTOR': return 'Diretoria de Marketing';
            case 'SPORTS_DIRECTOR': return 'Diretoria de Esportes';
            case 'PRESIDENT': return 'Presidência';
            case 'HEAD_COACH': return 'Comissão Técnica';
            case 'PLAYER': return 'Atleta';
            default: return 'Acesso Restrito';
        }
    }
};
