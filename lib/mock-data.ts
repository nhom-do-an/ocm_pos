import { Branch, Employee, Customer, Product, User } from '@/types';

export const mockBranches: Branch[] = [
  {
    id: 'BR001',
    name: 'Chi nhánh Quận 1',
    address: '123 Nguyễn Huệ, Quận 1, TP.HCM',
    phone: '0283822123',
    manager: 'Nguyễn Văn A',
  },
  {
    id: 'BR002',
    name: 'Chi nhánh Quận 3',
    address: '456 Võ Văn Tần, Quận 3, TP.HCM',
    phone: '0283822456',
    manager: 'Trần Thị B',
  },
  {
    id: 'BR003',
    name: 'Chi nhánh Tân Bình',
    address: '789 Cộng Hòa, Tân Bình, TP.HCM',
    phone: '0283822789',
    manager: 'Lê Văn C',
  },
];

export const mockEmployees: Employee[] = [
  {
    id: 'EMP001',
    name: 'Nguyễn Văn A',
    code: 'NV001',
    role: 'manager',
    branchId: 'BR001',
    phone: '0901234567',
    email: 'nguyenvana@omni.vn',
  },
  {
    id: 'EMP002',
    name: 'Trần Thị B',
    code: 'NV002',
    role: 'manager',
    branchId: 'BR002',
    phone: '0901234568',
    email: 'tranthib@omni.vn',
  },
  {
    id: 'EMP003',
    name: 'Lê Văn C',
    code: 'NV003',
    role: 'manager',
    branchId: 'BR003',
    phone: '0901234569',
    email: 'levanc@omni.vn',
  },
  {
    id: 'EMP004',
    name: 'Phạm Thị D',
    code: 'NV004',
    role: 'cashier',
    branchId: 'BR001',
    phone: '0901234570',
  },
  {
    id: 'EMP005',
    name: 'Hoàng Văn E',
    code: 'NV005',
    role: 'cashier',
    branchId: 'BR001',
    phone: '0901234571',
  },
  {
    id: 'EMP006',
    name: 'Ngô Thị F',
    code: 'NV006',
    role: 'cashier',
    branchId: 'BR002',
    phone: '0901234572',
  },
];

export const mockCustomers: Customer[] = [
  {
    id: 'CUS001',
    name: 'Khách lẻ',
    phone: '0000000000',
    totalPurchases: 0,
    points: 0,
    createdAt: new Date('2024-01-01'),
  },
  {
    id: 'CUS002',
    name: 'Trần Minh Tuấn',
    phone: '0912345678',
    email: 'tuantm@gmail.com',
    address: '123 Lê Lai, Q1, HCM',
    totalPurchases: 15,
    points: 1500,
    createdAt: new Date('2024-01-15'),
  },
  {
    id: 'CUS003',
    name: 'Nguyễn Thu Hà',
    phone: '0987654321',
    email: 'hant@gmail.com',
    address: '456 Hai Bà Trưng, Q3, HCM',
    totalPurchases: 28,
    points: 3200,
    createdAt: new Date('2024-02-01'),
  },
  {
    id: 'CUS004',
    name: 'Lê Hoàng Nam',
    phone: '0909123456',
    totalPurchases: 7,
    points: 850,
    createdAt: new Date('2024-03-10'),
  },
  {
    id: 'CUS005',
    name: 'Phạm Thị Lan',
    phone: '0938765432',
    email: 'lanpt@gmail.com',
    totalPurchases: 42,
    points: 5600,
    createdAt: new Date('2023-12-01'),
  },
];

export const mockProducts: Product[] = [
  { 
    id: '1', 
    name: 'Cà phê đen', 
    price: 25000, 
    category: 'Đồ uống', 
    stock: 100, 
    sku: 'CF001',
    barcode: '8934567890123',
    branchStock: { 'BR001': 40, 'BR002': 35, 'BR003': 25 }
  },
  { 
    id: '2', 
    name: 'Cà phê sữa', 
    price: 30000, 
    category: 'Đồ uống', 
    stock: 100, 
    sku: 'CF002',
    barcode: '8934567890124',
    branchStock: { 'BR001': 45, 'BR002': 30, 'BR003': 25 }
  },
  { 
    id: '3', 
    name: 'Trà sữa trân châu', 
    price: 35000, 
    category: 'Đồ uống', 
    stock: 80, 
    sku: 'TS001',
    barcode: '8934567890125',
    branchStock: { 'BR001': 30, 'BR002': 28, 'BR003': 22 }
  },
  { 
    id: '4', 
    name: 'Bánh mì thịt', 
    price: 20000, 
    category: 'Đồ ăn', 
    stock: 50, 
    sku: 'BM001',
    barcode: '8934567890126',
    branchStock: { 'BR001': 20, 'BR002': 18, 'BR003': 12 }
  },
  { 
    id: '5', 
    name: 'Bánh mì trứng', 
    price: 15000, 
    category: 'Đồ ăn', 
    stock: 50, 
    sku: 'BM002',
    barcode: '8934567890127',
    branchStock: { 'BR001': 22, 'BR002': 15, 'BR003': 13 }
  },
  { 
    id: '6', 
    name: 'Phở bò', 
    price: 50000, 
    category: 'Đồ ăn', 
    stock: 30, 
    sku: 'PH001',
    barcode: '8934567890128',
    branchStock: { 'BR001': 12, 'BR002': 10, 'BR003': 8 }
  },
  { 
    id: '7', 
    name: 'Nước cam', 
    price: 20000, 
    category: 'Đồ uống', 
    stock: 60, 
    sku: 'NC001',
    barcode: '8934567890129',
    branchStock: { 'BR001': 25, 'BR002': 20, 'BR003': 15 }
  },
  { 
    id: '8', 
    name: 'Sinh tố bơ', 
    price: 35000, 
    category: 'Đồ uống', 
    stock: 40, 
    sku: 'ST001',
    barcode: '8934567890130',
    branchStock: { 'BR001': 18, 'BR002': 12, 'BR003': 10 }
  },
];

// Mock users removed - using real API authentication
