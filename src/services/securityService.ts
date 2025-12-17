
import { UserRole } from '../types';
import { authService } from './authService';

export type Permission = 
    | 'MANAGE_ROSTER'       // Criar/Editar/Deletar Jogadores
    | 'MANAGE_FINANCE'      // Criar/Editar Transações
    | 'VIEW_FINANCE'        // Ver saldo e relatórios
    | 'MANAGE_TACTICS'      // Criar Plays, Treinos
    | 'MANAGE_STAFF'        // Contratar/Demitir
    | 'EDIT_SETTINGS'       // Configurações do Time
    | 'VIEW_SENSITIVE_DOCS' // Contratos, Laudos Médicos
    | 'OFFICIATE_GAME';     // Juiz

const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
    'PLATFORM_OWNER': ['MANAGE_ROSTER', 'MANAGE_FINANCE', 'VIEW_FINANCE', 'MANAGE_TACTICS', 'MANAGE_STAFF', 'EDIT_SETTINGS', 'VIEW_SENSITIVE_DOCS', 'OFFICIATE_GAME'],
    'MASTER': ['MANAGE_ROSTER', 'MANAGE_FINANCE', 'VIEW_FINANCE', 'MANAGE_TACTICS', 'MANAGE_STAFF', 'EDIT_SETTINGS', 'VIEW_SENSITIVE_DOCS', 'OFFICIATE_GAME'],
    'HEAD_COACH': ['MANAGE_ROSTER', 'MANAGE_TACTICS', 'VIEW_SENSITIVE_DOCS'],
    'OFFENSIVE_COORD': ['MANAGE_TACTICS'],
    'DEFENSIVE_COORD': ['MANAGE_TACTICS'],
    'FINANCIAL_MANAGER': ['MANAGE_FINANCE', 'VIEW_FINANCE', 'VIEW_SENSITIVE_DOCS'],
    'MARKETING_MANAGER': [], // Apenas acesso a MKT (gerido nas pages)
    'COMMERCIAL_MANAGER': [],
    'MEDICAL_STAFF': ['VIEW_SENSITIVE_DOCS'],
    'SPORTS_DIRECTOR': ['MANAGE_ROSTER', 'MANAGE_STAFF'],
    'EQUIPMENT_MANAGER': [],
    'PLAYER': [], // Atletas têm permissões implícitas de leitura própria
    'REFEREE': ['OFFICIATE_GAME'],
    'CANDIDATE': [],
    'BROADCASTER': [] // Acesso apenas a BroadcastBooth (gerido via rota e não permissão de recurso)
};

export const securityService = {
    /**
     * Verifica se o usuário atual tem permissão para realizar uma ação.
     * @param action A ação que se deseja realizar
     * @returns boolean
     */
    can: (action: Permission): boolean => {
        const user = authService.getCurrentUser();
        if (!user) return false;

        const permissions = ROLE_PERMISSIONS[user.role] || [];
        return permissions.includes(action);
    },

    /**
     * Validação estrita que lança erro se não permitido (Para uso no Backend/Storage)
     */
    enforce: (action: Permission) => {
        if (!securityService.can(action)) {
            console.error(`🚨 SECURITY ALERT: Acesso negado para ação ${action}`);
            throw new Error(`Acesso Negado: Você não tem permissão para [${action}].`);
        }
    },

    /**
     * Verifica se o usuário é dono do recurso ou tem permissão de Admin
     */
    isOwnerOrAdmin: (resourceOwnerId: string): boolean => {
        const user = authService.getCurrentUser();
        if (!user) return false;
        
        if (user.role === 'MASTER' || user.role === 'PLATFORM_OWNER') return true;
        return user.id === resourceOwnerId;
    }
};
