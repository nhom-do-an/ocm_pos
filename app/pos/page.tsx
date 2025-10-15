'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ProductCard } from '@/components/pos/product-card';
import { Cart } from '@/components/pos/cart';
import { PaymentModal } from '@/components/pos/payment-modal';
import { OrderTabs } from '@/components/pos/order-tabs';
import { CustomerSearch } from '@/components/pos/customer-search';
import { Sidebar } from '@/components/layout/sidebar';
import { ProductSearchDropdown } from '@/components/pos/product-search-dropdown';
import { AccountDropdown } from '@/components/auth/account-dropdown';
import { usePOSStore } from '@/store/pos-store';
import { mockEmployees, mockCustomers } from '@/lib/mock-data';
import { Building2, User } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export default function POSPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [printReceipt, setPrintReceipt] = useState(true);

  const {
    products,
    loadProducts,
    loadBranches,
    setEmployees,
    setCustomers,
    selectedBranchId,
    selectedEmployeeId,
    branches,
    employees,
    getActiveTab,
    setDiscount,
    setTabNote,
    getTotal,
    isLoadingProducts,
    isLoadingBranches,
  } = usePOSStore();

  const activeTab = getActiveTab();
  const total = getTotal();

  // Load data from API on mount
  useEffect(() => {
    loadProducts(); // Load products from API
    loadBranches(); // Load branches from API
    setEmployees(mockEmployees); // Still use mock employees
    setCustomers(mockCustomers); // Still use mock customers
  }, [loadProducts, loadBranches, setEmployees, setCustomers]);

  const categories = ['all', ...Array.from(new Set(products.map(p => p.category)))];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (product.barcode && product.barcode.includes(searchTerm));
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;

    const matchesBranch = !selectedBranchId ||
      (product.branchStock && product.branchStock[selectedBranchId] > 0);

    return matchesSearch && matchesCategory && matchesBranch;
  });

  const selectedBranch = branches.find(b => b.id === selectedBranchId);
  const selectedEmployee = employees.find(e => e.id === selectedEmployeeId);

  const canCheckout = selectedBranchId && selectedEmployeeId && (activeTab?.cart.length || 0) > 0;

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
      if (event.key === 'F6') {
        event.preventDefault();
        document.getElementById('discount-input')?.focus();
      }
      if (event.key === 'F9') {
        event.preventDefault();
        if (canCheckout) {
          setIsPaymentModalOpen(true);
        } else {
          if (!selectedBranchId) alert('Vui lòng chọn chi nhánh!');
          else if (!selectedEmployeeId) alert('Vui lòng chọn nhân viên bán hàng!');
          else alert('Vui lòng thêm sản phẩm vào giỏ hàng!');
        }
      }
      if (event.key === 'F10') {
        event.preventDefault();
        setPrintReceipt(prev => !prev);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [canCheckout, selectedBranchId, selectedEmployeeId]);

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header with Tabs */}
        <div className="bg-white border-b border-gray-200 shadow-sm">
          <div className="flex items-center justify-between px-4 py-3">
            <OrderTabs />
            
            {/* Right Side: Branch, Employee & Account */}
            <div className="flex items-center gap-3">
              {/* Branch Selector */}
              <div className="flex items-center gap-2 bg-blue-50 px-3 py-2 rounded-lg border border-blue-200">
                <Building2 className="w-4 h-4 text-blue-600" />
                <select
                  value={selectedBranchId}
                  onChange={(e) => usePOSStore.getState().setBranch(e.target.value)}
                  className="bg-transparent border-none text-sm font-medium focus:outline-none cursor-pointer text-gray-800"
                >
                  <option value="">Chi nhánh</option>
                  {branches.map(branch => (
                    <option key={branch.id} value={branch.id}>
                      {branch.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Employee Selector */}
              <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
                <User className="w-4 h-4 text-gray-600" />
                <select
                  value={selectedEmployeeId}
                  onChange={(e) => usePOSStore.getState().setEmployee(e.target.value)}
                  className="bg-transparent border-none text-sm font-medium focus:outline-none cursor-pointer text-gray-800 min-w-[120px]"
                >
                  <option value="">Nhân viên</option>
                  {employees.map(emp => (
                    <option key={emp.id} value={emp.id}>
                      {emp.name} ({emp.code})
                    </option>
                  ))}
                </select>
              </div>

              {/* Account Dropdown */}
              <AccountDropdown onLoginClick={() => router.push('/login')} />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left Side: Product Search + Cart */}
          <div className="flex-1 flex flex-col bg-white border-r border-gray-200 overflow-hidden">
            {/* Product Search */}
            <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
              <label className="block text-sm font-semibold text-gray-800 mb-2 flex items-center gap-2">
                <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Tìm kiếm sản phẩm (F3)
              </label>
              <ProductSearchDropdown />
            </div>

            {/* Cart Header */}
            <div className="px-4 py-3 border-b border-gray-200 bg-gray-50">
              <h2 className="text-base font-semibold text-gray-900 flex items-center gap-2">
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                Giỏ hàng 
                <span className="ml-auto text-sm font-normal text-gray-600">
                  ({activeTab?.cart.length || 0} sản phẩm)
                </span>
              </h2>
            </div>
            
            {/* Cart Items */}
            <div className="flex-1 overflow-y-auto custom-scrollbar">
              <Cart />
            </div>
          </div>

          {/* Right Side: Customer & Checkout */}
          <div className="w-[420px] flex flex-col bg-white shadow-lg">
            {/* Customer Search */}
            <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-green-50 to-emerald-50">
              <label className="block text-sm font-semibold text-gray-800 mb-2 flex items-center gap-2">
                <svg className="w-5 h-5 text-success-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Khách hàng (F4)
              </label>
              <CustomerSearch />
            </div>

            {/* Checkout Summary */}
            <div className="p-4 border-t border-gray-200 bg-gray-50 shadow-inner">
              <div className="space-y-3 mb-4">
                {/* Subtotal */}
                <div className="flex justify-between text-gray-700 text-sm">
                  <span>Tổng tiền hàng ({activeTab?.cart.length || 0} sản phẩm):</span>
                  <span className="font-medium">{formatCurrency(usePOSStore.getState().getSubtotal())}</span>
                </div>

                {/* Discount */}
                <div className="flex justify-between items-center">
                  <label htmlFor="discount-input" className="text-gray-700 text-sm">Giảm giá (%):</label>
                  <div className="relative">
                    <input
                      id="discount-input"
                      type="number"
                      value={activeTab?.discount || 0}
                      onChange={(e) => {
                        const value = Number(e.target.value);
                        if (value >= 0 && value <= 100) {
                          setDiscount(value);
                        }
                      }}
                      className="w-24 px-3 py-1.5 border border-gray-300 rounded-lg text-right text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                      min="0"
                      max="100"
                      step="0.1"
                    />
                    <span className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-gray-400 font-medium">
                      %
                    </span>
                  </div>
                </div>

                {/* Discount Amount */}
                {(activeTab?.discount || 0) > 0 && (
                  <div className="flex justify-between text-sm text-red-600">
                    <span>Số tiền giảm:</span>
                    <span className="font-medium">
                      -{formatCurrency(usePOSStore.getState().getSubtotal() * (activeTab?.discount || 0) / 100)}
                    </span>
                  </div>
                )}

                {/* VAT */}
                <div className="flex justify-between text-gray-700 text-sm">
                  <span>Thuế VAT (10%):</span>
                  <span className="font-medium">
                    {formatCurrency((usePOSStore.getState().getSubtotal() * (1 - (activeTab?.discount || 0) / 100)) * 0.1)}
                  </span>
                </div>

                {/* Total */}
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between text-xl font-bold text-primary-700">
                    <span>Khách phải trả:</span>
                    <span>{formatCurrency(total)}</span>
                  </div>
                </div>

                {/* Note */}
                <div className="pt-3">
                  <textarea
                    value={activeTab?.note || ''}
                    onChange={(e) => setTabNote(e.target.value)}
                    placeholder="Ghi chú đơn hàng..."
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all"
                    rows={2}
                  />
                </div>
              </div>

              {/* Print Receipt & Payment Button */}
              <div className="space-y-3">
                <label className="flex items-center cursor-pointer text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={printReceipt}
                    onChange={(e) => setPrintReceipt(e.target.checked)}
                    className="form-checkbox h-4 w-4 text-primary-600 rounded focus:ring-primary-500 transition-all"
                  />
                  <span className="ml-2">In hóa đơn tự động</span>
                  <span className="text-xs text-gray-400 ml-auto">F10</span>
                </label>

                <button
                  onClick={() => {
                    if (!canCheckout) {
                      if (!selectedBranchId) {
                        alert('Vui lòng chọn chi nhánh!');
                      } else if (!selectedEmployeeId) {
                        alert('Vui lòng chọn nhân viên bán hàng!');
                      } else {
                        alert('Vui lòng thêm sản phẩm vào giỏ hàng!');
                      }
                      return;
                    }
                    setIsPaymentModalOpen(true);
                  }}
                  disabled={!canCheckout}
                  className={`w-full py-3.5 rounded-xl font-bold transition-all duration-200 text-lg shadow-lg ${
                    canCheckout
                      ? 'bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600 active:scale-95 shadow-green-500/50 text-white border-2 border-green-700'
                      : 'bg-gray-300 cursor-not-allowed text-gray-500 border-2 border-gray-400'
                  }`}
                  style={{
                    color: canCheckout ? '#ffffff' : '#6b7280',
                    textShadow: canCheckout ? '0 1px 2px rgba(0,0,0,0.3)' : 'none'
                  }}
                >
                  <div className="flex items-center justify-center gap-3">
                    <span className="font-bold">Thanh toán</span>
                    <span className={`text-sm font-normal px-2 py-0.5 rounded ${
                      canCheckout ? 'bg-white/20 text-white' : 'bg-gray-400 text-gray-600'
                    }`}>F9</span>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <PaymentModal
        isOpen={isPaymentModalOpen}
        onClose={() => setIsPaymentModalOpen(false)}
      />
    </div>
  );
}
