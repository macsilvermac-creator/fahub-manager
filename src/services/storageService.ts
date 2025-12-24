import { auth } from './firebaseConfig';
import { signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
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

      const isFirstUser = users.length === 0;
      const initialRole = isFirstUser ? 'MASTER' : role;
      const initialStatus = isFirstUser ? 'APPROVED' : 'PENDING';

      const newUser: User = {
          id: `user-${Date.now()}`,
          email,
          name,
          role: initialRole,
          cpf: cpf || '000.000.000-00',
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

  loginWithGoogle: async (): Promise<User> => {
      try {
          const provider = new GoogleAuthProvider();
          const result = await signInWithPopup(auth, provider);
          const firebaseUser = result.user;

          const appUser: User = {
              id: firebaseUser.uid,
              email: firebaseUser.email || '',
              name: firebaseUser.displayName || 'Usuário Google',
              role: 'MASTER',
              cpf: '000.000.000-00',
              avatarUrl: firebaseUser.photoURL || `https://ui-avatars.com/api/?name=${firebaseUser.displayName}`,
              status: 'APPROVED',
              program: 'BOTH',
              isProfileComplete: true
          };

          localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(appUser));
          return appUser;
      } catch (error: any) {
          console.error("Erro no login Google:", error);
          throw new Error("Falha ao conectar com Google: " + error.message);
      }
  },

  logout: async () => {
    await signOut(auth);
    localStorage.removeItem(CURRENT_USER_KEY);
    window.location.href = '/#/login';
    window.location.reload();
  },

  getCurrentUser: (): User | null => {
    const stored = localStorage.getItem(CURRENT_USER_KEY);
    return stored ? JSON.parse(stored) : null;
  },

  updateUserStatus: (userId: string, status: 'APPROVED' | 'REJECTED', role: UserRole, program: ProgramType) => {
      const users = authService.getUsers();
      const updated = users.map(u => u.id === userId ? { ...u, status, role, program } : u);
      localStorage.setItem(USERS_LIST_KEY, JSON.stringify(updated));
  },
  
  completeUserProfile: async (userId: string) => {
      const users = authService.getUsers();
      const updated = users.map(u => u.id === userId ? { ...u, isProfileComplete: true } : u);
      localStorage.setItem(USERS_LIST_KEY, JSON.stringify(updated));
      
      const current = authService.getCurrentUser();
      if (current && current.id === userId) {
          localStorage.setItem(CURRENT_USER_KEY, JSON.stringify({ ...current, isProfileComplete: true }));
      }
  }
};