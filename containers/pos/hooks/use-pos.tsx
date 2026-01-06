'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { usePOSStore } from '@/store/pos-store';
import { useAuthStore } from '@/store/auth-store';
import customerService from '@/services/customer';
import variantService, { Variant } from '@/services/variant';
import sourceService from '@/services/source';
import paymentMethodService from '@/services/paymentMethod';
import orderService from '@/services/order';
import { Customer } from '@/types/response/customer';
import { PaymentMethod } from '@/types/response/payment-method';
import { Source } from '@/types/response/source';
import { EDeliveryMethod, EFulfillmentShipmentStatus, ETransactionStatus } from '@/types/enums/enum';
import { CreateOrderRequest, CreateLineItemRequest, CreateTransactionRequest } from '@/types/request/order';

// Transaction type for payment modal
export interface Transaction {
  id: string;
  payment_method_id: number;
  payment_method_name: string;
  amount: number;
}

export const usePos = () => {
  const router = useRouter();
  const { currentUser } = useAuthStore();
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);

  // Data states
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [variants, setVariants] = useState<Variant[]>([]);
  const [sources, setSources] = useState<Source[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);

  // Loading states
  const [isLoadingCustomers, setIsLoadingCustomers] = useState(false);
  const [isLoadingVariants, setIsLoadingVariants] = useState(false);
  const [isLoadingSources, setIsLoadingSources] = useState(false);
  const [isLoadingPaymentMethods, setIsLoadingPaymentMethods] = useState(false);
  const [isCreatingOrder, setIsCreatingOrder] = useState(false);

  const {
    loadBranches,
    selectedBranchId,
    branches,
    getActiveTab,
    updateTabPrintReceipt,
    updateTabTransactions,
    removeTab,
    resetTab,
    orderTabs,
  } = usePOSStore();

  const activeTab = getActiveTab();

  // Get printReceipt and transactions from active tab
  const printReceipt = activeTab?.printReceipt ?? true;
  const transactions = activeTab?.transactions || [];

  // Calculate subtotal
  const subtotal = (activeTab?.cart || []).reduce((sum, item) => {
    return sum + (item.product.price * item.quantity);
  }, 0);

  // Calculate total (can add discount, tax later)
  const total = subtotal;

  // Load tabs from localStorage and initial data on mount
  useEffect(() => {

    const loadInitialData = async () => {
      await loadBranches();
      await loadSources();
      await loadPaymentMethods();
    };

    loadInitialData();
  }, [loadBranches]);

  // Set default branch after branches are loaded
  useEffect(() => {
    if (branches.length > 0 && !selectedBranchId) {
      const defaultBranch = branches.find(b => b.isDefault) || branches[0];
      if (defaultBranch) {
      }
    }
  }, [branches, selectedBranchId]);

  // Load sources
  const loadSources = async () => {
    try {
      setIsLoadingSources(true);
      const data = await sourceService.getListSources();
      setSources(data);
    } catch (error) {
      console.error('Failed to load sources:', error);
    } finally {
      setIsLoadingSources(false);
    }
  };

  // Load payment methods
  const loadPaymentMethods = async () => {
    try {
      setIsLoadingPaymentMethods(true);
      const data = await paymentMethodService.getListPaymentMethods();
      setPaymentMethods(data || []);
    } catch (error) {
      console.error('Failed to load payment methods:', error);
    } finally {
      setIsLoadingPaymentMethods(false);
    }
  };

  // Load customers with search
  const loadCustomers = async (searchKey?: string) => {
    try {
      setIsLoadingCustomers(true);
      const data = await customerService.getListCustomers({
        page: 1,
        limit: 50,
        key: searchKey,
      });
      setCustomers(data.customers || []);
    } catch (error) {
      console.error('Failed to load customers:', error);
    } finally {
      setIsLoadingCustomers(false);
    }
  };

  // Load variants with search
  const loadVariants = async (searchKey?: string) => {
    try {
      setIsLoadingVariants(true);
      const data = await variantService.getListVariants({
        page: 1,
        size: 100,
        key: searchKey,
      });
      setVariants(data.variants || []);
    } catch (error) {
      console.error('Failed to load variants:', error);
    } finally {
      setIsLoadingVariants(false);
    }
  };

  // Check if all cart items have stock > 0
  const hasValidStock = (activeTab?.cart || []).every(item => (item.product.stock || 0) > 0);

  // Can checkout when: has products in cart
  // Branch, user, customer, and transactions can be added/modified later
  const canCheckout = (activeTab?.cart.length || 0) > 0;

  // Can finalize payment: must have branch, user, customer, valid stock, and at least one transaction
  const canFinalizePayment =
    selectedBranchId &&
    currentUser &&
    activeTab?.customerId &&
    hasValidStock &&
    transactions.length > 0;

  // Add transaction
  const addTransaction = useCallback((transaction: Transaction) => {
    const newTransactions = [...transactions, transaction];
    updateTabTransactions(newTransactions);
  }, [transactions, updateTabTransactions]);

  // Remove transaction
  const removeTransaction = useCallback((transactionId: string) => {
    const newTransactions = transactions.filter(t => t.id !== transactionId);
    updateTabTransactions(newTransactions);
  }, [transactions, updateTabTransactions]);

  // Handle payment click - create order
  const handlePaymentClick = useCallback(async () => {
    console.log("active tab", activeTab);
    // Validate all requirements before creating order
    if (!selectedBranchId) {
      alert('Vui lòng chọn chi nhánh!');
      return;
    }

    if (!currentUser) {
      alert('Vui lòng đăng nhập!');
      return;
    }

    if (!activeTab || activeTab.cart.length === 0) {
      alert('Vui lòng thêm sản phẩm vào giỏ hàng!');
      return;
    }

    if (!hasValidStock) {
      alert('Có sản phẩm hết hàng trong giỏ hàng!');
      return;
    }



    if (!activeTab.customerId) {
      alert('Vui lòng chọn khách hàng để thanh toán!');
      return;
    }

    if (transactions.length === 0) {
      alert('Vui lòng thêm phương thức thanh toán!');
      return;
    }

    try {
      setIsCreatingOrder(true);

      // Find POS source
      const posSource = sources.find(s => s.alias === 'pos');
      if (!posSource) {
        alert('Không tìm thấy nguồn đơn hàng POS!');
        return;
      }

      // Prepare line items
      const line_items: CreateLineItemRequest[] = activeTab.cart.map((item: any) => ({
        variant_id: parseInt(item.product.id),
        quantity: item.quantity,
        note: item.note,
        price: item.product.price,
      }));

      // Prepare transactions
      const orderTransactions: CreateTransactionRequest[] = transactions.map(t => ({
        amount: t.amount,
        status: ETransactionStatus.Success,
        payment_method_id: t.payment_method_id,
      }));

      // Prepare order request with required fields
      const orderRequest: CreateOrderRequest = {
        assignee_id: currentUser.id,
        customer_id: parseInt(activeTab.customerId!),
        location_id: parseInt(selectedBranchId),
        source_id: posSource.id,
        note: activeTab.note || '',
        line_items,
        transactions: orderTransactions,

        shipping_lines: [],
        fulfillment: {
          delivery_method: EDeliveryMethod.PICKUP,
          delivery_status: EFulfillmentShipmentStatus.DELIVERED,
          note: 'Lấy hàng tại cửa hàng',
          send_notification: false,
        },
      };

      // Create order
      const createdOrder = await orderService.createOrder(orderRequest);

      // Success message
      alert('Tạo đơn hàng thành công!');

      // Close payment modal
      setIsPaymentModalOpen(false);

      // Function to cleanup tab after printing (or immediately if no print)
      const cleanupTab = () => {
        if (activeTab?.id) {
          if (orderTabs.length > 1) {
            // If there are multiple tabs, remove the current one
            removeTab(activeTab.id);
          } else {
            // If this is the only tab, reset it instead of removing
            resetTab(activeTab.id);
          }
        }
      };

      // If print receipt is enabled, print using iframe method
      if (printReceipt && createdOrder.id) {
        try {
          const htmlContent = await orderService.getOrderPrint(createdOrder.id);

          // Tạo iframe ẩn để in
          const iframe = document.createElement('iframe');
          iframe.style.position = 'fixed';
          iframe.style.right = '0';
          iframe.style.bottom = '0';
          iframe.style.width = '0';
          iframe.style.height = '0';
          iframe.style.border = '0';
          document.body.appendChild(iframe);

          // Ghi HTML vào iframe
          const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
          if (iframeDoc) {
            iframeDoc.open();
            iframeDoc.write(htmlContent);
            iframeDoc.close();

            // Đợi một chút để đảm bảo nội dung đã load
            setTimeout(() => {
              iframe.contentWindow?.focus();
              iframe.contentWindow?.print();

              // Listen for afterprint event to cleanup tab when print dialog closes
              const afterPrintHandler = () => {
                document.body.removeChild(iframe);
                cleanupTab(); // Cleanup tab after print dialog closes
                iframe.contentWindow?.removeEventListener('afterprint', afterPrintHandler);
              };

              // Add event listener for when print dialog closes
              iframe.contentWindow?.addEventListener('afterprint', afterPrintHandler);

              // Fallback: cleanup after 30 seconds if afterprint doesn't fire
              setTimeout(() => {
                if (document.body.contains(iframe)) {
                  document.body.removeChild(iframe);
                  cleanupTab();
                  iframe.contentWindow?.removeEventListener('afterprint', afterPrintHandler);
                }
              }, 30000);
            }, 250);
          }
        } catch (printError) {
          console.error('Failed to print receipt:', printError);
          alert('In hóa đơn thất bại, vui lòng thử lại!');
          cleanupTab(); // Cleanup tab even if print fails
        }
      } else {
        // No print needed, cleanup tab immediately
        cleanupTab();
      }

    } catch (error: any) {
      console.error('Failed to create order:', error);
      alert(error.response?.data?.message || 'Tạo đơn hàng thất bại!');
    } finally {
      setIsCreatingOrder(false);
    }
  }, [activeTab, sources, transactions, currentUser, selectedBranchId, printReceipt, hasValidStock, setIsPaymentModalOpen, removeTab, resetTab, orderTabs]);

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'F3') {
        event.preventDefault();
        document.getElementById('product-search-input')?.focus();
      }
      if (event.key === 'F4') {
        event.preventDefault();
        document.getElementById('customer-search-input')?.focus();
      }
      if (event.key === 'F9') {
        event.preventDefault();
        handlePaymentClick();
      }
      if (event.key === 'F10') {
        event.preventDefault();
        updateTabPrintReceipt(!printReceipt);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [printReceipt, updateTabPrintReceipt, handlePaymentClick]);

  return {
    // State
    printReceipt,
    activeTab,
    selectedBranchId,
    branches,
    canCheckout,
    canFinalizePayment,
    isPaymentModalOpen,
    hasValidStock,

    // Calculations
    subtotal,
    total,

    // Data
    customers,
    variants,
    sources,
    paymentMethods,
    transactions,

    // Loading states
    isLoadingCustomers,
    isLoadingVariants,
    isLoadingSources,
    isLoadingPaymentMethods,
    isCreatingOrder,

    // Actions
    setIsPaymentModalOpen,
    setPrintReceipt: updateTabPrintReceipt,
    loadCustomers,
    loadVariants,
    addTransaction,
    removeTransaction,
    handlePaymentClick,
    router,
  };
};
