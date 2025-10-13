import { create } from 'zustand';
import { Product, CartItem, Order, Customer, Branch, Employee, OrderTab } from '@/types';

interface POSStore {
  // Multi-tab orders
  orderTabs: OrderTab[];
  activeTabId: string;
  
  // Orders & Products
  orders: Order[];
  products: Product[];
  customers: Customer[];
  branches: Branch[];
  employees: Employee[];
  
  // Current selections
  selectedBranchId: string;
  selectedEmployeeId: string;
  selectedCustomerId?: string;
  
  // Settings
  tax: number;
  
  // Tab actions
  addTab: () => void;
  removeTab: (tabId: string) => void;
  setActiveTab: (tabId: string) => void;
  updateTabName: (tabId: string, name: string) => void;
  
  // Cart actions (for active tab)
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  updateItemNote: (productId: string, note: string) => void;
  clearCart: () => void;
  
  // Discount & Note (for active tab)
  setDiscount: (discount: number) => void;
  setTabNote: (note: string) => void;
  
  // Order actions
  createOrder: (paymentMethod: 'cash' | 'card' | 'transfer') => void;
  
  // Selection actions
  setBranch: (branchId: string) => void;
  setEmployee: (employeeId: string) => void;
  setCustomer: (customerId?: string) => void;
  
  // Data actions
  setProducts: (products: Product[]) => void;
  setCustomers: (customers: Customer[]) => void;
  setBranches: (branches: Branch[]) => void;
  setEmployees: (employees: Employee[]) => void;
  addCustomer: (customer: Customer) => void;
  
  // Computed values
  getActiveTab: () => OrderTab | undefined;
  getSubtotal: () => number;
  getTotal: () => number;
  getSelectedCustomer: () => Customer | undefined;
}

