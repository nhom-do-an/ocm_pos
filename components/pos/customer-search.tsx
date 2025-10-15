'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Search, UserPlus, X } from 'lucide-react';
import { usePOSStore } from '@/store/pos-store';
import { Customer } from '@/types';
import { AddCustomerModal } from '@/components/customer/add-customer-modal';

export const CustomerSearch: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [showAddCustomerModal, setShowAddCustomerModal] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const { customers, selectedCustomerId, setCustomer, addCustomer } = usePOSStore();
  const selectedCustomer = customers.find(c => c.id === selectedCustomerId);

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm)
  );

  const handleAddNewCustomer = () => {
    setShowAddCustomerModal(true);
    setIsOpen(false);
  };

  const handleCustomerAdded = (newCustomer: Customer) => {
    addCustomer(newCustomer);
    setCustomer(newCustomer.id);
    setSearchTerm('');
  };

  // F4 shortcut
  useEffect(() => {
    const handleGlobalKeydown = (e: KeyboardEvent) => {
      if (e.key === 'F4') {
        e.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
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
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <input
          ref={inputRef}
          type="text"
          value={selectedCustomer ? '' : searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => !selectedCustomer && setIsOpen(true)}
          placeholder={selectedCustomer ? '' : 'Tìm kiếm khách hàng'}
          className="w-full pl-10 pr-16 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        />
        {selectedCustomer ? (
          <div className="absolute left-10 top-1/2 transform -translate-y-1/2 flex items-center gap-2">
            <div>
              <p className="text-sm font-medium text-gray-900">{selectedCustomer.name}</p>
              <p className="text-xs text-gray-500">{selectedCustomer.phone}</p>
            </div>
            <button
              onClick={() => {
                setCustomer(undefined);
                setSearchTerm('');
              }}
              className="text-gray-400 hover:text-red-600 ml-2"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-xs text-gray-400 font-medium">
            F4
          </span>
        )}
      </div>

      {/* Add New Customer Button */}
      {!selectedCustomer && (
        <button
          onClick={handleAddNewCustomer}
          className="w-full mt-2 flex items-center justify-center gap-2 px-3 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors"
        >
          <UserPlus className="w-4 h-4" />
          <span>Thêm khách hàng mới</span>
        </button>
      )}

      {/* Dropdown Results */}
      {isOpen && !selectedCustomer && (
        <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-80 overflow-hidden">
          <div className="max-h-80 overflow-y-auto">
            {filteredCustomers.map(customer => (
              <div
                key={customer.id}
                onClick={() => {
                  setCustomer(customer.id);
                  setIsOpen(false);
                  setSearchTerm('');
                }}
                className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-0"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-sm text-gray-900">{customer.name}</p>
                    <p className="text-xs text-gray-500">{customer.phone}</p>
                  </div>
                  {customer.points !== undefined && customer.points > 0 && (
                    <span className="text-xs text-blue-600 font-medium">
                      {customer.points} điểm
                    </span>
                  )}
                </div>
              </div>
            ))}
            
            {filteredCustomers.length === 0 && searchTerm && (
              <div className="p-4 text-center text-gray-500 text-sm">
                Không tìm thấy khách hàng
              </div>
            )}
          </div>
        </div>
      )}

      {/* Add Customer Modal */}
      <AddCustomerModal 
        isOpen={showAddCustomerModal}
        onClose={() => setShowAddCustomerModal(false)}
        onCustomerAdded={handleCustomerAdded}
      />
    </div>
  );
};
