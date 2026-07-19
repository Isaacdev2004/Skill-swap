import { create } from "zustand";
import { api } from "@/lib/api";

interface AuthUser {
  id: string;
  name: string;
  email: string;
  initials: string;
  avatarColor: string;
  bio: string;
  languages: string[];
  availability: { days: string[]; timeSlot: string };
  skillsTeach: any[];
  skillsLearn: any[];
  badges: any[];
  rating: number;
  reviewCount: number;
  verified: boolean;
  isAdmin: boolean;
  joinedAt: string;
}

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: AuthUser | null) => void;
  fetchMe: () => Promise<void>;
  logout: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,
  isLoading: true,

  setUser: (user) => set({ user, isAuthenticated: !!user, isLoading: false }),

  fetchMe: async () => {
    set({ isLoading: true });
    try {
      const { user } = await api.auth.me();
      set({ user, isAuthenticated: true, isLoading: false });
    } catch {
      set({ user: null, isAuthenticated: false, isLoading: false });
    }
  },

  logout: async () => {
    try { await api.auth.logout(); } catch {}
    set({ user: null, isAuthenticated: false });
    window.location.href = "/";
  },
}));
