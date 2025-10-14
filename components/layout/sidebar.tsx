'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, ShoppingCart, Warehouse } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/pos', label: 'Bán hàng', icon: ShoppingCart },
  { href: '/orders', label: 'Đơn hàng', icon: LayoutDashboard },
  { href: '/inventory', label: 'Tồn kho', icon: Warehouse },
];

export const Sidebar: React.FC = () => {
  const pathname = usePathname();

  return (
    <div className="w-64 bg-gradient-to-b from-gray-900 to-gray-800 text-white h-screen flex flex-col shadow-strong">
      {/* Logo Section */}
      <div className="p-6 border-b border-gray-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg">
            <span className="text-white font-bold text-xl">O</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-white">OMNI POS</h1>
            <p className="text-xs text-gray-400">Point of Sale</p>
          </div>
        </div>
      </div>
      
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
              <Icon className={cn(
                "w-5 h-5 transition-transform",
                isActive && "scale-110"
              )} />
              <span className="text-sm">{item.label}</span>
            </Link>
          );
        })}
      </nav>
      
      {/* Footer */}
      <div className="p-4 border-t border-gray-700 bg-gray-900/50">
        <div className="text-xs text-gray-400">
          © 2025 OMNI POS System
        </div>
        <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
          <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
          Version 2.0.0
        </div>
      </div>
    </div>
  );
};
