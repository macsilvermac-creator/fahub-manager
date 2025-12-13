
import { User, UserRole, ProgramType } from '../types';
import { storageService } from './storageService';

const CURRENT_USER_KEY = 'gridiron_current_user';
const USERS_LIST_KEY = 'gridiron_users_list';

export const authService = {
  getUsers: (): User[] => {
      const stored = localStorage.getItem(USERS_LIST_KEY);
      return stored ? JSON.parse(stored) : [];
  },

  register: async (name: string, email: string, role: UserRole, password: string, cpf: string): Promise<User> => {
      const users = authService.getUsers();
      
      // Validação de Duplicidade
      if (users.some(u => u.email === email)) throw new Error('Email já cadastrado.');
      if (users.some(u => u.cpf === cpf)) throw new Error('CPF já cadastrado no sistema.');

      // Regra de Negócio: Se for o PRIMEIRO usuário do sistema, ele é MASTER automaticamente.
      // Caso contrário, é CANDIDATE e PENDING.
      const isFirstUser = users.length === 0;
      const initialRole = isFirstUser ? 'MASTER' : 'CANDIDATE';
      const initialStatus = isFirstUser ? 'APPROVED' : 'PENDING';
      const initialProgram = isFirstUser ? 'BOTH' : undefined;

      const newUser: User = {
        id: `user-${Date.now()}`,
        email: email,
        name: name,
        role: initialRole,
        cpf: cpf,
        avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`,
        status: initialStatus,
        program: initialProgram, // Master gets BOTH by default
        isProfileComplete: isFirstUser // Master starts complete, others pending
      };
      
      const updatedUsers = [...users, newUser];
      localStorage.setItem(USERS_LIST_KEY, JSON.stringify(updatedUsers));
      
      // Se for o master, já loga direto
      if(isFirstUser) {
          localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser));
      }

      return newUser;
  },

  login: async (email: string, password: string): Promise<User> => {
        // Simulação de delay
        await new Promise(resolve => setTimeout(resolve, 800));

        const users = authService.getUsers();
        const user = users.find(u => u.email === email);

        // Fallback para usuário de demonstração se a lista estiver vazia (apenas para testes)
        if (!user && users.length === 0 && email.includes('@')) {
             const mockUser: User = {
                 id: 'user-' + Math.random().toString(36).substr(2, 9),
                 email: email,
                 name: email.split('@')[0].toUpperCase(),
                 role: 'MASTER',
                 avatarUrl: `https://ui-avatars.com/api/?name=${email[0]}`,
                 status: 'APPROVED',
                 program: 'BOTH',
                 isProfileComplete: true
            };
            localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(mockUser));
            return mockUser;
        }

        if (!user) throw new Error('Usuário não encontrado.');
        
        // Bloqueio de Acesso
        if (user.status === 'PENDING') throw new Error('Cadastro em análise pela diretoria.');
        if (user.status === 'REJECTED') throw new Error('Acesso negado.');

        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
        
        // CRITICAL PERFORMANCE: Pre-warm the cache based on role
        setTimeout(() => {
            console.log("🔥 Pre-warming cache for role:", user.role);
            storageService.initializeRAM();
            storageService.syncFromCloud();
        }, 100);

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
                // O perfil continua incompleto até o usuário preencher o Onboarding
                isProfileComplete: u.isProfileComplete || false 
            };
        }
        return u;
    });
    localStorage.setItem(USERS_LIST_KEY, JSON.stringify(updatedUsers));
  },
  
  // Nova função para marcar o perfil como completo após o Onboarding
  completeUserProfile: async (userId: string) => {
      const users = authService.getUsers();
      const updatedUsers = users.map(u => {
          if (u.id === userId) {
              return { ...u, isProfileComplete: true };
          }
          return u;
      });
      localStorage.setItem(USERS_LIST_KEY, JSON.stringify(updatedUsers));
      
      // Atualiza também a sessão atual
      const currentUser = authService.getCurrentUser();
      if (currentUser && currentUser.id === userId) {
          localStorage.setItem(CURRENT_USER_KEY, JSON.stringify({ ...currentUser, isProfileComplete: true }));
      }
  }
};