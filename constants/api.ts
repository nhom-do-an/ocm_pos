export const API = {
  AUTH: {
    LOGIN: 'admin/auth/login',
    REGISTER: 'admin/auth/register',
    PROFILE: 'admin/auth/me',
  },
  VARIANT: {
    GET_VARIANTS: '/admin/variants',
    GET_VARIANT_DETAIL: (variantId: number) => `/admin/variants/detail/${variantId}`,
    UPDATE_VARIANT: (variantId: number) => `/admin/variants/${variantId}`,
    DELETE_VARIANT: (variantId: number) => `/admin/variants/${variantId}`,
  },
  LOCATION: {
    LIST: '/admin/locations',
    GET_DETAIL: (id: number) => `/admin/locations/${id}`,
    CREATE: '/admin/locations',
    UPDATE: (id: number) => `/admin/locations/${id}`,
  },
  ORDER: {
    GET_ORDERS: '/admin/orders',
    CREATE_ORDER: '/admin/orders',
    GET_ORDER_DETAIL: (id: number) => `/admin/orders/${id}`,
    GET_EVENTS: (id: number) => `/admin/orders/${id}/events`,
    GET_TRANSACTIONS: (id: number) => `/admin/orders/${id}/transactions`,
    UPDATE_ORDER: (id: number) => `/admin/orders/${id}`,
    UPDATE_ORDER_ITEMS: (id: number) => `/admin/orders/${id}/items`,
    CREATE_ORDER_PAYMENTS: (id: number) => `/admin/orders/${id}/payments`,
    GET_ORDER_PRINT: (id: number) => `/admin/orders/${id}/print`,
    CANCEL_ORDER: (id: number) => `/admin/orders/${id}/cancel`,
  },
  SOURCE: {
    GET_SOURCES: '/admin/sources',
  },
  CUSTOMER: {
    GET_CUSTOMERS: '/admin/customers',
    CREATE_CUSTOMER: '/admin/customers',
    GET_CUSTOMER_DETAIL: (id: number) => `/admin/customers/${id}`,
    GET_CUSTOMER_ADDRESS_LIST: (id: number) => `/admin/customers/${id}/addresses`,
  },
  PAYMENT_METHOD: {
    GET_PAYMENT_METHODS: '/admin/payment-methods',
    GET_DETAIL: (id: number) => `/admin/payment-methods/${id}`,
    CREATE: '/admin/payment-methods',
    UPDATE: '/admin/payment-methods',
    GET_PROVIDERS: '/admin/payment-methods/providers/list',
  },
};
