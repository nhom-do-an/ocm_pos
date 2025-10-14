export interface Product {
  id: string;
  name: string;
  price: number;
  image?: string;
  category: string;
  stock: number;
  sku: string;
  barcode?: string;
  branchStock?: { [branchId: string]: number };
}

export interface CartItem {
  product: Product;
  quantity: number;
  note?: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  total: number;
  subtotal: number;
  tax: number;
  discount: number;
  paymentMethod: 'cash' | 'card' | 'transfer';
  status: 'pending' | 'completed' | 'cancelled';
  createdAt: Date;
  customerName?: string;
  customerPhone?: string;
  customerId?: string;
  branchId: string;
  employeeId: string;
  note?: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  address?: string;
  totalPurchases: number;
  points?: number;
  createdAt: Date;
}

export interface Branch {
  id: string;
  name: string;
  address: string;
  phone: string;
  manager?: string;
}

export interface Employee {
  id: string;
  name: string;
  code: string;
  role: 'admin' | 'cashier' | 'manager';
  branchId: string;
  phone?: string;
  email?: string;
}

export interface OrderTab {
  id: string;
  name: string;
  cart: CartItem[];
  customerId?: string;
  note?: string;
  discount: number;
}

export interface User {
  id: string;
  username: string;
  password: string;
  name: string;
  email: string;
  role: 'admin' | 'manager' | 'cashier';
  branchId?: string;
  avatar?: string;
}