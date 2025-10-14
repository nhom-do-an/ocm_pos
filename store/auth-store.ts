import { create } from 'zustand';
import { User } from '@/types';
import { authApi, LoginRequest, UserAuthResponse } from '@/lib/api/auth-api';

interface AuthStore {
  currentUser: User | null;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  loginWithPhone: (phone: string, password: string) => Promise<boolean>;
  logout: () => void;
  getCurrentUser: () => User | null;
  loadUserFromStorage: () => void;
}

const mapApiUserToUser = (apiUser: UserAuthResponse): User => {
  return {
    id: apiUser.id.toString(),
    username: apiUser.username || apiUser.phone,
    password: '', // Don't store password
    name: apiUser.name,
    email: apiUser.email,
    role: apiUser.is_owner ? 'admin' : 'cashier',
    avatar: undefined,
  };
};

export const useAuthStore = create<AuthStore>((set, get) => ({
  currentUser: null,
  isLoading: false,
  error: null,
  
  // API login
  loginWithPhone: async (phone, password) => {
    set({ isLoading: true, error: null });
    
    try {
      const credentials: LoginRequest = { phone, password };
      const response = await authApi.login(credentials);
      
      const user = mapApiUserToUser(response);
      set({ currentUser: user, isLoading: false, error: null });
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('currentUser', JSON.stringify(user));
      }
      
      return true;
    } catch (error: any) {
      const errorMsg = error.response?.data?.message || error.message || 'Đăng nhập thất bại';
      set({ error: errorMsg, isLoading: false });
      return false;
    }
  },
  
  logout: () => {
    authApi.logout();
    set({ currentUser: null, error: null });
  },
  
  getCurrentUser: () => {
    return get().currentUser;
  },

  loadUserFromStorage: () => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('currentUser');
      if (stored) {
        try {
          const user = JSON.parse(stored);
          set({ currentUser: user });
        } catch (e) {
          console.error('Failed to parse stored user', e);
        }
      }
    }
  },
}));

