'use client';

import React, { useState, useEffect } from 'react';
import { ProductCard } from '@/components/pos/product-card';
import { Cart } from '@/components/pos/cart';
import { CheckoutSummary } from '@/components/pos/checkout-summary';
import { ProductSearch } from '@/components/pos/product-search';
import { PaymentModal } from '@/components/pos/payment-modal';
import { OrderTabs } from '@/components/pos/order-tabs';
import { CustomerSearch } from '@/components/pos/customer-search';
import { BranchSelector } from '@/components/pos/branch-selector';
import { EmployeeSelector } from '@/components/pos/employee-selector';
import { Sidebar } from '@/components/layout/sidebar';
import { usePOSStore } from '@/store/pos-store';
import { mockProducts, mockBranches, mockEmployees, mockCustomers } from '@/lib/mock-data';

export default function POSPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  const { 
    products, 
    setProducts, 
    setBranches, 
    setEmployees, 
    setCustomers,
    selectedBranchId,
    selectedEmployeeId 
  } = usePOSStore();

  useEffect(() => {
    setProducts(mockProducts);
    setBranches(mockBranches);
    setEmployees(mockEmployees);
    setCustomers(mockCustomers);
  }, [setProducts, setBranches, setEmployees, setCustomers]);

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

  const canCheckout = selectedBranchId && selectedEmployeeId;

  return (
    <div className="flex h-screen bg-gray-100">
      <Sidebar />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Order Tabs */}
        <OrderTabs />
        
        {/* Main Content */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left: Product List */}
          <div className="flex-1 overflow-y-auto">
            {/* Top Bar with Branch & Employee */}
            <div className="bg-white border-b border-gray-200 p-4">
              <div className="grid grid-cols-2 gap-4 mb-4">
                <BranchSelector />
                <EmployeeSelector />
              </div>
              
              {!canCheckout && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-800">
                   Vui lòng chọn chi nhánh và nhân viên bán hàng để tiếp tục
                </div>
              )}
            </div>
            
            <div className="p-6">
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">Bán hàng</h1>
                <ProductSearch value={searchTerm} onChange={setSearchTerm} />
              </div>

              <div className="mb-6 flex gap-2 flex-wrap">
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                      selectedCategory === category
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
                    }`}
                  >
                    {category === 'all' ? 'Tất cả' : category}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {filteredProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
              
              {filteredProducts.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  Không tìm thấy sản phẩm nào
                </div>
              )}
            </div>
          </div>

          {/* Right: Cart & Checkout */}
          <div className="w-96 bg-white border-l border-gray-200 flex flex-col">
            <div className="p-4 border-b border-gray-200">
              <h2 className="text-xl font-bold mb-3">Giỏ hàng</h2>
              <CustomerSearch />
            </div>
            
            <div className="flex-1 overflow-y-auto p-4">
              <Cart />
            </div>
            
            <div className="p-4 border-t border-gray-200">
              <CheckoutSummary 
                onCheckout={() => {
                  if (!canCheckout) {
                    alert('Vui lòng chọn chi nhánh và nhân viên bán hàng!');
                    return;
                  }
                  setIsPaymentModalOpen(true);
                }} 
              />
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
