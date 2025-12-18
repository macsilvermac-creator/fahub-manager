
import { User, UserRole, ProgramType } from '../types';

const CURRENT_USER_KEY = 'gridiron_current_user';
const USERS_LIST_KEY = 'gridiron_users_list';

export const authService = {
  getUsers: (): User[] => {
    const stored = localStorage.getItem(USERS_LIST_KEY);
    return stored ? JSON.parse(stored) : [];
  },

  register: async (name: string, email: string, role: UserRole, password: string): Promise<User> => {
      // Fix: Added missing properties cpf and isProfileComplete
      const newUser: User = {
        id: `user-${Date.now()}`,
        email: email,
        name: name,
        role: role,
        cpf: '000.000.000-00',
        avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`,
        status: 'APPROVED',
        isProfileComplete: true
      };
      
      const users = authService.getUsers();
      localStorage.setItem(USERS_LIST_KEY, JSON.stringify([...users, newUser]));
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser));
      return newUser;
  },

  login: async (email: string, password: string): Promise<User> => {
        const users = authService.getUsers();
        const user = users.find(u => u.email === email);

        if (user) {
            localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
            return user;
        }

        // Fix: Added missing properties cpf and isProfileComplete
        const mockUser: User = {
             id: 'user-123',
             email: email,
             name: email.split('@')[0],
             role: 'MASTER',
             cpf: '000.000.000-00',
             avatarUrl: `https://ui-avatars.com/api/?name=${email[0]}`,
             status: 'APPROVED',
             isProfileComplete: true
        };
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(mockUser));
        return mockUser;
  },

  logout: async () => {
    localStorage.removeItem(CURRENT_USER_KEY);
    window.location.href = '/#/login';
    window.location.reload();
  },

  getCurrentUser: (): User | null => {
    const stored = localStorage.getItem(CURRENT_USER_KEY);
    return stored ? JSON.parse(stored) : null;
  },

  // Fix: Added optional parameters newRole and newProgram to accept extra arguments from AdminPanel.tsx
  updateUserStatus: async (userId: string, status: 'APPROVED' | 'REJECTED', newRole?: UserRole, newProgram?: ProgramType) => {
    const users = authService.getUsers();
    const updatedUsers = users.map(u => {
        if (u.id === userId) {
            return { 
                ...u, 
                status, 
                role: newRole || u.role,
                program: newProgram || u.program
            };
        }
        return u;
    });
    localStorage.setItem(USERS_LIST_KEY, JSON.stringify(updatedUsers));
    console.log(`User ${userId} status updated to ${status}`);
  },
  
  completeUserProfile: async (userId: string) => {
    const user = authService.getCurrentUser();
    if (user && user.id === userId) {
      const updatedUser = { ...user, isProfileComplete: true };
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updatedUser));
      
      const users = authService.getUsers();
      const updatedUsers = users.map(u => u.id === userId ? { ...u, isProfileComplete: true } : u);
      localStorage.setItem(USERS_LIST_KEY, JSON.stringify(updatedUsers));
    }
  }
};
