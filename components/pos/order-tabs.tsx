'use client';

import React from 'react';
import { Plus, X } from 'lucide-react';
import { usePOSStore } from '@/store/pos-store';

export const OrderTabs: React.FC = () => {
  const { orderTabs, activeTabId, addTab, removeTab, setActiveTab } = usePOSStore();

  return (
    <div className="flex items-center gap-2 border-b border-gray-200 bg-white px-4">
      {orderTabs.map((tab) => (
        <div
          key={tab.id}
          className={`relative flex items-center gap-2 px-4 py-3 cursor-pointer transition-colors border-b-2 ${
            activeTabId === tab.id
              ? 'border-blue-600 bg-blue-50 text-blue-700'
              : 'border-transparent hover:bg-gray-50'
          }`}
          onClick={() => setActiveTab(tab.id)}
        >
          <span className="font-medium">{tab.name}</span>
          {tab.cart.length > 0 && (
            <span className="bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {tab.cart.length}
            </span>
          )}
          {orderTabs.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                removeTab(tab.id);
              }}
              className="ml-2 text-gray-400 hover:text-red-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      ))}
      
      <button
        onClick={addTab}
        className="flex items-center gap-1 px-3 py-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
      >
        <Plus className="w-4 h-4" />
        <span className="text-sm font-medium">Thêm đơn</span>
      </button>
    </div>
  );
};
