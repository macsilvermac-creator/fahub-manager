
import { User, UserRole, ProgramType } from '../types';

const CURRENT_USER_KEY = 'gridiron_current_user';
const USERS_LIST_KEY = 'gridiron_users_list';

export const authService = {
  getUsers: (): User[] => {
      const stored = localStorage.getItem(USERS_LIST_KEY);
      return stored ? JSON.parse(stored) : [];
  },

  register: async (name: string, email: string, role: UserRole, password: string, cpf: string): Promise<User> => {
      const users = authService.getUsers();
      
      if (users.some(u => u.email === email)) throw new Error('Email já cadastrado.');
      if (users.some(u => u.cpf === cpf)) throw new Error('CPF já cadastrado no sistema.');

      const isFirstUser = users.length === 0;
      const initialRole = isFirstUser ? 'MASTER' : 'CANDIDATE';
      const initialStatus = isFirstUser ? 'APPROVED' : 'PENDING';
      const initialProgram = isFirstUser ? 'BOTH' : undefined;

      const newUser: User = {
        id: `user-${Date.now()}`,
        email: email,
        name: name,
        role: initialRole,
        cpf: cpf || '000.000.000-00',
        avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`,
        status: initialStatus,
        program: initialProgram,
        isProfileComplete: isFirstUser
      };
      
      const updatedUsers = [...users, newUser];
      localStorage.setItem(USERS_LIST_KEY, JSON.stringify(updatedUsers));
      
      if(isFirstUser) {
          localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser));
      }

      return newUser;
  },

  login: async (email: string, password: string): Promise<User> => {
        // Simulação de delay de rede
        await new Promise(resolve => setTimeout(resolve, 500));
        const users = authService.getUsers();
        const user = users.find(u => u.email === email);

        // Auto-login para o admin se a base estiver vazia (desenvolvimento)
        if (!user && users.length === 0 && email.includes('@')) {
             const mockUser: User = {
                 id: 'user-admin',
                 email: email,
                 name: email.split('@')[0].toUpperCase(),
                 role: 'MASTER',
                 cpf: '000.000.000-00',
                 avatarUrl: `https://ui-avatars.com/api/?name=${email[0]}`,
                 status: 'APPROVED',
                 program: 'BOTH',
                 isProfileComplete: true
            };
            localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(mockUser));
            return mockUser;
        }

        if (!user) throw new Error('Usuário não encontrado.');
        if (user.status === 'PENDING') throw new Error('Cadastro em análise pela diretoria.');
        if (user.status === 'REJECTED') throw new Error('Acesso negado.');

        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
        return user;
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

  updateUserStatus: async (userId: string, status: 'APPROVED' | 'REJECTED', newRole?: UserRole, newProgram?: ProgramType) => {
    const users = authService.getUsers();
    const updatedUsers = users.map(u => {
        if (u.id === userId) {
            return { 
                ...u, 
                status, 
                role: newRole || u.role,
                program: newProgram || u.program,
                isProfileComplete: u.isProfileComplete || false 
            };
        }
        return u;
    });
    localStorage.setItem(USERS_LIST_KEY, JSON.stringify(updatedUsers));
  },
  
  completeUserProfile: async (userId: string) => {
      const users = authService.getUsers();
      const updatedUsers = users.map(u => {
          if (u.id === userId) {
              return { ...u, isProfileComplete: true };
          }
          return u;
      });
      localStorage.setItem(USERS_LIST_KEY, JSON.stringify(updatedUsers));
      
      const currentUser = authService.getCurrentUser();
      if (currentUser && currentUser.id === userId) {
          localStorage.setItem(CURRENT_USER_KEY, JSON.stringify({ ...currentUser, isProfileComplete: true }));
      }
  }
};