export const usePOSStore = create<POSStore>((set, get) => ({
  orderTabs: [{
    id: 'tab-1',
    name: 'Đơn 1',
    cart: [],
    discount: 0,
  }],
  activeTabId: 'tab-1',
  orders: [],
  products: [],
  customers: [],
  branches: [],
  employees: [],
  selectedBranchId: '',
  selectedEmployeeId: '',
  selectedCustomerId: undefined,
  tax: 0.1,
  
  // Tab management
  addTab: () => {
    const tabs = get().orderTabs;
    const newTabId = `tab-${Date.now()}`;
    const newTab: OrderTab = {
      id: newTabId,
      name: `Đơn ${tabs.length + 1}`,
      cart: [],
      discount: 0,
    };
    set({
      orderTabs: [...tabs, newTab],
      activeTabId: newTabId,
    });
  },
  
  removeTab: (tabId) => {
    const tabs = get().orderTabs;
    if (tabs.length === 1) return; // Keep at least one tab
    
    const newTabs = tabs.filter(t => t.id !== tabId);
    const activeId = get().activeTabId;
    
    set({
      orderTabs: newTabs,
      activeTabId: activeId === tabId ? newTabs[0].id : activeId,
    });
  },
  
  setActiveTab: (tabId) => {
    set({ activeTabId: tabId });
  },
  
  updateTabName: (tabId, name) => {
    set({
      orderTabs: get().orderTabs.map(tab =>
        tab.id === tabId ? { ...tab, name } : tab
      )
    });
  },
  
  getActiveTab: () => {
    return get().orderTabs.find(t => t.id === get().activeTabId);
  },
  
  // Cart actions
  addToCart: (product) => {
    const activeTab = get().getActiveTab();
    if (!activeTab) return;
    
    const existingItem = activeTab.cart.find(item => item.product.id === product.id);
    
    if (existingItem) {
      set({
        orderTabs: get().orderTabs.map(tab =>
          tab.id === activeTab.id
            ? {
                ...tab,
                cart: tab.cart.map(item =>
                  item.product.id === product.id
                    ? { ...item, quantity: item.quantity + 1 }
                    : item
                )
              }
            : tab
        )
      });
    } else {
      set({
        orderTabs: get().orderTabs.map(tab =>
          tab.id === activeTab.id
            ? { ...tab, cart: [...tab.cart, { product, quantity: 1 }] }
            : tab
        )
      });
    }
  },
  
  removeFromCart: (productId) => {
    const activeTab = get().getActiveTab();
    if (!activeTab) return;
    
    set({
      orderTabs: get().orderTabs.map(tab =>
        tab.id === activeTab.id
          ? { ...tab, cart: tab.cart.filter(item => item.product.id !== productId) }
          : tab
      )
    });
  },
  
  updateQuantity: (productId, quantity) => {
    const activeTab = get().getActiveTab();
    if (!activeTab) return;
    
    if (quantity <= 0) {
      get().removeFromCart(productId);
      return;
    }
    
    set({
      orderTabs: get().orderTabs.map(tab =>
        tab.id === activeTab.id
          ? {
              ...tab,
              cart: tab.cart.map(item =>
                item.product.id === productId
                  ? { ...item, quantity }
                  : item
              )
            }
          : tab
      )
    });
  },
  
  updateItemNote: (productId, note) => {
    const activeTab = get().getActiveTab();
    if (!activeTab) return;
    
    set({
      orderTabs: get().orderTabs.map(tab =>
        tab.id === activeTab.id
          ? {
              ...tab,
              cart: tab.cart.map(item =>
                item.product.id === productId
                  ? { ...item, note }
                  : item
              )
            }
          : tab
      )
    });
  },
  
  clearCart: () => {
    const activeTab = get().getActiveTab();
    if (!activeTab) return;
    
    set({
      orderTabs: get().orderTabs.map(tab =>
        tab.id === activeTab.id
          ? { ...tab, cart: [], discount: 0, customerId: undefined, note: undefined }
          : tab
      )
    });
  },
  
  setDiscount: (discount) => {
    const activeTab = get().getActiveTab();
    if (!activeTab) return;
    
    set({
      orderTabs: get().orderTabs.map(tab =>
        tab.id === activeTab.id
          ? { ...tab, discount }
          : tab
      )
    });
  },
  
  setTabNote: (note) => {
    const activeTab = get().getActiveTab();
    if (!activeTab) return;
    
    set({
      orderTabs: get().orderTabs.map(tab =>
        tab.id === activeTab.id
          ? { ...tab, note }
          : tab
      )
    });
  },
  
  createOrder: (paymentMethod) => {
    const activeTab = get().getActiveTab();
    if (!activeTab || activeTab.cart.length === 0) return;
    
    const { tax, selectedBranchId, selectedEmployeeId, selectedCustomerId } = get();
    const subtotal = get().getSubtotal();
    const taxAmount = subtotal * tax;
    const total = subtotal + taxAmount - activeTab.discount;
    
    const customer = get().getSelectedCustomer();
    
    const newOrder: Order = {
      id: `ORD-${Date.now()}`,
      items: activeTab.cart,
      subtotal,
      tax: taxAmount,
      discount: activeTab.discount,
      total,
      paymentMethod,
      status: 'completed',
      createdAt: new Date(),
      customerId: selectedCustomerId,
      customerName: customer?.name,
      customerPhone: customer?.phone,
      branchId: selectedBranchId,
      employeeId: selectedEmployeeId,
      note: activeTab.note,
    };
    
    set({
      orders: [newOrder, ...get().orders],
      orderTabs: get().orderTabs.map(tab =>
        tab.id === activeTab.id
          ? { ...tab, cart: [], discount: 0, customerId: undefined, note: undefined }
          : tab
      ),
      selectedCustomerId: undefined,
    });
  },
  
  setBranch: (branchId) => {
    set({ selectedBranchId: branchId });
  },
  
  setEmployee: (employeeId) => {
    set({ selectedEmployeeId: employeeId });
  },
  
  setCustomer: (customerId) => {
    const activeTab = get().getActiveTab();
    if (!activeTab) return;
    
    set({
      selectedCustomerId: customerId,
      orderTabs: get().orderTabs.map(tab =>
        tab.id === activeTab.id
          ? { ...tab, customerId }
          : tab
      )
    });
  },
  
  setProducts: (products) => {
    set({ products });
  },
  
  setCustomers: (customers) => {
    set({ customers });
  },
  
  setBranches: (branches) => {
    set({ branches });
  },
  
  setEmployees: (employees) => {
    set({ employees });
  },
  
  addCustomer: (customer) => {
    set({ customers: [customer, ...get().customers] });
  },
  
  getSubtotal: () => {
    const activeTab = get().getActiveTab();
    if (!activeTab) return 0;
    return activeTab.cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  },
  
  getTotal: () => {
    const activeTab = get().getActiveTab();
    if (!activeTab) return 0;
    const subtotal = get().getSubtotal();
    const taxAmount = subtotal * get().tax;
    return subtotal + taxAmount - activeTab.discount;
  },
  
  getSelectedCustomer: () => {
    const customerId = get().selectedCustomerId;
    if (!customerId) return undefined;
    return get().customers.find(c => c.id === customerId);
  },
}));
