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
          'fixed left-0 h-full bg-gradient-to-b from-gray-900 to-gray-800 text-white shadow-2xl transition-transform duration-300 ease-in-out z-50 w-[200px] sm:w-[240px] md:w-[256px]',
          isHovered ? 'translate-x-0' : '-translate-x-full'
        )}
        style={{ top: '72px' }}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Main Tabs Section */}
        {activeTab && onTabChange && (
          <div className="p-4 border-b border-gray-700">
            <MainTabs activeTab={activeTab} onTabChange={onTabChange} />
          </div>
        )}

        {/* Navigation */}
        <nav className="flex-1 px-2 sm:px-3 py-4 sm:py-6 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl font-medium transition-all duration-200',
                  isActive
                    ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white shadow-lg shadow-blue-500/50 scale-105'
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white hover:scale-102'
                )}
              >
                <Icon
                  className={cn(
                    'w-4 h-4 sm:w-5 sm:h-5 transition-transform',
                    isActive && 'scale-110'
                  )}
                />
                <span className="text-xs sm:text-sm">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 left-0 right-0 p-3 sm:p-4 border-t border-gray-700 bg-gray-900/50">
          <div className="text-[10px] sm:text-xs text-gray-400">© 2025 OMNI POS System</div>
          <div className="text-[10px] sm:text-xs text-gray-500 mt-1 flex items-center gap-1">
            <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-500 rounded-full animate-pulse"></span>
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
