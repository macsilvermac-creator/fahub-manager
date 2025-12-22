
import { auth } from './firebaseConfig';
// @ts-ignore
import { signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
import { User, UserRole, ProgramType } from '../types';

const CURRENT_USER_KEY = 'gridiron_current_user';
const USERS_LIST_KEY = 'gridiron_users_list';

export const authService = {
  // Mantemos compatibilidade com o sistema antigo por enquanto
  getUsers: (): User[] => {
      const stored = localStorage.getItem(USERS_LIST_KEY);
      return stored ? JSON.parse(stored) : [];
  },

  register: async (name: string, email: string, role: UserRole, password: string): Promise<User> => {
      const users = authService.getUsers();
      if (users.some(u => u.email === email)) throw new Error('Email já cadastrado.');

      const isFirstUser = users.length === 0;
      const initialRole = isFirstUser ? 'MASTER' : role;
      const initialStatus = isFirstUser ? 'APPROVED' : 'PENDING';

      const newUser: User = {
          id: `user-${Date.now()}`,
          email,
          name,
          role: initialRole,
          cpf: '000.000.000-00',
          avatarUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}`,
          status: initialStatus,
          program: 'BOTH',
          isProfileComplete: isFirstUser
      };

      const updatedUsers = [...users, newUser];
      localStorage.setItem(USERS_LIST_KEY, JSON.stringify(updatedUsers));

      if (isFirstUser) {
          localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(newUser));
      }

      return newUser;
  },

  // Novo Login com Google
  loginWithGoogle: async (): Promise<User> => {
      try {
          const provider = new GoogleAuthProvider();
          const result = await signInWithPopup(auth, provider);
          const firebaseUser = result.user;

          // Cria um objeto de usuário compatível com nosso sistema
          // NOTA: No futuro, buscaremos o cargo (role) do banco de dados (Firestore)
          const appUser: User = {
              id: firebaseUser.uid,
              email: firebaseUser.email || '',
              name: firebaseUser.displayName || 'Usuário Google',
              role: 'MASTER', // Por enquanto, todo login vira MASTER para você testar
              cpf: '000.000.000-00',
              avatarUrl: firebaseUser.photoURL || `https://ui-avatars.com/api/?name=${firebaseUser.displayName}`,
              status: 'APPROVED',
              program: 'BOTH',
              isProfileComplete: true
          };

          // Salva no LocalStorage para o app continuar funcionando como antes
          localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(appUser));
          return appUser;

      } catch (error: any) {
          console.error("Erro no login Google:", error);
          throw new Error("Falha ao conectar com Google: " + error.message);
      }
  },

  // Métodos antigos mantidos para compatibilidade temporária
  login: async (email: string, password: string): Promise<User> => {
        // Fallback para login antigo se precisar
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
  },

  logout: async () => {
    await signOut(auth); // Logout do Firebase
    localStorage.removeItem(CURRENT_USER_KEY);
    window.location.href = '/#/login';
    window.location.reload();
  },

  getCurrentUser: (): User | null => {
    const stored = localStorage.getItem(CURRENT_USER_KEY);
    return stored ? JSON.parse(stored) : null;
  },

  updateUserStatus: async (userId: string, status: 'APPROVED' | 'REJECTED', newRole?: UserRole, newProgram?: ProgramType) => {
    // Implementação temporária local
    console.log("Atualizar status (Futuro: Firestore)", userId, status);
  },
  
  completeUserProfile: async (userId: string) => {
      // Implementação temporária local
      const currentUser = authService.getCurrentUser();
      if (currentUser && currentUser.id === userId) {
          localStorage.setItem(CURRENT_USER_KEY, JSON.stringify({ ...currentUser, isProfileComplete: true }));
      }
  }
};
