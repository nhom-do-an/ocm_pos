import { apiClient, ApiResponse } from '../api-config';

export interface LoginRequest {
  phone: string;
  password: string;
}

export interface UserAuthResponse {
  id: number;
  username: string;
  name: string;
  email: string;
  phone: string;
  store_id: number;
  active: boolean;
  is_owner: boolean;
  access_token: string;
  refresh_token: string;
  created_at: string;
  updated_at: string;
}

export interface UserResponse {
  id: number;
  username: string;
  name: string;
  email: string;
  phone: string;
  store_id: number;
  active: boolean;
  is_owner: boolean;
  created_at: string;
  updated_at: string;
}

export const authApi = {
  // Login
  login: async (credentials: LoginRequest): Promise<UserAuthResponse> => {
    const response = await apiClient.post<ApiResponse<UserAuthResponse>>(
      '/admin/auth/login',
      credentials
    );
    
    if (response.data.success && response.data.data) {
      // Store tokens
      localStorage.setItem('access_token', response.data.data.access_token);
      localStorage.setItem('refresh_token', response.data.data.refresh_token);
      return response.data.data;
    }
    
    throw new Error(response.data.message || 'Đăng nhập thất bại');
  },

  // Get current user info
  getMe: async (): Promise<UserResponse> => {
    const response = await apiClient.get<ApiResponse<UserResponse>>('/admin/auth/me');
    
    if (response.data.success) {
      return response.data.data;
    }
    
    throw new Error(response.data.message || 'Lấy thông tin thất bại');
  },

  // Logout
  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('currentUser');
  },
};

