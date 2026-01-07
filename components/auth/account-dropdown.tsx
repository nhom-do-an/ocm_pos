'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth-store';
import { User, LogOut, LogIn, ChevronDown } from 'lucide-react';

interface AccountDropdownProps {
  onLoginClick?: () => void;
}

export const AccountDropdown: React.FC<AccountDropdownProps> = ({ onLoginClick }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const { currentUser, logout } = useAuthStore();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getRoleBadge = (role: string) => {
    const badges = {
      admin: { label: 'Quản trị', color: 'bg-red-100 text-red-700' },
      manager: { label: 'Quản lý', color: 'bg-blue-100 text-blue-700' },
      cashier: { label: 'Thu ngân', color: 'bg-green-100 text-green-700' },
    };
    return badges[role as keyof typeof badges] || badges.cashier;
  };

  const handleLoginClick = () => {
    if (onLoginClick) {
      onLoginClick();
    } else {
      router.push('/login');
    }
  };

  const handleLogoutClick = () => {
    logout();
    setIsOpen(false);
    router.push('/login');
  };

  if (!currentUser) {
    return (
      <button
        onClick={handleLoginClick}
        className="flex items-center gap-2 px-3 py-2 rounded-full bg-white border-2 border-gray-300 hover:border-primary-500 hover:bg-gray-50 transition-all shadow-sm active:scale-95"
      >
        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
          <User className="w-4 h-4 text-gray-600" />
        </div>
      </button>
    );
  }


  return (
    <div className="relative" ref={dropdownRef}>
      {/* User Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-full bg-white border-2 border-gray-300 hover:border-primary-500 hover:bg-gray-50 transition-all shadow-sm"
      >

        <div className="w-8 h-8 bg-gradient-to-br from-primary-600 to-primary-700 rounded-full flex items-center justify-center text-white text-sm font-bold">
          {currentUser.name.charAt(0)}
        </div>
        <span className="text-sm font-medium text-gray-800 hidden md:block">{currentUser.name}</span>
        <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-strong z-50 animate-slide-down">
          {/* User Info */}
          <div className="p-4 border-b border-gray-200 bg-gray-50">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-600 to-primary-700 rounded-full flex items-center justify-center flex-shrink-0">

                <User className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-900 truncate">{currentUser.name}</p>
                <p className="text-sm text-gray-600 truncate">{currentUser.email}</p>

              </div>
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            <button
              onClick={handleLogoutClick}
              className="w-full flex items-center gap-3 px-4 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="font-medium">Đăng xuất</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

