'use client';

import React from 'react';
import { Plus, X } from 'lucide-react';
import { usePOSStore } from '@/store/pos-store';

export const OrderTabs: React.FC = () => {
  const { orderTabs, activeTabId, addTab, removeTab, setActiveTab } = usePOSStore();

  return (
    <div className=" flex gap-1 items-center">
      <div className="max-w-[350px] flex items-center gap-2 flex-nowrap overflow-x-auto scrollbar-hide">
        {orderTabs.map((tab) => (
          <div
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={` shrink-0 relative flex items-center gap-2 px-4 py-2.5 rounded-lg cursor-pointer transition-all duration-200 ${activeTabId === tab.id
              ? 'bg-blue-500 text-white shadow-md shadow-blue-500/30'
              : 'bg-gray-50 text-gray-700 hover:bg-gray-100 hover:shadow-sm'
              }`}

          >
            <span className="font-semibold text-sm">{tab.name}</span>
            {tab.cart.length > 0 && (
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium transition-all ${activeTabId === tab.id
                ? 'bg-white text-blue-600 shadow-sm'
                : 'bg-blue-600 text-white'
                }`}>
                {tab.cart.length}
              </span>
            )}
            {orderTabs.length > 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  removeTab(tab.id);
                }}
                className={`ml-1 hover:scale-110 rounded-full p-1 transition-all ${activeTabId === tab.id
                  ? 'text-white hover:bg-white/20'
                  : 'text-gray-500 hover:bg-gray-200'
                  }`}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        ))}


      </div>
      <button
        onClick={addTab}
        className="shrink-0 flex justify-center items-center text-blue-600 bg-blue-50 hover:bg-blue-100 rounded-full transition-all duration-200 hover:shadow-sm font-medium text-sm size-8 cursor-pointer"
        title="Thêm đơn mới"
      >
        <Plus className="w-4 h-4" />
      </button>
    </div>

  );
};
