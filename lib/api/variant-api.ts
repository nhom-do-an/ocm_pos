import { apiClient, ApiResponse } from '../api-config';

export interface VariantImage {
  id: number;
  url: string;
  filename: string;
  file_path: string;
}

export interface VariantResponse {
  id: number;
  product_id: number;
  product_name: string;
  title: string;
  sku: string;
  barcode: string;
  price: number;
  compare_at_price: number;
  cost_price: number;
  inventory_quantity: number;
  tracked: boolean;
  lot_management: boolean;
  requires_shipping: boolean;
  unit: string;
  weight: number;
  weight_unit: string;
  option1: string;
  option2: string;
  option3: string;
  position: number;
  image_id: number;
  image?: VariantImage;
  sold: number;
  type: 'normal' | 'combo' | 'packsize';
  created_at: string;
  updated_at: string;
}

export interface GetVariantsParams {
  key?: string; // Tìm kiếm theo SKU, barcode, tên sản phẩm
  page?: number;
  limit?: number;
}

export interface GetVariantsResponse {
  variants: VariantResponse[];
  count: number;
}

export const variantApi = {
  // Get variants list (for POS product search)
  getVariants: async (params: GetVariantsParams = {}): Promise<GetVariantsResponse> => {
    try {
      const { key = '', page = 1, limit = 100 } = params;
      
      // Use Next.js proxy to bypass CORS
      const response = await fetch(`/api/proxy/variants?key=${key}&page=${page}&limit=${limit}`);
      const data = await response.json();
      
      if (data.success) {
        console.log('✅ Loaded variants from API:', data.data.count || 0);
        return data.data;
      }
      
      console.error('❌ API Error:', data.message);
      throw new Error(data.message || 'Lấy danh sách sản phẩm thất bại');
    } catch (error: any) {
      console.error('❌ Failed to load variants:', error.message);
      throw error;
    }
  },

  // Search variants by keyword (for quick search)
  searchVariants: async (keyword: string, limit = 20): Promise<VariantResponse[]> => {
    try {
      // Use Next.js proxy to bypass CORS
      const response = await fetch(`/api/proxy/variants?key=${encodeURIComponent(keyword)}&page=1&limit=${limit}`);
      const data = await response.json();
      
      if (data.success) {
        console.log(`✅ Search "${keyword}": found ${data.data.count || 0} results`);
        return data.data.variants || [];
      }
      
      return [];
    } catch (error: any) {
      console.error('❌ Search failed:', error.message);
      return [];
    }
  },
};

