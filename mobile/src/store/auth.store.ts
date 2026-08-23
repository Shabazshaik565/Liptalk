import { create } from 'zustand';
import { User, UserRole } from '../types';
import { secureStorage } from '../utils/secureStorage';

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isHydrated: boolean;
  isLoading: boolean;
  activeRole: UserRole;
  setAuth: (user: User, token: string) => Promise<void>;
  setUser: (user: User) => Promise<void>;
  logout: () => Promise<void>;
  switchRole: (role: UserRole) => void;
  restoreSession: () => Promise<boolean>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  token: null,
  isAuthenticated: false,
  isHydrated: false,
  isLoading: false,
  activeRole: 'BUSINESS',

  setAuth: async (user, token) => {
    await secureStorage.saveToken(token);
    await secureStorage.saveUser(user);
    set({
      user,
      token,
      isAuthenticated: true,
      isHydrated: true,
      activeRole: user.role || 'BUSINESS',
    });
  },

  setUser: async (user) => {
    await secureStorage.saveUser(user);
    set({ user, activeRole: user.role || get().activeRole });
  },

  logout: async () => {
    await secureStorage.clearAll();
    set({
      user: null,
      token: null,
      isAuthenticated: false,
      isHydrated: true,
    });
  },

  switchRole: (activeRole) => {
    const currentUser = get().user;
    if (currentUser) {
      const updated = { ...currentUser, role: activeRole };
      secureStorage.saveUser(updated);
      set({ user: updated, activeRole });
    } else {
      set({ activeRole });
    }
  },

  restoreSession: async () => {
    try {
      const token = await secureStorage.getToken();
      const user = await secureStorage.getUser();

      if (token && user) {
        set({
          token,
          user,
          isAuthenticated: true,
          isHydrated: true,
          activeRole: user.role || 'BUSINESS',
        });
        return true;
      }
    } catch (e) {
      console.warn('Error restoring secure session', e);
    }
    set({ isHydrated: true });
    return false;
  },
}));
