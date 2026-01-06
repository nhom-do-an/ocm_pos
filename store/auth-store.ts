import { create } from 'zustand';
import authService from '@/services/auth';
import { TAuthResponse, TUserResponse } from '@/types/response/auth';
import { TLoginRequest } from '@/types/request/auth';

interface AuthStore {
  currentUser: TAuthResponse | null;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;

  // Actions
  loginWithPhone: (phone: string, password: string) => Promise<boolean>;
  logout: () => void;
  getCurrentUser: () => TAuthResponse | null;
  initAuth: () => Promise<void>;
  checkAuth: () => Promise<boolean>;
}

export const useAuthStore = create<AuthStore>((set, get) => ({
  currentUser: null,
  isLoading: false,
  isInitialized: false,
  error: null,

  // Initialize auth - check token and load user
  initAuth: async () => {
    if (typeof window === 'undefined') return;

    const token = localStorage.getItem('access_token');
    if (!token) {
      set({ isInitialized: true });
      return;
    }

    set({ isLoading: true });

    try {
      // Call API to get current user profile
      const userProfile = await authService.getProfile();

      // Tạo auth response từ profile và token
      const authResponse: TAuthResponse = {
        ...userProfile,
        access_token: token,
        refresh_token: localStorage.getItem('refresh_token') || '',
      };

      set({
        currentUser: authResponse,
        isLoading: false,
        isInitialized: true,
        error: null
      });

    } catch (error: any) {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');

      set({
        currentUser: null,
        isLoading: false,
        isInitialized: true,
        error: 'Session expired'
      });
    }
  },

  // Check if user is authenticated
  checkAuth: async (): Promise<boolean> => {
    if (typeof window === 'undefined') return false;

    const token = localStorage.getItem('access_token');
    if (!token) return false;

    // If already has current user, return true
    if (get().currentUser) return true;

    // Try to load user from API
    try {
      const userProfile = await authService.getProfile();
      const authResponse: TAuthResponse = {
        ...userProfile,
        access_token: token,
        refresh_token: localStorage.getItem('refresh_token') || '',
      };
      set({ currentUser: authResponse });
      return true;
    } catch (error) {
      return false;
    }
  },

  // API login
  loginWithPhone: async (phone, password) => {
    set({ isLoading: true, error: null });

    try {
      const credentials: TLoginRequest = { phone, password };
      const response = await authService.login(credentials);

      // Store tokens
      if (typeof window !== 'undefined') {
        localStorage.setItem('access_token', response.access_token);
        localStorage.setItem('refresh_token', response.refresh_token);
      }

      set({ currentUser: response, isLoading: false, error: null });

      return true;
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || error.message || 'Đăng nhập thất bại';
      set({ error: errorMsg, isLoading: false });
      return false;
    }
  },

  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    }
    set({ currentUser: null, error: null });
  },

  getCurrentUser: () => {
    return get().currentUser;
  },
}));

