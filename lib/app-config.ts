// Application Configuration

export const appConfig = {
  // API Configuration
  api: {
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'https://ocm.alo123.net/api',
    origin: process.env.NEXT_PUBLIC_API_ORIGIN || 'https://ocm.alo123.net',
    timeout: 30000,
  },

  // Feature Flags
  features: {
    // Set to true to use real API (requires store registration)
    // Set to false to use mock data for testing
    useRealApi: process.env.NEXT_PUBLIC_USE_REAL_API === 'true' || false,
  },

  // App Info
  app: {
    name: 'OMNI POS',
    version: '1.0.0',
  },
};

// API Error Codes
export const API_ERROR_CODES = {
  STORE_NOT_REGISTERED: 9,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
} as const;

// Error Messages
export const ERROR_MESSAGES = {
  [API_ERROR_CODES.STORE_NOT_REGISTERED]: 
    'Cửa hàng chưa đăng ký trong hệ thống OCM. Vui lòng liên hệ quản trị viên để đăng ký domain của bạn.',
  [API_ERROR_CODES.UNAUTHORIZED]: 
    'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.',
  [API_ERROR_CODES.FORBIDDEN]: 
    'Bạn không có quyền truy cập tài nguyên này.',
  [API_ERROR_CODES.NOT_FOUND]: 
    'Không tìm thấy dữ liệu.',
} as const;

