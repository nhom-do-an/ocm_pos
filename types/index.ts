// POS Store Types
import { Variant } from '@/services/variant';
import { Customer } from './response/customer';

export interface Product {
    id: string;
    name: string;
    price: number;
    category: string;
    image?: string;
    sku?: string;
    barcode?: string;
    stock?: number;
    unit?: string;
    title?: string; // Variant title
}

export interface CartItem {
    product: Product;
    quantity: number;
    note?: string;
}

export interface OrderTab {
    id: string;
    name: string;
    cart: CartItem[];
    discount?: number;
    customerId?: string | null;
    customer?: Customer | null; // Customer object for this tab
    note?: string;
    transactions?: {
        id: string;
        payment_method_id: number;
        payment_method_name: string;
        amount: number;
    }[];
    printReceipt?: boolean;
}

export interface Order {
    id: string;
    items: CartItem[];
    subtotal: number;
    tax: number;
    discount: number;
    total: number;
    paymentMethod: 'cash' | 'card' | 'transfer';
    status: 'completed' | 'pending' | 'cancelled';
    createdAt: Date;
    customerId?: string;
    customerName?: string;
    customerPhone?: string;
    locationId?: string;
    employeeId?: string;
    note?: string;
}

export interface Location {
    id: string;
    name: string;
    address: string;
    phone?: string;
    email?: string;
    isDefault?: boolean;
}

// Backward compatibility
export type Branch = Location;

export interface Employee {
    id: string;
    name: string;
    email: string;
    phone?: string;
    role: string;
}

// Re-export common types
export type { Customer, Variant };
