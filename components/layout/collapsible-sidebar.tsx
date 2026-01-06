'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, ShoppingCart, Warehouse, ChevronRight, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MainTabs, TabType } from './main-tabs';

const navItems = [
  { href: '/pos', label: 'Bán hàng', icon: ShoppingCart },
  { href: '/orders', label: 'Đơn hàng', icon: LayoutDashboard },
  { href: '/inventory', label: 'Tồn kho', icon: Warehouse },
];

interface CollapsibleSidebarProps {
  activeTab?: TabType;
  onTabChange?: (tab: TabType) => void;
}

export const CollapsibleSidebar: React.FC<CollapsibleSidebarProps> = ({
  activeTab,
  onTabChange
}) => {
  const pathname = usePathname();
  const [isHovered, setIsHovered] = useState(false);

  return (
    <>
      {/* Hover trigger area */}
      <div
        className="fixed left-0 top-0 w-4 h-full z-40"
        onMouseEnter={() => setIsHovered(true)}
      />

      {/* Sidebar */}
      <div
        className={cn(
          'fixed left-0 h-full bg-gradient-to-b from-gray-900 to-gray-800 text-white shadow-2xl transition-transform duration-300 ease-in-out z-50',
          isHovered ? 'translate-x-0' : '-translate-x-full'
        )}
        style={{ width: '256px', top: '72px' }}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Main Tabs Section */}
        {activeTab && onTabChange && (
          <div className="p-4 border-b border-gray-700">
            <MainTabs activeTab={activeTab} onTabChange={onTabChange} />
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 px-3 py-6 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all duration-200',
                  isActive
                    ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/50 scale-105'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white hover:scale-102'
                )}
              >
                <Icon
                  className={cn(
                    'w-5 h-5 transition-transform',
                    isActive && 'scale-110'
                  )}
                />
                <span className="text-sm">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-700 bg-gray-900/50">
          <div className="text-xs text-gray-400">© 2025 OMNI POS System</div>
          <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            Version 2.0.0
          </div>
        </div>

        {/* Collapse indicator */}
        <div className="absolute right-0 top-1/2 transform translate-x-full -translate-y-1/2">
          <div className="bg-gray-800 rounded-r-lg p-1 shadow-lg">
            <ChevronRight className="w-4 h-4 text-gray-400" />
          </div>
        </div>
      </div>
    </>
  );
};
