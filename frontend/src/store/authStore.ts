import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// User role definition
export type UserRole = 'buyer' | 'seller' | 'admin';

export interface User {
  userId: string;
  name: string;
  email: string;
  role: UserRole;
}

interface AuthState {
  token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  setAuth: (token: string, user: User) => void;
  logout: () => void;
}

// Global Auth Store
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      user: null,
      isAuthenticated: false,
      setAuth: (token, user) => set({ token, user, isAuthenticated: true }),
      logout: () => set({ token: null, user: null, isAuthenticated: false }),
    }),
    {
      name: 'vendorhub-auth',
    }
  )
);
