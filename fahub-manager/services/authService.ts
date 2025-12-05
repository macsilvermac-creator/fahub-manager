
import { User, UserRole } from '../types';

const CURRENT_USER_KEY = 'gridiron_current_user';

// Mock de autenticação (simulado sem Firebase por enquanto para facilitar o setup)
export const authService = {
  getUsers: (): User[] => [],

  register: async (name: string, email: string, role: UserRole, password: string): Promise<User> => {
      const newUser: User = {
        id: `user-${Date.now()}`,
        email: email,
        name: name,
        role: role,
        avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`,
        status: 'APPROVED'
      };
      
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser));
      return newUser;
  },

  login: async (email: string, password: string): Promise<User> => {
        // Simulação simples: Aceita qualquer coisa para teste
        const mockUser: User = {
             id: 'user-123',
             email: email,
             name: email.split('@')[0],
             role: 'MASTER', // Assume Master para facilitar
             avatarUrl: `https://ui-avatars.com/api/?name=${email[0]}`,
             status: 'APPROVED'
        };
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(mockUser));
        return mockUser;
  },

  logout: async () => {
    localStorage.removeItem(CURRENT_USER_KEY);
    window.location.href = '/#/login'; // Força recarregamento no hash router
    window.location.reload();
  },

  getCurrentUser: (): User | null => {
    const stored = localStorage.getItem(CURRENT_USER_KEY);
    return stored ? JSON.parse(stored) : null;
  },

  updateUserStatus: async (userId: string, status: 'APPROVED' | 'REJECTED') => {
    // Mock
    console.log(`User ${userId} status updated to ${status}`);
  }
};
