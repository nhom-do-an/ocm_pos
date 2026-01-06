'use client';

import React from 'react';
import { ShoppingCart, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

export type TabType = 'pos' | 'orders';

interface MainTabsProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export const MainTabs: React.FC<MainTabsProps> = ({ activeTab, onTabChange }) => {
  const tabs = [
    { id: 'pos' as TabType, label: 'Bán hàng', icon: ShoppingCart },
    { id: 'orders' as TabType, label: 'Tra cứu đơn hàng', icon: FileText },
  ];

  return (
    <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-lg">
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;

        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-md font-medium text-sm transition-all duration-200',
              isActive
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-200'
            )}
          >
            <Icon className="w-4 h-4" />
            {tab.label}
          </button>
        );
      })}
    </div>
  );
};
