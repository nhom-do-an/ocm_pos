'use client';

import React from 'react';
import { Bell, User } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-gray-200 px-3 sm:px-4 md:px-6 py-3 sm:py-4">
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0 flex-1">
          <h2 className="text-base sm:text-lg md:text-xl font-semibold text-gray-900 truncate">Xin chào!</h2>
          <p className="text-xs sm:text-sm text-gray-500 hidden sm:block">Chúc bạn một ngày làm việc hiệu quả</p>
        </div>

        <div className="flex items-center gap-2 sm:gap-4 shrink-0">
          <button className="p-1.5 sm:p-2 hover:bg-gray-100 rounded-full relative">
            <Bell className="w-5 h-5 sm:w-6 sm:h-6 text-gray-600" />
            <span className="absolute top-0.5 right-0.5 sm:top-1 sm:right-1 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-red-500 rounded-full"></span>
          </button>

          <button className="flex items-center gap-2 px-2 sm:px-3 py-1.5 sm:py-2 hover:bg-gray-100 rounded-lg">
            <div className="w-7 h-7 sm:w-8 sm:h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <User className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <span className="font-medium text-gray-900 text-sm sm:text-base hidden sm:inline">Admin</span>
          </button>
        </div>
      </div>
    </header>
  );
};
