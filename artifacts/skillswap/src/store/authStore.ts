import { create } from 'zustand';
import { User, CURRENT_USER, USERS } from '../mock/data';

interface AuthState {
  currentUser: User | null;
  isAuthenticated: boolean;
  login: (email: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  currentUser: CURRENT_USER,
  isAuthenticated: true,
  login: (email: string) => {
    const user = USERS.find(u => u.email === email) || CURRENT_USER;
    set({ currentUser: user, isAuthenticated: true });
  },
  logout: () => set({ currentUser: null, isAuthenticated: false }),
}));
