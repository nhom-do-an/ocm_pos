import { create } from 'zustand';
import { Product, CartItem, Order, Customer, Branch, Employee, OrderTab } from '@/types';
import { variantApi, VariantResponse } from '@/lib/api/variant-api';
import { locationApi, LocationResponse } from '@/lib/api/location-api';

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
  
  // API actions
  loadProducts: () => Promise<void>;
  loadBranches: () => Promise<void>;
  searchProducts: (keyword: string) => Promise<Product[]>;
  
  // Loading states
  isLoadingProducts: boolean;
  isLoadingBranches: boolean;
  
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
  isLoadingProducts: false,
  isLoadingBranches: false,
  
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
    // Calculate discount amount from percentage
    const discountAmount = subtotal * (activeTab.discount || 0) / 100;
    const afterDiscount = subtotal - discountAmount;
    const taxAmount = afterDiscount * tax;
    const total = afterDiscount + taxAmount;
    
    const customer = get().getSelectedCustomer();
    
    const newOrder: Order = {
      id: `ORD-${Date.now()}`,
      items: activeTab.cart,
      subtotal,
      tax: taxAmount,
      discount: discountAmount, // Store as amount for order history
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

  // API actions
  loadProducts: async () => {
    // Only run on client-side
    if (typeof window === 'undefined') {
      console.log('⏭️ Skipping loadProducts on server-side');
      return;
    }

    set({ isLoadingProducts: true });
    try {
      console.log('🔄 Loading products from API...');
      
      // Load first page to get total count and actual page size
      const firstPage = await variantApi.getVariants({ page: 1, limit: 100 });
      const totalCount = firstPage.count;
      const actualPageSize = firstPage.variants.length; // API may limit to 10 items
      const totalPages = Math.ceil(totalCount / actualPageSize);
      
      console.log(`📊 Total: ${totalCount} products, Page size: ${actualPageSize}, Pages needed: ${totalPages}`);
      
      let allVariants = [...firstPage.variants];
      
      // Load remaining pages if needed (max 50 pages = 500 items)
      if (totalPages > 1) {
        const maxPages = Math.min(totalPages, 50);
        console.log(`🔄 Loading ${maxPages - 1} more pages in batches...`);
        
        // Batch load 10 pages at a time to avoid overwhelming the server
        const batchSize = 10;
        for (let batchStart = 2; batchStart <= maxPages; batchStart += batchSize) {
          const batchEnd = Math.min(batchStart + batchSize - 1, maxPages);
          const promises = [];
          
          for (let page = batchStart; page <= batchEnd; page++) {
            promises.push(variantApi.getVariants({ page, limit: 100 }));
          }
          
          console.log(`   ⏳ Loading pages ${batchStart}-${batchEnd}...`);
          const results = await Promise.all(promises);
          results.forEach(result => {
            allVariants = allVariants.concat(result.variants);
          });
          console.log(`   ✅ Loaded ${allVariants.length} so far...`);
        }
      }
      
      const products = mapVariantsToProducts(allVariants);
      console.log(`✅ Loaded ${products.length} products successfully (from ${totalCount} total)`);
      set({ products, isLoadingProducts: false });
    } catch (error: any) {
      console.error('❌ Failed to load products:', error?.message || error);
      console.warn('⚠️ Using empty product list');
      set({ products: [], isLoadingProducts: false });
    }
  },

  loadBranches: async () => {
    // Only run on client-side
    if (typeof window === 'undefined') {
      console.log('⏭️ Skipping loadBranches on server-side');
      return;
    }

    set({ isLoadingBranches: true });
    try {
      console.log('🔄 Loading branches from API...');
      const locations = await locationApi.getLocations();
      const branches = mapLocationsToBranches(locations);
      console.log(`✅ Loaded ${branches.length} branches successfully`);
      set({ branches, isLoadingBranches: false });
      
      // Auto select first branch
      if (branches.length > 0 && !get().selectedBranchId) {
        set({ selectedBranchId: branches[0].id });
        console.log(`✅ Auto-selected branch: ${branches[0].name}`);
      }
    } catch (error: any) {
      console.error('❌ Failed to load branches:', error?.message || error);
      console.warn('⚠️ Using empty branch list');
      set({ branches: [], isLoadingBranches: false });
    }
  },

  searchProducts: async (keyword: string) => {
    try {
      const variants = await variantApi.searchVariants(keyword, 50);
      return mapVariantsToProducts(variants);
    } catch (error) {
      console.error('Failed to search products:', error);
      return [];
    }
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
    // Discount is now in percentage (0-100)
    const discountAmount = subtotal * (activeTab.discount || 0) / 100;
    const afterDiscount = subtotal - discountAmount;
    const taxAmount = afterDiscount * get().tax;
    return afterDiscount + taxAmount;
  },
  
  getSelectedCustomer: () => {
    const customerId = get().selectedCustomerId;
    if (!customerId) return undefined;
    return get().customers.find(c => c.id === customerId);
  },
}));

// Helper functions to map API data to app types
function mapVariantsToProducts(variants: VariantResponse[]): Product[] {
  return variants.map(v => ({
    id: v.id.toString(),
    name: v.product_name || v.title,
    price: v.price,
    category: 'Sản phẩm',
    image: v.image?.url || '/placeholder-product.jpg',
    sku: v.sku || '',
    barcode: v.barcode || '',
    stock: v.inventory_quantity || 0,
    unit: v.unit || 'cái',
  }));
}

function mapLocationsToBranches(locations: LocationResponse[]): Branch[] {
  return locations.map(l => ({
    id: l.id.toString(),
    name: l.name,
    address: l.address || 'Chưa có địa chỉ',
    phone: l.phone || '',
    email: l.email || '',
    isDefault: l.default_location,
  }));
}
