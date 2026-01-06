import { create } from 'zustand';
import { Order, Location, Employee, OrderTab, Product } from '@/types';
import { Customer } from '@/types/response/customer';

// Helper function to persist tabs to localStorage
const persistTabs = (tabs: OrderTab[], activeTabId: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('pos_order_tabs', JSON.stringify(tabs));
    localStorage.setItem('pos_active_tab_id', activeTabId);
  }
};

interface POSStore {
  // Orders
  orders: Order[];
  setOrders: (orders: Order[]) => void;

  // Locations (Chi nhánh)
  locations: Location[];
  setLocations: (locations: Location[]) => void;
  loadLocations: () => Promise<void>;
  selectedLocationId: string | null;
  setSelectedLocation: (id: string) => void;

  // Backward compatibility
  branches: Location[];
  setBranches: (branches: Location[]) => void;
  loadBranches: () => Promise<void>;

  // Employees
  employees: Employee[];
  setEmployees: (employees: Employee[]) => void;

  // Order Tabs
  orderTabs: OrderTab[];
  activeTabId: string;
  addTab: () => void;
  removeTab: (id: string) => void;
  resetTab: (id: string) => void;
  setActiveTab: (id: string) => void;
  getActiveTab: () => OrderTab | undefined;

  // Cart Operations
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  updateItemNote: (productId: string, note: string) => void;

  // Tab Data Operations
  updateTabNote: (note: string) => void;
  updateTabPrintReceipt: (printReceipt: boolean) => void;
  updateTabTransactions: (transactions: { id: string; payment_method_id: number; payment_method_name: string; amount: number; }[]) => void;
  updateTabCustomer: (customerId: string | null, customer?: Customer | null) => void;

  // Selected entities
  selectedEmployeeId: string | null;
  selectedCustomerId: string | null;
  selectedCustomer: Customer | null;
  setSelectedEmployee: (id: string) => void;
  setSelectedCustomer: (id: string | null, customer?: Customer | null) => void;

  // Backward compatibility
  selectedBranchId: string | null;
  setSelectedBranch: (id: string) => void;
}

