import { apiClient, ApiResponse } from '../api-config';

export interface LocationResponse {
  id: number;
  name: string;
  code: string;
  address: string;
  phone: string;
  email: string;
  status: 'active' | 'inactive';
  default_location: boolean;
  inventory_management: boolean;
  fulfill_order: boolean;
  store_id: number;
  created_at: string;
  updated_at: string;
}

export const locationApi = {
  // Get all locations
  getLocations: async (): Promise<LocationResponse[]> => {
    try {
      // Use Next.js proxy to bypass CORS
      const response = await fetch('/api/proxy/locations');
      const data = await response.json();
      
      if (data.success) {
        console.log('✅ Loaded locations from API:', data.data?.length || 0);
        return data.data || [];
      }
      
      console.error('❌ API Error:', data.message);
      throw new Error(data.message || 'Lấy danh sách chi nhánh thất bại');
    } catch (error: any) {
      console.error('❌ Failed to load locations:', error.message);
      throw error;
    }
  },
};

