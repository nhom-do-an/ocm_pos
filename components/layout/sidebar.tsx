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
    <div className="w-64 bg-gray-900 text-white h-screen flex flex-col">
      <div className="p-6 border-b border-gray-800">
        <h1 className="text-2xl font-bold text-blue-400">OMNI POS</h1>
        <p className="text-xs text-gray-400 mt-1">Point of Sale System</p>
      </div>
      
      <nav className="flex-1 px-3 py-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-lg mb-2 transition-colors',
                isActive
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              )}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>
      
      <div className="p-4 border-t border-gray-800">
        <div className="text-xs text-gray-400">
          © 2025 OMNI POS System
        </div>
        <div className="text-xs text-gray-500 mt-1">
          Version 2.0.0
        </div>
      </div>
    </div>
  );
};