export const usePOSStore = create<POSStore>((set, get) => ({
  // Orders
  orders: [],
  setOrders: (orders) => set({ orders }),

  // Locations
  locations: [],
  setLocations: (locations) => set({ locations }),
  loadLocations: async () => {
    try {
      const locationService = (await import('@/services/location')).default;
      const response = await locationService.getListLocations();
      const locations = (response.locations || []).map((loc: any) => ({
        id: loc.id.toString(),
        name: loc.name,
        address: loc.address || '',
        phone: loc.phone,
        email: loc.email,
        isDefault: loc.is_default || false,
      }));
      set({ locations });

      // Try to load from localStorage first
      const { selectedLocationId } = get();
      let locationToSet = selectedLocationId;

      if (!locationToSet && typeof window !== 'undefined') {
        const savedLocationId = localStorage.getItem('pos_selected_location_id');
        if (savedLocationId && locations.find((l: any) => l.id === savedLocationId)) {
          locationToSet = savedLocationId;
        }
      }

      // Fall back to default location if still not set
      if (!locationToSet && locations.length > 0) {
        const defaultLoc = locations.find((l: any) => l.isDefault) || locations[0];
        locationToSet = defaultLoc.id;
      }

      if (locationToSet) {
        set({ selectedLocationId: locationToSet });
        if (typeof window !== 'undefined') {
          localStorage.setItem('pos_selected_location_id', locationToSet);
        }
      }
    } catch (error) {
      console.error('Error loading locations:', error);
    }
  },
  selectedLocationId: (() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('pos_selected_location_id');
      if (saved) return saved;
    }
    return null;
  })(),
  setSelectedLocation: (id) => {
    set({ selectedLocationId: id });
    if (typeof window !== 'undefined') {
      localStorage.setItem('pos_selected_location_id', id);
    }
  },

  // Backward compatibility
  get branches() { return get().locations; },
  setBranches: (branches) => set({ locations: branches }),
  loadBranches: async () => get().loadLocations(),

  // Employees
  employees: [],
  setEmployees: (employees) => set({ employees }),

  // Order Tabs - Load from localStorage or default
  orderTabs: (() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('pos_order_tabs');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error('Error parsing saved tabs:', e);
        }
      }
    }
    return [{ id: '1', name: 'Đơn 1', cart: [], transactions: [], printReceipt: true }];
  })(),
  activeTabId: (() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('pos_active_tab_id');
      if (saved) return saved;
    }
    return '1';
  })(),
  addTab: () => {
    const { orderTabs } = get();
    const newId = (orderTabs.length + 1).toString();
    const newTab: OrderTab = {
      id: newId,
      name: `Đơn ${newId}`,
      cart: [],
      transactions: [],
      printReceipt: true,
    };
    const updatedTabs = [...orderTabs, newTab];
    set({
      orderTabs: updatedTabs,
      activeTabId: newId,
    });
    persistTabs(updatedTabs, newId);
  },
  removeTab: (id) => {
    const { orderTabs, activeTabId } = get();
    if (orderTabs.length === 1) return; // Keep at least one tab
    const filteredTabs = orderTabs.filter((tab) => tab.id !== id);

    // Re-index tabs to maintain sequential naming and avoid duplicate keys
    const newTabs = filteredTabs.map((tab, index) => ({
      ...tab,
      id: (index + 1).toString(),
      name: `Đơn ${index + 1}`,
    }));

    // Find the new active tab ID
    const oldActiveIndex = orderTabs.findIndex((tab) => tab.id === activeTabId);
    const removedIndex = orderTabs.findIndex((tab) => tab.id === id);

    let newActiveTabId: string;
    if (activeTabId === id) {
      // If we're removing the active tab, switch to the previous tab or first tab
      newActiveTabId = removedIndex > 0 ? (removedIndex).toString() : '1';
    } else {
      // Adjust the active tab ID based on whether it's before or after the removed tab
      if (oldActiveIndex > removedIndex) {
        newActiveTabId = (oldActiveIndex).toString();
      } else {
        newActiveTabId = (oldActiveIndex + 1).toString();
      }
    }

    set({
      orderTabs: newTabs,
      activeTabId: newActiveTabId,
    });
    persistTabs(newTabs, newActiveTabId);
  },
  resetTab: (id) => {
    const { orderTabs, activeTabId } = get();
    const updatedTabs = orderTabs.map((tab) =>
      tab.id === id
        ? {
            ...tab,
            cart: [],
            customerId: null,
            customer: null,
            note: '',
            transactions: [],
            printReceipt: true,
          }
        : tab
    );
    set({ orderTabs: updatedTabs });
    persistTabs(updatedTabs, activeTabId);
  },
  setActiveTab: (id) => {
    set({ activeTabId: id });
    const { orderTabs } = get();
    persistTabs(orderTabs, id);
  },
  getActiveTab: () => {
    const { orderTabs, activeTabId } = get();
    return orderTabs.find((tab) => tab.id === activeTabId);
  },

  // Cart Operations
  addToCart: (product) => {
    const { orderTabs, activeTabId } = get();
    const updatedTabs = orderTabs.map((tab) => {
      if (tab.id === activeTabId) {
        const existingItem = tab.cart.find((item) => item.product.id === product.id);
        if (existingItem) {
          return {
            ...tab,
            cart: tab.cart.map((item) =>
              item.product.id === product.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
          };
        } else {
          return {
            ...tab,
            cart: [...tab.cart, { product, quantity: 1 }],
          };
        }
      }
      return tab;
    });
    set({ orderTabs: updatedTabs });
    persistTabs(updatedTabs, activeTabId);
  },
  removeFromCart: (productId) => {
    const { orderTabs, activeTabId } = get();
    const updatedTabs = orderTabs.map((tab) =>
      tab.id === activeTabId
        ? { ...tab, cart: tab.cart.filter((item) => item.product.id !== productId) }
        : tab
    );
    set({ orderTabs: updatedTabs });
    persistTabs(updatedTabs, activeTabId);
  },
  updateQuantity: (productId, quantity) => {
    const { orderTabs, activeTabId } = get();
    const updatedTabs = orderTabs.map((tab) =>
      tab.id === activeTabId
        ? {
          ...tab,
          cart: tab.cart.map((item) =>
            item.product.id === productId ? { ...item, quantity } : item
          ),
        }
        : tab
    );
    set({ orderTabs: updatedTabs });
    persistTabs(updatedTabs, activeTabId);
  },
  updateItemNote: (productId, note) => {
    const { orderTabs, activeTabId } = get();
    const updatedTabs = orderTabs.map((tab) =>
      tab.id === activeTabId
        ? {
          ...tab,
          cart: tab.cart.map((item) =>
            item.product.id === productId ? { ...item, note } : item
          ),
        }
        : tab
    );
    set({ orderTabs: updatedTabs });
    persistTabs(updatedTabs, activeTabId);
  },

  // Tab Data Operations
  updateTabNote: (note) => {
    const { orderTabs, activeTabId } = get();
    const updatedTabs = orderTabs.map((tab) =>
      tab.id === activeTabId ? { ...tab, note } : tab
    );
    set({ orderTabs: updatedTabs });
    persistTabs(updatedTabs, activeTabId);
  },
  updateTabPrintReceipt: (printReceipt) => {
    const { orderTabs, activeTabId } = get();
    const updatedTabs = orderTabs.map((tab) =>
      tab.id === activeTabId ? { ...tab, printReceipt } : tab
    );
    set({ orderTabs: updatedTabs });
    persistTabs(updatedTabs, activeTabId);
  },
  updateTabTransactions: (transactions) => {
    const { orderTabs, activeTabId } = get();
    const updatedTabs = orderTabs.map((tab) =>
      tab.id === activeTabId ? { ...tab, transactions } : tab
    );
    set({ orderTabs: updatedTabs });
    persistTabs(updatedTabs, activeTabId);
  },
  updateTabCustomer: (customerId, customer) => {
    const { orderTabs, activeTabId } = get();
    const updatedTabs = orderTabs.map((tab) =>
      tab.id === activeTabId ? { ...tab, customerId, customer: customer || null } : tab
    );
    set({ orderTabs: updatedTabs });
    persistTabs(updatedTabs, activeTabId);
  },

  // Selected entities
  selectedEmployeeId: null,
  selectedCustomerId: null,
  selectedCustomer: null,
  setSelectedEmployee: (id) => set({ selectedEmployeeId: id }),
  setSelectedCustomer: (id, customer) => set({
    selectedCustomerId: id,
    selectedCustomer: customer || null
  }),

  // Backward compatibility
  get selectedBranchId() { return get().selectedLocationId; },
  setSelectedBranch: (id) => get().setSelectedLocation(id),
}));
