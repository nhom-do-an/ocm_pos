'use client';

import React, { useState } from 'react';
import { Search, UserPlus, X } from 'lucide-react';
import { usePOSStore } from '@/store/pos-store';
import { Customer } from '@/types';

export const CustomerSearch: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { customers, selectedCustomerId, setCustomer, addCustomer } = usePOSStore();
  const selectedCustomer = customers.find(c => c.id === selectedCustomerId);

  const filteredCustomers = customers.filter(customer =>
    customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    customer.phone.includes(searchTerm)
  );

  const handleAddNewCustomer = () => {
    const name = prompt('Tên khách hàng:');
    const phone = prompt('Số điện thoại:');
    
    if (name && phone) {
      const newCustomer: Customer = {
        id: `CUS-${Date.now()}`,
        name,
        phone,
        totalPurchases: 0,
        points: 0,
        createdAt: new Date(),
      };
      addCustomer(newCustomer);
      setCustomer(newCustomer.id);
      setIsOpen(false);
    }
  };

  return (
    <div className="relative">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50"
      >
        <Search className="w-4 h-4 text-gray-400" />
        {selectedCustomer ? (
          <div className="flex-1">
            <p className="font-medium text-sm">{selectedCustomer.name}</p>
            <p className="text-xs text-gray-500">{selectedCustomer.phone}</p>
          </div>
        ) : (
          <span className="text-gray-500 text-sm">Chọn khách hàng...</span>
        )}
        {selectedCustomer && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setCustomer(undefined);
            }}
            className="text-gray-400 hover:text-red-600"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {isOpen && (
        <div className="absolute z-50 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-80 overflow-hidden">
          <div className="p-3 border-b">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Tìm theo tên hoặc SĐT..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              autoFocus
            />
          </div>
          
          <div className="max-h-60 overflow-y-auto">
            {filteredCustomers.map(customer => (
              <div
                key={customer.id}
                onClick={() => {
                  setCustomer(customer.id);
                  setIsOpen(false);
                  setSearchTerm('');
                }}
                className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100"
              >
                <p className="font-medium">{customer.name}</p>
                <p className="text-sm text-gray-500">{customer.phone}</p>
                {customer.points !== undefined && (
                  <p className="text-xs text-blue-600">Điểm: {customer.points}</p>
                )}
              </div>
            ))}
            
            {filteredCustomers.length === 0 && searchTerm && (
              <div className="p-4 text-center text-gray-500">
                Không tìm thấy khách hàng
              </div>
            )}
          </div>
          
          <div className="p-3 border-t bg-gray-50">
            <button
              onClick={handleAddNewCustomer}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              <UserPlus className="w-4 h-4" />
              <span className="text-sm font-medium">Thêm khách hàng mới</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
