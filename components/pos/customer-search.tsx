'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Search, UserPlus, X } from 'lucide-react';
import { usePOSStore } from '@/store/pos-store';
import { Customer } from '@/types/response/customer';
import { AddCustomerModal } from '@/components/customer/add-customer-modal';
import customerService from '@/services/customer';
import { toast } from 'sonner';

export const CustomerSearch: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const { getActiveTab, setSelectedCustomer, updateTabCustomer } = usePOSStore();

  // Get customer from active tab instead of global store
  const activeTab = getActiveTab();
  const selectedCustomer = activeTab?.customer || null;

  // Search customers from API
  const searchCustomers = async (searchKey: string, pageNum: number = 1, append: boolean = false) => {
    setIsLoading(true);
    try {
      const response = await customerService.getListCustomers({
        key: searchKey,
        limit: 20,
        page: pageNum,
      });
      const newCustomers = response.customers || [];

      if (append) {
        setCustomers(prev => [...prev, ...newCustomers]);
      } else {
        setCustomers(newCustomers);
      }

      setHasMore(newCustomers.length === 20);
    } catch (error) {
      console.error('Error searching customers:', error);
      toast.error('Lỗi khi tìm kiếm khách hàng');
      if (!append) setCustomers([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Load initial customers when focus
  const loadInitialCustomers = useCallback(() => {
    if (customers.length === 0) {
      setPage(1);
      searchCustomers('', 1, false);
    }
  }, [customers.length]);

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      setHasMore(true);
      searchCustomers(searchTerm, 1, false);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Infinite scroll handler
  const handleScroll = useCallback(() => {
    if (!scrollRef.current || isLoading || !hasMore) return;

    const { scrollTop, scrollHeight, clientHeight } = scrollRef.current;
    if (scrollTop + clientHeight >= scrollHeight - 50) {
      const nextPage = page + 1;
      setPage(nextPage);
      searchCustomers(searchTerm, nextPage, true);
    }
  }, [isLoading, hasMore, page, searchTerm]);

  // Handle customer selection
  const handleSelectCustomer = (customer: Customer) => {
    const customerId = customer.id?.toString() || null;
    setSelectedCustomer(customerId, customer);
    updateTabCustomer(customerId, customer); // Update active tab's customerId and customer object
    setSearchTerm('');
    setIsOpen(false);
    setSelectedIndex(0);
  };

  // Clear selected customer
  const handleClearCustomer = () => {
    setSelectedCustomer(null, null);
    updateTabCustomer(null); // Clear active tab's customerId
    setSearchTerm('');
    inputRef.current?.focus();
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || customers.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev =>
          prev < customers.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : 0);
        break;
      case 'Enter':
        e.preventDefault();
        if (customers[selectedIndex]) {
          handleSelectCustomer(customers[selectedIndex]);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSearchTerm('');
        break;
    }
  };

  // Handle F4 shortcut
  useEffect(() => {
    const handleGlobalKeydown = (e: KeyboardEvent) => {
      if (e.key === 'F4') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };

    document.addEventListener('keydown', handleGlobalKeydown);
    return () => document.removeEventListener('keydown', handleGlobalKeydown);
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      {selectedCustomer ? (
        // Selected Customer Display
        <div className="flex items-center justify-between p-2 sm:p-3 bg-blue-50 border-2 border-blue-200 rounded-lg">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm sm:text-base shrink-0">
              {selectedCustomer.first_name?.charAt(0) || selectedCustomer.last_name?.charAt(0) || 'K'}
            </div>
            <div className="min-w-0">
              <p className="font-medium text-gray-900 text-xs sm:text-sm truncate">
                {selectedCustomer.first_name} {selectedCustomer.last_name}
              </p>
              <p className="text-[10px] sm:text-sm text-gray-500">{selectedCustomer.phone}</p>
            </div>
          </div>
          <button
            onClick={handleClearCustomer}
            className="p-1 hover:bg-blue-100 rounded-full transition-colors shrink-0"
          >
            <X className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600" />
          </button>
        </div>
      ) : (
        // Search Input
        <>
          <div className="relative">
            <Search className="absolute left-2.5 sm:left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-3.5 h-3.5 sm:w-4 sm:h-4" />
            <input
              ref={inputRef}
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setIsOpen(e.target.value.length >= 2);
                setSelectedIndex(0);
              }}
              onKeyDown={handleKeyDown}
              onFocus={() => {
                setIsOpen(true);
                loadInitialCustomers();
              }}
              placeholder="Tìm khách hàng (F4)"
              className="w-full pl-8 sm:pl-10 pr-9 sm:pr-10 py-2 sm:py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 text-xs sm:text-sm"
            />
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="absolute right-1.5 sm:right-2 top-1/2 transform -translate-y-1/2 p-1 sm:p-1.5 hover:bg-gray-100 rounded-md transition-colors"
              title="Thêm khách hàng mới"
            >
              <UserPlus className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600" />
            </button>
          </div>

          {/* Dropdown Results */}
          {isOpen && (
            <div
              ref={scrollRef}
              onScroll={handleScroll}
              className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-xl max-h-72 sm:max-h-96 overflow-y-auto"
            >
              {customers.length > 0 ? (
                <>
                  {customers.map((customer, index) => (
                    <div
                      key={customer.id}
                      onClick={() => handleSelectCustomer(customer)}
                      onMouseEnter={() => setSelectedIndex(index)}
                      className={`px-2 sm:px-4 py-2 sm:py-3 cursor-pointer border-b border-gray-100 last:border-0 transition-colors ${
                        index === selectedIndex ? 'bg-blue-50' : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold flex-shrink-0 text-xs sm:text-sm">
                          {customer.first_name?.charAt(0) || customer.last_name?.charAt(0) || 'K'}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-gray-900 truncate text-xs sm:text-sm">
                            {customer.first_name} {customer.last_name}
                          </p>
                          <p className="text-[10px] sm:text-sm text-gray-500">{customer.phone}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                  {isLoading && (
                    <div className="p-2 sm:p-3 text-center text-gray-500 text-xs sm:text-sm border-t">
                      Đang tải thêm...
                    </div>
                  )}
                </>
              ) : isLoading ? (
                <div className="p-3 sm:p-4 text-center text-gray-500 text-xs sm:text-sm">
                  Đang tìm kiếm...
                </div>
              ) : searchTerm.length >= 2 ? (
                <div className="p-3 sm:p-4 text-center">
                  <p className="text-gray-500 text-xs sm:text-sm mb-2">Không tìm thấy khách hàng</p>
                  <button
                    onClick={() => setIsAddModalOpen(true)}
                    className="text-blue-600 hover:text-blue-700 text-xs sm:text-sm font-medium flex items-center gap-1 mx-auto"
                  >
                    <UserPlus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    Thêm khách hàng mới
                  </button>
                </div>
              ) : null}
            </div>
          )}
        </>
      )}

      {/* Add Customer Modal */}
      <AddCustomerModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSuccess={(customer) => {
          const customerId = customer.id?.toString() || null;
          setSelectedCustomer(customerId, customer);
          updateTabCustomer(customerId, customer); // Update active tab's customerId and customer object
          setIsAddModalOpen(false);
          toast.success('Thêm khách hàng thành công');
        }}
      />
    </div>
  );
};
